// Animation speed configuration
const ANIMATION_CONFIG = {
  title: {
    blur: true,
    charDelay: 0.03, // Delay between characters in seconds
  },
  description: {
    blur: true,
    charDelay: 0.03, // Delay between characters in seconds
  },
};

// Create CSS styles only once
if (!document.getElementById('animateText-style')) {
  const style = document.createElement('style');
  style.id = 'animateText-style';
  style.textContent = `
      [class^="char-"] {
        display: inline-block;
        opacity: 0;
        filter: blur(10px);
        animation-play-state: paused;
      }
      [class^="char-"].animate-char-active {
        animation: blur-in 0.45s ease forwards;
      }
      @keyframes blur-in {
        from { opacity: 0; filter: blur(10px); }
        to { opacity: 1; filter: blur(0); }
      }
    `;
  document.head.appendChild(style);
}

// Helper function to create character spans (without starting animation)
function createCharSpans(el, options = {}) {
  if (!el || el.querySelector('span[class^="char-"]')) return; // Already created

  const blurEnabled = options.blur !== false; // default true
  if (!blurEnabled) return;

  const uniqueClass = `char-${Math.floor(Math.random() * 100000)}`;
  const charDelay = options.charDelay || 0.03; // Delay between characters in seconds

  const text = el.textContent.trim();
  if (!text) return;

  el.innerHTML = '';

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.className = uniqueClass;
    span.style.animationDelay = `${i * charDelay}s`;
    el.appendChild(span);
  });
}

// Helper function to start animation for already created elements
function startBlurAnimation(el) {
  if (!el) return;
  
  const charSpans = el.querySelectorAll('span[class^="char-"]');
  charSpans.forEach((span) => {
    span.classList.add('animate-char-active');
  });
}

if (typeof window.WOW !== 'undefined') {
  new window.WOW({
    callback: function(box) {
      // Start text animation when element becomes visible
      if (box.classList.contains('teams__title')) {
        setTimeout(() => {
          const titleEl = document.querySelector('.teams__title');
          if (titleEl) startBlurAnimation(titleEl);
        }, 100);
      }
      if (box.classList.contains('delivery__title')) {
        setTimeout(() => {
          const titleEls = document.querySelectorAll('.delivery__title i');
          titleEls.forEach((el) => startBlurAnimation(el));
        }, 100);
      }
    }
  }).init();
}

initMobileMenu();
initHeroTabs();

function initMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const burgerBtn = document.querySelector('.header__burger');
  const mobileMenuCloseBtn = document.querySelector('.mobile-menu__close-btn');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

  if (!mobileMenu || !burgerBtn || !mobileMenuCloseBtn) {
    return;
  }

  // Initialize mobile menu as hidden
  mobileMenu.setAttribute('aria-hidden', 'true');

  function openMenu() {
    mobileMenu.classList.add('mobile-menu_active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Close mobile menu');
    document.body.style.overflow = 'hidden';
    // Focus first link when menu opens
    if (mobileMenuLinks.length > 0) {
      mobileMenuLinks[0].focus();
    }
  }

  function closeMenu() {
    mobileMenu.classList.remove('mobile-menu_active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Open mobile menu');
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('mobile-menu_active');
    if (isOpen) {
      closeMenu();
      burgerBtn.focus();
    } else {
      openMenu();
    }
  });

  mobileMenuCloseBtn.addEventListener('click', () => {
    closeMenu();
    burgerBtn.focus();
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      burgerBtn.focus();
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'Escape' &&
      mobileMenu.classList.contains('mobile-menu_active')
    ) {
      closeMenu();
      burgerBtn.focus();
    }
  });

  // Trap focus inside mobile menu when open
  mobileMenu.addEventListener('keydown', (e) => {
    if (!mobileMenu.classList.contains('mobile-menu_active')) {
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = mobileMenu.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

function initHeroTabs() {
  const tabButtons = document.querySelectorAll('.hero__tab-button');
  const tabContents = document.querySelectorAll('.hero__tab-content');
  const videos = document.querySelectorAll('.hero__video');

  if (tabButtons.length === 0 || tabContents.length === 0) {
    return;
  }

  let currentTabIndex = 0;
  let autoSwitchInterval = null;
  const AUTO_SWITCH_INTERVAL = 9000; // 10 seconds in milliseconds

  // Initialize: show first tab, hide others
  function showTab(tabIndex) {
    currentTabIndex = tabIndex;
    const tabIndexStr = String(tabIndex);

    // Hide all tab contents
    tabContents.forEach((content) => {
      const contentTabIndex = content.getAttribute('data-tab');
      const isFlowers = content.classList.contains('hero__flowers');

      if (contentTabIndex === tabIndexStr) {
        content.classList.add('hero__tab-content_active');
        content.setAttribute('aria-hidden', 'false');

        // Restart animation for flowers when switching tabs
        if (isFlowers && content.classList.contains('animate__animated')) {
          // Remove and re-add animation classes to restart animation
          content.classList.remove('animate__fadeInRight');
          // Force reflow to restart animation
          void content.offsetWidth;
          content.classList.add('animate__fadeInRight');
        }

        // Start text animation for visible content in active tab
        setTimeout(() => {
          const titleElements = content.querySelectorAll('.hero__title i');
          const descriptionElements =
            content.querySelectorAll('.hero__description');

          titleElements.forEach((el) =>
            applyBlurAnimation(el, ANIMATION_CONFIG.title),
          );
          descriptionElements.forEach((el) =>
            applyBlurAnimation(el, ANIMATION_CONFIG.description),
          );
        }, 50);
      } else {
        content.classList.remove('hero__tab-content_active');
        content.setAttribute('aria-hidden', 'true');
      }
    });

    // Update button states
    tabButtons.forEach((button) => {
      const buttonTabIndex = button.getAttribute('data-tab-index');
      if (buttonTabIndex === tabIndexStr) {
        button.classList.add('hero__tab-button_active');
        button.setAttribute('aria-selected', 'true');
      } else {
        button.classList.remove('hero__tab-button_active');
        button.setAttribute('aria-selected', 'false');
      }
    });

    // Handle videos: pause all, play active
    videos.forEach((video) => {
      const videoTabIndex = video.getAttribute('data-tab');
      if (videoTabIndex === tabIndexStr) {
        video.play().catch((error) => {
          // Handle autoplay restrictions
          console.warn('Video autoplay failed:', error);
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  // Initialize first tab as active
  showTab(0);

  // Auto-switch tabs function
  function startAutoSwitch() {
    // Clear existing interval if any
    if (autoSwitchInterval) {
      clearInterval(autoSwitchInterval);
    }

    // Start auto-switching every 10 seconds
    autoSwitchInterval = setInterval(() => {
      const nextIndex = (currentTabIndex + 1) % tabButtons.length;
      showTab(nextIndex);
    }, AUTO_SWITCH_INTERVAL);
  }

  // Start auto-switching
  startAutoSwitch();

  // Add click handlers to buttons
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabIndex = parseInt(button.getAttribute('data-tab-index'), 10);
      showTab(tabIndex);
      // Restart auto-switch timer after manual click
      startAutoSwitch();
    });

    // Keyboard navigation support
    button.addEventListener('keydown', (e) => {
      const currentIndex = parseInt(button.getAttribute('data-tab-index'), 10);
      let targetIndex = currentIndex;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetIndex =
          currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
        const targetButton = Array.from(tabButtons).find(
          (btn) =>
            parseInt(btn.getAttribute('data-tab-index'), 10) === targetIndex,
        );
        if (targetButton) {
          targetButton.focus();
          showTab(targetIndex);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetIndex =
          currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
        const targetButton = Array.from(tabButtons).find(
          (btn) =>
            parseInt(btn.getAttribute('data-tab-index'), 10) === targetIndex,
        );
        if (targetButton) {
          targetButton.focus();
          showTab(targetIndex);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        const firstButton = Array.from(tabButtons).find(
          (btn) => parseInt(btn.getAttribute('data-tab-index'), 10) === 0,
        );
        if (firstButton) {
          firstButton.focus();
          showTab(0);
        }
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastIndex = tabButtons.length - 1;
        const lastButton = Array.from(tabButtons).find(
          (btn) =>
            parseInt(btn.getAttribute('data-tab-index'), 10) === lastIndex,
        );
        if (lastButton) {
          lastButton.focus();
          showTab(lastIndex);
        }
      }
    });
  });
}

// Helper function to apply blur animation to a single element
function applyBlurAnimation(el, options = {}) {
  if (!el) return;

  const blurEnabled = options.blur !== false; // default true
  if (!blurEnabled) return;

  // Create spans if they don't exist
  if (!el.querySelector('span[class^="char-"]')) {
    createCharSpans(el, options);
  }

  // Start animation
  startBlurAnimation(el);
}

function animateText(selector, options = {}) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  const blurEnabled = options.blur !== false; // default true

  if (!blurEnabled) return;

  // Apply blur effect only to visible elements
  elements.forEach((el) => {
    // Check if element is inside active tab (for hero sections)
    const parentTab = el.closest('.hero__tab-content');
    const isInActiveTab =
      !parentTab || parentTab.classList.contains('hero__tab-content_active');

    // For non-hero elements (like teams__title), apply animation directly
    if (isInActiveTab || !parentTab) {
      applyBlurAnimation(el, options);
    }
  });
}

// Create character spans for all text elements on page load
setTimeout(() => {
  // Create spans for hero elements (will be animated when tab becomes active)
  document.querySelectorAll('.hero__title i').forEach((el) => {
    createCharSpans(el, ANIMATION_CONFIG.title);
  });
  document.querySelectorAll('.hero__description').forEach((el) => {
    createCharSpans(el, ANIMATION_CONFIG.description);
  });
  
  // Create spans for WOW elements (will be animated when visible)
  const teamsTitle = document.querySelector('.teams__title');
  if (teamsTitle) {
    createCharSpans(teamsTitle, ANIMATION_CONFIG.title);
  }
  document.querySelectorAll('.delivery__title i').forEach((el) => {
    createCharSpans(el, ANIMATION_CONFIG.title);
  });
  
  // Start animation for visible hero elements
  animateText('.hero__title i', ANIMATION_CONFIG.title);
  animateText('.hero__description', ANIMATION_CONFIG.description);
}, 100);
