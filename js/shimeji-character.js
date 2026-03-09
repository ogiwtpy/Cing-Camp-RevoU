/**
 * ShimejiCharacter - Interactive stickman character that moves across the screen
 * 
 * Requirements:
 * - 4.1: Character appears on page load
 * - 4.2: Rendered using HTML canvas
 * - 4.4: Visually distinct from page content
 * - 4.5: Remains visible above other content with high z-index
 */

import { CharacterRenderer } from './character-renderer.js';
import PhysicsEngine from './physics-engine.js';

const CharacterStates = {
  IDLE: 'idle',
  WALKING: 'walking',
  JUMPING: 'jumping',
  FALLING: 'falling',
  CLIMBING: 'climbing',
  SITTING: 'sitting',
  DRAGGED: 'dragged'
};

class ShimejiCharacter {
  /**
   * Creates a new ShimejiCharacter instance
   * @param {string} canvasId - The ID of the canvas element to render on
   */
  constructor(canvasId) {
    // Get canvas element and context
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    
    // Set canvas size to match viewport
    this.resizeCanvas();
    
    // Character dimensions (Requirement 4.4: visually distinct size)
    this.width = 40;
    this.height = 60;
    
    // Position properties (center of screen initially)
    this.position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    
    // Velocity properties (pixels per frame)
    this.velocity = {
      x: 0,
      y: 0
    };
    
    // Acceleration properties
    this.acceleration = {
      x: 0,
      y: 0
    };
    
    // State management (Requirement 5.3: animation states)
    this.state = CharacterStates.IDLE;
    this.previousState = CharacterStates.IDLE;
    this.stateTimer = 0;
    
    // Animation properties
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.animationSpeed = 0.15; // Frames per update
    
    // Interaction properties
    this.isGrounded = false;
    this.isDragging = false;
    this.isVisible = true; // Requirement 4.1: visible on load
    this.currentSurface = null;
    
    // Physics properties
    this.mass = 1;
    this.friction = 0.85;
    this.bounciness = 0.3;
    
    // Initialize renderer (Requirement 4.3, 5.5, 5.6)
    this.renderer = new CharacterRenderer(this.ctx);
    
    // Initialize physics engine (Requirements 7.1, 7.2, 7.3, 7.4)
    this.physics = new PhysicsEngine();
    
    // Bind resize handler
    this.handleResize = this.resizeCanvas.bind(this);
    window.addEventListener('resize', this.handleResize);
  }
  
  /**
   * Resizes canvas to match viewport dimensions
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  /**
   * Updates character state and physics
   * @param {number} deltaTime - Time elapsed since last update (normalized to 60fps)
   */
  update(deltaTime) {
    if (!this.isVisible) {
      return;
    }
    
    // Update state timer
    this.stateTimer += deltaTime;
    
    // Update animation frame
    this.frameTimer += this.animationSpeed * deltaTime;
    if (this.frameTimer >= 1) {
      this.currentFrame++;
      this.frameTimer = 0;
    }
    
    // Apply physics (Requirements 7.1, 7.2, 7.3)
    this.physics.applyGravity(this);
    this.physics.applyFriction(this);
    
    // State-specific behavior (Requirements 5.3, 5.5, 5.6)
    this.updateStateSpecificBehavior(deltaTime);
    
    // Update position based on velocity (Requirement 7.4)
    this.physics.updatePosition(this, deltaTime);
    
    // Ensure character stays within viewport bounds (Requirements 5.1, 5.2)
    this.constrainToViewport();
  }
  
  /**
   * Updates state-specific behavior
   * Requirements 5.3, 5.5, 5.6: State transitions and state-appropriate animations
   * @param {number} deltaTime - Time elapsed since last update
   */
  updateStateSpecificBehavior(deltaTime) {
    switch (this.state) {
      case CharacterStates.IDLE:
        // Idle behavior: minimal movement, occasional animations
        // Requirement 5.6: Display idle animation behaviors
        this.velocity.x *= 0.9; // Slow down to stop
        this.velocity.y *= 0.9;
        
        // Transition to walking after random idle time
        if (this.stateTimer > 60 && Math.random() < 0.02) {
          this.setState(CharacterStates.WALKING);
          this.velocity.x = (Math.random() - 0.5) * 4;
        }
        break;
        
      case CharacterStates.WALKING:
        // Walking behavior: horizontal movement
        // Requirement 5.5: Display walking animation cycles
        // Requirement 5.2: Random direction changes for autonomous movement
        
        // Maintain walking velocity
        if (Math.abs(this.velocity.x) < 0.5) {
          this.velocity.x = (Math.random() - 0.5) * 4;
        }
        
        // Random direction changes (Requirement 5.2)
        const directionChangeChance = 0.01; // 1% chance per frame (~0.6 times per second at 60fps)
        if (Math.random() < directionChangeChance) {
          // Reverse direction
          this.velocity.x = -this.velocity.x;
        }
        
        // Random speed variations for more natural movement
        if (Math.random() < 0.005) {
          const speedMultiplier = 0.5 + Math.random() * 1.0; // 0.5x to 1.5x speed
          this.velocity.x = Math.sign(this.velocity.x) * 2 * speedMultiplier;
        }
        
        // Transition to idle after walking for a while
        if (this.stateTimer > 120 && Math.random() < 0.02) {
          this.setState(CharacterStates.IDLE);
        }
        
        // Transition to jumping occasionally
        if (this.isGrounded && Math.random() < 0.005) {
          this.setState(CharacterStates.JUMPING);
          this.velocity.y = -10;
          this.isGrounded = false;
        }
        break;
        
      case CharacterStates.JUMPING:
        // Jumping behavior: upward velocity
        // Transition to falling when velocity becomes downward
        if (this.velocity.y > 0) {
          this.setState(CharacterStates.FALLING);
        }
        break;
        
      case CharacterStates.FALLING:
        // Falling behavior: downward velocity
        // Transition to idle or walking when grounded
        if (this.isGrounded) {
          if (Math.abs(this.velocity.x) > 0.5) {
            this.setState(CharacterStates.WALKING);
          } else {
            this.setState(CharacterStates.IDLE);
          }
        }
        break;
        
      case CharacterStates.CLIMBING:
        // Climbing behavior: vertical movement on surfaces
        this.velocity.x = 0;
        this.velocity.y = -1; // Slow upward movement
        
        // Transition back to falling or idle after climbing
        if (this.stateTimer > 60 && Math.random() < 0.05) {
          this.setState(CharacterStates.FALLING);
          this.currentSurface = null;
        }
        break;
        
      case CharacterStates.SITTING:
        // Sitting behavior: stationary on surface
        this.velocity.x = 0;
        this.velocity.y = 0;
        
        // Transition to walking after sitting for a while
        if (this.stateTimer > 120 && Math.random() < 0.03) {
          this.setState(CharacterStates.WALKING);
          this.velocity.x = (Math.random() - 0.5) * 4;
          this.currentSurface = null;
        }
        break;
        
      case CharacterStates.DRAGGED:
        // Dragged behavior: no autonomous movement
        // Velocity is controlled by drag handler
        break;
    }
  }
  
  /**
   * Constrains character position to viewport boundaries with response behaviors
   * Requirements 5.1, 5.2: Character moves within viewport and responds to boundaries
   */
  constrainToViewport() {
    const minX = 0;
    const maxX = this.canvas.width - this.width;
    const minY = 0;
    const maxY = this.canvas.height - this.height;
    
    // Horizontal boundary detection and response (Requirement 5.2)
    if (this.position.x < minX) {
      this.position.x = minX;
      this.handleBoundaryCollision('left');
    } else if (this.position.x > maxX) {
      this.position.x = maxX;
      this.handleBoundaryCollision('right');
    }
    
    // Vertical boundary detection and response (Requirement 5.2)
    if (this.position.y < minY) {
      this.position.y = minY;
      this.handleBoundaryCollision('top');
    } else if (this.position.y > maxY) {
      this.position.y = maxY;
      this.handleBoundaryCollision('bottom');
    }
  }
  
  /**
   * Handles boundary collision responses
   * Requirement 5.2: Change direction or perform boundary behavior when reaching edge
   * @param {string} edge - The edge that was hit ('left', 'right', 'top', 'bottom')
   */
  handleBoundaryCollision(edge) {
    // Don't respond to boundaries when dragged
    if (this.state === CharacterStates.DRAGGED) {
      return;
    }
    
    switch (edge) {
      case 'left':
      case 'right':
        // Horizontal boundary: bounce or reverse direction
        if (this.state === CharacterStates.WALKING || this.state === CharacterStates.JUMPING || this.state === CharacterStates.FALLING) {
          // Bounce: reverse horizontal velocity with some energy loss
          this.velocity.x = -this.velocity.x * this.bounciness;
          
          // Random chance to change behavior at boundary
          const rand = Math.random();
          if (rand < 0.3) {
            // 30% chance: reverse direction and keep walking
            this.velocity.x = -this.velocity.x;
          } else if (rand < 0.5) {
            // 20% chance: stop and go idle
            this.setState(CharacterStates.IDLE);
          } else if (rand < 0.6 && this.isGrounded) {
            // 10% chance: jump at boundary
            this.setState(CharacterStates.JUMPING);
            this.velocity.y = -10;
            this.isGrounded = false;
          }
          // Otherwise (40%): just bounce
        }
        break;
        
      case 'top':
        // Top boundary: reverse vertical velocity (bounce off ceiling)
        this.velocity.y = Math.abs(this.velocity.y) * this.bounciness;
        break;
        
      case 'bottom':
        // Bottom boundary: land on ground
        this.velocity.y = 0;
        this.isGrounded = true;
        
        // Transition to appropriate state when landing
        if (this.state === CharacterStates.FALLING || this.state === CharacterStates.JUMPING) {
          if (Math.abs(this.velocity.x) > 0.5) {
            this.setState(CharacterStates.WALKING);
          } else {
            this.setState(CharacterStates.IDLE);
          }
        }
        break;
    }
  }
  
  /**
   * Renders the character on the canvas
   */
  render() {
    if (!this.isVisible) {
      return;
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw character using renderer (Requirement 4.3: recognizable stickman design)
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    
    // Use CharacterRenderer to draw animated stickman
    this.renderer.drawStickman(
      0,
      0,
      this.state,
      this.currentFrame,
      this.width,
      this.height
    );
    
    this.ctx.restore();
  }
  
  /**
   * Draws a basic stickman character (legacy method, now handled by CharacterRenderer)
   * Requirement 4.3: Recognizable stickman with head, body, arms, legs
   * @deprecated Use CharacterRenderer.drawStickman instead
   */
  drawStickman() {
    const centerX = this.width / 2;
    const headRadius = 8;
    const bodyLength = 20;
    const limbLength = 15;
    
    // Set drawing style (Requirement 4.4: visually distinct)
    this.ctx.strokeStyle = '#2563eb'; // Blue color
    this.ctx.fillStyle = '#2563eb';
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Draw head
    this.ctx.beginPath();
    this.ctx.arc(centerX, headRadius + 5, headRadius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Draw body
    const bodyTop = headRadius * 2 + 5;
    const bodyBottom = bodyTop + bodyLength;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, bodyTop);
    this.ctx.lineTo(centerX, bodyBottom);
    this.ctx.stroke();
    
    // Draw arms
    const armY = bodyTop + 5;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - limbLength, armY);
    this.ctx.lineTo(centerX, armY);
    this.ctx.lineTo(centerX + limbLength, armY);
    this.ctx.stroke();
    
    // Draw legs
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, bodyBottom);
    this.ctx.lineTo(centerX - limbLength / 2, bodyBottom + limbLength);
    this.ctx.moveTo(centerX, bodyBottom);
    this.ctx.lineTo(centerX + limbLength / 2, bodyBottom + limbLength);
    this.ctx.stroke();
  }
  
  /**
   * Changes the character's state with transition logic
   * Requirements 5.3: State transitions during movement
   * @param {string} newState - The new state from CharacterStates
   */
  setState(newState) {
    // Validate state
    if (!Object.values(CharacterStates).includes(newState)) {
      console.warn(`Invalid state: ${newState}`);
      return;
    }
    
    // Only transition if state actually changes
    if (this.state !== newState) {
      this.previousState = this.state;
      this.state = newState;
      this.stateTimer = 0;
      this.currentFrame = 0;
      
      // State transition logic
      this.onStateEnter(newState);
    }
  }
  
  /**
   * Handles state entry logic
   * @param {string} newState - The state being entered
   */
  onStateEnter(newState) {
    switch (newState) {
      case CharacterStates.IDLE:
        // Reset velocities when entering idle
        this.velocity.x *= 0.5;
        this.velocity.y *= 0.5;
        break;
        
      case CharacterStates.WALKING:
        // Ensure horizontal velocity when entering walking
        if (Math.abs(this.velocity.x) < 1) {
          this.velocity.x = (Math.random() - 0.5) * 4;
        }
        break;
        
      case CharacterStates.JUMPING:
        // Apply jump force when entering jumping state
        if (this.isGrounded) {
          this.velocity.y = -10;
          this.isGrounded = false;
        }
        break;
        
      case CharacterStates.FALLING:
        // No special entry logic for falling
        break;
        
      case CharacterStates.CLIMBING:
        // Reduce horizontal velocity when climbing
        this.velocity.x *= 0.3;
        break;
        
      case CharacterStates.SITTING:
        // Stop all movement when sitting
        this.velocity.x = 0;
        this.velocity.y = 0;
        break;
        
      case CharacterStates.DRAGGED:
        // Stop autonomous movement when dragged
        this.velocity.x = 0;
        this.velocity.y = 0;
        break;
    }
  }
  
  /**
   * Toggles character visibility
   * Requirement 8.4: Toggle control to show/hide character
   */
  toggleVisibility() {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      // Clear canvas when hidden
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  
  /**
   * Gets the character's bounding box
   * @returns {Object} Bounding box with top, left, right, bottom, width, height
   */
  getBounds() {
    return {
      left: this.position.x,
      top: this.position.y,
      right: this.position.x + this.width,
      bottom: this.position.y + this.height,
      width: this.width,
      height: this.height
    };
  }
  
  /**
   * Checks if a point is within the character's bounds
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {boolean} True if point is within character bounds
   */
  containsPoint(x, y) {
    const bounds = this.getBounds();
    return x >= bounds.left && x <= bounds.right &&
           y >= bounds.top && y <= bounds.bottom;
  }
  
  /**
   * Starts dragging the character
   * @param {number} x - X coordinate of drag start
   * @param {number} y - Y coordinate of drag start
   */
  startDrag(x, y) {
    this.isDragging = true;
    this.setState(CharacterStates.DRAGGED);
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
  
  /**
   * Updates character position during drag
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  updateDrag(x, y) {
    if (this.isDragging) {
      this.position.x = x - this.width / 2;
      this.position.y = y - this.height / 2;
      this.constrainToViewport();
    }
  }
  
  /**
   * Ends dragging and resumes autonomous movement
   */
  endDrag() {
    if (this.isDragging) {
      this.isDragging = false;
      this.setState(CharacterStates.IDLE);
    }
  }
  
  /**
   * Cleans up resources
   */
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export { ShimejiCharacter, CharacterStates };
