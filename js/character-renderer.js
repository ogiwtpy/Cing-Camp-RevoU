/**
 * CharacterRenderer - Handles procedural generation and rendering of stickman animation frames
 * 
 * Requirements:
 * - 4.3: Recognizable stickman design with head, body, arms, and legs
 * - 5.5: Walking animation cycles during movement
 * - 5.6: Idle animation behaviors while idle
 */

class CharacterRenderer {
  /**
   * Creates a new CharacterRenderer instance
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D context to render on
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.spriteFrames = this.generateSpriteFrames();
    
    // Character dimensions
    this.headRadius = 8;
    this.bodyLength = 20;
    this.limbLength = 15;
    
    // Drawing style (Requirement 4.4: visually distinct)
    this.strokeStyle = '#2563eb'; // Blue color
    this.fillStyle = '#2563eb';
    this.lineWidth = 3;
  }
  
  /**
   * Procedurally generates animation frames for all character states
   * Requirement 5.5, 5.6: Animation frames for different states
   * @returns {Object} Object containing frame data for each state
   */
  generateSpriteFrames() {
    const frames = {
      idle: this.generateIdleFrames(),
      walking: this.generateWalkingFrames(),
      jumping: this.generateJumpingFrames(),
      falling: this.generateFallingFrames(),
      climbing: this.generateClimbingFrames(),
      sitting: this.generateSittingFrames(),
      dragged: this.generateDraggedFrames()
    };
    
    return frames;
  }

  /**
   * Generates idle animation frames (subtle breathing/swaying)
   * Requirement 5.6: Idle animation behaviors
   * @returns {Array} Array of frame data objects
   */
  generateIdleFrames() {
    const frames = [];
    const frameCount = 8;
    
    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount;
      const breathe = Math.sin(t * Math.PI * 2) * 2; // Subtle up/down movement
      
      frames.push({
        headOffset: { x: 0, y: breathe },
        bodyOffset: { x: 0, y: breathe },
        leftArmAngle: -15 + Math.sin(t * Math.PI * 2) * 5,
        rightArmAngle: 15 - Math.sin(t * Math.PI * 2) * 5,
        leftLegAngle: 0,
        rightLegAngle: 0
      });
    }
    
    return frames;
  }
  
  /**
   * Generates walking animation frames
   * Requirement 5.5: Walking animation cycles during movement
   * @returns {Array} Array of frame data objects
   */
  generateWalkingFrames() {
    const frames = [];
    const frameCount = 8;
    
    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount;
      const cycle = Math.sin(t * Math.PI * 2);
      const bobbing = Math.abs(Math.sin(t * Math.PI * 2)) * 3; // Vertical bobbing
      
      frames.push({
        headOffset: { x: 0, y: -bobbing },
        bodyOffset: { x: 0, y: -bobbing },
        leftArmAngle: cycle * 30, // Arms swing opposite to legs
        rightArmAngle: -cycle * 30,
        leftLegAngle: -cycle * 35, // Legs alternate
        rightLegAngle: cycle * 35
      });
    }
    
    return frames;
  }
  
  /**
   * Generates jumping animation frames
   * Requirement 5.5: Animation for jumping state
   * @returns {Array} Array of frame data objects
   */
  generateJumpingFrames() {
    const frames = [];
    const frameCount = 4;
    
    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount;
      const armRaise = 60 - t * 30; // Arms start raised, lower during jump
      
      frames.push({
        headOffset: { x: 0, y: 0 },
        bodyOffset: { x: 0, y: 0 },
        leftArmAngle: -armRaise,
        rightArmAngle: armRaise,
        leftLegAngle: -20, // Legs bent during jump
        rightLegAngle: 20
      });
    }
    
    return frames;
  }
  
  /**
   * Generates falling animation frames
   * @returns {Array} Array of frame data objects
   */
  generateFallingFrames() {
    const frames = [];
    const frameCount = 4;
    
    for (let i = 0; i < frameCount; i++) {
      frames.push({
        headOffset: { x: 0, y: 0 },
        bodyOffset: { x: 0, y: 0 },
        leftArmAngle: -80, // Arms raised up
        rightArmAngle: 80,
        leftLegAngle: -10,
        rightLegAngle: 10
      });
    }
    
    return frames;
  }
  
  /**
   * Generates climbing animation frames
   * @returns {Array} Array of frame data objects
   */
  generateClimbingFrames() {
    const frames = [];
    const frameCount = 8;
    
    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount;
      const cycle = Math.sin(t * Math.PI * 2);
      
      frames.push({
        headOffset: { x: 0, y: 0 },
        bodyOffset: { x: 0, y: 0 },
        leftArmAngle: -90 + cycle * 20, // Arms alternate reaching up
        rightArmAngle: 90 - cycle * 20,
        leftLegAngle: cycle * 30, // Legs alternate climbing
        rightLegAngle: -cycle * 30
      });
    }
    
    return frames;
  }
  
  /**
   * Generates sitting animation frames
   * @returns {Array} Array of frame data objects
   */
  generateSittingFrames() {
    const frames = [];
    const frameCount = 4;
    
    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount;
      const sway = Math.sin(t * Math.PI * 2) * 3;
      
      frames.push({
        headOffset: { x: sway, y: 5 },
        bodyOffset: { x: 0, y: 5 },
        leftArmAngle: -30,
        rightArmAngle: 30,
        leftLegAngle: 90, // Legs bent for sitting
        rightLegAngle: 90
      });
    }
    
    return frames;
  }
  
  /**
   * Generates dragged animation frames
   * @returns {Array} Array of frame data objects
   */
  generateDraggedFrames() {
    const frames = [];
    const frameCount = 2;
    
    for (let i = 0; i < frameCount; i++) {
      frames.push({
        headOffset: { x: 0, y: 0 },
        bodyOffset: { x: 0, y: 0 },
        leftArmAngle: -45, // Arms slightly raised
        rightArmAngle: 45,
        leftLegAngle: -15,
        rightLegAngle: 15
      });
    }
    
    return frames;
  }

  /**
   * Draws the stickman character at the specified position with animation
   * Requirement 4.3: Recognizable stickman with head, body, arms, and legs
   * @param {number} x - X position to draw at
   * @param {number} y - Y position to draw at
   * @param {string} state - Current animation state
   * @param {number} frameIndex - Current frame index in the animation
   * @param {number} width - Character width
   * @param {number} height - Character height
   */
  drawStickman(x, y, state, frameIndex, width, height) {
    // Get frame data for current state
    const frames = this.spriteFrames[state] || this.spriteFrames.idle;
    const frame = frames[frameIndex % frames.length];
    
    // Calculate center position
    const centerX = width / 2;
    
    // Set drawing style
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Apply frame offsets
    const headY = this.headRadius + 5 + frame.headOffset.y;
    const bodyTop = this.headRadius * 2 + 5 + frame.bodyOffset.y;
    const bodyBottom = bodyTop + this.bodyLength;
    
    // Draw head
    this.ctx.beginPath();
    this.ctx.arc(
      centerX + frame.headOffset.x,
      headY,
      this.headRadius,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();
    
    // Draw body
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, bodyTop);
    this.ctx.lineTo(centerX, bodyBottom);
    this.ctx.stroke();
    
    // Draw arms with animation
    const armY = bodyTop + 5;
    this.drawArm(centerX, armY, frame.leftArmAngle, -1); // Left arm
    this.drawArm(centerX, armY, frame.rightArmAngle, 1); // Right arm
    
    // Draw legs with animation
    this.drawLeg(centerX, bodyBottom, frame.leftLegAngle, -1); // Left leg
    this.drawLeg(centerX, bodyBottom, frame.rightLegAngle, 1); // Right leg
  }
  
  /**
   * Draws an arm with the specified angle
   * @param {number} x - Shoulder X position
   * @param {number} y - Shoulder Y position
   * @param {number} angle - Arm angle in degrees
   * @param {number} side - Side multiplier (-1 for left, 1 for right)
   */
  drawArm(x, y, angle, side) {
    const radians = (angle * Math.PI) / 180;
    const endX = x + side * Math.cos(radians) * this.limbLength;
    const endY = y + Math.sin(radians) * this.limbLength;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }
  
  /**
   * Draws a leg with the specified angle
   * @param {number} x - Hip X position
   * @param {number} y - Hip Y position
   * @param {number} angle - Leg angle in degrees
   * @param {number} side - Side multiplier (-1 for left, 1 for right)
   */
  drawLeg(x, y, angle, side) {
    const radians = (angle * Math.PI) / 180;
    const endX = x + side * Math.cos(Math.PI / 2 + radians) * (this.limbLength * 0.8);
    const endY = y + Math.sin(Math.PI / 2 + radians) * this.limbLength;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
  }
  
  /**
   * Gets the total number of frames for a given state
   * @param {string} state - Animation state
   * @returns {number} Number of frames in the animation
   */
  getFrameCount(state) {
    const frames = this.spriteFrames[state] || this.spriteFrames.idle;
    return frames.length;
  }
}

export { CharacterRenderer };
