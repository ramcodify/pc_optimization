import * as THREE from 'three';

let preloaderAnimId = null;
let currentPreloaderRenderer = null;
let currentPreloaderScene = null;

export function dispose3DPreloaderScene() {
  if (preloaderAnimId) {
    cancelAnimationFrame(preloaderAnimId);
    preloaderAnimId = null;
  }
  if (currentPreloaderRenderer) {
    try {
      currentPreloaderRenderer.dispose();
      if (currentPreloaderRenderer.domElement && currentPreloaderRenderer.domElement.parentNode) {
        currentPreloaderRenderer.domElement.parentNode.removeChild(currentPreloaderRenderer.domElement);
      }
    } catch (e) {}
    currentPreloaderRenderer = null;
  }
  currentPreloaderScene = null;
}

export function init3DPreloaderScene(container) {
  if (!container) return;

  // Clean up any existing instance
  dispose3DPreloaderScene();

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  currentPreloaderScene = scene;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  currentPreloaderRenderer = renderer;

  container.appendChild(renderer.domElement);

  // Group for Preloader 3D Hardware Core
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Outer Wireframe Cyber Core (Red #ff1e38)
  const outerGeo = new THREE.IcosahedronGeometry(6.5, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0xff1e38,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  coreGroup.add(outerMesh);

  // Inner Glowing Sphere (Cyan #00f0ff)
  const innerGeo = new THREE.SphereGeometry(3.5, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.95
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerMesh);

  // Floating Cyber Particles
  const particlesCount = 250;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 40;
    positions[i + 1] = (Math.random() - 0.5) * 40;
    positions[i + 2] = (Math.random() - 0.5) * 40;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xff1e38,
    size: 0.35,
    transparent: true,
    opacity: 0.75
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Real-time 3D Animation Loop
  function animatePreloader() {
    preloaderAnimId = requestAnimationFrame(animatePreloader);

    outerMesh.rotation.x += 0.008;
    outerMesh.rotation.y += 0.012;

    innerMesh.rotation.x -= 0.014;
    innerMesh.rotation.y -= 0.018;

    particleSystem.rotation.y += 0.003;

    renderer.render(scene, camera);
  }

  animatePreloader();

  // Resize Handler
  const handleResize = () => {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  window.addEventListener('resize', handleResize, { passive: true });
}
