/**
 * PREMIUM LOGIN SYSTEM
 * Dashboard JavaScript File
 * Version: 2.0
 */

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if (!Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }
  
  // Initialize dashboard
  initializeDashboard();
});

/**
 * Initialize dashboard components
 */
function initializeDashboard() {
  // Set user data
  setUserData();
  
  // Initialize sidebar functionality
  initSidebar();
  
  // Initialize dropdown menus
  initDropdowns();
  
  // Initialize counter animations
  initCounters();
  
  // Initialize charts
  initCharts();
  
  // Initialize tasks
  initTasks();
  
  // Add 3D effects to cards
  init3DCards();
  
  // Add logout functionality
  setupLogout();
  
  // Show welcome animation
  playWelcomeAnimation();
}

/**
 * Set user data in dashboard UI
 */
function setUserData() {
  const user = Auth.getCurrentUser();
  
  if (user) {
    // Set user name
    const userNameElements = document.querySelectorAll('[data-user-info="username"]');
    userNameElements.forEach(el => {
      el.textContent = user.username || 'User';
    });
    
    // Set user avatar
    const userAvatarElements = document.querySelectorAll('[data-user-avatar]');
    userAvatarElements.forEach(el => {
      el.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=7b2cbf&color=fff`;
    });
    
    // Set other user data
    const userInfoElements = document.querySelectorAll('[data-user-info]');
    userInfoElements.forEach(el => {
      const field = el.getAttribute('data-user-info');
      if (user[field]) {
        el.textContent = user[field];
      }
    });
    
    console.log('User data set:', user.username);
  }
}

/**
 * Initialize sidebar functionality
 */
function initSidebar() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  // Toggle sidebar on menu button click
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      
      // Add overlay when sidebar is active on mobile
      if (sidebar.classList.contains('active')) {
        const overlay = document.createElement('div');
        overlay.classList.add('sidebar-overlay');
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('active');
          overlay.remove();
        });
      } else {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.remove();
      }
    });
  }
  
  // Close sidebar on close button click
  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('active');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.remove();
    });
  }
  
  // Add active class to current nav item
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // If it's not a logout button
      if (!this.id || this.id !== 'logoutBtn') {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(el => {
          el.parentElement.classList.remove('active');
        });
        
        // Add active class to the clicked link
        this.parentElement.classList.add('active');
        
        // Change page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
          pageTitle.textContent = this.querySelector('span').textContent;
        }
        
        // Update breadcrumbs
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (breadcrumbs) {
          breadcrumbs.innerHTML = `
            <a href="#">Home</a> / <span>${this.querySelector('span').textContent}</span>
          `;
        }
        
        // Close sidebar on mobile
        if (window.innerWidth < 992) {
          sidebar.classList.remove('active');
          const overlay = document.querySelector('.sidebar-overlay');
          if (overlay) overlay.remove();
        }
      }
    });
  });
}

/**
 * Initialize dropdown menus
 */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.user-dropdown');
  
  dropdowns.forEach(dropdown => {
    const dropdownBtn = dropdown.querySelector('.user-dropdown-btn');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    
    if (dropdownBtn && dropdownMenu) {
      dropdownBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = dropdownMenu.classList.contains('active');
        
        // Close all other active dropdowns
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
          menu.classList.remove('active');
        });
        
        // Toggle current dropdown
        if (!isActive) {
          dropdownMenu.classList.add('active');
        }
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
      menu.classList.remove('active');
    });
  });
  
  // Logout button in dropdown
  const logoutDropdownBtn = document.getElementById('logoutDropdownBtn');
  if (logoutDropdownBtn) {
    logoutDropdownBtn.addEventListener('click', function(e) {
      e.preventDefault();
      Auth.logout();
    });
  }
}

/**
 * Initialize number counters
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // ms
    
    let startValue = 0;
    let startTime = null;
    
    function updateCounter(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * (target - startValue) + startValue);
      
      counter.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    }
    
    // Use IntersectionObserver for counters
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(updateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

/**
 * Initialize charts
 */
function initCharts() {
  // This is a placeholder for actual chart library initialization
  // In a real application, this would use a library like Chart.js
  
  // For our demo, animate the chart bars
  const chartBars = document.querySelectorAll('.chart-bar');
  
  chartBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.classList.add('animated');
    }, index * 100);
  });
}

/**
 * Initialize tasks
 */
function initTasks() {
  const taskCheckboxes = document.querySelectorAll('.task-checkbox input[type="checkbox"]');
  
  taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskText = this.closest('.task-item').querySelector('.task-text');
      if (this.checked) {
        taskText.classList.add('completed');
      } else {
        taskText.classList.remove('completed');
      }
      
      // Show toast notification
      if (this.checked) {
        showToast('Task completed!', 'success');
      }
    });
  });
}

/**
 * Add 3D effects to cards
 */
function init3DCards() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on cursor position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      // Apply transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      // Add shine effect
      const shine = card.querySelector('.shine') || document.createElement('div');
      if (!card.querySelector('.shine')) {
        shine.classList.add('shine');
        card.appendChild(shine);
      }
      
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      const shine = card.querySelector('.shine');
      if (shine) {
        shine.remove();
      }
    });
  });
}

/**
 * Setup logout functionality
 */
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Add fade out animation
      document.body.classList.add('fade-out');
      
      // Wait for animation to complete
      setTimeout(() => {
        Auth.logout();
      }, 500);
    });
  }
}

/**
 * Play welcome animation
 */
function playWelcomeAnimation() {
  document.body.classList.add('loaded');
  
  setTimeout(() => {
    const welcomeCard = document.querySelector('.welcome-card');
    
    if (welcomeCard) {
      welcomeCard.classList.add('pulse');
      
      setTimeout(() => {
        welcomeCard.classList.remove('pulse');
      }, 1000);
    }
  }, 500);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of message: 'success', 'error', 'warning', 'info'
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
    <button class="toast-close"><i class="fas fa-times"></i></button>
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

/**
 * Handle window resize
 */
window.addEventListener('resize', function() {
  // Reset 3D card effects on resize
  const cards = document.querySelectorAll('.card-3d');
  cards.forEach(card => {
    card.style.transform = '';
    const shine = card.querySelector('.shine');
    if (shine) {
      shine.remove();
    }
  });
});
