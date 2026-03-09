/**
 * PhysicsEngine - Handles physics simulation for the Shimeji character
 * 
 * Implements gravity, friction, air resistance, and position updates
 * to create realistic movement and interactions.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export default class PhysicsEngine {
  constructor() {
    // Gravity constant (pixels per frame squared)
    // Requirement 7.1: Apply gravity simulation for realistic arc movement
    this.gravity = 0.5;
    
    // Terminal velocity (max falling speed in pixels per frame)
    // Requirement 7.3: Increase velocity until reaching terminal velocity
    this.terminalVelocity = 15;
    
    // Ground friction coefficient (0-1, where 1 = no friction)
    // Requirement 7.2: Smooth acceleration and deceleration
    this.friction = 0.85;
    
    // Air resistance coefficient (0-1, where 1 = no resistance)
    // Requirement 7.2: Smooth acceleration and deceleration
    this.airResistance = 0.98;
  }

  /**
   * Apply gravity to character's vertical velocity
   * 
   * @param {Object} character - Character object with velocity and isGrounded properties
   * 
   * Requirement 7.1: Apply gravity simulation for realistic arc movement
   * Requirement 7.3: Increase velocity until reaching terminal velocity or landing
   */
  applyGravity(character) {
    // Only apply gravity if character is not on the ground
    if (!character.isGrounded) {
      // Increase downward velocity by gravity constant
      character.velocity.y += this.gravity;
      
      // Cap velocity at terminal velocity to prevent infinite acceleration
      character.velocity.y = Math.min(character.velocity.y, this.terminalVelocity);
    }
  }

  /**
   * Apply friction or air resistance to character's horizontal velocity
   * 
   * @param {Object} character - Character object with velocity and isGrounded properties
   * 
   * Requirement 7.2: Smooth acceleration and deceleration when changing movement speed
   * Requirement 7.4: Maintain momentum appropriate to animation state
   */
  applyFriction(character) {
    if (character.isGrounded) {
      // Apply ground friction when character is on a surface
      character.velocity.x *= this.friction;
    } else {
      // Apply air resistance when character is airborne
      character.velocity.x *= this.airResistance;
    }
  }

  /**
   * Update character position based on velocity and delta time
   * 
   * @param {Object} character - Character object with position and velocity properties
   * @param {number} deltaTime - Time multiplier normalized to 60fps (typically 1.0)
   * 
   * Requirement 7.2: Smooth acceleration and deceleration
   * Requirement 7.4: Maintain momentum appropriate to animation state
   */
  updatePosition(character, deltaTime) {
    // Apply velocity to position, scaled by delta time for frame-rate independence
    character.position.x += character.velocity.x * deltaTime;
    character.position.y += character.velocity.y * deltaTime;
  }
}
