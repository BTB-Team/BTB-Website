/**
 * main.js — BTB Website
 *
 * Shared logic used across ALL pages (per project_principles):
 *   • Theme toggle  (dark / light)
 *   • Mobile navbar toggle
 *   • Stars canvas background
 *
 * Rules:
 *   • No global variables — everything is scoped inside initX functions
 *   • Do NOT add page-specific code here
 *   • Keep functions modular and reusable
 */

"use strict";

/* ─────────────────────────────────────────────
   THEME TOGGLE
   Persists preference in localStorage.
   Toggles .dark / .light on <html>.
───────────────────────────────────────────── */
const initTheme = () => {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const apply = (theme) => {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    btn.innerHTML = theme === "dark" ? "<i class=\"fa-regular fa-sun\"></i>" :  "<i class=\"fa-regular fa-moon\"></i>";
    localStorage.setItem("btb-theme", theme);
  };

  // Restore saved preference, default to dark
  apply(localStorage.getItem("btb-theme") || "dark");

  btn.addEventListener("click", () => {
    apply(root.classList.contains("dark") ? "light" : "dark");
  });
};

/* ─────────────────────────────────────────────
   MOBILE NAV TOGGLE
   Toggles .is-open on #navLinks.
───────────────────────────────────────────── */
const initNav = () => {
  const hamburger = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  if (!hamburger || !links) return;

  hamburger.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    hamburger.innerHTML = isOpen
      ? "✕"
      : '<i class="fa-regular fa-plus-minus"></i>';
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when a link is clicked (mobile UX)
  links.querySelectorAll(".navbar__link").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      hamburger.innerHTML = "<i class=\"fa-regular fa-plus-minus/\"></i>";
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
};

/* ─────────────────────────────────────────────
   STARS CANVAS
   Renders animated twinkling stars on a fixed
   full-screen canvas. Only draws in dark mode.
───────────────────────────────────────────── */
const initStars = () => {
  const canvas = document.getElementById("starsCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];
  let W, H;
  let animId = null;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  const makeStars = (count) => {
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.7 + 0.15,
      da: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // Pause rendering in light mode (performance)
    if (!document.documentElement.classList.contains("dark")) {
      animId = requestAnimationFrame(draw);
      return;
    }

    stars.forEach((s) => {
      s.a += s.da;
      if (s.a > 0.9 || s.a < 0.1) s.da *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", () => {
    resize();
    makeStars(200);
  });

  resize();
  makeStars(200);
  draw();
};

/* ─────────────────────────────────────────────
   BOOT — run after DOM is ready
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initStars();
});
