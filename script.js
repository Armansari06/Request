const proposalPage = document.getElementById("proposalPage");
const datePage = document.getElementById("datePage");
const finalPage = document.getElementById("finalPage");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

const dateForm = document.getElementById("dateForm");
const dateSummary = document.getElementById("dateSummary");
const restartBtn = document.getElementById("restartBtn");
const heartsContainer = document.getElementById("hearts");


// ------------------------------
// FLOATING HEARTS
// ------------------------------

function createHeart() {
    const heart = document.createElement("span");

    heart.className = "heart";

    const heartTypes = ["❤️", "💕", "💗", "💖", "♥"];

    heart.textContent =
        heartTypes[Math.floor(Math.random() * heartTypes.length)];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = 14 + Math.random() * 22 + "px";
    heart.style.animationDuration = 5 + Math.random() * 5 + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 450);


// ------------------------------
// NO BUTTON MOVEMENT
// ------------------------------

let noAttempts = 0;
let lastMoveTime = 0;

const messages = [
    "Oops! 😜",
    "Pakad ke dikhao! 🙈",
    "Itni jaldi nahi! 💕",
    "Hehe, phir se try karo! 😂",
    "YES bol do na! 🥹❤️"
];

function moveNoButton(pointerX, pointerY) {
    const now = Date.now();

    // Bahut jaldi baar-baar trigger na ho
    if (now - lastMoveTime < 180) return;

    lastMoveTime = now;
    noAttempts++;

    hint.textContent =
        messages[Math.min(noAttempts - 1, messages.length - 1)];

    const rect = noBtn.getBoundingClientRect();

    // Button ko screen ke paas hi rakhna
    const padding = 12;
    const distance = 45 + Math.random() * 20;

    // Pointer se door ki direction calculate karo
    let dx = rect.left + rect.width / 2 - pointerX;
    let dy = rect.top + rect.height / 2 - pointerY;

    // Agar pointer ki direction clear na ho
    if (Math.abs(dx) + Math.abs(dy) < 1) {
        const angle = Math.random() * Math.PI * 2;

        dx = Math.cos(angle);
        dy = Math.sin(angle);
    }

    const length = Math.sqrt(dx * dx + dy * dy);

    dx /= length;
    dy /= length;

    // Thoda sa natural random movement
    let newX =
        rect.left + dx * distance + (Math.random() - 0.5) * 15;

    let newY =
        rect.top + dy * distance + (Math.random() - 0.5) * 15;

    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    // Pehli movement par current position ko preserve karo
    if (getComputedStyle(noBtn).position !== "fixed") {
        noBtn.style.position = "fixed";
        noBtn.style.margin = "0";
        noBtn.style.zIndex = "1000";
    }

    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";
}


// Desktop: cursor button ke paas aaye toh move kare
document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    if (proposalPage.classList.contains("hidden")) return;

    const rect = noBtn.getBoundingClientRect();

    // Cursor button se 25px door ho tabhi move kare
    const buffer = 25;

    const close =
        event.clientX >= rect.left - buffer &&
        event.clientX <= rect.right + buffer &&
        event.clientY >= rect.top - buffer &&
        event.clientY <= rect.bottom + buffer;

    if (close) {
        moveNoButton(event.clientX, event.clientY);
    }
});


// Mobile: touch karne ki koshish par paas hi move kare
noBtn.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
        event.preventDefault();

        moveNoButton(
            event.clientX,
            event.clientY
        );
    }
});


// ------------------------------
// YES BUTTON
// ------------------------------

yesBtn.addEventListener("click", () => {
    proposalPage.classList.add("hidden");
    datePage.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    for (let i = 0; i < 5; i++) {
        setTimeout(createHeart, i * 150);
    }
});


// ------------------------------
// DATE INPUT
// ------------------------------

const dateInput = document.getElementById("date");

const today = new Date();

dateInput.min = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");


// ------------------------------
// DATE FORM SUBMISSION
// ------------------------------

dateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const food = document.getElementById("food").value;
    const place = document.getElementById("place").value;
    const date = dateInput.value;
    const time = document.getElementById("time").value;

    const message =
        document.getElementById("message").value.trim();

    if (!food || !place || !date || !time) {
        alert("Please fill in all required fields! ❤️");
        return;
    }

    const [year, month, day] = date.split("-").map(Number);

    const formattedDate = new Date(
        year,
        month - 1,
        day
    ).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    dateSummary.replaceChildren();

    const details = [
        ["🍕 Food", food],
        ["📍 Place", place],
        ["📅 Date", formattedDate],
        ["🕒 Time", time],
        [
            "💌 Special request",
            message || "Nothing extra — just good vibes! ❤️"
        ]
    ];

    details.forEach(([label, value]) => {
        const row = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = label + ": ";

        row.appendChild(strong);
        row.appendChild(document.createTextNode(value));

        dateSummary.appendChild(row);
    });

    datePage.classList.add("hidden");
    finalPage.classList.remove("hidden");
    // Prepare date details for Instagram
const instagramUsername = "arman_ansari06";

const instagramMessage =
`💖 We have a date plan!

🍕 Food: ${food}
📍 Place: ${place}
📅 Date: ${formattedDate}
🕒 Time: ${time}

💌 Special request:
${message || "Nothing extra ❤️"}

Can't wait for our date! 🥹💕`;

// Show confirmation page first
datePage.classList.add("hidden");
finalPage.classList.remove("hidden");

// Add an Instagram button to the final page
let instagramBtn = document.getElementById("instagramBtn");

if (!instagramBtn) {
    instagramBtn = document.createElement("button");
    instagramBtn.id = "instagramBtn";
    instagramBtn.textContent = "Send Our Date Plan 💌";
    instagramBtn.className = "submit-btn";

    instagramBtn.style.marginTop = "15px";

    document.querySelector("#finalPage .card")
        .appendChild(instagramBtn);
}

instagramBtn.onclick = async () => {
    // Copy details so they can be pasted into Instagram
    try {
        await navigator.clipboard.writeText(instagramMessage);
        alert("Date details copied! Paste them into Instagram chat ❤️");
    } catch (error) {
        alert("Please copy the date details shown on the confirmation page.");
    }

    // Open your Instagram profile
    window.open(
        "https://www.instagram.com/" + instagramUsername + "/",
        "_blank"
    );
};

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 100);
    }
});


// ------------------------------
// RESTART
// ------------------------------

restartBtn.addEventListener("click", () => {
    dateForm.reset();

    noAttempts = 0;
    lastMoveTime = 0;

    noBtn.style.position = "";
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.margin = "";
    noBtn.style.zIndex = "";

    hint.textContent = "Choose wisely... 👀💕";

    finalPage.classList.add("hidden");
    datePage.classList.add("hidden");
    proposalPage.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});