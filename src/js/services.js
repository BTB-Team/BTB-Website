(function() {
    'use strict';

    // ============================================
    // DATA: Core Services (Easy to extend)
    // ============================================
    const SERVICES_DATA = [
        {
            id: 'web-dev',
            title: 'Web Development',
            desc: 'Premium websites and web apps engineered for speed, accessibility, and conversion.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3v-3H6a2 2 0 0 1-2-2V6z"/><path d="M8 9h8"/><path d="M8 12h6"/></svg>',
            link: '#services-details'
        },
        {
            id: 'cyber-security',
            title: 'Cyber Security Training',
            desc: 'Hands-on training that builds security habits and reduces real-world risk.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 11v4"/><path d="M12 8h.01"/></svg>',
            link: '#services-details'
        },
        {
            id: 'seo',
            title: 'SEO',
            desc: 'Technical SEO + content optimization designed to compound traffic and conversions.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 1 1 3.54-8.54"/><path d="M21 21l-4.3-4.3"/><path d="M8 13l2 2 5-5"/></svg>',
            link: '#services-details'
        },
        {
            id: 'hosting',
            title: 'Hosting and Domain Name Registration',
            desc: 'Reliable hosting, SSL, CDN, backups, and domain setup—built for uptime and speed.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M7 19h10"/><path d="M12 11v8"/><path d="M6 8h.01"/><path d="M9 8h.01"/></svg>',
            link: '#services-details'
        },
        {
            id: 'design',
            title: 'Graphic Design and Video Editing',
            desc: 'Brand visuals, social creatives, and motion edits crafted with premium polish.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z"/><path d="M10 6H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/></svg>',
            link: '#services-details'
        },
        {
            id: 'audit',
            title: 'SEO Audit and Penetration Testing',
            desc: 'Actionable audits that reveal ranking blockers and security vulnerabilities.',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M7 13l3 3 7-7"/></svg>',
            link: '#services-details'
        }
    ];

    // ============================================
    // UTILITIES
    // ============================================
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const on = (el, evt, fn) => el && el.addEventListener(evt, fn);
    // Throttle for scroll events (performance)
    const throttle = (fn, wait) => {
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn.apply(this, args);
            }
        };
    };

    // ============================================
    // 1. CORE SERVICES SLIDER
    // ============================================
    class ServicesCarousel {
        constructor() {
            this.track = $('#servicesTrack');
            this.prevBtn = $('.core-services__nav--prev');
            this.nextBtn = $('.core-services__nav--next');
            this.viewport = this.track?.parentElement;
            this.cards = [];
            this.index = 0; // index into original items
            this.cardsPerView = this.getCardsPerView();
            this.isAnimating = false;
            this.autoTimer = null;
            this.autoDelay = 3600;
            
            this.init();
        }

        getCardsPerView() {
            const w = window.innerWidth;
            if (w >= 1024) return 3;
            if (w >= 768) return 2;
            return 1;
        }

        init() {
            if (!this.track) return;
            this.renderCards();
            this.bindEvents();
            this.jumpToStart();
            this.startAutoplay();
        }

        renderCards() {
            const makeCard = (s) => `
                <article class="core-services__card glass-card" data-id="${s.id}">
                    <div class="core-services__card-icon" aria-hidden="true">${s.icon}</div>
                    <h3 class="core-services__card-title">${s.title}</h3>
                    <p class="core-services__card-desc">${s.desc}</p>
                    <a href="${s.link}" class="core-services__card-link">
                        Learn more
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </article>
            `;

            // Infinite loop: clone head/tail
            const head = SERVICES_DATA.slice(0, this.cardsPerView);
            const tail = SERVICES_DATA.slice(-this.cardsPerView);
            const items = [...tail, ...SERVICES_DATA, ...head];

            this.track.innerHTML = items.map(makeCard).join('');
            this.cards = $$('.core-services__card', this.track);
        }

        bindEvents() {
            on(this.prevBtn, 'click', () => this.prev());
            on(this.nextBtn, 'click', () => this.next());

            // Touch/swipe support
            let startX = 0;
            on(this.viewport, 'touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, {passive: true});
            
            on(this.viewport, 'touchend', (e) => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.next() : this.prev();
                }
            }, {passive: true});

            // Pause autoplay on hover/focus
            on(this.viewport, 'mouseenter', () => this.stopAutoplay());
            on(this.viewport, 'mouseleave', () => this.startAutoplay());
            on(this.viewport, 'focusin', () => this.stopAutoplay());
            on(this.viewport, 'focusout', () => this.startAutoplay());

            // Resize
            on(window, 'resize', throttle(() => {
                const newCardsPerView = this.getCardsPerView();
                if (newCardsPerView !== this.cardsPerView) {
                    this.cardsPerView = newCardsPerView;
                    this.renderCards();
                    this.jumpToStart();
                }
            }, 250));

            // Transition boundary fixes
            this.track.addEventListener('transitionend', () => this.onTransitionEnd());
        }

        getStep() {
            const gap = 24;
            const cardWidth = this.cards[this.cardsPerView]?.offsetWidth || this.cards[0]?.offsetWidth || 300;
            return cardWidth + gap;
        }

        setTranslate(px, animate = true) {
            this.track.style.transition = animate ? 'transform 550ms cubic-bezier(0.2, 0.9, 0.2, 1)' : 'none';
            this.track.style.transform = `translateX(${px}px)`;
        }

        jumpToStart() {
            // Start at the first "real" item (after tail clones)
            const startOffset = -(this.getStep() * this.cardsPerView);
            this.setTranslate(startOffset, false);
            this.index = 0;
        }

        prev() { this.move(-1); }
        next() { this.move(1); }

        move(dir) {
            if (this.isAnimating) return;
            this.isAnimating = true;
            const step = this.getStep();
            const current = this.getCurrentTranslateX();
            this.setTranslate(current - (dir * step), true);
            this.index += dir;
        }

        getCurrentTranslateX() {
            const m = new DOMMatrixReadOnly(getComputedStyle(this.track).transform);
            return m.m41 || 0;
        }

        onTransitionEnd() {
            const total = SERVICES_DATA.length;
            const step = this.getStep();

            // If we moved into clones, jump back without animation
            if (this.index < 0) {
                this.index = total - 1;
                const px = -step * (this.cardsPerView + this.index);
                this.setTranslate(px, false);
            } else if (this.index >= total) {
                this.index = 0;
                const px = -step * (this.cardsPerView + this.index);
                this.setTranslate(px, false);
            }

            this.isAnimating = false;
        }

        startAutoplay() {
            if (this.autoTimer) return;
            this.autoTimer = window.setInterval(() => this.next(), this.autoDelay);
        }

        stopAutoplay() {
            if (!this.autoTimer) return;
            window.clearInterval(this.autoTimer);
            this.autoTimer = null;
        }
    }

    // ============================================
    // 2. SCROLL REVEAL (IntersectionObserver)
    // ============================================
    class ScrollReveal {
        constructor() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const t = entry.target;

                    if (t.classList.contains('reveal')) {
                        t.classList.add('reveal--visible');
                    }
                    if (t.classList.contains('reveal-children')) {
                        t.classList.add('reveal-children--visible');
                    }
                    if (t.classList.contains('how-we-work__step')) {
                        t.classList.add('how-we-work__step--active');
                        this.updateTimelineProgress();
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });
        }

        init() {
            const detailEls = $$('.service-detail');
            $$('.reveal').forEach(el => {
                if (detailEls.includes(el)) {
                    const idx = detailEls.indexOf(el);
                    el.style.setProperty('--reveal-delay', `${idx * 0.12}s`);
                }
                this.observer.observe(el);
            });

            $$('.reveal-children').forEach(el => this.observer.observe(el));

            $$('.how-we-work__step').forEach((el, i) => {
                el.style.setProperty('--sd', `${i * 0.08}s`);
                this.observer.observe(el);
            });

            const visibleNow = (el) => {
                const r = el.getBoundingClientRect();
                return r.top < window.innerHeight * 0.92 && r.bottom > -8;
            };

            requestAnimationFrame(() => {
                $$('.reveal').forEach(el => {
                    if (visibleNow(el)) el.classList.add('reveal--visible');
                });
                $$('.reveal-children').forEach(el => {
                    if (visibleNow(el)) el.classList.add('reveal-children--visible');
                });
            });
        }

        updateTimelineProgress() {
            const steps = $$('.how-we-work__step');
            const activeSteps = steps.filter(s => s.classList.contains('how-we-work__step--active')).length;
            const progress = (activeSteps / steps.length) * 100;
            const line = $('#timelineProgress');
            if (line) line.style.height = `${progress}%`;
        }
    }

    // ============================================
    // 3. SMOOTH SCROLL (for anchor links)
    // ============================================
    class SmoothScroll {
        init() {
            $$('a[href^="#"]').forEach(link => {
                on(link, 'click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId === '#') return;
                    const target = $(targetId);
                    if (target) {
                        e.preventDefault();
                        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: offset, behavior: 'smooth' });
                    }
                });
            });
        }
    }

    // ============================================
    // 4. THEME DETECTION (sync with main.css)
    // ============================================
    class ThemeManager {
        init() {
            const root = document.documentElement;
            this.lastTheme = null;

            // Default to light when no global class is present yet.
            if (!root.classList.contains('light') && !root.classList.contains('dark')) root.classList.add('light');
            this.normalizeThemeClass(root);
            this.emitThemeChangeIfNeeded();
            this.observeRootThemeChanges();
        }

        getTheme() {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        }

        normalizeThemeClass(root = document.documentElement) {
            const theme = this.getTheme();
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
        }

        emitThemeChangeIfNeeded() {
            const theme = this.getTheme();
            if (theme === this.lastTheme) return;
            this.lastTheme = theme;
            window.dispatchEvent(new CustomEvent('btb:themechange', { detail: { theme } }));
        }

        observeRootThemeChanges() {
            const root = document.documentElement;
            const onClassChange = () => {
                this.normalizeThemeClass(root);
                this.emitThemeChangeIfNeeded();
            };
            this.observer = new MutationObserver(onClassChange);
            this.observer.observe(root, { attributes: true, attributeFilter: ['class'] });
        }
    }

    /** Resolve a CSS variable like `--primary` to RGB triple via computed style (theme-safe). */
    function cssVarRgb(varName) {
        const probe = document.createElement('span');
        probe.style.color = `var(${varName})`;
        document.body.appendChild(probe);
        const rgbStr = getComputedStyle(probe).color;
        probe.remove();
        const m = rgbStr.match(/[\d.]+/g);
        if (!m || m.length < 3) return [128, 128, 128];
        return [Math.round(+m[0]), Math.round(+m[1]), Math.round(+m[2])];
    }

    // ============================================
    // Canvas particles (lightweight background)
    // ============================================
    class MutationParticles {
        init() {
            const canvas = document.getElementById('particles-canvas');
            if (!canvas) return;

            const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
            if (reduceMotion) return;

            const ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) return;

            let w = 0;
            let h = 0;
            let dpr = 1;
            let dots = [];

            const resize = () => {
                dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
                w = Math.floor(window.innerWidth);
                h = Math.floor(window.innerHeight);
                canvas.width = Math.floor(w * dpr);
                canvas.height = Math.floor(h * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            };
            resize();
            window.addEventListener('resize', throttle(resize, 250), { passive: true });

            const N = 20;

            const rebuildDots = () => {
                const primary = cssVarRgb('--primary');
                const secondary = cssVarRgb('--secondary');
                const textRgb = cssVarRgb('--text');
                const dark = document.documentElement.classList.contains('dark');

                dots = Array.from({ length: N }, () => {
                    const mixRgb = Math.random() > 0.5 ? primary : secondary;
                    const rgb = dark ? textRgb : mixRgb;
                    const a = dark
                        ? Math.random() * 0.06 + 0.16
                        : Math.random() * 0.04 + 0.06;
                    return {
                        x: Math.random() * w,
                        y: Math.random() * h,
                        vx: (Math.random() - 0.5) * 0.2,
                        vy: (Math.random() - 0.5) * 0.2,
                        r: Math.random() * 0.9 + 0.55,
                        rgb,
                        a
                    };
                });
            };

            rebuildDots();
            window.addEventListener('btb:themechange', rebuildDots);

            let last = 0;
            const minFrameMs = 1000 / 24;

            const tick = (now) => {
                requestAnimationFrame(tick);
                if (now - last < minFrameMs) return;
                last = now;

                ctx.clearRect(0, 0, w, h);

                for (const p of dots) {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < -8) p.x = w + 8;
                    else if (p.x > w + 8) p.x = -8;
                    if (p.y < -8) p.y = h + 8;
                    else if (p.y > h + 8) p.y = -8;

                    ctx.fillStyle = `rgba(${p.rgb[0]},${p.rgb[1]},${p.rgb[2]},${p.a})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            };

            requestAnimationFrame(tick);
        }
    }

    // ============================================
    // 5. PARALLAX ORBS (subtle, performant)
    // ============================================
    class ParallaxOrbs {
        constructor() {
            this.orbs = $$('.services-hero__orb');
            this.ticking = false;
        }

        init() {
            on(window, 'scroll', throttle(() => {
                if (!this.ticking) {
                    requestAnimationFrame(() => this.update());
                    this.ticking = true;
                }
            }, 16));
        }

        update() {
            const scrollY = window.scrollY;
            const heroHeight = $('.services-hero')?.offsetHeight || 800;
            const progress = Math.min(scrollY / heroHeight, 1);
            
            this.orbs.forEach((orb, i) => {
                const speed = 0.1 + (i * 0.05);
                const y = scrollY * speed;
                const scale = 1 - (progress * 0.2);
                orb.style.transform = `translateY(${y}px) scale(${scale})`;
            });
            
            this.ticking = false;
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Wait for fonts and DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runInit);
        } else {
            runInit();
        }
    }

    function runInit() {
        new ServicesCarousel();
        new ScrollReveal().init();
        new SmoothScroll().init();
        new ThemeManager().init();
        new ParallaxOrbs().init();
        new MutationParticles().init();
    }

    // Expose minimal API for debugging
    window.BTBServices = {
        data: SERVICES_DATA,
        refresh: () => runInit()
    };

    init();
})();