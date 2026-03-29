/* ═══════════════════════════════════════════════════
   THE LIFE OF A DEVELOPER — script.js
   All interactions, animations, scroll effects
═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────
   1. BOOT LOADER
───────────────────────────── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const bootEl   = document.getElementById('boot-text');
  const barEl    = document.getElementById('loader-bar');
  const pctEl    = document.getElementById('loader-pct');

  const lines = [
    '> Initializing developer memory...',
    '> Loading regrets: [████████] 100%',
    '> npm install existential-dread',
    '> WARNING: node_modules is 847 MB',
    '> Compiling 6 years of experience...',
    '> git commit -m "final_v3_FINAL"',
    '> Build succeeded. Somehow.',
  ];

  let lineIdx = 0, charIdx = 0, full = '';

  function tick() {
    if (lineIdx >= lines.length) {
      setTimeout(() => {
        loader.classList.add('gone');
        fireHeroReveals();
      }, 400);
      return;
    }
    const line = lines[lineIdx];
    if (charIdx <= line.length) {
      const partial = (lineIdx > 0 ? full + '\n' : '') + line.slice(0, charIdx);
      bootEl.textContent = partial;
      const pct = Math.round(((lineIdx + charIdx / line.length) / lines.length) * 100);
      barEl.style.width = pct + '%';
      pctEl.textContent = pct + '%';
      charIdx++;
      setTimeout(tick, charIdx === 1 ? 0 : 20);
    } else {
      full += (lineIdx > 0 ? '\n' : '') + line;
      lineIdx++; charIdx = 0;
      setTimeout(tick, 110);
    }
  }
  tick();
})();

/* ─────────────────────────────
   2. HERO REVEALS (fired after loader)
───────────────────────────── */
function fireHeroReveals() {
  document.querySelectorAll('.reveal-h').forEach(el => el.classList.add('fired'));
  // start canvas after hero shows
  initHeroCanvas();
}

/* ─────────────────────────────
   3. HERO CANVAS — floating ink dots
───────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Warm amber/terracotta palette for light theme
  const COLORS = [
    'rgba(200,118,74,',
    'rgba(212,146,42,',
    'rgba(180,100,60,',
    'rgba(45,106,79,',
    'rgba(69,123,157,',
  ];

  const PARTICLE_COUNT = 70;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x:     Math.random() * window.innerWidth,
    y:     Math.random() * window.innerHeight,
    vx:    (Math.random() - 0.5) * 0.25,
    vy:    (Math.random() - 0.5) * 0.25,
    r:     Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.18 + 0.04,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  let mouseX = -1000, mouseY = -1000;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mouse repulsion & draw
    particles.forEach(p => {
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.4;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
      // dampen
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,118,74,${0.06 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────
   4. CUSTOM CURSOR
───────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  const hoverEls = 'a, button, .log-item, .hour-btn, .phase-card, .sk-card, .ch-dot, .hamburger';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─────────────────────────────
   5. SCROLL PROGRESS + NAV
───────────────────────────── */
(function initScroll() {
  const prog = document.getElementById('scroll-progress');
  const nav  = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    const pct      = (scrolled / total * 100).toFixed(1) + '%';
    prog.style.setProperty('--prog', pct);
    nav.classList.toggle('scrolled', scrolled > 60);
  }, { passive: true });
})();

/* ─────────────────────────────
   6. SCROLL REVEAL (IntersectionObserver)
───────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -64px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ─────────────────────────────
   7. CHAPTER DOT TRACKING
───────────────────────────── */
(function initChDots() {
  const sections = ['hero', 'hello', 'debug', 'coffee', 'deadline', 'enlighten'];
  const dots = document.querySelectorAll('.ch-dot');

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const el = document.getElementById(sections[i]);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id  = e.target.id;
        const idx = sections.indexOf(id);
        if (idx === -1) return;
        dots.forEach(d => d.classList.remove('active'));
        dots[idx].classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* ─────────────────────────────
   8. PARALLAX HERO ON SCROLL
───────────────────────────── */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroStats   = document.querySelector('.hero-stats');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight) {
      if (heroContent) heroContent.style.transform = `translateY(${sy * 0.18}px)`;
      if (heroStats)   heroStats.style.transform   = `translateY(${sy * 0.08}px)`;
    }
  }, { passive: true });
})();

/* ─────────────────────────────
   9. DEBUG BAR ANIMATION
───────────────────────────── */
(function initGriefBars() {
  const panel = document.getElementById('grief-bars');
  if (!panel) return;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      panel.querySelectorAll('.g-bar').forEach(bar => {
        const pct  = bar.dataset.pct;
        const fill = bar.querySelector('.gb-fill');
        if (fill) fill.style.width = pct + '%';
      });
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(panel);
})();

/* ─────────────────────────────
   10. BUG LOG TOGGLE
───────────────────────────── */
window.toggleLog = function(el) {
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.log-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
};

/* ─────────────────────────────
   11. COFFEE INTERACTIVE
───────────────────────────── */
(function initCoffee() {
  const hourGrid     = document.getElementById('hour-grid');
  const statusEl     = document.getElementById('coffee-status');
  const mugLabel     = document.getElementById('mug-label');
  const coffeeLevel  = document.getElementById('coffeeLevel');
  const coffeeFoam   = document.getElementById('coffeeFoam');
  const mFocus       = document.getElementById('mFocus');
  const mConf        = document.getElementById('mConf');
  const mAnx         = document.getElementById('mAnx');
  const vFocus       = document.getElementById('vFocus');
  const vConf        = document.getElementById('vConf');
  const vAnx         = document.getElementById('vAnx');

  const data = {
    '6 AM':  { cups:0, focus:8,  conf:15, anx:5,  mug:'Pre-coffee. You are not yet a person.',                      label:'6 AM — Before the first cup. You are not yet human.' },
    '7 AM':  { cups:1, focus:42, conf:45, anx:12, mug:'First cup. The fog lifts. Possibility exists.',              label:'7 AM — First cup. The fog begins to lift.' },
    '8 AM':  { cups:1, focus:60, conf:55, anx:18, mug:'IDE is open. This was either a mistake or your calling.',    label:'8 AM — You open your IDE. Let\'s see how this goes.' },
    '9 AM':  { cups:2, focus:78, conf:72, anx:22, mug:'Second cup. Clarity. You write genuinely good code.',        label:'9 AM — Second cup. Clarity achieved. Good code happens.' },
    '10 AM': { cups:2, focus:72, conf:78, anx:28, mug:'Stand-up. You say what you\'ll do. Very optimistic.',        label:'10 AM — Stand-up. Estimates are confident. Very optimistic.' },
    '11 AM': { cups:3, focus:90, conf:88, anx:38, mug:'Third cup. Velocity. You are untouchable right now.',        label:'11 AM — Third cup. Velocity achieved. You are untouchable.' },
    '12 PM': { cups:3, focus:62, conf:65, anx:32, mug:'Lunch. You eat with your laptop open. It counts.',           label:'12 PM — Lunch with laptop open. Productivity maintained.' },
    '1 PM':  { cups:4, focus:82, conf:80, anx:62, mug:'Fourth cup. Trembling begins. Fingers move fast.',           label:'1 PM — Fourth cup. The trembling is a feature, not a bug.' },
    '2 PM':  { cups:4, focus:48, conf:52, anx:75, mug:'The 2 PM wall. You refactor things that did not need it.',   label:'2 PM — The wall. Refactoring things that didn\'t need it.' },
    '3 PM':  { cups:5, focus:94, conf:92, anx:92, mug:'Fifth cup. You rewrote the entire database schema. No one asked.', label:'3 PM — Fifth cup. You rewrote the database schema. Unprompted.' },
    '4 PM':  { cups:5, focus:68, conf:75, anx:96, mug:'The chaos is now architecture. You call it "micro-services."', label:'4 PM — The chaos is now architecture. It has a name.' },
    '5 PM':  { cups:5, focus:38, conf:60, anx:100, mug:'You commit directly to main. For the story.',               label:'5 PM — Committing to main. The tests are watching.' },
  };

  const hours = Object.keys(data);

  // Build buttons
  hours.forEach(h => {
    const btn = document.createElement('button');
    btn.className   = 'hour-btn';
    btn.textContent = h;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hour-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyHour(h);
    });
    hourGrid.appendChild(btn);
  });

  function applyHour(h) {
    const d = data[h];

    // Status text with fade
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.textContent = d.label;
      statusEl.style.opacity = '1';
    }, 200);

    // Mug label
    if (mugLabel) mugLabel.textContent = d.mug;

    // Meters
    mFocus.style.width = d.focus + '%';
    mConf.style.width  = d.conf  + '%';
    mAnx.style.width   = d.anx   + '%';
    vFocus.textContent = d.focus + '%';
    vConf.textContent  = d.conf  + '%';
    vAnx.textContent   = d.anx   + '%';

    // Mug fill — 142px total height, fill from bottom
    const mugHeight = 138;
    const fillHeight = Math.round((d.cups / 5) * mugHeight);
    const yStart     = 52 + mugHeight - fillHeight;
    coffeeLevel.setAttribute('y', yStart);
    coffeeLevel.setAttribute('height', fillHeight);

    // Foam
    if (coffeeFoam) {
      coffeeFoam.setAttribute('cy', yStart);
      coffeeFoam.setAttribute('opacity', fillHeight > 10 ? '0.85' : '0');
    }
  }
})();

/* ─────────────────────────────
   12. PHASE CARDS
───────────────────────────── */
window.setPhase = function(n) {
  document.querySelectorAll('.phase-card').forEach(c => c.classList.remove('active-phase'));
  const card = document.getElementById('p' + n);
  if (card) card.classList.add('active-phase');
};

/* ─────────────────────────────
   13. HAMBURGER / MOBILE MENU
───────────────────────────── */
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();

/* ─────────────────────────────
   14. SMOOTH HOVER TILT on sk-cards
───────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.sk-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const rx     = ((e.clientY - cy) / (rect.height / 2)) * 4;
      const ry     = ((e.clientX - cx) / (rect.width  / 2)) * -4;
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─────────────────────────────
   15. TYPEWRITER effect on terminal lines
───────────────────────────── */
(function initTerminal() {
  const termBody = document.querySelector('.term-body');
  if (!termBody) return;

  const lines = Array.from(termBody.querySelectorAll('.tl'));
  lines.forEach(l => { l.style.opacity = '0'; });

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      lines.forEach((line, i) => {
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transition = 'opacity 0.15s ease';
        }, i * 90);
      });
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(termBody);
})();

/* ─────────────────────────────
   16. COMMIT LOG — stagger rows on scroll
───────────────────────────── */
(function initCommitLog() {
  const rows = document.querySelectorAll('.clog-row');
  rows.forEach((row, i) => {
    row.style.opacity = '0';
    row.style.transform = 'translateX(-12px)';
    row.style.transition = `opacity .4s ease ${i * 0.07}s, transform .4s ease ${i * 0.07}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      rows.forEach(row => {
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
      });
      obs.disconnect();
    }
  }, { threshold: 0.2 });

  const log = document.querySelector('.commit-log');
  if (log) obs.observe(log);
})();

/* ─────────────────────────────
   17. SKILL CARD stagger reveal override
───────────────────────────── */
(function initSkillCards() {
  const cards = document.querySelectorAll('.sk-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  cards.forEach(c => obs.observe(c));
})();

/* ─────────────────────────────
   18. PHASE CARD — auto-cycle on scroll into view
───────────────────────────── */
(function initPhaseAuto() {
  const section = document.querySelector('.phases');
  if (!section) return;

  let cycleTimer = null;
  let current = 1;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      cycleTimer = setInterval(() => {
        current = (current % 3) + 1;
        window.setPhase(current);
      }, 2200);
    } else {
      clearInterval(cycleTimer);
    }
  }, { threshold: 0.4 });
  obs.observe(section);

  // Stop auto-cycling when user clicks
  document.querySelectorAll('.phase-card').forEach(card => {
    card.addEventListener('click', () => clearInterval(cycleTimer));
  });
})();

/* ─────────────────────────────
   19. FIN — counter animations
───────────────────────────── */
(function initFin() {
  const fin = document.getElementById('fin');
  if (!fin) return;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('#fin .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  obs.observe(fin);
})();

/* ─────────────────────────────
   20. ANCHOR SMOOTH SCROLL (for nav links)
───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
