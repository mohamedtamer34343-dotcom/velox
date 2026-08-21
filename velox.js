/* ============================================================
   VELOX — main.js
   Features: loading screen, scroll reveal, cursor, navbar
   ============================================================ */

(function () {
  'use strict';

  /* ---- LOADING SCREEN ---- */
  const loader = document.getElementById('loader');

  function dismissLoader() {
    if (!loader) return;
    loader.classList.add('loaded');
    setTimeout(() => loader.remove(), 800);
    document.body.style.overflow = '';
  }

  // Block scroll during load
  document.body.style.overflow = 'hidden';

  // Dismiss after animation finishes (~2.9s) or on load
  const loaderTimer = setTimeout(dismissLoader, 2900);

  window.addEventListener('load', () => {
    clearTimeout(loaderTimer);
    setTimeout(dismissLoader, 300);
  });

  /* ---- NAVBAR ---- */
  const navbar     = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const langToggle = document.getElementById('langToggle');
  const translatableElements = document.querySelectorAll('[data-en][data-ar]');
  const inputElements = document.querySelectorAll('input[data-placeholder-en][data-placeholder-ar], textarea[data-placeholder-en][data-placeholder-ar]');

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem('velox-theme', theme);

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
      themeToggle.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }
  }

  function applyLanguage(lang) {
    const isArabic = lang === 'ar';
    document.body.dataset.lang = lang;
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.body.dir = isArabic ? 'rtl' : 'ltr';
    localStorage.setItem('velox-lang', lang);

    translatableElements.forEach(el => {
      const text = isArabic ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      if (text) el.textContent = text;
    });

    inputElements.forEach(el => {
      const placeholder = isArabic ? el.getAttribute('data-placeholder-ar') : el.getAttribute('data-placeholder-en');
      if (placeholder) el.setAttribute('placeholder', placeholder);
    });

    if (langToggle) {
      langToggle.textContent = isArabic ? 'EN' : 'AR';
      langToggle.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
    }
  }

  const savedTheme = localStorage.getItem('velox-theme');
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(initialTheme);

  const savedLang = localStorage.getItem('velox-lang') || 'en';
  applyLanguage(savedLang);

  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  langToggle?.addEventListener('click', () => {
    const nextLang = document.body.dataset.lang === 'ar' ? 'en' : 'ar';
    applyLanguage(nextLang);
  });

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger
  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  navLinks?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', (event) => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');

      if (a.getAttribute('href') === 'project.html') {
        event.preventDefault();
        a.classList.add('store-launch');
        setTimeout(() => {
          window.location.href = 'project.html';
        }, 220);
      }
    })
  );

  /* ---- SCROLL REVEAL ---- */
  const revealConfig = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, revealConfig);

  function initReveal() {
    document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .stagger-children'
    ).forEach(el => revealObserver.observe(el));
  }

  /* ---- CUSTOM CURSOR (desktop only) ---- */
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animCursor() {
      // Dot follows instantly
      dot.style.transform  = `translate(${mx - 3}px, ${my - 3}px)`;
      // Ring lags
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // Hover state on interactive elements
    document.querySelectorAll('a, button, .about-card, .pillar, tbody tr').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
  }

  /* ---- HERO TEXT COUNTER ANIMATION ---- */
  function animateCounters() {
    // Future: add stat numbers here
  }

  /* ---- TABLE ROW HOVER HIGHLIGHT ---- */
  function initTableHover() {
    document.querySelectorAll('tbody tr').forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.background = 'rgba(255,255,255,0.04)';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
    });
  }

  /* ---- IMAGE ZOOM MODAL ---- */
  function initImageZoom() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('imageModalImg');
    const closeBtn = document.getElementById('imageModalClose');
    const backdrop = document.getElementById('imageModalBackdrop');
    const zoomableImages = document.querySelectorAll('.zoomable-image');

    if (!modal || !modalImg || !closeBtn || !backdrop || zoomableImages.length === 0) return;

    function openModal(src, alt) {
      modalImg.src = src;
      modalImg.alt = alt || '';
      modal.classList.add('visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalImg.src = '';
    }

    zoomableImages.forEach(img => {
      img.addEventListener('click', () => openModal(img.src, img.alt));
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('visible')) {
        closeModal();
      }
    });
  }

  /* ---- SMOOTH SCROLL FOR ANCHORS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---- PLAN GALLERY SLIDES ---- */
  function initPlanGalleries() {
    document.querySelectorAll('.plan-toggle-btn').forEach(button => {
      const gallery = button.closest('li')?.nextElementSibling?.querySelector('.plan-gallery');
      if (!gallery) return;

      const slides = [...gallery.querySelectorAll('.plan-slide')];
      if (slides.length === 0) return;

      let currentIndex = -1;

      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
      }

      function openGallery() {
        if (!gallery.classList.contains('visible')) {
          gallery.classList.add('visible');
        }
        currentIndex = 0;
        showSlide(currentIndex);
      }

      function nextSlide() {
        if (!gallery.classList.contains('visible')) {
          openGallery();
          return;
        }

        currentIndex += 1;
        if (currentIndex >= slides.length) {
          gallery.classList.remove('visible');
          currentIndex = -1;
          slides.forEach(slide => slide.classList.remove('active'));
          return;
        }

        showSlide(currentIndex);
      }

      function prevSlide() {
        if (!gallery.classList.contains('visible')) return;

        currentIndex -= 1;
        if (currentIndex < 0) {
          currentIndex = 0;
        }
        showSlide(currentIndex);
      }

      button.addEventListener('click', () => {
        if (currentIndex === -1) {
          openGallery();
          return;
        }

        nextSlide();
      });

      const prevButton = gallery.querySelector('.plan-prev');
      const nextButton = gallery.querySelector('.plan-next');

      prevButton?.addEventListener('click', prevSlide);
      nextButton?.addEventListener('click', nextSlide);
    });
  }

  /* ---- INIT ---- */
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initCursor();
    initTableHover();
    initImageZoom();
    initPlanGalleries();
  });

})();
