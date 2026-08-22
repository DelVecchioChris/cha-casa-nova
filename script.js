const PIX_KEY = "537.942.438-46";

function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

// Altere este número sempre que quiser atualizar a barra da meta.
const ARRECADADO = 0;
const META = 5000;

function updateGoal() {
  const current = Math.max(0, Math.min(ARRECADADO, META));
  const percent = Math.round((current / META) * 100);
  document.getElementById("currentValue").textContent = formatBRL(current);
  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("progressText").textContent = `${percent}% da nossa meta`;
}

const modal = document.getElementById("pixModal");
const modalTitle = document.getElementById("modalTitle");
const modalValue = document.getElementById("modalValue");

function openModal(title, value) {
  modalTitle.textContent = title;
  modalValue.textContent = value === "livre" ? "Você escolhe o valor" : formatBRL(Number(value));
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".gift-button").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".gift-card");
    const title = card.querySelector("h3").textContent;
    openModal(title, button.dataset.value);
  });
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);

async function copyPix(button) {
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    const original = button.textContent;
    button.textContent = "✅ Chave Pix copiada!";
    setTimeout(() => button.textContent = original, 2200);
  } catch {
    alert(`Copie manualmente a chave Pix: ${PIX_KEY}`);
  }
}

document.getElementById("copyPix").addEventListener("click", e => copyPix(e.currentTarget));
document.getElementById("modalCopy").addEventListener("click", e => copyPix(e.currentTarget));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

updateGoal();
