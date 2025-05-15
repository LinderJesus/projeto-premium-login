/**
 * PREMIUM LOGIN SYSTEM
 * Animations JavaScript File
 * Version: 2.0
 */

// Wait for document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all animations
  initAnimationSystem();
});

/**
 * Initialize all animation systems
 */
function initAnimationSystem() {
  // Initialize particle system
  initParticleSystem();
  
  // Initialize 3D card effects
  init3DCardEffects();
  
  // Initialize typing effects
  initTypingEffects();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize floating elements
  initFloatingElements();
  
  // Initialize hover animations
  initHoverEffects();
  
  // Initialize counter animations
  initCounterAnimations();
}

/**
 * Initialize particle system for background effects
 */
function initParticleSystem() {
  // Check if canvas exists
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) {
    // Create canvas if it doesn't exist
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'particle-canvas';
    document.body.prepend(newCanvas);
    
    // Get canvas context
    const ctx = newCanvas.getContext('2d');
    
    // Set canvas size
    newCanvas.width = window.innerWidth;
    newCanvas.height = window.innerHeight;
    
    // Handle resize
    window.addEventListener('resize', () => {
      newCanvas.width = window.innerWidth;
      newCanvas.height = window.innerHeight;
    });
    
    // Particle properties
    const particlesArray = [];
    const numberOfParticles = 100;
    const colors = [
      'rgba(123, 44, 191, 0.5)',  // Primary color
      'rgba(247, 37, 133, 0.5)',  // Accent color
      'rgba(255, 255, 255, 0.3)'  // White
    ];
    
    // Create particle class
    class Particle {
      constructor() {
        this.x = Math.random() * newCanvas.width;
        this.y = Math.random() * newCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > newCanvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > newCanvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Initialize particles
    function init() {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    
    // Animate particles
    function animate() {
      ctx.clearRect(0, 0, newCanvas.width, newCanvas.height);
      
      // Draw and update each particle
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Draw connections between particles
      connectParticles();
      
      requestAnimationFrame(animate);
    }
    
    // Connect particles with lines
    function connectParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Initialize and start animation
    init();
    animate();
  }
}

/**
 * Initialize 3D card effects
 */
function init3DCardEffects() {
  const cards = document.querySelectorAll('.card-3d');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      // Apply transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      
      // Add highlight effect
      const glare = card.querySelector('.card-glare') || document.createElement('div');
      if (!card.querySelector('.card-glare')) {
        glare.classList.add('card-glare');
        card.appendChild(glare);
      }
      
      // Position glare based on mouse
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`;
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      
      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.opacity = '0';
      }
    });
    
    // Add touch support for mobile
    card.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Calculate rotation based on touch position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      // Apply transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
  });
}

/**
 * Initialize typing effects
 */
function initTypingEffects() {
  const typingElements = document.querySelectorAll('.typing-effect');
  
  typingElements.forEach(element => {
    // Get text and clear element
    const text = element.textContent;
    element.textContent = '';
    element.style.visibility = 'visible';
    
    // Text typing speed
    const speed = element.getAttribute('data-typing-speed') || 50;
    
    // Add characters one by one
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, speed);
      } else {
        // Add blinking cursor at the end
        element.classList.add('typing-done');
      }
    }
    
    // If element is in viewport, start typing
    if (isElementInViewport(element)) {
      typeChar();
    } else {
      // Use IntersectionObserver if available
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              typeChar();
              observer.unobserve(element);
            }
          });
        });
        
        observer.observe(element);
      } else {
        // Fallback
        window.addEventListener('scroll', function scrollHandler() {
          if (isElementInViewport(element)) {
            typeChar();
            window.removeEventListener('scroll', scrollHandler);
          }
        });
      }
    }
  });
  
  // Helper function to check if element is in viewport
  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-animate');
  
  // Set initial state
  elements.forEach(element => {
    const animation = element.getAttribute('data-animation') || 'fade-in';
    element.classList.add(animation);
    element.style.opacity = '0';
  });
  
  // Use IntersectionObserver if available
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.style.opacity = '1';
          element.classList.add('animated');
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for older browsers
    function checkPosition() {
      elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        if (position - window.innerHeight <= 0) {
          element.style.opacity = '1';
          element.classList.add('animated');
        }
      });
    }
    
    window.addEventListener('scroll', checkPosition);
    checkPosition();
  }
}

/**
 * Initialize floating elements animation
 */
function initFloatingElements() {
  const floatingElements = document.querySelectorAll('.float');
  
  floatingElements.forEach((elem, index) => {
    // Randomize animation parameters for each element
    const duration = 2 + Math.random() * 3;
    const delay = index * 0.2;
    
    // Apply animation with custom properties
    elem.style.animation = `float ${duration.toFixed(1)}s ease-in-out ${delay.toFixed(1)}s infinite alternate`;
  });
  
  // Create floating shapes dynamically
  const floatingArea = document.querySelector('.floating-area');
  if (floatingArea) {
    // Number of shapes to create
    const numShapes = 10;
    
    for (let i = 0; i < numShapes; i++) {
      const shape = document.createElement('div');
      shape.classList.add('floating-shape');
      
      // Randomize shape properties
      const size = 10 + Math.random() * 50;
      const opacity = 0.05 + Math.random() * 0.15;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = 20 + Math.random() * 40;
      const delay = Math.random() * 10;
      
      // Apply styles
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.opacity = opacity;
      shape.style.left = `${posX}%`;
      shape.style.top = `${posY}%`;
      shape.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
      
      // Random shape (circle, square, triangle)
      const shapeType = Math.floor(Math.random() * 3);
      if (shapeType === 0) {
        shape.style.borderRadius = '50%';
      } else if (shapeType === 1) {
        shape.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%';
      }
      
      // Random color
      const colors = ['var(--primary)', 'var(--accent)', 'var(--primary-light)'];
      shape.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      floatingArea.appendChild(shape);
    }
  }
}

/**
 * Initialize hover effects
 */
function initHoverEffects() {
  // Glow effect on hover
  const glowElements = document.querySelectorAll('.hover-glow');
  
  glowElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      elem.classList.add('glow');
    });
    
    elem.addEventListener('mouseleave', () => {
      elem.classList.remove('glow');
    });
  });
  
  // Scale effect on hover
  const scaleElements = document.querySelectorAll('.hover-scale');
  
  scaleElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      elem.style.transform = 'scale(1.05)';
    });
    
    elem.addEventListener('mouseleave', () => {
      elem.style.transform = 'scale(1)';
    });
  });
  
  // Button hover effect
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.classList.add('hover');
    });
    
    button.addEventListener('mouseleave', () => {
      button.classList.remove('hover');
    });
  });
}

/**
 * Initialize number counter animations
 */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = parseInt(counter.getAttribute('data-duration') || 2000);
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals') || 0);
    
    let startTime = null;
    const startValue = 0;
    
    // Use IntersectionObserver to start counter when visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter();
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(counter);
    } else {
      // Fallback
      animateCounter();
    }
    
    function animateCounter() {
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (target - startValue) + startValue);
        
        counter.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      }
      
      requestAnimationFrame(step);
    }
  });
}

/**
 * Initialize parallax effect
 */
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('mousemove', e => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax-speed') || 0.1);
      const x = (window.innerWidth / 2 - mouseX) * speed;
      const y = (window.innerHeight / 2 - mouseY) * speed;
      
      element.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
  });
}
