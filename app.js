// ================= APPLICATION STATE =================
let CONFIG = {};
let isPreviewMode = false;
let currentSlide = 0;
let poppedBalloons = 0;
let totalBalloons = 6;
let puzzleTiles = [];
let puzzleMoves = 0;
let isPuzzleSolved = false;
let isAudioInitialized = false;
let isScratchFinished = false;
let wishToastTimeout = null;
let typingInterval = null;

// Audio context and objects
let audioCtx = null;
let globalAudioEl = null; // HTML5 Audio element for background music (bypasses CORS restrictions)
let currentMusicUrl = '';
let musicFileDataUrl = ''; // Holds local uploaded audio base64
let puzzleImgFileDataUrl = ''; // Holds local uploaded puzzle image base64
let scratchImgFileDataUrl = ''; // Holds local uploaded scratch card underneath image base64
let creatorPolaroids = []; // Dynamic memories list in Creator Mode
let creatorBalloons = []; // Dynamic wishes list in Creator Mode

// Particle animation variables
let particleCanvas = null;
let particleCtx = null;
let particlesList = [];
let particleAnimFrame = null;

// Presets Config
const THEMES = {
  'theme-ethereal': { name: 'Ethereal Violet', class: 'theme-ethereal', particles: 'stars' },
  'theme-midnight': { name: 'Midnight Love', class: 'theme-midnight', particles: 'hearts' },
  'theme-rose': { name: 'Rose Garden', class: 'theme-rose', particles: 'petals' },
  'theme-sunset': { name: 'Sunset Glow', class: 'theme-sunset', particles: 'sparkles' }
};const CAKE_STYLES = {
  'cake-style-1': {
    name: 'Strawberry Vanilla 🍓',
    primary: '#fff0f5',
    dark: '#fbc02d',
    frosting: '#ff4081'
  },
  'cake-style-2': {
    name: 'Chocolate Fudge 🍫',
    primary: '#4e342e',
    dark: '#271815',
    frosting: '#6d4c41'
  },
  'cake-style-3': {
    name: 'Blueberry Velvet 🫐',
    primary: '#e0f7fa',
    dark: '#00bcd4',
    frosting: '#29b6f6'
  },
  'cake-style-4': {
    name: 'Lavender Magic 🔮',
    primary: '#f3e5f5',
    dark: '#7b1fa2',
    frosting: '#ab47bc'
  }
};

const MUSIC_PRESETS = [
  { name: 'Happy Birthday', url: './assets/music/birthday.mp3' },
  { name: 'Romantic Acoustic', url: './assets/music/romantic.mp3' },
  { name: 'Gehra Hua', url: './assets/music/gehra.mp3' },
  { name: 'Comedy', url: './assets/music/comedy.mp3' },
  { name: 'Bandhu', url: './assets/music/bandhu.mp3' }
];

const DEFAULT_IMAGES = {
  polaroids: [
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400', caption: "The way you smile lights up my whole world ✨" },
    { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400', caption: "To all our late night giggles and endless chats 💖" },
    { url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400', caption: "Floating on cloud nine whenever you are near ☁️" },
    { url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400', caption: "Every single day with you is a celebration 🎉" },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400', caption: "My absolute favorite person in the entire universe 🪐" },
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400', caption: "Here's to making infinite more memories together! 🥂" }
  ],
  puzzle: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=500',
  scratch: 'https://images.unsplash.com/photo-1486427944299-d1955d23e317?q=80&w=500'
};

const DEFAULT_CONFIG = {
  theme: 'theme-ethereal',
  particles: 'stars',
  giftStyle: 'box-style-1',
  cakeStyle: 'cake-style-1',
  giftMessage: 'You are the sweetest, most amazing person in my life! ❤️',
  giftSubmessage: 'Tap below to see what else I planned for you...',
  musicUrl: MUSIC_PRESETS[0].url,
  lockCode: '1111',
  lockHint: 'Make a wish... (Always happens at 11:11!)',
  curtainClosedMsg: 'Open the envelope of surprises',
  loadingMsgs: [
    'Calibrating cuteness levels... 🤖',
    'Loading cute candid memories... 📸',
    'Inflating birthday balloons... 🎈',
    'Loading virtual cake... 🎂',
    'Ready for the magic! ✨'
  ],
  curtainsTitle: 'Happy Birthday, Bestie! 🎉',
  curtainsSubtitle: 'I spent hours building this little digital sanctuary for you. I hope it brings a smile to your face!',
  recipientName: 'Vani',
  recipientDob: '2005-07-17T11:11',
  recipientAge: '21',
  cakeGreeting: 'May your day be filled with endless laughter, sweet treats, and magic!',
  polaroids: [...DEFAULT_IMAGES.polaroids],
  balloonWishes: [
    'I wish you infinite happiness and endless joy! 🌟',
    'May you achieve every single goal you set for yourself! 🎯',
    'I wish for your laughter to never, ever fade away. 😊',
    'May we go on countless adventures and travel the world! ✈️',
    'I wish for you to always stay the kind, beautiful soul you are. 💕',
    'And my biggest wish is to celebrate all your birthdays together! 👫❤️'
  ],
  puzzleImg: DEFAULT_IMAGES.puzzle,
  scratchImg: DEFAULT_IMAGES.scratch,
  scratchName: 'My Best Friend',
  letterText: "Dearest bestie,\n\nHappy Birthday! Today is a celebration of the day you came into this world and made it an infinitely brighter, warmer, and more beautiful place. 🥳🎉\n\nI wanted to create something special, something that is uniquely ours, to show you how much you mean to me. From our deep talks to the silly inside jokes and midnight chats, every memory we share is etched in my heart! 💖\n\nThank you for being the absolute best friend I could ever ask for—for your support, your endless laughter, and the way you bring sunshine into my life. I hope this birthday brings you as much joy as you give to everyone around you. 🌟\n\nI hope you loved this little surprise deck as much as I loved building it for you. May this year be filled with epic adventures, dreams come true, and endless laughter! 👫✨"
};

// Reusable image downscaler and compressor to fit custom uploads in URL
function compressImage(file, maxDim, quality, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ================= WEB AUDIO SYNTHESIS SFX =================
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playClickSound() {
  initAudioContext();
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playPopSound() {
  initAudioContext();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.15);
  
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

function playBlastSound() {
  initAudioContext();
  if (!audioCtx) return;

  const bufferSize = audioCtx.sampleRate * 0.4;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.4);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noise.start();
  noise.stop(audioCtx.currentTime + 0.4);

  // Synthesize a high ring pitch
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.connect(oscGain);
  oscGain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.35);
  oscGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.35);
}

function playTypewriterSound() {
  initAudioContext();
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);
}

function playSuccessSound() {
  initAudioContext();
  if (!audioCtx) return;
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.08);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime + index * 0.08);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.08 + 0.25);
    
    osc.start(audioCtx.currentTime + index * 0.08);
    osc.stop(audioCtx.currentTime + index * 0.08 + 0.25);
  });
}

function playWhooshSound() {
  initAudioContext();
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

function playWindSound() {
  initAudioContext();
  if (!audioCtx) return;
  
  const bufferSize = audioCtx.sampleRate * 0.8;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.8);
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noise.start();
  noise.stop(audioCtx.currentTime + 0.8);
}


// ================= MUSIC CONTROLLER =================
function convertBase64ToBlobUrl(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return dataUrl;
  
  try {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    const blob = new Blob([uInt8Array], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error("Failed to convert base64 to blob URL:", e);
    return dataUrl; // fallback
  }
}

function resolveDirectAudioUrl(url) {
  if (!url) return '';
  
  // Google Drive share link to direct download stream
  if (url.includes('drive.google.com')) {
    let fileId = '';
    const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD) {
      fileId = matchD[1];
    } else {
      const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchOpen) fileId = matchOpen[1];
    }
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }

  // Dropbox preview link to raw download stream
  if (url.includes('dropbox.com')) {
    if (url.includes('dl=0')) {
      return url.replace('dl=0', 'raw=1');
    } else if (!url.includes('raw=1')) {
      return url + (url.includes('?') ? '&' : '?') + 'raw=1';
    }
  }

  return url;
}

function startBackgroundMusic(url) {
  let playUrl = url;
  if (url && url.startsWith('data:')) {
    playUrl = convertBase64ToBlobUrl(url);
  } else {
    playUrl = resolveDirectAudioUrl(url);
  }

  if (globalAudioEl) {
    if (currentMusicUrl === playUrl) return; // already playing
    stopBackgroundMusic();
  }

  currentMusicUrl = playUrl;
  
  globalAudioEl = new Audio();
  globalAudioEl.src = playUrl;
  globalAudioEl.loop = true;
  globalAudioEl.volume = 0.4;
  
  globalAudioEl.play().catch(e => {
    console.log("Audio autoplay blocked or failed. Waiting for user interaction to resume.", e);
  });
  
  const audioBtn = document.getElementById('music-toggle-btn');
  if (audioBtn) {
    audioBtn.classList.remove('muted');
    audioBtn.classList.add('playing');
  }
}

function stopBackgroundMusic() {
  if (globalAudioEl) {
    try {
      globalAudioEl.pause();
    } catch(e) {}
    globalAudioEl = null;
  }
}

function toggleMute() {
  const audioBtn = document.getElementById('music-toggle-btn');
  if (!audioBtn) return;

  if (globalAudioEl) {
    if (globalAudioEl.paused) {
      globalAudioEl.play().catch(console.error);
      audioBtn.classList.remove('muted');
      audioBtn.classList.add('playing');
    } else {
      globalAudioEl.pause();
      audioBtn.classList.add('muted');
      audioBtn.classList.remove('playing');
    }
  } else {
    // If audio failed to load or initiate, try to trigger it again
    startBackgroundMusic(CONFIG.musicUrl || DEFAULT_CONFIG.musicUrl);
  }
}


// ================= PARTICLE ENGINE (CANVAS) =================
function initParticleSystem(particleType) {
  particleCanvas = document.getElementById('particles-canvas');
  if (!particleCanvas) return;

  particleCtx = particleCanvas.getContext('2d');
  resizeParticlesCanvas();
  window.addEventListener('resize', resizeParticlesCanvas);

  particlesList = [];
  if (particleAnimFrame) {
    cancelAnimationFrame(particleAnimFrame);
  }

  // Generate initial particles
  const count = 40;
  for (let i = 0; i < count; i++) {
    particlesList.push(createParticle(particleType, true));
  }

  animateParticles(particleType);
}

function resizeParticlesCanvas() {
  if (particleCanvas) {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }
}

function createParticle(type, randomY = false) {
  const w = particleCanvas ? particleCanvas.width : window.innerWidth;
  const h = particleCanvas ? particleCanvas.height : window.innerHeight;

  // Calculate size and speed based on particle type for optimal visual presence
  let size = 0;
  let speedY = 0;
  if (type === 'petals') {
    size = Math.random() * 12 + 12; // 12px to 24px
    speedY = -(Math.random() * 1.0 + 0.5);
  } else if (type === 'hearts') {
    size = Math.random() * 16 + 12; // 12px to 28px
    speedY = -(Math.random() * 1.5 + 0.6);
  } else if (type === 'stars') {
    size = Math.random() * 14 + 10; // 10px to 24px
    speedY = -(Math.random() * 1.2 + 0.5);
  } else { // sparkles
    size = Math.random() * 8 + 4; // 4px to 12px
    speedY = -(Math.random() * 1.8 + 0.8);
  }

  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + 20,
    size: size,
    speedY: speedY,
    speedX: Math.random() * 1 - 0.5,
    alpha: Math.random() * 0.5 + 0.3,
    color: getParticleColor(type),
    rotation: Math.random() * 360,
    rotSpeed: Math.random() * 2 - 1,
    type: type
  };
}

function getParticleColor(type) {
  const currentTheme = CONFIG.theme || 'theme-ethereal';
  
  if (type === 'stars') {
    return `rgba(255, 255, 255, ${Math.random()})`;
  } else if (type === 'hearts') {
    const colors = ['#ff3e6c', '#ff5252', '#00e5ff', '#ff66b2'];
    return colors[Math.floor(Math.random() * colors.length)];
  } else if (type === 'petals') {
    const colors = ['#ffccd5', '#ffb3c1', '#ff85a1', '#f72585'];
    return colors[Math.floor(Math.random() * colors.length)];
  } else {
    // sparkles
    const colors = ['#ffd700', '#ffa500', '#ff844b', '#ffffff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

function animateParticles(type) {
  if (!particleCtx || !particleCanvas) return;

  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  
  for (let i = 0; i < particlesList.length; i++) {
    const p = particlesList[i];
    
    // Update position
    if (p.type === 'petals') {
      p.y -= p.speedY * 0.8; // petals drift down
      p.speedY = Math.abs(p.speedY);
    } else {
      p.y += p.speedY; // default upward drift
    }
    p.x += p.speedX + Math.sin(p.y / 30) * 0.3; // drift wave
    p.rotation += p.rotSpeed;

    // Draw particle
    particleCtx.save();
    particleCtx.translate(p.x, p.y);
    particleCtx.rotate((p.rotation * Math.PI) / 180);
    particleCtx.globalAlpha = p.alpha;
    particleCtx.fillStyle = p.color;

    if (p.type === 'stars') {
      // draw small star
      drawStar(particleCtx, 0, 0, 5, p.size, p.size / 2);
    } else if (p.type === 'hearts') {
      // draw heart
      drawHeart(particleCtx, -p.size/2, -p.size/2, p.size);
    } else if (p.type === 'petals') {
      // draw leaf/petal oval
      drawPetal(particleCtx, -p.size/2, -p.size/2, p.size);
    } else {
      // sparkles / circles
      particleCtx.beginPath();
      particleCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      particleCtx.fill();
    }

    particleCtx.restore();

    // Reset particle if it leaves screen
    if (p.type === 'petals') {
      if (p.y > particleCanvas.height + 20) {
        particlesList[i] = createParticle(type, false);
        particlesList[i].y = -20; // start at top
      }
    } else {
      if (p.y < -20) {
        particlesList[i] = createParticle(type, false);
      }
    }
  }

  particleAnimFrame = requestAnimationFrame(() => animateParticles(type));
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x + size/2, y + size/5);
  ctx.bezierCurveTo(x + size/2, y, x + size/10, y, x, y + size/3);
  ctx.bezierCurveTo(x, y + size*0.6, x + size*0.35, y + size*0.8, x + size/2, y + size);
  ctx.bezierCurveTo(x + size*0.65, y + size*0.8, x + size, y + size*0.6, x + size, y + size/3);
  ctx.bezierCurveTo(x + size, y, x + size/2, y, x + size/2, y + size/5);
  ctx.closePath();
  ctx.fill();
}

function drawPetal(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x + size/2, y);
  ctx.quadraticCurveTo(x + size, y + size/3, x + size/2, y + size);
  ctx.quadraticCurveTo(x, y + size/3, x + size/2, y);
  ctx.closePath();
  ctx.fill();
}


// ================= CREATOR MODE LOGIC =================
function initCreatorMode() {
  const form = document.getElementById('creator-form');
  if (!form) return;

  // Render initial gift box preview
  renderCreatorGiftPreview(DEFAULT_CONFIG.giftStyle);

  // Initialize dynamic arrays
  creatorPolaroids = [...DEFAULT_CONFIG.polaroids];
  creatorBalloons = [...DEFAULT_CONFIG.balloonWishes];

  // Render dynamic segments
  renderCreatorPolaroids();
  renderCreatorBalloons();

  // 1. Theme Picker Generation
  const themePicker = document.getElementById('theme-picker');
  themePicker.innerHTML = '';
  Object.keys(THEMES).forEach((key, index) => {
    const theme = THEMES[key];
    const item = document.createElement('div');
    item.className = `picker-item ${index === 0 ? 'active' : ''}`;
    item.dataset.value = key;
    item.innerHTML = `
      <div class="color-preview" style="background: ${getThemeGradientPreview(key)}"></div>
      <span>${theme.name}</span>
    `;
    item.addEventListener('click', () => {
      selectThemeOption(key);
      // Immediately preview theme background in creator mode
      document.body.className = theme.class;
    });
    themePicker.appendChild(item);
  });

  // 2. Background Animation Picker
  const bgPicker = document.getElementById('bg-picker');
  bgPicker.innerHTML = `
    <div class="picker-item active" data-value="stars"><i class="fa-solid fa-star"></i><span>Stars</span></div>
    <div class="picker-item" data-value="hearts"><i class="fa-solid fa-heart"></i><span>Hearts</span></div>
    <div class="picker-item" data-value="petals"><i class="fa-solid fa-spa"></i><span>Rose Petals</span></div>
    <div class="picker-item" data-value="sparkles"><i class="fa-solid fa-wand-magic-sparkles"></i><span>Sparkles</span></div>
  `;
  bgPicker.querySelectorAll('.picker-item').forEach(item => {
    item.addEventListener('click', () => {
      bgPicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Live Preview background particles in Creator Mode immediately!
      const type = item.dataset.value;
      initParticleSystem(type);
      playClickSound();
    });
  });

  // Trigger initial particles animation in Creator mode background!
  initParticleSystem('stars');

  // 3. Gift Box Picker
  const giftPicker = document.getElementById('gift-picker');
  giftPicker.innerHTML = `
    <div class="picker-item active" data-value="box-style-1"><i class="fa-solid fa-box"></i><span>Red Gold</span></div>
    <div class="picker-item" data-value="box-style-2"><i class="fa-solid fa-box-open"></i><span>Purple Cyan</span></div>
    <div class="picker-item" data-value="box-style-3"><i class="fa-solid fa-gift"></i><span>Green Orange</span></div>
    <div class="picker-item" data-value="box-style-4"><i class="fa-solid fa-cube"></i><span>Orange White</span></div>
  `;
  giftPicker.querySelectorAll('.picker-item').forEach(item => {
    item.addEventListener('click', () => {
      giftPicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const giftStyle = item.dataset.value;
      renderCreatorGiftPreview(giftStyle);
      playClickSound();
    });
  });

  // 3b. Cake Design Picker
  const cakePicker = document.getElementById('cake-style-picker');
  if (cakePicker) {
    cakePicker.innerHTML = '';
    Object.keys(CAKE_STYLES).forEach((key, index) => {
      const style = CAKE_STYLES[key];
      const item = document.createElement('div');
      item.className = `picker-item ${index === 0 ? 'active' : ''}`;
      item.dataset.value = key;
      item.innerHTML = `
        <div class="color-preview" style="background: linear-gradient(135deg, ${style.frosting}, ${style.primary}); border-radius: 50%; width: 24px; height: 24px; margin-right: 8px;"></div>
        <span>${style.name}</span>
      `;
      item.addEventListener('click', () => {
        cakePicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        renderCreatorCakePreview(key);
        playClickSound();
      });
      cakePicker.appendChild(item);
    });
    // Render initial cake preview
    renderCreatorCakePreview(DEFAULT_CONFIG.cakeStyle);
  }

  // 4. Music Picker
  const musicPicker = document.getElementById('music-picker');
  musicPicker.innerHTML = '';
  MUSIC_PRESETS.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = `picker-item ${index === 0 ? 'active' : ''}`;
    item.dataset.value = track.url;
    item.innerHTML = `<i class="fa-solid fa-circle-play"></i><span>${track.name}</span>`;
    item.addEventListener('click', () => {
      musicPicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      document.getElementById('music-custom-url').value = ''; // clear custom
      document.getElementById('music-file-input').value = ''; // clear file
      musicFileDataUrl = '';
      
      const status = document.getElementById('music-upload-status');
      if (status) {
        status.style.display = 'block';
        status.innerHTML = `<i class="fa-solid fa-circle-check"></i> Preset Loaded: <strong>${track.name}</strong>`;
      }
      
      // Start playing the music preset loop in background immediately so creator can hear it
      startBackgroundMusic(track.url);
    });
    musicPicker.appendChild(item);
  });

  // Add "Other" picker item
  const otherMusicItem = document.createElement('div');
  otherMusicItem.className = 'picker-item';
  otherMusicItem.dataset.value = 'custom';
  otherMusicItem.id = 'picker-item-other-music';
  otherMusicItem.innerHTML = `<i class="fa-solid fa-sliders"></i><span>Other (Custom)</span>`;
  otherMusicItem.addEventListener('click', () => {
    musicPicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
    otherMusicItem.classList.add('active');
    document.getElementById('music-file-input').focus();
    playClickSound();
  });
  musicPicker.appendChild(otherMusicItem);

  // Helper to add a custom song card to the selection list dynamically
  function addCustomMusicCard(name, playUrl, saveUrl) {
    // Remove any previously added custom cards to keep the list clean
    const existing = musicPicker.querySelector('.custom-added-card');
    if (existing) {
      existing.remove();
    }

    const item = document.createElement('div');
    item.className = 'picker-item active custom-added-card';
    item.dataset.playUrl = playUrl;
    item.dataset.saveUrl = saveUrl || '';
    item.dataset.value = saveUrl || playUrl; // Define value parameter for JSON builder compatibility
    item.innerHTML = `<i class="fa-solid fa-music"></i><span>${name}</span>`;
    
    item.addEventListener('click', () => {
      musicPicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // If it has saveUrl (which is the base64 string for file uploads), update musicFileDataUrl
      if (item.dataset.saveUrl) {
        musicFileDataUrl = item.dataset.saveUrl;
        document.getElementById('music-custom-url').value = '';
      } else {
        // It's a custom URL link, so clear base64 and set custom URL
        musicFileDataUrl = '';
        document.getElementById('music-custom-url').value = item.dataset.playUrl;
      }
      
      const status = document.getElementById('music-upload-status');
      if (status) {
        status.style.display = 'block';
        status.innerHTML = `<i class="fa-solid fa-circle-check"></i> Custom Song Selected: <strong>${name}</strong>`;
      }
      
      startBackgroundMusic(item.dataset.playUrl);
    });

    // Insert before the "Other" card
    musicPicker.insertBefore(item, otherMusicItem);
  }

  // Set initial status to default preset
  const initialStatus = document.getElementById('music-upload-status');
  if (initialStatus) {
    initialStatus.style.display = 'block';
    initialStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Preset Loaded: <strong>Happy Birthday</strong>`;
  }

  // Music File Upload Listener
  document.getElementById('music-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reject files larger than 1.5MB to prevent URL overflow and browser crashes
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Error: This audio file is too large (" + (file.size / (1024 * 1024)).toFixed(1) + "MB).\n\nDirect file uploads must be under 1.5MB to fit within the shareable link.\n\nTo use this song, please upload the MP3 to Google Drive or Dropbox, copy the link, and paste it in the 'Custom MP3 URL' box instead!");
      e.target.value = ''; // Reset uploader
      return;
    }

    // Clear text inputs
    document.getElementById('music-custom-url').value = '';
    musicPicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));

    // Create a local blob URL for instant, high-compatibility playback in preview mode
    const blobUrl = URL.createObjectURL(file);
    
    // Add a dynamic selection card for this audio file using the blob URL for play
    addCustomMusicCard(file.name.substring(0, 15) + '...', blobUrl, '');
    
    // Start playing immediately using the blob URL (guaranteed to play instantly!)
    startBackgroundMusic(blobUrl);

    // Read base64 in the background for saving in config
    const reader = new FileReader();
    reader.onload = function(evt) {
      const base64Audio = evt.target.result;
      
      if (file.size > 500 * 1024) {
        alert("Warning: This audio file is large (" + Math.round(file.size/1024) + "KB). Generating links with large audio files will increase the URL size and may prevent scanning the QR Code directly. We highly recommend using files under 100KB!");
      }
      
      const status = document.getElementById('music-upload-status');
      if (status) {
        status.style.display = 'block';
        status.innerHTML = `<i class="fa-solid fa-circle-check"></i> Audio File Loaded: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(0)} KB)`;
      }

      musicFileDataUrl = base64Audio;
      
      // Update the card's dataset values so they save correctly when clicked
      const customCard = musicPicker.querySelector('.custom-added-card');
      if (customCard) {
        customCard.dataset.saveUrl = base64Audio;
        customCard.dataset.value = base64Audio;
      }
    };
    reader.readAsDataURL(file);
  });

  // Custom Music URL Input Listener with Debounce (plays immediately on paste/finish typing)
  let musicInputTimeout = null;
  document.getElementById('music-custom-url').addEventListener('input', (e) => {
    const val = e.target.value;
    if (musicInputTimeout) clearTimeout(musicInputTimeout);
    
    musicInputTimeout = setTimeout(() => {
      if (!val) return;
      
      // Clear file inputs
      document.getElementById('music-file-input').value = '';
      musicFileDataUrl = '';
      musicPicker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
      
      const status = document.getElementById('music-upload-status');
      if (status) {
        status.style.display = 'block';
        const displayUrl = val.length > 40 ? val.substring(0, 40) + '...' : val;
        status.innerHTML = `<i class="fa-solid fa-circle-check"></i> Custom URL Loaded: <strong>${displayUrl}</strong>`;
      }

      // Convert Google Drive/Dropbox links to direct streaming paths
      const directUrl = resolveDirectAudioUrl(val);

      // Add a dynamic selection card for this URL
      const displayUrlShort = val.substring(val.lastIndexOf('/') + 1).split('?')[0];
      const cardName = displayUrlShort.length > 15 ? displayUrlShort.substring(0, 15) : displayUrlShort || 'Custom URL';
      addCustomMusicCard(cardName, directUrl, '');
      
      // Start playing immediately so the creator can hear it
      startBackgroundMusic(directUrl);
    }, 600); // 600ms debounce
  });

  // 5. Loading Messages (Dynamic List)
  const loadingContainer = document.getElementById('loading-msgs-container');
  loadingContainer.innerHTML = '';
  DEFAULT_CONFIG.loadingMsgs.forEach((msg, idx) => {
    const row = document.createElement('div');
    row.className = 'dynamic-list-row';
    row.innerHTML = `
      <input type="text" value="${msg}" required placeholder="Loading step message...">
    `;
    loadingContainer.appendChild(row);
  });

  // 6. Dynamic add buttons
  document.getElementById('add-photo-btn').onclick = () => {
    if (creatorPolaroids.length >= 8) {
      alert("You can add a maximum of 8 memory cards!");
      return;
    }
    creatorPolaroids.push({ url: DEFAULT_IMAGES.polaroids[0].url, caption: 'A sweet moment together 📸' });
    renderCreatorPolaroids();
    playClickSound();
  };

  document.getElementById('add-wish-btn').onclick = () => {
    creatorBalloons.push('A sweet wish for you! 🎈');
    renderCreatorBalloons();
    playClickSound();
  };

  // 7. Puzzle & Scratch file inputs
  puzzleImgFileDataUrl = '';
  document.getElementById('puzzle-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    document.getElementById('puzzle-img-url').value = ''; // clear url
    
    // Scale and compress puzzle image (down to 320px for puzzle compatibility & space)
    compressImage(file, 320, 0.6, (compressedDataUrl) => {
      puzzleImgFileDataUrl = compressedDataUrl;
      playClickSound();
    });
  });

  scratchImgFileDataUrl = '';
  document.getElementById('scratch-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    document.getElementById('scratch-img-url').value = ''; // clear url
    
    // Scale and compress scratch image
    compressImage(file, 320, 0.6, (compressedDataUrl) => {
      scratchImgFileDataUrl = compressedDataUrl;
      playClickSound();
    });
  });

  // Pre-fill rest of simple inputs
  document.getElementById('gift-message').value = DEFAULT_CONFIG.giftMessage;
  document.getElementById('gift-submessage').value = DEFAULT_CONFIG.giftSubmessage;
  document.getElementById('lock-code').value = DEFAULT_CONFIG.lockCode;
  document.getElementById('lock-hint').value = DEFAULT_CONFIG.lockHint;
  document.getElementById('curtain-message-1').value = DEFAULT_CONFIG.curtainClosedMsg;
  document.getElementById('curtains-title').value = DEFAULT_CONFIG.curtainsTitle;
  document.getElementById('curtains-subtitle').value = DEFAULT_CONFIG.curtainsSubtitle;
  document.getElementById('recipient-name').value = DEFAULT_CONFIG.recipientName;
  document.getElementById('recipient-dob').value = DEFAULT_CONFIG.recipientDob;
  document.getElementById('recipient-age').value = DEFAULT_CONFIG.recipientAge;
  document.getElementById('cake-greeting').value = DEFAULT_CONFIG.cakeGreeting;
  document.getElementById('puzzle-img-url').value = DEFAULT_CONFIG.puzzleImg;
  document.getElementById('scratch-img-url').value = DEFAULT_CONFIG.scratchImg;
  document.getElementById('scratch-name').value = DEFAULT_CONFIG.scratchName;
  document.getElementById('letter-text').value = DEFAULT_CONFIG.letterText;

  // Wire up Step Button Navs
  const stepBtns = document.querySelectorAll('.step-btn');
  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.step);
      goToStep(targetStep);
      playClickSound();
    });
  });

  // Next and Prev Step Buttons
  const nextBtn = document.getElementById('next-step-btn');
  const prevBtn = document.getElementById('prev-step-btn');

  nextBtn.addEventListener('click', () => {
    const activeStep = document.querySelector('.form-step.active');
    const stepNum = parseInt(activeStep.id.split('-')[1]);
    
    // Check validation of inputs in active step
    const inputs = activeStep.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    inputs.forEach(input => {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });

    if (isValid) {
      if (stepNum < 7) {
        goToStep(stepNum + 1);
      }
    }
    playClickSound();
  });

  prevBtn.addEventListener('click', () => {
    const activeStep = document.querySelector('.form-step.active');
    const stepNum = parseInt(activeStep.id.split('-')[1]);
    if (stepNum > 1) {
      goToStep(stepNum - 1);
    }
    playClickSound();
  });

  // Generate Button Click
  document.getElementById('generate-btn').addEventListener('click', generateSurpriseLink);
}

function renderCreatorGiftPreview(style) {
  const preview = document.getElementById('creator-gift-preview');
  if (!preview) return;
  preview.innerHTML = `
    <div class="gift-box-item ${style}" style="animation: giftWobble 2s ease-in-out infinite alternate; pointer-events: none; transform: scale(0.9); margin-top: 10px;">
      <div class="gift-box-lid"></div>
      <div class="gift-box-body"></div>
    </div>
  `;
}

function renderCreatorCakePreview(styleKey) {
  const preview = document.getElementById('creator-cake-preview');
  if (!preview) return;
  
  const style = CAKE_STYLES[styleKey] || CAKE_STYLES['cake-style-1'];
  
  // Apply style colors dynamically via CSS variables
  preview.style.setProperty('--cake-color-primary', style.primary);
  preview.style.setProperty('--cake-color-dark', style.dark);
  preview.style.setProperty('--cake-frosting', style.frosting);
  
  preview.innerHTML = `
    <div class="cake-display" style="transform: scale(0.6); margin-top: -25px; pointer-events: none;">
      <div class="candle-positioner" style="left: 50%; transform: translateX(-50%);">
        <div class="candle-stick" style="animation: none;"><div class="candle-flame" style="animation: flameFlicker 0.6s infinite alternate;"></div></div>
      </div>
      <div class="cake-layer cake-top"></div>
      <div class="cake-layer cake-middle"></div>
      <div class="cake-layer cake-base"></div>
      <div class="cake-plate"></div>
    </div>
  `;
}

function renderCreatorPolaroids() {
  const container = document.getElementById('photos-container');
  if (!container) return;
  container.innerHTML = '';
  
  creatorPolaroids.forEach((card, i) => {
    const pCard = document.createElement('div');
    pCard.className = 'form-photo-card-row';
    
    const isBase64 = card.url && card.url.startsWith('data:');
    
    pCard.innerHTML = `
      <div class="photo-preview-tiny" id="photo-preview-${i}" style="background-image: url('${card.url || ''}')">
        ${card.url ? '' : '<i class="fa-solid fa-image"></i>'}
      </div>
      <div class="form-group" style="grid-column: span 1; gap: 8px;">
        <label>Photo Card #${i+1}</label>
        <input type="file" class="photo-file-input" accept="image/*" style="width: 100%;">
        <input type="url" class="photo-url-input" value="${isBase64 ? '' : card.url}" placeholder="Or paste image URL..." style="width: 100%; font-size: 0.8rem; margin-top: 5px;">
        <div class="upload-status-msg" style="font-size: 0.75rem; color: #00e676; display: ${isBase64 ? 'block' : 'none'}; font-weight: bold; margin-top: 4px;">
          <i class="fa-solid fa-circle-check"></i> Loaded & Compressed
        </div>
      </div>
      <div class="form-group" style="grid-column: span 1; gap: 8px;">
        <label>Caption Text</label>
        <input type="text" class="photo-caption-input" value="${card.caption || ''}" placeholder="Memory caption (optional)" style="width: 100%;">
        ${creatorPolaroids.length > 1 ? `<button type="button" class="delete-row-btn"><i class="fa-solid fa-trash-can"></i> Delete Card</button>` : ''}
      </div>
    `;
    
    const fileInput = pCard.querySelector('.photo-file-input');
    const urlInput = pCard.querySelector('.photo-url-input');
    const captionInput = pCard.querySelector('.photo-caption-input');
    const deleteBtn = pCard.querySelector('.delete-row-btn');
    const preview = pCard.querySelector('.photo-preview-tiny');
    const statusMsg = pCard.querySelector('.upload-status-msg');
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      compressImage(file, 250, 0.5, (compressedBase64) => {
        card.url = compressedBase64;
        urlInput.value = ''; // clear url input since we are using file
        preview.style.backgroundImage = `url('${compressedBase64}')`;
        preview.innerHTML = '';
        statusMsg.style.display = 'block';
        playClickSound();
      });
    });
    
    urlInput.addEventListener('input', (e) => {
      const val = e.target.value;
      card.url = val;
      statusMsg.style.display = 'none';
      if (val) {
        preview.style.backgroundImage = `url('${val}')`;
        preview.innerHTML = '';
      } else {
        preview.style.backgroundImage = 'none';
        preview.innerHTML = '<i class="fa-solid fa-image"></i>';
      }
    });
    
    captionInput.addEventListener('input', (e) => {
      card.caption = e.target.value;
    });
    
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        creatorPolaroids.splice(i, 1);
        renderCreatorPolaroids();
        playClickSound();
      };
    }
    
    container.appendChild(pCard);
  });
}

function renderCreatorBalloons() {
  const container = document.getElementById('balloons-container');
  if (!container) return;
  container.innerHTML = '';
  
  creatorBalloons.forEach((wish, i) => {
    const row = document.createElement('div');
    row.className = 'dynamic-list-row';
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.style.alignItems = 'center';
    
    row.innerHTML = `
      <span style="font-weight: bold; font-size: 0.9rem; min-width: 80px; color: var(--text-secondary);">Wish #${i+1}:</span>
      <input type="text" class="balloon-wish-input" value="${wish}" required placeholder="Balloon pop wish..." style="flex-grow: 1;">
      ${creatorBalloons.length > 1 ? `<button type="button" class="delete-row-btn" style="margin-top:0 !important; padding: 6px 12px !important;"><i class="fa-solid fa-xmark"></i></button>` : ''}
    `;
    
    const input = row.querySelector('.balloon-wish-input');
    const deleteBtn = row.querySelector('.delete-row-btn');
    
    input.addEventListener('input', (e) => {
      creatorBalloons[i] = e.target.value;
    });
    
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        creatorBalloons.splice(i, 1);
        renderCreatorBalloons();
        playClickSound();
      };
    }
    
    container.appendChild(row);
  });
}

function getThemeGradientPreview(key) {
  if (key === 'theme-ethereal') return 'linear-gradient(135deg, #170d2b, #4c116c)';
  if (key === 'theme-midnight') return 'linear-gradient(135deg, #050b1a, #0d2040)';
  if (key === 'theme-rose') return 'linear-gradient(135deg, #300f1c, #5e1c3a)';
  return 'linear-gradient(135deg, #30110d, #661a29)';
}

function selectThemeOption(key) {
  const picker = document.getElementById('theme-picker');
  picker.querySelectorAll('.picker-item').forEach(i => i.classList.remove('active'));
  const activeItem = picker.querySelector(`.picker-item[data-value="${key}"]`);
  if (activeItem) activeItem.classList.add('active');
  
  // Dynamically change creator styling context if desired
  document.body.className = THEMES[key].class;
  playClickSound();
}

function goToStep(stepNum) {
  document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
  document.getElementById(`step-${stepNum}`).classList.add('active');

  const stepBtns = document.querySelectorAll('.step-btn');
  stepBtns.forEach(btn => {
    const btnStep = parseInt(btn.dataset.step);
    if (btnStep === stepNum) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Footer buttons
  const nextBtn = document.getElementById('next-step-btn');
  const prevBtn = document.getElementById('prev-step-btn');
  
  prevBtn.disabled = stepNum === 1;
  
  if (stepNum === 7) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'block';
  }

  // Manage Creator Music Preview based on navigation step
  if (stepNum === 1) {
    resumeCreatorMusicSelection();
  } else {
    stopBackgroundMusic();
  }
}

function resumeCreatorMusicSelection() {
  if (musicFileDataUrl) {
    startBackgroundMusic(musicFileDataUrl);
  } else {
    const customMusic = document.getElementById('music-custom-url').value;
    if (customMusic) {
      startBackgroundMusic(customMusic);
    } else {
      const activeMusicItem = document.querySelector('#music-picker .picker-item.active');
      if (activeMusicItem) {
        startBackgroundMusic(activeMusicItem.dataset.value);
      }
    }
  }
}

// Render QR Code helper (handles canvas drawing and size fallbacks)
function renderQrCode(url) {
  const qrWrapper = document.getElementById('qrcode-canvas-wrapper');
  if (!qrWrapper) return;
  qrWrapper.innerHTML = ''; // Clear previous qr
  
  const qrElement = document.createElement('div');
  qrWrapper.appendChild(qrElement);
  
  try {
    new QRCode(qrElement, {
      text: url,
      width: 130,
      height: 130,
      colorDark : "#120a1f",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.M
    });
  } catch (err) {
    console.error("QR Code generation failed:", err);
    qrWrapper.innerHTML = `
      <div class="qr-error-msg" style="padding: 15px 10px; font-size: 0.8rem; color: #ff5252; text-align: center; border: 1px dashed rgba(255,82,82,0.3); border-radius: 8px; font-weight: 600; line-height: 1.4;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.2rem; margin-bottom: 6px; display: block;"></i> QR Code Unavailable
        <span style="display: block; font-weight: normal; color: var(--text-secondary); margin-top: 4px; font-size: 0.75rem;">Your custom audio file is too large for a QR code. Copy the link above to share instead!</span>
      </div>
    `;
  }
}

// Generate the configuration JSON, pack it, compress it into URL, and render QR code
function generateSurpriseLink() {
  const config = {};
  
  // Theme info
  const activeThemeItem = document.querySelector('#theme-picker .picker-item.active');
  config.theme = activeThemeItem ? activeThemeItem.dataset.value : 'theme-ethereal';
  
  const activeBgItem = document.querySelector('#bg-picker .picker-item.active');
  config.particles = activeBgItem ? activeBgItem.dataset.value : 'stars';
  
  const activeGiftItem = document.querySelector('#gift-picker .picker-item.active');
  config.giftStyle = activeGiftItem ? activeGiftItem.dataset.value : 'box-style-1';
  
  const activeCakeItem = document.querySelector('#cake-style-picker .picker-item.active');
  config.cakeStyle = activeCakeItem ? activeCakeItem.dataset.value : 'cake-style-1';
  
  config.giftMessage = document.getElementById('gift-message').value;
  config.giftSubmessage = document.getElementById('gift-submessage').value;

  // Soundtrack
  if (musicFileDataUrl) {
    config.musicUrl = musicFileDataUrl;
  } else {
    const customMusic = document.getElementById('music-custom-url').value;
    if (customMusic) {
      config.musicUrl = resolveDirectAudioUrl(customMusic);
    } else {
      const activeMusicItem = document.querySelector('#music-picker .picker-item.active');
      config.musicUrl = activeMusicItem ? activeMusicItem.dataset.value : MUSIC_PRESETS[0].url;
    }
  }

  // Security
  config.lockCode = document.getElementById('lock-code').value || '1111';
  config.lockHint = document.getElementById('lock-hint').value;
  config.curtainClosedMsg = document.getElementById('curtain-message-1').value;

  // Async Loading list
  const loadingInputs = document.querySelectorAll('#loading-msgs-container input');
  config.loadingMsgs = Array.from(loadingInputs).map(inp => inp.value).filter(v => v !== '');

  config.curtainsTitle = document.getElementById('curtains-title').value;
  config.curtainsSubtitle = document.getElementById('curtains-subtitle').value;

  // Greets
  config.recipientName = document.getElementById('recipient-name').value;
  config.recipientDob = document.getElementById('recipient-dob').value;
  config.recipientAge = document.getElementById('recipient-age').value || '21';
  config.cakeGreeting = document.getElementById('cake-greeting').value;

  // Photo Cards Stack
  config.polaroids = creatorPolaroids.filter(p => p.url !== '');

  // Pop wishes
  config.balloonWishes = creatorBalloons.filter(w => w !== '');

  // Games
  config.puzzleImg = puzzleImgFileDataUrl || document.getElementById('puzzle-img-url').value || DEFAULT_CONFIG.puzzleImg;
  config.scratchImg = scratchImgFileDataUrl || document.getElementById('scratch-img-url').value || DEFAULT_CONFIG.scratchImg;
  config.scratchName = document.getElementById('scratch-name').value;
  config.letterText = document.getElementById('letter-text').value;

  console.log("Saving Configuration JSON:", config);
  
  // Compact compression using LZString
  const configStr = JSON.stringify(config);
  const compressed = LZString.compressToEncodedURIComponent(configStr);
  const shareUrl = `${window.location.origin}${window.location.pathname}#data=${compressed}`;
  
  // Set UI Share fields and show loading state on generate button
  const generateBtn = document.getElementById('generate-btn');
  const originalBtnHtml = generateBtn.innerHTML;
  generateBtn.disabled = true;
  generateBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Generating Surprise...`;

  const shareLinkInput = document.getElementById('share-link-input');
  
  const statusEl = document.getElementById('shortener-status');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.color = '#ffd700'; // gold / yellow while waiting
    statusEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Shortening link for easy sharing...`;
  }

  // Use corsproxy.io (much faster and more reliable than allorigins)
  const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(shareUrl));
  
  fetch(proxyUrl)
    .then(res => {
      if (!res.ok) throw new Error("HTTP error during shortening");
      return res.text();
    })
    .then(shortUrl => {
      if (shortUrl && shortUrl.startsWith('https://tinyurl.com/')) {
        // Set shortened URL and render clean QR code
        shareLinkInput.value = shortUrl;
        renderQrCode(shortUrl);
        
        if (statusEl) {
          statusEl.style.color = '#00e676'; // green on success
          statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Link successfully shortened! Easy to copy & share.`;
        }
      } else {
        throw new Error("Invalid response format");
      }
    })
    .catch(err => {
      console.warn("URL shortener failed, using full-length URL:", err);
      shareLinkInput.value = shareUrl;
      
      if (statusEl) {
        statusEl.style.color = '#ff9800'; // orange warn
        statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Using full-length URL (shortener offline)`;
      }

      // Check original URL length before rendering QR code (prevents broken QR codes)
      if (shareUrl.length < 2500) {
        renderQrCode(shareUrl);
      } else {
        const qrWrapper = document.getElementById('qrcode-canvas-wrapper');
        if (qrWrapper) {
          qrWrapper.innerHTML = `
            <div class="qr-error-msg" style="padding: 15px 10px; font-size: 0.8rem; color: #ff5252; text-align: center; border: 1px dashed rgba(255,82,82,0.3); border-radius: 8px; font-weight: 600; line-height: 1.4;">
              <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.2rem; margin-bottom: 6px; display: block;"></i> QR Code Unavailable
              <span style="display: block; font-weight: normal; color: var(--text-secondary); margin-top: 4px; font-size: 0.75rem;">Your custom files make the link too large for a QR code. Copy the text link instead, or use image URLs in Step 4.</span>
            </div>
          `;
        }
      }
    })
    .finally(() => {
      // Re-enable button
      generateBtn.disabled = false;
      generateBtn.innerHTML = originalBtnHtml;
      
      // Reveal share panel at the exact same time
      document.getElementById('share-results').classList.remove('hide');
      playSuccessSound();
    });

  // Copy link action button
  const copyBtn = document.getElementById('copy-link-btn');
  copyBtn.addEventListener('click', () => {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(shareUrl).then(() => {
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      copyBtn.style.background = '#00e676';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
        copyBtn.style.background = 'var(--accent-color)';
      }, 2000);
      playClickSound();
    });
  });

  // Preview button click
  const previewBtn = document.getElementById('preview-btn');
  previewBtn.onclick = () => {
    CONFIG = config;
    isPreviewMode = true;
    setupPlayerMode();
    playClickSound();
  };
}


// ================= PLAYER MODE LOGIC =================
function setupPlayerMode() {
  // Hide Creator, Show Player
  document.getElementById('creator-view').classList.add('hide');
  document.getElementById('player-view').classList.remove('hide');

  // Inject Theme settings
  document.body.className = THEMES[CONFIG.theme]?.class || 'theme-ethereal';
  initParticleSystem(CONFIG.particles || 'stars');

  // Setup global sound playback
  const audioBtn = document.getElementById('music-toggle-btn');
  if (audioBtn) {
    audioBtn.onclick = () => {
      toggleMute();
      playClickSound();
    };
  }

  // Setup Back-to-editor overlay button if in preview mode
  let exitBtn = document.getElementById('exit-preview-btn');
  if (exitBtn) exitBtn.remove();
  
  if (isPreviewMode) {
    exitBtn = document.createElement('button');
    exitBtn.id = 'exit-preview-btn';
    exitBtn.innerHTML = '<i class="fa-solid fa-arrow-left-long"></i> Editor';
    exitBtn.style.position = 'fixed';
    exitBtn.style.bottom = '20px';
    exitBtn.style.left = '20px';
    exitBtn.style.zIndex = '99';
    exitBtn.style.padding = '8px 16px';
    exitBtn.style.borderRadius = '20px';
    exitBtn.style.background = 'rgba(255,255,255,0.08)';
    exitBtn.style.border = '1px solid rgba(255,255,255,0.15)';
    exitBtn.style.color = '#fff';
    exitBtn.style.fontSize = '0.8rem';
    exitBtn.style.fontWeight = 'bold';
    exitBtn.style.cursor = 'pointer';
    exitBtn.style.backdropFilter = 'blur(6px)';
    exitBtn.onclick = () => {
      isPreviewMode = false;
      stopBackgroundMusic();
      if (particleAnimFrame) cancelAnimationFrame(particleAnimFrame);
      document.getElementById('player-view').classList.add('hide');
      document.getElementById('creator-view').classList.remove('hide');
      let exitBtn = document.getElementById('exit-preview-btn');
      if (exitBtn) exitBtn.remove();
      playClickSound();
    };
    document.body.appendChild(exitBtn);
  }

  // Build Dots indicator
  const progressContainer = document.getElementById('player-progress');
  progressContainer.innerHTML = '';
  // We have 9 slides
  for (let i = 0; i < 9; i++) {
    const dot = document.createElement('div');
    dot.className = `progress-dot ${i === 0 ? 'active' : ''}`;
    dot.dataset.index = i;
    progressContainer.appendChild(dot);
  }

  // Initialize slides container
  currentSlide = 0;
  showSlide(0);

  // Initialize Slide 1
  setupGiftSlide();
}

function showSlide(index) {
  currentSlide = index;
  
  // Hide all slides
  const slides = document.querySelectorAll('.slide-section');
  slides.forEach(slide => slide.classList.remove('active'));
  
  // Activate selected slide
  const targetSlide = slides[index];
  if (targetSlide) {
    targetSlide.classList.add('active');
  }

  // Update dots indicator
  const dots = document.querySelectorAll('.progress-dot');
  dots.forEach((dot, idx) => {
    dot.className = 'progress-dot';
    if (idx === index) {
      dot.classList.add('active');
    } else if (idx < index) {
      dot.classList.add('passed');
    }
  });

  // Slide Specific Inits
  if (index === 1) {
    setupLockSlide();
  } else if (index === 2) {
    setupCurtainsSlide();
  } else if (index === 3) {
    setupCountdownSlide();
  } else if (index === 4) {
    setupMemoriesSlide();
  } else if (index === 5) {
    setupBalloonsSlide();
  } else if (index === 6) {
    setupPuzzleSlide();
  } else if (index === 7) {
    setupScratchSlide();
  } else if (index === 8) {
    setupLetterSlide();
  }
}

// ================= SLIDE 1: GIFT CHOOSE =================
function setupGiftSlide() {
  const container = document.getElementById('player-gift-container');
  container.innerHTML = '';
  
  const revealCard = document.getElementById('gift-reveal-card');
  revealCard.classList.add('hide');
  document.querySelector('#slide-gift .slide-title').classList.remove('hide');
  document.querySelector('#slide-gift .slide-subtitle').classList.remove('hide');

  // Display only the single gift box style customized by the creator
  const style = CONFIG.giftStyle || DEFAULT_CONFIG.giftStyle || 'box-style-1';
  
  const gift = document.createElement('div');
  gift.className = `gift-box-item ${style}`;
  gift.innerHTML = `
    <div class="gift-box-lid"></div>
    <div class="gift-box-body"></div>
  `;
  
  gift.addEventListener('click', () => {
    if (gift.classList.contains('blasted')) return;
    
    // Attempt to initiate soundtrack loop upon first interaction
    startBackgroundMusic(CONFIG.musicUrl || DEFAULT_CONFIG.musicUrl);

    // Play SFX
    playBlastSound();
    
    // Blast animation
    gift.classList.add('blasted');
    
    // Confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Show message
    setTimeout(() => {
      container.style.display = 'none';
      document.querySelector('#slide-gift .slide-title').classList.add('hide');
      document.querySelector('#slide-gift .slide-subtitle').classList.add('hide');
      
      document.getElementById('player-gift-msg').textContent = CONFIG.giftMessage || DEFAULT_CONFIG.giftMessage;
      document.getElementById('player-gift-submsg').textContent = CONFIG.giftSubmessage || DEFAULT_CONFIG.giftSubmessage;
      revealCard.classList.remove('hide');
      
      // Wire up next button
      const nextBtn = revealCard.querySelector('.slide-next-btn');
      nextBtn.onclick = () => {
        showSlide(1);
        playClickSound();
        // reset container style for back/restart navigation
        container.style.display = 'flex';
      };
    }, 800);
  });

  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.appendChild(gift);
}

// ================= SLIDE 2: PASSWORD LOCK =================
let enteredPin = "";
function setupLockSlide() {
  enteredPin = "";
  document.getElementById('player-lock-hint').textContent = CONFIG.lockHint || DEFAULT_CONFIG.lockHint;
  document.getElementById('lock-error').classList.add('hide');
  
  const padlock = document.getElementById('padlock-icon');
  padlock.className = "fa-solid fa-lock";
  
  updateCodeSlots();

  // Numpad key bindings
  const keys = document.querySelectorAll('.num-key');
  keys.forEach(key => {
    // replace standard click to ensure clean triggers
    key.onclick = (e) => {
      e.preventDefault();
      const val = key.dataset.val;
      handlePinInput(val);
    };
  });
}

function handlePinInput(val) {
  const correctCode = CONFIG.lockCode || DEFAULT_CONFIG.lockCode;
  const maxLen = correctCode.length;
  
  if (val === 'clear') {
    enteredPin = "";
    playClickSound();
  } else if (val === 'backspace') {
    enteredPin = enteredPin.slice(0, -1);
    playClickSound();
  } else if (/^\d$/.test(val)) {
    if (enteredPin.length < maxLen) {
      enteredPin += val;
      playClickSound();
    }
  }

  updateCodeSlots();

  if (enteredPin.length === maxLen) {
    if (enteredPin === correctCode) {
      // Success
      playSuccessSound();
      const padlock = document.getElementById('padlock-icon');
      padlock.className = "fa-solid fa-lock-open unlocked";
      
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.5 }
      });

      setTimeout(() => {
        // Slow dissolve fade to next slide
        const lockCard = document.querySelector('.lock-slide-card');
        lockCard.style.opacity = 0;
        lockCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
          lockCard.style.opacity = '';
          lockCard.style.transform = '';
          showSlide(2);
        }, 800);
      }, 600);
    } else {
      // Error
      const lockCard = document.querySelector('.lock-slide-card');
      lockCard.classList.add('shake');
      document.getElementById('lock-error').classList.remove('hide');
      
      initAudioContext();
      if (audioCtx) {
        // Error tone
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }

      setTimeout(() => {
        lockCard.classList.remove('shake');
        enteredPin = "";
        updateCodeSlots();
      }, 500);
    }
  }
}

function updateCodeSlots() {
  const container = document.getElementById('code-slots');
  container.innerHTML = '';
  const correctCode = CONFIG.lockCode || DEFAULT_CONFIG.lockCode;
  const codeLen = correctCode.length;

  for (let i = 0; i < codeLen; i++) {
    const dot = document.createElement('div');
    dot.className = `code-dot ${i < enteredPin.length ? 'filled' : ''}`;
    container.appendChild(dot);
  }
}

// ================= SLIDE 3: CURTAINS REVEAL =================
function setupCurtainsSlide() {
  const slide = document.getElementById('slide-curtains');
  slide.classList.remove('opened');
  
  const openBtn = document.getElementById('open-curtain-btn');
  openBtn.style.display = 'block';
  openBtn.style.transform = 'scale(1)';
  
  document.getElementById('player-curtain-btn-text').textContent = CONFIG.curtainClosedMsg || DEFAULT_CONFIG.curtainClosedMsg;
  document.getElementById('async-loading-box').classList.add('hide');
  document.getElementById('curtains-revealed-text').classList.add('hide');

  openBtn.onclick = () => {
    playClickSound();
    openBtn.style.transform = 'scale(0)';
    setTimeout(() => {
      openBtn.style.display = 'none';
      runCurtainLoadingSequence();
    }, 300);
  };
}

function runCurtainLoadingSequence() {
  const loadingBox = document.getElementById('async-loading-box');
  const loadingText = document.getElementById('async-loading-text');
  loadingBox.classList.remove('hide');

  const messages = CONFIG.loadingMsgs?.length ? CONFIG.loadingMsgs : DEFAULT_CONFIG.loadingMsgs;
  let idx = 0;

  loadingText.textContent = messages[0];

  const interval = setInterval(() => {
    idx++;
    if (idx < messages.length) {
      loadingText.textContent = messages[idx];
      playClickSound();
    } else {
      clearInterval(interval);
      // Finished loading, slide curtains
      loadingBox.classList.add('hide');
      
      const slide = document.getElementById('slide-curtains');
      slide.classList.add('opened');
      playWindSound();

      // Confetti splash
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }, 500);

      // Reveal text
      setTimeout(() => {
        document.getElementById('player-curtain-title').textContent = CONFIG.curtainsTitle || DEFAULT_CONFIG.curtainsTitle;
        document.getElementById('player-curtain-subtitle').textContent = CONFIG.curtainsSubtitle || DEFAULT_CONFIG.curtainsSubtitle;
        const reveal = document.getElementById('curtains-revealed-text');
        reveal.classList.remove('hide');

        const nextBtn = reveal.querySelector('.slide-next-btn');
        nextBtn.onclick = () => {
          showSlide(3);
          playClickSound();
        };
      }, 1000);
    }
  }, 1000);
}

// ================= SLIDE 4: TIMELINE COUNTDOWN & CAKE =================
let countdownInterval = null;
function setupCountdownSlide() {
  document.getElementById('player-name-greet').textContent = `Happy Birthday, ${CONFIG.recipientName || 'Beautiful'}! 🎂`;
  document.getElementById('player-cake-greeting').textContent = CONFIG.cakeGreeting || DEFAULT_CONFIG.cakeGreeting;

  // Blow cake controls reset
  document.getElementById('cake-instruct').classList.remove('hide');
  document.getElementById('cake-blew-controls').classList.add('hide');

  // Set the custom cake style chosen by the creator
  const cakeStyle = CONFIG.cakeStyle || DEFAULT_CONFIG.cakeStyle || 'cake-style-1';
  setCakeColor(cakeStyle);

  // Render Candles
  const candleContainer = document.getElementById('candles-container');
  candleContainer.innerHTML = '';
  // 5 candles
  for (let i = 0; i < 5; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle-stick';
    candle.innerHTML = '<div class="candle-flame"></div>';
    candleContainer.appendChild(candle);
  }

  // Live Timer
  if (countdownInterval) clearInterval(countdownInterval);
  updateTimerValues();
  countdownInterval = setInterval(updateTimerValues, 1000);

  // Blowing Candles Tap
  const cakeDisplay = document.getElementById('cake-renderer');
  cakeDisplay.onclick = () => {
    const flames = candleContainer.querySelectorAll('.candle-flame');
    if (flames.length > 0 && !flames[0].classList.contains('blew-out')) {
      playWindSound();
      flames.forEach(flame => flame.classList.add('blew-out'));
      
      // Giant confetti celebration
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.65 }
      });

      // Show age on candles
      setTimeout(() => {
        const age = CONFIG.recipientAge || DEFAULT_CONFIG.recipientAge;
        const ageDisplay = document.createElement('div');
        ageDisplay.className = 'age-candle';
        ageDisplay.textContent = age;
        candleContainer.innerHTML = '';
        candleContainer.appendChild(ageDisplay);
        
        document.getElementById('cake-instruct').classList.add('hide');
        document.getElementById('cake-blew-controls').classList.remove('hide');
        playSuccessSound();
      }, 500);
    }
  };

  const nextBtn = document.querySelector('#cake-blew-controls .slide-next-btn');
  nextBtn.onclick = () => {
    if (countdownInterval) clearInterval(countdownInterval);
    showSlide(4);
    playClickSound();
  };
}

function setCakeColor(styleKey) {
  const cake = document.getElementById('cake-renderer');
  if (!cake) return;
  const style = CAKE_STYLES[styleKey] || CAKE_STYLES['cake-style-1'];
  
  cake.style.setProperty('--cake-color-primary', style.primary);
  cake.style.setProperty('--cake-color-dark', style.dark);
  cake.style.setProperty('--cake-frosting', style.frosting);
}

function updateTimerValues() {
  const dobStr = CONFIG.recipientDob || DEFAULT_CONFIG.recipientDob;
  const dob = new Date(dobStr);
  // Force the birthdate to start counting precisely from midnight of that day
  dob.setHours(0, 0, 0, 0);
  const now = new Date();
  
  if (isNaN(dob.getTime())) return;

  const diffMs = now - dob;
  if (diffMs < 0) {
    // birthdate is in future
    document.getElementById('time-years').textContent = '00';
    document.getElementById('time-days').textContent = '00';
    document.getElementById('time-hours').textContent = '00';
    document.getElementById('time-mins').textContent = '00';
    document.getElementById('time-secs').textContent = '00';
    return;
  }

  // Approximate calculations
  const msInSec = 1000;
  const msInMin = msInSec * 60;
  const msInHour = msInMin * 60;
  const msInDay = msInHour * 24;
  const msInYear = msInDay * 365.25;

  const years = Math.floor(diffMs / msInYear);
  const remainingAfterYears = diffMs % msInYear;

  const days = Math.floor(remainingAfterYears / msInDay);
  const remainingAfterDays = remainingAfterYears % msInDay;

  const hours = Math.floor(remainingAfterDays / msInHour);
  const remainingAfterHours = remainingAfterDays % msInHour;

  const minutes = Math.floor(remainingAfterHours / msInMin);
  const remainingAfterMins = remainingAfterHours % msInMin;

  const seconds = Math.floor(remainingAfterMins / msInSec);

  document.getElementById('time-years').textContent = String(years).padStart(2, '0');
  document.getElementById('time-days').textContent = String(days).padStart(3, '0');
  document.getElementById('time-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('time-mins').textContent = String(minutes).padStart(2, '0');
  document.getElementById('time-secs').textContent = String(seconds).padStart(2, '0');
}

// ================= SLIDE 5: MEMORIES SWIPABLE CARD STACK =================
function setupMemoriesSlide() {
  const stack = document.getElementById('player-photo-stack');
  stack.innerHTML = '';
  
  const cardsData = CONFIG.polaroids?.length ? CONFIG.polaroids : DEFAULT_CONFIG.polaroids;

  document.getElementById('photo-stack-action-btn').classList.add('hide');

  const cardsList = [];

  cardsData.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';
    card.style.zIndex = cardsData.length - idx;
    
    card.innerHTML = `
      <div class="polaroid-img-wrapper">
        <img src="${item.url}" alt="Memory photo">
      </div>
      <div class="polaroid-caption">${item.caption}</div>
    `;

    stack.appendChild(card);
    cardsList.push(card);

    // Gestures setup
    initSwipeGestures(card, () => {
      // Swiped Callback
      playWhooshSound();
      card.style.pointerEvents = 'none';
      
      // Check if all swiped
      const activeCards = stack.querySelectorAll('.polaroid-card:not(.swiped-left):not(.swiped-right)');
      if (activeCards.length === 0) {
        document.getElementById('photo-stack-action-btn').classList.remove('hide');
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }
    });
  });

  const nextBtn = document.querySelector('#photo-stack-action-btn .slide-next-btn');
  nextBtn.onclick = () => {
    showSlide(5);
    playClickSound();
  };
}

function initSwipeGestures(card, onSwiped) {
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isDragging = false;

  const threshold = 100; // swipe limit

  // Mouse listeners
  card.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);

  // Touch listeners
  card.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
  window.addEventListener('touchmove', (e) => drag(e.touches[0]));
  window.addEventListener('touchend', endDrag);

  // Tap listener fallback
  card.addEventListener('click', (e) => {
    if (Math.abs(currentX) < 5 && Math.abs(currentY) < 5) {
      // Tapped cards auto-swipe right
      card.classList.add('swiped-right');
      onSwiped();
    }
  });

  function startDrag(e) {
    if (card.classList.contains('swiped-left') || card.classList.contains('swiped-right')) return;
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    card.style.transition = 'none';
  }

  function drag(e) {
    if (!isDragging) return;
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    // Apply translation + rotation on the fly
    const rot = currentX * 0.08;
    card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rot}deg)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.25)';

    if (currentX > threshold) {
      // swipe right
      card.classList.add('swiped-right');
      card.style.transform = '';
      onSwiped();
    } else if (currentX < -threshold) {
      // swipe left
      card.classList.add('swiped-left');
      card.style.transform = '';
      onSwiped();
    } else {
      // Reset position
      card.style.transform = '';
    }
    
    // Reset coords
    setTimeout(() => {
      currentX = 0;
      currentY = 0;
    }, 100);
  }
}

// ================= SLIDE 6: BALLOON POP GAME =================
function setupBalloonsSlide() {
  poppedBalloons = 0;
  const wishes = CONFIG.balloonWishes?.length ? CONFIG.balloonWishes : DEFAULT_CONFIG.balloonWishes;
  totalBalloons = wishes.length;

  document.getElementById('popped-count').textContent = poppedBalloons;
  document.getElementById('total-balloons-count').textContent = totalBalloons;
  document.getElementById('wish-toast').classList.add('hide');
  document.getElementById('balloons-next-btn').classList.add('hide');

  const stage = document.getElementById('balloons-stage');
  stage.innerHTML = '';

  // Generate balloons
  for (let i = 0; i < totalBalloons; i++) {
    spawnBalloon(i, wishes[i]);
  }

  const nextBtn = document.getElementById('balloons-next-btn');
  nextBtn.onclick = () => {
    showSlide(6);
    playClickSound();
  };
}

function spawnBalloon(index, wish) {
  const stage = document.getElementById('balloons-stage');
  if (!stage) return;

  const balloon = document.createElement('div');
  balloon.className = 'balloon-element';
  
  // Random vibrant colors
  const hue = Math.floor(Math.random() * 360);
  balloon.style.backgroundColor = `hsl(${hue}, 80%, 65%)`;
  balloon.style.color = `hsl(${hue}, 80%, 40%)`; // for knot reference
  
  // Calculate relative coordinates matching the absolute stage bounds (guarantees center alignment on all devices)
  const stageWidth = stage.offsetWidth || 360;
  const stageHeight = stage.offsetHeight || 480;
  
  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;
  
  // Group within a beautiful 260px horizontal and 220px vertical range relative to card center
  const left = centerX - 130 + Math.random() * 260 - 27; // center adjusted for balloon width (55px)
  const top = centerY - 180 + Math.random() * 220;
  
  balloon.style.left = `${left}px`;
  balloon.style.top = `${top}px`;
  
  // Random slow organic drifting speed and phase offsets
  const duration = Math.random() * 6 + 10; // 10s to 16s slow drifting
  const delay = -Math.random() * 15; // start instantly at different points in cycle
  
  balloon.style.animationDuration = `${duration}s`;
  balloon.style.animationDelay = `${delay}s`;

  balloon.addEventListener('click', (e) => {
    e.stopPropagation();
    popBalloon(balloon, wish);
  });

  // Touch triggers
  balloon.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    popBalloon(balloon, wish);
  });

  stage.appendChild(balloon);
}

function popBalloon(balloonEl, wish) {
  if (balloonEl.classList.contains('popping')) return;
  balloonEl.classList.add('popping');
  
  // Sound pop
  playPopSound();

  // Coordinates for confetti target
  const rect = balloonEl.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  // Custom confetti splash from balloon location
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { x, y }
  });

  // Remove balloon
  balloonEl.style.transform = 'scale(0)';
  balloonEl.style.opacity = '0';
  setTimeout(() => {
    balloonEl.remove();
  }, 300);

  // Show wish toast
  const toast = document.getElementById('wish-toast');
  const toastTxt = document.getElementById('wish-toast-text');
  toastTxt.textContent = wish;
  toast.classList.remove('hide');

  poppedBalloons++;
  document.getElementById('popped-count').textContent = poppedBalloons;

  if (poppedBalloons >= totalBalloons) {
    document.getElementById('balloons-next-btn').classList.remove('hide');
    playSuccessSound();
  }
}

// ================= SLIDE 7: 3x3 SLIDING PUZZLE =================
function setupPuzzleSlide() {
  puzzleMoves = 0;
  isPuzzleSolved = false;
  document.getElementById('puzzle-moves').textContent = puzzleMoves;
  document.getElementById('puzzle-success').classList.add('hide');
  
  const imgUrl = CONFIG.puzzleImg || DEFAULT_CONFIG.puzzleImg;
  
  // Set goal preview thumbnail
  document.getElementById('puzzle-goal-img').src = imgUrl;

  // Puzzle board layout grid
  const board = document.getElementById('puzzle-board');
  board.innerHTML = '';

  // Initialize board indices
  // Correct state is [0, 1, 2, 3, 4, 5, 6, 7, 8], where 8 is the empty slot
  puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  
  shufflePuzzleBoard();
  renderPuzzleBoard();

  // Control Buttons
  document.getElementById('puzzle-shuffle-btn').onclick = () => {
    shufflePuzzleBoard();
    puzzleMoves = 0;
    document.getElementById('puzzle-moves').textContent = puzzleMoves;
    document.getElementById('puzzle-success').classList.add('hide');
    isPuzzleSolved = false;
    renderPuzzleBoard();
    playClickSound();
  };

  document.getElementById('puzzle-solve-btn').onclick = () => {
    animatePuzzleSolve();
  };

  const nextBtn = document.querySelector('#puzzle-success .slide-next-btn');
  nextBtn.onclick = () => {
    showSlide(7);
    playClickSound();
  };
}

function shufflePuzzleBoard() {
  // To guarantee solvability, we shuffle by making random valid slide swaps starting from the solved state
  let emptyIdx = 8;
  const loopCount = 80;
  
  for (let i = 0; i < loopCount; i++) {
    const validMoves = getValidPuzzleMoves(emptyIdx);
    const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    // Swap tiles
    [puzzleTiles[emptyIdx], puzzleTiles[randomMove]] = [puzzleTiles[randomMove], puzzleTiles[emptyIdx]];
    emptyIdx = randomMove;
  }
}

function getValidPuzzleMoves(emptyIdx) {
  const row = Math.floor(emptyIdx / 3);
  const col = emptyIdx % 3;
  const moves = [];

  if (row > 0) moves.push(emptyIdx - 3); // top
  if (row < 2) moves.push(emptyIdx + 3); // bottom
  if (col > 0) moves.push(emptyIdx - 1); // left
  if (col < 2) moves.push(emptyIdx + 1); // right

  return moves;
}

function renderPuzzleBoard() {
  const board = document.getElementById('puzzle-board');
  board.innerHTML = '';
  const imgUrl = CONFIG.puzzleImg || DEFAULT_CONFIG.puzzleImg;

  puzzleTiles.forEach((tileValue, currentIndex) => {
    const tile = document.createElement('div');
    tile.className = 'puzzle-tile';
    
    if (tileValue === 8) {
      // Empty slot
      tile.className += ' empty';
    } else {
      tile.style.backgroundImage = `url('${imgUrl}')`;
      // background positions based on tileValue
      const row = Math.floor(tileValue / 3);
      const col = tileValue % 3;
      tile.style.backgroundPosition = `-${col * 80}px -${row * 80}px`;
      
      // responsive offset calculations for tablet layouts
      if (window.innerWidth >= 400) {
        tile.style.backgroundPosition = `-${col * 90}px -${row * 90}px`;
      }

      // click triggers
      tile.onclick = () => {
        if (isPuzzleSolved) return;
        attemptPuzzleMove(currentIndex);
      };
    }
    board.appendChild(tile);
  });
}

function attemptPuzzleMove(index) {
  const emptyIndex = puzzleTiles.indexOf(8);
  const validMoves = getValidPuzzleMoves(emptyIndex);
  
  if (validMoves.includes(index)) {
    // Swap
    [puzzleTiles[emptyIndex], puzzleTiles[index]] = [puzzleTiles[index], puzzleTiles[emptyIndex]];
    puzzleMoves++;
    document.getElementById('puzzle-moves').textContent = puzzleMoves;
    playClickSound();
    renderPuzzleBoard();
    checkPuzzleWin();
  }
}

function checkPuzzleWin() {
  const isWon = puzzleTiles.every((val, idx) => val === idx);
  if (isWon) {
    isPuzzleSolved = true;
    playSuccessSound();
    
    // Reveal win details
    document.getElementById('puzzle-success').classList.remove('hide');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

function animatePuzzleSolve() {
  if (isPuzzleSolved) return;
  
  // Sort tiles sequentially to show a magical fast-solver solving it
  let step = 0;
  const interval = setInterval(() => {
    if (step < 9) {
      puzzleTiles[step] = step;
      renderPuzzleBoard();
      playClickSound();
      step++;
    } else {
      clearInterval(interval);
      checkPuzzleWin();
    }
  }, 100);
}

// ================= SLIDE 8: GOLDEN SCRATCH CARD =================
let scratchCanvas = null;
let scratchCtx = null;
let scratchPercent = 0;
let isDrawingScratch = false;

function setupScratchSlide() {
  isScratchFinished = false;
  scratchPercent = 0;
  
  const imgUrl = CONFIG.scratchImg || DEFAULT_CONFIG.scratchImg;
  const username = CONFIG.scratchName || DEFAULT_CONFIG.scratchName;
  
  document.getElementById('scratch-revealed-img').src = imgUrl;
  document.getElementById('scratch-banner-greeting').textContent = `Happy Birthday, ${username}! 🎉`;
  document.getElementById('scratch-percentage-fill').style.width = '0%';
  document.getElementById('scratch-percentage-val').textContent = '0';
  document.getElementById('scratch-next-btn-container').classList.add('hide');
  document.getElementById('scratch-banner').classList.add('hide');

  // Canvas context setup
  scratchCanvas = document.getElementById('scratch-canvas');
  if (!scratchCanvas) return;
  
  scratchCtx = scratchCanvas.getContext('2d');
  
  // Match canvas dimensions to layout container size (240x240)
  scratchCanvas.width = 240;
  scratchCanvas.height = 240;

  // Fill Canvas with metallic golden foil gradient
  const grad = scratchCtx.createLinearGradient(0, 0, 240, 240);
  grad.addColorStop(0, '#ffd700');
  grad.addColorStop(0.2, '#cca300');
  grad.addColorStop(0.4, '#ffd700');
  grad.addColorStop(0.6, '#e6b800');
  grad.addColorStop(0.8, '#ffd700');
  grad.addColorStop(1, '#b38f00');
  
  scratchCtx.fillStyle = grad;
  scratchCtx.fillRect(0, 0, 240, 240);

  // Add a nice canvas border or visual patterns/text overlay
  scratchCtx.fillStyle = '#120a1f';
  scratchCtx.font = 'bold 16px Outfit, sans-serif';
  scratchCtx.textAlign = 'center';
  scratchCtx.textBaseline = 'middle';
  scratchCtx.fillText('Scratch Here 🏷️', 120, 110);
  
  scratchCtx.font = 'normal 10px Outfit, sans-serif';
  scratchCtx.fillText('(use mouse or finger)', 120, 135);

  // Canvas touch/mouse listeners
  scratchCanvas.addEventListener('mousedown', startScratching);
  scratchCanvas.addEventListener('mousemove', continueScratching);
  window.addEventListener('mouseup', stopScratching);

  scratchCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startScratching(e.touches[0]);
  });
  scratchCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    continueScratching(e.touches[0]);
  });
  window.addEventListener('touchend', stopScratching);

  const nextBtn = document.querySelector('#scratch-next-btn-container .slide-next-btn');
  nextBtn.onclick = () => {
    showSlide(8);
    playClickSound();
  };
}

function startScratching(e) {
  if (isScratchFinished) return;
  isDrawingScratch = true;
  scratch(e);
}

function continueScratching(e) {
  if (!isDrawingScratch || isScratchFinished) return;
  scratch(e);
}

function stopScratching() {
  isDrawingScratch = false;
}

function scratch(e) {
  const rect = scratchCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Erase drawing mode
  scratchCtx.globalCompositeOperation = 'destination-out';
  
  scratchCtx.beginPath();
  scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
  scratchCtx.fill();

  playClickSound(); // light feedback blips

  calculateScratchPercentage();
}

function calculateScratchPercentage() {
  if (isScratchFinished) return;
  
  // Sample a grid subset of pixels to boost efficiency
  const imgData = scratchCtx.getImageData(0, 0, 240, 240);
  const pixels = imgData.data;
  let transparentCount = 0;
  const step = 4; // Check every 4th pixel
  let totalSampled = 0;

  for (let i = 3; i < pixels.length; i += 4 * step) {
    totalSampled++;
    if (pixels[i] === 0) {
      transparentCount++;
    }
  }

  const percent = Math.round((transparentCount / totalSampled) * 100);
  scratchPercent = percent;

  // Update loading bar
  document.getElementById('scratch-percentage-fill').style.width = `${percent}%`;
  document.getElementById('scratch-percentage-val').textContent = percent;

  if (percent >= 80) {
    // Set progress bar to 100% to represent full reveal
    document.getElementById('scratch-percentage-fill').style.width = '100%';
    document.getElementById('scratch-percentage-val').textContent = '100';
    
    // Reveal all remaining golden foil automatically
    isScratchFinished = true;
    scratchCtx.clearRect(0, 0, 240, 240);
    
    document.getElementById('scratch-banner').classList.remove('hide');
    document.getElementById('scratch-next-btn-container').classList.remove('hide');
    
    playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  }
}

// ================= SLIDE 9: LETTER TYPING =================
function setupLetterSlide() {
  // Clear typing loops
  if (typingInterval) clearInterval(typingInterval);

  // Set current date on paper
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('letter-date-current').textContent = new Date().toLocaleDateString('en-US', dateOptions);



  const envelope = document.getElementById('envelope-main');
  envelope.classList.remove('opened');
  
  const seal = document.getElementById('envelope-seal');
  seal.classList.remove('broken');

  const letterSheet = document.getElementById('letter-sheet');
  letterSheet.classList.add('hide');
  const restartBtn = document.getElementById('restart-deck-btn');
  if (restartBtn) restartBtn.classList.add('hide');

  const footer = document.getElementById('letter-footer');
  if (footer) footer.classList.add('hide');

  const authorName = CONFIG.scratchName || DEFAULT_CONFIG.scratchName;
  const authorEl = document.getElementById('letter-author');
  if (authorEl) authorEl.textContent = authorName;

  document.getElementById('envelope-wrapper').style.display = 'block';

  // Tap Envelope Event (supports tapping anywhere on the envelope container for high mobile accessibility)
  const handleOpenEnvelope = () => {
    if (seal.classList.contains('broken')) return; // already opened
    
    playPopSound();
    seal.classList.add('broken');
    setTimeout(() => {
      envelope.classList.add('opened');
      playWindSound();
      
      // Paper slides out after flap animation completes
      setTimeout(() => {
        document.getElementById('envelope-wrapper').style.display = 'none';
        letterSheet.classList.remove('hide');
        startLetterTypewriter();
      }, 1000);
    }, 400);
  };

  const wrapper = document.getElementById('envelope-wrapper');
  wrapper.onclick = (e) => {
    e.stopPropagation();
    handleOpenEnvelope();
  };
  
  wrapper.ontouchstart = (e) => {
    e.stopPropagation();
    handleOpenEnvelope();
  };

  // Restart Button
  document.getElementById('restart-deck-btn').onclick = () => {
    playClickSound();
    if (isPreviewMode) {
      // Return to editor
      isPreviewMode = false;
      stopBackgroundMusic();
      if (particleAnimFrame) cancelAnimationFrame(particleAnimFrame);
      document.getElementById('player-view').classList.add('hide');
      document.getElementById('creator-view').classList.remove('hide');
      const exitBtn = document.getElementById('exit-preview-btn');
      if (exitBtn) exitBtn.remove();
    } else {
      // Loop back to Slide 0
      showSlide(0);
    }
  };
}

function startLetterTypewriter() {
  const bodyText = document.getElementById('letter-body-text');
  bodyText.textContent = '';

  const rawText = CONFIG.letterText || DEFAULT_CONFIG.letterText;
  let idx = 0;

  if (typingInterval) clearInterval(typingInterval);

  typingInterval = setInterval(() => {
    if (idx < rawText.length) {
      bodyText.textContent += rawText[idx];
      playTypewriterSound();
      idx++;
    } else {
      clearInterval(typingInterval);
      playSuccessSound();
      const footer = document.getElementById('letter-footer');
      if (footer) footer.classList.remove('hide');
      const restartBtn = document.getElementById('restart-deck-btn');
      if (restartBtn) restartBtn.classList.remove('hide');
    }
  }, 45); // Typing speed milliseconds
}


// ================= CORE INITS =================
window.addEventListener('DOMContentLoaded', () => {
  // Check for hash parameter first (bypasses HTTP 414 URI Too Long limits)
  let urlData = '';
  const hash = window.location.hash;
  if (hash && hash.startsWith('#data=')) {
    urlData = hash.substring(6);
  } else {
    // Fallback to query parameter
    const params = new URLSearchParams(window.location.search);
    urlData = params.get('data');
  }

  if (urlData) {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(urlData);
      if (decompressed) {
        CONFIG = JSON.parse(decompressed);
        isPreviewMode = false;
        setupPlayerMode();
      } else {
        throw new Error("Decompression returned null content.");
      }
    } catch (e) {
      console.error("Failed to decode configuration. Falling back to Creator Mode.", e);
      initCreatorMode();
    }
  } else {
    // Show Creator View
    initCreatorMode();
  }
});
