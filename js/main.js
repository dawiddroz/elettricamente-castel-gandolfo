/* ============================================================
   Elettricamente — interazioni: firma "interruttore",
   contatori animati, flicker di accensione, safety-net.
   ============================================================ */
(function () {
  'use strict';

  var hasGsap = typeof gsap !== 'undefined';

  /* ========================================================
     1. FIRMA: l'interruttore che accende la pagina
     ======================================================== */
  var html = document.documentElement;
  var sw = document.getElementById('bigSwitch');
  var hint = document.getElementById('switchHint');
  var dim = document.getElementById('dim');

  function setLuce(on, animate) {
    html.setAttribute('data-luce', on ? 'on' : 'off');
    if (sw) sw.setAttribute('aria-checked', on ? 'true' : 'false');
    if (hint) hint.textContent = on ? 'Luce accesa — tocca per spegnere' : 'Tocca l\u2019interruttore';
    if (dim && !animate) dim.style.opacity = '0';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', on ? '#F8F6F1' : '#202A30');
    });
  }

  function luceAccesa() { return html.getAttribute('data-luce') === 'on'; }

  if (sw) {
    sw.addEventListener('click', function () {
      var next = !luceAccesa();
      if (hasGsap) {
        /* micro-feedback sul click: leggero "clack" meccanico */
        gsap.fromTo(sw, { scale: 0.94 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.45)' });
      }
      setLuce(next, false);
    });
  }

  /* ========================================================
     2. AL LOAD: la luce si accende da sola, con flicker reale
     ======================================================== */
  function flickerAccensione() {
    if (!hasGsap || !dim) { setLuce(true, false); return; }
    var tl = gsap.timeline({ onComplete: function () { setLuce(true, false); } });
    tl
      .to(dim, { opacity: 0.42, duration: 0.14, delay: 0.25, ease: 'power1.inOut' })
      .to(dim, { opacity: 0.58, duration: 0.11, ease: 'power1.inOut' })
      .to(dim, { opacity: 0.28, duration: 0.12, ease: 'power1.inOut' })
      .to(dim, { opacity: 0.48, duration: 0.10, ease: 'power1.inOut' })
      .to(dim, { opacity: 0.12, duration: 0.13, ease: 'power1.inOut' })
      .to(dim, { opacity: 0.32, duration: 0.09, ease: 'power1.inOut' })
      .to(dim, { opacity: 0,    duration: 0.4, ease: 'power2.out' });
  }
  flickerAccensione();

  /* ========================================================
     3. CONTATORI animati (rating, recensioni, km)
     ======================================================== */
  function contatore(el, target, decimals, dur) {
    if (!el) return;
    var obj = { v: 0 };
    if (hasGsap && typeof ScrollTrigger !== 'undefined') {
      gsap.to(obj, {
        v: target, duration: dur || 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: function () { el.textContent = obj.v.toFixed(decimals); }
      });
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }
  ['ratingNum', 'ratingNum2', 'ratingNum3'].forEach(function (id) {
    contatore(document.getElementById(id), 4.8, 1, 1.8);
  });
  ['revNum', 'revNum2'].forEach(function (id) {
    contatore(document.getElementById(id), 19, 0, 1.4);
  });
  contatore(document.getElementById('kmNum'), 24, 0, 1.2);

  /* ========================================================
     4. Anchor smooth con Lenis (se presente)
     ======================================================== */
  var lenis = window.ELETT_RICAMENTE_LENIS;
  if (lenis) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) { e.preventDefault(); lenis.scrollTo(0); return; }
        var target = document.querySelector(id);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
      });
    });
  }

  /* ========================================================
     5. SAFETY NET: dopo 4000ms tutto visibile, comunque
     ======================================================== */
  setTimeout(function () {
    document.querySelectorAll('[data-rv], [data-rv-group] > *').forEach(function (el) {
      var cs = parseFloat(getComputedStyle(el).opacity);
      if (cs < 1) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    if (dim && parseFloat(getComputedStyle(dim).opacity) > 0.02) dim.style.opacity = '0';
    if (!luceAccesa() && !hasGsap) setLuce(true, false);
  }, 4000);
})();
