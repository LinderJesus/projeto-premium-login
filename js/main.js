/**
 * PREMIUM LOGIN SYSTEM
 * Main JavaScript File
 * Version: 2.0
 */

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
  // Setup custom cursor
  setupCustomCursor();
  
  // Initialize animations
  initAnimations();
  
  // Initialize form validation
  setupFormValidation();
  
  // Initialize password strength meter
  setupPasswordStrength();
  
  // Setup toggle password visibility
  setupPasswordToggle();
  
  // Initialize background effects
  initBackgroundEffects();
  
  // Add ripple effect to buttons
  addRippleEffect();
  
  // Initialize social login buttons
  initSocialButtons();
  
  // Initialize form switch (login/register)
  setupFormSwitch();
}

/**
 * Custom cursor functionality
 */
function setupCustomCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  // Update cursor position
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Check if over clickable elements
    const target = e.target;
    if (
      target.tagName.toLowerCase() === 'button' || 
      target.tagName.toLowerCase() === 'a' || 
      target.tagName.toLowerCase() === 'input' ||
      target.classList.contains('clickable')
    ) {
      cursor.classList.add('expanded');
    } else {
      cursor.classList.remove('expanded');
    }
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseout', () => {
    cursor.style.display = 'none';
  });
  
  document.addEventListener('mouseover', () => {
    cursor.style.display = 'block';
  });
}

/**
 * Form validation setup
 */
function setupFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  
  // Add validation event listeners to all forms
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', function(event) {
      if (!validateForm(form)) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="loading-spinner me-2"></span> Processing...';
          
          // Simulate API call (remove this in production)
          setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check me-2"></i> Success!';
            submitBtn.classList.add('btn-success');
            
            // Redirect or show success message
            setTimeout(() => {
              if (form.id === 'loginForm') {
                window.location.href = 'dashboard.html';
              } else {
                showToast('Account created successfully! Please log in.', 'success');
                switchForm('login');
              }
            }, 1000);
          }, 2000);
        }
      }
    }, false);
    
    // Add input validation on blur
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateInput(input);
      });
    });
  });
}

/**
 * Validate an individual form input
 * @param {HTMLElement} input - The input element to validate
 * @return {boolean} - Whether the input is valid
 */
function validateInput(input) {
  let isValid = true;
  const errorElement = input.parentElement.querySelector('.form-error');
  
  // Clear previous error
  if (errorElement) {
    errorElement.textContent = '';
  }
  
  // Check required fields
  if (input.hasAttribute('required') && !input.value.trim()) {
    if (errorElement) {
      errorElement.textContent = 'This field is required';
    }
    input.classList.add('is-invalid');
    isValid = false;
  }
  
  // Email validation
  if (input.type === 'email' && input.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid email address';
      }
      input.classList.add('is-invalid');
      isValid = false;
    }
  }
  
  // Password validation
  if (input.id === 'password' && input.value) {
    if (input.value.length < 8) {
      if (errorElement) {
        errorElement.textContent = 'Password must be at least 8 characters';
      }
      input.classList.add('is-invalid');
      isValid = false;
    }
  }
  
  // Password confirmation validation
  if (input.id === 'confirmPassword') {
    const password = document.getElementById('password');
    if (password && input.value !== password.value) {
      if (errorElement) {
        errorElement.textContent = 'Passwords do not match';
      }
      input.classList.add('is-invalid');
      isValid = false;
    }
  }
  
  // If valid, add success class
  if (isValid && input.value) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  }
  
  return isValid;
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - The form to validate
 * @return {boolean} - Whether the form is valid
 */
function validateForm(form) {
  let isValid = true;
  
  // Validate all inputs
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  
  // Add form error shake animation if invalid
  if (!isValid) {
    form.classList.add('shake');
    setTimeout(() => {
      form.classList.remove('shake');
    }, 800);
  }
  
  return isValid;
}

/**
 * Setup password strength meter
 */
function setupPasswordStrength() {
  const passwordInput = document.getElementById('password');
  const strengthMeter = document.querySelector('.strength-meter');
  const strengthFill = document.querySelector('.strength-meter-fill');
  const strengthText = document.querySelector('.strength-text');
  
  if (passwordInput && strengthMeter && strengthFill && strengthText) {
    passwordInput.addEventListener('input', updateStrength);
    
    function updateStrength() {
      const value = passwordInput.value;
      let score = 0;
      
      if (!value) {
        strengthFill.style.width = '0%';
        strengthFill.style.backgroundColor = '';
        strengthText.textContent = '';
        return;
      }
      
      // Calculate password strength
      // Length check
      if (value.length > 6) score += 10;
      if (value.length > 8) score += 10;
      if (value.length > 12) score += 10;
      
      // Complexity checks
      if (/[a-z]/.test(value)) score += 10; // Has lowercase
      if (/[A-Z]/.test(value)) score += 15; // Has uppercase
      if (/[0-9]/.test(value)) score += 15; // Has number
      if (/[^a-zA-Z0-9]/.test(value)) score += 20; // Has special char
      
      // Variety bonus
      let variety = 0;
      if (/[a-z]/.test(value)) variety++;
      if (/[A-Z]/.test(value)) variety++;
      if (/[0-9]/.test(value)) variety++;
      if (/[^a-zA-Z0-9]/.test(value)) variety++;
      if (variety >= 3) score += 10;
      
      // Set UI based on score
      strengthFill.style.width = `${Math.min(100, score)}%`;
      
      if (score < 30) {
        strengthFill.style.backgroundColor = 'var(--error)';
        strengthText.textContent = 'Weak';
        strengthText.style.color = 'var(--error)';
      } else if (score < 60) {
        strengthFill.style.backgroundColor = 'var(--warning)';
        strengthText.textContent = 'Fair';
        strengthText.style.color = 'var(--warning)';
      } else if (score < 80) {
        strengthFill.style.backgroundColor = 'var(--primary)';
        strengthText.textContent = 'Good';
        strengthText.style.color = 'var(--primary)';
      } else {
        strengthFill.style.backgroundColor = 'var(--success)';
        strengthText.textContent = 'Strong';
        strengthText.style.color = 'var(--success)';
      }
      
      // Animate the change
      strengthFill.classList.add('pulse');
      setTimeout(() => {
        strengthFill.classList.remove('pulse');
      }, 500);
    }
  }
}

/**
 * Setup password visibility toggle
 */
function setupPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.input-icon');
  
  toggleButtons.forEach(button => {
    if (button.classList.contains('toggle-password')) {
      button.addEventListener('click', function() {
        const input = this.closest('.form-group').querySelector('input');
        
        // Toggle password visibility
        if (input.type === 'password') {
          input.type = 'text';
          this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
          input.type = 'password';
          this.innerHTML = '<i class="fas fa-eye"></i>';
        }
        
        // Animate icon
        this.classList.add('pulse');
        setTimeout(() => {
          this.classList.remove('pulse');
        }, 500);
      });
    }
  });
}

/**
 * Initialize background visual effects
 */
function initBackgroundEffects() {
  // Create background elements
  const bgRoot = document.createElement('div');
  bgRoot.classList.add('bg-effects');
  
  // Add dots background
  const bgDots = document.createElement('div');
  bgDots.classList.add('bg-dots');
  bgRoot.appendChild(bgDots);
  
  // Add gradient background
  const bgGradient = document.createElement('div');
  bgGradient.classList.add('bg-gradient');
  bgRoot.appendChild(bgGradient);
  
  // Add floating shapes
  const floatingShapes = document.createElement('div');
  floatingShapes.classList.add('floating-shapes');
  
  // Create shapes
  for (let i = 1; i <= 4; i++) {
    const shape = document.createElement('div');
    shape.classList.add('shape', `shape${i}`);
    floatingShapes.appendChild(shape);
  }
  
  bgRoot.appendChild(floatingShapes);
  
  // Add to document
  document.body.prepend(bgRoot);
}

/**
 * Add ripple effect to buttons
 */
function addRippleEffect() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.classList.add('btn-ripple');
    
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Initialize animations on page elements
 */
function initAnimations() {
  // Animate elements as they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => {
    observer.observe(el);
  });
  
  // Add staggered animation to children elements
  const staggerParents = document.querySelectorAll('.stagger-children');
  
  staggerParents.forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
      child.style.animationDelay = `${index * 0.1}s`;
    });
  });
}

/**
 * Initialize social login buttons
 */
function initSocialButtons() {
  const socialButtons = document.querySelectorAll('.social-btn');
  
  socialButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const provider = this.getAttribute('data-provider');
      
      // Show loading state
      const originalContent = this.innerHTML;
      this.innerHTML = '<span class="loading-spinner"></span>';
      
      // Simulate authentication process
      setTimeout(() => {
        this.innerHTML = originalContent;
        
        // In real implementation, redirect to OAuth provider or handle authentication
        console.log(`Authenticating with ${provider}`);
        
        // For demo, redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      }, 2000);
    });
  });
}

/**
 * Setup form switching between login and register
 */
function setupFormSwitch() {
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  
  if (loginPanel && registerPanel && switchToRegister && switchToLogin) {
    switchToRegister.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm('register');
    });
    
    switchToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      switchForm('login');
    });
  }
}

/**
 * Switch between login and register forms
 * @param {string} form - The form to display ('login' or 'register')
 */
function switchForm(form) {
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  
  if (loginPanel && registerPanel) {
    if (form === 'register') {
      loginPanel.classList.remove('fade-in');
      loginPanel.classList.add('fade-out');
      setTimeout(() => {
        loginPanel.classList.add('hidden');
        registerPanel.classList.remove('hidden');
        registerPanel.classList.remove('fade-out');
        registerPanel.classList.add('fade-in');
      }, 300);
    } else {
      registerPanel.classList.remove('fade-in');
      registerPanel.classList.add('fade-out');
      setTimeout(() => {
        registerPanel.classList.add('hidden');
        loginPanel.classList.remove('hidden');
        loginPanel.classList.remove('fade-out');
        loginPanel.classList.add('fade-in');
      }, 300);
    }
  }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in ms
 */
function showToast(message, type = 'info', duration = 3000) {
  // Create toast container if not exists
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.classList.add('toast-container');
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  
  // Add icon based on type
  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  if (type === 'error') icon = 'times-circle';
  if (type === 'warning') icon = 'exclamation-triangle';
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas fa-${icon}"></i>
    </div>
    <div class="toast-content">${message}</div>
    <button class="toast-close" aria-label="Close"><i class="fas fa-times"></i></button>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Add close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}
