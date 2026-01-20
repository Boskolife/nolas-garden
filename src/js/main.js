import WOW from 'wow.js';

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

// Constants
const ZIP_CODE_LENGTH = 5;
const ZIP_CODE_REGEX = /^\d{5}$/;
const ANIMATION_DELAY = 100;
const TEXT_ANIMATION_DELAY = 50;

// Create CSS styles only once
if (!document.getElementById('animateText-style')) {
  const style = document.createElement('style');
  style.id = 'animateText-style';
  style.textContent = `
      [class^="word-"] {
        display: inline-block;
        white-space: nowrap;
      }
      [class^="word-"]:not(:last-child)::after {
        content: ' ';
        white-space: normal;
      }
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
  const wordClass = `word-${Math.floor(Math.random() * 100000)}`;
  const charDelay = options.charDelay || 0.03; // Delay between characters in seconds

  const text = el.textContent.trim();
  if (!text) return;

  el.innerHTML = '';

  // Split text into words (preserving spaces)
  const words = text.split(/(\s+)/);
  let charIndex = 0;

  words.forEach((word) => {
    // Skip empty strings and spaces-only strings
    if (!word || /^\s+$/.test(word)) {
      // Add space as text node
      el.appendChild(document.createTextNode(word));
      return;
    }

    // Create word wrapper
    const wordSpan = document.createElement('span');
    wordSpan.className = wordClass;

    // Split word into characters
    [...word].forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      charSpan.className = uniqueClass;
      charSpan.style.animationDelay = `${charIndex * charDelay}s`;
      wordSpan.appendChild(charSpan);
      charIndex++;
    });

    el.appendChild(wordSpan);
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

// WOW animation callbacks configuration
const WOW_ANIMATION_CONFIG = {
  'teams__title': { selector: '.teams__title', isMultiple: false },
  'delivery__title': { selector: '.delivery__title i', isMultiple: true },
  'gallery__title': { selector: '.gallery__title i', isMultiple: true },
  'solutions__title': { selector: '.solutions__title i', isMultiple: true },
  'propose__title': { selector: '.propose__title i', isMultiple: true },
  'propose__subtitle': { selector: '.propose__subtitle', isMultiple: true },
  'block-first-title': { selector: '.block-first-title', isMultiple: false },
  'block-second-title': { selector: '.block-second-title', isMultiple: false },
  'block-third-title': { selector: '.block-third-title', isMultiple: false },
  'block-fourth-title': { selector: '.block-fourth-title', isMultiple: false },
};

// Initialize WOW.js
if (typeof WOW !== 'undefined') {
  new WOW({
    callback: function(box) {
      const className = Array.from(box.classList).find(cls => WOW_ANIMATION_CONFIG[cls]);
      if (!className) return;

      const config = WOW_ANIMATION_CONFIG[className];
      setTimeout(() => {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach((el) => startBlurAnimation(el));
      }, ANIMATION_DELAY);
    }
  }).init();
}

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
          const descriptionElements = content.querySelectorAll('.hero__description');

          titleElements.forEach((el) =>
            applyBlurAnimation(el, ANIMATION_CONFIG.title),
          );
          descriptionElements.forEach((el) =>
            applyBlurAnimation(el, ANIMATION_CONFIG.description),
          );
        }, TEXT_ANIMATION_DELAY);
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
      let shouldPreventDefault = false;

      if (e.key === 'ArrowLeft') {
        targetIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
        shouldPreventDefault = true;
      } else if (e.key === 'ArrowRight') {
        targetIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
        shouldPreventDefault = true;
      } else if (e.key === 'Home') {
        targetIndex = 0;
        shouldPreventDefault = true;
      } else if (e.key === 'End') {
        targetIndex = tabButtons.length - 1;
        shouldPreventDefault = true;
      }

      if (shouldPreventDefault) {
        e.preventDefault();
        const targetButton = Array.from(tabButtons).find(
          (btn) => parseInt(btn.getAttribute('data-tab-index'), 10) === targetIndex,
        );
        if (targetButton) {
          targetButton.focus();
          showTab(targetIndex);
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
  Object.values(WOW_ANIMATION_CONFIG).forEach((config) => {
    document.querySelectorAll(config.selector).forEach((el) => {
      createCharSpans(el, ANIMATION_CONFIG.title);
    });
  });

  // Start animation for visible hero elements
  animateText('.hero__title i', ANIMATION_CONFIG.title);
  animateText('.hero__description', ANIMATION_CONFIG.description);
  animateText('.propose__subtitle');
}, ANIMATION_DELAY);


if (typeof window.Swiper !== 'undefined') {
  new window.Swiper('.gallery__swiper', {
  // Optional parameters
  effect: "cards",
  direction: 'horizontal',
  cardsEffect:{
    perSlideRotate:3,
    perSlideOffset:5,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next.gallery__swiper-button-next',
    prevEl: '.swiper-button-prev.gallery__swiper-button-prev',
  },
  });
}

// Modal management functions
function initModals() {
  const modals = [
    {
      modal: document.getElementById('succes-modal'),
      backdrop: document.getElementById('succes-modal-backdrop'),
      name: 'success'
    },
    {
      modal: document.getElementById('failure-modal'),
      backdrop: document.getElementById('failure-modal-backdrop'),
      name: 'failure'
    }
  ];

  // Check if all modals exist
  if (modals.some(m => !m.modal || !m.backdrop)) {
    return;
  }

  // Function to open modal
  function openModal(modal, backdrop) {
    if (!modal || !backdrop) return;
    
    backdrop.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element in modal
    const firstFocusable = modal.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  // Function to close modal
  function closeModal(modal, backdrop) {
    if (!modal || !backdrop) return;
    
    backdrop.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-hidden', 'true');
    
    // Only restore body overflow if no other modals are open
    // Check after closing current modal
    const hasOpenModal = modals.some(m => 
      m.modal !== modal && m.modal.getAttribute('aria-hidden') === 'false'
    );
    if (!hasOpenModal) {
      document.body.style.overflow = '';
    }
  }

  // Setup each modal
  modals.forEach(({ modal, backdrop }) => {
    const closeBtn = modal.querySelector('.modal__close-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal, backdrop));
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(modal, backdrop);
      }
    });
  });

  // Close on Escape key (only for open modals)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(({ modal, backdrop }) => {
        if (modal.getAttribute('aria-hidden') === 'false') {
          closeModal(modal, backdrop);
        }
      });
    }
  });

  // Export functions to window for external use
  const successModal = modals.find(m => m.name === 'success');
  const failureModal = modals.find(m => m.name === 'failure');
  
  if (successModal) {
    window.openSuccessModal = () => openModal(successModal.modal, successModal.backdrop);
    window.closeSuccessModal = () => closeModal(successModal.modal, successModal.backdrop);
  }
  
  if (failureModal) {
    window.openFailureModal = () => openModal(failureModal.modal, failureModal.backdrop);
    window.closeFailureModal = () => closeModal(failureModal.modal, failureModal.backdrop);
  }
}

// Valid ZIP codes list (using Set for O(1) lookup performance)
const VALID_ZIP_CODES = new Set([
  '90003', '90043', '90044', '90045', '90047', '90061', '90094',
  '90220', '90221', '90222', '90230', '90232', '90245', '90247',
  '90248', '90249', '90250', '90254', '90260', '90266', '90277',
  '90278', '90292', '90293', '90301', '90302', '90303', '90304',
  '90305', '90501', '90502', '90503', '90504', '90505', '90710',
  '90717', '90744', '90745', '90746', '90755', '90802', '90804',
  '90806', '90810', '90813'
]);

// Initialize delivery form
function initDeliveryForm() {
  const deliveryForm = document.querySelector('.delivery__form');
  const zipInput = document.querySelector('.delivery__input');

  if (!deliveryForm || !zipInput) {
    return;
  }

  // Validate ZIP code format
  function isValidZipFormat(zipCode) {
    return ZIP_CODE_REGEX.test(zipCode);
  }

  // Restrict input to numbers only
  zipInput.addEventListener('input', (e) => {
    // Remove any non-digit characters
    e.target.value = e.target.value.replace(/\D/g, '');
    // Limit to ZIP_CODE_LENGTH digits
    if (e.target.value.length > ZIP_CODE_LENGTH) {
      e.target.value = e.target.value.slice(0, ZIP_CODE_LENGTH);
    }
  });

  // Prevent non-numeric characters on paste
  zipInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericOnly = pastedText.replace(/\D/g, '').slice(0, ZIP_CODE_LENGTH);
    zipInput.value = numericOnly;
  });

  deliveryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get and trim ZIP code value
    const zipCode = zipInput.value.trim();

    // Validate ZIP code format first
    if (!isValidZipFormat(zipCode)) {
      // If format is invalid, show failure modal
      if (window.openFailureModal) {
        window.openFailureModal();
      }
      return;
    }

    // Check if ZIP code is in the valid list (using Set for O(1) lookup)
    if (VALID_ZIP_CODES.has(zipCode)) {
      if (window.openSuccessModal) {
        window.openSuccessModal();
      }
    } else {
      if (window.openFailureModal) {
        window.openFailureModal();
      }
    }
  });
}

// Initialize all components when DOM is ready
function init() {
  initMobileMenu();
  initHeroTabs();
  initModals();
  initDeliveryForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}