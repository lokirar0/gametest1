// Rail Mayhem: Depot to Depot — simulation and progression

// ============ TYPES ============
export type GameScreen = 'menu' | 'depot' | 'playing' | 'casino' | 'results';

export interface Vec2 { x: number; y: number; }

export interface Wagon {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: 'passenger' | 'cargo' | 'turret' | 'casino' | 'armor' | 'workshop';
  passengers: number;
  maxPassengers: number;
  onFire: boolean;
  fireTimer: number;
  detached: boolean;
  detachVelocity: { x: number; y: number };
  color: string;
  damageFlash: number;
}

export type EnemyType = 'bandit' | 'pterodactyl' | 'drone' | 'saboteur';

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  type: EnemyType;
  speed: number;
  vx: number;
  vy: number;
  attackTimer: number;
  attackCooldown: number;
  alive: boolean;
  deathTimer: number;
  angle: number;
  wingPhase: number;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  alive: boolean;
  trail: Vec2[];
  type: 'bullet' | 'explosive' | 'fire';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'smoke' | 'fire' | 'spark' | 'debris' | 'coin' | 'blood' | 'steam';
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  vy: number;
}

export interface GameState {
  screen: GameScreen;
  // Train
  trainX: number;
  trainSpeed: number; // km/h
  maxSpeed: number;
  acceleration: number;
  braking: number;
  wagons: Wagon[];
  // Camera shake
  shakeAmount: number;
  shakeTimer: number;
  // Enemies
  enemies: Enemy[];
  spawnTimer: number;
  waveNumber: number;
  waveIntensity: number;
  // Projectiles
  projectiles: Projectile[];
  turretAngle: number;
  turretReload: number;
  turretMaxReload: number;
  // Particles
  particles: Particle[];
  floatingTexts: FloatingText[];
  // Background
  bgOffset: number;
  mountainOffset: number;
  treeOffset: number;
  poleOffset: number;
  trackOffset: number;
  // Game stats
  score: number;
  coins: number;
  totalCoins: number;
  passengersSaved: number;
  passengersLost: number;
  enemiesKilled: number;
  distanceTraveled: number;
  gameTime: number;
  act: number; // 1, 2, 3
  // Track events
  trackLength: number;
  trackEventTimer: number;
  // Upgrades
  turretDamage: number;
  turretSpeed: number;
  trainArmor: number;
  autoRepair: number;
  // Mouse
  mouseX: number;
  mouseY: number;
  mouseDown: boolean;
  // Keys
  keys: Set<string>;
  // Misc
  paused: boolean;
  gameOver: boolean;
  gameOverTimer: number;
  actTransition: number; // timer for act transition text
  actTransitionText: string;
  // Random events
  eventTimer: number;
  activeEvent: string | null;
  eventDuration: number;
  // Derby (derail)
  derailed: boolean;
  derailTimer: number;
  // Depot
  depotLevel: number;
  unlockedLocomotives: string[];
  currentLocomotive: string;
  // Casino
  casinoCoins: number;
  casinoWins: number;
  casinoLosses: number;
  pityCounter: number;
  // Combo system
  combo: number;
  comboTimer: number;
  maxCombo: number;
}

// ============ CONSTANTS ============
export const CANVAS_W = 480;
export const CANVAS_H = 270;
export const GROUND_Y = 220;
export const TRACK_Y = 210;
const WAGON_W = 52;
const WAGON_H = 28;
const LOCO_W = 62;
const LOCO_H = 32;

// ============ COLORS (PS1 palette) ============
const C = {
  sky1: '#1a0a2e',
  sky2: '#2d1b4e',
  sky3: '#4a2c6e',
  mountain1: '#2a1a3e',
  mountain2: '#3a2a4e',
  tree: '#1a3a1a',
  treeDark: '#0a2a0a',
  ground: '#3a2a1a',
  groundDark: '#2a1a0a',
  track: '#5a5a5a',
  trackDark: '#3a3a3a',
  sleeper: '#4a3a2a',
  locoGreen: '#2a5a2a',
  locoGreenLight: '#3a7a3a',
  locoRed: '#8a2a2a',
  wagonBlue: '#2a3a6a',
  wagonBlueLight: '#3a4a8a',
  wagonGray: '#4a4a5a',
  wagonRed: '#6a2a2a',
  wagonGold: '#8a7a2a',
  window: '#8abaee',
  windowDark: '#4a6a8a',
  wheel: '#3a3a3a',
  wheelHub: '#6a6a6a',
  smoke: '#6a6a6a',
  fire1: '#ff4a00',
  fire2: '#ff8a00',
  fire3: '#ffca00',
  blood: '#aa2222',
  coin: '#ffd700',
  enemy: '#6a2a2a',
  enemyLight: '#8a3a3a',
  ptero: '#5a3a5a',
  pteroWing: '#7a4a7a',
  drone: '#4a4a6a',
  droneLight: '#6a6aaa',
  bullet: '#ffaa00',
  explosion: '#ff6600',
  text: '#ffffff',
  textShadow: '#000000',
  hud: '#000000aa',
  hudBorder: '#ff8800',
  hp: '#44cc44',
  hpLow: '#cc4444',
  hpBg: '#222222',
};

// ============ INIT ============
export function createInitialState(): GameState {
  return {
    screen: 'menu',
    trainX: 80,
    trainSpeed: 0,
    maxSpeed: 150,
    acceleration: 40,
    braking: 80,
    wagons: [],
    shakeAmount: 0,
    shakeTimer: 0,
    enemies: [],
    spawnTimer: 3,
    waveNumber: 0,
    waveIntensity: 0,
    projectiles: [],
    turretAngle: 0,
    turretReload: 0,
    turretMaxReload: 1.5,
    particles: [],
    floatingTexts: [],
    bgOffset: 0,
    mountainOffset: 0,
    treeOffset: 0,
    poleOffset: 0,
    trackOffset: 0,
    score: 0,
    passengersSaved: 0,
    passengersLost: 0,
    enemiesKilled: 0,
    distanceTraveled: 0,
    gameTime: 0,
    act: 1,
    trackLength: 3000,
    trackEventTimer: 0,
    turretDamage: 25,
    turretSpeed: 1,
    trainArmor: 0,
    autoRepair: 0,
    mouseX: CANVAS_W / 2,
    mouseY: CANVAS_H / 2,
    mouseDown: false,
    keys: new Set(),
    paused: false,
    gameOver: false,
    gameOverTimer: 0,
    actTransition: 0,
    actTransitionText: '',
    eventTimer: 30 + Math.random() * 30,
    activeEvent: null,
    eventDuration: 0,
    derailed: false,
    derailTimer: 0,
    depotLevel: 1,
    unlockedLocomotives: ['VL80'],
    currentLocomotive: 'VL80',
    casinoCoins: 0,
    casinoWins: 0,
    casinoLosses: 0,
    pityCounter: 0,
    // Start with some coins for testing
    coins: 1000,
    totalCoins: 1000,
    // Combo system
    combo: 0,
    comboTimer: 0,
    maxCombo: 0,
  };
}

export function initRun(state: GameState): void {
  state.trainSpeed = 0;
  state.wagons = [];
  state.enemies = [];
  state.projectiles = [];
  state.particles = [];
  state.floatingTexts = [];
  state.spawnTimer = 5;
  state.waveNumber = 0;
  state.waveIntensity = 0;
  state.score = 0;
  state.passengersSaved = 0;
  state.passengersLost = 0;
  state.enemiesKilled = 0;
  state.distanceTraveled = 0;
  state.gameTime = 0;
  state.act = 1;
  state.trackEventTimer = 0;
  state.gameOver = false;
  state.gameOverTimer = 0;
  state.actTransition = 3;
  state.actTransitionText = 'АКТ 1: БЕЗ ПУШКИ';
  state.eventTimer = 25 + Math.random() * 20;
  state.activeEvent = null;
  state.eventDuration = 0;
  state.derailed = false;
  state.derailTimer = 0;
  state.shakeAmount = 0;
  state.turretReload = 0;

  // Create locomotive
  // We store locomotive info but draw it separately
  // Wagons start after locomotive
  const wagonTypes: Array<{type: Wagon['type']; passengers: number}> = [
    { type: 'passenger', passengers: 20 },
    { type: 'passenger', passengers: 20 },
    { type: 'turret', passengers: 0 },
    { type: 'passenger', passengers: 15 },
    { type: 'casino', passengers: 5 },
  ];

  let xPos = LOCO_W + 8;
  for (const wt of wagonTypes) {
    const maxP = wt.type === 'passenger' ? 20 : wt.type === 'casino' ? 10 : 0;
    state.wagons.push({
      x: xPos,
      y: TRACK_Y - WAGON_H,
      width: WAGON_W,
      height: WAGON_H,
      hp: wt.type === 'armor' ? 2500 : wt.type === 'cargo' ? 1500 : 1000,
      maxHp: wt.type === 'armor' ? 2500 : wt.type === 'cargo' ? 1500 : 1000,
      type: wt.type,
      passengers: wt.passengers,
      maxPassengers: maxP,
      onFire: false,
      fireTimer: 0,
      detached: false,
      detachVelocity: { x: 0, y: 0 },
      color: getWagonColor(wt.type),
      damageFlash: 0,
    });
    xPos += WAGON_W + 6;
  }
}

function getWagonColor(type: Wagon['type']): string {
  switch (type) {
    case 'passenger': return C.wagonBlue;
    case 'cargo': return C.wagonGray;
    case 'turret': return C.wagonRed;
    case 'casino': return C.wagonGold;
    case 'armor': return '#4a5a4a';
    case 'workshop': return '#5a4a3a';
    default: return C.wagonGray;
  }
}

// ============ PS1 VERTEX JITTER ============
function jitter(v: number, amount: number = 0.5): number {
  return v + (Math.random() - 0.5) * amount;
}

// ============ UPDATE ============
export function update(state: GameState, dt: number): void {
  if (state.paused || state.screen !== 'playing') return;
  if (state.gameOver) {
    state.gameOverTimer += dt;
    updateParticles(state, dt);
    updateFloatingTexts(state, dt);
    return;
  }

  state.gameTime += dt;

  // Act transitions
  if (state.actTransition > 0) {
    state.actTransition -= dt;
  }

  // Tutorial hints (first 10 seconds)
  if (state.gameTime < 10 && state.gameTime > 0) {
    // Show tutorial text via actTransition system
    if (state.gameTime < 3 && !state.actTransitionText.includes('W/S')) {
      state.actTransition = 3;
      state.actTransitionText = 'W/S — ГАЗ/ТОРМОЗ | МЫШЬ — ПРИЦЕЛ';
    }
  }

  // Train speed is displayed in km/h, while route distance is measured in meters.
  if (state.distanceTraveled >= state.trackLength / 3 && state.act === 1) {
    state.act = 2;
    state.actTransition = 3;
    state.actTransitionText = 'АКТ 2: ПУШКА АКТИВИРОВАНА!';
    addShake(state, 10, 1);
  } else if (state.distanceTraveled >= state.trackLength * 2 / 3 && state.act === 2) {
    state.act = 3;
    state.actTransition = 3;
    state.actTransitionText = 'АКТ 3: ФИНАЛЬНАЯ ВОЛНА!';
    addShake(state, 15, 1.5);
  }

  // Train physics
  updateTrain(state, dt);

  // Distance
  state.distanceTraveled += (state.trainSpeed / 3.6) * dt;

  // Background scrolling
  const speed = state.trainSpeed;
  state.bgOffset += speed * 0.05 * dt;
  state.mountainOffset += speed * 0.15 * dt;
  state.treeOffset += speed * 0.4 * dt;
  state.poleOffset += speed * 0.7 * dt;
  state.trackOffset += speed * dt;

  // Spawn enemies
  updateSpawning(state, dt);

  // Update enemies
  updateEnemies(state, dt);

  // Update projectiles
  updateProjectiles(state, dt);

  // Update wagons
  updateWagons(state, dt);

  // Update particles
  updateParticles(state, dt);
  updateFloatingTexts(state, dt);

  // Random events
  updateEvents(state, dt);

  // Camera shake
  if (state.shakeTimer > 0) {
    state.shakeTimer -= dt;
    if (state.shakeTimer <= 0) state.shakeAmount = 0;
  }

  // Derail recovery
  if (state.derailed) {
    state.derailTimer -= dt;
    if (state.derailTimer <= 0) {
      state.derailed = false;
    }
  }

  // Auto repair
  if (state.autoRepair > 0) {
    for (const w of state.wagons) {
      if (!w.detached && w.hp < w.maxHp) {
        w.hp = Math.min(w.maxHp, w.hp + state.autoRepair * dt);
      }
    }
  }

  // Turret reload
  if (state.turretReload > 0) {
    state.turretReload -= dt * state.turretSpeed;
  }

  // Combo timer
  if (state.comboTimer > 0) {
    state.comboTimer -= dt;
    if (state.comboTimer <= 0) {
      state.combo = 0;
    }
  }

  // Shooting
  if (state.mouseDown && state.turretReload <= 0 && state.act >= 2) {
    shootTurret(state);
  }

  // Update turret angle
  const turretWagon = state.wagons.find(w => w.type === 'turret' && !w.detached);
  if (turretWagon) {
    const turretX = state.trainX + turretWagon.x + turretWagon.width / 2;
    const turretY = turretWagon.y - 5;
    state.turretAngle = Math.atan2(state.mouseY - turretY, state.mouseX - turretX);
  }

  // Check game over
  const aliveWagons = state.wagons.filter(w => !w.detached);
  const totalPassengers = aliveWagons.reduce((s, w) => s + w.passengers, 0);
  if (totalPassengers <= 0 && state.gameTime > 5) {
    state.gameOver = true;
    state.actTransitionText = 'ВСЕ ПАССАЖИРЫ ПОГИБЛИ!';
    state.actTransition = 5;
  }

  // Check run complete
  if (state.distanceTraveled >= state.trackLength) {
    state.gameOver = true;
    state.actTransitionText = 'ДЕПО ДОСТИГНУТО!';
    state.actTransition = 5;
    // Calculate rewards
    state.passengersSaved = totalPassengers;
    state.coins = state.passengersSaved * 10 + state.enemiesKilled * 25;
    state.totalCoins += state.coins;
  }
}

function updateTrain(state: GameState, dt: number): void {
  if (state.derailed) {
    state.trainSpeed *= 0.95;
    return;
  }

  // Acceleration
  if (state.keys.has('KeyW') || state.keys.has('ArrowUp')) {
    state.trainSpeed += state.acceleration * dt;
  }
  // Braking
  if (state.keys.has('KeyS') || state.keys.has('ArrowDown') || state.keys.has('Space')) {
    state.trainSpeed -= state.braking * dt;
    if (state.keys.has('Space') && state.trainSpeed > 60) {
      // Emergency brake — risk of derail on curves
      addShake(state, 3, 0.3);
    }
  }

  // Natural deceleration
  state.trainSpeed *= (1 - 0.3 * dt);

  // Clamp
  state.trainSpeed = Math.max(0, Math.min(state.maxSpeed, state.trainSpeed));

  // Smoke particles from locomotive
  if (state.trainSpeed > 10 && Math.random() < 0.3) {
    state.particles.push({
      x: state.trainX + 10,
      y: TRACK_Y - LOCO_H - 5,
      vx: -20 - Math.random() * 30,
      vy: -30 - Math.random() * 20,
      life: 1.5 + Math.random(),
      maxLife: 2,
      color: C.smoke,
      size: 3 + Math.random() * 4,
      type: 'steam',
    });
  }
}

function updateSpawning(state: GameState, dt: number): void {
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnWave(state);
    // Decrease spawn timer as game progresses
    const baseInterval = state.act === 1 ? 8 : state.act === 2 ? 5 : 3;
    state.spawnTimer = baseInterval + Math.random() * 3;
    state.waveNumber++;
    state.waveIntensity = Math.min(1, state.gameTime / 180);
  }
}

function spawnWave(state: GameState): void {
  const intensity = state.waveIntensity;
  const count = Math.floor(2 + intensity * 4 + Math.random() * 3);

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let type: EnemyType;

    if (state.act === 1) {
      type = roll < 0.7 ? 'bandit' : 'saboteur';
    } else if (state.act === 2) {
      if (roll < 0.3) type = 'bandit';
      else if (roll < 0.6) type = 'pterodactyl';
      else if (roll < 0.85) type = 'drone';
      else type = 'saboteur';
    } else {
      if (roll < 0.2) type = 'bandit';
      else if (roll < 0.45) type = 'pterodactyl';
      else if (roll < 0.75) type = 'drone';
      else type = 'saboteur';
    }

    spawnEnemy(state, type);
  }
}

function spawnEnemy(state: GameState, type: EnemyType): void {
  const spawnX = CANVAS_W + 20 + Math.random() * 100;
  let enemy: Enemy;

  switch (type) {
    case 'bandit':
      enemy = {
        x: spawnX,
        y: TRACK_Y - 14,
        width: 20,
        height: 14,
        hp: 60 + state.waveIntensity * 40,
        maxHp: 60 + state.waveIntensity * 40,
        type: 'bandit',
        speed: 40 + Math.random() * 30,
        vx: 0, vy: 0,
        attackTimer: 2 + Math.random() * 2,
        attackCooldown: 3,
        alive: true,
        deathTimer: 0,
        angle: 0,
        wingPhase: 0,
      };
      break;
    case 'pterodactyl':
      enemy = {
        x: spawnX,
        y: 30 + Math.random() * 60,
        width: 28,
        height: 16,
        hp: 80 + state.waveIntensity * 50,
        maxHp: 80 + state.waveIntensity * 50,
        type: 'pterodactyl',
        speed: 60 + Math.random() * 40,
        vx: 0, vy: 0,
        attackTimer: 3 + Math.random() * 3,
        attackCooldown: 4,
        alive: true,
        deathTimer: 0,
        angle: 0,
        wingPhase: Math.random() * Math.PI * 2,
      };
      break;
    case 'drone':
      enemy = {
        x: spawnX,
        y: 50 + Math.random() * 100,
        width: 12,
        height: 12,
        hp: 30 + state.waveIntensity * 20,
        maxHp: 30 + state.waveIntensity * 20,
        type: 'drone',
        speed: 80 + Math.random() * 50,
        vx: 0, vy: 0,
        attackTimer: 999,
        attackCooldown: 999,
        alive: true,
        deathTimer: 0,
        angle: 0,
        wingPhase: Math.random() * Math.PI * 2,
      };
      break;
    case 'saboteur':
      enemy = {
        x: spawnX,
        y: TRACK_Y - 16,
        width: 14,
        height: 16,
        hp: 100 + state.waveIntensity * 60,
        maxHp: 100 + state.waveIntensity * 60,
        type: 'saboteur',
        speed: 50 + Math.random() * 30,
        vx: 0, vy: 0,
        attackTimer: 4 + Math.random() * 2,
        attackCooldown: 5,
        alive: true,
        deathTimer: 0,
        angle: 0,
        wingPhase: 0,
      };
      break;
  }

  state.enemies.push(enemy);
}

function updateEnemies(state: GameState, dt: number): void {
  const trainSpeed = state.trainSpeed;

  for (const e of state.enemies) {
    if (!e.alive) {
      e.deathTimer -= dt;
      continue;
    }

    e.wingPhase += dt * 8;

    switch (e.type) {
      case 'bandit':
        // Move alongside the train, try to match speed
        e.x -= (trainSpeed * 0.5 + e.speed * 0.3) * dt;
        // Try to get closer to train
        const targetX = state.trainX + LOCO_W + state.wagons.length * (WAGON_W + 6) + 30;
        if (e.x > targetX + 40) e.x -= 20 * dt;
        // Attack: throw molotov
        e.attackTimer -= dt;
        if (e.attackTimer <= 0) {
          e.attackTimer = e.attackCooldown;
          // Throw at random wagon
          const targetWagon = state.wagons.filter(w => !w.detached);
          if (targetWagon.length > 0) {
            const tw = targetWagon[Math.floor(Math.random() * targetWagon.length)];
            const wx = state.trainX + tw.x + tw.width / 2;
            const wy = tw.y + tw.height / 2;
            // Molotov particle
            for (let i = 0; i < 3; i++) {
              state.particles.push({
                x: e.x,
                y: e.y,
                vx: (wx - e.x) * 0.8 + (Math.random() - 0.5) * 40,
                vy: (wy - e.y) * 0.8 - 50 + Math.random() * 20,
                life: 1,
                maxLife: 1,
                color: C.fire1,
                size: 4,
                type: 'fire',
              });
            }
            // Damage wagon
            damageWagon(state, tw, 15 + state.waveIntensity * 10);
          }
        }
        break;

      case 'pterodactyl':
        // Circle and swoop
        e.x -= trainSpeed * 0.3 * dt;
        e.y += Math.sin(e.wingPhase * 0.5) * 30 * dt;
        e.y = Math.max(20, Math.min(GROUND_Y - 40, e.y));
        // Swoop attack
        e.attackTimer -= dt;
        if (e.attackTimer <= 0) {
          e.attackTimer = e.attackCooldown;
          // Swoop toward train
          e.vy = 100;
          setTimeout(() => { e.vy = -60; }, 500);
          // Steal passenger
          const pWagons = state.wagons.filter(w => !w.detached && w.passengers > 0);
          if (pWagons.length > 0 && e.y > TRACK_Y - 60) {
            const pw = pWagons[Math.floor(Math.random() * pWagons.length)];
            pw.passengers--;
            state.passengersLost++;
            addFloatingText(state, state.trainX + pw.x + pw.width / 2, pw.y, '-1 🦅', '#ff4444');
          }
        }
        break;

      case 'drone':
        // Fly straight toward train, kamikaze
        const dx = (state.trainX + LOCO_W / 2) - e.x;
        const dy = (TRACK_Y - LOCO_H / 2) - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          e.x += (dx / dist) * e.speed * dt;
          e.y += (dy / dist) * e.speed * dt;
        }
        // Collision with train = explosion
        if (e.x < state.trainX + LOCO_W && e.x > state.trainX - 10 &&
            e.y > TRACK_Y - LOCO_H - 10 && e.y < TRACK_Y + 5) {
          e.alive = false;
          e.deathTimer = 0.5;
          explodeAt(state, e.x, e.y, 40);
          // Damage locomotive area
          const nearWagon = state.wagons.find(w => !w.detached &&
            Math.abs((state.trainX + w.x + w.width / 2) - e.x) < 40);
          if (nearWagon) damageWagon(state, nearWagon, 50);
          addShake(state, 8, 0.5);
        }
        break;

      case 'saboteur':
        // Run toward train and board it
        e.x -= trainSpeed * 0.4 * dt;
        e.attackTimer -= dt;
        if (e.attackTimer <= 0) {
          e.attackTimer = e.attackCooldown;
          // Board nearest wagon
          const nearW = state.wagons.filter(w => !w.detached);
          if (nearW.length > 0) {
            const nw = nearW[nearW.length - 1]; // last wagon
            damageWagon(state, nw, 30 + state.waveIntensity * 15);
            addShake(state, 3, 0.2);
          }
        }
        break;
    }

    // Remove if off screen left
    if (e.x < -50) {
      e.alive = false;
      e.deathTimer = 0;
    }
  }

  // Clean up dead enemies
  state.enemies = state.enemies.filter(e => e.alive || e.deathTimer > 0);
}

function updateProjectiles(state: GameState, dt: number): void {
  for (const p of state.projectiles) {
    if (!p.alive) continue;

    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 50 * dt; // gravity

    // Trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 8) p.trail.shift();

    // Check collision with enemies
    for (const e of state.enemies) {
      if (!e.alive) continue;
      const dx = p.x - (e.x + e.width / 2);
      const dy = p.y - (e.y + e.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < e.width / 2 + p.radius) {
        p.alive = false;
        e.hp -= p.damage;
        if (p.type === 'explosive') {
          explodeAt(state, p.x, p.y, 30);
          // Splash damage
          for (const e2 of state.enemies) {
            if (!e2.alive || e2 === e) continue;
            const d2 = Math.sqrt((p.x - e2.x) ** 2 + (p.y - e2.y) ** 2);
            if (d2 < 40) e2.hp -= p.damage * 0.5;
          }
        } else {
          // Sparks
          for (let i = 0; i < 5; i++) {
            state.particles.push({
              x: p.x, y: p.y,
              vx: (Math.random() - 0.5) * 100,
              vy: (Math.random() - 0.5) * 100,
              life: 0.3 + Math.random() * 0.3,
              maxLife: 0.5,
              color: C.fire2,
              size: 2,
              type: 'spark',
            });
          }
        }
        addShake(state, 2, 0.1);

        if (e.hp <= 0) {
          e.alive = false;
          e.deathTimer = 0.5;
          state.enemiesKilled++;
          state.score += 25;
          addFloatingText(state, e.x, e.y, '+25', C.coin);
          explodeAt(state, e.x + e.width / 2, e.y + e.height / 2, 20);
          // Coin drop
          for (let i = 0; i < 3; i++) {
            state.particles.push({
              x: e.x + e.width / 2,
              y: e.y,
              vx: (Math.random() - 0.5) * 60,
              vy: -80 - Math.random() * 40,
              life: 1,
              maxLife: 1,
              color: C.coin,
              size: 3,
              type: 'coin',
            });
          }
        }
        break;
      }
    }

    // Off screen
    if (p.x > CANVAS_W + 20 || p.x < -20 || p.y > CANVAS_H + 20) {
      p.alive = false;
    }
  }

  state.projectiles = state.projectiles.filter(p => p.alive);
}

function updateWagons(state: GameState, dt: number): void {
  for (const w of state.wagons) {
    if (w.detached) {
      // Detached wagon physics
      w.detachVelocity.y += 200 * dt; // gravity
      w.x += w.detachVelocity.x * dt;
      w.y += w.detachVelocity.y * dt;
      w.detachVelocity.x *= 0.99;
      continue;
    }

    // Fire damage
    if (w.onFire) {
      w.hp -= 10 * dt;
      w.fireTimer -= dt;
      // Fire particles
      if (Math.random() < 0.4) {
        state.particles.push({
          x: state.trainX + w.x + Math.random() * w.width,
          y: w.y + Math.random() * 5,
          vx: (Math.random() - 0.5) * 20,
          vy: -40 - Math.random() * 30,
          life: 0.5 + Math.random() * 0.5,
          maxLife: 1,
          color: Math.random() > 0.5 ? C.fire1 : C.fire2,
          size: 3 + Math.random() * 3,
          type: 'fire',
        });
      }
      if (w.fireTimer <= 0) w.onFire = false;
    }

    // Damage flash
    if (w.damageFlash > 0) w.damageFlash -= dt * 3;

    // Destroyed wagon
    if (w.hp <= 0 && !w.detached) {
      detachWagon(state, w);
    }

    // Passenger loss from damage
    if (w.hp < w.maxHp * 0.3 && w.passengers > 0 && Math.random() < 0.01) {
      w.passengers--;
      state.passengersLost++;
    }
  }
}

function damageWagon(state: GameState, w: Wagon, damage: number): void {
  const actualDamage = Math.max(1, damage - state.trainArmor);
  w.hp -= actualDamage;
  w.damageFlash = 1;

  // Chance to start fire
  if (Math.random() < 0.15 && !w.onFire) {
    w.onFire = true;
    w.fireTimer = 5 + Math.random() * 5;
  }

  // Passenger panic particles
  if (w.passengers > 0) {
    for (let i = 0; i < 2; i++) {
      state.particles.push({
        x: state.trainX + w.x + Math.random() * w.width,
        y: w.y + 5,
        vx: (Math.random() - 0.5) * 40,
        vy: -20 - Math.random() * 20,
        life: 0.5,
        maxLife: 0.5,
        color: '#ffaa88',
        size: 2,
        type: 'debris',
      });
    }
  }
}

function detachWagon(state: GameState, w: Wagon): void {
  w.detached = true;
  w.detachVelocity = {
    x: -30 - Math.random() * 50,
    y: -100 - Math.random() * 80,
  } as { x: number; y: number };
  // Lose all passengers
  state.passengersLost += w.passengers;
  w.passengers = 0;
  addShake(state, 12, 0.8);
  addFloatingText(state, state.trainX + w.x + w.width / 2, w.y, 'ВАГОН ПОТЕРЯН!', '#ff4444');

  // Explosion
  explodeAt(state, state.trainX + w.x + w.width / 2, w.y + w.height / 2, 40);
}

function shootTurret(state: GameState): void {
  const turretWagon = state.wagons.find(w => w.type === 'turret' && !w.detached);
  if (!turretWagon) return;

  const turretX = state.trainX + turretWagon.x + turretWagon.width / 2;
  const turretY = turretWagon.y - 5;
  const speed = 300;

  state.projectiles.push({
    x: turretX + Math.cos(state.turretAngle) * 15,
    y: turretY + Math.sin(state.turretAngle) * 15,
    vx: Math.cos(state.turretAngle) * speed,
    vy: Math.sin(state.turretAngle) * speed,
    radius: 4,
    damage: state.turretDamage,
    alive: true,
    trail: [],
    type: state.act >= 3 ? 'explosive' : 'bullet',
  });

  state.turretReload = state.turretMaxReload;
  addShake(state, 3, 0.15);

  // Muzzle flash
  for (let i = 0; i < 8; i++) {
    state.particles.push({
      x: turretX + Math.cos(state.turretAngle) * 18,
      y: turretY + Math.sin(state.turretAngle) * 18,
      vx: Math.cos(state.turretAngle) * 100 + (Math.random() - 0.5) * 60,
      vy: Math.sin(state.turretAngle) * 100 + (Math.random() - 0.5) * 60,
      life: 0.2 + Math.random() * 0.2,
      maxLife: 0.3,
      color: C.fire3,
      size: 3 + Math.random() * 3,
      type: 'spark',
    });
  }
}

function explodeAt(state: GameState, x: number, y: number, radius: number): void {
  for (let i = 0; i < 20; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * radius * 2;
    state.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 20,
      life: 0.5 + Math.random() * 0.5,
      maxLife: 1,
      color: [C.fire1, C.fire2, C.fire3, C.explosion][Math.floor(Math.random() * 4)],
      size: 3 + Math.random() * 5,
      type: 'fire',
    });
  }
  // Debris
  for (let i = 0; i < 8; i++) {
    state.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 150,
      vy: -50 - Math.random() * 100,
      life: 1 + Math.random(),
      maxLife: 2,
      color: '#5a4a3a',
      size: 2 + Math.random() * 3,
      type: 'debris',
    });
  }
  // Smoke
  for (let i = 0; i < 6; i++) {
    state.particles.push({
      x: x + (Math.random() - 0.5) * radius,
      y: y + (Math.random() - 0.5) * radius,
      vx: (Math.random() - 0.5) * 20,
      vy: -20 - Math.random() * 30,
      life: 1.5 + Math.random(),
      maxLife: 2,
      color: C.smoke,
      size: 5 + Math.random() * 8,
      type: 'smoke',
    });
  }
  addShake(state, 6, 0.3);
}

function updateEvents(state: GameState, dt: number): void {
  if (state.activeEvent) {
    state.eventDuration -= dt;
    if (state.eventDuration <= 0) {
      state.activeEvent = null;
    }
    return;
  }

  state.eventTimer -= dt;
  if (state.eventTimer <= 0) {
    state.eventTimer = 20 + Math.random() * 30;
    const events = ['cow', 'wind', 'balalaika', 'ghost_train'];
    state.activeEvent = events[Math.floor(Math.random() * events.length)];
    state.eventDuration = 3 + Math.random() * 4;

    switch (state.activeEvent) {
      case 'cow':
        addFloatingText(state, CANVAS_W / 2, 50, '🐄 КОРОВА НА ПУТЯХ!', '#ffaa00');
        // Damage if speed too high
        if (state.trainSpeed > 80) {
          addShake(state, 8, 0.5);
          addFloatingText(state, CANVAS_W / 2, 70, 'БАМ! -50 HP', '#ff4444');
          const firstW = state.wagons.find(w => !w.detached);
          if (firstW) damageWagon(state, firstW, 50);
        }
        break;
      case 'wind':
        addFloatingText(state, CANVAS_W / 2, 50, '🌪️ АНОМАЛЬНЫЙ ВИХРЬ!', '#aa44ff');
        addShake(state, 5, state.eventDuration);
        break;
      case 'balalaika':
        addFloatingText(state, CANVAS_W / 2, 50, '🎵 БАЯН ИЗ НИОТКУДА!', '#44ff44');
        // Slow enemies
        for (const e of state.enemies) {
          if (e.alive) e.speed *= 0.3;
        }
        break;
      case 'ghost_train':
        addFloatingText(state, CANVAS_W / 2, 50, '👻 ПОЕЗД-ПРИЗРАК!', '#aaaaff');
        addShake(state, 10, 1);
        break;
    }
  }
}

function updateParticles(state: GameState, dt: number): void {
  for (const p of state.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;

    switch (p.type) {
      case 'smoke':
      case 'steam':
        p.vy -= 10 * dt;
        p.size += 2 * dt;
        break;
      case 'fire':
        p.vy -= 30 * dt;
        p.size *= (1 - dt);
        break;
      case 'debris':
      case 'coin':
        p.vy += 150 * dt;
        break;
      case 'spark':
        p.vy += 80 * dt;
        break;
    }
  }
  state.particles = state.particles.filter(p => p.life > 0);
}

function updateFloatingTexts(state: GameState, dt: number): void {
  for (const ft of state.floatingTexts) {
    ft.y += ft.vy * dt;
    ft.life -= dt;
  }
  state.floatingTexts = state.floatingTexts.filter(ft => ft.life > 0);
}

function addShake(state: GameState, amount: number, duration: number): void {
  state.shakeAmount = Math.max(state.shakeAmount, amount);
  state.shakeTimer = Math.max(state.shakeTimer, duration);
}

function addFloatingText(state: GameState, x: number, y: number, text: string, color: string): void {
  state.floatingTexts.push({ x, y, text, color, life: 2, vy: -30 });
}

// ============ RENDER ============
export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.save();

  // Camera shake
  if (state.shakeTimer > 0) {
    const sx = (Math.random() - 0.5) * state.shakeAmount;
    const sy = (Math.random() - 0.5) * state.shakeAmount;
    ctx.translate(sx, sy);
  }

  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  grad.addColorStop(0, C.sky1);
  grad.addColorStop(0.5, C.sky2);
  grad.addColorStop(1, C.sky3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Stars
  ctx.fillStyle = '#ffffff44';
  for (let i = 0; i < 30; i++) {
    const sx = (i * 73 + state.bgOffset * 0.02) % CANVAS_W;
    const sy = (i * 37) % (GROUND_Y * 0.6);
    ctx.fillRect(jitter(sx), jitter(sy), 1, 1);
  }

  // Mountains (parallax)
  drawMountains(ctx, state);

  // Trees (parallax)
  drawTrees(ctx, state);

  // Poles (parallax)
  drawPoles(ctx, state);

  // Ground
  ctx.fillStyle = C.ground;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
  ctx.fillStyle = C.groundDark;
  ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);

  // Track
  drawTrack(ctx, state);

  // Draw detached wagons (behind)
  for (const w of state.wagons) {
    if (w.detached) {
      drawWagon(ctx, state, w, w.x, w.y);
    }
  }

  // Draw locomotive
  drawLocomotive(ctx, state);

  // Draw attached wagons
  for (const w of state.wagons) {
    if (!w.detached) {
      drawWagon(ctx, state, w, state.trainX + w.x, w.y);
    }
  }

  // Draw turret
  if (state.act >= 2) {
    drawTurret(ctx, state);
  }

  // Draw enemies
  for (const e of state.enemies) {
    drawEnemy(ctx, state, e);
  }

  // Draw projectiles
  for (const p of state.projectiles) {
    drawProjectile(ctx, p);
  }

  // Draw particles
  for (const p of state.particles) {
    drawParticle(ctx, p);
  }

  // Draw floating texts
  for (const ft of state.floatingTexts) {
    ctx.globalAlpha = Math.min(1, ft.life);
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.globalAlpha = 1;
  }

  // Act transition overlay
  if (state.actTransition > 0) {
    const alpha = Math.min(1, state.actTransition);
    ctx.fillStyle = `rgba(0,0,0,${alpha * 0.5})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = `rgba(255,136,0,${alpha})`;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.actTransitionText, CANVAS_W / 2, CANVAS_H / 2);
  }

  // Active event indicator
  if (state.activeEvent) {
    ctx.fillStyle = '#ff880088';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    const eventNames: Record<string, string> = {
      cow: '🐄 КОРОВА!',
      wind: '🌪️ ВИХРЬ!',
      balalaika: '🎵 БАЯН!',
      ghost_train: '👻 ПРИЗРАК!',
    };
    ctx.fillText(eventNames[state.activeEvent] || state.activeEvent, CANVAS_W / 2, 20);
  }

  // Crosshair
  if (state.act >= 2) {
    ctx.strokeStyle = '#ff440088';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(state.mouseX, state.mouseY, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(state.mouseX - 12, state.mouseY);
    ctx.lineTo(state.mouseX - 5, state.mouseY);
    ctx.moveTo(state.mouseX + 5, state.mouseY);
    ctx.lineTo(state.mouseX + 12, state.mouseY);
    ctx.moveTo(state.mouseX, state.mouseY - 12);
    ctx.lineTo(state.mouseX, state.mouseY - 5);
    ctx.moveTo(state.mouseX, state.mouseY + 5);
    ctx.lineTo(state.mouseX, state.mouseY + 12);
    ctx.stroke();
  }

  // Progress bar (distance to depot)
  const progress = Math.min(1, state.distanceTraveled / state.trackLength);
  ctx.fillStyle = '#00000088';
  ctx.fillRect(CANVAS_W / 2 - 60, 6, 120, 6);
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(CANVAS_W / 2 - 60, 6, 120 * progress, 6);
  ctx.fillStyle = '#ffffff88';
  ctx.font = '5px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('🏗️ → ДЕПО', CANVAS_W / 2, 5);
  // Train icon on progress
  ctx.fillStyle = '#44ff44';
  ctx.fillRect(CANVAS_W / 2 - 60 + 120 * progress - 2, 5, 4, 8);

  // Speed lines at high speed
  if (state.trainSpeed > 80) {
    const intensity = (state.trainSpeed - 80) / 70;
    ctx.strokeStyle = `rgba(255,255,255,${intensity * 0.2})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const y = 40 + Math.random() * (GROUND_Y - 60);
      const x = Math.random() * CANVAS_W;
      const len = 20 + Math.random() * 40;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - len, y);
      ctx.stroke();
    }
  }

  // Damage flash (red vignette when low HP)
  const totalHp = state.wagons.filter(w => !w.detached).reduce((s, w) => s + w.hp, 0);
  const maxHp = state.wagons.filter(w => !w.detached).reduce((s, w) => s + w.maxHp, 0);
  if (maxHp > 0 && totalHp / maxHp < 0.3) {
    const flash = Math.sin(state.gameTime * 4) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(255,0,0,${flash * 0.15})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  ctx.restore();
}

function drawMountains(ctx: CanvasRenderingContext2D, state: GameState): void {
  const offset = state.mountainOffset % 200;
  ctx.fillStyle = C.mountain1;
  for (let i = -1; i < 5; i++) {
    const x = i * 200 - offset;
    ctx.beginPath();
    ctx.moveTo(jitter(x), jitter(GROUND_Y));
    ctx.lineTo(jitter(x + 60), jitter(GROUND_Y - 70));
    ctx.lineTo(jitter(x + 100), jitter(GROUND_Y - 50));
    ctx.lineTo(jitter(x + 140), jitter(GROUND_Y - 80));
    ctx.lineTo(jitter(x + 200), jitter(GROUND_Y));
    ctx.fill();
  }
  ctx.fillStyle = C.mountain2;
  for (let i = -1; i < 5; i++) {
    const x = i * 160 - offset * 1.3 + 50;
    ctx.beginPath();
    ctx.moveTo(jitter(x), jitter(GROUND_Y));
    ctx.lineTo(jitter(x + 40), jitter(GROUND_Y - 40));
    ctx.lineTo(jitter(x + 80), jitter(GROUND_Y - 30));
    ctx.lineTo(jitter(x + 120), jitter(GROUND_Y - 50));
    ctx.lineTo(jitter(x + 160), jitter(GROUND_Y));
    ctx.fill();
  }
}

function drawTrees(ctx: CanvasRenderingContext2D, state: GameState): void {
  const offset = state.treeOffset % 80;
  for (let i = -1; i < 10; i++) {
    const x = i * 80 - offset + (i % 3) * 15;
    const h = 20 + (i % 4) * 8;
    // Trunk
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(jitter(x + 4), jitter(GROUND_Y - h + 10), 3, h - 10);
    // Foliage
    ctx.fillStyle = C.tree;
    ctx.beginPath();
    ctx.moveTo(jitter(x), jitter(GROUND_Y - h + 12));
    ctx.lineTo(jitter(x + 5), jitter(GROUND_Y - h));
    ctx.lineTo(jitter(x + 10), jitter(GROUND_Y - h + 12));
    ctx.fill();
    ctx.fillStyle = C.treeDark;
    ctx.beginPath();
    ctx.moveTo(jitter(x + 1), jitter(GROUND_Y - h + 18));
    ctx.lineTo(jitter(x + 5), jitter(GROUND_Y - h + 6));
    ctx.lineTo(jitter(x + 9), jitter(GROUND_Y - h + 18));
    ctx.fill();
  }
}

function drawPoles(ctx: CanvasRenderingContext2D, state: GameState): void {
  const offset = state.poleOffset % 120;
  for (let i = -1; i < 6; i++) {
    const x = i * 120 - offset;
    // Pole
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(jitter(x), jitter(GROUND_Y - 60), 3, 60);
    // Cross bar
    ctx.fillRect(jitter(x - 6), jitter(GROUND_Y - 58), 15, 2);
    // Wires
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x - 6, GROUND_Y - 57);
    ctx.quadraticCurveTo(x + 60, GROUND_Y - 50, x + 120 - 6, GROUND_Y - 57);
    ctx.stroke();
  }
}

function drawTrack(ctx: CanvasRenderingContext2D, state: GameState): void {
  // Rails
  ctx.fillStyle = C.track;
  ctx.fillRect(0, TRACK_Y, CANVAS_W, 2);
  ctx.fillRect(0, TRACK_Y + 6, CANVAS_W, 2);

  // Sleepers
  const offset = state.trackOffset % 12;
  ctx.fillStyle = C.sleeper;
  for (let i = -1; i < 45; i++) {
    const x = i * 12 - offset;
    ctx.fillRect(jitter(x), jitter(TRACK_Y - 1), 8, 10);
  }

  // Gravel
  ctx.fillStyle = '#5a4a3a';
  for (let i = 0; i < 60; i++) {
    const x = (i * 8 + state.trackOffset * 0.9) % CANVAS_W;
    ctx.fillRect(x, TRACK_Y + 9 + (i % 3), 2, 1);
  }
}

function drawLocomotive(ctx: CanvasRenderingContext2D, state: GameState): void {
  const x = state.trainX;
  const y = TRACK_Y - LOCO_H;

  // Main body
  ctx.fillStyle = C.locoGreen;
  ctx.fillRect(jitter(x + 5), jitter(y + 4), LOCO_W - 10, LOCO_H - 8);

  // Front (nose)
  ctx.fillStyle = C.locoGreenLight;
  ctx.fillRect(jitter(x), jitter(y + 8), 10, LOCO_H - 12);

  // Roof
  ctx.fillStyle = '#1a3a1a';
  ctx.fillRect(jitter(x + 8), jitter(y), LOCO_W - 16, 6);

  // Red stripe
  ctx.fillStyle = C.locoRed;
  ctx.fillRect(jitter(x + 5), jitter(y + LOCO_H / 2 - 1), LOCO_W - 10, 3);

  // Windows
  ctx.fillStyle = C.window;
  ctx.fillRect(jitter(x + 12), jitter(y + 8), 8, 6);
  ctx.fillRect(jitter(x + 24), jitter(y + 8), 8, 6);
  ctx.fillRect(jitter(x + 36), jitter(y + 8), 8, 6);

  // Headlight
  ctx.fillStyle = state.trainSpeed > 0 ? '#ffff88' : '#888844';
  ctx.fillRect(jitter(x + 1), jitter(y + 12), 3, 3);

  // Chimney
  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(jitter(x + 8), jitter(y - 6), 6, 8);

  // Wheels
  drawWheel(ctx, x + 12, TRACK_Y - 1, 5);
  drawWheel(ctx, x + 28, TRACK_Y - 1, 5);
  drawWheel(ctx, x + 44, TRACK_Y - 1, 5);

  // Damage overlay
  const avgHp = state.wagons.length > 0 ? 1 : 0;
  if (avgHp < 0.5) {
    ctx.fillStyle = `rgba(100,50,0,${0.3 * (1 - avgHp)})`;
    ctx.fillRect(x + 5, y + 4, LOCO_W - 10, LOCO_H - 8);
  }
}

function drawWagon(ctx: CanvasRenderingContext2D, state: GameState, w: Wagon, wx: number, wy: number): void {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(wx + 2, TRACK_Y + 2, w.width - 4, 3);

  // Main body
  let color = w.color;
  if (w.damageFlash > 0) {
    color = '#ffffff';
  }
  ctx.fillStyle = color;
  ctx.fillRect(jitter(wx + 2), jitter(wy + 2), w.width - 4, w.height - 6);

  // Roof
  ctx.fillStyle = '#2a2a3a';
  ctx.fillRect(jitter(wx + 3), jitter(wy), w.width - 6, 4);

  // Bottom frame
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(jitter(wx + 1), jitter(wy + w.height - 5), w.width - 2, 3);

  // Windows / details based on type
  switch (w.type) {
    case 'passenger':
      ctx.fillStyle = C.window;
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(jitter(wx + 6 + i * 11), jitter(wy + 6), 7, 7);
      }
      // Passengers (dots in windows)
      ctx.fillStyle = '#ffcc88';
      const pRatio = w.passengers / Math.max(1, w.maxPassengers);
      const pCount = Math.ceil(pRatio * 4);
      for (let i = 0; i < pCount; i++) {
        ctx.fillRect(wx + 8 + i * 11, wy + 9, 3, 3);
      }
      break;
    case 'turret':
      // Platform
      ctx.fillStyle = '#5a3a2a';
      ctx.fillRect(jitter(wx + 4), jitter(wy + 2), w.width - 8, 4);
      // Base
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(jitter(wx + w.width / 2 - 6), jitter(wy - 2), 12, 6);
      break;
    case 'casino':
      // Gold decorations
      ctx.fillStyle = '#ccaa00';
      ctx.fillRect(jitter(wx + 4), jitter(wy + 5), w.width - 8, 2);
      ctx.fillRect(jitter(wx + 4), jitter(wy + w.height - 9), w.width - 8, 2);
      // Star
      ctx.fillStyle = '#ffdd00';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★', wx + w.width / 2, wy + 16);
      break;
    case 'cargo':
      ctx.fillStyle = '#3a3a4a';
      ctx.fillRect(jitter(wx + 4), jitter(wy + 4), w.width - 8, w.height - 10);
      // Cross beams
      ctx.strokeStyle = '#5a5a6a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wx + 4, wy + 4);
      ctx.lineTo(wx + w.width - 4, wy + w.height - 6);
      ctx.moveTo(wx + w.width - 4, wy + 4);
      ctx.lineTo(wx + 4, wy + w.height - 6);
      ctx.stroke();
      break;
  }

  // HP bar
  if (w.hp < w.maxHp) {
    const barW = w.width - 8;
    const hpRatio = Math.max(0, w.hp / w.maxHp);
    ctx.fillStyle = C.hpBg;
    ctx.fillRect(wx + 4, wy - 5, barW, 3);
    ctx.fillStyle = hpRatio > 0.5 ? C.hp : hpRatio > 0.25 ? '#cccc44' : C.hpLow;
    ctx.fillRect(wx + 4, wy - 5, barW * hpRatio, 3);
  }

  // Wheels
  drawWheel(ctx, wx + 8, TRACK_Y - 1, 4);
  drawWheel(ctx, wx + w.width - 8, TRACK_Y - 1, 4);

  // Coupling
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(wx + w.width - 1, wy + w.height / 2 - 1, 5, 3);

  // Fire indicator
  if (w.onFire) {
    ctx.fillStyle = '#ff440088';
    ctx.fillRect(wx, wy, w.width, w.height);
  }
}

function drawWheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.fillStyle = C.wheel;
  ctx.beginPath();
  ctx.arc(jitter(x), jitter(y), r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.wheelHub;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawTurret(ctx: CanvasRenderingContext2D, state: GameState): void {
  const turretWagon = state.wagons.find(w => w.type === 'turret' && !w.detached);
  if (!turretWagon) return;

  const tx = state.trainX + turretWagon.x + turretWagon.width / 2;
  const ty = turretWagon.y - 2;

  // Barrel
  ctx.save();
  ctx.translate(tx, ty);
  ctx.rotate(state.turretAngle);

  // Barrel body
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(0, -2, 20, 4);
  // Muzzle
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(18, -3, 4, 6);

  ctx.restore();

  // Base
  ctx.fillStyle = '#4a4a4a';
  ctx.beginPath();
  ctx.arc(tx, ty, 6, 0, Math.PI * 2);
  ctx.fill();

  // Reload indicator
  if (state.turretReload > 0) {
    const ratio = state.turretReload / state.turretMaxReload;
    ctx.fillStyle = '#ff880088';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.arc(tx, ty, 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - ratio));
    ctx.fill();
  }
}

function drawEnemy(ctx: CanvasRenderingContext2D, state: GameState, e: Enemy): void {
  if (!e.alive) {
    // Death animation
    ctx.globalAlpha = e.deathTimer * 2;
  }

  switch (e.type) {
    case 'bandit':
      // Drezina (handcar)
      ctx.fillStyle = '#5a3a2a';
      ctx.fillRect(jitter(e.x), jitter(e.y + 4), e.width, e.height - 4);
      // Wheels
      ctx.fillStyle = '#3a3a3a';
      ctx.beginPath();
      ctx.arc(e.x + 4, e.y + e.height, 3, 0, Math.PI * 2);
      ctx.arc(e.x + e.width - 4, e.y + e.height, 3, 0, Math.PI * 2);
      ctx.fill();
      // Bandit
      ctx.fillStyle = '#8a4a2a';
      ctx.fillRect(jitter(e.x + 6), jitter(e.y - 4), 8, 10);
      // Head
      ctx.fillStyle = '#ccaa88';
      ctx.fillRect(jitter(e.x + 7), jitter(e.y - 8), 6, 5);
      // Hat
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(jitter(e.x + 6), jitter(e.y - 10), 8, 3);
      break;

    case 'pterodactyl':
      const wingY = Math.sin(e.wingPhase) * 6;
      // Body
      ctx.fillStyle = C.ptero;
      ctx.fillRect(jitter(e.x + 8), jitter(e.y + 4), 12, 8);
      // Wings
      ctx.fillStyle = C.pteroWing;
      ctx.beginPath();
      ctx.moveTo(jitter(e.x + 8), jitter(e.y + 6));
      ctx.lineTo(jitter(e.x), jitter(e.y + wingY));
      ctx.lineTo(jitter(e.x + 8), jitter(e.y + 10));
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(jitter(e.x + 20), jitter(e.y + 6));
      ctx.lineTo(jitter(e.x + 28), jitter(e.y + wingY));
      ctx.lineTo(jitter(e.x + 20), jitter(e.y + 10));
      ctx.fill();
      // Head
      ctx.fillStyle = '#7a4a3a';
      ctx.fillRect(jitter(e.x + 18), jitter(e.y + 2), 6, 5);
      // Beak
      ctx.fillStyle = '#aa7a2a';
      ctx.fillRect(jitter(e.x + 23), jitter(e.y + 3), 5, 2);
      // Eye
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(e.x + 20, e.y + 3, 2, 2);
      break;

    case 'drone':
      // Body
      ctx.fillStyle = C.drone;
      ctx.fillRect(jitter(e.x + 2), jitter(e.y + 2), e.width - 4, e.height - 4);
      // Propellers
      const propAngle = state.gameTime * 20;
      ctx.fillStyle = C.droneLight;
      ctx.fillRect(jitter(e.x - 2 + Math.cos(propAngle) * 3), jitter(e.y), 4, 2);
      ctx.fillRect(jitter(e.x + e.width - 4 + Math.cos(propAngle + Math.PI) * 3), jitter(e.y), 4, 2);
      // Red light
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(e.x + e.width / 2 - 1, e.y + e.height / 2 - 1, 2, 2);
      break;

    case 'saboteur':
      // Body
      ctx.fillStyle = '#4a2a4a';
      ctx.fillRect(jitter(e.x + 2), jitter(e.y + 4), e.width - 4, e.height - 4);
      // Head
      ctx.fillStyle = '#aa8866';
      ctx.fillRect(jitter(e.x + 3), jitter(e.y - 2), 8, 7);
      // Mask
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(jitter(e.x + 3), jitter(e.y), 8, 3);
      // Bomb
      ctx.fillStyle = '#2a2a2a';
      ctx.beginPath();
      ctx.arc(e.x + e.width, e.y + 8, 4, 0, Math.PI * 2);
      ctx.fill();
      // Fuse spark
      if (Math.random() > 0.5) {
        ctx.fillStyle = C.fire3;
        ctx.fillRect(e.x + e.width + 2, e.y + 3, 2, 2);
      }
      break;
  }

  // HP bar
  if (e.alive && e.hp < e.maxHp) {
    const barW = e.width;
    const hpRatio = e.hp / e.maxHp;
    ctx.fillStyle = '#00000088';
    ctx.fillRect(e.x, e.y - 6, barW, 2);
    ctx.fillStyle = hpRatio > 0.5 ? '#44cc44' : '#cc4444';
    ctx.fillRect(e.x, e.y - 6, barW * hpRatio, 2);
  }

  ctx.globalAlpha = 1;
}

function drawProjectile(ctx: CanvasRenderingContext2D, p: Projectile): void {
  // Trail
  ctx.strokeStyle = p.type === 'explosive' ? '#ff660088' : '#ffaa0044';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < p.trail.length; i++) {
    const t = p.trail[i];
    if (i === 0) ctx.moveTo(t.x, t.y);
    else ctx.lineTo(t.x, t.y);
  }
  ctx.stroke();

  // Bullet
  ctx.fillStyle = p.type === 'explosive' ? C.explosion : C.bullet;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fill();

  // Glow
  ctx.fillStyle = p.type === 'explosive' ? '#ff660044' : '#ffaa0044';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
  const alpha = Math.min(1, p.life / p.maxLife * 2);
  ctx.globalAlpha = alpha;

  switch (p.type) {
    case 'smoke':
    case 'steam':
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'fire':
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      break;
    case 'spark':
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      break;
    case 'debris':
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 5);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      break;
    case 'coin':
      ctx.fillStyle = C.coin;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#aa8800';
      ctx.font = '4px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('$', p.x, p.y + 1.5);
      break;
  }

  ctx.globalAlpha = 1;
}

// ============ CASINO LOGIC ============
export interface CasinoResult {
  won: boolean;
  amount: number;
  message: string;
  symbols?: string[];
}

function validateBet(state: GameState, bet: number): void {
  if (!Number.isSafeInteger(bet) || bet <= 0 || bet > Math.floor(state.coins * 0.3)) {
    throw new RangeError('Ставка должна быть целым числом и не превышать 30% монет.');
  }
}

export function playSlots(state: GameState, bet: number): CasinoResult {
  validateBet(state, bet);

  const symbols = ['🚂', '🚃', '💰', '🎰', '⭐', '🔥'];
  const result = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  // Check win
  if (result[0] === result[1] && result[1] === result[2]) {
    state.pityCounter = 0;
    const winAmount = bet * 49;
    state.coins += winAmount;
    state.casinoWins++;
    return { won: true, amount: winAmount, message: 'ДЖЕКПОТ!!! ×50!', symbols: result };
  }

  if (new Set(result).size === 2) {
    state.pityCounter = 0;
    const winAmount = bet;
    state.coins += winAmount;
    state.casinoWins++;
    return { won: true, amount: winAmount, message: 'Малый выигрыш! ×2', symbols: result };
  }

  state.pityCounter++;
  if (state.pityCounter >= 10) {
    state.pityCounter = 0;
    const winAmount = bet * 2;
    state.coins += winAmount;
    state.casinoWins++;
    return { won: true, amount: winAmount, message: 'УДАЧА ПРИШЛА! (pity) ×3', symbols: result };
  }

  state.coins -= bet;
  state.casinoLosses++;
  return { won: false, amount: -bet, message: 'Проигрыш...', symbols: result };
}

export function playRoulette(state: GameState, bet: number): CasinoResult {
  validateBet(state, bet);

  const sectors = [
    { profit: -1, chance: 0.35, msg: '×0 — Пусто!' },
    { profit: 0.5, chance: 0.25, msg: '×1.5 — Неплохо!' },
    { profit: 2, chance: 0.20, msg: '×3 — Отлично!' },
    { profit: 9, chance: 0.05, msg: '×10 — ДЖЕКПОТ!' },
    { profit: 1, chance: 0.10, msg: '×2 + БОНУС!' },
    { profit: -0.5, chance: 0.05, msg: 'ДЕБАФФ! -50%' },
  ];

  const roll = Math.random();
  let cumulative = 0;
  for (const sector of sectors) {
    cumulative += sector.chance;
    if (roll <= cumulative) {
      const result = Math.floor(bet * sector.profit);
      state.coins += result;
      if (result > 0) state.casinoWins++;
      else state.casinoLosses++;
      return { won: result > 0, amount: result, message: sector.msg };
    }
  }

  return { won: false, amount: -bet, message: 'Ошибка колеса...' };
}

// ============ SHOP ============
export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  maxLevel: number;
  apply: (state: GameState) => void;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'ammo', name: 'Патроны (50 шт)', desc: 'Боеприпасы для пушки',
    cost: 200, maxLevel: 99,
    apply: () => {},
  },
  {
    id: 'repair', name: 'Ремонтный набор', desc: 'Полностью чинит один вагон',
    cost: 150, maxLevel: 99,
    apply: () => {},
  },
  {
    id: 'armor1', name: 'Броня +200 HP', desc: 'Увеличивает прочность вагонов',
    cost: 500, maxLevel: 3,
    apply: (s) => { s.trainArmor += 5; },
  },
  {
    id: 'speed1', name: 'Ускоритель +10%', desc: 'Максимальная скорость поезда',
    cost: 800, maxLevel: 3,
    apply: (s) => { s.maxSpeed += 15; },
  },
  {
    id: 'dmg1', name: 'Пушка: урон +25%', desc: 'Увеличивает урон пушки',
    cost: 600, maxLevel: 3,
    apply: (s) => { s.turretDamage = Math.floor(s.turretDamage * 1.25); },
  },
  {
    id: 'reload1', name: 'Пушка: перезарядка -15%', desc: 'Быстрее стрельба',
    cost: 400, maxLevel: 3,
    apply: (s) => { s.turretMaxReload *= 0.85; },
  },
  {
    id: 'autorepair', name: 'Авто-ремонт +2 HP/с', desc: 'Вагоны медленно чинятся сами',
    cost: 1000, maxLevel: 3,
    apply: (s) => { s.autoRepair += 2; },
  },
];
