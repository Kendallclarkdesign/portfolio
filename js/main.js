/* ============================================================
   KENDALL CLARK, PORTFOLIO
   main.js: Shared JS: Nav, Scroll Reveal, Filter
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
        if (link.classList.contains('nav-link')) link.setAttribute('aria-current', 'page');
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


/* ============================================================
   CASE STUDY ENHANCEMENTS
   Reading progress, section rail with scrollspy, next project.
   ============================================================ */
(function () {
  'use strict';
  var inner = document.querySelector('.cs-body-inner');
  if (!inner) return;

  // 1. Reading progress bar
  var bar = document.createElement('div');
  bar.className = 'cs-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(h.scrollTop / max, 1) : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. Section rail (built from the existing section headings)
  var sections = inner.querySelectorAll('.cs-section');
  if (sections.length > 2) {
    var content = document.createElement('div');
    content.className = 'cs-content';
    while (inner.firstChild) content.appendChild(inner.firstChild);

    var rail = document.createElement('nav');
    rail.className = 'cs-rail';
    rail.setAttribute('aria-label', 'Case study sections');
    rail.innerHTML = '<div class="cs-rail-label">On this page</div>';

    var links = [];
    content.querySelectorAll('.cs-section').forEach(function (sec, i) {
      var h2 = sec.querySelector('h2');
      if (!h2) return;
      if (!sec.id) sec.id = 'sec-' + (i + 1);
      var a = document.createElement('a');
      a.href = '#' + sec.id;
      a.textContent = h2.textContent;
      rail.appendChild(a);
      links.push({ a: a, sec: sec });
    });

    inner.classList.add('cs-has-rail');
    inner.appendChild(rail);
    inner.appendChild(content);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) { l.a.classList.toggle('on', l.sec === e.target); });
        });
      }, { rootMargin: '-25% 0px -65% 0px' });
      links.forEach(function (l) { io.observe(l.sec); });
    }
  }

  // 3. Next project card
  var order = [
    ['case-study-amex.html', 'American Express, Fraud Investigation Platform'],
    ['case-study-towpath-crm.html', 'Towpath CRM, Agents on the Team'],
    ['case-study-towpath-studio.html', 'Towpath Studio, Site Builder with AI'],
    ['case-study-agent-teams.html', 'Agent Teams That Check Each Other'],
    ['case-study-video-pipeline.html', 'Video Pipeline, Made in Code'],
    ['case-study-agency-tool.html', 'Prospecting and Reporting Tool'],
    ['case-study-links.html', 'Links, Community Social Platform'],
    ['case-study-maxnoir.html', 'Max Noir, Creator Website'],
    ['case-study-hausofalt.html', 'Haus of Alt, Brand and Shopify Store'],
    ['case-study-ninas.html', "Nina's Cleaning Service, Brand, Web & Local SEO"],
    ['case-study-clearbot.html', 'ClearBot, Shopify Storefront'],
    ['case-study-nufix.html', 'Nu-Fix, Contractor Website'],
    ['case-study-winsor.html', 'Winsor Pilates, Membership Site'],
    ['case-study-swiftfinance.html', 'SwiftFinance, Mobile Banking Concept'],
    ['case-study-forge.html', 'FORGE Fitness, Web Concept']
  ];
  var here = location.pathname.split('/').pop();
  var idx = order.findIndex(function (o) { return o[0] === here; });
  if (idx > -1) {
    var next = order[(idx + 1) % order.length];
    var a = document.createElement('a');
    a.className = 'cs-next';
    a.href = next[0];
    a.innerHTML = '<div class="cs-next-inner"><div><div class="cs-rail-label">Next project</div><div class="cs-next-title"></div></div><div class="cs-next-arrow" aria-hidden="true">&rarr;</div></div>';
    a.querySelector('.cs-next-title').textContent = next[1];
    var anchor = document.querySelector('.cs-body');
    if (anchor) anchor.insertAdjacentElement('afterend', a);
  }
})();
