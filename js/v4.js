/* v4: nav state over the dark hero, image placeholders. No effects beyond that. */
(function () {
  'use strict';
  var nav = document.querySelector('.nav4');
  if (nav) {
    if (document.querySelector('.hero4')) nav.classList.add('over');
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  document.querySelectorAll('.work4-media img').forEach(function (img) {
    if (img.complete && img.naturalWidth) { img.classList.add('loaded'); return; }
    img.addEventListener('load', function () { img.classList.add('loaded'); });
    img.addEventListener('error', function () { img.classList.add('loaded'); });
  });
})();
