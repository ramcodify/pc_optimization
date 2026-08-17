import * as THREE from 'three';
import { createBrushedMetalTexture, createCircuitTexture } from './canvas-textures.js';

export function buildGPUModel() {
  const gpuGroup = new THREE.Group();

  const brushedMetalTex = createBrushedMetalTexture();
  const circuitTex = createCircuitTexture();

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x12141c,
    metalness: 0.88,
    roughness: 0.28,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
    map: brushedMetalTex,
  });

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a404e,
    metalness: 0.95,
    roughness: 0.15,
  });

  const heatsinkMaterial = new THREE.MeshStandardMaterial({
    color: 0x484e5e,
    metalness: 0.9,
    roughness: 0.35,
  });

  const copperPipeMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97736,
    metalness: 0.92,
    roughness: 0.2,
  });

  const pcbMaterial = new THREE.MeshStandardMaterial({
    color: 0x08090d,
    metalness: 0.4,
    roughness: 0.6,
    map: circuitTex,
  });

  const redLedMaterial = new THREE.MeshStandardMaterial({
    color: 0xff1e38,
    emissive: 0xff1e38,
    emissiveIntensity: 4.0,
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.95,
    roughness: 0.1,
  });

  // PCB Board
  const pcbGeo = new THREE.BoxGeometry(6.2, 0.12, 3.2);
  const pcb = new THREE.Mesh(pcbGeo, pcbMaterial);
  pcb.position.set(0, -0.6, 0);
  pcb.castShadow = true;
  pcb.receiveShadow = true;
  gpuGroup.add(pcb);

  // PCIe Gold Connector
  const pcieGeo = new THREE.BoxGeometry(3.6, 0.22, 0.06);
  const pcie = new THREE.Mesh(pcieGeo, goldMaterial);
  pcie.position.set(-0.6, -0.72, -1.55);
  gpuGroup.add(pcie);

  // Backplate
  const backplateGeo = new THREE.BoxGeometry(6.1, 0.08, 3.1);
  const backplate = new THREE.Mesh(backplateGeo, bodyMaterial);
  backplate.position.set(0, -0.5, 0);
  gpuGroup.add(backplate);

  // Backplate Red Cutout Lines
  const bpLineGeo = new THREE.BoxGeometry(4.0, 0.02, 0.06);
  const bpLine1 = new THREE.Mesh(bpLineGeo, redLedMaterial);
  bpLine1.position.set(0.4, -0.45, 0.8);
  gpuGroup.add(bpLine1);

  const bpLine2 = new THREE.Mesh(bpLineGeo, redLedMaterial);
  bpLine2.position.set(0.4, -0.45, -0.8);
  gpuGroup.add(bpLine2);

  // Heatsink Fin Array
  const heatsinkGroup = new THREE.Group();
  const finCount = 52;
  const finWidth = 0.04;
  const finGap = 0.09;
  const startX = -2.4;

  for (let i = 0; i < finCount; i++) {
    const finGeo = new THREE.BoxGeometry(finWidth, 0.85, 2.7);
    const fin = new THREE.Mesh(finGeo, heatsinkMaterial);
    fin.position.set(startX + i * finGap, -0.05, 0);
    fin.castShadow = true;
    heatsinkGroup.add(fin);
  }
  gpuGroup.add(heatsinkGroup);

  // Copper Heat Pipes
  for (let p = -0.8; p <= 0.8; p += 0.4) {
    const pipeGeo = new THREE.CylinderGeometry(0.07, 0.07, 5.4, 16);
    const pipe = new THREE.Mesh(pipeGeo, copperPipeMaterial);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, -0.15, p);
    gpuGroup.add(pipe);
  }

  // Metallic Outer Shroud
  const shroudGroup = new THREE.Group();

  const shroudMainGeo = new THREE.BoxGeometry(6.3, 0.35, 3.3);
  const shroudMain = new THREE.Mesh(shroudMainGeo, bodyMaterial);
  shroudMain.position.set(0, 0.42, 0);
  shroudMain.castShadow = true;
  shroudMain.receiveShadow = true;
  shroudGroup.add(shroudMain);

  const bezelTopGeo = new THREE.BoxGeometry(6.35, 0.08, 0.12);
  const bezelTop = new THREE.Mesh(bezelTopGeo, edgeMaterial);
  bezelTop.position.set(0, 0.58, 1.62);
  shroudGroup.add(bezelTop);

  const bezelBottom = new THREE.Mesh(bezelTopGeo, edgeMaterial);
  bezelBottom.position.set(0, 0.58, -1.62);
  shroudGroup.add(bezelBottom);

  const sideArmorGeo = new THREE.BoxGeometry(0.12, 0.9, 3.3);
  const sideArmorLeft = new THREE.Mesh(sideArmorGeo, bodyMaterial);
  sideArmorLeft.position.set(-3.12, 0.05, 0);
  shroudGroup.add(sideArmorLeft);

  const sideArmorRight = new THREE.Mesh(sideArmorGeo, bodyMaterial);
  sideArmorRight.position.set(3.12, 0.05, 0);
  shroudGroup.add(sideArmorRight);

  // Performance Red Side Logo Strip (ALTEGO GPU)
  const logoStripGeo = new THREE.BoxGeometry(3.2, 0.06, 0.08);
  const logoStrip = new THREE.Mesh(logoStripGeo, redLedMaterial);
  logoStrip.position.set(0, 0.55, 1.64);
  shroudGroup.add(logoStrip);

  const powerSocketGeo = new THREE.BoxGeometry(0.8, 0.3, 0.4);
  const powerSocket = new THREE.Mesh(powerSocketGeo, bodyMaterial);
  powerSocket.position.set(2.2, 0.45, -1.45);
  shroudGroup.add(powerSocket);

  const clipGeo = new THREE.BoxGeometry(0.7, 0.06, 0.06);
  const clip1 = new THREE.Mesh(clipGeo, redLedMaterial);
  clip1.position.set(2.2, 0.58, -1.4);
  shroudGroup.add(clip1);

  gpuGroup.add(shroudGroup);

  // Triple Cooling Fans
  const fanMeshes = [];
  const fanPositions = [-1.8, 0, 1.8];

  fanPositions.forEach((posX) => {
    const fanGroup = new THREE.Group();
    fanGroup.position.set(posX, 0.55, 0);

    const ringGeo = new THREE.TorusGeometry(0.92, 0.04, 16, 48);
    const ring = new THREE.Mesh(ringGeo, edgeMaterial);
    ring.rotation.x = Math.PI / 2;
    fanGroup.add(ring);

    const hubGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.1, 32);
    const hub = new THREE.Mesh(hubGeo, bodyMaterial);
    hub.position.y = 0.02;
    fanGroup.add(hub);

    const hubRingGeo = new THREE.TorusGeometry(0.24, 0.02, 12, 32);
    const hubRing = new THREE.Mesh(hubRingGeo, redLedMaterial);
    hubRing.rotation.x = Math.PI / 2;
    hubRing.position.y = 0.08;
    fanGroup.add(hubRing);

    const bladeGroup = new THREE.Group();
    const bladeCount = 9;
    for (let b = 0; b < bladeCount; b++) {
      const angle = (b / bladeCount) * Math.PI * 2;
      const bladeGeo = new THREE.BoxGeometry(0.18, 0.03, 0.62);
      const blade = new THREE.Mesh(bladeGeo, bodyMaterial);
      blade.position.set(Math.sin(angle) * 0.52, 0.02, Math.cos(angle) * 0.52);
      blade.rotation.y = angle + 0.3;
      blade.rotation.x = 0.25;
      bladeGroup.add(blade);
    }
    fanGroup.add(bladeGroup);

    gpuGroup.add(fanGroup);
    fanMeshes.push(bladeGroup);
  });

  gpuGroup.rotation.x = THREE.MathUtils.degToRad(-8);
  gpuGroup.rotation.y = THREE.MathUtils.degToRad(-18);

  return {
    gpuGroup,
    fanMeshes,
  };
}
