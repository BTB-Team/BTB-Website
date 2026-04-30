
// about why choose us caption show / hide scripts
// ///////////////////////////////////////////////////////////////

const CaptionShowBtn = document.querySelectorAll(".why-list__btn")
const whyCaption = document.querySelectorAll(".why-list__caption")

function showCaptionHandler() {
    CaptionShowBtn.forEach(function (btn, index) {
        btn.addEventListener("click", function () {
            whyCaption.forEach(function (caption) {
                caption.classList.remove("why-list__caption--active")
                whyCaption[index].classList.add("why-list__caption--active")
            })
        })
    })
}

showCaptionHandler()

// about achievement scroll icrease numbers scripts
// ///////////////////////////////////////////////////////////////////////////


const counters = document.querySelectorAll('.counter');

function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuad = progress * (2 - progress);

        const value = Math.floor(easeOutQuad * target);
        counter.innerText = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            counter.innerText = target;
        }
    }

    requestAnimationFrame(update);
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));


// about page slider scripts
// /////////////////////////////////////////////////////////////

const track = document.querySelector('.team-track');
const members = document.querySelectorAll('.team-member');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;

function getVisibleItems() {
    return window.innerWidth <= 768 ? 1 : 3;
}

function updateSlider() {
    const itemWidth = members[0].offsetWidth;
    const style = window.getComputedStyle(members[0]);
    const marginRight = parseInt(style.marginRight) || 0;
    const marginLeft = parseInt(style.marginLeft) || 0;
    const totalItemWidth = itemWidth + marginLeft + marginRight;

    const visibleItems = getVisibleItems();
    const maxIndex = members.length - visibleItems;

    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;

    const offset = -(index * totalItemWidth);
    track.style.transform = `translateX(${offset}px)`;
}

nextBtn.addEventListener('click', () => {
    index++;
    updateSlider();
});

prevBtn.addEventListener('click', () => {
    index--;
    updateSlider();
});

setInterval(() => {
    index++;
    updateSlider();
}, 4000);

window.addEventListener('resize', () => {
    updateSlider();
});















const items = document.querySelectorAll('.fade-in');

const obServer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            // اگر بخواهی فقط یک بار ظاهر شوند:
            obServer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2 // وقتی 20% آیتم در دید باشد اجرا شود
});

items.forEach(item => {
    obServer.observe(item);
});