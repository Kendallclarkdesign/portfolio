/* ============================================================
   KENDALL CLARK — PORTFOLIO
   main.js — Shared JS: Nav, Scroll Reveal, Filter
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. MOBILE NAV
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
     2. ACTIVE NAV LINK
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
     3. SCROLL REVEAL (IntersectionObserver)
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
     4. PROJECT FILTER (work.html)
     ---------------------------------------------------------- */
  (function () {
    const filters = document.querySelectorAll('[data-filter]');
    const cards   = document.querySelectorAll('[data-category]');
    if (!filters.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn.getAttribute('data-filter');

        filters.forEach(function (f) { f.classList.remove('active'); f.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

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

})();
