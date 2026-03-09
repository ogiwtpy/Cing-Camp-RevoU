# Design Document: Stickman Animator Portfolio

## Overview

The Stickman Animator Portfolio is a single-page web application that showcases an animator's work through a professional portfolio website enhanced with an interactive shimeji-style stickman character. The application combines traditional portfolio elements (header, about section, gallery, contact) with a playful animated character that moves autonomously across the screen and interacts with page elements.

The design leverages modern web technologies—HTML5 for semantic structure, Tailwind CSS for responsive styling, and vanilla JavaScript for animation logic—to create an engaging, performant, and accessible user experience across all devices and browsers.

### Key Design Goals

- Create a professional portfolio structure that effectively showcases animation work
- Implement a physics-based animated character with autonomous movement and interactions
- Ensure smooth performance (30+ FPS) while maintaining low resource consumption
- Provide full accessibility and keyboard navigation support
- Deliver responsive layouts optimized for mobile, tablet, and desktop viewports
- Maintain cross-browser compatibility without external animation libraries

## Architecture

### System Components

The application follows a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     HTML Document                        │
│  ┌────────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │   Header   │  │  About   │  │     Gallery      │   │
│  │ Navigation │  │  Section │  │   (Grid Layout)  │   │
│  └────────────┘  └──────────┘  └──────────────────┘   │
│  ┌────────────┐  ┌──────────────────────────────────┐ │
│  │  Contact   │  │   Shimeji Canvas/SVG Layer      │ │
│  │  Section   │  │   (Positioned Absolutely)       │ │
│  └────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
┌──────────────────┐      ┌────────────────────────┐
│  Portfolio UI    │      │  Shimeji Character     │
│  Controller      │      │  Animation Engine      │
│                  │      │                        │
│ - Gallery Modal  │      │ - Physics Simulation   │
│ - Navigation     │      │ - State Machine        │
│ - Form Handler   │      │ - Collision Detection  │
│ - Responsive     │      │ - Rendering Engine     │
└──────────────────┘      └────────────────────────┘
         │                           │
         └───────────┬───────────────┘
                     ▼
         ┌──────────────────────┐
         │   Event Coordinator  │
         │                      │
         │ - User Input Handler │
         │ - Animation Loop     │
         │ - Performance Monitor│
         └──────────────────────┘
```

### Component Responsibilities

**Portfolio UI Controller**
- Manages static portfolio content rendering
- Handles gallery modal display and navigation
- Processes contact form interactions
- Coordinates responsive layout adjustments

**Shimeji Character Animation Engine**
- Maintains character state machine (idle, walking, jumping, climbing, sitting)
- Executes physics simulation (gravity, velocity, acceleration)
- Performs collision detection with page elements
- Renders character frames using canvas or SVG
- Manages animation cycles and transitions

**Event Coordinator**
- Centralizes user input handling (mouse, touch, keyboard)
- Manages requestAnimationFrame loop for smooth animations
- Monitors performance metrics and adjusts quality if needed
- Coordinates communication between UI and animation systems

### Technology Stack

- **HTML5**: Semantic markup with `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`
- **Tailwind CSS**: Utility-first styling with responsive breakpoints
- **Vanilla JavaScript (ES6+)**: No external libraries for animation or UI logic
- **Canvas API**: Primary rendering method for shimeji character
- **SVG**: Fallback rendering option for better scaling on high-DPI displays

## Components and Interfaces

### 1. Portfolio Structure Components

#### Header Component
```javascript
// Rendered as semantic HTML with Tailwind classes
<header class="fixed top-0 w-full bg-white shadow-md z-40">
  <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
    <h1 class="text-2xl font-bold">Animator Name</h1>
    <ul class="flex space-x-6">
      <li><a href="#about">About</a></li>
      <li><a href="#gallery">Gallery</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>
```

**Interface**: Static HTML with smooth scroll navigation

#### Gallery Component
```javascript
class Gallery {
  constructor(containerId, items) {
    this.container = document.getElementById(containerId);
    this.items = items; // Array of {title, description, src, type}
    this.modal = null;
  }
  
  render() {
    // Creates grid layout with Tailwind classes
    // grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
  }
  
  openModal(itemIndex) {
    // Displays full-size animation in modal overlay
  }
  
  closeModal() {
    // Removes modal and restores focus
  }
}
```

**Interface**: 
- `render()`: Generates gallery grid
- `openModal(index)`: Shows item in modal
- `closeModal()`: Dismisses modal

### 2. Shimeji Character System

#### Character State Machine
```javascript
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
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.state = CharacterStates.IDLE;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.isVisible = true;
    this.isDragging = false;
  }
  
  update(deltaTime) {
    // Updates physics and state transitions
  }
  
  render() {
    // Draws character based on current state
  }
  
  setState(newState) {
    // Transitions to new animation state
  }
}
```

#### Physics Engine
```javascript
class PhysicsEngine {
  constructor() {
    this.gravity = 0.5; // pixels per frame squared
    this.terminalVelocity = 15; // max falling speed
    this.friction = 0.85; // ground friction coefficient
    this.airResistance = 0.98; // air drag
  }
  
  applyGravity(character) {
    if (!character.isGrounded) {
      character.velocity.y += this.gravity;
      character.velocity.y = Math.min(character.velocity.y, this.terminalVelocity);
    }
  }
  
  applyFriction(character) {
    if (character.isGrounded) {
      character.velocity.x *= this.friction;
    } else {
      character.velocity.x *= this.airResistance;
    }
  }
  
  updatePosition(character, deltaTime) {
    character.position.x += character.velocity.x * deltaTime;
    character.position.y += character.velocity.y * deltaTime;
  }
}
```

#### Collision Detection System
```javascript
class CollisionDetector {
  constructor() {
    this.pageElements = []; // Cached element boundaries
  }
  
  updateElementBoundaries() {
    // Caches getBoundingClientRect() for performance
    this.pageElements = [
      { element: document.querySelector('header'), bounds: {...} },
      { element: document.querySelector('.gallery'), bounds: {...} },
      // ... other interactive elements
    ];
  }
  
  checkCollisions(character) {
    const charBounds = character.getBounds();
    
    for (const elem of this.pageElements) {
      if (this.intersects(charBounds, elem.bounds)) {
        return {
          collided: true,
          element: elem.element,
          side: this.getCollisionSide(charBounds, elem.bounds)
        };
      }
    }
    
    return { collided: false };
  }
  
  intersects(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }
  
  getCollisionSide(charBounds, elemBounds) {
    // Returns 'top', 'bottom', 'left', or 'right'
  }
}
```

#### Animation Renderer
```javascript
class CharacterRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.spriteFrames = this.generateSpriteFrames();
  }
  
  generateSpriteFrames() {
    // Procedurally generates stickman frames for each state
    return {
      idle: [/* frame data */],
      walking: [/* frame data */],
      jumping: [/* frame data */],
      // ... other states
    };
  }
  
  drawStickman(x, y, state, frameIndex) {
    const frame = this.spriteFrames[state][frameIndex];
    
    // Draw head
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // Draw body, arms, legs based on frame data
    // ...
  }
}
```

### 3. User Interaction System

#### Input Handler
```javascript
class InputHandler {
  constructor(character, canvas) {
    this.character = character;
    this.canvas = canvas;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    
    // Keyboard events
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }
  
  onMouseDown(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (this.character.containsPoint(x, y)) {
      this.character.startDrag(x, y);
    }
  }
  
  onKeyDown(event) {
    // Handle keyboard controls (e.g., 'H' to hide character)
    if (event.key === 'h' || event.key === 'H') {
      this.character.toggleVisibility();
    }
  }
}
```

### 4. Performance Optimization System

#### Animation Loop Manager
```javascript
class AnimationLoop {
  constructor(character, physics, collisionDetector) {
    this.character = character;
    this.physics = physics;
    this.collisionDetector = collisionDetector;
    this.lastFrameTime = 0;
    this.isRunning = false;
    this.frameCount = 0;
    this.fps = 0;
  }
  
  start() {
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }
  
  loop(currentTime) {
    if (!this.isRunning) return;
    
    const deltaTime = (currentTime - this.lastFrameTime) / 16.67; // Normalize to 60fps
    this.lastFrameTime = currentTime;
    
    // Update FPS counter
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1000 / (currentTime - this.lastFrameTime));
    }
    
    // Only update if character is visible
    if (this.character.isVisible) {
      this.physics.update(this.character, deltaTime);
      this.collisionDetector.checkCollisions(this.character);
      this.character.update(deltaTime);
      this.character.render();
    }
    
    requestAnimationFrame(this.loop.bind(this));
  }
  
  stop() {
    this.isRunning = false;
  }
}
```

## Data Models

### Character State Model
```javascript
{
  // Position and movement
  position: { x: number, y: number },
  velocity: { x: number, y: number },
  acceleration: { x: number, y: number },
  
  // State information
  state: CharacterStates,
  previousState: CharacterStates,
  stateTimer: number, // Time in current state
  
  // Animation
  currentFrame: number,
  frameTimer: number,
  animationSpeed: number,
  
  // Interaction
  isGrounded: boolean,
  isDragging: boolean,
  isVisible: boolean,
  currentSurface: HTMLElement | null,
  
  // Physics properties
  mass: number,
  friction: number,
  bounciness: number,
  
  // Dimensions
  width: number,
  height: number
}
```

### Gallery Item Model
```javascript
{
  id: string,
  title: string,
  description: string,
  src: string, // URL to image/video
  type: 'image' | 'gif' | 'video',
  thumbnail: string, // URL to thumbnail
  alt: string, // Accessibility text
  dimensions: { width: number, height: number }
}
```

### Page Element Boundary Model
```javascript
{
  element: HTMLElement,
  bounds: {
    top: number,
    left: number,
    right: number,
    bottom: number,
    width: number,
    height: number
  },
  type: 'surface' | 'obstacle' | 'interactive',
  isStatic: boolean // Whether bounds change (for caching)
}
```

### Configuration Model
```javascript
{
  character: {
    size: number,
    speed: number,
    jumpForce: number,
    color: string
  },
  physics: {
    gravity: number,
    terminalVelocity: number,
    friction: number,
    airResistance: number
  },
  performance: {
    targetFPS: number,
    enableParticles: boolean,
    collisionCheckInterval: number
  },
  accessibility: {
    reducedMotion: boolean,
    keyboardControlsEnabled: boolean,
    autoHideCharacter: boolean
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Viewport Boundary Containment

*For any* character position during autonomous movement, the character's bounds must remain within the viewport boundaries (0 ≤ x ≤ viewport.width and 0 ≤ y ≤ viewport.height).

**Validates: Requirements 5.1**

### Property 2: Boundary Collision Response

*For any* character movement that reaches a viewport edge, the character must change direction or perform a boundary-specific behavior (bounce, climb, or stop).

**Validates: Requirements 5.2**

### Property 3: Smooth Animation Frame Timing

*For any* sequence of animation frames, the time delta between consecutive frames must remain within acceptable variance (target 16.67ms ± 5ms for 60fps, minimum 30fps) to ensure smooth animation.

**Validates: Requirements 5.4, 9.2**

### Property 4: State-Appropriate Animation Display

*For any* character state (walking, running, jumping, idle), the rendered animation cycle must correspond to the current state value.

**Validates: Requirements 5.3, 5.5**

### Property 5: Collision Detection Accuracy

*For any* page element and character position, when the character's bounding box intersects the element's bounding box, the collision detection system must return true.

**Validates: Requirements 6.1**

### Property 6: Collision Interaction Trigger

*For any* detected collision between character and page element, an interaction behavior (climb, sit, stand, bounce) must be triggered based on the element type and collision side.

**Validates: Requirements 6.2**

### Property 7: Click Event Propagation

*For any* clickable page element, when the character overlays that element, click events on the element must still fire and execute their handlers normally.

**Validates: Requirements 6.5**

### Property 8: Gravity Application During Jump

*For any* jump action, the character's vertical velocity must increase in the downward direction each frame by the gravity constant until landing or reaching terminal velocity.

**Validates: Requirements 7.1, 7.3**

### Property 9: Smooth Acceleration and Deceleration

*For any* change in character movement speed, the velocity must change gradually over multiple frames rather than instantaneously (acceleration/deceleration must be applied).

**Validates: Requirements 7.2**

### Property 10: Drag Position Tracking

*For any* drag event sequence (mousedown/touchstart → mousemove/touchmove → mouseup/touchend), the character's position must follow the cursor/touch position throughout the drag.

**Validates: Requirements 8.2, 12.4**

### Property 11: Gallery Item Hover Feedback

*For any* gallery item, when the mouse enters the item's bounds, visual feedback (scale, opacity, or border change) must be applied.

**Validates: Requirements 3.2**

### Property 12: Gallery Item Content Completeness

*For any* gallery item, the item must include both a title/description text element and a media element (image, gif, or video).

**Validates: Requirements 3.3, 3.4**

### Property 13: Modal Display on Gallery Click

*For any* gallery item, clicking the item must open a modal displaying the full-size animation with proper overlay and close controls.

**Validates: Requirements 3.5**

### Property 14: Responsive Layout Adaptation

*For any* viewport width change that crosses a breakpoint (768px for mobile, 1024px for tablet), the layout must adjust to the appropriate responsive configuration.

**Validates: Requirements 1.6, 12.1**

### Property 15: Interactive Element Transitions

*For any* interactive element (buttons, links, gallery items), CSS transition properties must be defined to provide smooth visual feedback.

**Validates: Requirements 2.3**

### Property 16: Typography Accessibility Standards

*For any* text element, the font size must meet minimum accessibility standards (≥16px for body text, ≥14px for small text) and line height must be ≥1.5 for readability.

**Validates: Requirements 2.4**

### Property 17: Animation Resource Conservation

*For any* state where the character is hidden (isVisible = false), the animation loop must not execute physics calculations or rendering operations.

**Validates: Requirements 9.4**

### Property 18: Image Optimization Standards

*For any* image asset in the gallery, the file size must be optimized (compressed) and use appropriate formats (WebP with fallback, or optimized JPEG/PNG).

**Validates: Requirements 9.3**

### Property 19: Cross-Browser Functionality

*For any* supported browser (Chrome, Firefox, Safari, Edge), all core features (navigation, gallery, character animation, interactions) must function correctly.

**Validates: Requirements 10.1, 10.3**

### Property 20: Cross-Browser Style Consistency

*For any* styled element, the computed styles must be visually consistent across supported browsers (allowing for minor rendering differences).

**Validates: Requirements 10.2**

### Property 21: Graceful Feature Degradation

*For any* browser lacking support for canvas or requestAnimationFrame, the site must still display portfolio content and provide fallback messaging about the character feature.

**Validates: Requirements 10.4**

### Property 22: Interactive Element ARIA Labels

*For any* interactive element (buttons, links, form inputs, gallery items), appropriate ARIA labels or attributes must be present for screen reader accessibility.

**Validates: Requirements 11.1**

### Property 23: Keyboard Navigation Completeness

*For any* interactive feature (navigation links, gallery items, modal controls, character toggle), the feature must be accessible and operable via keyboard alone.

**Validates: Requirements 11.2**

### Property 24: Color Contrast Compliance

*For any* text element, the color contrast ratio between text and background must meet WCAG AA standards (≥4.5:1 for normal text, ≥3:1 for large text).

**Validates: Requirements 11.3**

### Property 25: Gallery Image Alt Text

*For any* image element in the gallery, an alt attribute with descriptive text must be present.

**Validates: Requirements 11.4**

### Property 26: Mobile Gallery Layout

*For any* viewport width less than 768px, the gallery grid must display in single-column or two-column layout (not three or more columns).

**Validates: Requirements 12.3**

### Property 27: Mobile Character Scaling

*For any* viewport width less than 768px, the character dimensions must scale proportionally to remain visible and appropriately sized (e.g., 60-80% of desktop size).

**Validates: Requirements 12.2**

### Property 28: Mobile Navigation Format

*For any* viewport width less than 768px, the navigation must transform to a mobile-friendly format (hamburger menu or vertical stack).

**Validates: Requirements 12.5**

## Error Handling

### Character Animation Errors

**Canvas Context Failure**
- **Scenario**: Canvas 2D context cannot be obtained
- **Handling**: Fall back to SVG rendering; if SVG also fails, display static character image and log error
- **User Impact**: Character may appear static but portfolio remains functional

**Animation Loop Errors**
- **Scenario**: Exception thrown during physics calculation or rendering
- **Handling**: Catch error, log to console, attempt to reset character state; if errors persist, disable character and show toggle to retry
- **User Impact**: Character may disappear but can be re-enabled; portfolio content unaffected

**Performance Degradation**
- **Scenario**: FPS drops below 20 for sustained period
- **Handling**: Reduce animation quality (fewer collision checks, simpler rendering), notify user of performance mode
- **User Impact**: Character animation may be less smooth but remains functional

### Gallery Errors

**Image Load Failure**
- **Scenario**: Gallery image fails to load (404, network error)
- **Handling**: Display placeholder image with error icon, show alt text, log error
- **User Impact**: Specific gallery item shows placeholder but gallery remains browsable

**Modal Display Errors**
- **Scenario**: Modal fails to open or display content
- **Handling**: Fall back to opening media in new tab, log error
- **User Impact**: User can still view content, just not in modal format

**Video Playback Errors**
- **Scenario**: Video format not supported or playback fails
- **Handling**: Display error message with link to download video, show thumbnail as fallback
- **User Impact**: User can download video to view externally

### User Input Errors

**Touch Event Conflicts**
- **Scenario**: Touch events interfere with scroll or other gestures
- **Handling**: Use passive event listeners, implement touch event discrimination logic
- **User Impact**: Smooth scrolling maintained while character drag still works

**Drag Outside Viewport**
- **Scenario**: User drags character outside visible area
- **Handling**: Constrain drag position to viewport bounds, snap back if released outside
- **User Impact**: Character cannot be lost off-screen

### Browser Compatibility Errors

**Feature Detection Failures**
- **Scenario**: Required API not available (canvas, requestAnimationFrame)
- **Handling**: Detect features on load, disable character gracefully, show informational message
- **User Impact**: Portfolio content fully accessible, character feature unavailable

**CSS Grid Not Supported**
- **Scenario**: Older browser lacks CSS Grid support
- **Handling**: Provide flexbox fallback layout for gallery
- **User Impact**: Gallery displays in alternative but functional layout

### Network and Loading Errors

**Slow Network Conditions**
- **Scenario**: Assets take longer than 3 seconds to load
- **Handling**: Show loading indicators, prioritize critical content, lazy load gallery images
- **User Impact**: Progressive content display, site remains usable during load

**JavaScript Load Failure**
- **Scenario**: JavaScript file fails to load or execute
- **Handling**: Ensure HTML/CSS provide functional static site, use noscript tags for fallback content
- **User Impact**: Static portfolio remains viewable without interactive features

## Testing Strategy

### Dual Testing Approach

This feature requires both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and integration points
- **Property tests** verify universal properties hold across all possible inputs
- Together they provide confidence in both concrete scenarios and general correctness

### Unit Testing

Unit tests focus on specific scenarios and edge cases:

**Portfolio Structure Tests**
- Verify header, about, gallery, and contact sections exist in DOM
- Test navigation smooth scroll functionality
- Verify semantic HTML5 elements are used correctly
- Test modal open/close functionality with specific gallery items
- Verify toggle control shows/hides character

**Character State Tests**
- Test state transitions (idle → walking → jumping → falling → idle)
- Verify initial character appearance on page load
- Test specific collision scenarios (header collision triggers climb, gallery collision triggers sit)
- Verify drag start, drag move, and drag release behavior
- Test character visibility toggle

**Edge Cases**
- Empty gallery (no items to display)
- Single gallery item (grid layout still works)
- Character at exact viewport boundary
- Rapid state transitions
- Multiple simultaneous collisions
- Touch and mouse events on same device

**Integration Tests**
- Character interactions don't block gallery clicks
- Modal display doesn't interfere with character animation
- Responsive breakpoint transitions
- Form submission in contact section

### Property-Based Testing

Property tests verify universal behaviors across randomized inputs. Each test should run minimum 100 iterations.

**Testing Library**: Use **fast-check** (JavaScript property-based testing library)

**Configuration Example**:
```javascript
import fc from 'fast-check';

// Feature: stickman-animator-portfolio, Property 1: Viewport Boundary Containment
fc.assert(
  fc.property(
    fc.record({
      x: fc.float({ min: -100, max: window.innerWidth + 100 }),
      y: fc.float({ min: -100, max: window.innerHeight + 100 }),
      vx: fc.float({ min: -10, max: 10 }),
      vy: fc.float({ min: -10, max: 10 })
    }),
    (initialState) => {
      const character = new ShimejiCharacter();
      character.position = { x: initialState.x, y: initialState.y };
      character.velocity = { x: initialState.vx, y: initialState.vy };
      
      // Simulate movement
      character.update(1);
      
      // Property: position must be within bounds
      return character.position.x >= 0 && 
             character.position.x <= window.innerWidth &&
             character.position.y >= 0 && 
             character.position.y <= window.innerHeight;
    }
  ),
  { numRuns: 100 }
);
```

**Property Test Coverage**:

Each correctness property from the design document must have a corresponding property-based test:

- **Property 1-2**: Character boundary behavior (random positions, velocities)
- **Property 3**: Frame timing consistency (random load conditions)
- **Property 4**: State-animation correspondence (random state transitions)
- **Property 5-7**: Collision detection and interaction (random element positions, character positions)
- **Property 8-9**: Physics simulation (random jump forces, velocities)
- **Property 10**: Drag tracking (random drag paths)
- **Property 11-13**: Gallery interactions (random gallery configurations)
- **Property 14**: Responsive layout (random viewport widths)
- **Property 15-16**: Styling properties (random element types)
- **Property 17-18**: Performance optimization (random visibility states, image sizes)
- **Property 19-21**: Cross-browser compatibility (test on each browser)
- **Property 22-25**: Accessibility (random element types, color combinations)
- **Property 26-28**: Mobile responsiveness (random mobile viewport widths)

**Test Tagging Format**:
```javascript
// Feature: stickman-animator-portfolio, Property 5: Collision Detection Accuracy
test('collision detection returns true for overlapping bounds', () => {
  // Property test implementation
});
```

### Performance Testing

- Measure FPS during character animation (target: ≥30fps, ideal: 60fps)
- Measure page load time (target: ≤3 seconds on standard broadband)
- Profile memory usage during extended animation
- Test animation performance with multiple page elements
- Verify requestAnimationFrame is used (not setTimeout/setInterval)

### Accessibility Testing

- Run automated accessibility audit (axe-core or Lighthouse)
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast verification (WebAIM contrast checker)
- Test with reduced motion preferences enabled

### Cross-Browser Testing

- Test on Chrome (latest 2 versions)
- Test on Firefox (latest 2 versions)
- Test on Safari (latest 2 versions)
- Test on Edge (latest 2 versions)
- Verify graceful degradation on older browsers

### Mobile Testing

- Test on iOS Safari (iPhone)
- Test on Chrome Mobile (Android)
- Test touch interactions (drag, tap, scroll)
- Verify responsive layouts at 320px, 375px, 414px, 768px widths
- Test landscape and portrait orientations

### Visual Regression Testing

- Capture screenshots at key breakpoints
- Compare gallery layouts across browsers
- Verify character rendering consistency
- Test modal display appearance

