/**
 * =============================================================================
 * THE MAGNIFYING GLASS PORTFOLIO — APPLICATION SCRIPT
 * Siddharth Singh (Sid) — Python Backend Builder
 * =============================================================================
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 01 / Elements & State
  // ---------------------------------------------------------------------------
  const heroSection = document.getElementById('hero-section');
  const heroPoster = document.getElementById('hero-poster');
  const magnifier = document.getElementById('magnifier');
  const lensCircularWindow = document.getElementById('lens-circular-window');
  const lensCloneViewport = document.getElementById('lens-clone-viewport');
  const headlineEl = document.querySelector('.hero-headline');
  const hintEl = document.getElementById('hint-move');
  const counterTextEl = document.getElementById('counter-text');
  const counterContainer = document.getElementById('bottom-counter-container');

  const secretElements = [
    document.getElementById('secret-item-0'),
    document.getElementById('secret-item-1'),
    document.getElementById('secret-item-2'),
    document.getElementById('secret-item-3')
  ];
  const dots = [
    document.getElementById('dot-0'),
    document.getElementById('dot-1'),
    document.getElementById('dot-2'),
    document.getElementById('dot-3')
  ];

  const secretsFound = [false, false, false, false];
  let foundCount = 0;
  let hasInteracted = false;

  // Physics & Animation coordinates
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let glassSize = 280;
  let radius = 140;

  // Idle Drifting State
  let isDrifting = false;
  let driftStartTime = 0;
  let idleTimer = null;
  const IDLE_TIMEOUT_MS = 3500;

  // Focus tracking for native dialogs
  let lastFocusedElement = null;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------------------
  // 02 / Clone Hero Poster into Magnifier Lens
  // ---------------------------------------------------------------------------
  function initClone() {
    if (!heroPoster || !lensCloneViewport) return;

    // Clear any previous clone
    lensCloneViewport.innerHTML = '';

    // Deep clone the hero poster
    const clone = heroPoster.cloneNode(true);
    clone.id = 'hero-poster-clone';
    clone.setAttribute('inert', '');
    clone.setAttribute('aria-hidden', 'true');

    // Remove duplicate IDs in clone to avoid query collisions
    const elementsWithId = clone.querySelectorAll('[id]');
    elementsWithId.forEach(el => {
      el.id = 'clone-' + el.id;
    });

    lensCloneViewport.appendChild(clone);
    updateCloneDimensions();
  }

  function updateCloneDimensions() {
    if (!heroSection) return;
    const heroRect = heroSection.getBoundingClientRect();
    const posterRect = heroPoster.getBoundingClientRect();

    // Measure active glass size from DOM
    if (lensCircularWindow) {
      glassSize = lensCircularWindow.offsetWidth || 280;
      radius = glassSize / 2;
    }

    const clone = document.getElementById('hero-poster-clone');
    if (clone) {
      clone.style.width = posterRect.width + 'px';
      clone.style.height = posterRect.height + 'px';
    }
  }

  // ---------------------------------------------------------------------------
  // 03 / Position Clamping & Idle Timer
  // ---------------------------------------------------------------------------
  function clampTarget() {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    targetX = Math.max(10, Math.min(rect.width - 10, targetX));
    targetY = Math.max(10, Math.min(rect.height - 10, targetY));
  }

  function markInteraction() {
    // Fade out first interaction hint
    if (!hasInteracted) {
      hasInteracted = true;
      if (hintEl) {
        hintEl.classList.add('faded');
      }
    }

    // Stop drifting and restart idle timer
    isDrifting = false;
    resetIdleTimer();
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    if (prefersReducedMotion) return;

    idleTimer = setTimeout(() => {
      isDrifting = true;
      driftStartTime = performance.now();
    }, IDLE_TIMEOUT_MS);
  }

  // Set initial position centered over the headline
  function setInitialPosition() {
    if (!headlineEl || !heroSection) return;
    const hRect = headlineEl.getBoundingClientRect();
    const sRect = heroSection.getBoundingClientRect();

    targetX = (hRect.left + hRect.width * 0.38) - sRect.left;
    targetY = (hRect.top + hRect.height * 0.45) - sRect.top;
    currentX = targetX;
    currentY = targetY;

    // Start idle countdown
    resetIdleTimer();
  }

  // ---------------------------------------------------------------------------
  // 04 / Secrets Detection
  // ---------------------------------------------------------------------------
  function checkSecretsCollision() {
    if (foundCount >= 4 || !heroSection) return;

    const heroRect = heroSection.getBoundingClientRect();
    const lensCenterScreenX = heroRect.left + currentX;
    const lensCenterScreenY = heroRect.top + currentY;

    secretElements.forEach((el, index) => {
      if (secretsFound[index] || !el) return;

      const rect = el.getBoundingClientRect();

      // Check distance from lens center to secret bounding box
      const dx = Math.max(rect.left - lensCenterScreenX, 0, lensCenterScreenX - rect.right);
      const dy = Math.max(rect.top - lensCenterScreenY, 0, lensCenterScreenY - rect.bottom);
      const distance = Math.hypot(dx, dy);

      // When lens centre passes over the secret (or lens window overlaps comfortably)
      if (distance <= radius * 0.6 || (lensCenterScreenX >= rect.left && lensCenterScreenX <= rect.right && lensCenterScreenY >= rect.top && lensCenterScreenY <= rect.bottom)) {
        triggerSecretFound(index);
      }
    });
  }

  function triggerSecretFound(index) {
    if (secretsFound[index]) return;
    secretsFound[index] = true;
    foundCount++;

    // Fill corresponding dot
    if (dots[index]) {
      dots[index].classList.add('filled');
    }

    // Update counter
    if (foundCount < 4) {
      if (counterTextEl) {
        counterTextEl.textContent = `${foundCount} of 4 secrets found`;
      }
    } else {
      // All 4 found! Show call to action
      if (counterContainer) {
        counterContainer.innerHTML = `
          <button type="button" class="all-found-cta" id="all-found-btn" aria-label="Open contact modal">
            All 4 found. Let's build something? ↗
          </button>
        `;

        const allFoundBtn = document.getElementById('all-found-btn');
        if (allFoundBtn) {
          allFoundBtn.addEventListener('click', () => {
            openDialog('dialog-contact', allFoundBtn);
          });
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 05 / Animation Loop (LERP, Magnification Transform, Drift)
  // ---------------------------------------------------------------------------
  function animationLoop(now) {
    // 1. If idling, calculate drifting path over the headline
    if (isDrifting && !prefersReducedMotion && headlineEl && heroSection) {
      const hRect = headlineEl.getBoundingClientRect();
      const sRect = heroSection.getBoundingClientRect();
      const hCenterX = (hRect.left + hRect.width * 0.42) - sRect.left;
      const hCenterY = (hRect.top + hRect.height * 0.5) - sRect.top;

      const spanX = Math.min(hRect.width * 0.35, 220);
      const spanY = Math.min(hRect.height * 0.3, 75);

      const elapsed = (now - driftStartTime) * 0.0008;
      targetX = hCenterX + Math.sin(elapsed) * spanX;
      targetY = hCenterY + Math.sin(elapsed * 2) * spanY;
    }

    // 2. Light easing (LERP)
    const easing = isDrifting ? 0.08 : 0.2;
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;

    // 3. Position the magnifying glass assembly
    if (magnifier) {
      magnifier.style.transform = `translate3d(${currentX - radius}px, ${currentY - radius}px, 0)`;
    }

    // 4. Position the cloned content inside the lens (scale 1.9x)
    // Formula: translate(R - x * 1.9, R - y * 1.9) scale(1.9)
    if (lensCloneViewport && heroPoster && heroSection) {
      const posterRect = heroPoster.getBoundingClientRect();
      const heroRect = heroSection.getBoundingClientRect();

      // Relative offset of poster inside heroSection
      const posterOffsetX = posterRect.left - heroRect.left;
      const posterOffsetY = posterRect.top - heroRect.top;

      const relX = currentX - posterOffsetX;
      const relY = currentY - posterOffsetY;

      const transX = radius - relX * 1.9;
      const transY = radius - relY * 1.9;

      lensCloneViewport.style.transform = `translate(${transX}px, ${transY}px) scale(1.9)`;
    }

    // 5. Collision check for secret reveals
    checkSecretsCollision();

    requestAnimationFrame(animationLoop);
  }

  // ---------------------------------------------------------------------------
  // 06 / Event Listeners: Mouse, Touch, Keyboard
  // ---------------------------------------------------------------------------
  function attachMovementListeners() {
    if (!heroSection) return;

    // Mouse movement
    heroSection.addEventListener('mousemove', (e) => {
      markInteraction();
      const rect = heroSection.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      clampTarget();
    });

    window.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        markInteraction();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
        clampTarget();
      }
    });

    // Touch events (tap & drag)
    heroSection.addEventListener('touchstart', (e) => {
      markInteraction();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = heroSection.getBoundingClientRect();
        targetX = touch.clientX - rect.left;
        targetY = touch.clientY - rect.top;
        clampTarget();
      }
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
      markInteraction();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = heroSection.getBoundingClientRect();
        targetX = touch.clientX - rect.left;
        targetY = touch.clientY - rect.top;
        clampTarget();
      }
    }, { passive: true });

    // Keyboard arrow keys (Shift for bigger steps)
    window.addEventListener('keydown', (e) => {
      const activeDialog = document.querySelector('dialog[open]');
      if (activeDialog) return; // Do not move glass if a dialog modal is open

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        markInteraction();
        const step = e.shiftKey ? 45 : 15;

        if (e.key === 'ArrowLeft') targetX -= step;
        if (e.key === 'ArrowRight') targetX += step;
        if (e.key === 'ArrowUp') targetY -= step;
        if (e.key === 'ArrowDown') targetY += step;

        clampTarget();
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      updateCloneDimensions();
      clampTarget();
    });
  }

  // ---------------------------------------------------------------------------
  // 07 / Native Pop-up Dialogs
  // ---------------------------------------------------------------------------
  function openDialog(dialogId, triggerEl) {
    const dialog = document.getElementById(dialogId);
    if (!dialog || typeof dialog.showModal !== 'function') return;

    lastFocusedElement = triggerEl || document.activeElement;
    dialog.showModal();

    // Trap focus to close button initially
    const closeBtn = dialog.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  function setupDialogs() {
    const dialogs = document.querySelectorAll('.modal-dialog');

    // Triggers with data-dialog attribute
    const triggers = document.querySelectorAll('[data-dialog]');
    triggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const dialogId = btn.getAttribute('data-dialog');
        openDialog(dialogId, btn);
      });
    });

    // Close buttons inside dialogs
    const closeButtons = document.querySelectorAll('.modal-close-btn, .close-dialog-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const dialog = btn.closest('.modal-dialog');
        if (dialog) closeDialog(dialog);
      });
    });

    // Backdrop click to close dialog
    dialogs.forEach(dialog => {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
          closeDialog(dialog);
        }
      });

      // Restore focus on close
      dialog.addEventListener('close', () => {
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        }
      });
    });

    // Dialog switcher (e.g., from Process to Work)
    const switchers = document.querySelectorAll('[data-dialog-switch]');
    switchers.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetDialogId = btn.getAttribute('data-dialog-switch');
        const currentDialog = btn.closest('.modal-dialog');
        if (currentDialog) currentDialog.close();
        openDialog(targetDialogId, btn);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 08 / Initialization
  // ---------------------------------------------------------------------------
  function init() {
    initClone();
    setInitialPosition();
    attachMovementListeners();
    setupDialogs();

    // Start 60fps physics render loop
    requestAnimationFrame(animationLoop);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

