/* ==========================================================================
   1. CANLI API BAĞLANTISI & CANLILAR
   ========================================================================== */
const API_BASE = "https://dearfish.onrender.com/api/Tanks";

const SPECIES_CONFIG = [
    { id: 1, name: "Palyaço", src: "assets/fish-1.png", type: "swim" },
    { id: 2, name: "Mavi Balık", src: "assets/fish-2.png", type: "swim" },
    { id: 3, name: "Çizgili", src: "assets/fish-3.png", type: "swim" },
    { id: 4, name: "Pembe", src: "assets/fish-4.png", type: "swim" },
    { id: 5, name: "Koi", src: "assets/fish-5.png", type: "swim" },
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

const infoModal = document.getElementById("infoModal");
const createModal = document.getElementById("createModal");
const loginModal = document.getElementById("loginModal");
const fishModal = document.getElementById("fishModal");
const readModal = document.getElementById("readModal");

const infoButton = document.getElementById("infoButton");
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
   3. VERİ ÇEKME & YÜKLEME
   ========================================================================== */
async function loadTank() {
    if (!currentTankCode) {
        tankTitle.innerText = "Pixel Mesaj Akvaryumu";
        tankDesc.innerText = "Kendi akvaryumunu kurup sevdiklerinle paylaşabilir veya giriş yapabilirsin.";
        fishCounter.innerText = "0 / 8 Canlı Bırakıldı";
        tankStatusTag.innerText = "Akvaryum Seçilmedi";
        currentTank = { fishes: [] };
        renderTank();
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/${currentTankCode}`);
        if (!res.ok) throw new Error();

        currentTank = await res.json();
        tankTitle.innerText = currentTank.title;
        tankDesc.innerText = `Akvaryum Kodu: ${currentTank.code} - Sağdaki torbadan canlı seçip gizli notunu bırakabilirsin!`;
        renderTank();
    } catch (err) {
        alert("Akvaryum bulunamadı veya sunucu uyku modundan uyanıyor olabilir. Lütfen birkaç saniye sonra tekrar deneyin.");
    }
}

/* ==========================================================================
   4. EKRANA ÇİZME (RENDER)
   ========================================================================== */
function renderTank() {
    if (!currentTank) return;
    fishCanvas.innerHTML = "";

    const count = currentTank.fishes ? currentTank.fishes.length : 0;
    fishCounter.innerText = `${count} / 8 Canlı Bırakıldı`;

    if (count >= 8) {
        tankStatusTag.innerText = isOwnerAuthenticated ? "🔓 Notlar Açık" : "🔒 8 Canlı Doldu (Şifreyle Aç)";
        tankStatusTag.classList.add("unlocked");
    } else {
        tankStatusTag.innerText = `🔒 Notlar Kilitli (${8 - count} Canlı Kaldı)`;
        tankStatusTag.classList.remove("unlocked");
    }

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

    if (currentTank.fishes) {
        currentTank.fishes.forEach(fish => {
            const meta = SPECIES_CONFIG.find(s => s.id === fish.fishId);
            if (!meta) return;

            const el = document.createElement("div");
            el.className = `fish-sprite fish-type-${meta.type}`;
            el.id = `fish-node-${fish.id}`;

            // Denizyıldızı tam akvaryum kumunun üzerine sabitlenir
            if (meta.type === "starfish") {
                el.style.left = `45%`;
                el.style.top = `83%`;
            } else {
                el.style.left = `${fish.x}%`;
                el.style.top = `${fish.y}%`;
            }

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
                    alert("🔒 Bu balıktaki notu sadece akvaryum sahibi giriş yaparak görebilir!");
                } else if (currentTank.fishes.length < 8) {
                    alert("🔒 Notlar henüz kilitli! 8 canlı dolunca açılacak.");
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

            // Denizyıldızı akvaryum tabanında durur, yüzmez
            if (meta.type === "starfish") return;

            // Denizatı salınımı
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

            if (fish.y > 60 || fish.y < 16) fish.speedY = -fish.speedY;

            el.style.left = `${fish.x}%`;
            el.style.top = `${fish.y}%`;
        });
    }
    requestAnimationFrame(movementLoop);
}

/* ==========================================================================
   6. ETKİLEŞİMLER & API ÇAĞRILARI
   ========================================================================== */
infoButton.addEventListener("click", () => infoModal.classList.add("show"));
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
        window.location.search = `?tank=${data.tankCode}`;
    } catch (err) {
        alert("Sunucuya bağlanılamadı! Render sunucusu ilk istekte uyanıyor olabilir (yaklaşık 30-40 sn), lütfen bir kez daha deneyin.");
    }
});

loginButton.addEventListener("click", () => loginModal.classList.add("show"));

loginAquariumSubmit.addEventListener("click", async () => {
    const name = document.getElementById("loginTankName").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!name || !password) return alert("Lütfen akvaryum adınızı ve şifrenizi girin!");

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

        history.pushState(null, "", `?tank=${data.code}`);
        renderTank();

        if (data.isFull) {
            alert("Giriş başarılı! 8 balığın tamamlanmış, canlılara tıklayarak notlarını okuyabilirsin!");
        } else {
            alert(`Giriş başarılı! Şu an ${data.fishes.length}/8 canlı var. 8 canlı dolduğunda notlar açılacak.`);
        }
    } catch (err) {
        alert("Giriş yapılamadı!");
    }
});

addFishButton.addEventListener("click", () => {
    if (!currentTankCode) return alert("Önce bir akvaryum oluşturmalı veya bir linke girmelisin!");
    if (currentTank && currentTank.fishes && currentTank.fishes.length >= 8) {
        return alert("Akvaryum tamamen dolmuş! (8/8)");
    }
    selectedFishId = null;
    fishOptions.forEach(b => b.classList.remove("selected"));
    fishModal.classList.add("show");
});

dropFishSubmit.addEventListener("click", async () => {
    if (!selectedFishId) return alert("Lütfen bir canlı türü seçin!");
    const sender = document.getElementById("fishSenderName").value.trim();
    const note = document.getElementById("fishNote").value.trim();

    if (!sender || !note) return alert("Lütfen adınızı ve notunuzu yazın!");

    const meta = SPECIES_CONFIG.find(s => s.id === selectedFishId);
    let startX = Math.floor(Math.random() * 40) + 25;
    let startY = Math.floor(Math.random() * 25) + 20;

    if (meta.type === "starfish") { startX = 45; startY = 83; }
    else if (meta.type === "seahorse") { startX = 22; startY = 46; }

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
        loadTank();
    } catch (err) {
        alert("Balık bırakılamadı!");
    }
});

shareTankButton.addEventListener("click", () => {
    if (!currentTankCode) return alert("Paylaşmak için önce bir akvaryum oluşturmalısın!");
    navigator.clipboard.writeText(window.location.href);
    alert("Akvaryum bağlantın kopyalandı! Sevdiklerine göndererek not bırakmalarını isteyebilirsin.");
});

fishOptions.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("disabled")) return;
        fishOptions.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedFishId = parseInt(btn.dataset.id);
    });
});

closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById(btn.dataset.close).classList.remove("show");
    });
});

[infoModal, createModal, loginModal, fishModal, readModal].forEach(m => {
    m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show"); });
});

loadTank();
requestAnimationFrame(movementLoop);