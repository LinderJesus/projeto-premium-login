/**
 * PREMIUM LOGIN SYSTEM
 * Theme Switcher JavaScript File
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();
  
  // Initialize password validation
  initPasswordValidation();
  
  // Initialize forgot password modal
  initForgotPasswordModal();
  
  // Initialize form validation
  initFormValidation();
  
  // Adicionar classes para animações
  animateFormElements();
  
  // Adicionar efeito de focus nos inputs
  enhanceInputFocus();
});

/**
 * Initialize theme functionality
 */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const icon = themeToggle.querySelector('i');
  
  // Check for saved theme preference or use default
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme === 'dark' ? 'dark' : 'light');
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeIcon(newTheme);
  });
  
  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

/**
 * Initialize password validation
 */
function initPasswordValidation() {
  const registerPassword = document.getElementById('registerPassword');
  const passwordRequirements = document.querySelectorAll('.password-requirement');
  const strengthMeter = document.querySelector('.strength-meter-fill');
  const strengthText = document.querySelector('.strength-text');
  
  if (!registerPassword) return;
  
  registerPassword.addEventListener('input', function() {
    const password = this.value;
    
    // Check password requirements
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    
    // Update requirement indicators
    passwordRequirements.forEach(req => {
      const type = req.getAttribute('data-requirement');
      if (requirements[type]) {
        req.classList.add('requirement-met');
      } else {
        req.classList.remove('requirement-met');
      }
    });
    
    // Calculate password strength
    let strength = 0;
    let feedback = '';
    
    if (password.length > 0) {
      // Add points for each requirement met
      Object.values(requirements).forEach(met => {
        if (met) strength += 20;
      });
      
      // Set color and text based on strength
      if (strength <= 20) {
        strengthMeter.style.width = '20%';
        strengthMeter.style.backgroundColor = 'var(--error)';
        feedback = 'Muito fraca';
      } else if (strength <= 40) {
        strengthMeter.style.width = '40%';
        strengthMeter.style.backgroundColor = 'var(--warning)';
        feedback = 'Fraca';
      } else if (strength <= 60) {
        strengthMeter.style.width = '60%';
        strengthMeter.style.backgroundColor = 'var(--warning)';
        feedback = 'Média';
      } else if (strength <= 80) {
        strengthMeter.style.width = '80%';
        strengthMeter.style.backgroundColor = 'var(--success)';
        feedback = 'Forte';
      } else {
        strengthMeter.style.width = '100%';
        strengthMeter.style.backgroundColor = 'var(--success)';
        feedback = 'Muito forte';
      }
    } else {
      strengthMeter.style.width = '0';
      feedback = '';
    }
    
    strengthText.textContent = feedback;
  });
  
  // Initialize toggle password visibility
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.closest('.input-wrapper').querySelector('input');
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
        this.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
        this.setAttribute('aria-label', 'Show password');
      }
    });
    
    // Allow keyboard interaction
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

/**
 * Initialize forgot password modal
 */
function initForgotPasswordModal() {
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const closeModal = document.getElementById('closeModal');
  
  if (!forgotPasswordLink || !forgotPasswordModal) return;
  
  // Open modal
  forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    forgotPasswordModal.classList.add('visible');
  });
  
  // Close modal
  closeModal.addEventListener('click', function() {
    forgotPasswordModal.classList.remove('visible');
  });
  
  // Close modal on outside click
  forgotPasswordModal.addEventListener('click', function(e) {
    if (e.target === forgotPasswordModal) {
      forgotPasswordModal.classList.remove('visible');
    }
  });
  
  // Handle recovery steps
  const recoveryEmailForm = document.getElementById('recoveryEmailForm');
  const verificationCodeForm = document.getElementById('verificationCodeForm');
  const newPasswordForm = document.getElementById('newPasswordForm');
  const resendCodeBtn = document.getElementById('resendCode');
  
  if (recoveryEmailForm) {
    recoveryEmailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate sending verification code
      const email = document.getElementById('recoveryEmail').value;
      
      if (!email) {
        showToast('Por favor, insira seu email', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';
      
      // Simulate API call delay
      setTimeout(() => {
        // Move to next step
        goToStep(2);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Show success message
        showToast(`Código enviado para ${email}`, 'success');
      }, 1500);
    });
  }
  
  if (verificationCodeForm) {
    verificationCodeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate code verification
      const code = document.getElementById('verificationCode').value;
      
      if (!code || code.length !== 6) {
        showToast('Por favor, insira o código de 6 dígitos', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Verificando...';
      
      // Simulate API call delay
      setTimeout(() => {
        // Move to next step
        goToStep(3);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Show success message
        showToast('Código verificado com sucesso', 'success');
      }, 1500);
    });
  }
  
  if (newPasswordForm) {
    newPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmNewPassword').value;
      
      // Validate passwords
      if (!newPassword || newPassword.length < 6) {
        showToast('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showToast('As senhas não coincidem', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading-spinner"></span> Redefinindo...';
      
      // Simulate API call delay
      setTimeout(() => {
        // Close modal
        forgotPasswordModal.classList.remove('visible');
        
        // Reset form and go back to step 1
        this.reset();
        goToStep(1);
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Show success message
        showToast('Senha redefinida com sucesso! Faça login com sua nova senha.', 'success');
      }, 1500);
    });
  }
  
  if (resendCodeBtn) {
    resendCodeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Disable link
      this.style.pointerEvents = 'none';
      this.style.opacity = '0.5';
      
      // Show toast
      showToast('Enviando novo código...', 'info');
      
      // Simulate API call delay
      setTimeout(() => {
        // Re-enable link
        this.style.pointerEvents = 'auto';
        this.style.opacity = '1';
        
        // Show success message
        showToast('Novo código enviado para seu email', 'success');
      }, 2000);
    });
  }
  
  // Function to navigate between steps
  function goToStep(step) {
    // Update steps indicators
    document.querySelectorAll('.step').forEach(s => {
      const stepNum = parseInt(s.getAttribute('data-step'));
      
      if (stepNum < step) {
        s.classList.remove('active');
        s.classList.add('completed');
      } else if (stepNum === step) {
        s.classList.add('active');
        s.classList.remove('completed');
      } else {
        s.classList.remove('active');
        s.classList.remove('completed');
      }
    });
    
    // Show current step form
    document.querySelectorAll('.recovery-step').forEach(form => {
      const formStep = parseInt(form.getAttribute('data-step'));
      
      if (formStep === step) {
        form.classList.remove('hidden');
      } else {
        form.classList.add('hidden');
      }
    });
  }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const email = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');
      let isValid = true;
      
      // Add validation class
      this.classList.add('was-validated');
      
      // Validate email
      if (!email.value || !validateEmail(email.value)) {
        isValid = false;
      }
      
      // Validate password
      if (!password.value || password.value.length < 6) {
        isValid = false;
      }
      
      // If form is invalid, prevent submission
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const username = document.getElementById('registerUsername');
      const email = document.getElementById('registerEmail');
      const password = document.getElementById('registerPassword');
      const confirmPassword = document.getElementById('confirmPassword');
      const agreeTerms = document.getElementById('agreeTerms');
      let isValid = true;
      
      // Add validation class
      this.classList.add('was-validated');
      
      // Validate username
      if (!username.value || username.value.length < 3) {
        isValid = false;
      }
      
      // Validate email
      if (!email.value || !validateEmail(email.value)) {
        isValid = false;
      }
      
      // Validate password
      if (!password.value || password.value.length < 8) {
        isValid = false;
      }
      
      // Validate confirm password
      if (!confirmPassword.value || confirmPassword.value !== password.value) {
        isValid = false;
      }
      
      // Validate terms agreement
      if (!agreeTerms.checked) {
        isValid = false;
      }
      
      // If form is invalid, prevent submission
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
  
  // Validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
}

/**
 * Animate form elements with staggered delay
 */
function animateFormElements() {
  // Adicionar classes de animação aos formulários
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => {
    if (!form.classList.contains('hidden')) {
      form.classList.add('fade-in');
    }
  });
  
  // Adicionar observers para animar formulários quando alternam entre login e registro
  const loginSwitch = document.getElementById('switchToLogin');
  const registerSwitch = document.getElementById('switchToRegister');
  
  if (loginSwitch) {
    loginSwitch.addEventListener('click', function(e) {
      e.preventDefault();
      const loginForm = document.getElementById('loginPanel');
      const registerForm = document.getElementById('registerPanel');
      
      registerForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      loginForm.classList.remove('fade-in');
      
      // Forçar reflow para reiniciar animação
      void loginForm.offsetWidth;
      loginForm.classList.add('fade-in');
    });
  }
  
  if (registerSwitch) {
    registerSwitch.addEventListener('click', function(e) {
      e.preventDefault();
      const loginForm = document.getElementById('loginPanel');
      const registerForm = document.getElementById('registerPanel');
      
      loginForm.classList.add('hidden');
      registerForm.classList.remove('hidden');
      registerForm.classList.remove('fade-in');
      
      // Forçar reflow para reiniciar animação
      void registerForm.offsetWidth;
      registerForm.classList.add('fade-in');
    });
  }
}

/**
 * Enhance input focus effects
 */
function enhanceInputFocus() {
  const inputs = document.querySelectorAll('.form-control');
  
  inputs.forEach(input => {
    // Adicionar efeito ao receber foco
    input.addEventListener('focus', function() {
      const wrapper = this.closest('.input-wrapper');
      if (wrapper) {
        wrapper.style.boxShadow = '0 0 0 2px rgba(123, 44, 191, 0.25)';
        wrapper.style.borderColor = 'var(--primary)';
      }
      
      // Adicionar classe ao label
      const labelFor = this.getAttribute('id');
      if (labelFor) {
        const label = document.querySelector(`label[for="${labelFor}"]`);
        if (label) {
          label.style.color = 'var(--primary)';
        }
      }
    });
    
    // Remover efeito ao perder foco
    input.addEventListener('blur', function() {
      const wrapper = this.closest('.input-wrapper');
      if (wrapper) {
        wrapper.style.boxShadow = '';
        wrapper.style.borderColor = '';
      }
      
      // Remover classe do label
      const labelFor = this.getAttribute('id');
      if (labelFor) {
        const label = document.querySelector(`label[for="${labelFor}"]`);
        if (label) {
          label.style.color = '';
        }
      }
    });
  });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
  const toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) return;
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Add icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-exclamation-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    case 'info':
    default:
      icon = '<i class="fas fa-info-circle"></i>';
      break;
  }
  
  // Set toast content
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Add close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });
  
  // Auto remove after delay
  setTimeout(() => {
    removeToast(toast);
  }, 5000);
  
  function removeToast(toast) {
    toast.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
      toast.remove();
    }, 300);
  }
}
