/* ============================================================
   Elettricamente — animazioni: Lenis (drivato da GSAP) +
   ScrollTrigger: reveal con scrub, parallax, stagger.
   Nessun kill-switch su prefers-reduced-motion: le animazioni
   partono sempre.
   ============================================================ */
(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis sempre drivato dal ticker GSAP ---------- */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- reveal con scrub 0.6 su ogni sezione ---------- */
  gsap.utils.toArray('[data-rv]').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 42 },
      {
        opacity: 1, y: 0, ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 52%',
          scrub: 0.6
        }
      }
    );
  });

  /* ---------- stagger su gruppi (scaffali, vetrina) ---------- */
  gsap.utils.toArray('[data-rv-group]').forEach(function (group) {
    var cards = group.children;
    gsap.fromTo(cards,
      { opacity: 0, y: 56 },
      {
        opacity: 1, y: 0, ease: 'power2.out', stagger: 0.16,
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 0.6
        }
      }
    );
  });

  /* ---------- parallax: lampadina hero + foto "perché noi" ---------- */
  gsap.to('#heroBulb', {
    yPercent: 16, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  gsap.to('#perche .ph img', {
    yPercent: -10, ease: 'none',
    scrollTrigger: { trigger: '#perche', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
  });

  /* ---------- navbar: stato "solid" dopo l'hero ---------- */
  ScrollTrigger.create({
    start: 90,
    end: 'max',
    onToggle: function (self) {
      document.body.classList.toggle('nav-solid', self.isActive);
    }
  });

  /* ---------- sticky CTA: appare dopo l'hero ---------- */
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 60%',
    onEnter: function () { document.getElementById('stickyCta').classList.add('on'); },
    onLeaveBack: function () { document.getElementById('stickyCta').classList.remove('on'); }
  });

  /* ---------- entrata hero nei primi 2s (gestita con il flicker in main.js) ---------- */
  window.ELETT_RICAMENTE_LENIS = lenis;
})();
