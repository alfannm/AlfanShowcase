// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll progress
const progress = document.getElementById("progress");
const updateProgress = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100).toFixed(2) + "%";
};
window.addEventListener("scroll", updateProgress, { passive:true });
updateProgress();

// Reveal on scroll
const revealEls = [...document.querySelectorAll(".reveal")];
const io = new IntersectionObserver((entries) => {
  for (const e of entries){
    if (e.isIntersecting) e.target.classList.add("show");
  }
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Image fallback: show label if image missing
document.querySelectorAll(".shot img").forEach(img => {
  img.addEventListener("error", () => {
    const fb = img.parentElement.querySelector(".fallback");
    if (fb) fb.style.display = "flex";
    img.style.display = "none";
  });
});

// Modal viewer
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalApp = document.getElementById("modalApp");
const modalDesc = document.getElementById("modalDesc");
const modalImg = document.getElementById("modalImg");
const modalClose = document.getElementById("modalClose");

function openModal({title, app, desc, src}){
  modalTitle.textContent = title || "Screenshot";
  modalApp.textContent = app || "App";
  modalDesc.textContent = desc || "";
  modalImg.src = src;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

// Attach click handlers to screenshots
document.querySelectorAll(".gallery").forEach(gallery => {
  const appName = gallery.getAttribute("data-app") || "App";
  gallery.querySelectorAll(".shot").forEach(shot => {
    shot.addEventListener("click", () => {
      const img = shot.querySelector("img");
      if (!img || !img.getAttribute("src") || img.style.display === "none") return;

      openModal({
        title: shot.getAttribute("data-title") || "Screenshot",
        app: appName,
        desc: shot.getAttribute("data-desc") || "",
        src: img.getAttribute("src")
      });
    });
  });
});
