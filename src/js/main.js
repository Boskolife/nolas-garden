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
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu_active')) {
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
        'a, button, [tabindex]:not([tabindex="-1"])'
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

  // Initialize: show first tab, hide others
  function showTab(tabIndex) {
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

  // Add click handlers to buttons
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabIndex = parseInt(button.getAttribute('data-tab-index'), 10);
      showTab(tabIndex);
    });

    // Keyboard navigation support
    button.addEventListener('keydown', (e) => {
      const currentIndex = parseInt(button.getAttribute('data-tab-index'), 10);
      let targetIndex = currentIndex;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
        const targetButton = Array.from(tabButtons).find(
          (btn) => parseInt(btn.getAttribute('data-tab-index'), 10) === targetIndex
        );
        if (targetButton) {
          targetButton.focus();
          showTab(targetIndex);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
        const targetButton = Array.from(tabButtons).find(
          (btn) => parseInt(btn.getAttribute('data-tab-index'), 10) === targetIndex
        );
        if (targetButton) {
          targetButton.focus();
          showTab(targetIndex);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        const firstButton = Array.from(tabButtons).find(
          (btn) => parseInt(btn.getAttribute('data-tab-index'), 10) === 0
        );
        if (firstButton) {
          firstButton.focus();
          showTab(0);
        }
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastIndex = tabButtons.length - 1;
        const lastButton = Array.from(tabButtons).find(
          (btn) => parseInt(btn.getAttribute('data-tab-index'), 10) === lastIndex
        );
        if (lastButton) {
          lastButton.focus();
          showTab(lastIndex);
        }
      }
    });
  });
}
