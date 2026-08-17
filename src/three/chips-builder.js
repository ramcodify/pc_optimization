import * as THREE from 'three';
import { createCircuitTexture, createGoldPinTexture } from './canvas-textures.js';

export function buildFloatingChips() {
  const circuitTex = createCircuitTexture();
  const goldPinTex = createGoldPinTexture();

  const chipBodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x11131a,
    metalness: 0.85,
    roughness: 0.25,
    clearcoat: 0.5,
    map: circuitTex,
  });

  const siliconDieMat = new THREE.MeshStandardMaterial({
    color: 0x1a1e28,
    metalness: 0.95,
    roughness: 0.1,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.95,
    roughness: 0.15,
    map: goldPinTex,
  });

  // Performance Red Edge Glow Material
  const redGlowMat = new THREE.MeshStandardMaterial({
    color: 0xff1e38,
    emissive: 0xff1e38,
    emissiveIntensity: 3.5,
  });

  const chips = [];

  function createChip(sizeX, sizeY, sizeZ, options = {}) {
    const chipGroup = new THREE.Group();

    const baseGeo = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const baseMesh = new THREE.Mesh(baseGeo, chipBodyMat);
    baseMesh.castShadow = true;
    chipGroup.add(baseMesh);

    const pinGeo = new THREE.BoxGeometry(sizeX * 0.92, 0.02, sizeZ * 0.92);
    const pinMesh = new THREE.Mesh(pinGeo, goldMat);
    pinMesh.position.y = -sizeY / 2 - 0.01;
    chipGroup.add(pinMesh);

    if (options.hasDie) {
      const dieGeo = new THREE.BoxGeometry(sizeX * 0.48, sizeY * 0.4, sizeZ * 0.48);
      const dieMesh = new THREE.Mesh(dieGeo, siliconDieMat);
      dieMesh.position.y = sizeY / 2 + sizeY * 0.2;
      chipGroup.add(dieMesh);

      const frameGeo = new THREE.BoxGeometry(sizeX * 0.54, 0.02, sizeZ * 0.54);
      const frameMesh = new THREE.Mesh(frameGeo, goldMat);
      frameMesh.position.y = sizeY / 2 + 0.01;
      chipGroup.add(frameMesh);
    }

    if (options.hasRedEdge) {
      const edgeGeo = new THREE.BoxGeometry(sizeX + 0.02, sizeY * 0.3, 0.04);
      const edgeMesh = new THREE.Mesh(edgeGeo, redGlowMat);
      edgeMesh.position.set(0, 0, sizeZ / 2 + 0.01);
      chipGroup.add(edgeMesh);
    }

    if (options.isBlurred) {
      chipGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.opacity = 0.55;
          child.material.roughness = 0.8;
        }
      });
    }

    return chipGroup;
  }

  // Chip 1: Top Right Near Processor
  const chip1 = createChip(1.2, 0.15, 1.2, { hasDie: true, hasRedEdge: true });
  chip1.position.set(3.8, 2.2, 1.5);
  chip1.rotation.set(0.2, -0.4, 0.15);
  chips.push({
    mesh: chip1,
    basePos: new THREE.Vector3(3.8, 2.2, 1.5),
    depthFactor: 1.4,
    floatSpeed: 0.9,
    floatAmp: 0.18,
    rotSpeed: { x: 0.003, y: 0.005, z: 0.002 },
  });

  // Chip 2: Behind GPU
  const chip2 = createChip(1.5, 0.18, 1.5, { hasDie: true });
  chip2.position.set(1.2, 1.8, -2.2);
  chip2.rotation.set(-0.3, 0.5, -0.2);
  chips.push({
    mesh: chip2,
    basePos: new THREE.Vector3(1.2, 1.8, -2.2),
    depthFactor: 0.6,
    floatSpeed: 0.7,
    floatAmp: 0.14,
    rotSpeed: { x: -0.002, y: 0.004, z: 0.001 },
  });

  // Chip 3: Lower Right Front Chip
  const chip3 = createChip(0.9, 0.12, 1.4, { hasDie: false, hasRedEdge: true });
  chip3.position.set(4.2, -1.8, 1.8);
  chip3.rotation.set(0.3, -0.2, 0.25);
  chips.push({
    mesh: chip3,
    basePos: new THREE.Vector3(4.2, -1.8, 1.8),
    depthFactor: 1.6,
    floatSpeed: 1.1,
    floatAmp: 0.22,
    rotSpeed: { x: 0.004, y: -0.003, z: 0.005 },
  });

  // Chip 4: Far Background Blurred Silicon Wafer Tile
  const chip4 = createChip(2.2, 0.2, 2.2, { hasDie: true, isBlurred: true });
  chip4.position.set(-2.2, 3.2, -5.5);
  chip4.rotation.set(0.4, 0.8, -0.3);
  chips.push({
    mesh: chip4,
    basePos: new THREE.Vector3(-2.2, 3.2, -5.5),
    depthFactor: 0.2,
    floatSpeed: 0.5,
    floatAmp: 0.08,
    rotSpeed: { x: 0.001, y: 0.002, z: 0.001 },
  });

  // Chip 5: Transition Chip
  const chip5 = createChip(1.1, 0.14, 1.1, { hasDie: true, hasRedEdge: true });
  chip5.position.set(-1.8, -2.6, -1.2);
  chip5.rotation.set(-0.25, -0.6, 0.1);
  chips.push({
    mesh: chip5,
    basePos: new THREE.Vector3(-1.8, -2.6, -1.2),
    depthFactor: 0.85,
    floatSpeed: 0.8,
    floatAmp: 0.16,
    rotSpeed: { x: -0.003, y: -0.004, z: 0.002 },
  });

  const chipsGroup = new THREE.Group();
  chips.forEach((c) => chipsGroup.add(c.mesh));

  return {
    chipsGroup,
    chipsData: chips,
  };
}
