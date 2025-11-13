// Random User App – uses fetch() to get data and render a user card
// API docs: https://randomuser.me/ (no auth, HTTPS, CORS enabled)

const $ = (sel) => document.querySelector(sel);
const btn = $("#generate");
const gender = $("#gender");
const nat = $("#nat");
const statusEl = $("#status");
const card = $("#card");
const avatar = $("#avatar");
const nameEl = $("#name");
const emailEl = $("#email");
const phoneEl = $("#phone");
const locationEl = $("#location");
const ageEl = $("#age");

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function showCard(show) {
  if (show) {
    card.classList.remove("hidden");
    card.setAttribute("aria-hidden", "false");
  } else {
    card.classList.add("hidden");
    card.setAttribute("aria-hidden", "true");
  }
}

async function fetchUser() {
  try {
    showCard(false);
    setStatus("Loading user…");

    const params = new URLSearchParams();
    if (gender.value) params.set("gender", gender.value);
    if (nat.value) params.set("nat", nat.value);
    const url = `https://randomuser.me/api/?${params.toString()}`;

    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const u = data.results[0];

    // Populate UI
    avatar.src = u.picture.large;
    const fullName = `${cap(u.name.title)} ${cap(u.name.first)} ${cap(u.name.last)}`.trim();
    nameEl.textContent = fullName;
    emailEl.textContent = u.email;
    emailEl.href = `mailto:${u.email}`;
    phoneEl.textContent = u.phone || u.cell || "—";
    locationEl.textContent = `${cap(u.location.city)}, ${cap(u.location.country)}`;
    ageEl.textContent = u.dob?.age ?? "—";

    setStatus("Done ✓");
    showCard(true);
  } catch (err) {
    console.error(err);
    setStatus("Failed to load user. Please try again.");
    showCard(false);
  }
}

function cap(s){ return (s||"").toString().charAt(0).toUpperCase() + (s||"").toString().slice(1); }

btn.addEventListener("click", fetchUser);

// Auto-load one user on first visit for nicer UX
window.addEventListener("DOMContentLoaded", fetchUser);
