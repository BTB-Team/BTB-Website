//  System Mode & Form Handler 
  (function() {
      // Magnetic button effect
      const magneticBtn = document.querySelector('.cta-magnetic-btn');
      if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const moveX = (x - centerX) * 0.15;
          const moveY = (y - centerY) * 0.15;
          this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
        magneticBtn.addEventListener('mouseleave', function() {
          this.style.transform = 'translate(0px, 0px) scale(1)';
        });
      }
      
      // Ripple effect
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) {
        submitBtn.addEventListener('mousedown', function(e) {
          const ripple = document.createElement('span');
          ripple.className = 'ripple-effect';
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
          ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
          this.style.position = 'relative';
          this.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      }
      
      // System Mode Handler
      const systemBtn = document.getElementById('systemMode');
      const darkBtn = document.getElementById('darkMode');
      const lightBtn = document.getElementById('lightMode');
      const bodyEl = document.body;
      const root = document.documentElement;
      
      function updateSystemModeClass() {
        const hasDark = root.classList.contains('dark');
        const hasLight = root.classList.contains('light');
        if (!hasDark && !hasLight) {
          bodyEl.classList.add('system-mode-active');
        } else {
          bodyEl.classList.remove('system-mode-active');
        }
      }
      
      updateSystemModeClass();
      
      if (systemBtn) {
        systemBtn.addEventListener('click', function() {
          root.classList.remove('dark', 'light');
          localStorage.removeItem('theme');
          bodyEl.classList.add('system-mode-active');
        });
      }
      
      if (darkBtn) {
        darkBtn.addEventListener('click', function() {
          bodyEl.classList.remove('system-mode-active');
        });
      }
      
      if (lightBtn) {
        lightBtn.addEventListener('click', function() {
          bodyEl.classList.remove('system-mode-active');
        });
      }
      
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            updateSystemModeClass();
          }
        });
      });
      observer.observe(root, { attributes: true });
      
      // Form validation
      const form = document.getElementById('contactForm');
      if (form) {
        const nameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('emailAddress');
        const phoneInput = document.getElementById('phoneNumber');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');
        const formStatus = document.getElementById('formStatus');
        
        function clearErrors() {
          if (nameError) nameError.innerText = '';
          if (emailError) emailError.innerText = '';
          if (phoneError) phoneError.innerText = '';
          if (subjectError) subjectError.innerText = '';
          if (messageError) messageError.innerText = '';
        }
        
        function validateForm() {
          let isValid = true;
          clearErrors();
          
          const name = nameInput ? nameInput.value.trim() : '';
          const email = emailInput ? emailInput.value.trim() : '';
          const phone = phoneInput ? phoneInput.value.trim() : '';
          const subject = subjectInput ? subjectInput.value.trim() : '';
          const message = messageInput ? messageInput.value.trim() : '';
          
          if (!name) { if (nameError) nameError.innerText = 'Full name is required'; isValid = false; }
          if (!email) { if (emailError) emailError.innerText = 'Email address is required'; isValid = false; }
          else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email)) { if (emailError) emailError.innerText = 'Please enter a valid email address'; isValid = false; }
          if (phone && phone.length > 0 && !/^[\+\d\s\-\(\)]{8,20}$/.test(phone)) { if (phoneError) phoneError.innerText = 'Please enter a valid phone number'; isValid = false; }
          if (!subject) { if (subjectError) subjectError.innerText = 'Subject is required'; isValid = false; }
          if (!message) { if (messageError) messageError.innerText = 'Message cannot be empty'; isValid = false; }
          
          return isValid;
        }
        
        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          if (!validateForm()) return;
          
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
          submitBtn.classList.add('submit-loading');
          submitBtn.disabled = true;
          
          setTimeout(() => {
            formStatus.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Thank you! Our team will get back to you within 24 hours.</div>';
            form.reset();
            setTimeout(() => { if (formStatus) formStatus.innerHTML = ''; }, 5000);
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('submit-loading');
            submitBtn.disabled = false;
          }, 800);
        });
        
        const clearFieldError = (fieldId, errorId) => {
          const field = document.getElementById(fieldId);
          const errorEl = document.getElementById(errorId);
          if (field && errorEl) {
            field.addEventListener('input', () => { errorEl.innerText = ''; });
          }
        };
        clearFieldError('fullName', 'nameError');
        clearFieldError('emailAddress', 'emailError');
        clearFieldError('phoneNumber', 'phoneError');
        clearFieldError('subject', 'subjectError');
        clearFieldError('message', 'messageError');
      }
    })();
 