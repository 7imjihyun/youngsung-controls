/**
 * 영성콘트롤즈 Landing Page Script
 * ================================
 * - 이메일 발송 방식 선택 모달 (Gmail / 네이버 / 기본 앱)
 * - 폼 진행 상태 표시
 * - 네비게이션 스크롤 효과
 * - 모바일 메뉴 토글
 * - 스크롤 기반 등장 애니메이션
 * - 숫자 카운트업 애니메이션
 */

// ===== Configuration =====
const CONFIG = {
  // 🔧 관리자 이메일 주소 (여기만 수정하면 됩니다)
  adminEmail: 'cdkey120@naver.com',
};

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const contactForm = document.getElementById('contactForm');
const adminEmailDisplay = document.getElementById('adminEmailDisplay');
const contactEmailLink = document.getElementById('contactEmailLink');

// Modal elements
const emailModalOverlay = document.getElementById('emailModalOverlay');
const emailModal = document.getElementById('emailModal');
const modalClose = document.getElementById('modalClose');
const sendGmail = document.getElementById('sendGmail');
const sendNaver = document.getElementById('sendNaver');
const sendDefault = document.getElementById('sendDefault');
const previewTo = document.getElementById('previewTo');
const previewSubject = document.getElementById('previewSubject');

// Progress elements
const formProgressBar = document.getElementById('formProgressBar');
const formProgressText = document.getElementById('formProgressText');

// Set admin email display
if (adminEmailDisplay) {
  adminEmailDisplay.textContent = CONFIG.adminEmail;
}
if (contactEmailLink) {
  contactEmailLink.href = `mailto:${CONFIG.adminEmail}`;
}
if (previewTo) {
  previewTo.textContent = CONFIG.adminEmail;
}

// ===== Form state (stored for modal use) =====
let formData = {};

// ===== Navbar Scroll Effect + Scroll State Detection =====
let lastScrollY = 0;
let scrollTimer = null;

function handleNavScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Disable hover effects during active scroll
  document.body.classList.add('is-scrolling');
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    document.body.classList.remove('is-scrolling');
  }, 150);

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

// ===== Form Progress Tracking =====
function updateFormProgress() {
  const name = document.getElementById('senderName').value.trim();
  const phone = document.getElementById('senderPhone').value.trim();
  const subject = document.getElementById('emailSubject').value.trim();
  const body = document.getElementById('emailBody').value.trim();

  let filled = 0;
  if (name) filled++;
  if (phone) filled++;
  if (subject) filled++;
  if (body) filled++;

  const percent = (filled / 4) * 100;
  if (formProgressBar) formProgressBar.style.width = `${percent}%`;
  if (formProgressText) formProgressText.textContent = `${filled} / 4 필수 항목`;
}

// Attach input listeners for progress
['senderName', 'senderPhone', 'emailSubject', 'emailBody'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateFormProgress);
});

// ===== Build Email Content =====
function buildEmailContent() {
  const name = document.getElementById('senderName').value.trim();
  const company = document.getElementById('senderCompany').value.trim();
  const phone = document.getElementById('senderPhone').value.trim();
  const subject = document.getElementById('emailSubject').value.trim();
  const body = document.getElementById('emailBody').value.trim();

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

  return {
    to: CONFIG.adminEmail,
    subject: `[문의] ${subject}`,
    body: emailBody,
    rawSubject: subject,
  };
}

// ===== Modal Open / Close =====
function openModal() {
  formData = buildEmailContent();
  if (previewTo) previewTo.textContent = formData.to;
  if (previewSubject) previewSubject.textContent = formData.subject;
  emailModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  emailModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close button
if (modalClose) modalClose.addEventListener('click', closeModal);

// Click overlay to close
if (emailModalOverlay) {
  emailModalOverlay.addEventListener('click', (e) => {
    if (e.target === emailModalOverlay) closeModal();
  });
}

// Escape key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== Contact Form → Open Modal =====
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('senderName').value.trim();
  const phone = document.getElementById('senderPhone').value.trim();
  const subject = document.getElementById('emailSubject').value.trim();
  const body = document.getElementById('emailBody').value.trim();

  // Validate required fields
  if (!name || !phone || !subject || !body) {
    alert('이름, 연락처, 제목, 내용은 필수 입력 항목입니다.');
    return;
  }

  openModal();
});

// ===== Email Sending Functions =====

// Gmail
if (sendGmail) {
  sendGmail.addEventListener('click', () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(formData.to)}&su=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.body)}`;
    window.open(gmailUrl, '_blank');
    closeModal();
  });
}

// 네이버 메일
if (sendNaver) {
  sendNaver.addEventListener('click', () => {
    const naverUrl = `https://mail.naver.com/write?to=${encodeURIComponent(formData.to)}&subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.body)}`;
    window.open(naverUrl, '_blank');
    closeModal();
  });
}

// 기본 메일 앱 (mailto:)
if (sendDefault) {
  sendDefault.addEventListener('click', () => {
    const mailtoLink = `mailto:${formData.to}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.body)}`;
    window.location.href = mailtoLink;
    closeModal();
  });
}

// ===== Scroll Reveal Animation (IntersectionObserver) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Number Counter Animation (IntersectionObserver) =====
function startCounter(counter) {
  if (counter.dataset.animated) return;
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
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

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
