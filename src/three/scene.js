import * as THREE from 'three';

let mainBgRenderer = null;
let mainBgScene = null;
let mainBgAnimId = null;

export function initMainBg3DScene() {
  const container = document.getElementById('webgl-container');
  if (!container) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  mainBgScene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 30;

  mainBgRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  mainBgRenderer.setSize(width, height);
  mainBgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.appendChild(mainBgRenderer.domElement);

  // 1. UNDULATING 3D CYBER WAVE GRID (THREE.PlaneGeometry)
  const gridGeo = new THREE.PlaneGeometry(120, 120, 40, 40);
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0xff1e38,
    wireframe: true,
    transparent: true,
    opacity: 0.16
  });

  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  gridMesh.rotation.x = -Math.PI / 2.3;
  gridMesh.position.y = -18;
  mainBgScene.add(gridMesh);

  // 2. FLOATING AMBIENT 3D PARTICLES
  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 180 : 350;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const redColor = new THREE.Color(0xff1e38);
  const cyanColor = new THREE.Color(0x00f0ff);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 80;
    positions[i + 1] = (Math.random() - 0.5) * 80;
    positions[i + 2] = (Math.random() - 0.5) * 80;

    const c = Math.random() > 0.35 ? redColor : cyanColor;
    colors[i] = c.r;
    colors[i + 1] = c.g;
    colors[i + 2] = c.b;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.65
  });

  const particleSystem = new THREE.Points(particlesGeo, particlesMat);
  mainBgScene.add(particleSystem);

  // ANIMATION LOOP FOR 3D WAVE GRID & PARTICLES
  let clock = new THREE.Clock();

  function animateMainBg() {
    mainBgAnimId = requestAnimationFrame(animateMainBg);

    const elapsedTime = clock.getElapsedTime();

    // Wave Grid Vertex Animation
    const pos = gridGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 0.15 + elapsedTime * 1.5) * 1.2 + Math.cos(v * 0.15 + elapsedTime * 1.5) * 1.2;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;

    // Slow Particle Rotation
    particleSystem.rotation.y = elapsedTime * 0.02;

    mainBgRenderer.render(mainBgScene, camera);
  }

  animateMainBg();

  window.addEventListener('resize', () => {
    if (!mainBgRenderer || !camera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mainBgRenderer.setSize(w, h);
  }, { passive: true });
}


// FUTURISTIC 3-FAN WIREFRAME CYBER GPU CARD (SHIFTED UPWARD INSIDE HERO CONTAINER)
export function init3DHardwareScene(container) {
  if (!container) return;

  const width = container.clientWidth || 500;
  const height = container.clientHeight || 440;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, -0.4, 17.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.appendChild(renderer.domElement);

  // INTENSE RED NEON LIGHTING
  const ambientLight = new THREE.AmbientLight(0xff1e38, 0.5);
  scene.add(ambientLight);

  const redNeonLight1 = new THREE.PointLight(0xff1e38, 8, 35);
  redNeonLight1.position.set(-6, 8, 12);
  scene.add(redNeonLight1);

  const redNeonLight2 = new THREE.PointLight(0xff334b, 8, 35);
  redNeonLight2.position.set(6, -8, 12);
  scene.add(redNeonLight2);

  // ROOT GPU HARDWARE GROUP (SHIFTED UPWARD BY +0.95 UNITS)
  const gpuGroup = new THREE.Group();
  gpuGroup.position.y = 0.95;
  gpuGroup.rotation.z = Math.PI / 5.5; // ~32 degree tilt
  gpuGroup.rotation.x = 0.28;
  gpuGroup.rotation.y = -0.32;
  scene.add(gpuGroup);

  // 1. MAIN CARD SHROUD (Wireframe Cyberpunk Mesh with Crimson Red Neon)
  const shroudWidth = 12.8;
  const shroudHeight = 5.2;
  const shroudDepth = 1.5;

  const shroudGeo = new THREE.BoxGeometry(shroudWidth, shroudHeight, shroudDepth, 16, 8, 4);
  const shroudWireMat = new THREE.MeshBasicMaterial({
    color: 0xff1e38,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const shroudWireMesh = new THREE.Mesh(shroudGeo, shroudWireMat);
  gpuGroup.add(shroudWireMesh);

  // Dark Inner Core Fill for Contrast
  const innerFillGeo = new THREE.BoxGeometry(shroudWidth - 0.2, shroudHeight - 0.2, shroudDepth - 0.2);
  const innerFillMat = new THREE.MeshBasicMaterial({
    color: 0x030406,
    transparent: true,
    opacity: 0.88
  });
  const innerFillMesh = new THREE.Mesh(innerFillGeo, innerFillMat);
  gpuGroup.add(innerFillMesh);

  // 2. SHARP GLOWING EDGE HIGHLIGHTS (EdgesGeometry)
  const edgesGeo = new THREE.EdgesGeometry(shroudGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xff334b, linewidth: 2 });
  const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
  gpuGroup.add(edgeLines);

  // 3. GLOWING VERTEX NODE POINTS AT CORNERS
  const vertices = shroudGeo.attributes.position.array;
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: 0xff1e38,
    size: 0.25,
    transparent: true,
    opacity: 0.95
  });
  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  gpuGroup.add(nodePoints);

  // 4. TRIPLE FANS ASSEMBLY (3 LARGE FANS: Left, Center, Right)
  const fansGroup = new THREE.Group();
  const fanPositions = [-3.8, 0.0, 3.8];
  const fanBladeControls = [];

  fanPositions.forEach((xPos) => {
    const fanContainer = new THREE.Group();
    fanContainer.position.x = xPos;
    fanContainer.position.z = 0.78;

    // Glowing Red Neon Outer Fan Ring
    const ringGeo = new THREE.TorusGeometry(1.85, 0.08, 16, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff1e38 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    fanContainer.add(ringMesh);

    // Inner Secondary Neon Ring
    const innerRingGeo = new THREE.TorusGeometry(1.72, 0.03, 16, 48);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0xff334b });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    fanContainer.add(innerRingMesh);

    // Central Wireframe Fan Hub
    const hubGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.15, 24);
    const hubMat = new THREE.MeshBasicMaterial({ color: 0xff1e38, wireframe: true });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.rotation.x = Math.PI / 2;
    fanContainer.add(hubMesh);

    // 11 Curved Cyber Fan Blades
    const bladesGroup = new THREE.Group();
    const bladeCount = 11;
    const bladeMat = new THREE.MeshBasicMaterial({
      color: 0xff1e38,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    for (let b = 0; b < bladeCount; b++) {
      const bladeGeo = new THREE.BoxGeometry(1.15, 0.2, 0.04);
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      const angle = (b / bladeCount) * Math.PI * 2;
      bladeMesh.position.x = Math.cos(angle) * 0.95;
      bladeMesh.position.y = Math.sin(angle) * 0.95;
      bladeMesh.rotation.z = angle + 0.42;
      bladesGroup.add(bladeMesh);
    }
    fanContainer.add(bladesGroup);
    fanBladeControls.push(bladesGroup);
    fansGroup.add(fanContainer);
  });
  gpuGroup.add(fansGroup);

  // 5. REAR PCIe I/O BRACKET WITH DISPLAYPORT/HDMI CUTOUTS (Left Edge)
  const ioBracketGeo = new THREE.BoxGeometry(0.3, 6.2, 1.8);
  const ioBracketMat = new THREE.MeshBasicMaterial({ color: 0xff1e38, wireframe: true });
  const ioBracketMesh = new THREE.Mesh(ioBracketGeo, ioBracketMat);
  ioBracketMesh.position.set(-6.55, 0.2, 0);
  gpuGroup.add(ioBracketMesh);

  // DisplayPort / HDMI Cutouts
  for (let port = 0; port < 3; port++) {
    const portGeo = new THREE.BoxGeometry(0.35, 0.4, 0.7);
    const portMat = new THREE.MeshBasicMaterial({ color: 0xff334b });
    const portMesh = new THREE.Mesh(portGeo, portMat);
    portMesh.position.set(-6.55, -1.5 + (port * 1.2), 0);
    gpuGroup.add(portMesh);
  }

  // 6. GOLD PCIe INTERFACE CONTACT STRIP (Bottom Edge)
  const pcieGeo = new THREE.BoxGeometry(8.8, 0.4, 0.12);
  const pcieMat = new THREE.MeshBasicMaterial({ color: 0xffb700 });
  const pcieMesh = new THREE.Mesh(pcieGeo, pcieMat);
  pcieMesh.position.set(-0.2, -2.8, -0.4);
  gpuGroup.add(pcieMesh);

  // 7. ORBITING RED NEON CYBER PARTICLES
  const particleCount = 180;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    pPositions[i] = (Math.random() - 0.5) * 22;
    pPositions[i + 1] = (Math.random() - 0.5) * 16;
    pPositions[i + 2] = (Math.random() - 0.5) * 14;
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xff1e38,
    size: 0.28,
    transparent: true,
    opacity: 0.8
  });
  const pSystem = new THREE.Points(pGeo, pMat);
  gpuGroup.add(pSystem);

  // 8. REAL-TIME 3D ANIMATION LOOP
  let clock = new THREE.Clock();

  function animateGPU() {
    requestAnimationFrame(animateGPU);

    const elapsedTime = clock.getElapsedTime();

    // High Speed Triple-Fan Blade Rotation
    fanBladeControls.forEach((blades) => {
      blades.rotation.z += 0.20;
    });

    // Smooth Floating Hovering Motion Shifted Upward
    gpuGroup.position.y = 0.95 + Math.sin(elapsedTime * 1.2) * 0.28;
    gpuGroup.rotation.y = -0.32 + Math.sin(elapsedTime * 0.8) * 0.15;
    gpuGroup.rotation.x = 0.28 + Math.cos(elapsedTime * 0.6) * 0.08;

    pSystem.rotation.y = elapsedTime * 0.05;

    renderer.render(scene, camera);
  }

  animateGPU();

  // Resize Handler
  const handleResize = () => {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth || 500;
    const h = container.clientHeight || 440;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  window.addEventListener('resize', handleResize, { passive: true });
}
