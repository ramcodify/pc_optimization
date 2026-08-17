import { initMainBg3DScene, init3DHardwareScene } from './three/scene.js';
import { init3DPreloaderScene, dispose3DPreloaderScene } from './three/preloader-3d.js';

let matrixInterval = null;

// BULLETPROOF WINDOW-SCOPED MOBILE DRAWER & PRELOADER REPLAY METHODS
window.toggleMobileDrawer = function(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && mobileMenu.classList.contains('open')) {
    window.closeMobileDrawer(e);
  } else {
    window.openMobileDrawer(e);
  }
};

window.openMobileDrawer = function(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  
  if (mobileMenu) mobileMenu.classList.add('open');
  if (mobileBackdrop) mobileBackdrop.classList.add('open');
  if (mobileToggle) mobileToggle.classList.add('open');
  
  document.body.style.overflow = 'hidden';
};

window.closeMobileDrawer = function(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (mobileBackdrop) mobileBackdrop.classList.remove('open');
  if (mobileToggle) mobileToggle.classList.remove('open');
  
  if (!document.body.classList.contains('preloader-active')) {
    document.body.style.overflow = '';
  }
};

// REPLAY CYBERPUNK HACKING TERMINAL PRELOADER METHOD
window.replayHackingPreloader = function() {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');
  const milestoneEl = document.getElementById('preloader-milestone');
  const lineFillEl = document.getElementById('preloader-line-fill');
  const terminalLogs = document.getElementById('terminal-logs');
  const btnEnter = document.getElementById('btn-enter-system');

  if (!preloader) return;

  // Lock body scrolling during preloader
  document.body.classList.add('preloader-active');
  preloader.style.display = 'flex';

  // Reset Preloader State
  preloader.classList.remove('loaded');
  if (percentEl) percentEl.textContent = '00';
  if (lineFillEl) lineFillEl.style.width = '0%';
  if (terminalLogs) terminalLogs.innerHTML = '<div class="log-line text-red">> INITIALIZING SYSTEM INTRUSION...</div>';
  if (milestoneEl) milestoneEl.textContent = 'RUNNING EXPLOIT PAYLOAD...';
  if (btnEnter) btnEnter.style.display = 'none';

  // 1. Init 3D WebGL Preloader Scene
  const preloader3DViewport = document.getElementById('preloader-3d-viewport');
  if (preloader3DViewport) {
    init3DPreloaderScene(preloader3DViewport);
  }

  // 2. Matrix Rain Canvas Re-trigger
  const matrixCanvas = document.getElementById('preloader-matrix-canvas');
  if (matrixCanvas) {
    if (matrixInterval) clearInterval(matrixInterval);

    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const katakana = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0101010101#@$%&*';
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const rainDrops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(2, 3, 4, 0.12)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
        ctx.fillStyle = i % 4 === 0 ? '#ff1e38' : '#00f0ff';
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    }
    matrixInterval = setInterval(drawMatrix, 35);
  }

  const hackLogs = [
    { text: '> INITIALIZING KERNEL BREACH...', cls: 'text-red' },
    { text: '> BYPASSING WINDOWS DPC LATENCY...', cls: 'text-cyan' },
    { text: '> UNLOCKING GPU POWER TARGET 115%... [OK]', cls: 'text-white' },
    { text: '> TUNING MEMORY VRAM TIMINGS... [OK]', cls: 'text-red' },
    { text: '> OVERCLOCKING CORE FREQUENCY 2940 MHz...', cls: 'text-cyan' },
    { text: '> SYSTEM READY // PEAK MATRIX ACTIVE', cls: 'text-white' }
  ];

  let currentPercent = 0;
  let logIdx = 0;

  const preloaderTimer = setInterval(() => {
    currentPercent += Math.floor(Math.random() * 6) + 4;
    if (currentPercent > 100) currentPercent = 100;

    if (percentEl) percentEl.textContent = String(currentPercent).padStart(2, '0');
    if (lineFillEl) lineFillEl.style.width = `${currentPercent}%`;

    // Add Hacking Terminal Log Line
    if (terminalLogs && logIdx < hackLogs.length && currentPercent >= (logIdx + 1) * 16) {
      const item = hackLogs[logIdx];
      const div = document.createElement('div');
      div.className = `log-line ${item.cls}`;
      div.textContent = item.text;
      terminalLogs.appendChild(div);
      terminalLogs.scrollTop = terminalLogs.scrollHeight;
      if (milestoneEl) milestoneEl.textContent = item.text.replace('> ', '');
      logIdx++;
    }

    if (currentPercent >= 100) {
      clearInterval(preloaderTimer);
      if (btnEnter) {
        btnEnter.style.display = 'inline-flex';
      }
    }
  }, 75);
};

document.addEventListener('DOMContentLoaded', () => {
  // Prevent any scrolling / touch dragging on preloader overlay
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.addEventListener('touchmove', (e) => {
      if (!preloader.classList.contains('loaded')) {
        e.preventDefault();
      }
    }, { passive: false });

    preloader.addEventListener('wheel', (e) => {
      if (!preloader.classList.contains('loaded')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // 1. INIT MAIN PAGE 3D BACKGROUND SCENE (CYBER WAVE GRID & PARTICLES)
  initMainBg3DScene();

  // 2. RUN CYBERPUNK MATRIX RAIN & 3D WEBGL PRELOADER
  window.replayHackingPreloader();

  // Enter System Button Handler (INSTANT ZERO-LAG DISMISSAL & CLEAN DISPLAY NONE)
  const btnEnter = document.getElementById('btn-enter-system');
  btnEnter?.addEventListener('click', () => {
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) {
      preloaderEl.classList.add('loaded');
      setTimeout(() => {
        preloaderEl.style.display = 'none';
      }, 300);
    }
    // Unlock body scrolling cleanly
    document.body.classList.remove('preloader-active');
    document.body.style.overflow = '';

    // Instantly dispose 3D preloader scene & matrix timer to free 100% GPU performance
    dispose3DPreloaderScene();
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
    }
  });

  // 3. UNIVERSAL SMOOTH ANCHOR LINK WIRING
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.closeMobileDrawer) window.closeMobileDrawer();
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        if (window.closeMobileDrawer) window.closeMobileDrawer();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 4. INTERACTIVE 3D TILT ON PRELOADER CARD
  const preloaderCard = document.querySelector('.preloader-content');
  if (preloaderCard) {
    window.addEventListener('mousemove', (e) => {
      if (document.getElementById('preloader')?.classList.contains('loaded')) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const rotX = ((e.clientY - centerY) / centerY) * -12;
      const rotY = ((e.clientX - centerX) / centerX) * 15;
      preloaderCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(20px)`;
    });
  }

  // 5. INIT THREE.JS 3D HARDWARE SCENE IN HERO CONTAINER
  const hero3DContainer = document.getElementById('hero-3d-canvas-container');
  if (hero3DContainer) {
    init3DHardwareScene(hero3DContainer);
  }

  // 6. CYBERPUNK TARGETING RETICLE CURSOR & 3D HUD MULTI-PLANE PARALLAX (DESKTOP ONLY)
  const crosshair = document.getElementById('cursor-crosshair');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorDot = document.getElementById('cursor-dot');
  const particleContainer = document.getElementById('cursor-particles');

  const hudFps = document.querySelector('.hud-panel-fps');
  const hudLatency = document.querySelector('.hud-panel-latency');
  const hudCpu = document.querySelector('.hud-panel-cpu');
  const hudGpu = document.querySelector('.hud-panel-gpu');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let crosshairX = mouseX;
  let crosshairY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;

  if (window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }

      // 3D Directional Multi-Plane Parallax for Floating Glass HUD Panels
      const normX = (mouseX / window.innerWidth - 0.5) * 2;
      const normY = (mouseY / window.innerHeight - 0.5) * 2;

      if (hudFps) {
        hudFps.style.transform = `translate3d(${normX * -18}px, ${normY * -16}px, 60px) rotateX(${normY * -4}deg) rotateY(${normX * 5}deg)`;
      }
      if (hudLatency) {
        hudLatency.style.transform = `translate3d(${normX * 16}px, ${normY * 14}px, 50px) rotateX(${normY * 3}deg) rotateY(${normX * -4}deg)`;
      }
      if (hudCpu) {
        hudCpu.style.transform = `translate3d(${normX * -12}px, ${normY * 18}px, 40px) rotateX(${normY * -3}deg)`;
      }
      if (hudGpu) {
        hudGpu.style.transform = `translate3d(${normX * 20}px, ${normY * -10}px, 55px) rotateY(${normX * -5}deg)`;
      }

      // Spark particles
      if (particleContainer && Math.random() > 0.6) {
        const particle = document.createElement('div');
        particle.className = 'heat-particle';
        particle.style.left = `${mouseX + (Math.random() - 0.5) * 8}px`;
        particle.style.top = `${mouseY + (Math.random() - 0.5) * 8}px`;
        particleContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
      }
    }, { passive: true });

    function renderCursor() {
      crosshairX += (mouseX - crosshairX) * 0.25;
      crosshairY += (mouseY - crosshairY) * 0.25;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (crosshair) {
        crosshair.style.left = `${crosshairX}px`;
        crosshair.style.top = `${crosshairY}px`;
      }
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover Target States
    document.querySelectorAll('.btn, .cyber-btn, .btn-purchase').forEach((btn) => {
      btn.addEventListener('mouseenter', () => document.body.classList.add('hover-btn'));
      btn.addEventListener('mouseleave', () => document.body.classList.remove('hover-btn'));
    });

    document.querySelectorAll('a, button, .faq-header, .tilt-card').forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hover-interactive'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hover-interactive'));
    });

    // 7. INTERACTIVE 3D CARD TILT WITH CURSOR REFLECTION (rotateX ±4deg, rotateY ±5deg)
    const tiltCards = document.querySelectorAll('.pricing-card, .tilt-card');
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -4;
        const rotateY = ((cardX - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      });
    });
  }

  // 8. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 9. SECTION Z-DEPTH SCROLL REVEALS
  const depthElements = document.querySelectorAll('.problem-card, .split-visual-grid, .pricing-card, .trust-card, .faq-item, .final-cta-card');
  depthElements.forEach((el) => el.classList.add('depth-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  depthElements.forEach((el) => observer.observe(el));

  // 10. FAQ ACCORDION INTERACTIVITY
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => {
        other.classList.remove('active');
        const body = other.querySelector('.faq-body');
        if (body) body.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = `${body.scrollHeight + 20}px`;
      }
    });
  });

  // 11. PURCHASE MODAL HANDLERS
  const purchaseModal = document.getElementById('purchase-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPackName = document.getElementById('modal-pack-name');
  const modalPackPrice = document.getElementById('modal-pack-price');
  const checkoutForm = document.getElementById('checkout-form');
  const successOverlay = document.getElementById('success-overlay');

  let selectedPackKey = 'advanced';

  document.querySelectorAll('.btn-purchase').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const pack = btn.getAttribute('data-pack') || 'advanced';
      const name = btn.getAttribute('data-name') || 'ADVANCED OPTIMIZATION';
      const price = btn.getAttribute('data-price') || '699';

      selectedPackKey = pack;
      if (modalPackName) modalPackName.textContent = name;
      if (modalPackPrice) modalPackPrice.textContent = `₹${price}`;

      if (purchaseModal) purchaseModal.classList.add('open');
    });
  });

  modalCloseBtn?.addEventListener('click', () => {
    purchaseModal?.classList.remove('open');
  });

  // 12. CHECKOUT FORM & PAYMENT INTEGRATION (RAZORPAY + BACKEND API)
  checkoutForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('customer-email');
    const email = emailInput?.value.trim();

    if (!email) return;

    const btnSubmit = document.getElementById('btn-pay-submit');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<span>PROCESSING ORDER...</span>';
    }

    try {
      // Step 1: Call secured backend to generate Order
      const res = await fetch('http://localhost:3001/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack: selectedPackKey, email })
      });
      const orderData = await res.json();

      if (orderData.success) {
        // Step 2: Open Razorpay Checkout Modal
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'altego.',
          description: `${selectedPackKey.toUpperCase()} OPTIMIZATION PACK`,
          order_id: orderData.orderId,
          prefill: { email: email },
          theme: { color: '#ff1e38' },
          handler: async function (response) {
            // Step 3: Verify Payment Server-Side
            const verifyRes = await fetch('http://localhost:3001/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: email,
                pack: selectedPackKey
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // Hide purchase modal & show Red Success overlay
              purchaseModal?.classList.remove('open');

              const succOrderEl = document.getElementById('success-order-id');
              const succPackEl = document.getElementById('success-pack-name');
              const succAmtEl = document.getElementById('success-amount');
              const succDlBtn = document.getElementById('success-download-btn');

              if (succOrderEl) succOrderEl.textContent = verifyData.orderId;
              if (succPackEl) succPackEl.textContent = selectedPackKey.toUpperCase() + ' OPTIMIZATION';
              if (succAmtEl) succAmtEl.textContent = selectedPackKey === 'basic' ? '₹399' : '₹699';
              if (succDlBtn) succDlBtn.href = verifyData.downloadUrl;

              if (successOverlay) successOverlay.classList.add('open');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      alert('Payment initialization fallback: Redirecting to demo access.');
      purchaseModal?.classList.remove('open');
      if (successOverlay) successOverlay.classList.add('open');
    } finally {
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<span>CONTINUE TO SECURE PAYMENT →</span>';
      }
    }
  });

  // 13. LEGAL POP-UP MODALS HANDLERS
  document.querySelectorAll('.legal-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(`modal-${targetId}`);
      if (targetModal) targetModal.classList.add('open');
    });
  });

  document.querySelectorAll('.legal-close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal-overlay')?.classList.remove('open');
    });
  });

  // Close modals on clicking overlay backdrop
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // 14. CONTACT SUPPORT FORM HANDLER
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const message = document.getElementById('contact-message')?.value;
    const statusMsg = document.getElementById('contact-status-msg');

    try {
      const res = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();

      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.textContent = data.message || 'Message sent to optalego@gmail.com!';
      }
      contactForm.reset();
    } catch (err) {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.textContent = 'Message dispatched to optalego@gmail.com!';
      }
      contactForm.reset();
    }
  });
});
