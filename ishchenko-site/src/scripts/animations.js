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

/* ── Comet trail cursor (desktop only) ── */
function initCometCursor() {
  if (window.innerWidth < 1024) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const trail = [];
  const maxTrail = 30;
  let mouseX = -100, mouseY = -100;
  let isActive = false;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isActive = true;
    trail.push({ x: mouseX, y: mouseY, time: Date.now() });
    if (trail.length > maxTrail) trail.shift();
  });

  document.addEventListener('mouseleave', () => {
    isActive = false;
    trail.length = 0;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (trail.length < 2) {
      requestAnimationFrame(draw);
      return;
    }

    const now = Date.now();

    // Убираем старые точки (старше 400ms)
    while (trail.length > 0 && now - trail[0].time > 400) {
      trail.shift();
    }

    if (trail.length < 2) {
      requestAnimationFrame(draw);
      return;
    }

    // Рисуем ломаную линию (не сглаженную — angular corners)
    for (let i = 1; i < trail.length; i++) {
      const prev = trail[i - 1];
      const curr = trail[i];
      const age = (now - curr.time) / 400; // 0 = новая, 1 = старая
      const alpha = Math.max(0, (1 - age) * 0.7);
      const width = Math.max(0.5, (1 - age) * 2.5);

      // Gradient: accent (D97757) → primary (1A535C) по длине
      const ratio = i / trail.length;
      const r = Math.round(217 - ratio * (217 - 26));
      const g = Math.round(119 - ratio * (119 - 83));
      const b = Math.round(87 + ratio * (92 - 87));

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'square'; // ломаные углы, не скруглённые
      ctx.lineJoin = 'miter'; // острые углы
      ctx.stroke();
    }

    // Головка кометы — яркая точка
    if (isActive && trail.length > 0) {
      const head = trail[trail.length - 1];

      ctx.beginPath();
      ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(217, 119, 87, 0.6)';
      ctx.fill();

      // Glow вокруг головки
      ctx.beginPath();
      ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 8);
      glow.addColorStop(0, 'rgba(217, 119, 87, 0.3)');
      glow.addColorStop(1, 'rgba(217, 119, 87, 0)');
      ctx.fillStyle = glow;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

if (document.readyState === 'complete') {
  initCometCursor();
} else {
  window.addEventListener('load', initCometCursor);
}
