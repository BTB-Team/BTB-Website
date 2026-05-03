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
            const isExpanded = details.classList.toggle('active');
            btn.textContent = isExpanded ? 'Hide Details' : 'View Details';
            btn.setAttribute('aria-expanded', isExpanded);
        }