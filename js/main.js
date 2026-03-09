/**
 * Main entry point for Stickman Animator Portfolio
 * Initializes all components and manages application lifecycle
 */

// Import modules (to be created in future tasks)
// import { Gallery } from './gallery.js';
// import { ShimejiCharacter } from './shimeji/character.js';
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
  
  // Initialize shimeji character (will be implemented in future tasks)
  // initializeCharacter();
  
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
  const galleryContainer = document.getElementById('gallery-container');
  
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
    }
  ];
  
  // Render gallery items
  galleryItems.forEach((item, index) => {
    const itemElement = createGalleryItem(item, index);
    galleryContainer.appendChild(itemElement);
  });
}

/**
 * Create a gallery item element
 */
function createGalleryItem(item, index) {
  const article = document.createElement('article');
  article.className = 'gallery-item bg-white rounded-lg shadow-md overflow-hidden';
  article.setAttribute('role', 'button');
  article.setAttribute('tabindex', '0');
  article.setAttribute('aria-label', `View ${item.title}`);
  
  article.innerHTML = `
    <div class="aspect-video bg-gray-200 flex items-center justify-center">
      <img src="${item.thumbnail}" alt="${item.alt}" class="w-full h-full object-cover" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage Placeholder%3C/text%3E%3C/svg%3E'">
    </div>
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-2">${item.title}</h3>
      <p class="text-gray-600">${item.description}</p>
    </div>
  `;
  
  // Add click handler to open modal
  article.addEventListener('click', () => openGalleryModal(item));
  article.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGalleryModal(item);
    }
  });
  
  return article;
}

/**
 * Open gallery modal with item details
 */
function openGalleryModal(item) {
  const modal = document.getElementById('gallery-modal');
  const modalContent = document.getElementById('modal-content');
  
  modalContent.innerHTML = `
    <h2 class="text-3xl font-bold mb-4">${item.title}</h2>
    <div class="mb-4">
      <img src="${item.src}" alt="${item.alt}" class="w-full rounded-lg" onerror="this.src='${item.thumbnail}'">
    </div>
    <p class="text-gray-700 text-lg">${item.description}</p>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('show');
  
  // Focus on close button for accessibility
  document.getElementById('modal-close').focus();
}

/**
 * Close gallery modal
 */
function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  modal.classList.remove('show');
  modal.classList.add('hidden');
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
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    console.log('Contact form submitted:', data);
    
    // Show success message (in production, this would send to a server)
    alert('Thank you for your message! I will get back to you soon.');
    form.reset();
  });
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
  // Modal close button
  const modalClose = document.getElementById('modal-close');
  modalClose.addEventListener('click', closeGalleryModal);
  
  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('gallery-modal');
      if (!modal.classList.contains('hidden')) {
        closeGalleryModal();
      }
    }
  });
  
  // Close modal on background click
  const modal = document.getElementById('gallery-modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeGalleryModal();
    }
  });
  
  // Character toggle buttons (will be implemented in future tasks)
  const toggleButton = document.getElementById('toggle-character');
  const toggleButtonMobile = document.getElementById('toggle-character-mobile');
  
  toggleButton.addEventListener('click', () => {
    console.log('Character toggle clicked (character not yet implemented)');
    // Future: app.character.toggleVisibility();
  });
  
  toggleButtonMobile.addEventListener('click', () => {
    console.log('Character toggle clicked (character not yet implemented)');
    // Future: app.character.toggleVisibility();
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
 * Initialize character (placeholder for future implementation)
 */
function initializeCharacter() {
  // This will be implemented in future tasks
  console.log('Character initialization will be implemented in future tasks');
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { app, init };
