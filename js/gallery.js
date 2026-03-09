/**
 * Gallery Component
 * Manages the animation gallery display and interactions
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4, 2.3
 */

export class Gallery {
  /**
   * Create a new Gallery instance
   * @param {string} containerId - ID of the container element
   * @param {Array} items - Array of gallery item objects
   */
  constructor(containerId, items = []) {
    this.container = document.getElementById(containerId);
    this.items = items;
    this.modal = null;
    this.currentItemIndex = null;
    
    if (!this.container) {
      console.error(`Gallery container with ID "${containerId}" not found`);
      return;
    }
    
    this.init();
  }
  
  /**
   * Initialize the gallery
   */
  init() {
    this.setupModal();
    this.render();
  }
  
  /**
   * Set up the modal for displaying full-size animations
   */
  setupModal() {
    this.modal = document.getElementById('gallery-modal');
    
    if (!this.modal) {
      console.error('Gallery modal element not found');
      return;
    }
    
    // Set up modal close button
    const closeButton = document.getElementById('modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.closeModal());
    }
    
    // Close modal on background click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }
  
  /**
   * Render the gallery grid
   * Creates grid layout with Tailwind classes (responsive columns)
   */
  render() {
    if (!this.container) return;
    
    // Clear existing content
    this.container.innerHTML = '';
    
    // Check if there are items to display
    if (this.items.length === 0) {
      this.renderEmptyState();
      return;
    }
    
    // Render each gallery item
    this.items.forEach((item, index) => {
      const itemElement = this.createGalleryItem(item, index);
      this.container.appendChild(itemElement);
    });
  }
  
  /**
   * Render empty state when no items are available
   */
  renderEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'col-span-full text-center py-12';
    emptyState.innerHTML = `
      <p class="text-gray-500 text-lg">No animations to display yet. Check back soon!</p>
    `;
    this.container.appendChild(emptyState);
  }
  
  /**
   * Create a gallery item element
   * @param {Object} item - Gallery item data
   * @param {number} index - Item index
   * @returns {HTMLElement} Gallery item element
   */
  createGalleryItem(item, index) {
    const article = document.createElement('article');
    article.className = 'gallery-item bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl cursor-pointer';
    article.setAttribute('role', 'button');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `View ${item.title}`);
    article.dataset.itemIndex = index;
    
    // Create media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'aspect-video bg-gray-200 flex items-center justify-center overflow-hidden';
    
    // Create media element based on type
    const mediaElement = this.createMediaElement(item);
    mediaContainer.appendChild(mediaElement);
    
    // Create content container with title and description
    const contentContainer = document.createElement('div');
    contentContainer.className = 'p-4';
    
    const title = document.createElement('h3');
    title.className = 'text-xl font-semibold mb-2 text-gray-800';
    title.textContent = item.title;
    
    const description = document.createElement('p');
    description.className = 'text-gray-600 text-sm leading-relaxed';
    description.textContent = item.description;
    
    contentContainer.appendChild(title);
    contentContainer.appendChild(description);
    
    // Assemble the article
    article.appendChild(mediaContainer);
    article.appendChild(contentContainer);
    
    // Add event listeners for opening modal
    article.addEventListener('click', () => this.openModal(index));
    article.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openModal(index);
      }
    });
    
    return article;
  }
  
  /**
   * Create media element (image, gif, or video) based on item type
   * @param {Object} item - Gallery item data
   * @returns {HTMLElement} Media element
   */
  createMediaElement(item) {
    let mediaElement;
    
    switch (item.type) {
      case 'video':
        mediaElement = document.createElement('video');
        mediaElement.src = item.thumbnail || item.src;
        mediaElement.className = 'w-full h-full object-cover';
        mediaElement.setAttribute('muted', '');
        mediaElement.setAttribute('loop', '');
        mediaElement.setAttribute('playsinline', '');
        
        // Play video on hover
        mediaElement.addEventListener('mouseenter', () => {
          mediaElement.play().catch(err => console.log('Video play failed:', err));
        });
        mediaElement.addEventListener('mouseleave', () => {
          mediaElement.pause();
          mediaElement.currentTime = 0;
        });
        break;
        
      case 'gif':
      case 'image':
      default:
        mediaElement = document.createElement('img');
        mediaElement.src = item.thumbnail || item.src;
        mediaElement.alt = item.alt || item.title;
        mediaElement.className = 'w-full h-full object-cover';
        mediaElement.loading = 'lazy';
        
        // Handle image load errors with placeholder
        mediaElement.addEventListener('error', () => {
          mediaElement.src = this.getPlaceholderImage();
        });
        
        // Add loaded class when image loads
        mediaElement.addEventListener('load', () => {
          mediaElement.classList.add('loaded');
        });
        break;
    }
    
    return mediaElement;
  }
  
  /**
   * Get placeholder image SVG data URL
   * @returns {string} Data URL for placeholder image
   */
  getPlaceholderImage() {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='18'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
  }
  
  /**
   * Open modal to display full-size animation
   * @param {number} itemIndex - Index of the item to display
   */
  openModal(itemIndex) {
    if (!this.modal || itemIndex < 0 || itemIndex >= this.items.length) {
      return;
    }
    
    this.currentItemIndex = itemIndex;
    const item = this.items[itemIndex];
    const modalContent = document.getElementById('modal-content');
    
    if (!modalContent) {
      console.error('Modal content container not found');
      return;
    }
    
    // Build modal content
    modalContent.innerHTML = '';
    
    // Title
    const title = document.createElement('h2');
    title.className = 'text-3xl font-bold mb-4 text-gray-800';
    title.textContent = item.title;
    modalContent.appendChild(title);
    
    // Media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'mb-4 rounded-lg overflow-hidden bg-gray-100';
    
    // Create full-size media element
    let mediaElement;
    if (item.type === 'video') {
      mediaElement = document.createElement('video');
      mediaElement.src = item.src;
      mediaElement.className = 'w-full rounded-lg';
      mediaElement.setAttribute('controls', '');
      mediaElement.setAttribute('autoplay', '');
      mediaElement.setAttribute('loop', '');
    } else {
      mediaElement = document.createElement('img');
      mediaElement.src = item.src;
      mediaElement.alt = item.alt || item.title;
      mediaElement.className = 'w-full rounded-lg';
      
      // Fallback to thumbnail if full image fails
      mediaElement.addEventListener('error', () => {
        if (item.thumbnail && mediaElement.src !== item.thumbnail) {
          mediaElement.src = item.thumbnail;
        } else {
          mediaElement.src = this.getPlaceholderImage();
        }
      });
    }
    
    mediaContainer.appendChild(mediaElement);
    modalContent.appendChild(mediaContainer);
    
    // Description
    const description = document.createElement('p');
    description.className = 'text-gray-700 text-lg leading-relaxed';
    description.textContent = item.description;
    modalContent.appendChild(description);
    
    // Show modal
    this.modal.classList.remove('hidden');
    this.modal.classList.add('show');
    
    // Focus on close button for accessibility
    const closeButton = document.getElementById('modal-close');
    if (closeButton) {
      closeButton.focus();
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close the modal
   */
  closeModal() {
    if (!this.modal) return;
    
    // Store the current item index before clearing it
    const itemIndex = this.currentItemIndex;
    
    this.modal.classList.remove('show');
    this.modal.classList.add('hidden');
    this.currentItemIndex = null;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to the gallery item that was clicked
    if (itemIndex !== null) {
      const item = this.container.querySelector(`[data-item-index="${itemIndex}"]`);
      if (item) {
        item.focus();
      }
    }
  }
  
  /**
   * Add a new item to the gallery
   * @param {Object} item - Gallery item data
   */
  addItem(item) {
    this.items.push(item);
    this.render();
  }
  
  /**
   * Remove an item from the gallery
   * @param {number} index - Index of item to remove
   */
  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.render();
    }
  }
  
  /**
   * Update gallery items
   * @param {Array} items - New array of gallery items
   */
  updateItems(items) {
    this.items = items;
    this.render();
  }
  
  /**
   * Get all gallery items
   * @returns {Array} Array of gallery items
   */
  getItems() {
    return this.items;
  }
}
