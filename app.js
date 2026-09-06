/* ==========================================================================
   1. API ADRESİ & CANLILAR
   ========================================================================== */
const API_BASE = "http://localhost:5294/api/Tanks";

const SPECIES_CONFIG = [
    { id: 1, name: "Palyaço Balığı", src: "assets/fish-1.png", type: "swim" },
    { id: 2, name: "Mavi Balık", src: "assets/fish-2.png", type: "swim" },
    { id: 3, name: "Çizgili Balık", src: "assets/fish-3.png", type: "swim" },
    { id: 4, name: "Pembe Balık", src: "assets/fish-4.png", type: "swim" },
    { id: 5, name: "Koi Balığı", src: "assets/fish-5.png", type: "swim" },
    { id: 6, name: "Mor Melek", src: "assets/fish-6.png", type: "swim" },
    { id: 7, name: "Denizatı", src: "assets/fish-7.png", type: "seahorse" },
    { id: 8, name: "Denizyıldızı", src: "assets/fish-8.png", type: "starfish" }
];

/* ==========================================================================
   2. DURUM DEĞİŞKENLERİ
   ========================================================================== */
const urlParams = new URLSearchParams(window.location.search);
let currentTankCode = urlParams.get("tank");

let currentTank = null;
let isOwnerAuthenticated = false;
let selectedFishId = null;

// DOM Elemanları
const fishCanvas = document.getElementById("fishCanvas");
const fishCounter = document.getElementById("fishCounter");
const tankStatusTag = document.getElementById("tankStatusTag");
const tankTitle = document.getElementById("tankTitle");
const tankDesc = document.getElementById("tankDesc");

const createModal = document.getElementById("createModal");
const loginModal = document.getElementById("loginModal");
const fishModal = document.getElementById("fishModal");
const readModal = document.getElementById("readModal");

const createButton = document.getElementById("createButton");
const loginButton = document.getElementById("loginButton");
const addFishButton = document.getElementById("addFishButton");
const shareTankButton = document.getElementById("shareTankButton");
const createAquariumSubmit = document.getElementById("createAquariumSubmit");
const loginAquariumSubmit = document.getElementById("loginAquariumSubmit");
const dropFishSubmit = document.getElementById("dropFishSubmit");
const closeButtons = document.querySelectorAll("[data-close]");
const fishOptions = document.querySelectorAll(".fish-option");

/* ==========================================================================
   3. VERİ YÜKLEME & GÖSTERİM MANTIĞI
   ========================================================================== */
async function loadTank() {
    // Eğer linkte kod YOKSA (yani kullanıcı ana sayfaya düz girdiyse)
    if (!currentTankCode) {
        tankTitle.innerText = "Pixel Mesaj Akvaryumu";
        tankDesc.innerText = "Kendi akvaryumunu oluşturup sevdiklerinle paylaşabilir ya da mevcut akvaryumuna giriş yapabilirsin.";
        fishCounter.innerText = "0 / 8 Canlı Bırakıldı";
        tankStatusTag.innerText = "Akvaryum Seçilmedi";
        currentTank = { fishes: [] };
        renderTank();
        return;
    }

    // Linkte kod VARSA akvaryumu veritabanından çek
    try {
        const res = await fetch(`${API_BASE}/${currentTankCode}`);
        if (!res.ok) throw new Error();

        currentTank = await res.json();
        tankTitle.innerText = currentTank.title;
        tankDesc.innerText = `Akvaryumdasın. Bir balık seçip gizli notunu bırakabilirsin!`;
        renderTank();
    } catch (err) {
        alert("Akvaryum bulunamadı veya sunucu kapalı!");
        window.location.href = window.location.pathname; // Temiz ana sayfaya dön
    }
}

/* ==========================================================================
   4. EKRANA ÇİZME
   ========================================================================== */
function renderTank() {
    if (!currentTank) return;
    fishCanvas.innerHTML = "";

    const count = currentTank.fishes ? currentTank.fishes.length : 0;
    fishCounter.innerText = `${count} / 8 Canlı Bırakıldı`;

    if (count >= 8) {
        tankStatusTag.innerText = isOwnerAuthenticated ? "🔓 Notlar Açık" : "🔒 8 Canlı Doldu (Sahibi Açabilir)";
        tankStatusTag.classList.add("unlocked");
    } else {
        tankStatusTag.innerText = `🔒 Notlar Kilitli (${8 - count} Canlı Kaldı)`;
        tankStatusTag.classList.remove("unlocked");
    }

    // Kullanılmış balıkları seçim ızgarasında kapat
    const usedFishIds = currentTank.fishes ? currentTank.fishes.map(f => f.fishId) : [];
    fishOptions.forEach(opt => {
        const id = parseInt(opt.dataset.id);
        if (usedFishIds.includes(id)) {
            opt.classList.add("disabled");
            opt.classList.remove("selected");
        } else {
            opt.classList.remove("disabled");
        }
    });

    // Balıkları sahneye bas
    if (currentTank.fishes) {
        currentTank.fishes.forEach(fish => {
            const meta = SPECIES_CONFIG.find(s => s.id === fish.fishId);
            if (!meta) return;

            const el = document.createElement("div");
            el.className = `fish-sprite fish-type-${meta.type}`;
            el.id = `fish-node-${fish.id}`;
            el.style.left = `${fish.x}%`;
            el.style.top = `${fish.y}%`;

            if (!fish.speedX) {
                fish.speedX = 0.035 + Math.random() * 0.02;
                fish.speedY = (Math.random() - 0.5) * 0.015;
                fish.dirX = Math.random() > 0.5 ? 1 : -1;
            }

            const img = document.createElement("img");
            img.src = meta.src;
            img.alt = fish.sender;
            el.appendChild(img);

            // Balığa Tıklama
            el.addEventListener("click", () => {
                if (!isOwnerAuthenticated) {
                    alert("🔒 Bu balıktaki notu sadece akvaryumun sahibi şifresiyle giriş yaparak okuyabilir!");
                } else if (currentTank.fishes.length < 8) {
                    alert("🔒 Notlar henüz kilitli! 8 canlı tamamlandığında okunabilir olacak.");
                } else {
                    document.getElementById("readSenderName").innerText = `Kimden: ${fish.sender}`;
                    document.getElementById("readNoteText").innerText = `"${fish.note}"`;
                    document.getElementById("readNoteDate").innerText = fish.date || "";
                    readModal.classList.add("show");
                }
            });

            fishCanvas.appendChild(el);
        });
    }
}

/* ==========================================================================
   5. SAKİN YÜZME MOTORU
   ========================================================================== */
function movementLoop() {
    if (currentTank && currentTank.fishes) {
        currentTank.fishes.forEach(fish => {
            const meta = SPECIES_CONFIG.find(s => s.id === fish.fishId);
            const el = document.getElementById(`fish-node-${fish.id}`);
            if (!el) return;

            if (meta.type === "starfish") return;

            if (meta.type === "seahorse") {
                const osc = Math.sin(Date.now() / 650) * 0.35;
                el.style.top = `${fish.y + osc}%`;
                return;
            }

            fish.x += fish.speedX * fish.dirX;
            fish.y += fish.speedY;

            if (fish.x > 76) fish.dirX = -1;
            else if (fish.x < 10) fish.dirX = 1;

            el.style.transform = fish.dirX === 1 ? "scaleX(-1)" : "scaleX(1)";

            if (fish.y > 50 || fish.y < 16) fish.speedY = -fish.speedY;

            el.style.left = `${fish.x}%`;
            el.style.top = `${fish.y}%`;
        });
    }
    requestAnimationFrame(movementLoop);
}

/* ==========================================================================
   6. ETKİLEŞİMLER & API ÇAĞRILARI
   ========================================================================== */

// 1. Akvaryum Oluştur
createButton.addEventListener("click", () => createModal.classList.add("show"));

createAquariumSubmit.addEventListener("click", async () => {
    const name = document.getElementById("aquariumName").value.trim();
    const password = document.getElementById("aquariumPassword").value.trim();

    if (!name || !password) return alert("Lütfen akvaryum adı ve şifre belirleyin!");

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: name, password: password })
        });

        if (!res.ok) {
            const err = await res.text();
            return alert(err);
        }

        const data = await res.json();
        createModal.classList.remove("show");
        // Yeni akvaryumun linkine yönlendir
        window.location.search = `?tank=${data.tankCode}`;
    } catch (err) {
        alert("Sunucuya bağlanılamadı!");
    }
});

// 2. Akvaryuma İsim ve Şifre ile Gir
loginButton.addEventListener("click", () => loginModal.classList.add("show"));

loginAquariumSubmit.addEventListener("click", async () => {
    const name = document.getElementById("loginTankName").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!name || !password) return alert("Lütfen akvaryum adı ve şifrenizi girin!");

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: name, password: password })
        });

        if (!res.ok) {
            const err = await res.text();
            return alert(err);
        }

        const data = await res.json();
        isOwnerAuthenticated = true;
        currentTank = data;
        currentTankCode = data.code;
        loginModal.classList.remove("show");

        // Adres çubuğunu da güncelle (sayfayı yenilemeden)
        history.pushState(null, "", `?tank=${data.code}`);

        renderTank();
        if (data.isFull) {
            alert("Akvaryumuna giriş yaptın! 8 balığın tamamlanmış, canlılara tıklayarak notlarını okuyabilirsin!");
        } else {
            alert(`Akvaryumuna giriş yaptın! Henüz ${data.fishes.length}/8 canlı var. Dolduğunda notların kilidi açılacak.`);
        }
    } catch (err) {
        alert("Giriş yapılamadı!");
    }
});

// 3. Canlı / Balık Bırak (Ziyaretçiler için)
addFishButton.addEventListener("click", () => {
    if (!currentTankCode) {
        return alert("Önce bir akvaryum oluşturmalı veya arkadaşının akvaryum linkine girmelisin!");
    }
    if (currentTank && currentTank.fishes && currentTank.fishes.length >= 8) {
        return alert("Bu akvaryum tamamen dolmuş! (8/8)");
    }
    selectedFishId = null;
    fishOptions.forEach(b => b.classList.remove("selected"));
    fishModal.classList.add("show");
});

dropFishSubmit.addEventListener("click", async () => {
    if (!selectedFishId) return alert("Lütfen bir canlı seçin!");
    const sender = document.getElementById("fishSenderName").value.trim();
    const note = document.getElementById("fishNote").value.trim();

    if (!sender || !note) return alert("Lütfen adınızı ve notunuzu yazın!");

    const meta = SPECIES_CONFIG.find(s => s.id === selectedFishId);
    let startX = Math.floor(Math.random() * 40) + 25;
    let startY = Math.floor(Math.random() * 20) + 20;

    if (meta.type === "starfish") { startX = 44; startY = 67; }
    else if (meta.type === "seahorse") { startX = 20; startY = 44; }

    try {
        const res = await fetch(`${API_BASE}/${currentTankCode}/fishes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fishTypeId: selectedFishId,
                senderName: sender,
                noteText: note,
                posX: startX,
                posY: startY
            })
        });

        if (!res.ok) {
            const err = await res.text();
            return alert(err);
        }

        fishModal.classList.remove("show");
        document.getElementById("fishSenderName").value = "";
        document.getElementById("fishNote").value = "";
        loadTank(); // Balığı hemen yüzdür
    } catch (err) {
        alert("Balık bırakılamadı!");
    }
});

// Paylaş Butonu
shareTankButton.addEventListener("click", () => {
    if (!currentTankCode) return alert("Paylaşmak için önce bir akvaryum oluşturmalısın!");
    navigator.clipboard.writeText(window.location.href);
    alert("Akvaryum linkin kopyalandı! Arkadaşlarına atarak sana not bırakmalarını isteyebilirsin.");
});

// Canlı Seçimi
fishOptions.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("disabled")) return;
        fishOptions.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedFishId = parseInt(btn.dataset.id);
    });
});

// Modal Kapatma
closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById(btn.dataset.close).classList.remove("show");
    });
});

[createModal, loginModal, fishModal, readModal].forEach(m => {
    m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show"); });
});

// Başlat
loadTank();
requestAnimationFrame(movementLoop);