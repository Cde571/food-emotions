import * as THREE from 'three';

// ========================================
// CONFIGURACIÓN INICIAL
// ========================================

const canvas = document.getElementById('kitchen-scene');
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x1a2310, 10, 50);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 12);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ========================================
// ILUMINACIÓN
// ========================================

const ambientLight = new THREE.AmbientLight(0xa3b89c, 0.4);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(5, 8, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
scene.add(mainLight);

const spotLight = new THREE.SpotLight(0x687450, 1.5);
spotLight.position.set(0, 10, 0);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.3;
scene.add(spotLight);

// Luces de acento
const accentLight1 = new THREE.PointLight(0xa3b89c, 0.6, 15);
accentLight1.position.set(-8, 4, 3);
scene.add(accentLight1);

const accentLight2 = new THREE.PointLight(0x687450, 0.6, 15);
accentLight2.position.set(8, 4, 3);
scene.add(accentLight2);

// ========================================
// CREACIÓN DE MODELOS 3D REALISTAS
// ========================================

const models = [];
const zonesData = window.KITCHEN_ZONES_DATA || [];

// REFRIGERADOR 🧊
function createFridge(color) {
  const group = new THREE.Group();
  
  // Cuerpo principal
  const bodyGeometry = new THREE.BoxGeometry(2.5, 4, 1.5);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8f5e9,
    metalness: 0.6,
    roughness: 0.3
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);
  
  // Puerta superior
  const doorTopGeometry = new THREE.BoxGeometry(2.4, 1.8, 0.15);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f8f4,
    metalness: 0.7,
    roughness: 0.2
  });
  const doorTop = new THREE.Mesh(doorTopGeometry, doorMaterial);
  doorTop.position.set(0, 0.6, 0.76);
  doorTop.castShadow = true;
  group.add(doorTop);
  
  // Puerta inferior
  const doorBottomGeometry = new THREE.BoxGeometry(2.4, 2, 0.15);
  const doorBottom = new THREE.Mesh(doorBottomGeometry, doorMaterial);
  doorBottom.position.set(0, -1.1, 0.76);
  doorBottom.castShadow = true;
  group.add(doorBottom);
  
  // Manijas
  const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.9,
    roughness: 0.1
  });
  
  const handleTop = new THREE.Mesh(handleGeometry, handleMaterial);
  handleTop.rotation.z = Math.PI / 2;
  handleTop.position.set(-1, 0.6, 0.85);
  group.add(handleTop);
  
  const handleBottom = new THREE.Mesh(handleGeometry, handleMaterial);
  handleBottom.rotation.z = Math.PI / 2;
  handleBottom.position.set(-1, -1.1, 0.85);
  group.add(handleBottom);
  
  // Partículas de frío
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 50;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 3;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x87ceeb,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  group.add(particles);
  
  group.userData.particles = particles;
  group.userData.type = 'fridge';
  
  return group;
}

// ESTUFA 🔥
function createStove(color) {
  const group = new THREE.Group();
  
  // Base de la estufa
  const baseGeometry = new THREE.BoxGeometry(3, 0.3, 2.5);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    metalness: 0.8,
    roughness: 0.2
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -1.85;
  base.castShadow = true;
  group.add(base);
  
  // Superficie de cocción
  const topGeometry = new THREE.BoxGeometry(3.2, 0.1, 2.7);
  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.1
  });
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.y = -1.65;
  top.castShadow = true;
  group.add(top);
  
  // Hornillas (4)
  const burnerPositions = [
    [-0.8, 0.6],
    [0.8, 0.6],
    [-0.8, -0.6],
    [0.8, -0.6]
  ];
  
  group.userData.burners = [];
  
  burnerPositions.forEach(([x, z]) => {
    // Anillo de hornilla
    const burnerGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 32);
    const burnerMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.7,
      roughness: 0.3
    });
    const burner = new THREE.Mesh(burnerGeometry, burnerMaterial);
    burner.rotation.x = -Math.PI / 2;
    burner.position.set(x, -1.6, z);
    group.add(burner);
    
    // Llama (usando partículas)
    const flameGeometry = new THREE.ConeGeometry(0.25, 0.8, 8);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.7
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.set(x, -1.2, z);
    group.add(flame);
    
    // Luz de la llama
    const flameLight = new THREE.PointLight(0xff6600, 1, 3);
    flameLight.position.set(x, -1.2, z);
    group.add(flameLight);
    
    group.userData.burners.push({ flame, light: flameLight });
  });
  
  group.userData.type = 'stove';
  
  return group;
}

// DESPENSA 🏺
function createPantry(color) {
  const group = new THREE.Group();
  
  // Estante principal
  const shelfGeometry = new THREE.BoxGeometry(3.5, 4.5, 1.2);
  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b7355,
    roughness: 0.8,
    metalness: 0.1
  });
  const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
  shelf.castShadow = true;
  group.add(shelf);
  
  // Divisiones horizontales
  for (let i = -1; i <= 1; i++) {
    const dividerGeometry = new THREE.BoxGeometry(3.4, 0.1, 1.1);
    const divider = new THREE.Mesh(dividerGeometry, shelfMaterial);
    divider.position.y = i * 1.3;
    group.add(divider);
  }
  
  // Frascos en los estantes
  const jarPositions = [
    [-1.2, 1.3, 0.3], [0, 1.3, 0.3], [1.2, 1.3, 0.3],
    [-1.2, 0, 0.3], [0, 0, 0.3], [1.2, 0, 0.3],
    [-1.2, -1.3, 0.3], [0, -1.3, 0.3], [1.2, -1.3, 0.3]
  ];
  
  jarPositions.forEach(([x, y, z]) => {
    const jarGeometry = new THREE.CylinderGeometry(0.2, 0.22, 0.5, 16);
    const jarMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.1,
      transparent: true,
      opacity: 0.4,
      transmission: 0.9
    });
    const jar = new THREE.Mesh(jarGeometry, jarMaterial);
    jar.position.set(x, y, z);
    jar.castShadow = true;
    group.add(jar);
    
    // Tapa del frasco
    const lidGeometry = new THREE.CylinderGeometry(0.23, 0.23, 0.1, 16);
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.set(x, y + 0.3, z);
    group.add(lid);
  });
  
  group.userData.type = 'pantry';
  
  return group;
}

// LIBRO DE RECETAS 📖
function createBook(color) {
  const group = new THREE.Group();
  
  // Cubierta del libro (abierto)
  const coverLeftGeometry = new THREE.BoxGeometry(1.5, 0.1, 2);
  const coverMaterial = new THREE.MeshStandardMaterial({
    color: 0xa3b89c,
    roughness: 0.7,
    metalness: 0.1
  });
  
  const coverLeft = new THREE.Mesh(coverLeftGeometry, coverMaterial);
  coverLeft.rotation.z = -0.2;
  coverLeft.position.set(-0.8, 0, 0);
  coverLeft.castShadow = true;
  group.add(coverLeft);
  
  const coverRight = new THREE.Mesh(coverLeftGeometry, coverMaterial);
  coverRight.rotation.z = 0.2;
  coverRight.position.set(0.8, 0, 0);
  coverRight.castShadow = true;
  group.add(coverRight);
  
  // Lomo del libro
  const spineGeometry = new THREE.BoxGeometry(0.3, 0.15, 2);
  const spine = new THREE.Mesh(spineGeometry, coverMaterial);
  spine.position.set(0, 0.05, 0);
  group.add(spine);
  
  // Páginas (varias capas)
  for (let i = 0; i < 15; i++) {
    const pageGeometry = new THREE.BoxGeometry(1.4, 0.01, 1.9);
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff8dc,
      roughness: 0.9
    });
    const page = new THREE.Mesh(pageGeometry, pageMaterial);
    
    const side = i % 2 === 0 ? -1 : 1;
    page.rotation.z = side * (0.15 + Math.random() * 0.1);
    page.position.set(side * (0.7 + Math.random() * 0.1), 0.02 + i * 0.002, 0);
    group.add(page);
  }
  
  // Marcador de libro
  const bookmarkGeometry = new THREE.PlaneGeometry(0.15, 1.5);
  const bookmarkMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    side: THREE.DoubleSide
  });
  const bookmark = new THREE.Mesh(bookmarkGeometry, bookmarkMaterial);
  bookmark.position.set(0, 0.25, 0.8);
  group.add(bookmark);
  
  // Partículas mágicas alrededor del libro
  const magicGeometry = new THREE.BufferGeometry();
  const magicCount = 30;
  const magicPositions = new Float32Array(magicCount * 3);
  
  for (let i = 0; i < magicCount * 3; i++) {
    magicPositions[i] = (Math.random() - 0.5) * 4;
  }
  
  magicGeometry.setAttribute('position', new THREE.BufferAttribute(magicPositions, 3));
  const magicMaterial = new THREE.PointsMaterial({
    color: 0xffd700,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const magicParticles = new THREE.Points(magicGeometry, magicMaterial);
  group.add(magicParticles);
  
  group.userData.particles = magicParticles;
  group.userData.pages = group.children.filter(c => c.geometry?.type === 'BoxGeometry');
  group.userData.type = 'book';
  
  return group;
}

// MESÓN CENTRAL 🍽️
function createCounter(color) {
  const group = new THREE.Group();
  
  // Superficie del mesón
  const counterGeometry = new THREE.BoxGeometry(4, 0.2, 2.5);
  const counterMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4d4d4,
    roughness: 0.3,
    metalness: 0.6
  });
  const counter = new THREE.Mesh(counterGeometry, counterMaterial);
  counter.position.y = -0.5;
  counter.castShadow = true;
  counter.receiveShadow = true;
  group.add(counter);
  
  // Plato
  const plateGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32);
  const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
  });
  const plate = new THREE.Mesh(plateGeometry, plateMaterial);
  plate.position.set(-0.8, -0.35, 0);
  plate.castShadow = true;
  group.add(plate);
  
  // Tenedor
  const forkGeometry = new THREE.BoxGeometry(0.08, 0.8, 0.02);
  const utensilMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.9,
    roughness: 0.1
  });
  const fork = new THREE.Mesh(forkGeometry, utensilMaterial);
  fork.position.set(-1.3, -0.35, 0.3);
  fork.rotation.z = Math.PI / 6;
  group.add(fork);
  
  // Cuchillo
  const knifeGeometry = new THREE.BoxGeometry(0.08, 0.9, 0.02);
  const knife = new THREE.Mesh(knifeGeometry, utensilMaterial);
  knife.position.set(-1.3, -0.35, -0.3);
  knife.rotation.z = -Math.PI / 6;
  group.add(knife);
  
  // Copa de vino
  const glassGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.6, 16);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.3,
    transmission: 0.95
  });
  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.position.set(0.8, -0.05, 0.5);
  group.add(glass);
  
  // Vela decorativa
  const candleGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.5, 16);
  const candleMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff8dc,
    roughness: 0.8
  });
  const candle = new THREE.Mesh(candleGeometry, candleMaterial);
  candle.position.set(1.2, -0.15, -0.5);
  group.add(candle);
  
  // Llama de la vela
  const flameGeometry = new THREE.SphereGeometry(0.08, 8, 8);
  const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0.8
  });
  const flame = new THREE.Mesh(flameGeometry, flameMaterial);
  flame.position.set(1.2, 0.15, -0.5);
  flame.scale.y = 1.3;
  group.add(flame);
  
  // Luz de la vela
  const candleLight = new THREE.PointLight(0xffa500, 0.8, 4);
  candleLight.position.set(1.2, 0.15, -0.5);
  group.add(candleLight);
  
  group.userData.flame = flame;
  group.userData.candleLight = candleLight;
  group.userData.type = 'counter';
  
  return group;
}

// ========================================
// CREAR TODAS LAS ZONAS
// ========================================

const modelCreators = {
  fridge: createFridge,
  stove: createStove,
  pantry: createPantry,
  book: createBook,
  counter: createCounter
};

zonesData.forEach((zone, index) => {
  const createModel = modelCreators[zone.model];
  if (!createModel) return;
  
  const model = createModel(zone.color);
  
  // Posicionar en círculo
  const angle = (index / zonesData.length) * Math.PI * 2;
  const radius = 8;
  model.position.x = Math.cos(angle) * radius;
  model.position.z = Math.sin(angle) * radius;
  model.position.y = 0;
  
  // Rotar hacia el centro
  model.rotation.y = -angle + Math.PI / 2;
  
  model.userData.zone = zone;
  model.userData.index = index;
  model.userData.angle = angle;
  model.userData.initialRotation = model.rotation.y;
  
  scene.add(model);
  models.push(model);
});

// ========================================
// SISTEMA DE NAVEGACIÓN
// ========================================

let currentZoneIndex = 0;
let isAnimating = false;
let targetRotation = 0;

function moveToZone(index) {
  if (isAnimating || index === currentZoneIndex) return;
  
  isAnimating = true;
  currentZoneIndex = index;
  
  const targetAngle = models[index].userData.angle;
  targetRotation = -targetAngle;
  
  // Actualizar UI
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  
  // Actualizar progreso
  const progress = (index / (models.length - 1)) * 100;
  document.getElementById('progress-fill').style.width = `${progress}%`;
  
  setTimeout(() => {
    isAnimating = false;
  }, 1000);
}

// ========================================
// INTERACCIONES
// ========================================

// Click en navegación
document.querySelectorAll('.nav-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.index);
    moveToZone(index);
    showZoneModal(index);
  });
});

// Click en modelos 3D
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

canvas.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(models, true);
  
  if (intersects.length > 0) {
    let clickedModel = intersects[0].object;
    while (clickedModel.parent && !clickedModel.userData.zone) {
      clickedModel = clickedModel.parent;
    }
    
    if (clickedModel.userData.zone) {
      const index = clickedModel.userData.index;
      moveToZone(index);
      showZoneModal(index);
    }
  }
});

// Wheel navigation
let wheelTimeout;
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  
  clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(() => {
    if (event.deltaY > 0) {
      const nextIndex = (currentZoneIndex + 1) % models.length;
      moveToZone(nextIndex);
    } else {
      const prevIndex = (currentZoneIndex - 1 + models.length) % models.length;
      moveToZone(prevIndex);
    }
  }, 50);
}, { passive: false });

// Teclado
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    const nextIndex = (currentZoneIndex + 1) % models.length;
    moveToZone(nextIndex);
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    const prevIndex = (currentZoneIndex - 1 + models.length) % models.length;
    moveToZone(prevIndex);
  }
});

// ========================================
// MODAL
// ========================================

function showZoneModal(index) {
  const zone = zonesData[index];
  const modal = document.getElementById('zone-modal');
  
  document.getElementById('modal-icon').textContent = zone.icon;
  document.getElementById('modal-title').textContent = zone.name;
  document.getElementById('modal-subtitle').textContent = zone.subtitle;
  document.getElementById('modal-description').textContent = zone.description;
  document.getElementById('modal-count').textContent = zone.count;
  
  modal.classList.add('active');
}

document.getElementById('close-modal')?.addEventListener('click', () => {
  document.getElementById('zone-modal').classList.remove('active');
});

document.getElementById('modal-backdrop')?.addEventListener('click', () => {
  document.getElementById('zone-modal').classList.remove('active');
});

document.getElementById('view-all-recipes')?.addEventListener('click', () => {
  const zone = zonesData[currentZoneIndex];
  window.location.href = `/recipes?zone=${zone.id}`;
});

// Intro
document.getElementById('start-tour')?.addEventListener('click', () => {
  document.getElementById('intro-screen').classList.add('hidden');
  moveToZone(0);
});

// ========================================
// ANIMACIÓN
// ========================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  
  // Rotar toda la escena suavemente
  scene.rotation.y += (targetRotation - scene.rotation.y) * 0.05;
  
  // Animar cada modelo
  models.forEach((model, index) => {
    const type = model.userData.type;
    
    // Animación de flotación
    model.position.y = Math.sin(elapsedTime + index) * 0.2;
    
    // Animaciones específicas por tipo
    if (type === 'fridge' && model.userData.particles) {
      const particles = model.userData.particles;
      const positions = particles.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.01;
        if (positions[i + 1] < -2) positions[i + 1] = 2;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.5;
    }
    
    if (type === 'stove' && model.userData.burners) {
      model.userData.burners.forEach((burner, i) => {
        const offset = i * 0.5;
        burner.flame.scale.y = 1 + Math.sin(elapsedTime * 5 + offset) * 0.2;
        burner.light.intensity = 1 + Math.sin(elapsedTime * 5 + offset) * 0.3;
      });
    }
    
    if (type === 'book' && model.userData.particles) {
      model.userData.particles.rotation.y = elapsedTime * 0.3;
      
      // Animar páginas
      if (model.userData.pages) {
        model.userData.pages.forEach((page, i) => {
          page.rotation.z += Math.sin(elapsedTime + i) * 0.001;
        });
      }
    }
    
    if (type === 'counter' && model.userData.flame) {
      model.userData.flame.scale.y = 1.3 + Math.sin(elapsedTime * 6) * 0.15;
      model.userData.candleLight.intensity = 0.8 + Math.sin(elapsedTime * 6) * 0.2;
    }
    
    if (type === 'pantry') {
      model.rotation.y = model.userData.initialRotation + Math.sin(elapsedTime * 0.5) * 0.05;
    }
    
    // Resaltar zona activa
    if (index === currentZoneIndex) {
      model.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.05);
    } else {
      model.scale.setScalar(1);
    }
  });
  
  // Animar luces de acento
  accentLight1.intensity = 0.6 + Math.sin(elapsedTime) * 0.2;
  accentLight2.intensity = 0.6 + Math.cos(elapsedTime) * 0.2;
  
  renderer.render(scene, camera);
}

// ========================================
// RESPONSIVE
// ========================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========================================
// INICIAR
// ========================================

animate();
moveToZone(0);