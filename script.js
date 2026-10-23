// ===== INTRO =====
const intro = document.getElementById('intro');
document.body.style.overflow = 'hidden';
document.getElementById('enterBtn').addEventListener('click', () => {
  intro.classList.add('hide');
  document.body.style.overflow = '';
  setTimeout(() => { intro.style.display = 'none'; startPops(); }, 900);
  burstConfetti(120);
});

// ===== SCROLL REVEAL =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== FLOATING BACKGROUND SHAPES =====
const shapes = document.getElementById('shapes');
const icons = ['⭐', '💥', '⚡', '✨', '💫', '🎈', '❤️', '🔥'];
for (let i = 0; i < 18; i++) {
  const s = document.createElement('span');
  s.className = 'shape';
  s.textContent = icons[i % icons.length];
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 100 + '%';
  s.style.fontSize = 1.2 + Math.random() * 2.2 + 'rem';
  s.style.animationDuration = 4 + Math.random() * 6 + 's';
  s.style.animationDelay = -Math.random() * 6 + 's';
  shapes.appendChild(s);
}

// ===== CUSTOM CURSOR + SPARKLE TRAIL =====
const dot = document.getElementById('cursorDot');
let lastTrail = 0;
window.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
  const now = Date.now();
  if (now - lastTrail > 70) {
    lastTrail = now;
    const t = document.createElement('span');
    t.className = 'trail';
    t.textContent = ['✨', '⭐', '💥', '⚡'][Math.floor(Math.random() * 4)];
    t.style.left = e.clientX + 'px';
    t.style.top = e.clientY + 'px';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 900);
  }
});
document.querySelectorAll('a, button, img').forEach(el => {
  el.addEventListener('mouseenter', () => dot.classList.add('big'));
  el.addEventListener('mouseleave', () => dot.classList.remove('big'));
});

// ===== 3D TILT ON HOVER =====
document.querySelectorAll('.tilt, .frame').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.04)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// ===== LIGHTBOX =====
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
document.querySelectorAll('img[data-label]').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbCap.textContent = img.dataset.label || '';
    lb.classList.add('open');
  });
});
const closeLb = () => lb.classList.remove('open');
document.getElementById('lbClose').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });

// ===== RANDOM POP-UP PHOTOS =====
const popLayer = document.getElementById('popLayer');
function startPops() {
  const pool = [...document.querySelectorAll('img[data-label]')];
  if (!pool.length) return;
  setInterval(() => {
    const src = pool[Math.floor(Math.random() * pool.length)];
    if (src.classList.contains('missing')) return;
    const p = document.createElement('div');
    p.className = 'pop-photo';
    p.innerHTML = `<img src="${src.src}" alt=""><span>${src.dataset.label}</span>`;
    const side = Math.random() < 0.5;
    p.style.left = side ? (2 + Math.random() * 10) + 'vw' : 'auto';
    p.style.right = side ? 'auto' : (2 + Math.random() * 10) + 'vw';
    p.style.top = (12 + Math.random() * 60) + 'vh';
    popLayer.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }, 7000);
}

// ===== BROKEN IMAGE FALLBACK =====
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => img.classList.add('missing'));
});

// ===== CONFETTI =====
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let pieces = [];
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);
const colors = ['#ffd60a', '#ff3d8b', '#1ea7ff', '#2bd96b', '#7b2ff7', '#ff7a00'];

function burstConfetti(n = 150) {
  for (let i = 0; i < n; i++) {
    pieces.push({
      x: innerWidth / 2, y: innerHeight / 2,
      vx: (Math.random() - 0.5) * 20, vy: Math.random() * -18 - 4,
      s: 6 + Math.random() * 8, c: colors[Math.floor(Math.random() * colors.length)],
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 160
    });
  }
  if (pieces.length === n) animate();
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach(p => {
    p.vy += 0.5; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
    ctx.restore();
  });
  pieces = pieces.filter(p => p.life > 0 && p.y < innerHeight + 40);
  if (pieces.length) requestAnimationFrame(animate);
  else ctx.clearRect(0, 0, canvas.width, canvas.height);
}
document.getElementById('confettiBtn').addEventListener('click', () => burstConfetti(220));

// Click anywhere = tiny POW
document.addEventListener('click', e => {
  if (e.target.closest('#intro')) return;
  const w = document.createElement('span');
  w.className = 'trail';
  w.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;font-family:Bangers;font-size:2rem;color:#ff3d8b;-webkit-text-stroke:1px #14111f`;
  w.textContent = ['POW!', 'BAM!', 'ZAP!', 'BOOM!'][Math.floor(Math.random() * 4)];
  document.body.appendChild(w);
  setTimeout(() => w.remove(), 900);
});
