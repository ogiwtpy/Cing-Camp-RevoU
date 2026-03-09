/**
 * PhysicsEngine Unit Tests (Node.js)
 * 
 * Run with: node test/physics-engine.test.js
 */

// Mock PhysicsEngine class for Node.js environment
class PhysicsEngine {
  constructor() {
    this.gravity = 0.5;
    this.terminalVelocity = 15;
    this.friction = 0.85;
    this.airResistance = 0.98;
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

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    testsFailed++;
  }
}

function createMockCharacter() {
  return {
    position: { x: 100, y: 100 },
    velocity: { x: 0, y: 0 },
    isGrounded: false
  };
}

// Run tests
console.log('Running PhysicsEngine Unit Tests...\n');

test('PhysicsEngine constructor initializes with correct constants', () => {
  const physics = new PhysicsEngine();
  
  assert(physics.gravity === 0.5, 'Gravity should be 0.5');
  assert(physics.terminalVelocity === 15, 'Terminal velocity should be 15');
  assert(physics.friction === 0.85, 'Friction should be 0.85');
  assert(physics.airResistance === 0.98, 'Air resistance should be 0.98');
});

test('applyGravity increases vertical velocity when not grounded', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = false;
  character.velocity.y = 0;

  physics.applyGravity(character);

  assert(character.velocity.y === 0.5, 'Velocity should increase by gravity constant');
});

test('applyGravity does not affect velocity when grounded', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = true;
  character.velocity.y = 0;

  physics.applyGravity(character);

  assert(character.velocity.y === 0, 'Velocity should remain 0 when grounded');
});

test('applyGravity caps velocity at terminal velocity', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = false;
  character.velocity.y = 14.8;

  physics.applyGravity(character);

  assert(character.velocity.y === 15, 'Velocity should be capped at terminal velocity');
});

test('applyGravity accumulates over multiple frames', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = false;
  character.velocity.y = 0;

  for (let i = 0; i < 5; i++) {
    physics.applyGravity(character);
  }

  assert(character.velocity.y === 2.5, 'Velocity should accumulate: 0.5 * 5 = 2.5');
});

test('applyFriction reduces horizontal velocity when grounded', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = true;
  character.velocity.x = 10;

  physics.applyFriction(character);

  assert(character.velocity.x === 8.5, 'Velocity should be reduced by friction: 10 * 0.85 = 8.5');
});

test('applyFriction applies air resistance when not grounded', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = false;
  character.velocity.x = 10;

  physics.applyFriction(character);

  assert(character.velocity.x === 9.8, 'Velocity should be reduced by air resistance: 10 * 0.98 = 9.8');
});

test('applyFriction gradually reduces velocity to near zero', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = true;
  character.velocity.x = 10;

  for (let i = 0; i < 20; i++) {
    physics.applyFriction(character);
  }

  assert(character.velocity.x < 1, 'Velocity should be reduced to less than 1 after 20 frames');
});

test('updatePosition applies velocity to position with deltaTime = 1', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.position.x = 100;
  character.position.y = 100;
  character.velocity.x = 5;
  character.velocity.y = -3;

  physics.updatePosition(character, 1);

  assert(character.position.x === 105, 'X position should increase by velocity.x');
  assert(character.position.y === 97, 'Y position should increase by velocity.y');
});

test('updatePosition scales movement by deltaTime', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.position.x = 100;
  character.position.y = 100;
  character.velocity.x = 10;
  character.velocity.y = 10;

  physics.updatePosition(character, 0.5);

  assert(character.position.x === 105, 'X position should move half distance: 100 + (10 * 0.5)');
  assert(character.position.y === 105, 'Y position should move half distance: 100 + (10 * 0.5)');
});

test('updatePosition handles negative velocities correctly', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.position.x = 100;
  character.position.y = 100;
  character.velocity.x = -5;
  character.velocity.y = -5;

  physics.updatePosition(character, 1);

  assert(character.position.x === 95, 'X position should decrease');
  assert(character.position.y === 95, 'Y position should decrease');
});

test('Full simulation: falling with gravity and terminal velocity', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = false;
  character.velocity.y = 0;
  character.position.y = 0;

  for (let i = 0; i < 50; i++) {
    physics.applyGravity(character);
    physics.updatePosition(character, 1);
  }

  assert(character.velocity.y === 15, 'Velocity should reach terminal velocity');
  assert(character.position.y > 200, 'Character should have fallen significantly');
});

test('Full simulation: horizontal movement with friction', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = true;
  character.velocity.x = 20;
  character.position.x = 0;

  for (let i = 0; i < 30; i++) {
    physics.applyFriction(character);
    physics.updatePosition(character, 1);
  }

  assert(character.velocity.x < 1, 'Velocity should be nearly stopped by friction');
  assert(character.position.x > 50 && character.position.x < 150, 
    'Character should have moved a moderate distance');
});

test('Full simulation: jump arc with gravity and air resistance', () => {
  const physics = new PhysicsEngine();
  const character = createMockCharacter();
  character.isGrounded = false;
  character.velocity.x = 5;
  character.velocity.y = -10;
  character.position.x = 0;
  character.position.y = 100;

  let maxHeight = character.position.y;

  for (let i = 0; i < 40; i++) {
    physics.applyGravity(character);
    physics.applyFriction(character);
    physics.updatePosition(character, 1);
    
    maxHeight = Math.min(maxHeight, character.position.y);
  }

  assert(maxHeight < 100, 'Character should have jumped up (lower Y)');
  assert(character.position.y > maxHeight, 'Character should have fallen back down');
  assert(character.velocity.y > 0, 'Character should be falling (positive Y velocity)');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests Complete: ${testsPassed} passed, ${testsFailed} failed`);
console.log('='.repeat(50));

if (testsFailed > 0) {
  process.exit(1);
}
