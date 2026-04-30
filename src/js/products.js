/**
 * products.js — BTB Website
 *
 * Page-specific logic for products.html ONLY:
 *   • Category filter tabs
 *   • Scroll-triggered reveal animations (IntersectionObserver)
 *
 * Rules (per project_principles):
 *   • No global variables — scoped inside initX functions
 *   • Do NOT modify main.js without team approval
 *   • Keep functions modular and reusable
 */

"use strict";

/* ─────────────────────────────────────────────
   CATEGORY FILTER
   Shows / hides product rows by data-category.
   Smooth fade-out on hide, instant show.
───────────────────────────────────────────── */
const initFilter = () => {
  const buttons = document.querySelectorAll(".products-filter__btn");
  const rows = document.querySelectorAll("#productsGrid [data-category]");

  if (!buttons.length || !rows.length) return;

  const filterRows = (activeFilter) => {
    rows.forEach((row) => {
      const matches =
        activeFilter === "all" || row.dataset.category === activeFilter;

      if (matches) {
        // Restore visibility
        row.style.display = "";
        row.style.opacity = "1";
        row.style.transition = "opacity 0.3s ease";
      } else {
        // Fade out then hide
        row.style.opacity = "0";
        row.style.transition = "opacity 0.25s ease";

        // Wait for fade to finish before hiding
        const onTransitionEnd = () => {
          if (row.style.opacity === "0") row.style.display = "none";
          row.removeEventListener("transitionend", onTransitionEnd);
        };

        row.addEventListener("transitionend", onTransitionEnd);
      }
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      buttons.forEach((b) =>
        b.classList.remove("products-filter__btn--active"),
      );
      btn.classList.add("products-filter__btn--active");

      filterRows(btn.dataset.filter);
    });
  });
};

/* ─────────────────────────────────────────────
   SCROLL REVEAL
   Uses IntersectionObserver to add .in-view
   to animation elements as they enter the
   viewport. CSS handles the actual animation.
───────────────────────────────────────────── */
const initReveal = () => {
  /* ── Product rows ──
     When a row enters the viewport:
     1. The visual panel (.anim-scale) triggers scaleIn
     2. Text children trigger their own slide animations
        with CSS stagger delays (.delay-1 → .delay-5)
  */
  const rowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const row = entry.target;

        // Visual panel
        const visual = row.querySelector(".product-row__visual");
        if (visual) visual.classList.add("in-view");

        // All animated text children
        row
          .querySelectorAll('.product-row__content [class*="anim-"]')
          .forEach((el) => el.classList.add("in-view"));

        // Stop observing once triggered
        rowObserver.unobserve(row);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  document
    .querySelectorAll(".product-row")
    .forEach((row) => rowObserver.observe(row));

  /* ── CTA banner ── */
  const ctaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        ctaObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  document
    .querySelectorAll(".anim-up")
    .forEach((el) => ctaObserver.observe(el));
};

/* ─────────────────────────────────────────────
   BOOT
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initFilter();
  initReveal();
});
