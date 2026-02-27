import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ── Lenis smooth scroll ── */
const lenis = new Lenis({
  smoothWheel: true,
  smoothTouch: false,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── Reveal (single element fade-slide-up) ── */
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
});

/* ── Reveal-group → stagger children .reveal-item ── */
gsap.utils.toArray('.reveal-group').forEach((group) => {
  const items = group.querySelectorAll('.reveal-item');
  if (!items.length) return;
  gsap.from(items, {
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: group,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
});

/* ── Counter (animate numbers) ── */
gsap.utils.toArray('.counter').forEach((el) => {
  const target = parseFloat(el.dataset.target) || 0;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
    onUpdate() {
      el.textContent = Number.isInteger(target)
        ? Math.round(obj.val)
        : obj.val.toFixed(1);
    },
  });
});

/* ── GSAP progress bars ── */
gsap.utils.toArray('.gsap-progress-bar').forEach((bar) => {
  const width = bar.dataset.width || '0%';
  gsap.fromTo(
    bar,
    { width: '0%' },
    {
      width,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bar,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    }
  );
});

/* ── Parallax-slow (decorative elements in Hero) ── */
gsap.utils.toArray('.parallax-slow').forEach((el) => {
  gsap.to(el, {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: el.closest('section') || el,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
});

/* ── Vanilla-tilt 3D hover on cards ── */
async function initTilt() {
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const { default: VanillaTilt } = await import('vanilla-tilt');

  const cards = document.querySelectorAll('.tilt-card');
  if (cards.length) {
    VanillaTilt.init(Array.from(cards), {
      max: 8,
      speed: 400,
      scale: 1.02,
      glare: true,
      'max-glare': 0.08,
    });
  }

  const pricingCards = document.querySelectorAll('.tilt-pricing');
  if (pricingCards.length) {
    VanillaTilt.init(Array.from(pricingCards), {
      max: 5,
      speed: 400,
      scale: 1.01,
      glare: true,
      'max-glare': 0.12,
    });
  }
}

initTilt();
