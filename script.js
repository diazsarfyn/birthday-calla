/* =====================================================
   ✏️ BAGIAN YANG HARUS KAMU UBAH — semuanya ada di sini
   ===================================================== */
const CONFIG = {
  PIN: '211025',   // ✏️ PIN rahasia, tepat 6 digit angka
  NAME: 'Calla',  // ✏️ Nama pacarmu (tampil di "Happy Birthday ...")
  WISH: 'Semoga semua harapanmu terkabul ✨' // ✏️ Teks setelah lilin ditiup
};

// ✏️ Pesan pendek untuk 5 bunga (jumlah bunga = jumlah baris di sini)
const FLOWERS = [
  'Happy birthday, Calla 🌸',
  'Semoga yang disemogakan, tersemogakan hehe 💗',
  'Terima kasih ya     udah sabar denganku  💖',
  'Aku bangga sama kamu ✨',
  'Aku sayang kamu, selalu 💖'
];

// ✏️ 6 foto polaroid. Ganti src dengan foto kamu, mis. 'foto/1.jpg' (simpan di folder yang sama)
const PHOTOS = [
  { src: 'rumah.jpeg', cap: 'Pertama ke Rumah' },
  { src: 'jadian.jpeg', cap: 'Mau jadian wkwk' },
  { src: 'photobox.jpeg', cap: 'Photobox pertama kita' },
  { src: 'tahun.jpeg', cap: 'Happy New Year' },
  { src: 'bukber.jpeg', cap: 'First time kita bukber' },
  { src: 'sma.jpeg', cap: 'Back to School' }
];

// ✏️ Timeline perjalanan cinta (boleh tambah/kurangi). d = tanggal, t = judul, x = cerita
const MOMENTS = [
  { d: '31 Januari 2025',  t: 'Pertama Kenalan',  x: 'Hari saat semuanya dimulai.' },
  { d: '31 Maret 2025',    t: 'Pertama Kita Ketemu',  x: 'Hari paling canggung.' },
  { d: '29 April 2025',      t: 'Kita Sempet Asing',           x: 'Aku gamau ngulangin hari ini.' },
  { d: '23 Agustus 2025', t: 'Kita Ketemu Lagi',  x: 'Kita dekat lagi dengan versi yang berbeda.' },
  { d: '21 Oktober 2025',      t: 'Jadian dan Ulang Tahun Kamu',    x: 'Hari dimana aku paling happy.' },
  { d: 'Hari Ini',      t: 'Ulang Tahun Kamu sekaligus Anniversary',    x: 'Dan aku masih jatuh cinta.' }
];

// ✏️ Lagu: taruh file mp3 di folder, mis. src: 'musik/lagu1.mp3'. (Link di bawah hanya contoh)
const SONGS = [
  { t: 'So High School', a: 'Taylor Swift', src: 'taylor.mp3' },
  { t: 'Aku Milikmu',   a: 'Dewa 19', src: 'dewa.mp3' },
  { t: 'Count On Me',  a: 'Bruno Mars', src: 'bruno.mp3' }
];

// ✏️ Pesan acak di toples (bebas tambah)
const JAR = [
  'Kamu adalah doa yang dikabulkan🤍',
  'Semoga semua impianmu tercapai yaa',
  'Jangan lupa makan dan istirahat ya sayang🍚',
  'Kamu lebih hebat dari yang kamu kira',
  'Aku selalu ada buat kamu 💞',
  'Makasih udah bertahan sama aku✨',
  'Hari ini, kamu yang paling istimewa🎂'
];

/* =====================================================
   LOGIKA (tidak perlu diubah)
   ===================================================== */
const $ = s => document.querySelector(s);
const make = (tag, cls, html) => { const e = document.createElement(tag); e.className = cls; e.innerHTML = html; return e; };
const pop = (el, txt) => { el.textContent = txt; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); };

/* --- Web Audio API (Sintesis Efek Suara / SFX) --- */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Auto-resume pada interaksi pertama (Desktop & Mobile)
const unlockAudio = () => {
  getAudioCtx();
};
['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
  window.addEventListener(evt, unlockAudio, { once: true, passive: true });
});

// 1. Keypad Lock Screen: Suara tap/click manis
function sfxTap() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(650, t);
  osc.frequency.exponentialRampToValueAtTime(320, t + 0.045);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05);
}

// 2. Password Salah: Suara buzz/error lembut saat getar
function sfxError() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  [0, 0.12].forEach(delay => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t + delay);
    osc.frequency.linearRampToValueAtTime(100, t + delay + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t + delay);

    gain.gain.setValueAtTime(0.15, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t + delay);
    osc.stop(t + delay + 0.11);
  });
}

// 3. Membuka Kado: Suara pop & sparkle berkilau
function sfxGift() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;

  // Pop
  const popOsc = ctx.createOscillator();
  const popGain = ctx.createGain();
  popOsc.type = 'sine';
  popOsc.frequency.setValueAtTime(800, t);
  popOsc.frequency.exponentialRampToValueAtTime(180, t + 0.09);
  popGain.gain.setValueAtTime(0.3, t);
  popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  popOsc.connect(popGain);
  popGain.connect(ctx.destination);
  popOsc.start(t);
  popOsc.stop(t + 0.1);

  // Sparkle chime cascade
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noteTime = t + 0.04 + idx * 0.055;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.001, noteTime);
    gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.45);
  });
}

// 4. Meniup Lilin: Suara puff/whoosh lembut
function sfxBlow() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const duration = 0.6;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.setValueAtTime(1.2, t);
  filter.frequency.setValueAtTime(900, t);
  filter.frequency.exponentialRampToValueAtTime(220, t + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.22, t + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(t);
  noise.stop(t + duration);
}

// 5. Petik Bunga: Suara chime/pop lembut bernada merdu
function sfxFlower(i = 0) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  const baseFreq = scale[i % scale.length];

  // Pop
  const popOsc = ctx.createOscillator();
  const popGain = ctx.createGain();
  popOsc.type = 'sine';
  popOsc.frequency.setValueAtTime(baseFreq * 0.8, t);
  popOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, t + 0.05);
  popGain.gain.setValueAtTime(0.12, t);
  popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  popOsc.connect(popGain);
  popGain.connect(ctx.destination);
  popOsc.start(t);
  popOsc.stop(t + 0.06);

  // Chime
  const chimeOsc = ctx.createOscillator();
  const chimeGain = ctx.createGain();
  chimeOsc.type = 'triangle';
  chimeOsc.frequency.setValueAtTime(baseFreq, t);
  chimeGain.gain.setValueAtTime(0.001, t);
  chimeGain.gain.linearRampToValueAtTime(0.18, t + 0.02);
  chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  chimeOsc.connect(chimeGain);
  chimeGain.connect(ctx.destination);
  chimeOsc.start(t);
  chimeOsc.stop(t + 0.48);

  // Shimmer overtone
  const harmOsc = ctx.createOscillator();
  const harmGain = ctx.createGain();
  harmOsc.type = 'sine';
  harmOsc.frequency.setValueAtTime(baseFreq * 2, t);
  harmGain.gain.setValueAtTime(0.001, t);
  harmGain.gain.linearRampToValueAtTime(0.08, t + 0.02);
  harmGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  harmOsc.connect(harmGain);
  harmGain.connect(ctx.destination);
  harmOsc.start(t);
  harmOsc.stop(t + 0.38);
}

// 6. Membuka Polaroid: Suara snap/click kamera & kertas foto
function sfxPolaroid() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  [0, 0.045].forEach((delay, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = idx === 0 ? 'triangle' : 'sine';
    const startFreq = idx === 0 ? 1200 : 1800;
    osc.frequency.setValueAtTime(startFreq, t + delay);
    osc.frequency.exponentialRampToValueAtTime(300, t + delay + 0.03);
    const vol = idx === 0 ? 0.12 : 0.16;
    gain.gain.setValueAtTime(vol, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t + delay);
    osc.stop(t + delay + 0.04);
  });
}

// 7. Mengocok Toples: Suara shake/rattle kertas & toples
function sfxShake() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const times = [0, 0.11, 0.22, 0.33];
  times.forEach((offset, idx) => {
    const clickTime = t + offset;
    const dur = 0.06;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200 + (idx % 2) * 500, clickTime);
    filter.Q.setValueAtTime(3.0, clickTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.14, clickTime);
    gain.gain.exponentialRampToValueAtTime(0.001, clickTime + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(clickTime);
    noise.stop(clickTime + dur);

    const bead = ctx.createOscillator();
    const beadGain = ctx.createGain();
    bead.type = 'sine';
    bead.frequency.setValueAtTime(700 + Math.random() * 300, clickTime);
    beadGain.gain.setValueAtTime(0.04, clickTime);
    beadGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.05);
    bead.connect(beadGain);
    beadGain.connect(ctx.destination);
    bead.start(clickTime);
    bead.stop(clickTime + 0.06);
  });
}

/* --- Konfeti & kelopak bunga (canvas) --- */
const cv = $('#confetti'), cx = cv.getContext('2d'), COLORS = ['#ff7aa8', '#e0517f', '#ffd86b', '#fff0f3', '#c2185b'];
let P = [];
const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
fit(); addEventListener('resize', fit);

function burst(n = 120, x = innerWidth / 2, y = innerHeight / 2) {
  for (let i = 0; i < n; i++) P.push({
    x, y, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 3,
    s: Math.random() * 8 + 6, r: Math.random() * 6, c: COLORS[i % 5], petal: i % 6 === 0
  });
  if (P.length === n) draw();
}
function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  P = P.filter(p => p.y < cv.height + 40);
  for (const p of P) {
    p.vy += .25; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += .08;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
    if (p.petal) { cx.font = p.s * 2 + 'px serif'; cx.fillText('🌸', 0, 0); }
    else { cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); }
    cx.restore();
  }
  if (P.length) requestAnimationFrame(draw);
}

/* --- Transisi antar layar (fade out → tampilkan berikutnya) --- */
function next(from, to, cb) {
  from.classList.add('fade');
  setTimeout(() => { from.classList.add('hidden'); to.classList.remove('hidden'); if (cb) cb(); }, 800);
}

/* --- 1. Lock screen --- */
let pin = '', busy = false;
const dots = $('#dots'), kp = $('#keypad');
'123456789 0⌫'.split('').forEach(k => {
  if (k === ' ') return kp.append(make('span', '', ''));
  const b = make('button', '', k); b.onclick = () => press(k); kp.append(b);
});
function paint() { [...dots.children].forEach((d, i) => d.classList.toggle('on', i < pin.length)); }
function press(k) {
  if (busy) return;
  sfxTap();
  if (k === '⌫') pin = pin.slice(0, -1); else if (pin.length < 6) pin += k;
  paint();
  if (pin.length < 6) return;
  busy = true;
  if (pin === CONFIG.PIN) return next($('#lock'), $('#gift'));
  sfxError();
  dots.classList.add('shake');                       // PIN salah → getar
  setTimeout(() => { dots.classList.remove('shake'); pin = ''; paint(); busy = false; }, 600);
}
addEventListener('keydown', e => {
  if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('⌫');
});

/* --- 2. Kado --- */
$('#giftbox').onclick = function () {
  if (this.classList.contains('open')) return;
  sfxGift();
  this.classList.add('open'); burst(160);
  setTimeout(() => next($('#gift'), $('#main'), () => { document.body.classList.remove('locked'); scrollTo(0, 0); }), 1800);
};

/* --- 3. Hero & tiup lilin --- */
$('#name').textContent = CONFIG.NAME;
document.title = 'Happy Birthday ' + CONFIG.NAME + ' 💖';
$('#blow').onclick = function () {
  this.disabled = true;
  sfxBlow();
  $('.cake').classList.add('out');                   // api padam
  $('#dim').classList.add('on');                     // layar meredup
  setTimeout(() => { burst(180); pop($('#wish'), CONFIG.WISH); }, 900);
  setTimeout(() => $('#dim').classList.remove('on'), 2800);
};

/* --- 5. Buket bunga --- */
FLOWERS.forEach((m, i) => {
  const f = make('div', 'fl', '<span class="head"></span>');
  f.style.transform = `rotate(${(i - (FLOWERS.length - 1) / 2) * 9}deg)`;
  f.onclick = () => {
    if (!f.classList.contains('open')) {
      sfxFlower(i);
      const r = f.getBoundingClientRect(); burst(14, r.left + 23, r.top + 20);
    }
    f.classList.add('open'); pop($('#flowerMsg'), m);
  };
  $('#bouquet').append(f);
});

/* --- 6. Galeri polaroid --- */
PHOTOS.forEach(p => {
  const d = make('div', 'pol', `<div class="ph"><img src="${p.src}" alt="" loading="lazy"></div><p>${p.cap}</p>`);
  d.onclick = () => {
    if (!d.classList.contains('show')) sfxPolaroid();
    d.classList.add('show');
  };
  $('#gallery').append(d);
});

/* --- 7. Timeline --- */
MOMENTS.forEach(m => $('#timeline').append(make('div', 'ti', `<small>${m.d}</small><h3>${m.t}</h3><p>${m.x}</p>`)));

/* --- Animasi muncul saat di-scroll (surat, bunga, galeri, timeline, dll.) --- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .1 });
document.querySelectorAll('.reveal,.ti').forEach(el => io.observe(el));

/* --- 8. Music player --- */
const au = $('#aud'), pl = $('#plist'), disc = $('.disc');
let cur = 0;
SONGS.forEach((s, i) => {
  const li = make('li', '', `<span>${s.t}</span><small>${s.a}</small>`);
  li.onclick = () => load(i, true); pl.append(li);
});
function load(i, play) {
  cur = i; au.src = SONGS[i].src; $('#np').textContent = '♪ ' + SONGS[i].t + ' — ' + SONGS[i].a;
  [...pl.children].forEach((l, j) => l.classList.toggle('on', j === i));
  if (play) au.play().catch(() => {});
}
$('#play').onclick = () => au.play().catch(() => {});
$('#pause').onclick = () => au.pause();
au.onplay = () => disc.classList.add('spin');
au.onpause = () => disc.classList.remove('spin');
au.onended = () => load((cur + 1) % SONGS.length, true);
au.ontimeupdate = () => { $('#bar').style.width = (au.currentTime / au.duration * 100 || 0) + '%'; };
load(0);

/* --- 9. Toples pesan --- */
let last = -1;
$('#shake').onclick = () => {
  sfxShake();
  const j = $('#jar'); j.classList.add('shake');
  setTimeout(() => {
    j.classList.remove('shake');
    let i; do { i = Math.floor(Math.random() * JAR.length); } while (i === last && JAR.length > 1);
    last = i; pop($('#jarMsg'), JAR[i]);
  }, 750);
};
