import * as THREE from 'three';

// Variables globales
let scene;
let camera;
let renderer;
let currentZone = -1;
let isAnimating = false;
let targetPosition = { x: 0, y: 0, z: 25 };
let targetRotation = { x: 0, y: 0, z: 0 };
let kitchenObjects = [];
let ambientParticles;

// Zonas 3D (posiciones y colores)
const zones = [
  { pos: { x: -8, y: 2, z: 0 }, rot: { x: 0, y: Math.PI / 6, z: 0 }, color: 0x4ecdc4 },
  { pos: { x: 8, y: 2, z: 0 }, rot: { x: 0, y: -Math.PI / 6, z: 0 }, color: 0xff6b6b },
  { pos: { x: -8, y: -4, z: 0 }, rot: { x: Math.PI / 8, y: Math.PI / 6, z: 0 }, color: 0xffe66d },
  { pos: { x: 8, y: -4, z: 0 }, rot: { x: Math.PI / 8, y: -Math.PI / 6, z: 0 }, color: 0x95e1d3 },
  { pos: { x: 0, y: -1, z: -3 }, rot: { x: 0, y: 0, z: 0 }, color: 0xf38181 }
];

// Datos semánticos de cada zona
const zoneData = [
  { 
    id: 'refrigerator', 
    icon: '🧊', 
    title: 'Refrigerador', 
    subtitle: 'Sabores que decidiste conservar', 
    count: 24,
    description: 'Aquí guardamos tus recetas favoritas, momentos congelados en emoción para volver a ellos cuando quieras.'
  },
  { 
    id: 'stove', 
    icon: '🔥', 
    title: 'Estufa', 
    subtitle: 'Ideas que estás cocinando', 
    count: 8,
    description: 'Recetas en proceso, ideas calientes y experimentos culinarios que siguen tomando forma.'
  },
  { 
    id: 'pantry', 
    icon: '🏺', 
    title: 'Despensa', 
    subtitle: 'Tu mapa de sabores', 
    count: 31,
    description: 'Categorías, ingredientes y culturas. Aquí organizas cómo se ve tu universo gastronómico.'
  },
  { 
    id: 'cookbook', 
    icon: '📖', 
    title: 'Libro de Recetas', 
    subtitle: 'Tus capítulos favoritos', 
    count: 12,
    description: 'Colecciones curadas por ti. Capítulos de tu propia historia culinaria dentro de FoodEmotions.'
  },
  { 
    id: 'counter', 
    icon: '🍽️', 
    title: 'Mesón Central', 
    subtitle: 'Recuerdos recientes servidos', 
    count: 18,
    description: 'Lo último que probaste, lo último que sentiste. Tu historial reciente como un servicio recién salido del mesón.'
  }
];

function initThreeJS() {
  const canvas = document.getElementById('kitchen-scene');
  if (!canvas) {
    console.error('Canvas #kitchen-scene no encontrado');
    return;
  }

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x2a3320, 15, 55);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 25);

  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Iluminación mejorada
  const ambientLight = new THREE.AmbientLight(0x8a9b7a, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xd4e8cc, 1.2);
  mainLight.position.set(10, 15, 10);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  const fillLight1 = new THREE.PointLight(0xa3b89c, 0.8, 30);
  fillLight1.position.set(-10, 5, 8);
  scene.add(fillLight1);

  const fillLight2 = new THREE.PointLight(0x687450, 0.6, 25);
  fillLight2.position.set(10, -5, 5);
  scene.add(fillLight2);

  createKitchen();
  createAmbientParticles();
  animate();

  console.log('✅ Three.js inicializado correctamente');
}

function createKitchen() {
  // Suelo con textura
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a4530,
    roughness: 0.88,
    metalness: 0.12
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -6.5;
  floor.receiveShadow = true;
  scene.add(floor);

  // Pared de fondo con gradiente
  const wallGeometry = new THREE.PlaneGeometry(50, 25);
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a5a3e,
    roughness: 0.92
  });
  const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
  backWall.position.z = -12;
  backWall.position.y = 2;
  backWall.receiveShadow = true;
  scene.add(backWall);

  // Crear objetos de cocina por zona
  zones.forEach((zone, index) => {
    const group = new THREE.Group();
    group.userData.zoneIndex = index;

    // Base común con sombras
    const baseGeometry = new THREE.BoxGeometry(3.2, 4.2, 2.2);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: zone.color,
      roughness: 0.5,
      metalness: 0.35,
      emissive: zone.color,
      emissiveIntensity: 0.1
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Decoración específica por zona
    if (index === 0) {
      // REFRIGERADOR
      const doorGeometry = new THREE.BoxGeometry(2.9, 4, 0.25);
      const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8f4f8,
        metalness: 0.85,
        roughness: 0.15
      });
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.z = 1.2;
      door.castShadow = true;
      group.add(door);

      // Manija
      const handleGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15);
      const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.9,
        roughness: 0.1
      });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      handle.position.set(1.2, 0.5, 1.4);
      group.add(handle);

    } else if (index === 1) {
      // ESTUFA
      const stoveTop = new THREE.BoxGeometry(3, 0.3, 2);
      const stoveMaterial = new THREE.MeshStandardMaterial({
        color: 0x2c2c2c,
        metalness: 0.7,
        roughness: 0.3
      });
      const top = new THREE.Mesh(stoveTop, stoveMaterial);
      top.position.y = 2.2;
      group.add(top);

      // Hornillas
      const burnerGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 32);
      const burnerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2
      });
      
      const positions = [
        [-0.7, 2.3, 0.5],
        [0.7, 2.3, 0.5],
        [-0.7, 2.3, -0.5],
        [0.7, 2.3, -0.5]
      ];

      positions.forEach(pos => {
        const burner = new THREE.Mesh(burnerGeometry, burnerMaterial);
        burner.position.set(...pos);
        burner.rotation.x = Math.PI / 2;
        
        // Luz de hornilla
        const burnerLight = new THREE.PointLight(0xff6600, 0.3, 2);
        burnerLight.position.copy(burner.position);
        group.add(burnerLight);
        
        group.add(burner);
      });

    } else if (index === 2) {
      // DESPENSA
      const shelfGeometry = new THREE.BoxGeometry(2.9, 0.15, 1.9);
      const shelfMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8b6f47,
        roughness: 0.85
      });
      
      for (let i = 0; i < 4; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.y = -1.5 + i * 1.3;
        shelf.castShadow = true;
        group.add(shelf);

        // Frascos decorativos
        if (i > 0) {
          for (let j = 0; j < 3; j++) {
            const jarGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16);
            const jarMaterial = new THREE.MeshStandardMaterial({
              color: [0xffcc99, 0xff9966, 0xccaa88][j % 3],
              transparent: true,
              opacity: 0.8,
              roughness: 0.3,
              metalness: 0.2
            });
            const jar = new THREE.Mesh(jarGeometry, jarMaterial);
            jar.position.set(-0.8 + j * 0.8, -1.5 + i * 1.3 + 0.3, 0.5);
            group.add(jar);
          }
        }
      }

    } else if (index === 3) {
      // LIBRO DE RECETAS
      const bookGeometry = new THREE.BoxGeometry(2.2, 3, 0.5);
      const bookMaterial = new THREE.MeshStandardMaterial({
        color: zone.color,
        roughness: 0.92,
        metalness: 0.05
      });
      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      book.rotation.y = Math.PI / 8;
      book.position.y = 0.5;
      book.castShadow = true;
      group.add(book);

      // Páginas del libro
      const pagesGeometry = new THREE.BoxGeometry(2.1, 2.8, 0.4);
      const pagesMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff8dc,
        roughness: 0.95
      });
      const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
      pages.rotation.y = Math.PI / 8;
      pages.position.set(0.05, 0.5, 0);
      group.add(pages);

      // Marcador
      const ribbonGeometry = new THREE.PlaneGeometry(0.15, 2);
      const ribbonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        side: THREE.DoubleSide
      });
      const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
      ribbon.position.set(0, -0.5, 0.3);
      ribbon.rotation.y = Math.PI / 8;
      group.add(ribbon);

    } else if (index === 4) {
      // MESÓN CENTRAL
      const counterGeometry = new THREE.BoxGeometry(4.5, 0.35, 3.2);
      const counterMaterial = new THREE.MeshStandardMaterial({
        color: 0x7a7a7a,
        metalness: 0.65,
        roughness: 0.25
      });
      const counter = new THREE.Mesh(counterGeometry, counterMaterial);
      counter.position.y = 1.2;
      counter.castShadow = true;
      counter.receiveShadow = true;
      group.add(counter);

      // Platos decorativos
      const plateGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
      const plateMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.4
      });
      
      [-1.2, 0, 1.2].forEach((x, i) => {
        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        plate.position.set(x, 1.42, 0.5);
        plate.rotation.x = Math.PI / 2;
        group.add(plate);
      });
    }

    // Luz puntual de cada zona (más intensa)
    const pointLight = new THREE.PointLight(zone.color, 0.8, 12);
    pointLight.position.set(0, 3, 2);
    group.add(pointLight);

    // Halo de luz ambiental
    const haloGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: zone.color,
      transparent: true,
      opacity: 0
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.set(0, 3, 0);
    halo.userData.isHalo = true;
    group.add(halo);

    group.position.set(zone.pos.x, zone.pos.y, zone.pos.z);
    scene.add(group);
    kitchenObjects.push(group);
  });

  console.log('✅ Cocina 3D creada con', kitchenObjects.length, 'zonas');
}

function createAmbientParticles() {
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 150;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = Math.random() * 15 - 3;
    positions[i + 2] = (Math.random() - 0.5) * 30;

    // Colores cálidos de FoodEmotions
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      colors[i] = 0.8; colors[i + 1] = 1; colors[i + 2] = 0.8; // Verde menta
    } else if (colorChoice < 0.66) {
      colors[i] = 0.6; colors[i + 1] = 0.8; colors[i + 2] = 0.5; // Verde oliva
    } else {
      colors[i] = 0.9; colors[i + 1] = 0.95; colors[i + 2] = 0.85; // Amarillo suave
    }
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    transparent: true,
    opacity: 0.4,
    vertexColors: true,
    blending: THREE.AdditiveBlending
  });

  ambientParticles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(ambientParticles);
}

function animate() {
  requestAnimationFrame(animate);

  // Animación suave de cámara (estilo GTA)
  const lerpFactor = 0.04;
  camera.position.x += (targetPosition.x - camera.position.x) * lerpFactor;
  camera.position.y += (targetPosition.y - camera.position.y) * lerpFactor;
  camera.position.z += (targetPosition.z - camera.position.z) * lerpFactor;

  camera.rotation.x += (targetRotation.x - camera.rotation.x) * lerpFactor;
  camera.rotation.y += (targetRotation.y - camera.rotation.y) * lerpFactor;
  camera.rotation.z += (targetRotation.z - camera.rotation.z) * lerpFactor;

  // Partículas flotantes
  if (ambientParticles) {
    ambientParticles.rotation.y += 0.0006;
    ambientParticles.rotation.x += 0.0002;

    const positions = ambientParticles.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.002;
    }
    ambientParticles.geometry.attributes.position.needsUpdate = true;
  }

  // Animación de halos cuando hay zona activa
  kitchenObjects.forEach((group, index) => {
    const halo = group.children.find(child => child.userData.isHalo);
    if (halo) {
      if (index === currentZone) {
        halo.material.opacity = Math.min(halo.material.opacity + 0.02, 0.6);
        halo.scale.set(
          1 + Math.sin(Date.now() * 0.003) * 0.2,
          1 + Math.sin(Date.now() * 0.003) * 0.2,
          1 + Math.sin(Date.now() * 0.003) * 0.2
        );
      } else {
        halo.material.opacity = Math.max(halo.material.opacity - 0.02, 0);
      }
    }
  });

  renderer.render(scene, camera);
}

function zoomToZone(index) {
  if (index < 0 || index >= zones.length || isAnimating) return;

  isAnimating = true;
  currentZone = index;

  const zone = zones[index];
  const data = zoneData[index];

  // Calcular posición de cámara cinematográfica
  const cameraDistance = 6;
  const heightOffset = 1.5;
  
  targetPosition = {
    x: zone.pos.x + Math.sin(zone.rot.y) * cameraDistance,
    y: zone.pos.y + heightOffset,
    z: zone.pos.z + Math.cos(zone.rot.y) * cameraDistance
  };

  targetRotation = {
    x: zone.rot.x * 0.3,
    y: zone.rot.y,
    z: 0
  };

  showZoneInfo(data);
  updateNavDots(index);

  // Sonido de zoom (simulado con console)
  console.log(`🎬 Zoom a zona ${index + 1}: ${data.title}`);

  setTimeout(() => {
    isAnimating = false;
  }, 1200);
}

function showZoneInfo(data) {
  const zoneInfo = document.getElementById('zone-info');
  const icon = document.getElementById('info-icon');
  const title = document.getElementById('info-title');
  const subtitle = document.getElementById('info-subtitle');
  const count = document.getElementById('info-count');
  const description = document.getElementById('info-description');

  if (icon) icon.textContent = data.icon;
  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (count) count.textContent = String(data.count);
  if (description) description.textContent = data.description;

  if (zoneInfo) {
    zoneInfo.classList.add('active');
    console.log('ℹ️ Mostrando info de:', data.title);
  }
}

function updateNavDots(index) {
  const dots = document.querySelectorAll('.nav-dot');

  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  const progressFill = document.getElementById('progress-fill');
  if (progressFill) {
    const value = index >= 0 ? ((index + 1) / zones.length) * 100 : 0;
    progressFill.style.width = `${value}%`;
  }
}

function resetCamera() {
  targetPosition = { x: 0, y: 0, z: 25 };
  targetRotation = { x: 0, y: 0, z: 0 };
  currentZone = -1;

  const zoneInfo = document.getElementById('zone-info');
  if (zoneInfo) {
    zoneInfo.classList.remove('active');
  }

  updateNavDots(-1);
  console.log('🔄 Vista general restaurada');
}

function setupEvents() {
  const startBtn = document.getElementById('start-tour');
  const introScreen = document.getElementById('intro-screen');
  const closeInfo = document.getElementById('close-info');
  const viewRecipesBtn = document.getElementById('view-recipes');
  const navDots = document.querySelectorAll('.nav-dot');

  // Botón iniciar tour
  if (startBtn && introScreen) {
    startBtn.addEventListener('click', () => {
      console.log('🚀 Iniciando tour...');
      introScreen.classList.add('hidden');
      setTimeout(() => zoomToZone(0), 600);
    });
  }

  // Cerrar panel de info
  if (closeInfo) {
    closeInfo.addEventListener('click', (e) => {
      e.stopPropagation();
      resetCamera();
    });
  }

  // Botón ver recetas
  if (viewRecipesBtn) {
    viewRecipesBtn.addEventListener('click', () => {
      const currentData = zoneData[currentZone];
      console.log(`📖 Abriendo recetas de: ${currentData?.title}`);
      alert(`Aquí se mostrarían las ${currentData?.count} recetas de ${currentData?.title}.\n\n${currentData?.description}`);
      // Aquí conectarías con tu sistema de navegación real
    });
  }

  // Navigation dots
  navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (!isAnimating) {
        zoomToZone(index);
      }
    });
  });

  // Scroll para navegar
  let scrollTimeout = null;
  window.addEventListener('wheel', (e) => {
    if (isAnimating) return;

    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      if (e.deltaY > 0 && currentZone < zones.length - 1) {
        zoomToZone(currentZone + 1);
      } else if (e.deltaY < 0 && currentZone > 0) {
        zoomToZone(currentZone - 1);
      } else if (e.deltaY < 0 && currentZone === 0) {
        resetCamera();
      }
    }, 80);
  });

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (isAnimating) return;

    switch(e.key) {
      case 'ArrowRight':
        if (currentZone < zones.length - 1) {
          zoomToZone(currentZone + 1);
        }
        break;
      case 'ArrowLeft':
        if (currentZone > 0) {
          zoomToZone(currentZone - 1);
        } else if (currentZone === -1) {
          zoomToZone(0);
        }
        break;
      case 'Escape':
        resetCamera();
        break;
      case ' ':
        e.preventDefault();
        if (currentZone === -1) {
          zoomToZone(0);
        } else if (currentZone < zones.length - 1) {
          zoomToZone(currentZone + 1);
        } else {
          resetCamera();
        }
        break;
    }
  });

  console.log('✅ Event listeners configurados');
  console.log('💡 Controles: Scroll, Flechas ←→, Espacio, ESC');
}

// Responsive
window.addEventListener('resize', () => {
  if (!camera || !renderer) return;
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  console.log('📐 Ventana redimensionada');
});

// Inicialización
window.addEventListener('load', () => {
  console.log('🍳 Iniciando FoodEmotions Kitchen Archives...');
  initThreeJS();
  setupEvents();
  console.log('✨ Todo listo. ¡Disfruta tu tour culinario!');
});