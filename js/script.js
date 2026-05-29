/* =========================================================
   FixForge — script.js
   ========================================================= */

/* ── Matrix rain canvas — FULL SITE ──────────────────────── */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx   = canvas.getContext('2d');
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF><=/\\|FIXFORGE';
  let cols, drops;

  function resize() {
    // Используем screen.width/height на мобиле чтобы адресная строка не дёргала canvas
    const w = window.screen ? Math.max(window.innerWidth,  screen.width  || 0) : window.innerWidth;
    const h = window.screen ? Math.max(window.innerHeight, screen.height || 0) : window.innerHeight;
    canvas.width  = w;
    canvas.height = h;
    cols  = Math.floor(w / 18);
    drops = Array.from({ length: cols }, () => Math.random() * -80);
  }

  function draw() {
    ctx.fillStyle = 'rgba(6,6,6,0.048)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < cols; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = `rgba(200,255,200,${0.7 + Math.random()*0.3})`;
      ctx.font = '13px "Share Tech Mono", monospace';
      ctx.fillText(ch, i * 18, drops[i] * 18);
      ctx.fillStyle = '#00ff41';
      ctx.fillText(ch, i * 18, drops[i] * 18);
      if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.65;
    }
  }

  resize();

  // Дебаунс — не реагируем на мелкие изменения высоты (адресная строка мобила)
  let resizeTimer;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    const newW = window.innerWidth;
    // Ресайзим только если изменилась ШИРИНА (не высота от адресной строки)
    if (newW !== lastW) {
      lastW = newW;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    }
  }, { passive: true });

  setInterval(draw, 45);
})();


/* ── Floating particles ───────────────────────────────────── */
(function initParticles() {
  const field = document.getElementById('particle-field');
  if (!field) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'fp';
    const size = Math.random() * 2 + 1;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const dur = 8 + Math.random() * 14;
    const dx = (Math.random() - 0.5) * 80;
    p.style.cssText = `
      left:${left}%;
      bottom:-10px;
      width:${size}px;
      height:${size}px;
      --dx:${dx}px;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      box-shadow:0 0 ${size*3}px var(--green);
    `;
    field.appendChild(p);
  }
})();


/* ── Custom cursor trail ──────────────────────────────────── */
(function initCursorTrail() {
  const dots = [];
  const N = 10;
  for (let i = 0; i < N; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed;pointer-events:none;z-index:9999;
      width:${4 + i*0.5}px;height:${4 + i*0.5}px;
      border-radius:50%;
      background:rgba(0,255,65,${0.6 - i*0.05});
      box-shadow:0 0 ${6+i}px rgba(0,255,65,${0.4-i*0.03});
      transition:transform 0.05s;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(d);
    dots.push({ el: d, x: 0, y: 0 });
  }
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animateDots() {
    dots[0].x = mx; dots[0].y = my;
    for (let i = 1; i < N; i++) {
      dots[i].x += (dots[i-1].x - dots[i].x) * 0.35;
      dots[i].y += (dots[i-1].y - dots[i].y) * 0.35;
    }
    dots.forEach(d => { d.el.style.left = d.x+'px'; d.el.style.top = d.y+'px'; });
    requestAnimationFrame(animateDots);
  }
  animateDots();
})();


/* ── Navbar scroll ────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── Burger / mobile menu ─────────────────────────────────── */
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
  });

  menu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
    });
  });
})();


/* ── Text Scramble ────────────────────────────────────────── */
class TextScramble {
  constructor(el) {
    this.el    = el;
    this.noise = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef0123456789@#$%&<>/\\|ФИКСФОРДЖабвгдежзи';
    this.raf   = null;
  }

  setText(newText, speed = 3) {
    const len = newText.length;
    let frame = 0;
    cancelAnimationFrame(this.raf);

    const tick = () => {
      const resolved = Math.floor(frame / speed);
      let out = '';

      for (let i = 0; i < len; i++) {
        const ch = newText[i];
        if (ch === ' ' || ch === '\u00A0' || ch === '—' || ch === '-') {
          out += ch;
        } else if (i < resolved) {
          out += `<span style="color:inherit">${ch}</span>`;
        } else {
          const r = this.noise[Math.floor(Math.random() * this.noise.length)];
          out += `<span style="opacity:0.35;color:#00ff41">${r}</span>`;
        }
      }

      this.el.innerHTML = out;

      if (resolved < len) {
        frame++;
        this.raf = requestAnimationFrame(tick);
      } else {
        this.el.textContent = newText;
      }
    };

    tick();
  }
}

(function initScramble() {
  const isMobile = window.matchMedia('(hover: none), (max-width: 900px)').matches;
  const heroEls = document.querySelectorAll('#hero [data-scramble]');

  heroEls.forEach((el, i) => {
    const original = el.textContent.trim();

    // На мобиле — скрамбл только для .hero-brand (FIXFORGE), остальное просто показываем
    if (isMobile && !el.classList.contains('hero-brand')) {
      // Просто показываем текст без скрамбла — анимация fade уже в CSS
      el.textContent = original;
      return;
    }

    el.textContent = '\u00A0';
    setTimeout(() => new TextScramble(el).setText(original, 7), 400 + i * 380);
  });

  // Bidirectional для остальных секций — на мобиле тоже работает
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (el.closest('#hero')) return;
      const orig = el.dataset.scrambleText || el.textContent.trim();
      el.dataset.scrambleText = orig;
      if (entry.isIntersecting) {
        new TextScramble(el).setText(orig, 5);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('[data-scramble]').forEach(el => {
    if (!el.closest('#hero')) io.observe(el);
  });
})();


/* ── Service & Price card reveal ──────────────────────────── */
(function initCardReveal() {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const grid = entry.target.closest('.services-grid, .pricing-grid');
      if (!grid || grid._revealed) return;
      grid._revealed = true;
      grid.querySelectorAll('.service-card, .price-card').forEach((c, i) => {
        setTimeout(() => c.classList.add('visible'), i * 100);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.service-card, .price-card').forEach(c => io.observe(c));
})();


/* ── Terminal typing reveal ───────────────────────────────── */
(function initTerminal() {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.terminal-line').forEach(line => {
        const delay = parseInt(line.dataset.delay, 10) || 0;
        setTimeout(() => line.classList.add('visible'), delay);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.terminal-box').forEach(b => io.observe(b));
})();


/* ── Contact form ─────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    // If formspree ID is set, let it submit naturally
    const action = form.getAttribute('action') || '';
    if (action.includes('YOUR_FORM_ID')) {
      e.preventDefault(); // demo mode
      const btn     = form.querySelector('.submit-btn');
      const btnText = form.querySelector('.btn-text');
      const loader  = form.querySelector('.btn-loader');
      btn.disabled   = true;
      btnText.hidden = true;
      loader.hidden  = false;
      setTimeout(() => {
        btn.disabled   = false;
        btnText.hidden = false;
        loader.hidden  = true;
        form.reset();
        success.hidden = false;
        setTimeout(() => { success.hidden = true; }, 5000);
      }, 1400);
    }
    // else Formspree handles it
  });
})();


/* ── Active nav link on scroll ────────────────────────────── */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--green)' : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
})();


/* ── Section reveal — BIDIRECTIONAL ────────────────────────── */
(function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      } else {
        // re-hide so animation replays on scroll back
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
      }
    });
  }, { threshold: 0.06 });

  sections.forEach(s => {
    if (s.id !== 'hero') {
      s.style.opacity = '0';
      s.style.transform = 'translateY(20px)';
      s.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    }
    io.observe(s);
  });
})();


/* ── Tilt effect on service/price cards ───────────────────── */
(function initTilt() {
  document.querySelectorAll('.service-card, .price-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateY(${dx*7}deg) rotateX(${-dy*5}deg)`;
      card.style.transition = 'transform 0.08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'border-color 0.35s, transform 0.5s ease, box-shadow 0.35s';
    });
  });
})();


/* ── Ripple on buttons ────────────────────────────────────── */
(function initRipple() {
  document.querySelectorAll('.hero-btn-primary, .submit-btn, .price-btn, .qb-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      r.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(0,255,65,0.25);
        border-radius:50%;
        transform:scale(0);
        animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none;
        z-index:10;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  });

  // inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleAnim{to{transform:scale(1);opacity:0}}`;
  document.head.appendChild(style);
})();


/* ── Counter animation on about stats ────────────────────── */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const dur = 1600;
      const step = target / (dur / 16);
      const tick = () => {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start) + suffix;
        if (start < target) requestAnimationFrame(tick);
      };
      tick();
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();


/* ── Glitch flicker on logo ───────────────────────────────── */
(function initLogoGlitch() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  setInterval(() => {
    if (Math.random() > 0.85) {
      logo.style.textShadow = '2px 0 #ff003c, -2px 0 #00eeff';
      setTimeout(() => { logo.style.textShadow = ''; }, 80);
    }
  }, 2000);
})();


/* ── Hero: повторная scramble-анимация при скролле назад ─── */
(function initHeroScrambleRepeat() {
  const isMobile = window.matchMedia('(hover: none), (max-width: 900px)').matches;
  const hero = document.getElementById('hero');
  if (!hero) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      hero.querySelectorAll('[data-scramble]').forEach((el, i) => {
        // На мобиле — только FIXFORGE
        if (isMobile && !el.classList.contains('hero-brand')) return;
        const orig = el.dataset.heroText || el.textContent.trim();
        el.dataset.heroText = orig;
        setTimeout(() => new TextScramble(el).setText(orig, 7), 300 + i * 350);
      });
    });
  }, { threshold: 0.4 });

  io.observe(hero);
})();


/* ── Мобильные анимации: hover-эффекты через IntersectionObserver ── */
(function initMobileAnimations() {
  const isMobile = () => window.matchMedia('(hover: none)').matches;

  // Карточки — пульсируют когда в центре экрана
  const cardIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting) {
        card.classList.add('mobile-active');
      } else {
        card.classList.remove('mobile-active');
      }
    });
  }, { rootMargin: '-25% 0px -25% 0px', threshold: 0 });

  // Контакт-айтемы — подсвечиваются при попадании в центр
  const contactIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('mobile-active');
        setTimeout(() => entry.target.classList.remove('mobile-active'), 900);
      }
    });
  }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });

  document.querySelectorAll('.service-card, .price-card').forEach(c => cardIo.observe(c));
  document.querySelectorAll('.contact-item').forEach(c => contactIo.observe(c));
})();
