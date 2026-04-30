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
    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

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
                <article class="core-services__card services-glass" data-id="${s.id}">
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
                    if (entry.isIntersecting) {
                        // Service details
                        if (entry.target.classList.contains('service-detail')) {
                            entry.target.classList.add('service-detail--visible');
                        }

                        // Generic reveal utilities
                        if (entry.target.classList.contains('reveal')) {
                            entry.target.classList.add('reveal--visible');
                        }
                        if (entry.target.classList.contains('reveal-children')) {
                            entry.target.classList.add('reveal-children--visible');
                        }
                        if (entry.target.classList.contains('services-reveal')) {
                            entry.target.classList.add('services-reveal--in');
                        }

                        // For timeline steps
                        if (entry.target.classList.contains('how-we-work__step')) {
                            entry.target.classList.add('how-we-work__step--active');
                            this.updateTimelineProgress();
                        }
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });
        }

        init() {
            // Universal section reveal
            $$('.services-reveal').forEach(el => this.observer.observe(el));

            // Service details (staggered reveal)
            $$('.service-detail').forEach((el, i) => {
                el.style.setProperty('--sd', `${i * 0.12}s`);
                this.observer.observe(el);
            });
            
            // Timeline steps
            $$('.how-we-work__step').forEach((el, i) => {
                el.style.setProperty('--sd', `${i * 0.08}s`);
                this.observer.observe(el);
            });
            
            // Pricing cards
            $$('.pricing-model__card').forEach((el, i) => {
                el.style.transitionDelay = `${i * 0.1}s`;
                el.classList.add('reveal');
                this.observer.observe(el);
            });

            // Header elements
            $$('.core-services__header, .services-details__header, .how-we-work__header, .pricing-model__header').forEach(el => {
                el.classList.add('reveal-children');
                this.observer.observe(el);
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

    // ============================================
    // 7. PARTICLES.JS (Motion atoms background)
    // ============================================
    class MotionParticles {
        init() {
            const root = document.documentElement;
            const host = document.getElementById('services-particles');
            if (!host) return;

            const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduceMotion) return;

            // Build once
            host.innerHTML = '';

            const styles = getComputedStyle(root);
            const primary = (styles.getPropertyValue('--primary') || '#2563EB').trim();

            const DOTS = 70;
            const vw = () => window.innerWidth;
            const vh = () => window.innerHeight;

            for (let i = 0; i < DOTS; i++) {
                const dot = document.createElement('span');
                dot.className = 'services-particles__dot';

                const size = (Math.random() * 1.8 + 1.2).toFixed(2); // 1.2px → 3px
                const opacity = (Math.random() * 0.12 + 0.06).toFixed(2); // 0.06 → 0.18
                const duration = (Math.random() * 18 + 16).toFixed(2); // 16s → 34s

                const x0 = Math.random() * vw();
                const y0 = Math.random() * vh();

                // slow drift vector
                const dx = (Math.random() * 260 - 130);
                const dy = (Math.random() * 240 - 120);

                dot.style.setProperty('--s', `${size}px`);
                dot.style.setProperty('--o', opacity);
                dot.style.setProperty('--d', `${duration}s`);
                dot.style.setProperty('--c', Math.random() > 0.5 ? primary : secondary);
                dot.style.setProperty('--x0', `${x0}px`);
                dot.style.setProperty('--y0', `${y0}px`);
                dot.style.setProperty('--x1', `${x0 + dx}px`);
                dot.style.setProperty('--y1', `${y0 + dy}px`);

                host.appendChild(dot);
            }
        }
    }

    // ============================================
    // 8. WHITE MUTATION PARTICLES (Canvas, required)
    // ============================================
    class MutationParticles {
        init() {
            const canvas = document.getElementById('particles-canvas');
            if (!canvas) return;

            const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduceMotion) return;

            const ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) return;

            const root = document.documentElement;
            const styles = getComputedStyle(root);
            const primary = (styles.getPropertyValue('--primary') || '#2563EB').trim();
            const secondary = (styles.getPropertyValue('--secondary') || '#7C3AED').trim();

            const getTheme = () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

            let w = 0, h = 0, dpr = 1;
            const resize = () => {
                dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
                w = Math.floor(window.innerWidth);
                h = Math.floor(window.innerHeight);
                canvas.width = Math.floor(w * dpr);
                canvas.height = Math.floor(h * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            };
            resize();
            window.addEventListener('resize', throttle(resize, 200), { passive: true });

            const mouse = { x: w * 0.5, y: h * 0.5, active: false };
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                mouse.active = true;
            }, { passive: true });

            const N = 70;
            const dots = Array.from({ length: N }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.2 + 0.8,
                a: 0,
                c: primary
            }));

            const applyThemeToDots = () => {
                const theme = getTheme();
                for (const p of dots) {
                    if (theme === 'dark') {
                        // Dark Mode: white, stronger presence
                        p.c = '#FFFFFF';
                        p.a = Math.random() * 0.08 + 0.36; // 0.36 → 0.44 (~0.4)
                    } else {
                        // Light Mode: primary tint watermark
                        p.c = primary;
                        p.a = Math.random() * 0.02 + 0.09; // 0.09 → 0.11 (~0.1)
                    }
                }
            };
            applyThemeToDots();

            window.addEventListener('btb:themechange', applyThemeToDots);

            const tick = () => {
                ctx.clearRect(0, 0, w, h);

                for (const p of dots) {
                    // Random drift
                    p.x += p.vx;
                    p.y += p.vy;

                    // Wrap-around edges
                    if (p.x < -10) p.x = w + 10;
                    if (p.x > w + 10) p.x = -10;
                    if (p.y < -10) p.y = h + 10;
                    if (p.y > h + 10) p.y = -10;

                    // Interaction: gently follow / move away near cursor
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist2 = dx * dx + dy * dy;
                    const radius = 180;
                    if (mouse.active && dist2 < radius * radius) {
                        const dist = Math.max(12, Math.sqrt(dist2));
                        const t = 1 - dist / radius; // 0..1
                        const follow = 0.020 * t;
                        const repel = 0.010 * t;
                        const dir = 0.6; // bias toward follow, still feels reactive
                        p.vx += (dx / dist) * (follow * dir) - (dx / dist) * (repel * (1 - dir));
                        p.vy += (dy / dist) * (follow * dir) - (dy / dist) * (repel * (1 - dir));
                    }

                    // Gentle damping to keep it calm
                    p.vx *= 0.985;
                    p.vy *= 0.985;

                    ctx.beginPath();
                    ctx.fillStyle = withAlpha(p.c, p.a);
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                }

                requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        }
    }

    function withAlpha(color, alpha) {
        const a = clamp(alpha, 0, 1);
        const c = String(color || '').trim();

        // #RGB / #RRGGBB
        if (c[0] === '#') {
            let r, g, b;
            if (c.length === 4) {
                r = parseInt(c[1] + c[1], 16);
                g = parseInt(c[2] + c[2], 16);
                b = parseInt(c[3] + c[3], 16);
            } else if (c.length === 7) {
                r = parseInt(c.slice(1, 3), 16);
                g = parseInt(c.slice(3, 5), 16);
                b = parseInt(c.slice(5, 7), 16);
            }
            if ([r, g, b].every(v => Number.isFinite(v))) {
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            }
        }

        // rgb() / rgba()
        const rgb = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)/i);
        if (rgb) {
            return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${a})`;
        }

        // Fallback: use primary-ish tint
        return `rgba(37, 99, 235, ${a})`;
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
    // 6. COUNTER ANIMATION (Hero stats)
    // ============================================
    class CounterAnimation {
        init() {
            const stats = $$('.services-hero__stat-number');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            stats.forEach(stat => observer.observe(stat));
        }

        animate(el) {
            const text = el.textContent;
            const hasPlus = text.includes('+');
            const hasPercent = text.includes('%');
            const target = parseInt(text.replace(/\D/g, ''), 10);
            
            if (isNaN(target)) return;
            
            let current = 0;
            const duration = 2000;
            const step = target / (duration / 16);
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                let display = Math.floor(current);
                if (hasPercent) display += '%';
                if (hasPlus) display += '+';
                if (text.includes('24/7')) display = '24/7';
                el.textContent = display;
            }, 16);
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
        new CounterAnimation().init();
        new MotionParticles().init();
        new MutationParticles().init();
        
        // Add reveal class to headers
        $$('.services-hero__text > *').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
        });
        
        // Trigger hero entrance
        requestAnimationFrame(() => {
            $$('.services-hero__text > *').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });
    }

    // Expose minimal API for debugging
    window.BTBServices = {
        data: SERVICES_DATA,
        refresh: () => runInit()
    };

    init();
})();