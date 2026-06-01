const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPath) {
    link.classList.add('active');
  }
});

document.querySelectorAll('.flashcard').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});
