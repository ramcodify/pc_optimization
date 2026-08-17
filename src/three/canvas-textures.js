import * as THREE from 'three';

/**
 * Generates dynamic procedural textures with Performance Red (#ff1e38) accents & ALTEGO branding.
 */

// Brushed Metal / Carbon Texture
export function createBrushedMetalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0c0d12';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 800; i++) {
    const y = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  for (let x = 0; x < 512; x += 16) {
    for (let y = 0; y < 512; y += 16) {
      if ((x + y) % 32 === 0) {
        ctx.fillRect(x, y, 16, 16);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Circuit Board PCB Texture with ALTEGO Laser Markings
export function createCircuitTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#050609';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = 'rgba(255, 30, 56, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 1024; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  const traceColors = ['rgba(255, 30, 56, 0.75)', 'rgba(212, 175, 55, 0.5)', 'rgba(80, 40, 50, 0.4)'];
  
  for (let n = 0; n < 140; n++) {
    ctx.strokeStyle = traceColors[Math.floor(Math.random() * traceColors.length)];
    ctx.lineWidth = Math.random() > 0.8 ? 2 : 1;
    
    let x = Math.floor(Math.random() * 32) * 32;
    let y = Math.floor(Math.random() * 32) * 32;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    const steps = Math.floor(Math.random() * 6) + 2;
    for (let s = 0; s < steps; s++) {
      const dir = Math.floor(Math.random() * 4);
      const len = Math.floor(Math.random() * 3 + 1) * 32;
      if (dir === 0) x += len;
      else if (dir === 1) y += len;
      else if (dir === 2) x -= len;
      else y -= len;
      
      x = Math.max(0, Math.min(1024, x));
      y = Math.max(0, Math.min(1024, y));
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 3 + 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255, 30, 56, 0.4)';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('ALTEGO // PERFORMANCE ARCHITECTURE', 60, 100);
  ctx.fillText('ALTEGO CORE // ZERO LATENCY TUNED', 60, 130);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Gold Pin Texture
export function createGoldPinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#08080c';
  ctx.fillRect(0, 0, 512, 512);

  const pinSize = 6;
  const gap = 12;
  for (let x = 24; x < 512 - 24; x += gap) {
    for (let y = 24; y < 512 - 24; y += gap) {
      if (x > 180 && x < 332 && y > 180 && y < 332) continue;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, pinSize / 2);
      grad.addColorStop(0, '#ffd700');
      grad.addColorStop(0.7, '#b8860b');
      grad.addColorStop(1, '#111218');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, pinSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = '#141620';
  ctx.fillRect(180, 180, 152, 152);
  ctx.strokeStyle = '#ff1e38';
  ctx.lineWidth = 1;
  ctx.strokeRect(184, 184, 144, 144);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Technical Grid Pattern
export function createTechGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = 'rgba(255, 30, 56, 0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 1024; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(1024, i);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(255, 30, 56, 0.25)';
  ctx.lineWidth = 2;
  for (let x = 64; x < 1024; x += 256) {
    for (let y = 64; y < 1024; y += 256) {
      ctx.beginPath();
      ctx.moveTo(x - 10, y);
      ctx.lineTo(x + 10, y);
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}
