import {
    database,
    ref,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "./firebase.js";

import {
    get,
    remove
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const auth = getAuth();

const ADMIN_UID = "6ILINeHbB8Swm4MLjrONxVsZ6Y23";

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");
const refreshBtn = document.getElementById("refreshBtn");

const totalCount = document.getElementById("totalCount");
const submissionsList = document.getElementById("submissionsList");
const statusMessage = document.getElementById("statusMessage");


// ------------------------------
// ADMIN LOGIN
// ------------------------------

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginError.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in... 💗";

    try {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (result.user.uid !== ADMIN_UID) {
            await signOut(auth);

            loginError.textContent =
                "You are not authorized to access this dashboard.";

            return;
        }

        loginForm.reset();

    } catch (error) {
        console.error("Login error:", error);

        loginError.textContent =
            "Login failed. Please check your email and password.";

    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login to Dashboard 💖";
    }
});


// ------------------------------
// AUTH STATE
// ------------------------------

onAuthStateChanged(auth, async (user) => {
    if (user && user.uid === ADMIN_UID) {
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");

        await loadSubmissions();

    } else {
        loginSection.classList.remove("hidden");
        dashboardSection.classList.add("hidden");
    }
});


// ------------------------------
// LOAD SUBMISSIONS
// ------------------------------

async function loadSubmissions() {
    submissionsList.replaceChildren();

    statusMessage.textContent = "Loading submissions... 💗";

    try {
        const snapshot = await get(
            ref(database, "dateSubmissions")
        );

        if (!snapshot.exists()) {
            totalCount.textContent = "0";

            const empty = document.createElement("div");
            empty.className = "empty-state";
            empty.textContent = "No date submissions yet. 💌";

            submissionsList.appendChild(empty);
            statusMessage.textContent = "";

            return;
        }

        const submissions = snapshot.val();

        const entries = Object.entries(submissions).sort(
            (a, b) =>
                (Number(b[1].submittedAt) || 0) -
                (Number(a[1].submittedAt) || 0)
        );

        totalCount.textContent = String(entries.length);

        entries.forEach(([id, item], index) => {
            const card = document.createElement("article");
            card.className = "submission-card";

            const title = document.createElement("h3");
            title.textContent = `💌 Submission #${index + 1}`;

            card.appendChild(title);

            const details = [
                ["🍕 Food", item.food],
                ["📍 Place", item.place],
                ["📅 Date", formatDate(item.date)],
                ["🕒 Time", item.time],
                [
                    "💌 Special request",
                    item.message || "Nothing extra ❤️"
                ],
                ["🕓 Submitted", formatTimestamp(item.submittedAt)]
            ];

            details.forEach(([label, value]) => {
                const p = document.createElement("p");
                const strong = document.createElement("strong");

                strong.textContent = label + ": ";

                p.appendChild(strong);
                p.appendChild(
                    document.createTextNode(String(value ?? "—"))
                );

                card.appendChild(p);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Delete Submission 🗑️";

            deleteBtn.addEventListener("click", async () => {
                const confirmed = confirm(
                    "Are you sure you want to delete this submission?"
                );

                if (!confirmed) return;

                deleteBtn.disabled = true;

                try {
                    await remove(
                        ref(database, `dateSubmissions/${id}`)
                    );

                    await loadSubmissions();

                } catch (error) {
                    console.error("Delete error:", error);

                    alert(
                        "Could not delete this submission. Please check your database rules."
                    );

                    deleteBtn.disabled = false;
                }
            });

            card.appendChild(deleteBtn);
            submissionsList.appendChild(card);
        });

        statusMessage.textContent =
            `Showing ${entries.length} submission(s). ❤️`;

    } catch (error) {
        console.error("Loading submissions failed:", error);

        statusMessage.textContent =
            "Could not load submissions. Check your login and Firebase Database Rules.";
    }
}


// ------------------------------
// DATE FORMATTING
// ------------------------------

function formatDate(value) {
    if (!value) return "—";

    const parts = String(value).split("-");

    if (parts.length !== 3) return String(value);

    const [year, month, day] = parts.map(Number);

    const date = new Date(year, month - 1, day);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


function formatTimestamp(value) {
    if (typeof value !== "number") return "Not available";

    return new Date(value).toLocaleString();
}


// ------------------------------
// REFRESH
// ------------------------------

refreshBtn.addEventListener("click", loadSubmissions);


// ------------------------------
// LOGOUT
// ------------------------------

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
});