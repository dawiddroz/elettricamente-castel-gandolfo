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
      .to(dim, { opacity: 0.62, duration: 0.09, delay: 0.35 })
      .to(dim, { opacity: 0.9,  duration: 0.07 })
      .to(dim, { opacity: 0.4,  duration: 0.08 })
      .to(dim, { opacity: 0.85, duration: 0.06 })
      .to(dim, { opacity: 0.18, duration: 0.09 })
      .to(dim, { opacity: 0.55, duration: 0.05 })
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
