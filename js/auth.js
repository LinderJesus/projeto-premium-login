/**
 * PREMIUM LOGIN SYSTEM
 * Authentication JavaScript File
 * Version: 2.0
 */

// Authentication state
const AUTH = {
  currentUser: null,
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  expiry: null
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check for existing session
  checkAuthStatus();
  
  // Initialize login form handler
  initLoginForm();
  
  // Initialize register form handler
  initRegisterForm();
});

/**
 * Check if user is already authenticated
 */
function checkAuthStatus() {
  const token = localStorage.getItem('auth_token');
  const refreshToken = localStorage.getItem('auth_refresh_token');
  const expiry = localStorage.getItem('auth_expiry');
  const userData = localStorage.getItem('auth_user');
  
  if (token && refreshToken && expiry && userData) {
    try {
      // Parse user data
      const user = JSON.parse(userData);
      
      // Check token expiry
      const expiryDate = new Date(parseInt(expiry));
      const now = new Date();
      
      if (expiryDate > now) {
        // Valid session
        AUTH.currentUser = user;
        AUTH.isLoggedIn = true;
        AUTH.token = token;
        AUTH.refreshToken = refreshToken;
        AUTH.expiry = expiryDate;
        
        // Update UI for logged in state
        updateAuthUI(true);
        
        console.log('User authenticated:', user.username);
        
        // Auto redirect if on login page but already logged in
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
          redirectToDashboard();
        }
      } else {
        // Token expired, attempt refresh
        refreshAuthToken();
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
      clearAuth();
    }
  } else {
    // No authentication data
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
      // Redirect to login if accessing restricted page
      redirectToLogin();
    }
  }
}

/**
 * Initialize login form handler
 */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    // Adicionar validação em tempo real nos campos
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    // Validar email em tempo real
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        validateLoginField(this, validateEmail(this.value), 'emailHelp');
      });
      
      emailInput.addEventListener('input', function() {
        // Remover mensagem de erro quando o usuário começa a digitar novamente
        if (this.classList.contains('is-invalid')) {
          this.classList.remove('is-invalid');
          document.getElementById('emailHelp').style.display = 'none';
        }
      });
    }
    
    // Validar senha em tempo real
    if (passwordInput) {
      passwordInput.addEventListener('blur', function() {
        validateLoginField(this, (this.value && this.value.length >= 6), 'passwordHelp');
      });
      
      passwordInput.addEventListener('input', function() {
        // Remover mensagem de erro quando o usuário começa a digitar novamente
        if (this.classList.contains('is-invalid')) {
          this.classList.remove('is-invalid');
          document.getElementById('passwordHelp').style.display = 'none';
        }
      });
    }
    
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form data
      const email = emailInput.value;
      const password = passwordInput.value;
      const remember = document.getElementById('rememberMe')?.checked || false;
      
      // Validar todos os campos antes de enviar
      let isValid = true;
      
      // Validar email
      if (!validateEmail(email)) {
        validateLoginField(emailInput, false, 'emailHelp');
        isValid = false;
      }
      
      // Validar senha
      if (!password || password.length < 6) {
        validateLoginField(passwordInput, false, 'passwordHelp');
        isValid = false;
      }
      
      // Se houver erros, não prosseguir
      if (!isValid) {
        showAuthError('Por favor, corrija os erros no formulário');
        return;
      }
      
      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span> Authenticating...';
      
      // Simular tempo de espera para verificação de segurança
      const minDelay = 1500; // Tempo mínimo de espera em ms
      const startTime = Date.now();
      
      // Make login request
      login(email, password, remember)
        .then(response => {
          // Calcular tempo decorrido
          const elapsedTime = Date.now() - startTime;
          const remainingDelay = Math.max(0, minDelay - elapsedTime);
          
          // Garantir um tempo mínimo de espera para parecer mais seguro
          setTimeout(() => {
            // Success feedback
            submitButton.innerHTML = '<i class="fas fa-check"></i> Login bem-sucedido!';
            submitButton.classList.remove('btn-primary');
            submitButton.classList.add('btn-success');
            
            // Mostrar mensagem de redirecionamento
            showAuthSuccess('Redirecionando para o dashboard...');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              redirectToDashboard();
            }, 1500);
          }, remainingDelay);
        })
        .catch(error => {
          // Error feedback
          showAuthError(error.message || 'Login failed. Please try again.');
          resetButton();
        });
      
      // Reset button state
      function resetButton() {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }
}

/**
 * Initialize register form handler
 */
function initRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form data
      const username = document.getElementById('registerUsername').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span> Creating Account...';
      
      // Validate form data
      if (!username || username.length < 3) {
        showAuthError('Username must be at least 3 characters long');
        resetButton();
        return;
      }
      
      if (!validateEmail(email)) {
        showAuthError('Please enter a valid email address');
        resetButton();
        return;
      }
      
      if (!password || password.length < 8) {
        showAuthError('Password must be at least 8 characters long');
        resetButton();
        return;
      }
      
      if (password !== confirmPassword) {
        showAuthError('Passwords do not match');
        resetButton();
        return;
      }
      
      // Make register request
      register(username, email, password)
        .then(response => {
          // Success feedback
          submitButton.innerHTML = '<i class="fas fa-check"></i> Account Created!';
          submitButton.classList.remove('btn-primary');
          submitButton.classList.add('btn-success');
          
          // Show success message and switch to login form
          showToast('Account created successfully! Please log in.', 'success');
          
          setTimeout(() => {
            switchForm('login');
            resetButton();
          }, 2000);
        })
        .catch(error => {
          // Error feedback
          showAuthError(error.message || 'Registration failed. Please try again.');
          resetButton();
        });
      
      // Reset button state
      function resetButton() {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }
}

/**
 * Login API request
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} remember - Remember user
 * @returns {Promise} - Authentication response
 */
function login(email, password, remember = false) {
  return new Promise((resolve, reject) => {
    // In a real implementation, this would be an API request
    // For demo purposes, we'll simulate successful login
    
    // Simulate API request delay
    setTimeout(() => {
      try {
        // Demo implementation - normally this would be a server response
        // For demo, we'll check for a specific test account
        if (email === 'demo@example.com' && password === 'password123') {
          // Create demo user data
          const user = {
            id: 'user_demo_123',
            username: 'DemoUser',
            email: email,
            firstName: 'Demo',
            lastName: 'User',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=7b2cbf&color=fff&size=256',
            role: 'user',
            createdAt: new Date().toISOString()
          };
          
          // Create token data (normally from server)
          const token = 'sample_jwt_token_' + Math.random().toString(36).substring(2);
          const refreshToken = 'sample_refresh_token_' + Math.random().toString(36).substring(2);
          
          // Set expiry to 1 hour from now
          const expiry = new Date();
          expiry.setHours(expiry.getHours() + (remember ? 24 : 1));
          
          // Save auth data
          saveAuthData(user, token, refreshToken, expiry);
          
          // Resolve the promise with user data
          resolve(user);
        } else {
          // Failed login
          reject(new Error('Invalid email or password'));
        }
      } catch (error) {
        reject(error);
      }
    }, 1500);
  });
}

/**
 * Register API request
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Promise} - Registration response
 */
function register(username, email, password) {
  return new Promise((resolve, reject) => {
    // In a real implementation, this would be an API request
    // For demo purposes, we'll simulate successful registration
    
    // Simulate API request delay
    setTimeout(() => {
      try {
        // For demo, create a user object that would normally come from the server
        const user = {
          id: 'user_' + Math.random().toString(36).substring(2),
          username: username,
          email: email,
          createdAt: new Date().toISOString()
        };
        
        // In a real app, the server would handle password hashing and user creation
        
        // Resolve the promise with user data
        resolve(user);
      } catch (error) {
        reject(error);
      }
    }, 2000);
  });
}

/**
 * Log out the current user
 */
function logout() {
  // Show confirmation dialog
  if (confirm('Are you sure you want to log out?')) {
    // Clear auth data
    clearAuth();
    
    // Redirect to login
    redirectToLogin();
  }
}

/**
 * Save authentication data to local storage
 * @param {Object} user - User data
 * @param {string} token - Authentication token
 * @param {string} refreshToken - Refresh token
 * @param {Date} expiry - Token expiry date
 */
function saveAuthData(user, token, refreshToken, expiry) {
  // Update AUTH object
  AUTH.currentUser = user;
  AUTH.isLoggedIn = true;
  AUTH.token = token;
  AUTH.refreshToken = refreshToken;
  AUTH.expiry = expiry;
  
  // Save to local storage
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_refresh_token', refreshToken);
  localStorage.setItem('auth_expiry', expiry.getTime());
  localStorage.setItem('auth_user', JSON.stringify(user));
  
  // Update UI
  updateAuthUI(true);
}

/**
 * Clear authentication data
 */
function clearAuth() {
  // Update AUTH object
  AUTH.currentUser = null;
  AUTH.isLoggedIn = false;
  AUTH.token = null;
  AUTH.refreshToken = null;
  AUTH.expiry = null;
  
  // Remove from local storage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_refresh_token');
  localStorage.removeItem('auth_expiry');
  localStorage.removeItem('auth_user');
  
  // Update UI
  updateAuthUI(false);
}

/**
 * Update UI based on authentication state
 * @param {boolean} isAuthenticated - Is the user authenticated
 */
function updateAuthUI(isAuthenticated) {
  // Update elements based on authentication state
  const authButtons = document.querySelectorAll('[data-auth-required]');
  const guestButtons = document.querySelectorAll('[data-guest-only]');
  
  if (isAuthenticated) {
    // Show elements that require authentication
    authButtons.forEach(el => {
      el.classList.remove('hidden');
    });
    
    // Hide elements for guests only
    guestButtons.forEach(el => {
      el.classList.add('hidden');
    });
    
    // Update user profile elements if they exist
    const userElements = document.querySelectorAll('[data-user-info]');
    userElements.forEach(el => {
      const field = el.getAttribute('data-user-info');
      if (AUTH.currentUser && AUTH.currentUser[field]) {
        el.textContent = AUTH.currentUser[field];
      }
    });
    
    // Update avatar if exists
    const avatarElements = document.querySelectorAll('[data-user-avatar]');
    if (AUTH.currentUser && AUTH.currentUser.avatar) {
      avatarElements.forEach(el => {
        el.src = AUTH.currentUser.avatar;
      });
    }
  } else {
    // Hide elements that require authentication
    authButtons.forEach(el => {
      el.classList.add('hidden');
    });
    
    // Show elements for guests only
    guestButtons.forEach(el => {
      el.classList.remove('hidden');
    });
  }
}

/**
 * Refresh the authentication token
 * @returns {Promise} - Authentication refresh response
 */
function refreshAuthToken() {
  return new Promise((resolve, reject) => {
    // In a real implementation, this would be an API request using the refresh token
    // For demo purposes, we'll simulate token refresh
    
    // Get refresh token
    const refreshToken = AUTH.refreshToken || localStorage.getItem('auth_refresh_token');
    
    if (!refreshToken) {
      clearAuth();
      reject(new Error('No refresh token available'));
      return;
    }
    
    // Simulate API request delay
    setTimeout(() => {
      try {
        // Demo implementation - normally this would be a server response
        // Create new token data (normally from server)
        const token = 'refreshed_jwt_token_' + Math.random().toString(36).substring(2);
        
        // Set new expiry to 1 hour from now
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        
        // Get current user data
        const userData = localStorage.getItem('auth_user');
        const user = userData ? JSON.parse(userData) : null;
        
        if (user) {
          // Save auth data with new token and expiry
          saveAuthData(user, token, refreshToken, expiry);
          resolve(user);
        } else {
          clearAuth();
          reject(new Error('Invalid user data'));
        }
      } catch (error) {
        clearAuth();
        reject(error);
      }
    }, 1000);
  });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is email valid
 */
function validateEmail(email) {
  // Regex mais rigorosa para validação de email
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with score and feedback
 */
function validatePassword(password) {
  // Critérios de validação
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  // Calcular pontuação (0-100)
  let score = 0;
  let feedback = '';
  
  // Verificar comprimento
  if (password.length >= minLength) {
    score += 20;
  } else {
    feedback = 'A senha deve ter pelo menos ' + minLength + ' caracteres';
    return { score, feedback, valid: false };
  }
  
  // Verificar complexidade
  if (hasUpperCase) score += 20;
  if (hasLowerCase) score += 20;
  if (hasNumbers) score += 20;
  if (hasSpecialChar) score += 20;
  
  // Feedback baseado na pontuação
  if (score < 40) {
    feedback = 'Senha muito fraca';
  } else if (score < 60) {
    feedback = 'Senha fraca';
  } else if (score < 80) {
    feedback = 'Senha média';
  } else if (score < 100) {
    feedback = 'Senha forte';
  } else {
    feedback = 'Senha muito forte';
  }
  
  return {
    score,
    feedback,
    valid: score >= 60, // Considera válida se tiver pelo menos 60 pontos
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    validLength: password.length >= minLength
  };
}

/**
 * Validate login form field
 * @param {HTMLElement} field - Form field to validate
 * @param {boolean} isValid - Is the field valid
 * @param {string} helperId - ID of the helper/error message element
 */
function validateLoginField(field, isValid, helperId) {
  const helperElement = document.getElementById(helperId);
  
  if (!isValid) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    if (helperElement) {
      helperElement.style.display = 'block';
    }
  } else {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (helperElement) {
      helperElement.style.display = 'none';
    }
  }
}

/**
 * Show authentication error message
 * @param {string} message - Error message
 */
function showAuthError(message) {
  // Get error container
  const errorContainer = document.getElementById('authError');
  
  if (!errorContainer) {
    // Create error container if it doesn't exist
    const newErrorContainer = document.createElement('div');
    newErrorContainer.id = 'authError';
    newErrorContainer.classList.add('auth-error');
    
    // Find form to append error to
    const activeForm = document.querySelector('.auth-form:not(.hidden)');
    if (activeForm) {
      activeForm.prepend(newErrorContainer);
    }
    
    showAuthError(message); // Call again now that container exists
    return;
  }
  
  // Display error message with icon
  errorContainer.innerHTML = `
    <div class="error-content">
      <div class="error-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <div class="error-message">${message}</div>
    </div>
    <button type="button" class="error-close" aria-label="Fechar mensagem de erro">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Adicionar classe para mostrar o erro
  errorContainer.classList.add('visible');
  errorContainer.classList.add('shake');
  
  // Adicionar funcionalidade para fechar o erro
  const closeButton = errorContainer.querySelector('.error-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      errorContainer.classList.remove('visible');
    });
  }
  
  // Remove shake animation after it completes
  setTimeout(() => {
    errorContainer.classList.remove('shake');
  }, 800);
  
  // Auto hide after delay
  setTimeout(() => {
    errorContainer.classList.remove('visible');
  }, 5000);
}

/**
 * Show authentication success message
 * @param {string} message - Success message
 */
function showAuthSuccess(message) {
  // Verificar se já existe um container de sucesso
  let successContainer = document.querySelector('.auth-success');
  
  if (!successContainer) {
    // Criar container se não existir
    successContainer = document.createElement('div');
    successContainer.className = 'auth-success';
    
    // Encontrar onde inserir
    const activeForm = document.querySelector('.auth-form:not(.hidden)');
    if (activeForm) {
      // Inserir após o título ou no início do formulário
      const authHeader = document.querySelector('.auth-header');
      if (authHeader && authHeader.nextElementSibling) {
        authHeader.parentNode.insertBefore(successContainer, authHeader.nextElementSibling);
      } else if (activeForm) {
        activeForm.prepend(successContainer);
      }
    }
  }
  
  // Exibir mensagem com ícone
  successContainer.innerHTML = `
    <div class="success-content">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="success-message">${message}</div>
    </div>
  `;
  
  // Adicionar classe para mostrar
  successContainer.classList.add('visible');
  successContainer.classList.add('scale-in');
}

/**
 * Redirect to dashboard
 */
function redirectToDashboard() {
  window.location.href = 'dashboard.html';
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
  window.location.href = 'index.html';
}

/**
 * Get current user
 * @returns {Object} - Current user data or null
 */
function getCurrentUser() {
  return AUTH.currentUser;
}

/**
 * Check if user is logged in
 * @returns {boolean} - Is user logged in
 */
function isLoggedIn() {
  return AUTH.isLoggedIn;
}

/**
 * Get authentication token
 * @returns {string} - Authentication token
 */
function getAuthToken() {
  return AUTH.token;
}

// Export auth methods globally
window.Auth = {
  login,
  register,
  logout,
  getCurrentUser,
  isLoggedIn,
  getAuthToken
};
