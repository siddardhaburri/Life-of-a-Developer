/* ============================================================
   The Life of a Developer — script.js
   ============================================================ */

/* ─────────────────────────────────────────────────────────
   1. LOADER
   ───────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2400);
});

/* ─────────────────────────────────────────────────────────
   2. NAVIGATION
   ───────────────────────────────────────────────────────── */
const nav = document.getElementById('main-nav');

function toggleNav() {
  document.getElementById('nav-links').classList.toggle('open');
}

function closeNav() {
  document.getElementById('nav-links').classList.remove('open');
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

/* ─────────────────────────────────────────────────────────
   3. READING PROGRESS BAR
   ───────────────────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = Math.min(100, (scrollTop / docHeight) * 100);
  progressBar.style.width = pct + '%';
}

/* ─────────────────────────────────────────────────────────
   4. CHAPTER DOTS
   ───────────────────────────────────────────────────────── */
const sections = ['hero', 'hello', 'debug', 'coffee', 'deadline', 'enlighten'];
const dots     = document.querySelectorAll('.chapter-dot');

function updateDots() {
  const mid = window.scrollY + window.innerHeight / 2;
  let active = 0;
  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= mid) active = i;
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === active));
}

/* ─────────────────────────────────────────────────────────
   5. SCROLL-TRIGGERED REVEAL
   ───────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left');
const triggered = new Set();

function checkReveals() {
  const threshold = window.innerHeight * 0.88;
  revealEls.forEach(el => {
    if (el.getBoundingClientRect().top < threshold) {
      el.classList.add('visible');
      triggerSectionAnimations(el);
    }
  });
}

function triggerSectionAnimations(el) {
  /* Debug section — counters + stage bars */
  if (el.closest('#debug') && !triggered.has('debug')) {
    triggered.add('debug');
    animateCounters();
    animateBars('#stage-bars .coffee-bar-fill');
  }
  /* Coffee section — hour grid + chart */
  if (el.closest('#coffee') && !triggered.has('coffee')) {
    triggered.add('coffee');
    buildHourGrid();
    setTimeout(() => {
      const line = document.getElementById('chart-line');
      const fill = document.getElementById('chart-fill');
      if (line) line.classList.add('drawn');
      if (fill) fill.classList.add('drawn');
    }, 300);
  }
}

/* ─────────────────────────────────────────────────────────
   6. MASTER SCROLL HANDLER
   ───────────────────────────────────────────────────────── */
function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  updateProgress();
  updateDots();
  checkReveals();
  parallaxUpdate();
  animateAllSkillBars();
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ─────────────────────────────────────────────────────────
   7. ANIMATED COUNTERS  (Chapter 02 — The Bug)
   ───────────────────────────────────────────────────────── */
function animateCounter(id, target, suffix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step = Math.ceil(target / 60);
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString() + suffix;
    if (cur >= target) clearInterval(iv);
  }, 24);
}

function animateCounters() {
  animateCounter('count-hours',   847);
  animateCounter('count-console', 12483);
  animateCounter('count-turns',   94, '%');
}

/* ─────────────────────────────────────────────────────────
   8. ANIMATE PROGRESS BARS
   ───────────────────────────────────────────────────────── */
function animateBars(selector) {
  document.querySelectorAll(selector).forEach(bar => {
    const val = bar.dataset.val;
    if (val) setTimeout(() => { bar.style.width = val + '%'; }, 100);
  });
}

/* ─────────────────────────────────────────────────────────
   9. BUG ACCORDION  (Chapter 02 — The Bug)
   ───────────────────────────────────────────────────────── */
function toggleBug(el) {
  const detail = el.querySelector('.bug-detail');
  const isOpen = detail.classList.contains('open');

  /* Close all */
  document.querySelectorAll('.bug-detail.open').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.bug-entry.active').forEach(e => e.classList.remove('active'));

  /* Open clicked (if it was closed) */
  if (!isOpen) {
    detail.classList.add('open');
    el.classList.add('active');
  }
}

/* ─────────────────────────────────────────────────────────
   10. COFFEE HOUR GRID  (Chapter 03 — Caffeine)
   ───────────────────────────────────────────────────────── */
const coffeeData = [
  { time: '6am',  emoji: '☕', status: 'Pre-dawn ritual',    note: 'You are an early bird. Or you never slept.',               focus: 80, conf: 60, anx: 20 },
  { time: '7am',  emoji: '☕', status: 'Morning startup',     note: 'Emails, Slack, slowly becoming a person.',                 focus: 75, conf: 65, anx: 25 },
  { time: '8am',  emoji: '☕', status: 'Stand-up survivor',   note: 'You survived the stand-up. You lied about progress.',      focus: 82, conf: 70, anx: 30 },
  { time: '9am',  emoji: '☕', status: 'Peak productivity',   note: 'This is the window. Use it. Everything works.',            focus: 95, conf: 88, anx: 15 },
  { time: '10am', emoji: '☕', status: 'Deep focus',          note: 'Do not disturb. Headphones on. Zone achieved.',            focus: 98, conf: 90, anx: 12 },
  { time: '11am', emoji: '☕', status: 'The second cup',      note: 'Optional. Taken anyway. Justified completely.',            focus: 91, conf: 85, anx: 22 },
  { time: '12pm', emoji: '☕', status: 'Lunch debugging',     note: 'Eating with one hand, deploying with the other.',         focus: 72, conf: 75, anx: 40 },
  { time: '1pm',  emoji: '☕', status: 'Post-lunch lag',      note: 'The body wants sleep. The deadline does not care.',        focus: 55, conf: 60, anx: 50 },
  { time: '2pm',  emoji: '☕', status: 'Emergency cup',       note: 'This one is not for enjoyment. This is survival.',        focus: 78, conf: 65, anx: 62 },
  { time: '3pm',  emoji: '☕', status: 'Meeting gauntlet',    note: 'Three meetings. All could have been emails.',              focus: 45, conf: 55, anx: 70 },
  { time: '4pm',  emoji: '☕', status: 'Deadline panic',      note: 'Typing faster does not make code work faster. You type faster.', focus: 60, conf: 40, anx: 88 },
  { time: '5pm',  emoji: '☕', status: 'After-hours mode',    note: '5 PM is when the real work begins, apparently.',          focus: 55, conf: 35, anx: 95 },
];

function buildHourGrid() {
  const grid = document.getElementById('hour-grid');
  if (!grid || grid.children.length > 0) return;

  coffeeData.forEach((d, i) => {
    const cell     = document.createElement('div');
    cell.className = 'hour-cell';
    cell.innerHTML = `
      <div class="hour-cup" data-i="${i}">${d.emoji}</div>
      <div class="hour-label">${d.time}</div>`;
    cell.querySelector('.hour-cup').addEventListener('click', () => selectHour(i));
    grid.appendChild(cell);
  });
}

function selectHour(i) {
  const d = coffeeData[i];

  /* Highlight selected cup */
  document.querySelectorAll('.hour-cup').forEach((c, j) => {
    c.classList.toggle('caffeinated', j === i);
  });

  /* Update status card */
  document.getElementById('coffee-status').textContent = d.status;
  document.getElementById('coffee-note').textContent   = d.note;

  /* Update stat bars */
  setBar('focus-bar', 'focus-val', d.focus);
  setBar('conf-bar',  'conf-val',  d.conf);
  setBar('anx-bar',   'anx-val',   d.anx);
}

function setBar(barId, valId, val) {
  const bar   = document.getElementById(barId);
  const label = document.getElementById(valId);
  if (bar)   bar.style.width     = val + '%';
  if (label) label.textContent   = val + '%';
}

/* ─────────────────────────────────────────────────────────
   11. SKILL BARS  (Chapter 05 — Enlightenment)
   ───────────────────────────────────────────────────────── */
function animateSkill(el) {
  const bar = el.querySelector('.skill-bar-fill');
  if (bar && !bar.style.width) {
    bar.style.width = bar.dataset.val + '%';
  }
}

function animateAllSkillBars() {
  if (triggered.has('skills')) return;
  const sec = document.getElementById('enlighten');
  if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.9) {
    triggered.add('skills');
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      setTimeout(() => { bar.style.width = bar.dataset.val + '%'; }, 200);
    });
  }
}

/* ─────────────────────────────────────────────────────────
   12. PARALLAX  (Dark interlude between ch03 and ch04)
   ───────────────────────────────────────────────────────── */
function parallaxUpdate() {
  const el    = document.getElementById('parallax-bg');
  const quote = document.getElementById('parallax-quote');
  if (!el || !quote) return;
  const rect     = quote.getBoundingClientRect();
  const progress = -rect.top / (rect.height + window.innerHeight);
  el.style.transform = `translate(-50%, calc(-50% + ${progress * 60}px))`;
}

/* ─────────────────────────────────────────────────────────
   13. CUSTOM CURSOR FOLLOWER
   ───────────────────────────────────────────────────────── */
const cursor = document.getElementById('cursor-follower');
let cx = 0, cy = 0, mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.opacity = '1';
});

function animateCursor() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* Scale cursor on interactive targets */
document.querySelectorAll(
  'button, a, .bug-entry, .skill-item, .hour-cell, .dl-card, .insight-item'
).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(3)';
    cursor.style.opacity   = '0.4';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.opacity   = '1';
  });
});

/* ─────────────────────────────────────────────────────────
   14. INIT
   ───────────────────────────────────────────────────────── */
checkReveals();
updateDots();
