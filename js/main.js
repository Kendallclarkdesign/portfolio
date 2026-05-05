/* ============================================================
   KENDALL CLARK — PORTFOLIO
   main.js — Shared JS: Cursor, Scroll Reveal, Nav, Ticker
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CUSTOM CURSOR
     ---------------------------------------------------------- */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  function updateCursor() {
    if (dot)  { dot.style.left  = mouseX + 'px'; dot.style.top  = mouseY + 'px'; }

    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (ring) { ring.style.left = ringX + 'px'; ring.style.top  = ringY + 'px'; }

    rafId = requestAnimationFrame(updateCursor);
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', function () {
    if (dot)  dot.style.opacity  = '0';
    if (ring) ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    if (dot)  dot.style.opacity  = '1';
    if (ring) ring.style.opacity = '1';
  });

  const hoverTargets = 'a, button, .btn, .tag, .project-card, .resume-card, .service-card, .nav-link, .nav-cta, input, textarea, select';

  document.querySelectorAll(hoverTargets).forEach(function (el) {
    el.addEventListener('mouseenter', function () { if (ring) ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', function () { if (ring) ring.classList.remove('hovered'); });
  });

  if (dot || ring) rafId = requestAnimationFrame(updateCursor);

  /* ----------------------------------------------------------
     2. MOBILE NAV
     ---------------------------------------------------------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay   = document.querySelector('.nav-overlay');
  const overlayLinks = document.querySelectorAll('.nav-overlay a');

  if (hamburger && overlay) {
    hamburger.addEventListener('click', function () {
      const isOpen = overlay.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlayLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        overlay.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK
     ---------------------------------------------------------- */
  (function () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .footer-link').forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ----------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver)
     ---------------------------------------------------------- */
  (function () {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { io.observe(el); });
  })();

  /* ----------------------------------------------------------
     5. PROJECT FILTER (work.html)
     ---------------------------------------------------------- */
  (function () {
    const filters = document.querySelectorAll('[data-filter]');
    const cards   = document.querySelectorAll('[data-category]');
    if (!filters.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn.getAttribute('data-filter');

        filters.forEach(function (f) { f.classList.remove('active'); });
        btn.classList.add('active');

        cards.forEach(function (card) {
          if (cat === 'all') {
            card.style.display = '';
          } else {
            const cats = card.getAttribute('data-category') || '';
            card.style.display = cats.includes(cat) ? '' : 'none';
          }
        });
      });
    });
  })();

  /* ----------------------------------------------------------
     6. TICKER DUPLICATE (seamless loop)
     ---------------------------------------------------------- */
  (function () {
    const track = document.querySelector('.ticker-track');
    if (!track) return;
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  })();

  /* ----------------------------------------------------------
     7. REDUCED MOTION: pause animations
     ---------------------------------------------------------- */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--ticker-duration', '0s');
      const track = document.querySelector('.ticker-track');
      if (track) track.style.animationPlayState = 'paused';
    }
  })();

})();
