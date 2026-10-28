import * as THREE from 'three';
import {
  CANVAS_H,
  CANVAS_W,
  GROUND_Y,
  TRACK_Y,
  type Enemy,
  type GameState,
  type Projectile,
  type Wagon,
} from './engine';

const SCALE = 0.05;
const SCENE_WIDTH = 44;
const TRACK_SPACING = 1.15;

const palette = {
  rail: 0x49403b,
  window: 0x9bd5e8,
  passenger: 0x2871a0,
  cargo: 0x696b66,
  turret: 0x873b32,
  casino: 0xb18a3d,
  armor: 0x4c5f50,
  workshop: 0x765741,
};

function makeTurret(): THREE.Group {
  const mount = new THREE.Group();
  const brass = standard(0xc39543, 0.5);
  const barrel = standard(0x292d2d, 0.55);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.62, 0.22, 10), brass);
  base.position.y = 0.1;
  mount.add(base);
  box(mount, [0.62, 0.35, 0.62], [0, 0.36, 0], standard(0x51534d));
  box(mount, [0.98, 0.15, 0.19], [0.54, 0.42, 0], barrel);
  return mount;
}

function makeWeaponRig(kind: 'pistol' | 'rifle'): THREE.Group {
  const rig = new THREE.Group();
  const metal = standard(kind === 'rifle' ? 0x718078 : 0x92999b, 0.4);
  const darkMetal = standard(0x454c4e, 0.38);
  const grip = standard(0x806149);
  const sleeve = standard(0x65795f);
  const hand = standard(0xc98e69);

  box(rig, [0.24, 0.2, 0.32], [0.11, -0.1, -0.38], sleeve);
  box(rig, [0.19, 0.12, 0.18], [0.1, -0.03, -0.5], hand);
  if (kind === 'pistol') {
    box(rig, [0.16, 0.14, 0.47], [0.08, 0.02, -0.75], metal);
    box(rig, [0.12, 0.09, 0.36], [0.08, 0.13, -0.72], darkMetal);
    box(rig, [0.13, 0.26, 0.14], [0.08, -0.17, -0.57], grip);
    box(rig, [0.1, 0.09, 0.13], [0.08, 0.12, -0.95], darkMetal);
  } else {
    box(rig, [0.15, 0.15, 0.85], [0.08, -0.01, -0.84], metal);
    box(rig, [0.11, 0.08, 0.74], [0.08, 0.1, -0.9], darkMetal);
    box(rig, [0.065, 0.065, 0.48], [0.08, 0.015, -1.47], darkMetal);
    box(rig, [0.17, 0.25, 0.18], [0.08, -0.19, -0.66], grip);
    box(rig, [0.13, 0.27, 0.34], [0.08, -0.13, -0.25], grip);
    box(rig, [0.32, 0.17, 0.42], [-0.06, -0.04, -0.8], sleeve);
    box(rig, [0.2, 0.12, 0.2], [-0.05, 0.01, -0.67], hand);
    box(rig, [0.1, 0.08, 0.18], [0.08, 0.14, -0.81], darkMetal);
  }
  return rig;
}

function box(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function standard(color: THREE.ColorRepresentation, roughness = 0.82): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, flatShading: true });
}

function makeWheel(material: THREE.Material, x: number, z: number, radius = 0.29): THREE.Mesh {
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.16, 10), material);
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(x, radius, z);
  wheel.castShadow = true;
  wheel.receiveShadow = true;
  return wheel;
}

function makeLocomotive(): THREE.Group {
  const group = new THREE.Group();
  const green = standard(0x285e42);
  const greenLight = standard(0x46845b);
  const dark = standard(0x282b2a);
  const brass = standard(0xd19a44, 0.42);
  const window = standard(palette.window, 0.35);
  const wheels: THREE.Mesh[] = [];

  box(group, [3.15, 0.82, 1.18], [0, 0.82, 0], green);
  box(group, [1.32, 1.15, 1.2], [-0.86, 1.46, 0], greenLight);
  box(group, [0.72, 0.76, 1.1], [-1.34, 1.15, 0], green);
  box(group, [0.38, 0.2, 1.48], [1.51, 0.88, 0], brass);
  box(group, [0.78, 0.13, 1.3], [0.68, 0.38, 0], dark);
  box(group, [0.38, 0.49, 0.04], [-1.18, 1.53, 0.61], window);
  box(group, [0.38, 0.49, 0.04], [-1.18, 1.53, -0.61], window);

  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 1.92, 12), green);
  boiler.rotation.z = Math.PI / 2;
  boiler.position.set(0.52, 1.24, 0);
  boiler.castShadow = true;
  group.add(boiler);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.14, 0.62, 9), dark);
  chimney.position.set(1.02, 1.82, 0);
  chimney.castShadow = true;
  group.add(chimney);
  box(group, [0.52, 0.13, 0.48], [1.02, 2.13, 0], dark);

  for (const x of [-1.02, -0.18, 0.72, 1.31]) {
    const nearWheel = makeWheel(dark, x, 0.65);
    const farWheel = makeWheel(dark, x, -0.65);
    group.add(nearWheel, farWheel);
    wheels.push(nearWheel, farWheel);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 8), brass);
    hub.rotation.x = Math.PI / 2;
    hub.position.set(x, 0.65, 0.74);
    group.add(hub);
  }
  box(group, [0.35, 0.1, 0.1], [1.4, 1.1, 0.63], brass);
  group.userData.wheels = wheels;
  return group;
}

function makeWagon(wagon: Wagon): THREE.Group {
  const group = new THREE.Group();
  const bodyColor = wagon.type === 'passenger' ? palette.passenger
    : wagon.type === 'turret' ? palette.turret
      : wagon.type === 'casino' ? palette.casino
        : wagon.type === 'armor' ? palette.armor
          : wagon.type === 'workshop' ? palette.workshop : palette.cargo;
  const body = standard(bodyColor);
  const trim = standard(0x343b3c);
  const glass = standard(palette.window, 0.34);
  box(group, [2.62, 1.04, 1.28], [0, 0.92, 0], body);
  box(group, [2.7, 0.12, 1.38], [0, 1.5, 0], trim);
  box(group, [2.3, 0.12, 1.34], [0, 0.34, 0], trim);

  if (wagon.type === 'passenger' || wagon.type === 'casino') {
    for (const x of [-0.82, 0, 0.82]) {
      box(group, [0.43, 0.4, 0.035], [x, 1.08, 0.66], glass);
      box(group, [0.43, 0.4, 0.035], [x, 1.08, -0.66], glass);
    }
    if (wagon.type === 'casino') {
      box(group, [0.82, 0.18, 0.045], [0, 1.56, 0.69], standard(0xffdf68, 0.3));
    }
  } else if (wagon.type === 'cargo') {
    for (const x of [-0.84, 0, 0.84]) {
      box(group, [0.04, 0.84, 0.045], [x, 0.94, 0.67], trim);
    }
  } else if (wagon.type === 'workshop') {
    box(group, [1.65, 0.76, 0.06], [0, 0.99, 0.68], standard(0x8e704e));
  }

  for (const x of [-0.87, 0.87]) {
    group.add(makeWheel(trim, x, 0.7, 0.25));
    group.add(makeWheel(trim, x, -0.7, 0.25));
  }

  if (wagon.type === 'turret' || wagon.turretInstalled) {
    const mount = makeTurret();
    mount.position.set(0, 1.6, 0);
    group.add(mount);
    group.userData.turret = mount;
    group.userData.hasTurret = true;
  }

  return group;
}

function makeEnemy(type: Enemy['type']): THREE.Group {
  const group = new THREE.Group();
  const skin = standard(type === 'drone' ? 0x596f83 : type === 'pterodactyl' ? 0x69475b : 0x9a5743);
  const dark = standard(0x29292c);
  const cloth = standard(type === 'saboteur' ? 0x566644 : 0x493e38);

  if (type === 'drone') {
    const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.43, 0), skin);
    body.position.y = 1.1;
    group.add(body);
    box(group, [1.35, 0.08, 0.12], [0, 1.1, 0], dark);
    for (const x of [-0.58, 0.58]) {
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 8), standard(0x9fc3d0));
      rotor.position.set(x, 1.2, 0);
      group.add(rotor);
    }
    return group;
  }

  if (type === 'pterodactyl') {
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.15, 5), skin);
    body.rotation.z = -Math.PI / 2;
    body.position.set(0, 0.9, 0);
    group.add(body);
    const wing = box(group, [1.25, 0.09, 0.48], [0, 1.05, 0], cloth);
    group.userData.wing = wing;
    box(group, [0.34, 0.56, 0.12], [-0.12, 0.7, 0], skin);
    return group;
  }

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.56, 3, 6), cloth);
  body.position.y = 0.79;
  group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), skin);
  head.position.set(0.03, 1.35, 0);
  head.castShadow = true;
  group.add(head);
  box(group, [0.62, 0.1, 0.1], [0.1, 0.9, 0.45], dark);
  for (const x of [-0.17, 0.17]) {
    const leg = box(group, [0.14, 0.48, 0.18], [x, 0.24, 0], dark);
    group.userData.legs ??= [];
    (group.userData.legs as THREE.Mesh[]).push(leg);
  }
  if (type === 'saboteur') {
    box(group, [0.63, 0.16, 0.48], [0, 1.05, 0], standard(0x738a47));
  }
  return group;
}

function makeProjectile(projectile: Projectile): THREE.Mesh {
  const color = projectile.type === 'explosive' ? 0xff642e
    : projectile.type === 'fire' ? 0xffb33e : 0xffe98a;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(Math.max(0.11, projectile.radius * SCALE * 2), 8, 6),
    new THREE.MeshBasicMaterial({ color, toneMapped: false }),
  );
  return mesh;
}

export class GameRenderer3D {
  private readonly scene = new THREE.Scene();
  private readonly renderer: THREE.WebGLRenderer;
  private readonly train = makeLocomotive();
  private readonly camera = new THREE.PerspectiveCamera(72, 16 / 9, 0.1, 180);
  private readonly pistolRig = makeWeaponRig('pistol');
  private readonly rifleRig = makeWeaponRig('rifle');
  private readonly wagons: THREE.Group[] = [];
  private readonly enemies: Array<{ type: Enemy['type']; group: THREE.Group }> = [];
  private readonly projectiles: THREE.Mesh[] = [];
  private readonly particles: THREE.Mesh[] = [];
  private readonly particleGeometry = new THREE.SphereGeometry(1, 5, 4);
  private readonly sleepers: THREE.Mesh[] = [];
  private readonly scenery: THREE.Group[] = [];
  private readonly resizeObserver: ResizeObserver;
  private readonly clock = new THREE.Clock();

  constructor(private readonly host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.domElement.className = 'game-world-canvas';
    host.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color(0xe98e59);
    this.scene.fog = new THREE.Fog(0xe98e59, 34, 115);
    this.addLighting();
    this.addGroundAndTrack();
    this.addScenery();
    this.scene.add(this.train);
    this.camera.rotation.order = 'YXZ';
    this.camera.add(this.pistolRig, this.rifleRig);
    this.scene.add(this.camera);
    this.pistolRig.position.set(0.42, -0.37, -0.34);
    this.rifleRig.position.set(0.4, -0.39, -0.4);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();
  }

  render(state: GameState): void {
    const time = this.clock.getElapsedTime();
    this.updateView(state, time);
    this.syncTrain(state, time);
    this.syncWagons(state);
    this.syncEnemies(state, time);
    this.syncProjectiles(state);
    this.syncParticles(state);
    this.syncTrack(state);
    this.syncScenery(state);
    this.renderer.render(this.scene, this.camera);
  }

  updateAim(state: GameState): void {
    this.updateView(state, this.clock.getElapsedTime());
    const direction = this.camera.getWorldDirection(new THREE.Vector3());
    const target = this.camera.position.clone().addScaledVector(direction, 20);
    state.mouseX = target.x / SCALE + CANVAS_W / 2;
    state.mouseY = GROUND_Y - (target.y - 0.16) / SCALE;
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.renderer.dispose();
    this.host.removeChild(this.renderer.domElement);
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose());
      }
    });
  }

  private addLighting(): void {
    this.scene.add(new THREE.HemisphereLight(0xffdfbc, 0x4c423c, 2.2));
    const sun = new THREE.DirectionalLight(0xffedce, 3.2);
    sun.position.set(-8, 18, 12);
    this.scene.add(sun);
  }

  private addGroundAndTrack(): void {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(240, 110),
      standard(0x806344),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.09, -12);
    ground.receiveShadow = true;
    this.scene.add(ground);

    const ballast = new THREE.Mesh(new THREE.BoxGeometry(80, 0.16, 2.8), standard(0x685544));
    ballast.position.set(0, 0.02, 0);
    ballast.receiveShadow = true;
    this.scene.add(ballast);
    const railMaterial = standard(palette.rail, 0.42);
    const rail = new THREE.BoxGeometry(80, 0.17, 0.13);
    for (const z of [-0.84, 0.84]) {
      const beam = new THREE.Mesh(rail, railMaterial);
      beam.position.set(0, 0.18, z);
      beam.castShadow = true;
      beam.receiveShadow = true;
      this.scene.add(beam);
    }
    const sleeperMaterial = standard(0x513b2c);
    for (let i = 0; i < 44; i++) {
      const sleeper = box(
        this.scene,
        [0.18, 0.13, 2.35],
        [-SCENE_WIDTH / 2 + i * TRACK_SPACING, 0.1, 0],
        sleeperMaterial,
      );
      this.sleepers.push(sleeper);
    }
  }

  private addScenery(): void {
    const mountainColors = [0x77524b, 0x986553, 0x604c49, 0xab725b];
    for (let i = 0; i < 15; i++) {
      const width = 8 + (i % 4) * 2;
      const height = 5 + ((i * 7) % 8);
      const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(width * 0.58, height, 5 + (i % 3)),
        standard(mountainColors[i % mountainColors.length]),
      );
      mountain.position.set(-46 + i * 7.2, height / 2 - 0.5, -31 - (i % 3) * 3);
      mountain.rotation.y = i * 0.37;
      mountain.receiveShadow = true;
      this.scene.add(mountain);
    }

    const treeMaterial = standard(0x536344);
    const trunkMaterial = standard(0x684a35);
    for (let i = 0; i < 30; i++) {
      const tree = new THREE.Group();
      const height = 1.8 + (i % 4) * 0.38;
      box(tree, [0.2, height, 0.2], [0, height / 2, 0], trunkMaterial);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.9 + (i % 3) * 0.14, 1.8, 5), treeMaterial);
      crown.position.y = height + 0.5;
      crown.castShadow = true;
      tree.add(crown);
      tree.position.set(-SCENE_WIDTH / 2 + i * 2.5, 0, -5 - (i % 2) * 2);
      this.scene.add(tree);
      this.scenery.push(tree);
    }

    const cactusMaterial = standard(0x59744b);
    for (let i = 0; i < 24; i++) {
      const cactus = new THREE.Group();
      box(cactus, [0.34, 1.65, 0.32], [0, 0.84, 0], cactusMaterial);
      box(cactus, [0.72, 0.26, 0.3], [0.32, 1.1, 0], cactusMaterial);
      box(cactus, [0.24, 0.75, 0.27], [0.55, 1.36, 0], cactusMaterial);
      cactus.position.set(-SCENE_WIDTH / 2 + i * 3.2, 0, -8 - (i % 3) * 1.2);
      this.scene.add(cactus);
      this.scenery.push(cactus);
    }

    const poleMaterial = standard(0x584c41);
    for (let i = 0; i < 16; i++) {
      const pole = new THREE.Group();
      box(pole, [0.12, 5.2, 0.12], [0, 2.6, 0], poleMaterial);
      box(pole, [1.65, 0.12, 0.12], [0.6, 4.65, 0], poleMaterial);
      pole.position.set(-SCENE_WIDTH / 2 + i * 3, 0, -3.4);
      this.scene.add(pole);
      this.scenery.push(pole);
    }
  }

  private syncTrain(state: GameState, time: number): void {
    const x = this.worldX(state.trainX + 31);
    this.train.position.set(x, 0, 0);
    this.train.rotation.z = state.derailed ? Math.sin(time * 10) * 0.16 : 0;
    this.train.visible = !state.gameOver || !state.wagons.every(wagon => wagon.detached);
    const wheels = this.train.userData.wheels as THREE.Mesh[];
    wheels.forEach(wheel => {
      wheel.rotation.z = time * Math.max(0.4, state.trainSpeed / 22);
    });
  }

  private syncWagons(state: GameState): void {
    while (this.wagons.length < state.wagons.length) {
      const wagon = state.wagons[this.wagons.length];
      const group = makeWagon(wagon);
      this.scene.add(group);
      this.wagons.push(group);
    }
    this.wagons.forEach((group, index) => {
      const wagon = state.wagons[index];
      group.visible = !wagon.detached || wagon.y < CANVAS_H + 30;
      const verticalOffset = wagon.detached
        ? (TRACK_Y - wagon.y - wagon.height) * SCALE
        : 0;
      group.position.set(this.worldX(state.trainX + wagon.x + wagon.width / 2), verticalOffset, 0);
      group.rotation.z = wagon.detached ? -0.18 : 0;
      group.traverse(object => {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
          object.material.emissive.setHex(wagon.onFire ? 0x9e260c : 0x000000);
          object.material.emissiveIntensity = wagon.onFire ? 0.8 : 0;
        }
      });
      const needsTurret = wagon.turretInstalled || wagon.type === 'turret';
      let turret = group.userData.turret as THREE.Group | undefined;
      if (needsTurret && !turret) {
        turret = makeTurret();
        turret.position.set(0, 1.6, 0);
        group.add(turret);
        group.userData.turret = turret;
      } else if (!needsTurret && turret) {
        this.disposeObject(turret);
        delete group.userData.turret;
      }
      if (turret) turret.rotation.z = -wagon.turretAngle;
    });
  }

  private syncEnemies(state: GameState, time: number): void {
    while (this.enemies.length > state.enemies.length) {
      const removed = this.enemies.pop();
      if (removed) this.disposeObject(removed.group);
    }

    while (this.enemies.length < state.enemies.length) {
      const enemy = state.enemies[this.enemies.length];
      const group = makeEnemy(enemy.type);
      this.scene.add(group);
      this.enemies.push({ type: enemy.type, group });
    }
    this.enemies.forEach((entry, index) => {
      const enemy = state.enemies[index];
      if (entry.type !== enemy.type) {
        this.disposeObject(entry.group);
        const group = makeEnemy(enemy.type);
        this.scene.add(group);
        this.enemies[index] = { type: enemy.type, group };
        entry = this.enemies[index];
      }
      entry.group.visible = enemy.alive;
      entry.group.position.set(this.worldX(enemy.x + enemy.width / 2), this.worldY(enemy.y + enemy.height), -1.3);
      entry.group.rotation.z = enemy.type === 'pterodactyl' ? Math.sin(enemy.wingPhase) * 0.1 : 0;
      entry.group.scale.setScalar(enemy.type === 'drone' ? 0.75 : 0.9);
      const wing = entry.group.userData.wing as THREE.Mesh | undefined;
      if (wing) wing.rotation.x = Math.sin(enemy.wingPhase) * 0.55;
      const legs = entry.group.userData.legs as THREE.Mesh[] | undefined;
      legs?.forEach((leg, legIndex) => {
        leg.rotation.z = Math.sin(time * 11 + legIndex * Math.PI) * 0.4;
      });
    });
  }

  private disposeObject(object: THREE.Object3D): void {
    this.scene.remove(object);
    object.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach(material => material.dispose());
    });
  }

  private syncProjectiles(state: GameState): void {
    while (this.projectiles.length > state.projectiles.length) {
      const removed = this.projectiles.pop();
      if (removed) {
        this.scene.remove(removed);
        removed.geometry.dispose();
        const materials = Array.isArray(removed.material) ? removed.material : [removed.material];
        materials.forEach(material => material.dispose());
      }
    }

    while (this.projectiles.length < state.projectiles.length) {
      const projectile = state.projectiles[this.projectiles.length];
      const mesh = makeProjectile(projectile);
      this.scene.add(mesh);
      this.projectiles.push(mesh);
    }
    this.projectiles.forEach((mesh, index) => {
      const projectile = state.projectiles[index];
      mesh.position.set(this.worldX(projectile.x), this.worldY(projectile.y), 0.9);
      mesh.visible = projectile.alive;
    });
  }

  private syncParticles(state: GameState): void {
    while (this.particles.length > state.particles.length) {
      const removed = this.particles.pop();
      if (removed) {
        this.scene.remove(removed);
        (removed.material as THREE.Material).dispose();
      }
    }

    while (this.particles.length < state.particles.length) {
      const mesh = new THREE.Mesh(
        this.particleGeometry,
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false }),
      );
      this.scene.add(mesh);
      this.particles.push(mesh);
    }
    this.particles.forEach((mesh, index) => {
      const particle = state.particles[index];
      mesh.position.set(this.worldX(particle.x), this.worldY(particle.y), 0.8);
      mesh.scale.setScalar(Math.max(0.035, particle.size * SCALE));
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.color.set(particle.color);
      material.opacity = Math.max(0, Math.min(1, particle.life / particle.maxLife));
    });
  }

  private syncTrack(state: GameState): void {
    const offset = (state.trackOffset * SCALE) % TRACK_SPACING;
    this.sleepers.forEach((sleeper, index) => {
      sleeper.position.x = -SCENE_WIDTH / 2 + index * TRACK_SPACING - offset;
    });
  }

  private syncScenery(state: GameState): void {
    const offset = (state.treeOffset * SCALE) % SCENE_WIDTH;
    this.scenery.forEach((object, index) => {
      const base = -SCENE_WIDTH / 2 + ((index * 2.5) % SCENE_WIDTH);
      object.position.x = ((base - offset + SCENE_WIDTH / 2) % SCENE_WIDTH + SCENE_WIDTH) % SCENE_WIDTH - SCENE_WIDTH / 2;
    });
  }

  private updateView(state: GameState, time: number): void {
    this.camera.position.set(this.worldX(state.trainX + state.playerX), 2.45, state.playerZ);
    this.camera.rotation.set(state.playerPitch, state.playerYaw, 0, 'YXZ');
    this.pistolRig.visible = state.weapon === 'pistol';
    this.rifleRig.visible = state.weapon === 'rifle';
    const bob = Math.sin(time * 10) * 0.018;
    this.pistolRig.position.y = -0.37 + bob;
    this.rifleRig.position.y = -0.39 + bob;
  }

  private resize(): void {
    const width = Math.max(1, this.host.clientWidth);
    const height = Math.max(1, this.host.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private worldX(x: number): number {
    return (x - CANVAS_W / 2) * SCALE;
  }

  private worldY(y: number): number {
    return Math.max(0.18, (GROUND_Y - y) * SCALE + 0.16);
  }
}
