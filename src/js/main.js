// loding first
const preloader = document.querySelector("[data-preaload]");
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

// light and dark mode
const dropdown = document.querySelector(".dropdown");
const btn = document.querySelector(".dropbtn");
btn.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});
window.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});

// theme system
const root = document.documentElement;
const saved = localStorage.getItem("theme");
if (saved) root.classList.add(saved);
// dark mode
document.getElementById("darkMode").onclick = () => {
  root.classList.remove("light");
  root.classList.add("dark");
  localStorage.setItem("theme", "dark");
};
// light mode
document.getElementById("lightMode").onclick = () => {
  root.classList.remove("dark");
  root.classList.add("light");
  localStorage.setItem("theme", "light");
};
// Navbar and humburger menu
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// active link
const currentPage = window.location.pathname.split("/").pop();
navLinks.forEach((link) => {
  const linkPage = link.getAttribute("href");
  link.classList.remove("active");
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
  if (currentPage === "" && linkPage === "index.html") {
    link.classList.add("active");
  }
});

// hedar scrolled
const header = document.getElementById("mainHeader");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) {
    header.classList.remove("hide");
    return;
  }
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScroll = currentScroll;
});

//this section for the scroll to top
const toTop = document.querySelector(".to-top");
window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      toTop.classList.add("active");
    } else {
      toTop.classList.remove("active");
    }
});
toTop.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// this style for the home page sectioon
document.addEventListener("DOMContentLoaded", () => {
  animateNumbers();
  productSlider();
  portfolioSlider();
  lazyLoadImage();
});
// Animated counters
const animateNumbers = () => {
  const statNumbers = document.querySelectorAll(".stat__number, .stat-digit");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const rawValue = element.innerText;
        const value = parseInt(rawValue.replace(/\D/g, ""));

        if (isNaN(value) || element.hasAttribute("data-animated")) return;

        element.setAttribute("data-animated", "true");

        let current = 0;
        const increment = value / 50;

        const timer = setInterval(() => {
          current += increment;

          if (current >= value) {
            element.innerText = rawValue;
            clearInterval(timer);
          } else {
            element.innerText = Math.floor(current);
          }
        }, 20);
      });
    },
    { threshold: 0.3 },
  );

  statNumbers.forEach((num) => observer.observe(num));
};

// hero section when scroll
const heroScrollEffect = () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    hero.style.opacity = 1 - scrolled / 850;
  });
};

// prodect slider
const productSlider = () => {
  const sliderProdect = document.querySelector(".product-image-slider");
  if (!sliderProdect) return;

  const cardsProdect = sliderProdect.innerHTML;
  sliderProdect.innerHTML += cardsProdect;

  const cardsPD = document.querySelectorAll(".card-service");

  cardsPD.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("flip");
    });

    card.addEventListener("mouseleave", () => {
      setTimeout(() => {
        card.classList.remove("flip");
      }, 300);
    });
  });
};

// protfolio slider
const portfolioSlider = () => {
  const slides = document.getElementById("slides");
  if (!slides) return;

  let allSlides = document.querySelectorAll(".slide");
  let index = 0;

  const getCardsPerView = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4;
  };

  const setupInfinite = () => {
    const perView = getCardsPerView();
    const slidesArr = Array.from(allSlides);

    slidesArr.slice(-perView).forEach((el) => {
      slides.insertBefore(el.cloneNode(true), slides.firstChild);
    });

    slidesArr.slice(0, perView).forEach((el) => {
      slides.appendChild(el.cloneNode(true));
    });

    allSlides = document.querySelectorAll(".slide");
    index = perView;

    update(false);
  };

  const update = (anim = true) => {
    const width = slides.children[0].offsetWidth;

    slides.style.transition = anim ? "transform 0.5s" : "none";
    slides.style.transform = `translateX(-${index * width}px)`;
  };

  const next = () => {
    index++;
    update();

    setTimeout(() => {
      const perView = getCardsPerView();

      if (index >= allSlides.length - perView) {
        index = perView;
        update(false);
      }
    }, 500);
  };

  const prev = () => {
    index--;
    update();

    setTimeout(() => {
      const perView = getCardsPerView();

      if (index < perView) {
        index = allSlides.length - perView * 2;
        update(false);
      }
    }, 500);
  };

  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  if (nextBtn) nextBtn.onclick = next;
  if (prevBtn) prevBtn.onclick = prev;

  // autoplay + pause on hover
  let autoSlide = setInterval(next, 3000);

  slides.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
  });

  slides.addEventListener("mouseleave", () => {
    autoSlide = setInterval(next, 3000);
  });

  setupInfinite();

  window.addEventListener("resize", () => {
    update(false);
  });
};

// Lazy load image
const lazyLoadImage = () => {
  if (!("IntersectionObserver" in window)) return;

  const lazyImages = document.querySelectorAll("img[data-src]");
  if (!lazyImages.length) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.dataset.src;

      img.removeAttribute("data-src");
      imageObserver.unobserve(img);
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
};
// faq section
// const items = document.querySelectorAll(".faq-item");
// const search = document.querySelector(".search-box");
// items.forEach((item) => {
//   const question = item.querySelector(".faq-question");
//   const answer = item.querySelector(".faq-answer");

//   question.addEventListener("click", () => {
//     item.classList.toggle("active");

//     if (item.classList.contains("active")) {
//       answer.style.height = answer.scrollHeight + "px";
//     } else {
//       answer.style.height = "0px";
//     }
//   });
// });
// search.addEventListener("input", () => {
//   const value = search.value.toLowerCase();

//   items.forEach((item) => {
//     const text = item.innerText.toLowerCase();

//     if (text.includes(value)) {
//       item.style.display = "block";
//     } else {
//       item.style.display = "none";
//     }
//   });
// });