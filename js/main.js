/**
 * Main entry point for Stickman Animator Portfolio
 * Initializes all components and manages application lifecycle
 */

// Import modules
import { Gallery } from './gallery.js';
import { ShimejiCharacter } from './shimeji-character.js';
// import { InputHandler } from './shimeji/input-handler.js';
// import { AnimationLoop } from './shimeji/animation-loop.js';

/**
 * Application state
 */
const app = {
  gallery: null,
  character: null,
  animationLoop: null,
  isInitialized: false
};

/**
 * Initialize the application
 */
function init() {
  console.log('Initializing Stickman Animator Portfolio...');
  
  // Check for required browser features
  if (!checkBrowserSupport()) {
    showFallbackMessage();
    return;
  }
  
  // Initialize portfolio UI components
  initializePortfolio();
  
  // Initialize shimeji character
  initializeCharacter();
  
  // Set up event listeners
  setupEventListeners();
  
  app.isInitialized = true;
  console.log('Application initialized successfully');
}

/**
 * Check if browser supports required features
 */
function checkBrowserSupport() {
  const hasCanvas = !!document.createElement('canvas').getContext;
  const hasRequestAnimationFrame = 'requestAnimationFrame' in window;
  
  return hasCanvas && hasRequestAnimationFrame;
}

/**
 * Show fallback message for unsupported browsers
 */
function showFallbackMessage() {
  const message = document.createElement('div');
  message.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded shadow-lg z-50';
  message.innerHTML = `
    <p class="font-semibold">Browser Compatibility Notice</p>
    <p class="text-sm mt-2">Your browser doesn't support all features. The interactive character may not be available, but you can still view the portfolio content.</p>
  `;
  document.body.appendChild(message);
}

/**
 * Initialize portfolio UI components
 */
function initializePortfolio() {
  // Initialize gallery with sample data
  initializeGallery();
  
  // Set up smooth scroll for navigation
  setupSmoothScroll();
  
  // Set up contact form
  setupContactForm();
}

/**
 * Initialize gallery with sample items
 */
function initializeGallery() {
  // Sample gallery items (placeholder data)
  const galleryItems = [
    {
      id: 'anim-1',
      title: 'Action Sequence',
      description: 'Dynamic stickman fight scene with fluid movements',
      src: 'assets/animations/action-sequence.gif',
      thumbnail: 'assets/animations/action-sequence-thumb.jpg',
      alt: 'Stickman performing action sequence with punches and kicks',
      type: 'gif'
    },
    {
      id: 'anim-2',
      title: 'Parkour Run',
      description: 'Stickman navigating obstacles with parkour moves',
      src: 'assets/animations/parkour-run.gif',
      thumbnail: 'assets/animations/parkour-run-thumb.jpg',
      alt: 'Stickman performing parkour movements over obstacles',
      type: 'gif'
    },
    {
      id: 'anim-3',
      title: 'Dance Animation',
      description: 'Smooth dance routine with rhythm and style',
      src: 'assets/animations/dance.gif',
      thumbnail: 'assets/animations/dance-thumb.jpg',
      alt: 'Stickman performing dance moves',
      type: 'gif'
    },
    {
      id: 'anim-4',
      title: 'Combat Training',
      description: 'Intense martial arts training sequence',
      src: 'assets/animations/combat-training.gif',
      thumbnail: 'assets/animations/combat-training-thumb.jpg',
      alt: 'Stickman practicing martial arts moves',
      type: 'gif'
    },
    {
      id: 'anim-5',
      title: 'Acrobatic Flip',
      description: 'Impressive acrobatic flips and aerial maneuvers',
      src: 'assets/animations/acrobatic-flip.gif',
      thumbnail: 'assets/animations/acrobatic-flip-thumb.jpg',
      alt: 'Stickman performing acrobatic flips',
      type: 'gif'
    },
    {
      id: 'anim-6',
      title: 'Speed Run',
      description: 'High-speed running animation with motion blur effects',
      src: 'assets/animations/speed-run.gif',
      thumbnail: 'assets/animations/speed-run-thumb.jpg',
      alt: 'Stickman running at high speed',
      type: 'gif'
    }
  ];
  
  // Initialize Gallery class
  app.gallery = new Gallery('gallery-container', galleryItems);
}

/**
 * Set up smooth scroll for navigation links
 */
function setupSmoothScroll() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu after navigation
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          closeMobileMenu();
        }
      }
    });
  });
}

/**
 * Set up mobile menu toggle functionality
 */
function setupMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const isClickInsideNav = e.target.closest('nav');
    const isMenuOpen = !mobileMenu.classList.contains('hidden');
    
    if (!isClickInsideNav && isMenuOpen) {
      closeMobileMenu();
    }
  });
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  mobileMenu.classList.remove('hidden');
  menuToggle.setAttribute('aria-expanded', 'true');
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  mobileMenu.classList.add('hidden');
  menuToggle.setAttribute('aria-expanded', 'false');
}

/**
 * Set up contact form submission
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const successMessage = document.getElementById('contact-success');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Contact form submitted:', data);
    
    // Show success message (in production, this would send to a server)
    successMessage.classList.remove('hidden');
    form.reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.classList.add('hidden');
    }, 5000);
    
    // Scroll success message into view
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
  // Character toggle buttons (will be implemented in future tasks)
  const toggleButton = document.getElementById('toggle-character');
  const toggleButtonMobile = document.getElementById('toggle-character-mobile');
  
  toggleButton.addEventListener('click', () => {
    if (app.character) {
      app.character.toggleVisibility();
      console.log('Character visibility toggled');
    }
  });
  
  toggleButtonMobile.addEventListener('click', () => {
    if (app.character) {
      app.character.toggleVisibility();
      console.log('Character visibility toggled');
    }
  });
  
  // Mobile menu toggle
  setupMobileMenu();
  
  // Handle window resize for responsive adjustments
  window.addEventListener('resize', handleResize);
}

/**
 * Handle window resize events
 */
function handleResize() {
  // Future: Update character canvas size
  // Future: Update collision detection boundaries
  console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
}

/**
 * Initialize character
 */
function initializeCharacter() {
  try {
    // Create ShimejiCharacter instance
    app.character = new ShimejiCharacter('shimeji-canvas');
    
    // Start animation loop
    startAnimationLoop();
    
    console.log('Shimeji character initialized successfully');
  } catch (error) {
    console.error('Failed to initialize character:', error);
    // Character is optional, so continue without it
  }
}

/**
 * Start the animation loop for character movement
 */
function startAnimationLoop() {
  let lastFrameTime = performance.now();
  
  function loop(currentTime) {
    // Calculate delta time normalized to 60fps
    const deltaTime = (currentTime - lastFrameTime) / 16.67;
    lastFrameTime = currentTime;
    
    // Update and render character
    if (app.character && app.character.isVisible) {
      app.character.update(deltaTime);
      app.character.render();
    }
    
    // Continue loop
    requestAnimationFrame(loop);
  }
  
  // Start the loop
  requestAnimationFrame(loop);
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { app, init };
