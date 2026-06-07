const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });
}


document.querySelectorAll('.flashcard').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});

// Slideshow tự động chuyển 5 ảnh trên trang chủ
const slider = document.querySelector('.hero-cover-slider');
if (slider) {
  const slides = slider.querySelectorAll('.slide');
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}

// Hiệu ứng cuộn hiển thị (Scroll Reveal) dùng Intersection Observer
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Chỉ chạy một lần
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => observer.observe(el));
  }

  // FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    if (button) {
      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Đóng các câu hỏi khác (accordion style)
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
        });
        
        // Mở câu hỏi hiện tại nếu trước đó chưa mở
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
});
