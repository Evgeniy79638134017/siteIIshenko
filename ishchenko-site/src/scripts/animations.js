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

/* ── SplitText on key headings ── */
function initSplitText() {
  document.querySelectorAll('.split-heading').forEach((el) => {
    const text = el.textContent;
    const chars = text.split('');
    el.innerHTML = chars.map((char) =>
      char === ' '
        ? ' '
        : `<span class="inline-block" style="opacity:0; transform:translateY(30px);">${char}</span>`
    ).join('');
    const spans = el.querySelectorAll('span');
    gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.05,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  });
}
setTimeout(initSplitText, 100);

/* ── Reveal (single element fade-slide-up) ── */
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.to(el, {
    y: 0,
    opacity: 1,
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
  gsap.to(items, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: group,
      start: 'top 80%',
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
  gsap.to(bar, {
    width,
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: bar,
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
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

/* ── Safety fallback: show elements if GSAP didn't trigger ── */
setTimeout(() => {
  document.querySelectorAll('.reveal, .reveal-item').forEach((el) => {
    const style = window.getComputedStyle(el);
    if (style.opacity === '0') {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}, 4000);

/* ── Cursor glow effect (desktop only) ── */
function initCursorGlow() {
  if (window.innerWidth < 1024) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.classList.add('cursor-glow');
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!glow.classList.contains('active')) {
      glow.classList.add('active');
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.classList.remove('active');
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

if (document.readyState === 'complete') {
  initCursorGlow();
} else {
  window.addEventListener('load', initCursorGlow);
}
