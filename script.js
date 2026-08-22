const META = 5000;
const PIX_KEY = "537.942.438-46";
const STORAGE_KEY = "chrisBielArrecadado";

// Load saved amount for this browser.
let arrecadado = Number(localStorage.getItem(STORAGE_KEY) || 0);

function brl(value) {
  return Number(value).toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}
function updateGoal(value) {
  arrecadado = Math.max(0, Math.min(Number(value) || 0, META));
  localStorage.setItem(STORAGE_KEY, String(arrecadado));
  const pct = Math.round((arrecadado / META) * 100);
  document.getElementById("raised").textContent = brl(arrecadado);
  document.getElementById("progress").style.width = pct + "%";
  document.getElementById("percent").textContent = pct + "%";
  document.getElementById("remaining").textContent =
    arrecadado >= META ? "Meta alcançada! 🎉" : "Faltam " + brl(META - arrecadado);
}
updateGoal(arrecadado);

// Gift modals.
const giftModal = document.getElementById("giftModal");
document.querySelectorAll(".gift-card button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = btn.dataset.title;
    document.getElementById("modalValue").textContent =
      btn.dataset.value === "livre" ? "Você escolhe o valor" : brl(btn.dataset.value);
    giftModal.classList.add("show");
    document.body.classList.add("modal-open");
  });
});

function closeModals() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));
  document.body.classList.remove("modal-open");
}
document.querySelectorAll("[data-close]").forEach(x => x.addEventListener("click", closeModals));
document.getElementById("modalCopy").addEventListener("click", async e => {
  await navigator.clipboard.writeText(PIX_KEY);
  e.target.textContent = "✅ Pix copiado!";
  setTimeout(() => e.target.textContent = "📋 Copiar chave Pix", 2000);
});
document.getElementById("copyPix").addEventListener("click", async e => {
  await navigator.clipboard.writeText(PIX_KEY);
  e.target.textContent = "✅ Chave copiada!";
  setTimeout(() => e.target.textContent = "📋 Copiar chave Pix", 2000);
});

// Countdown to 10/10/2026 at 14:00 (local time).
const eventDate = new Date("2026-10-10T14:00:00");
function countdown() {
  const diff = Math.max(0, eventDate - new Date());
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  document.getElementById("days").textContent = d;
  document.getElementById("hours").textContent = String(h).padStart(2,"0");
  document.getElementById("minutes").textContent = String(m).padStart(2,"0");
  document.getElementById("seconds").textContent = String(sec).padStart(2,"0");
}
countdown(); setInterval(countdown, 1000);

// Simple local host dashboard. This is NOT a secure server-side login.
const adminModal = document.getElementById("adminModal");
document.getElementById("adminBtn").addEventListener("click", () => {
  const pin = prompt("Digite a senha dos anfitriões:");
  if (pin === "geladeira2026") {
    document.getElementById("adminValue").value = arrecadado;
    adminModal.classList.add("show");
    document.body.classList.add("modal-open");
  } else if (pin !== null) {
    alert("Senha incorreta.");
  }
});
document.querySelectorAll("[data-close-admin]").forEach(x => x.addEventListener("click", closeModals));
document.getElementById("saveAdmin").addEventListener("click", () => {
  updateGoal(document.getElementById("adminValue").value);
  closeModals();
});
document.getElementById("resetAdmin").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja zerar a arrecadação neste navegador?")) {
    updateGoal(0);
    closeModals();
  }
});

document.addEventListener("keydown", e => { if (e.key === "Escape") closeModals(); });
