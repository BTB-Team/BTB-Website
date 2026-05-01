
        (() => {
            const body = document.body;
            const canvas = document.getElementById('contactParticles');
            const cursor = document.getElementById('contactGlowCursor');
            const form = document.getElementById('contactForm');
            const sendBtn = document.getElementById('contactSendBtn');
            const overlay = document.getElementById('contactSuccessOverlay');
            const resetBtn = document.getElementById('contactResetBtn');
            const ctx = canvas.getContext('2d');
            const particleFields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
            const particles = [];
            let particleColor = 'rgba(0,240,255,0.25)';
            let width = 0;
            let height = 0;

            function resizeCanvas() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }

            function seedParticles() {
                particles.length = 0;
                for (let i = 0; i < 60; i += 1) {
                    particles.push({
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        r: Math.random() * 1.5 + 0.5,
                        dx: (Math.random() - 0.5) * 0.3,
                        dy: (Math.random() - 0.5) * 0.3
                    });
                }
            }

            function drawParticles() {
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = particleColor;

                particles.forEach((particle) => {
                    particle.x += particle.dx;
                    particle.y += particle.dy;

                    if (particle.x < 0) particle.x = width;
                    if (particle.x > width) particle.x = 0;
                    if (particle.y < 0) particle.y = height;
                    if (particle.y > height) particle.y = 0;

                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
                    ctx.fill();
                });

                requestAnimationFrame(drawParticles);
            }

            function showError(fieldId, message) {
                document.getElementById(fieldId + 'Err').textContent = message;
            }

            function clearError(fieldId) {
                document.getElementById(fieldId + 'Err').textContent = '';
            }

            function validateField(fieldId, isValid, message) {
                if (!isValid) {
                    showError(fieldId, message);
                    return false;
                }

                clearError(fieldId);
                return true;
            }

            sendBtn.addEventListener('mousedown', (event) => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                const rect = sendBtn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 2;
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';

                sendBtn.appendChild(ripple);
                window.setTimeout(() => ripple.remove(), 600);
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const name = document.getElementById('contactName').value.trim();
                const email = document.getElementById('contactEmail').value.trim();
                const subject = document.getElementById('contactSubject').value.trim();
                const message = document.getElementById('contactMessage').value.trim();

                let isValid = true;
                if (!validateField('contactName', name, 'Please enter your name')) isValid = false;
                if (!validateField('contactEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Please enter a valid email')) isValid = false;
                if (!validateField('contactSubject', subject, 'Please enter a subject')) isValid = false;
                if (!validateField('contactMessage', message, 'Please enter a message')) isValid = false;

                if (!isValid) {
                    return;
                }

                sendBtn.classList.add('loading');

                window.setTimeout(() => {
                    sendBtn.classList.remove('loading');
                    overlay.classList.add('show');
                }, 1500);
            });

            resetBtn.addEventListener('click', () => {
                overlay.classList.remove('show');
                form.reset();
                particleFields.forEach(clearError);
            });

            particleFields.forEach((fieldId) => {
                document.getElementById(fieldId).addEventListener('input', () => clearError(fieldId));
            });
            document.addEventListener('mousemove', (event) => {
                cursor.style.left = event.clientX + 'px';
                cursor.style.top = event.clientY + 'px';
            });

            resizeCanvas();
            seedParticles();
            syncThemeStyles();
            drawParticles();
            window.addEventListener('resize', resizeCanvas);

            if (window.lucide) {
                window.lucide.createIcons();
            }
        })();
    