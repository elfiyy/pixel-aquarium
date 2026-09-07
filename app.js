/* ==========================================================================
   1. CANLI API & ÇOKLU DİL SÖZLÜĞÜ (TR / EN)
   ========================================================================== */
const API_BASE = "https://dearfish.onrender.com/api/tanks";

const TRANSLATIONS = {
    tr: {
        whatIs: "dear fish nedir?",
        enterTank: "Akvaryumuma Gir",
        createTank: "Akvaryum Oluştur",
        defaultTitle: "dear fish",
        defaultDesc: "sevdiklerin için sakin bir su altı durağı.",
        tankCodeLabel: "Akvaryum: ",
        tankSubNotice: " ~ poşetten bir canlı seçip notunu bırakabilirsin.",
        noTankSelected: "Akvaryum Seçilmedi",
        leftBadge: "Canlı",
        notesLocked: "🔒 notlar gizli",
        notesOpen: "🔓 notlar açık",
        eightFullUnlock: "🔒 8 canlı doldu (şifreyle aç)",
        fishesLeft: "boş yer",
        dropFish: "Balık Bırak",
        dropFishSub: "gizli bir not iliştir ~",
        shareLink: "Akvaryumu Paylaş",
        guideTitle: "dear fish nedir? 🫧",
        step1Title: "Akvaryumunu Aç",
        step1Desc: "Bir ad ve sadece senin bileceğin gizli bir şifre seç.",
        step2Title: "Bağlantını İlet",
        step2Desc: "Linkini arkadaşlarına gönder, sana küçük sürprizler bıraksınlar.",
        step3Title: "Canlılar Yüzsün",
        step3Desc: "Bırakılan canlılar akvaryumda hemen yüzmeye başlar, notlar ise kilitli kalır.",
        step4Title: "8 Canlı Dolunca Oku",
        step4Desc: "Akvaryum dolunca şifrenle giriş yap ve sana yazılan her şeyi keşfet.",
        understoodBtn: "anladım, devam et ~",
        createModalTitle: "yeni bir su altı alanı 🌊",
        createModalSub: "Akvaryumuna bir isim ve notlarını koruyacak bir şifre ver.",
        tankNameLabel: "Akvaryum Adı",
        passwordLabel: "Şifre",
        createSubmitBtn: "oluştur ✦",
        creatingBtn: "hazırlanıyor...",
        loginModalTitle: "akvaryumuna giriş yap 🗝️",
        loginModalSub: "İsim ve şifreni girerek gizli notları çöz.",
        loginSubmitBtn: "giriş yap ve notları aç",
        fishModalTitle: "akvaryuma bir canlı bırak 🐠",
        fishModalSub: "Boş bir canlı seç ve akvaryum sahibine gizli bir not yaz.",
        senderLabel: "Kimden",
        noteLabel: "Gizli Notun",
        dropFishSubmitBtn: "akvaryuma bırak 🫧",
        linkCopied: "✨ Akvaryum bağlantın kopyalandı! Arkadaşlarına gönderip not bırakmalarını isteyebilirsin.",
        needCreateFirst: "Paylaşmak için önce bir akvaryum oluşturmalısın!",
        tankFullAlert: "Bu akvaryum tamamen dolmuş! (8/8)",
        fillAllFields: "Lütfen tüm alanları doldurun!",
        loginSuccessNotesOpen: "🎉 8 canlı tamamlandı! Canlılara tıklayarak sana bırakılan tüm notları okuyabilirsin.",
        loginSuccessWaiting: "Giriş yapıldı! Şu an {count}/8 canlı var. 8 canlı dolunca notlar açılacak.",
        loginFailed: "Giriş yapılamadı! İsim veya şifre hatalı.",
        onlyOwnerRead: "🔒 Bu not sadece akvaryum sahibine özeldir.",
        notesStillLocked: "🔒 Notlar henüz kilitli! 8 canlı tamamlanınca açılacak.",
        pickFishWarning: "Lütfen bir canlı seçin!",
        fillNameAndNote: "Lütfen adınızı ve notunuzu yazın!",
        fishNames: ["Palyaço", "Mavi", "Çizgili", "Pembe", "Koi", "Melek", "Denizatı", "Yıldız"]
    },
    en: {
        whatIs: "what is dear fish?",
        enterTank: "Open My Tank",
        createTank: "Create Tank",
        defaultTitle: "dear fish",
        defaultDesc: "a calm underwater corner for your loved ones.",
        tankCodeLabel: "Tank: ",
        tankSubNotice: " ~ pick a creature from the pouch to leave a secret note.",
        noTankSelected: "No Tank Selected",
        leftBadge: "Creatures",
        notesLocked: "🔒 notes locked",
        notesOpen: "🔓 notes unlocked",
        eightFullUnlock: "🔒 8 slots filled (unlock with password)",
        fishesLeft: "slots left",
        dropFish: "Drop a Fish",
        dropFishSub: "attach a secret note ~",
        shareLink: "Share Tank",
        guideTitle: "what is dear fish? 🫧",
        step1Title: "Create Your Tank",
        step1Desc: "Pick a name and a secret password to open your personal tank.",
        step2Title: "Share the Link",
        step2Desc: "Send your tank link to friends and invite them to leave a note.",
        step3Title: "Watch Them Swim",
        step3Desc: "Creatures begin swimming right away, but notes remain hidden.",
        step4Title: "Unlock at 8 Creatures",
        step4Desc: "Once full, enter your password to read everything left for you.",
        understoodBtn: "got it, let's go ~",
        createModalTitle: "a new underwater corner 🌊",
        createModalSub: "Give your tank a name and a password to keep notes private.",
        tankNameLabel: "Tank Name",
        passwordLabel: "Password",
        createSubmitBtn: "create ✦",
        creatingBtn: "setting up...",
        loginModalTitle: "access your tank 🗝️",
        loginModalSub: "Enter your tank name and password to reveal all notes.",
        loginSubmitBtn: "open and read notes",
        fishModalTitle: "drop a creature 🐠",
        fishModalSub: "Pick an available friend and write a sweet message.",
        senderLabel: "From",
        noteLabel: "Your Secret Note",
        dropFishSubmitBtn: "drop into tank 🫧",
        linkCopied: "✨ Tank link copied! Send it to your friends to collect sweet notes.",
        needCreateFirst: "Create an aquarium first before sharing!",
        tankFullAlert: "This tank is already full! (8/8)",
        fillAllFields: "Please fill out all fields!",
        loginSuccessNotesOpen: "🎉 All 8 creatures are here! Click any creature to read the notes.",
        loginSuccessWaiting: "Logged in! Currently {count}/8 creatures added. Notes will open at 8.",
        loginFailed: "Sign in failed! Check your name or password.",
        onlyOwnerRead: "🔒 Only the tank owner can read this note.",
        notesStillLocked: "🔒 Notes are still locked! They will unlock when 8 creatures are gathered.",
        pickFishWarning: "Please pick a creature first!",
        fillNameAndNote: "Please write your name and note!",
        fishNames: ["Clownfish", "Blue Tang", "Striped", "Pinky", "Koi", "Angel", "Seahorse", "Starfish"]
    }
};

let currentLang = localStorage.getItem("dearfish_lang") || (navigator.language.startsWith("tr") ? "tr" : "en");

function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

function applyLanguage() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (TRANSLATIONS[currentLang][key]) {
            el.innerText = TRANSLATIONS[currentLang][key];
        }
    });

    document.getElementById("currentLangText").innerText = currentLang === "tr" ? "EN" : "TR";

    document.querySelectorAll("[data-fish-name]").forEach(el => {
        const idx = parseInt(el.getAttribute("data-fish-name")) - 1;
        if (TRANSLATIONS[currentLang].fishNames[idx]) {
            el.innerText = TRANSLATIONS[currentLang].fishNames[idx];
        }
    });

    renderTank();
}

/* ==========================================================================
   2. TÜR AYARLARI & DEĞİŞKENLER
   ========================================================================== */
const SPECIES_CONFIG = [
    { id: 1, src: "assets/fish-1.png", type: "swim" },
    { id: 2, src: "assets/fish-2.png", type: "swim" },
    { id: 3, src: "assets/fish-3.png", type: "swim" },
    { id: 4, src: "assets/fish-4.png", type: "swim" },
    { id: 5, src: "assets/fish-5.png", type: "swim" },
    { id: 6, src: "assets/fish-6.png", type: "swim" },
    { id: 7, src: "assets/fish-7.png", type: "seahorse" },
    { id: 8, src: "assets/fish-8.png", type: "starfish" }
];

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

const langToggleBtn = document.getElementById("langToggleBtn");
const infoButton = document.getElementById("infoButton");
const createButton = document.getElementById("createButton");
const loginButton = document.getElementById("loginButton");
const addFishButton = document.getElementById("addFishButton");
const shareTankButton = document.getElementById("shareTankButton");
const createAquariumSubmit = document.getElementById("createAquariumSubmit");
const loginAquariumSubmit = document.getElementById("loginAquariumSubmit");
const dropFishSubmit = document.getElementById("dropFishSubmit");
const closeButtons = document.querySelectorAll("[data-close]");
const fishOptions = document.querySelectorAll(".fish-card-pick");

/* ==========================================================================
   3. VERİ YÜKLEME & EKRANA ÇİZME
   ========================================================================== */
async function loadTank() {
    if (!currentTankCode) {
        tankTitle.innerText = t("defaultTitle");
        tankDesc.innerText = t("defaultDesc");
        fishCounter.innerText = `0 / 8 ${t("leftBadge")}`;
        tankStatusTag.innerText = t("noTankSelected");
        currentTank = { fishes: [] };
        renderTank();
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/${currentTankCode}`);
        if (!res.ok) throw new Error();

        currentTank = await res.json();
        tankTitle.innerText = currentTank.title;
        tankDesc.innerText = `${t("tankCodeLabel")}${currentTank.code}${t("tankSubNotice")}`;
        renderTank();
    } catch (err) {
        console.error("Hata:", err);
    }
}

function renderTank() {
    if (!currentTank) return;
    fishCanvas.innerHTML = "";

    const count = currentTank.fishes ? currentTank.fishes.length : 0;
    fishCounter.innerText = `${count} / 8 ${t("leftBadge")}`;

    if (count >= 8) {
        tankStatusTag.innerText = isOwnerAuthenticated ? t("notesOpen") : t("eightFullUnlock");
        tankStatusTag.classList.add("unlocked");
    } else {
        tankStatusTag.innerText = `${t("notesLocked")} (${8 - count} ${t("fishesLeft")})`;
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

            // Denizyıldızı CSS kuralına göre kumun üzerinde sabit kalır
            if (meta.type === "starfish") {
                el.style.left = `47%`;
            } else {
                el.style.left = `${fish.x}%`;
                el.style.top = `${fish.y}%`;
            }

            // Her balığa bağımsız derinlik katmanı
            if (!fish.speedX) {
                fish.speedX = 0.025 + ((fish.fishId * 7) % 5) * 0.006;
                fish.speedY = (((fish.fishId * 13) % 7) - 3) * 0.004;
                fish.dirX = fish.fishId % 2 === 0 ? 1 : -1;
                fish.minY = 12 + ((fish.fishId * 6) % 30);
                fish.maxY = fish.minY + 22;
            }

            const img = document.createElement("img");
            img.src = meta.src;
            img.alt = fish.sender;
            el.appendChild(img);

            // Not Okuma
            el.addEventListener("click", () => {
                if (!isOwnerAuthenticated) {
                    alert(t("onlyOwnerRead"));
                } else if (currentTank.fishes.length < 8) {
                    alert(t("notesStillLocked"));
                } else {
                    document.getElementById("readSenderName").innerText = `${currentLang === "tr" ? "Kimden" : "From"}: ${fish.sender}`;
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
   4. YÜZME MOTORU
   ========================================================================== */
function movementLoop() {
    if (currentTank && currentTank.fishes) {
        currentTank.fishes.forEach(fish => {
            const meta = SPECIES_CONFIG.find(s => s.id === fish.fishId);
            const el = document.getElementById(`fish-node-${fish.id}`);
            if (!el) return;

            if (meta.type === "starfish") return;

            if (meta.type === "seahorse") {
                const osc = Math.sin(Date.now() / 700) * 0.4;
                el.style.top = `${fish.y + osc}%`;
                return;
            }

            fish.x += fish.speedX * fish.dirX;
            fish.y += fish.speedY;

            if (fish.x > 74) fish.dirX = -1;
            else if (fish.x < 10) fish.dirX = 1;

            el.style.transform = fish.dirX === 1 ? "scaleX(-1)" : "scaleX(1)";

            const minY = fish.minY || 14;
            const maxY = fish.maxY || 55;
            if (fish.y > maxY || fish.y < minY) fish.speedY = -fish.speedY;

            el.style.left = `${fish.x}%`;
            el.style.top = `${fish.y}%`;
        });
    }
    requestAnimationFrame(movementLoop);
}

/* ==========================================================================
   5. ETKİLEŞİMLER
   ========================================================================== */
langToggleBtn.addEventListener("click", () => {
    currentLang = currentLang === "tr" ? "en" : "tr";
    localStorage.setItem("dearfish_lang", currentLang);
    applyLanguage();
});

infoButton.addEventListener("click", () => infoModal.classList.add("show"));
createButton.addEventListener("click", () => createModal.classList.add("show"));

createAquariumSubmit.addEventListener("click", async () => {
    const name = document.getElementById("aquariumName").value.trim();
    const password = document.getElementById("aquariumPassword").value.trim();

    if (!name || !password) return alert(t("fillAllFields"));

    createAquariumSubmit.innerText = t("creatingBtn");
    createAquariumSubmit.disabled = true;

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: name, password: password })
        });

        if (!res.ok) {
            const err = await res.text();
            createAquariumSubmit.innerText = t("createSubmitBtn");
            createAquariumSubmit.disabled = false;
            return alert(err);
        }

        const data = await res.json();
        createModal.classList.remove("show");
        window.location.search = `?tank=${data.tankCode}`;
    } catch (err) {
        alert("Sunucu uyanıyor olabilir, lütfen tekrar deneyin.");
        createAquariumSubmit.innerText = t("createSubmitBtn");
        createAquariumSubmit.disabled = false;
    }
});

loginButton.addEventListener("click", () => loginModal.classList.add("show"));

loginAquariumSubmit.addEventListener("click", async () => {
    const name = document.getElementById("loginTankName").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!name || !password) return alert(t("fillAllFields"));

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
            alert(t("loginSuccessNotesOpen"));
        } else {
            alert(t("loginSuccessWaiting").replace("{count}", data.fishes.length));
        }
    } catch (err) {
        alert(t("loginFailed"));
    }
});

addFishButton.addEventListener("click", () => {
    if (!currentTankCode) return alert(t("needCreateFirst"));
    if (currentTank && currentTank.fishes && currentTank.fishes.length >= 8) {
        return alert(t("tankFullAlert"));
    }
    selectedFishId = null;
    fishOptions.forEach(b => b.classList.remove("selected"));
    fishModal.classList.add("show");
});

dropFishSubmit.addEventListener("click", async () => {
    if (!selectedFishId) return alert(t("pickFishWarning"));
    const sender = document.getElementById("fishSenderName").value.trim();
    const note = document.getElementById("fishNote").value.trim();

    if (!sender || !note) return alert(t("fillNameAndNote"));

    const meta = SPECIES_CONFIG.find(s => s.id === selectedFishId);

    let startX = 15 + Math.floor(Math.random() * 55);
    let startY = 14 + Math.floor(Math.random() * 38);

    if (meta.type === "starfish") { startX = 47; startY = 65; }
    else if (meta.type === "seahorse") { startX = 18; startY = 38; }

    const tempId = "temp-" + Date.now();
    currentTank.fishes.push({
        id: tempId,
        fishId: selectedFishId,
        sender: sender,
        note: note,
        date: currentLang === "tr" ? "Bugün" : "Today",
        x: startX,
        y: startY
    });

    fishModal.classList.remove("show");
    document.getElementById("fishSenderName").value = "";
    document.getElementById("fishNote").value = "";
    renderTank();

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
            alert("Hata: " + err);
            loadTank();
        }
    } catch (err) {
        console.error("Hata:", err);
    }
});

shareTankButton.addEventListener("click", () => {
    if (!currentTankCode) return alert(t("needCreateFirst"));
    navigator.clipboard.writeText(window.location.href);
    alert(t("linkCopied"));
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

applyLanguage();
loadTank();
requestAnimationFrame(movementLoop);