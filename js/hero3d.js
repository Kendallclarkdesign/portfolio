/* ============================================================
   Hero 3D: a lit sphere with the script wordmark floating in front
   as a thick, layered extrusion. Loads Three.js on demand and
   falls back to the static CSS hero if WebGL, the CDN, or
   reduced-motion rules it out.
   ============================================================ */
(function () {
  'use strict';

  var art = document.querySelector('.hero4-art');
  if (!art) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Cheap WebGL check before downloading anything
  try {
    var probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
  } catch (e) { return; }

  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  var WORD = 'Kendall';
  var LAYERS = 22;

  Promise.all([
    import(THREE_URL),
    (document.fonts && document.fonts.load)
      ? document.fonts.load('italic 600 200px "Playfair Display"').catch(function () {})
      : Promise.resolve()
  ]).then(function (res) {
    start(res[0]);
  }).catch(function () { /* stay on the static hero */ });

  function start(THREE) {
    var canvas = document.createElement('canvas');
    canvas.className = 'hero3d';
    canvas.setAttribute('aria-hidden', 'true');
    art.appendChild(canvas);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 2.7, 0.1, 50);
    camera.position.set(0, 0, 10);

    // Lighting: one key light so the sphere reads as a solid, a soft fill so the dark side is not black
    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x1b2a6b, 0.85));
    var key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-4, 5, 6);
    scene.add(key);

    // Sphere
    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 96, 96),
      new THREE.MeshStandardMaterial({ color: 0x3d6bff, roughness: 0.5, metalness: 0.05 })
    );
    scene.add(sphere);

    // Wordmark texture drawn from the page font
    var TW = 2048, TH = 1024;
    var tex = document.createElement('canvas');
    tex.width = TW; tex.height = TH;
    var ctx = tex.getContext('2d');
    var size = 640;
    ctx.font = 'italic 600 ' + size + 'px "Playfair Display", Georgia, serif';
    while (ctx.measureText(WORD).width > TW * 0.94 && size > 100) {
      size -= 12;
      ctx.font = 'italic 600 ' + size + 'px "Playfair Display", Georgia, serif';
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(WORD, TW / 2, TH / 2 + size * 0.04);
    var texture = new THREE.CanvasTexture(tex);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Extrusion by stacking identical planes: dark at the back, white at the front
    var word = new THREE.Group();
    var geo = new THREE.PlaneGeometry(8.2, 4.1);
    var depth = 0.9;
    var back = new THREE.Color(0x0b1220), front = new THREE.Color(0xffffff), mid = new THREE.Color(0x9db4ff);
    for (var i = 0; i < LAYERS; i++) {
      var t = i / (LAYERS - 1);
      var col = t < 0.9 ? back.clone().lerp(mid, t / 0.9) : mid.clone().lerp(front, (t - 0.9) / 0.1);
      if (i === LAYERS - 1) col = front.clone();
      var m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: texture, color: col, transparent: true, alphaTest: 0.5 }));
      m.position.z = -depth / 2 + t * depth;
      word.add(m);
    }
    word.position.z = 3.4; // in front of the sphere's nearest surface (radius 2.5)
    word.scale.setScalar(0.82);
    scene.add(word);

    // Sizing: the sphere fills the height of the art area
    function resize() {
      var w = art.clientWidth, h = art.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Distance so a sphere of diameter ~5.2 fits the height
      var fov = camera.fov * Math.PI / 180;
      var dist = (5.3 / 2) / Math.tan(fov / 2);
      // On narrow screens, make sure the wordmark width also fits
      var needW = 3.4 + 7.1 / (2 * Math.tan(fov / 2) * camera.aspect); // word plane sits 3.4 units toward the camera
      camera.position.z = Math.max(dist, needW);
      camera.updateProjectionMatrix();
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(art);
    else window.addEventListener('resize', resize);

    // Pointer parallax, eased
    var tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', function (e) {
      var r = art.getBoundingClientRect();
      tx = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 2;
      ty = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * 2;
      tx = Math.max(-1, Math.min(1, tx));
      ty = Math.max(-1, Math.min(1, ty));
    }, { passive: true });

    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(art);
    }

    var clock = new THREE.Clock();
    function frame() {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      var t = clock.getElapsedTime();
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      sphere.rotation.y = t * 0.12;
      word.rotation.y = cx * 0.5 + Math.sin(t * 0.6) * 0.1;
      word.rotation.x = cy * 0.18 + Math.sin(t * 0.45) * 0.03;
      word.position.y = Math.sin(t * 0.8) * 0.06;
      sphere.position.x = -cx * 0.15;
      renderer.render(scene, camera);
    }
    frame();

    // Hide the static fallback once the first frame is drawn
    requestAnimationFrame(function () { art.classList.add('is-3d'); });
  }
})();
