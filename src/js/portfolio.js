// Scroll Reveal Effect
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;
  const elementVisible = 100;

  reveals.forEach((reveal) => {
    const elementTop = reveal.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
// Trigger once on load to reveal elements already in view
window.addEventListener("load", revealOnScroll);

// Project Detail Toggle
function toggleProjectDetail(btn) {
  const details = btn.nextElementSibling;
  const isExpanded = details.classList.toggle("active");
  btn.textContent = isExpanded ? "Hide Details" : "View Details";
  btn.setAttribute("aria-expanded", isExpanded);
}

// Why Choose Us Scroll Controls
document.addEventListener("DOMContentLoaded", function () {
  const leftButton = document.querySelector(".why-us-arrow.left");
  const rightButton = document.querySelector(".why-us-arrow.right");
  const list = document.querySelector(".why-us-list");

  if (!leftButton || !rightButton || !list) {
    return;
  }

  leftButton.addEventListener("click", function () {
    scrollByCard(-1);
  });

  rightButton.addEventListener("click", function () {
    scrollByCard(1);
  });

  function scrollByCard(direction) {
    const cards = Array.from(list.querySelectorAll(".why-us-item"));
    if (!cards.length) {
      return;
    }
    const gap = parseInt(getComputedStyle(list).gap, 10) || 16;
    const cardWidth = cards[0].offsetWidth + gap;
    const nextScroll = list.scrollLeft + direction * cardWidth;
    list.scrollTo({ left: nextScroll, behavior: "smooth" });
  }
});
