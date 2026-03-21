/**
 * 영성콘트롤즈 Landing Page Script
 * ================================
 * - mailto: 기반 문의 폼
 * - 네비게이션 스크롤 효과
 * - 모바일 메뉴 토글
 * - 스크롤 기반 등장 애니메이션
 * - 숫자 카운트업 애니메이션
 */

// ===== Configuration =====
const CONFIG = {
  // 🔧 관리자 이메일 주소 (여기만 수정하면 됩니다)
  adminEmail: 'admin@example.com',
};

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const contactForm = document.getElementById('contactForm');
const adminEmailDisplay = document.getElementById('adminEmailDisplay');

// Set admin email display
if (adminEmailDisplay) {
  adminEmailDisplay.textContent = CONFIG.adminEmail;
}

// ===== Navbar Scroll Effect =====
let lastScrollY = 0;

function handleNavScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ===== Mobile Menu =====
mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    navLinks.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
  }
});

// ===== Contact Form → mailto =====
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('senderName').value.trim();
  const company = document.getElementById('senderCompany').value.trim();
  const phone = document.getElementById('senderPhone').value.trim();
  const subject = document.getElementById('emailSubject').value.trim();
  const body = document.getElementById('emailBody').value.trim();

  // Validate required fields
  if (!name || !subject || !body) {
    alert('이름, 제목, 내용은 필수 입력 항목입니다.');
    return;
  }

  // Build email body
  let emailBody = '';
  emailBody += `안녕하세요, ${name}입니다.\n\n`;
  if (company) emailBody += `회사명: ${company}\n`;
  if (phone) emailBody += `연락처: ${phone}\n`;
  emailBody += `\n--- 문의 내용 ---\n\n`;
  emailBody += body;
  emailBody += `\n\n---\n`;
  emailBody += `보낸 사람: ${name}`;
  if (company) emailBody += ` (${company})`;
  if (phone) emailBody += `\n연락처: ${phone}`;

  // Encode for mailto
  const encodedSubject = encodeURIComponent(`[문의] ${subject}`);
  const encodedBody = encodeURIComponent(emailBody);

  // Open mailto link
  const mailtoLink = `mailto:${CONFIG.adminEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  window.location.href = mailtoLink;
});

// ===== Scroll Reveal Animation =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = windowHeight - 100;

    if (elementTop < revealPoint) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

// ===== Number Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  counters.forEach(counter => {
    if (counter.dataset.animated) return;

    const rect = counter.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    counter.dataset.animated = 'true';
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * target);

      counter.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

window.addEventListener('scroll', animateCounters, { passive: true });
window.addEventListener('load', animateCounters);

// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
