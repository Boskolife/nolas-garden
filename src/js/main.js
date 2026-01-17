initMobileMenu();

function initMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const burgerBtn = document.querySelector('.header__burger');
  const mobileMenuCloseBtn = document.querySelector('.mobile-menu__close-btn');

  burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('mobile-menu_active');
  });

  mobileMenuCloseBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('mobile-menu_active');
  });
}
