/* ==========================================================================
   DOODLE OUTPOST — STITCH TACTICAL UI, SETTINGS DRAWER, UTILITY CRATES & 10 MAPS
   ========================================================================== */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ==========================================================================
// 1. TRANSPARENT SPRITE LOADER
// ==========================================================================
let ASSET_TOTAL = 0;
let assetLoaded = 0, assetFailed = 0, assetGateResolve;
const assetsReady = new Promise((resolve) => { assetGateResolve = resolve; });
let assetFallbackTimer = setTimeout(() => { console.warn('Asset loading timed out; continuing with available assets.'); assetGateResolve(); const loader=document.getElementById('assetLoader'); if(loader){const detail=document.getElementById('assetProgressDetail');if(detail)detail.textContent='Some assets unavailable — continuing with fallbacks';loader.classList.add('done');}},15000);
function reportAsset(src, ok) {
  assetLoaded++;
  if (!ok) assetFailed++;
  const pct = Math.min(100, Math.round(assetLoaded / ASSET_TOTAL * 100));
  const fill = document.getElementById('assetProgressFill');
  const label = document.getElementById('assetProgressText');
  const detail = document.getElementById('assetProgressDetail');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
  if (detail) detail.textContent = `${assetLoaded}/${ASSET_TOTAL} assets ready${assetFailed ? ` • ${assetFailed} unavailable (safe fallback)` : ''}`;
  if (assetLoaded >= ASSET_TOTAL) {
    clearTimeout(assetFallbackTimer);
    assetGateResolve();
    const loader = document.getElementById('assetLoader');
    if (loader) setTimeout(() => loader.classList.add('done'), 180);
  }
}
const portraitDataCache = new Map();
function setTransparentPortrait(el, src) { if(!el)return; if(portraitDataCache.has(src)){el.src=portraitDataCache.get(src);return;} const img=new Image(); img.onload=()=>{try{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4)if(p[i]>238&&p[i+1]>238&&p[i+2]>238)p[i+3]=0;x.putImageData(d,0,0);const url=c.toDataURL('image/png');portraitDataCache.set(src,url);el.src=url;}catch(_){el.src=src;}};img.onerror=()=>{el.src=src;};img.src=src;}
function loadTransparentSprite(src, onReady) {
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => {
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width; c.height = img.naturalHeight || img.height;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const data = g.getImageData(0, 0, c.width, c.height), d = data.data;
      for (let i = 0; i < d.length; i += 4) if (d[i] > 238 && d[i+1] > 238 && d[i+2] > 238) d[i+3] = 0;
      g.putImageData(data, 0, 0); onReady(c); reportAsset(src, true);
    } catch (_) { onReady(img); reportAsset(src, false); }
  };
  img.onerror = () => reportAsset(src, false);
  img.src = src;
  return img;
}

// 2. 9 SOLDIERS, 10 WEAPONS/CRATES, 3 GRENADES & FX SPRITES
// ==========================================================================
const CHARACTERS = [
  { id: 0, name: 'Desert Medic',  file: './assets/char1.png' },
  { id: 1, name: 'Stealth Wing',  file: './assets/char2.png' },
  { id: 2, name: 'Vanguard',      file: './assets/char3.png' },
  { id: 3, name: 'Recon Sniper',  file: './assets/char4.png' },
  { id: 4, name: 'Snow Trooper',  file: './assets/char5.png' },
  { id: 5, name: 'Night Ops',     file: './assets/char6.png' },
  { id: 6, name: 'Iron Beard',    file: './assets/char7.png' },
  { id: 7, name: 'Red Bandana',   file: './assets/char8.png' },
  { id: 8, name: 'Riot Shielder', file: './assets/char9.png' }
];

const WEAPONS = [
  { id: 0, name: 'RIOT SHIELD',  file: './assets/weap1.png',  sound: './sounds/w1_shield.mp3',     rate: 140,  speed: 0,  damage: 18, spread: 0,    count: 1, color: '#38bdf8', type: 'shield' },
  { id: 1, name: 'DUAL UZIS',    file: './assets/weap2.png',  sound: './sounds/w2_uzi.mp3',        rate: 85,   speed: 18, damage: 13, spread: 0.09, count: 2, color: '#facc15', type: 'bullet' },
  { id: 2, name: 'DESERT EAGLE', file: './assets/weap3.png',  sound: './sounds/w3_deagle.mp3',     rate: 250,  speed: 22, damage: 35, spread: 0.02, count: 1, color: '#fde047', type: 'bullet' },
  { id: 3, name: 'SNIPER RIFLE', file: './assets/weap4.png',  sound: './sounds/w4_sniper.mp3',     rate: 620,  speed: 34, damage: 85, spread: 0.00, count: 1, color: '#38bdf8', type: 'sniper' },
  { id: 4, name: 'CHAINSAW',     file: './assets/weap5.png',  sound: './sounds/w5_chainsaw.mp3',   rate: 120,  speed: 0,  damage: 25, spread: 0,    count: 1, color: '#ef4444', type: 'melee'  },
  { id: 5, name: 'SHOTGUN',      file: './assets/weap6.png',  sound: './sounds/w6_shotgun.mp3',    rate: 500,  speed: 17, damage: 16, spread: 0.24, count: 6, color: '#fef08a', type: 'bullet' },
  { id: 6, name: 'ROCKET RPG',   file: './assets/weap7.png',  sound: './sounds/w7_rocket.mp3',     rate: 820,  speed: 14, damage: 95, spread: 0.02, count: 1, color: '#fb923c', type: 'rocket' },
  { id: 7, name: 'AMMO CRATE',   file: './assets/weap8.png',  sound: './sounds/w8_ammo_crate.mp3', rate: 1500, speed: 0,  damage: 0,  spread: 0,    count: 1, color: '#facc15', type: 'ammo_boost' },
  { id: 8, name: 'GEAR CRATE',   file: './assets/weap9.png',  sound: './sounds/w9_gear_crate.mp3', rate: 1500, speed: 0,  damage: 0,  spread: 0,    count: 1, color: '#38bdf8', type: 'armor_boost' },
  { id: 9, name: 'MEDKIT BOX',   file: './assets/weap10.png', sound: './sounds/w10_medkit.mp3',    rate: 900,  speed: 0,  damage: 0,  spread: 0,    count: 1, color: '#22c55e', type: 'heal' }
];

const GRENADE_TYPES = [
  { id: 0, label: 'FRAG',  name: 'FRAG GRENADE', file: './assets/grenade_frag.png' },
  { id: 1, label: 'GAS',   name: 'GREEN GAS',    file: './assets/grenade_gas.png' },
  { id: 2, label: 'SMOKE', name: 'SMOKE SCREEN', file: './assets/grenade_smoke.png' }
];

const FX_FILES = {
  smokeWhite: './assets/fx_smoke_white.png',
  smokeGreen: './assets/fx_smoke_green.png',
  explosion:  './assets/fx_explosion.png',
  sparks:     './assets/fx_sparks.png',
  fire:       './assets/fx_fire.png',
  dust:       './assets/fx_dust.png',
  muzzle:     './assets/fx_muzzle.png'
};

const PROP_FILES = {
  bunker: './assets/prop_bunker.png', tower: './assets/prop_tower.png',
  crate: './assets/prop_crate.png', door: './assets/prop_door.png',
  sandbag: './assets/prop_sandbag.png', catwalk: './assets/prop_catwalk.png',
  pipes: './assets/prop_pipes.png', container: './assets/prop_container.png',
  cave: './assets/prop_cave.png'
};

const SPRITES = { chars: [], weapons: [], grenades: [], fx: {}, props: {}, zombies: [], boss: null };
// Raw image fallback keeps the chosen operator visible even while transparent sprites are decoding.
const CHARACTER_IMAGE_FALLBACK = CHARACTERS.map((ch) => { const img = new Image(); img.decoding = 'async'; img.src = ch.file; return img; });
['./assets/zombie-grunt.svg','./assets/zombie-armored.svg'].forEach((src,idx) => { const img=new Image(); img.onload=()=>{ SPRITES.zombies[idx]=img; }; img.src=src; });
{ const img=new Image(); img.onload=()=>{ SPRITES.boss=img; }; img.src='./assets/outpost-titan.svg'; }
CHARACTERS.forEach((ch, idx) => loadTransparentSprite(ch.file, (c) => { SPRITES.chars[idx] = c; }));
WEAPONS.forEach((wp, idx) => loadTransparentSprite(wp.file, (c) => { SPRITES.weapons[idx] = c; }));
GRENADE_TYPES.forEach((gr, idx) => loadTransparentSprite(gr.file, (c) => { SPRITES.grenades[idx] = c; }));
Object.entries(FX_FILES).forEach(([k, src]) => loadTransparentSprite(src, (c) => { SPRITES.fx[k] = c; }));
Object.entries(PROP_FILES).forEach(([k, src]) => loadTransparentSprite(src, (c) => { SPRITES.props[k] = c; }));

// ==========================================================================
// 3. 10 ANALYZED MAPS
// ==========================================================================
const WORLD = { width: 2400, height: 1200 };
const BORDER_PLATFORMS = [
  { x: 0, y: 0, w: 2400, h: 30 }, { x: 0, y: 1160, w: 2400, h: 40 },
  { x: 0, y: 0, w: 30, h: 1200 }, { x: 2370, y: 0, w: 30, h: 1200 }
];

const MAPS = [
  {
    id: 0, name: 'Desert Outpost', file: './assets/map1.png.jpeg',
    platforms: [
      { x: 180, y: 495, w: 940, h: 26 }, { x: 1760, y: 475, w: 580, h: 26 },
      { x: 840, y: 785, w: 710, h: 24 }, { x: 1560, y: 745, w: 520, h: 24 },
      { x: 30, y: 980, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'sandbag', x: 320, y: 455, w: 120, h: 42 },
      { kind: 'crate', x: 920, y: 735, w: 68, h: 52 },
      { kind: 'tower', x: 2080, y: 265, w: 150, h: 210 }
    ],
    spawns: [{ x: 350, y: 420 }, { x: 1950, y: 400 }, { x: 1150, y: 710 }, { x: 600, y: 900 }, { x: 1800, y: 900 }, { x: 1200, y: 900 }]
  },
  {
    id: 1, name: 'Underground Bunker', file: './assets/map2.png.jpeg',
    platforms: [
      { x: 120, y: 585, w: 1180, h: 26 }, { x: 1520, y: 445, w: 620, h: 22 },
      { x: 1620, y: 635, w: 680, h: 26 }, { x: 810, y: 830, w: 840, h: 24 },
      { x: 30, y: 1030, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'door', x: 720, y: 445, w: 130, h: 140 },
      { kind: 'pipes', x: 1950, y: 255, w: 120, h: 190 },
      { kind: 'crate', x: 420, y: 535, w: 68, h: 52 }
    ],
    spawns: [{ x: 350, y: 510 }, { x: 1820, y: 370 }, { x: 1180, y: 750 }, { x: 450, y: 950 }, { x: 1950, y: 950 }, { x: 1200, y: 950 }]
  },
  {
    id: 2, name: 'Abandoned Scrapyard', file: './assets/map3.png.jpeg',
    platforms: [
      { x: 60, y: 530, w: 580, h: 26 }, { x: 860, y: 555, w: 540, h: 22 },
      { x: 1760, y: 525, w: 580, h: 26 }, { x: 1060, y: 815, w: 560, h: 24 },
      { x: 30, y: 1020, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'container', x: 220, y: 420, w: 180, h: 110 },
      { kind: 'catwalk', x: 1120, y: 755, w: 180, h: 65 },
      { kind: 'crate', x: 1880, y: 475, w: 68, h: 52 }
    ],
    spawns: [{ x: 300, y: 450 }, { x: 1120, y: 480 }, { x: 2020, y: 450 }, { x: 700, y: 940 }, { x: 1650, y: 940 }, { x: 1250, y: 740 }]
  },
  {
    id: 3, name: 'Jungle River Camp', file: './assets/map4.png',
    platforms: [
      { x: 180, y: 575, w: 420, h: 24 }, { x: 640, y: 455, w: 420, h: 24 },
      { x: 1060, y: 475, w: 360, h: 20 }, { x: 1420, y: 445, w: 820, h: 26 },
      { x: 1360, y: 735, w: 640, h: 24 }, { x: 30, y: 940, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'tower', x: 1440, y: 235, w: 140, h: 210 },
      { kind: 'sandbag', x: 1580, y: 405, w: 120, h: 42 },
      { kind: 'crate', x: 340, y: 525, w: 68, h: 52 }
    ],
    spawns: [{ x: 360, y: 500 }, { x: 840, y: 380 }, { x: 1850, y: 370 }, { x: 1650, y: 660 }, { x: 750, y: 860 }, { x: 1250, y: 860 }]
  },
  {
    id: 4, name: 'Catacombs Mine', file: './assets/map5.png',
    platforms: [
      { x: 60, y: 545, w: 860, h: 26 }, { x: 920, y: 435, w: 640, h: 20 },
      { x: 1560, y: 425, w: 440, h: 26 }, { x: 1860, y: 615, w: 480, h: 26 },
      { x: 30, y: 990, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'cave', x: 1080, y: 810, w: 220, h: 180 },
      { kind: 'crate', x: 260, y: 495, w: 68, h: 52 },
      { kind: 'pipes', x: 2050, y: 435, w: 110, h: 180 }
    ],
    spawns: [{ x: 350, y: 470 }, { x: 1220, y: 360 }, { x: 1760, y: 350 }, { x: 550, y: 910 }, { x: 1850, y: 910 }, { x: 1200, y: 910 }]
  },
  {
    id: 5, name: 'Arctic Snow Base', file: './assets/map6.png',
    platforms: [
      { x: 1520, y: 345, w: 680, h: 26 }, { x: 420, y: 515, w: 880, h: 26 },
      { x: 1880, y: 615, w: 460, h: 26 }, { x: 480, y: 745, w: 780, h: 24 },
      { x: 30, y: 980, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'bunker', x: 1620, y: 205, w: 160, h: 140 },
      { kind: 'sandbag', x: 1920, y: 575, w: 120, h: 42 },
      { kind: 'crate', x: 680, y: 465, w: 68, h: 52 }
    ],
    spawns: [{ x: 1820, y: 270 }, { x: 750, y: 440 }, { x: 2080, y: 540 }, { x: 820, y: 670 }, { x: 1550, y: 900 }, { x: 1200, y: 900 }]
  },
  {
    id: 6, name: 'Reactor Core', file: './assets/map7.png',
    platforms: [
      { x: 60, y: 545, w: 940, h: 26 }, { x: 1120, y: 455, w: 1180, h: 26 },
      { x: 960, y: 775, w: 780, h: 22 }, { x: 60, y: 895, w: 660, h: 26 },
      { x: 1680, y: 885, w: 660, h: 26 }, { x: 30, y: 1120, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'pipes', x: 240, y: 355, w: 120, h: 190 },
      { kind: 'catwalk', x: 1220, y: 715, w: 180, h: 65 },
      { kind: 'door', x: 2140, y: 495, w: 120, h: 140 }
    ],
    spawns: [{ x: 450, y: 470 }, { x: 1650, y: 380 }, { x: 1320, y: 700 }, { x: 350, y: 820 }, { x: 1950, y: 810 }, { x: 1200, y: 1040 }]
  },
  {
    id: 7, name: 'Bio-Hazard Lab', file: './assets/map8.png',
    platforms: [
      { x: 60, y: 555, w: 840, h: 26 }, { x: 680, y: 445, w: 1040, h: 24 },
      { x: 1520, y: 555, w: 820, h: 26 }, { x: 420, y: 835, w: 1560, h: 24 },
      { x: 30, y: 1120, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'door', x: 980, y: 315, w: 120, h: 130 },
      { kind: 'crate', x: 240, y: 505, w: 68, h: 52 },
      { kind: 'pipes', x: 2150, y: 365, w: 110, h: 190 }
    ],
    spawns: [{ x: 420, y: 480 }, { x: 1180, y: 370 }, { x: 1920, y: 480 }, { x: 1180, y: 760 }, { x: 550, y: 1040 }, { x: 1850, y: 1040 }]
  },
  {
    id: 8, name: 'Mountain Helipad', file: './assets/map9.png',
    platforms: [
      { x: 1320, y: 365, w: 720, h: 26 }, { x: 960, y: 485, w: 460, h: 24 },
      { x: 1280, y: 635, w: 480, h: 26 }, { x: 340, y: 695, w: 640, h: 26 },
      { x: 940, y: 755, w: 760, h: 22 }, { x: 30, y: 1030, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'bunker', x: 420, y: 555, w: 160, h: 140 },
      { kind: 'sandbag', x: 640, y: 655, w: 120, h: 42 },
      { kind: 'crate', x: 1520, y: 315, w: 68, h: 52 }
    ],
    spawns: [{ x: 1650, y: 290 }, { x: 1500, y: 560 }, { x: 620, y: 620 }, { x: 1280, y: 680 }, { x: 750, y: 950 }, { x: 1850, y: 950 }]
  },
  {
    id: 9, name: 'Maximum Prison', file: './assets/map10.png.jpeg',
    platforms: [
      { x: 60, y: 465, w: 1040, h: 22 }, { x: 60, y: 635, w: 1040, h: 22 },
      { x: 1720, y: 495, w: 620, h: 24 }, { x: 1940, y: 685, w: 420, h: 22 },
      { x: 30, y: 990, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'tower', x: 960, y: 255, w: 130, h: 210 },
      { kind: 'tower', x: 1920, y: 285, w: 130, h: 210 },
      { kind: 'sandbag', x: 1180, y: 950, w: 130, h: 42 }
    ],
    spawns: [{ x: 450, y: 390 }, { x: 450, y: 560 }, { x: 2020, y: 420 }, { x: 2120, y: 610 }, { x: 850, y: 910 }, { x: 1550, y: 910 }]
  },
  {
    id: 10, name: 'Quarantine District', file: './assets/map_outpost.png',
    platforms: [
      { x: 140, y: 565, w: 500, h: 24 }, { x: 720, y: 440, w: 460, h: 24 },
      { x: 1320, y: 560, w: 500, h: 24 }, { x: 1840, y: 430, w: 380, h: 24 },
      { x: 920, y: 790, w: 560, h: 24 }, { x: 30, y: 1020, w: 2340, h: 40 }
    ],
    props: [
      { kind: 'container', x: 230, y: 455, w: 180, h: 110 },
      { kind: 'crate', x: 900, y: 738, w: 68, h: 52 },
      { kind: 'tower', x: 1940, y: 220, w: 140, h: 210 }
    ],
    spawns: [{ x: 390, y: 500 }, { x: 920, y: 380 }, { x: 1530, y: 500 }, { x: 1950, y: 370 }, { x: 1050, y: 730 }, { x: 1350, y: 730 }]
  }
];

ASSET_TOTAL = CHARACTERS.length + WEAPONS.length + GRENADE_TYPES.length + Object.keys(FX_FILES).length + Object.keys(PROP_FILES).length + MAPS.length + 1;
const MAP_IMAGES = MAPS.map((m) => {
  if (!m.file) { reportAsset('procedural map fallback', true); return null; }
  const img = new Image(); img.decoding = 'async';
  img.onload = () => reportAsset(m.file, true);
  img.onerror = () => reportAsset(m.file, false);
  img.src = m.file; return img;
});
const lobbyArtwork = new Image();
lobbyArtwork.onload = () => reportAsset('./assets/lobby_bg.png', true);
lobbyArtwork.onerror = () => reportAsset('./assets/lobby_bg.png', false);
lobbyArtwork.src = './assets/lobby_bg.png';

function getActiveMapId() { return state.selectedMode === 'zombie' ? 10 : state.mapId; }
function getActivePlatforms() {
  const mapId = getActiveMapId();
  return BORDER_PLATFORMS.concat((MAPS[mapId] || MAPS[0]).platforms);
}

// ==========================================================================
// 4. MOBILE AUDIO UNLOCKER, 10 WEAPON SFX & BACKGROUND MUSIC SYNTH
// ==========================================================================
const audioSettings = {
  sfxOn: localStorage.getItem('do_sfx') !== 'false',
  musicOn: localStorage.getItem('do_music') === 'true',
  unlocked: false,
  musicCtx: null,
  musicTimer: null
};

const weaponAudios = WEAPONS.map((wp) => {
  const a = new Audio(); a.preload = 'auto'; a.src = wp.sound;
  return a;
});
// Three voices per weapon allow short overlaps without unbounded Audio-node growth.
const sfxVoices = WEAPONS.map(() => []);


function unlockMobileAudio() {
  if (audioSettings.unlocked) return;
  audioSettings.unlocked = true;
  weaponAudios.forEach((a) => {
    a.muted = true;
    a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => {});
  });
  if (audioSettings.musicOn) startBackgroundMusic();
}
window.addEventListener('touchstart', unlockMobileAudio, { once: true });
window.addEventListener('click', unlockMobileAudio, { once: true });

function playWeaponSound(shooter, weaponIdx) {
  if (!audioSettings.sfxOn) return;
  const baseAudio = weaponAudios[weaponIdx];
  const me = state.players[state.myId];
  if (!baseAudio) return;

  let volume = 1.0;
  if (me && shooter && shooter.id !== me.id) {
    const dist = Math.hypot(shooter.x - me.x, shooter.y - me.y);
    volume = Math.max(0, Math.min(1, 1 - dist / 1150));
  }
  if (volume <= 0.02) return;

  const voices = sfxVoices[weaponIdx];
  let clip = voices.find((voice) => voice.paused || voice.ended);
  if (!clip && voices.length < 3) {
    clip = baseAudio.cloneNode(); voices.push(clip);
  }
  if (!clip) {
    clip = voices[0];
    clip.pause();
  }
  clip.volume = volume; clip.currentTime = 0;
  clip.play().catch(() => { /* Optional audio never blocks simulation. */ });
}

function startBackgroundMusic() {
  if (audioSettings.musicTimer) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!audioSettings.musicCtx) audioSettings.musicCtx = new AudioCtx();
  if (audioSettings.musicCtx.state === 'suspended') audioSettings.musicCtx.resume();

  const notes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
  let step = 0;
  audioSettings.musicTimer = setInterval(() => {
    if (!audioSettings.musicOn || !audioSettings.musicCtx) return;
    const ctxAudio = audioSettings.musicCtx;
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = 'triangle';
    osc.frequency.value = notes[step % notes.length];
    gain.gain.setValueAtTime(0.055, ctxAudio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctxAudio.currentTime + 0.24);
    osc.connect(gain);
    gain.connect(ctxAudio.destination);
    osc.start();
    osc.stop(ctxAudio.currentTime + 0.25);
    step++;
  }, 280);
}

function stopBackgroundMusic() {
  if (audioSettings.musicTimer) {
    clearInterval(audioSettings.musicTimer);
    audioSettings.musicTimer = null;
  }
}

// ==========================================================================
// 5. STATE, SETTINGS DRAWER & PEERJS MULTIPLAYER
// ==========================================================================
const MAX_PLAYERS = 6;
const state = {
  mode: 'menu',
  zombies: [], zombieKills: 0, zombieWave: 1, zombieSpawnClock: 1.5,
  ctfFlags: null, ctfScore: [0, 0], boss: null, battleZone: { x: 1200, y: 600, radius: 1120, minRadius: 180 },
  isHost: true,
  roomCode: '',
  mapId: 0,
  myId: 'p_' + Math.random().toString(36).substring(2, 7),
  myName: localStorage.getItem('do_name') || 'Soldier',
  myCharId: Math.max(0, Math.min(CHARACTERS.length - 1, Number.parseInt(localStorage.getItem('do_char') || '0', 10) || 0)),
  myGrenadeType: 0,
  players: {},
  bullets: [],
  grenades: [],
  clouds: [],
  fxList: [],
  killFeed: [],
  selectedDuration: 300,
  matchTime: 300,
  sniperZoom: false,
  camera: { x: 1180, y: 550, zoom: 1 }
};

const voiceChat = { enabled: false, stream: null, audioCtx: null, peerGains: {} };
const MAX_VOICE_DISTANCE = 650;
let peer = null, connections = {}, hostConn = null, lastFrameTime = 0;
let gameLoopRafId = null;
let matchStartToken = 0;

// Build 9 Soldier Cards inside Settings Drawer & Sync Operator File Card
const charGridEl = document.getElementById('characterGrid');
function syncSoldierUI() {
  const ch = CHARACTERS[state.myCharId] || CHARACTERS[0];
  setTransparentPortrait(document.getElementById('lobbyCharPreviewImg'), ch.file);
  document.getElementById('lobbyCharIndex').textContent = `SOLDIER 0${ch.id + 1} / 09`;
  document.getElementById('lobbyCharName').textContent = ch.name.toUpperCase();
  setTransparentPortrait(document.getElementById('drawerCharIcon'), ch.file);
  document.getElementById('drawerCharName').textContent = ch.name;
  setTransparentPortrait(document.getElementById('hudAvatarImg'), ch.file);
  document.getElementById('hudCharRole').textContent = ch.name.toUpperCase();
  document.querySelectorAll('.char-card').forEach((el, i) => el.classList.toggle('selected', i === ch.id));
  const showcase = document.getElementById('showcaseCharacterName');
  if (showcase) showcase.textContent = ch.name.toUpperCase();
  if (typeof renderPlayerShowcase === 'function') renderPlayerShowcase();
}

CHARACTERS.forEach((ch) => {
  const card = document.createElement('div');
  card.className = 'char-card' + (ch.id === state.myCharId ? ' selected' : '');
  card.innerHTML = `<span class="char-num">0${ch.id + 1}</span><img alt="${ch.name}" /><div class="char-name">${ch.name}</div>`;
  setTransparentPortrait(card.querySelector('img'), ch.file);
  card.onclick = () => {
    state.myCharId = ch.id;
    localStorage.setItem('do_char', String(ch.id));
    syncSoldierUI();
    if (state.players[state.myId]) {
      state.players[state.myId].charId = ch.id;
      if (state.isHost) broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
    }
  };
  charGridEl.appendChild(card);
});
syncSoldierUI();

// Build Bottom-Center 10-Weapon Dock
const weaponBarEl = document.getElementById('weaponSelectorBar');
WEAPONS.forEach((wp) => {
  const btn = document.createElement('button');
  btn.className = 'w-slot' + (wp.id === 1 ? ' active' : '');
  btn.dataset.w = String(wp.id);
  btn.innerHTML = `<img src="${wp.file}" alt="${wp.name}" /><span>${wp.id + 1}.${wp.name.split(' ')[0]}</span>`;
  btn.onclick = () => selectWeapon(wp.id);
  weaponBarEl.appendChild(btn);
});

// Settings Drawer Controls
const settingsDrawer = document.getElementById('settingsDrawer');
function openSettings() {
  document.getElementById('drawerMatchActions').classList.toggle('hidden', state.mode !== 'playing');
  settingsDrawer.classList.remove('hidden');
}
document.getElementById('lobbySettingsBtn').onclick = openSettings;
document.getElementById('openSoldierFromCard').onclick = openSettings;
document.getElementById('inGameSettingsBtn').onclick = openSettings;
document.getElementById('closeSettingsBtn').onclick = () => settingsDrawer.classList.add('hidden');

document.getElementById('toggleSoldierPickerBtn').onclick = () => {
  charGridEl.classList.toggle('hidden');
  document.getElementById('soldierExpandArrow').textContent = charGridEl.classList.contains('hidden') ? '▶' : '▼';
};

const sfxBtn = document.getElementById('toggleSfxBtn');
const musicBtn = document.getElementById('toggleMusicBtn');
function refreshAudioButtons() {
  sfxBtn.textContent = audioSettings.sfxOn ? 'ON' : 'OFF';
  sfxBtn.className = 'switch-pill ' + (audioSettings.sfxOn ? 'on' : 'off');
  musicBtn.textContent = audioSettings.musicOn ? 'ON' : 'OFF';
  musicBtn.className = 'switch-pill ' + (audioSettings.musicOn ? 'on' : 'off');
}
refreshAudioButtons();

sfxBtn.onclick = () => {
  audioSettings.sfxOn = !audioSettings.sfxOn;
  localStorage.setItem('do_sfx', String(audioSettings.sfxOn));
  refreshAudioButtons();
};

musicBtn.onclick = () => {
  audioSettings.musicOn = !audioSettings.musicOn;
  localStorage.setItem('do_music', String(audioSettings.musicOn));
  if (audioSettings.musicOn) startBackgroundMusic();
  else stopBackgroundMusic();
  refreshAudioButtons();
};

document.getElementById('drawerExitMatchBtn').onclick = returnToLobby;

// Map & Timer Presets
const mapSelectEl = document.getElementById('mapSelect');
mapSelectEl.innerHTML = MAPS.map((map) =>
  `<option value="${map.id}">${String(map.id + 1).padStart(2, '0')} - ${map.name}</option>`
).join('');
function syncMapCountLabels() {
  const countLabel = MAPS.length + ' MAPS';
  const topCount = document.getElementById('mapCountLabel');
  const cardCount = document.getElementById('mapCardCount');
  if (topCount) topCount.textContent = countLabel;
  if (cardCount) cardCount.textContent = countLabel;
}
function syncLobbyMapPreview() {
  const map = MAPS[getActiveMapId()] || MAPS[0];
  const preview = document.getElementById('lobbyMapPreview');
  const name = document.getElementById('lobbyMapName');
  const index = document.getElementById('lobbyMapIndex');
  if (preview) { preview.src = map.file || './assets/map_outpost.png'; preview.alt = `${map.name} map preview`; }
  if (name) name.textContent = map.name.toUpperCase();
  if (index) index.textContent = `${String(map.id + 1).padStart(2, '0')} / ${MAPS.length}`;
}
syncMapCountLabels();
syncLobbyMapPreview();
mapSelectEl.onchange = (e) => {
  state.mapId = Number.parseInt(e.target.value, 10);
  if (!Number.isInteger(state.mapId) || !MAPS[state.mapId]) state.mapId = 0;
  syncLobbyMapPreview();
  if (state.isHost) broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
};

function formatClock(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

document.querySelectorAll('.preset-btn').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedDuration = parseInt(btn.dataset.sec, 10);
    state.matchTime = state.selectedDuration;
    document.getElementById('lobbyTimerDisplay').textContent = formatClock(state.matchTime);
  };
});

function adjustLiveTimer(deltaSeconds) {
  if (state.isHost) state.matchTime = Math.max(10, Math.min(3600, state.matchTime + deltaSeconds));
  else if (hostConn && hostConn.open) hostConn.send({ type: 'adjust_time', delta: deltaSeconds });
}
document.getElementById('timePlusBtn').onclick = () => adjustLiveTimer(30);
document.getElementById('timeMinusBtn').onclick = () => adjustLiveTimer(-30);

const nameInput = document.getElementById('playerNameInput');
nameInput.value = state.myName;
nameInput.addEventListener('input', () => {
  state.myName = nameInput.value.trim() || 'Soldier';
  localStorage.setItem('do_name', state.myName);
  const displayName = document.getElementById('showcasePlayerName');
  if (displayName) displayName.textContent = state.myName;
});

function getSavedFriends() { return JSON.parse(localStorage.getItem('do_friends') || '[]'); }
function saveFriend(id, name) {
  const list = getSavedFriends();
  if (!list.some((f) => f.name === name)) {
    list.push({ id, name });
    localStorage.setItem('do_friends', JSON.stringify(list));
    renderSavedFriends();
  }
}
function renderSavedFriends() {
  const list = getSavedFriends();
  document.getElementById('savedFriendsList').textContent = list.length ? list.map((f) => f.name).join(', ') : 'None yet';
}
renderSavedFriends();

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('room')) document.getElementById('roomCodeInput').value = urlParams.get('room').toUpperCase();

document.getElementById('installAppBtn').onclick = () => document.getElementById('installModal').classList.remove('hidden');
const drawerInstallButton = document.getElementById('drawerInstallAppBtn');
if (drawerInstallButton) drawerInstallButton.onclick = () => document.getElementById('installAppBtn').click();
document.getElementById('closeInstallModal').onclick = () => document.getElementById('installModal').classList.add('hidden');

// Proximity Voice Chat
async function toggleProximityMic() {
  const hudBtn = document.getElementById('toggleMicBtn');
  const drawerBtn = document.getElementById('drawerMicBtn');
  if (!voiceChat.enabled) {
    try {
      if (!voiceChat.stream) {
        voiceChat.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (peer) {
          Object.keys(connections).forEach((remoteId) => attachVoiceCall(peer.call(remoteId, voiceChat.stream)));
          if (!state.isHost && hostConn && hostConn.peer) attachVoiceCall(peer.call(hostConn.peer, voiceChat.stream));
        }
      }
      voiceChat.stream.getAudioTracks().forEach((t) => { t.enabled = true; });
      voiceChat.enabled = true;
      hudBtn.textContent = 'MIC ON';
      drawerBtn.textContent = 'ON';
      drawerBtn.className = 'switch-pill on';
    } catch (err) {
      alert('Microphone permission is needed for voice chat.');
    }
  } else {
    if (voiceChat.stream) voiceChat.stream.getAudioTracks().forEach((t) => { t.enabled = false; });
    voiceChat.enabled = false;
    hudBtn.textContent = 'MIC OFF';
    drawerBtn.textContent = 'OFF';
    drawerBtn.className = 'switch-pill off';
  }
}

function attachVoiceCall(call) {
  if (!call) return;
  call.on('stream', (remoteStream) => {
    if (!voiceChat.audioCtx) voiceChat.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = voiceChat.audioCtx.createMediaStreamSource(remoteStream);
    const gainNode = voiceChat.audioCtx.createGain();
    gainNode.gain.value = 1.0;
    const audioEl = new Audio();
    audioEl.srcObject = remoteStream; audioEl.autoplay = true; audioEl.muted = true;
    source.connect(gainNode);
    gainNode.connect(voiceChat.audioCtx.destination);
    voiceChat.peerGains[call.peer] = gainNode;
  });
}

function bindIncomingVoiceCalls() {
  if (!peer) return;
  peer.on('call', (call) => { call.answer(voiceChat.stream || undefined); attachVoiceCall(call); });
}

function updateProximityVoiceVolumes() {
  const me = state.players[state.myId];
  if (!me) return;
  Object.entries(voiceChat.peerGains).forEach(([peerId, gainNode]) => {
    const other = state.players[peerId];
    if (!other || other.hp <= 0) { gainNode.gain.value = 0; return; }
    const dist = Math.hypot(other.x - me.x, other.y - me.y);
    gainNode.gain.value = Math.max(0, Math.min(1, 1 - dist / MAX_VOICE_DISTANCE));
  });
}
document.getElementById('toggleMicBtn').onclick = toggleProximityMic;
document.getElementById('drawerMicBtn').onclick = toggleProximityMic;

// ==========================================================================
// 6. ROOM CREATION, JOINING & EXACT PLAYER COUNT
// ==========================================================================
function createPlayer(id, name, charId, isBot = false, spawnIdx = 0) {
  const activeMap = MAPS[getActiveMapId()] || MAPS[0];
  const sp = activeMap.spawns[spawnIdx % activeMap.spawns.length];
  return {
    id, name, charId, isBot, kind: 'survivor',
    team: ['tdm', 'ctf', 'clan'].includes(state.selectedMode) ? (spawnIdx % 2) : null,
    x: sp.x, y: sp.y, vx: 0, vy: 0,
    facing: 1, aimAngle: 0,
    hp: 100, maxHp: 100, armor: 0, jetFuel: 100, boostTimer: 0,
    weaponIdx: 1, kills: 0, deaths: 0,
    lastShot: 0, lastGrenade: 0, deadTimer: 0, aiTimer: 0, aiDir: 1
  };
}

function syncPlayerTeams() {
  Object.values(state.players).forEach((player, index) => {
    player.team = ['tdm','ctf','clan'].includes(state.selectedMode) ? index % 2 : null;
  });
}
const bossDamageCooldowns = new Map();
function resetModeObjectives() {
  bossDamageCooldowns.clear();
  state.zombies=[]; state.zombieKills=0; state.zombieWave=1; state.zombieSpawnClock=1.5;
  state.ctfScore=[0,0];
  state.ctfFlags=state.selectedMode==='ctf' ? [
    {team:0,homeX:180,homeY:930,x:180,y:930,carrierId:null},
    {team:1,homeX:2220,homeY:930,x:2220,y:930,carrierId:null}
  ] : null;
  state.boss=state.selectedMode==='boss' ? {x:1200,y:520,hp:90000,maxHp:90000,attackClock:1.2,phase:1} : null;
  state.battleZone={x:1200,y:600,radius:1120,minRadius:180};
  Object.values(state.players).forEach(p=>{p.carryingFlag=null;});
}
function modeTeamMode(){ return ['tdm','ctf','clan'].includes(state.selectedMode); }
function getModeLabel(){ return ({ffa:'Free for All',tdm:'Team Deathmatch',zombie:'Zombie Survival',ctf:'Capture the Flag',boss:'Boss Battle',br:'Battle Royale',clan:'Clan Wars'})[state.selectedMode] || 'Free for All'; }
function checkObjectiveEnd(){
  const alive=Object.values(state.players).filter(p=>p.hp>0);
  if(state.selectedMode==='br' && alive.length<=1) state.matchTime=0;
  if(state.selectedMode==='ctf' && state.ctfScore.some(score=>score>=3)) state.matchTime=0;
  if(state.selectedMode==='boss' && state.boss && state.boss.hp<=0) state.matchTime=0;
  if(state.selectedMode==='zombie' && alive.length===0) state.matchTime=0;
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 4; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

function setServerStatus(label,online=false){const badge=document.getElementById('serverStatusBadge');if(badge){badge.textContent=label;badge.classList.toggle('online',online);}}
const createRoomBtn = document.getElementById('createRoomBtn');
let roomCreateTimer = null;
let roomCreateSettled = false;

function finishRoomCreateFailure(message) {
  if (roomCreateSettled) return;
  roomCreateSettled = true;
  if (roomCreateTimer) { clearTimeout(roomCreateTimer); roomCreateTimer = null; }
  if (peer) {
    const failedPeer = peer;
    peer = null;
    try { failedPeer.destroy(); } catch (_) {}
  }
  createRoomBtn.disabled = false;
  createRoomBtn.textContent = '⚔ CREATE ROOM';
  document.getElementById('connectionStatus').textContent = message;
  setServerStatus('OFFLINE',false);
}

createRoomBtn.onclick = () => {
  if (createRoomBtn.disabled) return;
  state.isHost = true;
  state.roomCode = generateRoomCode();
  roomCreateSettled = false;
  createRoomBtn.disabled = true;
  createRoomBtn.textContent = 'CREATING…';
  document.getElementById('connectionStatus').textContent = 'Creating Room...';
  roomCreateTimer = setTimeout(() => {
    finishRoomCreateFailure('Could not create room. The server did not respond. Please try again.');
  }, 15000);

  try {
    peer = new Peer('DOODLE_OUTPOST_' + state.roomCode);
    bindIncomingVoiceCalls();
    peer.on('open', () => {
      if (roomCreateSettled) return;
      roomCreateSettled = true;
      if (roomCreateTimer) { clearTimeout(roomCreateTimer); roomCreateTimer = null; }
      createRoomBtn.textContent = 'ROOM READY';
      state.players = {};
      state.players[state.myId] = createPlayer(state.myId, state.myName, state.myCharId, false, 0);
      document.getElementById('waitingRoom').classList.remove('hidden');
      document.getElementById('displayRoomCode').textContent = state.roomCode;
      setServerStatus('ROOM READY',true);
      document.getElementById('connectionStatus').textContent = 'Room Ready! Share code with up to 5 friends.';
      updateLobbyPlayersUI();
      requestAnimationFrame(() => {
        const waitingRoom = document.getElementById('waitingRoom');
        waitingRoom.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    peer.on('connection', (conn) => {
      conn.on('data', (msg) => handleHostReceive(conn, msg));
      conn.on('close', () => {
        if (conn.playerId && state.players[conn.playerId]) {
          delete state.players[conn.playerId];
          delete connections[conn.playerId];
          updateLobbyPlayersUI();
          broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
        }
      });
    });
    peer.on('error', (error) => {
      setServerStatus('OFFLINE',false);
      const type = error && error.type;
      if (!roomCreateSettled) {
        finishRoomCreateFailure(type === 'unavailable-id'
          ? 'That room code is already in use. Please create the room again.'
          : 'Could not create room. Check your connection and try again.');
      } else {
        document.getElementById('connectionStatus').textContent = 'Room connection issue. Your room may be unavailable.';
      }
    });
    peer.on('disconnected', () => {
      if (!roomCreateSettled) finishRoomCreateFailure('Lost connection while creating the room. Please try again.');
      else document.getElementById('connectionStatus').textContent = 'Room connection lost. Reconnect and try again.';
    });
  } catch (_) {
    finishRoomCreateFailure('Could not start room creation. Please try again.');
  }
};

const joinRoomBtn = document.getElementById('joinRoomBtn');
let joinAttemptTimer = null;
let joinAttemptSettled = false;
let joinCompleted = false;
function finishJoinFailure(message) {
  if (joinAttemptSettled) return;
  joinAttemptSettled = true;
  if (joinAttemptTimer) { clearTimeout(joinAttemptTimer); joinAttemptTimer = null; }
  if (hostConn) { try { hostConn.close(); } catch (_) {} hostConn = null; }
  if (peer) { try { peer.destroy(); } catch (_) {} peer = null; }
  joinRoomBtn.disabled = false;
  joinRoomBtn.textContent = 'JOIN';
  document.getElementById('connectionStatus').textContent = message;
  setServerStatus('OFFLINE',false);
}
joinRoomBtn.onclick = () => {
  const codeInput = document.getElementById('roomCodeInput');
  const code = codeInput.value.trim().toUpperCase();
  if (joinRoomBtn.disabled) return;
  if (!/^[A-Z0-9]{4}$/.test(code)) {
    document.getElementById('connectionStatus').textContent = 'Enter a valid 4-character room code.';
    codeInput.focus();
    return;
  }
  codeInput.value = code;
  state.isHost = false;
  state.roomCode = code;
  joinAttemptSettled = false;
  joinCompleted = false;
  joinRoomBtn.disabled = true;
  joinRoomBtn.textContent = 'JOINING…';
  document.getElementById('connectionStatus').textContent = 'Joining room ' + code + '...';
  joinAttemptTimer = setTimeout(() => {
    finishJoinFailure('Room not found / could not join. Check the code and try again.');
  }, 12000);
  try {
    peer = new Peer();
    bindIncomingVoiceCalls();
    peer.on('open', () => {
      if (joinAttemptSettled) return;
      try {
        hostConn = peer.connect('DOODLE_OUTPOST_' + code, { reliable: true });
        hostConn.on('open', () => {
          if (joinAttemptSettled) return;
          joinAttemptSettled = true;
          if (joinAttemptTimer) { clearTimeout(joinAttemptTimer); joinAttemptTimer = null; }
          joinRoomBtn.disabled = false;
          joinRoomBtn.textContent = 'JOIN';
          document.getElementById('connectionStatus').textContent = 'Joined! Waiting for Host to start...';
          hostConn.send({ type: 'join', id: state.myId, name: state.myName, charId: state.myCharId });
          if (voiceChat.stream) attachVoiceCall(peer.call(hostConn.peer, voiceChat.stream));
        });
        hostConn.on('data', (msg) => handleClientReceive(msg));
        hostConn.on('error', () => { if(!joinAttemptSettled)finishJoinFailure('Room not found / could not join. Check the code and try again.'); else if(joinCompleted){state.roomCode='';returnToLobby();document.getElementById('connectionStatus').textContent='Host disconnected. You have returned to the lobby.';} });
        hostConn.on('close', () => {
          if (!joinAttemptSettled) finishJoinFailure('Room not found / could not join. Check the code and try again.');
          else if(joinCompleted){ state.roomCode=''; returnToLobby(); document.getElementById('connectionStatus').textContent='Host disconnected. You have returned to the lobby.'; }
        });
      } catch (_) {
        finishJoinFailure('Could not connect to that room. Check the code and try again.');
      }
    });
    peer.on('error', (error) => {
      const unavailable = error && (error.type === 'peer-unavailable' || error.type === 'network' || error.type === 'server-error');
      finishJoinFailure(unavailable
        ? 'Room not found / could not join. Check the code and try again.'
        : 'Could not connect to that room. Please try again.');
    });
    peer.on('disconnected', () => finishJoinFailure('Connection lost while joining. Please try again.'));
  } catch (_) {
    finishJoinFailure('Could not start the join request. Please try again.');
  }
};

document.getElementById('soloBotsBtn').onclick = () => {
  state.isHost = true;
  state.roomCode = 'BOTS';
  state.matchTime = state.selectedDuration;
  state.players = {};
  state.players[state.myId] = createPlayer(state.myId, state.myName, state.myCharId, false, 0);
  addBotsUpTo(MAX_PLAYERS);
  syncPlayerTeams(); resetModeObjectives();
  startMatch();
};

function addBotsUpTo(limit) {
  const botNames = ['Sgt. Viper', 'Ghost_Ops', 'Major Boom', 'SniperWolf', 'Cpl. Tank'];
  let idx = Object.keys(state.players).length;
  let b = 0;
  while (idx < limit) {
    const bid = 'bot_' + idx;
    state.players[bid] = createPlayer(bid, botNames[b % botNames.length], (idx + 1) % CHARACTERS.length, true, idx);
    idx++; b++;
  }
}

function updateLobbyPlayersUI() {
  const playersArr = Object.values(state.players);
  document.getElementById('roomCountBadge').textContent = `${playersArr.length} / ${MAX_PLAYERS} Players`;
  const listEl = document.getElementById('lobbyPlayersList');
  listEl.innerHTML = '';
  playersArr.forEach((p) => {
    const chip = document.createElement('div');
    chip.className = 'player-chip';
    chip.dataset.host = String(!!state.isHost && p.id === state.myId);
    chip.textContent = `🪖 ${p.name} (${CHARACTERS[p.charId]?.name || 'Soldier'})`;
    listEl.appendChild(chip);
  });
  for (let slot = playersArr.length; slot < MAX_PLAYERS; slot++) {
    const empty = document.createElement('div');
    empty.className = 'player-chip empty-slot';
    empty.textContent = 'OPEN SLOT';
    listEl.appendChild(empty);
  }
}

// Copy the complete invite URL and expose the result as readable page text.
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyLinkStatus = document.getElementById('copyLinkStatus');
let copyLinkResetTimer = null;

function setCopyLinkStatus(message, isError = false) {
  if (copyLinkStatus) {
    copyLinkStatus.textContent = message;
    copyLinkStatus.classList.toggle('error', isError);
    copyLinkStatus.hidden = false;
  }
  copyLinkBtn.textContent = isError ? 'Copy Failed' : 'Copied!';
  if (copyLinkResetTimer) clearTimeout(copyLinkResetTimer);
  copyLinkResetTimer = setTimeout(() => {
    copyLinkBtn.textContent = '📋 Copy Link';
    if (copyLinkStatus) {
      copyLinkStatus.hidden = true;
      copyLinkStatus.textContent = '';
      copyLinkStatus.classList.remove('error');
    }
    copyLinkResetTimer = null;
  }, 4000);
}

function fallbackCopyText(text) {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, field.value.length);
  let copied = false;
  try { copied = document.execCommand('copy'); } catch (_) {}
  field.remove();
  return copied;
}

copyLinkBtn.onclick = async () => {
  const roomCode = String(state.roomCode || '').trim().toUpperCase();
  if (!roomCode) {
    setCopyLinkStatus('Create or join a room before copying an invite link.', true);
    return;
  }

  const invite = new URL(window.location.href);
  invite.searchParams.set('room', roomCode);
  invite.hash = '';
  const inviteUrl = invite.toString();

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(inviteUrl);
    } else if (!fallbackCopyText(inviteUrl)) {
      throw new Error('Clipboard access is unavailable');
    }
    setCopyLinkStatus(`Invite link copied for room ${roomCode}: ${inviteUrl}`);
  } catch (error) {
    // Try the legacy selection-based copy path when Clipboard API permissions fail.
    if (fallbackCopyText(inviteUrl)) {
      setCopyLinkStatus(`Invite link copied for room ${roomCode}: ${inviteUrl}`);
    } else {
      console.error('Could not copy invite link:', error);
      setCopyLinkStatus(`Copy failed. Share this link manually: ${inviteUrl}`, true);
    }
  }
};


// Leave this room (or close it if you are the host). This action is separate
// from EXIT TO LOBBY so navigating away from a match cannot destroy the room.
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
if (leaveRoomBtn) {
  leaveRoomBtn.onclick = () => {
    const isHost = Boolean(state.isHost);
    const message = isHost
      ? 'Close this room and disconnect all players?'
      : 'Leave this multiplayer room?';
    if (!window.confirm(message)) return;

    leaveRoomBtn.disabled = true;
    leaveRoomBtn.textContent = isHost ? 'CLOSING ROOM…' : 'LEAVING ROOM…';

    const finishLeaving = () => {
      if (hostConn) {
        try { hostConn.close(); } catch (error) { console.warn(error); }
        hostConn = null;
      }
      if (peer) {
        try { peer.destroy(); } catch (error) { console.warn(error); }
        peer = null;
      }
      window.location.reload();
    };

    if (isHost) {
      // Give the room-closed message a moment to reach connected players
      // before destroying the PeerJS host connection.
      broadcastToClients({ type: 'room_closed' });
      setTimeout(() => {
        Object.values(connections).forEach((connection) => {
          try { connection.close(); } catch (error) { console.warn(error); }
        });
        connections = {};
        finishLeaving();
      }, 250);
    } else {
      finishLeaving();
    }
  };
}

// If the host closes or navigates away from the page, notify connected guests.
// Browsers may terminate networking immediately on unload, so the explicit
// LEAVE / CLOSE ROOM control remains the reliable, acknowledged close path.
window.addEventListener('pagehide', () => {
  if (state.isHost && state.roomCode && state.roomCode !== 'BOTS') {
    try { broadcastToClients({ type: 'room_closed' }); } catch (_) {}
  }
});

document.getElementById('whatsappShareBtn').onclick = () => {
  const url = `${location.origin}${location.pathname}?room=${state.roomCode}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(`Join my Doodle Outpost match! Code: *${state.roomCode}* — ${url}`)}`, '_blank');
};

document.getElementById('startMatchBtn').onclick = () => {
  if (document.getElementById('fillBotsCheck').checked) addBotsUpTo(MAX_PLAYERS);
  state.matchTime = state.selectedDuration;
  syncPlayerTeams();
  Object.values(state.players).forEach((p, idx) => {
    const sp = (MAPS[state.mapId] || MAPS[0]).spawns[idx % 6];
    p.x = sp.x; p.y = sp.y; p.vx = 0; p.vy = 0; p.hp = p.maxHp || 100; p.armor = 0; p.kills = 0; p.deaths = 0;
  });
  state.bullets = []; state.grenades = []; state.clouds = []; state.fxList = []; state.killFeed = [];
  resetModeObjectives();
  broadcastToClients({ type: 'start', players: state.players, roomCode: state.roomCode, matchTime: state.matchTime, mapId: state.mapId, selectedMode: state.selectedMode });
  startMatch();
};

function handleHostReceive(conn, msg) {
  if (msg.type === 'join') {
    if (state.players[msg.id]) { conn.send({ type:'lobby_sync', players:state.players, mapId:state.mapId, selectedMode:state.selectedMode }); return; }
    const count = Object.keys(state.players).length;
    if (count >= MAX_PLAYERS) { try { conn.send({type:'room_full'}); } catch (_) {} setTimeout(()=>{try{conn.close();}catch(_){}},120); return; }
    conn.playerId = msg.id;
    connections[msg.id] = conn;
    state.players[msg.id] = createPlayer(msg.id, msg.name, msg.charId, false, count);
    if (voiceChat.stream) attachVoiceCall(peer.call(conn.peer, voiceChat.stream));
    updateLobbyPlayersUI();
    broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
    if (state.mode === 'playing') {
      conn.send({ type: 'start', players: state.players, roomCode: state.roomCode, matchTime: state.matchTime, mapId: state.mapId, selectedMode: state.selectedMode });
    }
  } else if (msg.type === 'input') {
    const p = state.players[msg.id];
    if (p) {
      p.remoteInput = msg.input;
      if (typeof msg.weaponIdx === 'number') p.weaponIdx = msg.weaponIdx;
      if(msg.use&&typeof msg.weaponIdx==='number'&&['heal','ammo_boost','armor_boost'].includes(WEAPONS[msg.weaponIdx]?.type)){p.weaponIdx=msg.weaponIdx;fireWeapon(p,performance.now());}
      if (msg.throwGrenade) spawnGrenade(p, msg.grenadeType ?? 0);
    }
  } else if (msg.type === 'leave') {
    const playerId=msg.id;
    if(playerId&&state.players[playerId]){delete state.players[playerId];delete connections[playerId];updateLobbyPlayersUI();broadcastToClients({type:'lobby_sync',players:state.players,mapId:state.mapId,selectedMode:state.selectedMode});}
    try{conn.close();}catch(_){}
  } else if (msg.type === 'adjust_time') {
    state.matchTime = Math.max(10, Math.min(3600, state.matchTime + msg.delta));
  }
}

function handleClientReceive(msg) {
  if (msg.type === 'room_full') { joinAttemptSettled=false; finishJoinFailure('This room is full (6/6).'); return; }
  if (msg.type === 'fx') { if(msg.fx && state.fxList.length<180)state.fxList.push(msg.fx); }
  else if (msg.type === 'lobby_sync') {
    if(!state.isHost)joinCompleted=true;
    state.players = msg.players;
    state.mapId = msg.mapId || 0;
    if (msg.selectedMode) state.selectedMode = msg.selectedMode;
    renderModeSelection();
    mapSelectEl.value = String(state.mapId);
    syncLobbyMapPreview();
    document.getElementById('waitingRoom').classList.remove('hidden');
    document.getElementById('displayRoomCode').textContent = state.roomCode;
    document.getElementById('startMatchBtn').classList.add('hidden');
    updateLobbyPlayersUI();
  } else if (msg.type === 'start') {
    if(!state.isHost)joinCompleted=true;
    state.players = msg.players;
    state.roomCode = msg.roomCode;
    state.matchTime = msg.matchTime;
    state.mapId = msg.mapId || 0;
    if (msg.selectedMode) state.selectedMode = msg.selectedMode;
    renderModeSelection();
    document.getElementById('matchOverModal').classList.add('hidden');
    startMatch();
  } else if (msg.type === 'state') {
    state.players = msg.players;
    Object.values(state.players).forEach(p=>{p.facing=Math.cos(p.aimAngle||0)>=0?1:-1;p.jetFuel=100;});
    state.ctfFlags=msg.ctfFlags||state.ctfFlags;state.ctfScore=msg.ctfScore||state.ctfScore;state.boss=msg.boss||state.boss;state.battleZone=msg.battleZone||state.battleZone;
    state.zombies = msg.zombies || [];
    state.zombieWave = msg.zombieWave || 1;
    state.zombieKills = msg.zombieKills || 0;
    state.bullets = msg.bullets;
    state.grenades = msg.grenades;
    state.clouds = msg.clouds;
    state.killFeed = msg.killFeed;
    state.matchTime = msg.matchTime;
    state.mapId = msg.mapId || 0;
  } else if (msg.type === 'return_lobby') {
    returnToLobby(true);
  } else if (msg.type === 'room_closed') {
    alert('The room host has closed this room.');
    if (hostConn) {
      try { hostConn.close(); } catch (error) { console.warn(error); }
      hostConn = null;
    }
    if (peer) {
      try { peer.destroy(); } catch (error) { console.warn(error); }
      peer = null;
    }
    window.location.reload();
  }
}

function broadcastToClients(payload) {
  Object.values(connections).forEach((c) => { if (c.open) c.send(payload); });
}

// ==========================================================================
// 7. INPUTS (PC KEYBOARD/MOUSE + MOBILE DUAL JOYSTICKS)
// ==========================================================================
if (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0) {
  document.documentElement.classList.add('has-touch-input');
}
const input = { moveX: 0, moveY: 0, aimX: 1, aimY: 0, shooting: false };
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (state.mode !== 'playing') return;
  if (e.code === 'Digit1') selectWeapon(0);
  if (e.code === 'Digit2') selectWeapon(1);
  if (e.code === 'Digit3') selectWeapon(2);
  if (e.code === 'Digit4') selectWeapon(3);
  if (e.code === 'Digit5') selectWeapon(4);
  if (e.code === 'Digit6') selectWeapon(5);
  if (e.code === 'Digit7') selectWeapon(6);
  if (e.code === 'Digit8') selectWeapon(7);
  if (e.code === 'Digit9') selectWeapon(8);
  if (e.code === 'Digit0') selectWeapon(9);
  if (e.code === 'KeyQ') cycleWeapon();
  if (e.code === 'KeyF') cycleGrenadeType();
  if (e.code === 'KeyG' || e.code === 'KeyE') triggerGrenade();
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') state.sniperZoom = !state.sniperZoom;
  if (e.code === 'Tab') { e.preventDefault(); toggleScoreboard(); }
});
window.addEventListener('keyup',(e)=>{keys[e.code]=false;});
function clearHeldInput(){Object.keys(keys).forEach(k=>keys[k]=false);input.moveX=0;input.moveY=0;input.shooting=false;}
window.addEventListener('blur',clearHeldInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearHeldInput();});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

window.addEventListener('mousemove', (e) => {
  if (state.mode !== 'playing') return;
  const dx = e.clientX - viewWidth / 2;
  const dy = e.clientY - viewHeight / 2;
  const len = Math.hypot(dx, dy) || 1;
  input.aimX = dx / len;
  input.aimY = dy / len;
});

window.addEventListener('mousedown', (e) => {
  if (state.mode !== 'playing' || e.target.tagName === 'BUTTON') return;
  if (e.button === 0) input.shooting = true;
  if (e.button === 2) triggerGrenade();
});
window.addEventListener('mouseup', (e) => { if (e.button === 0) input.shooting = false; });
window.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('wheel', () => { if (state.mode === 'playing') cycleWeapon(); });

function bindVirtualStick(zoneId, knobId, onMove, onRelease) {
  const zone = document.getElementById(zoneId);
  const knob = document.getElementById(knobId);
  let activeId = null;

  zone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    activeId = t.identifier;
    handleTouch(t);
  }, { passive: false });

  zone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeId) handleTouch(e.changedTouches[i]);
    }
  }, { passive: false });

  const endTouch = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeId) {
        activeId = null;
        knob.style.transform = 'translate(0px, 0px)';
        onRelease();
      }
    }
  };
  zone.addEventListener('touchend', endTouch);
  zone.addEventListener('touchcancel', endTouch);

  function handleTouch(t) {
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = 36;
    let dx = t.clientX - cx;
    let dy = t.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
    onMove(dx / maxR, dy / maxR);
  }
}

bindVirtualStick('leftStickZone', 'leftKnob', (nx, ny) => { input.moveX = nx; input.moveY = ny; }, () => { input.moveX = 0; input.moveY = 0; });
bindVirtualStick('rightStickZone', 'rightKnob', (nx, ny) => {
  const len = Math.hypot(nx, ny);
  if (len > 0.15) { input.aimX = nx / len; input.aimY = ny / len; input.shooting = len > 0.35; }
}, () => { input.shooting = false; });

document.getElementById('btnSwap').onclick = cycleWeapon;
document.getElementById('btnGrenade').onclick = triggerGrenade;
document.getElementById('btnGrenadeType').onclick = cycleGrenadeType;
document.getElementById('btnZoom').onclick = () => { state.sniperZoom = !state.sniperZoom; };
document.getElementById('toggleScoreboardBtn').onclick = toggleScoreboard;
document.getElementById('closeSbBtn').onclick = toggleScoreboard;
document.getElementById('leaveMatchBtn').onclick = returnToLobby;
document.getElementById('matchOverLobbyBtn').onclick = returnToLobby;
document.getElementById('rematchBtn').onclick = () => {
  if (!state.isHost) return;
  document.getElementById('matchOverModal').classList.add('hidden');
  state._progressAwarded = false;
  state.matchTime = state.selectedDuration;
  Object.values(state.players).forEach((p, idx) => {
    const sp = (MAPS[state.mapId] || MAPS[0]).spawns[idx % 6];
    p.x = sp.x; p.y = sp.y; p.vx = 0; p.vy = 0;
    p.hp = p.maxHp || 100; p.armor = 0; p.kills = 0; p.deaths = 0;
    p.deadTimer = 0; p.lastShot = 0; p.lastGrenade = 0;
  });
  state.bullets = []; state.grenades = []; state.clouds = []; state.fxList = []; state.killFeed = [];
  resetModeObjectives(); syncPlayerTeams();
  broadcastToClients({ type: 'start', players: state.players, roomCode: state.roomCode, matchTime: state.matchTime, mapId: state.mapId, selectedMode: state.selectedMode });
  startMatch();
};

function selectWeapon(idx) {
  const me = state.players[state.myId];
  if (!me) return;
  me.weaponIdx = idx;
  document.querySelectorAll('.w-slot').forEach((b) => b.classList.toggle('active', parseInt(b.dataset.w) === idx));
  document.getElementById('hudWeaponName').textContent = WEAPONS[idx].name;

  // Instant self-use if player taps Medkit, Ammo Crate, or Gear Crate slot directly
  const w = WEAPONS[idx];
  if (state.isHost && (w.type === 'heal' || w.type === 'ammo_boost' || w.type === 'armor_boost')) {
    fireWeapon(me, performance.now());
  }
  if(!state.isHost&&hostConn&&hostConn.open){const use=['heal','ammo_boost','armor_boost'].includes(w.type);hostConn.send({type:'input',id:state.myId,input,weaponIdx:idx,use});}
}

function cycleWeapon() {
  const me = state.players[state.myId];
  if (me) selectWeapon((me.weaponIdx + 1) % WEAPONS.length);
}

function cycleGrenadeType() {
  state.myGrenadeType = (state.myGrenadeType + 1) % GRENADE_TYPES.length;
  const gInfo = GRENADE_TYPES[state.myGrenadeType];
  document.getElementById('btnGrenadeType').innerHTML = `${gInfo.label}<small>TYPE</small>`;
}

function triggerGrenade() {
  const me = state.players[state.myId];
  if (!me || me.hp <= 0) return;
  if (state.isHost) spawnGrenade(me, state.myGrenadeType);
  else if (hostConn && hostConn.open) {
    hostConn.send({ type: 'input', id: state.myId, input, throwGrenade: true, grenadeType: state.myGrenadeType });
  }
}

function toggleScoreboard() {
  const sb = document.getElementById('scoreboardModal');
  sb.classList.toggle('hidden');
  if (!sb.classList.contains('hidden')) renderScoreboard();
}

function renderScoreboard() {
  document.getElementById('hudRoomCode').textContent = state.roomCode;
  const rows = document.getElementById('scoreboardRows');
  rows.innerHTML = '';
  Object.values(state.players).sort((a, b) => b.kills - a.kills).forEach((p) => {
    const div = document.createElement('div');
    div.className = 'sb-row';
    const canAdd = p.id !== state.myId && !p.isBot;
    div.innerHTML = `
      <span>🪖 ${p.name} <small>(${CHARACTERS[p.charId]?.name || 'Soldier'})</small></span>
      <span>Kills: <b>${p.kills}</b> | Deaths: ${p.deaths}</span>
      ${canAdd ? `<button class="btn-sm" onclick="saveFriend('${p.id}','${p.name}');this.textContent='⭐ Saved'">+ Friend</button>` : ''}
    `;
    rows.appendChild(div);
  });
}

// ==========================================================================
// 8. SIMULATION, UTILITY CRATES (MEDKIT/AMMO/ARMOR) & MATCH OVER
// ==========================================================================
function addFxSprite(fxKey, x, y, size, life, eventName = null) {
  if (state.fxList.length >= 180) state.fxList.shift();
  const fx={fxKey,x,y,size,life,maxLife:life}; state.fxList.push(fx);
  if(state.isHost&&state.mode==='playing'&&peer&&state.roomCode&&state.roomCode!=='BOTS'&&['sparks','explosion','smokeGreen'].includes(fxKey))broadcastToClients({type:'fx',event:eventName||(fxKey==='explosion'?'explode':'effect'),fx});
}

let matchStarting = false;
async function startMatch() {
  if (matchStarting || state.mode === 'playing') return;

  const startToken = ++matchStartToken;
  matchStarting = true;
  state._progressAwarded = false;

  try {
    // Wait for the game assets before exposing the match UI.
    await assetsReady;
    if (startToken !== matchStartToken) return;

    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape');
      }
    } catch (_) {}

    if (startToken !== matchStartToken) return;

    state.mode = 'playing';
    document.getElementById('lobbyScreen').classList.add('hidden');
    settingsDrawer.classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('scoreboardModal').classList.add('hidden');
    document.getElementById('matchOverModal').classList.add('hidden');

    syncSoldierUI();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    lastFrameTime = performance.now();

    if (gameLoopRafId !== null) cancelAnimationFrame(gameLoopRafId);
    gameLoopRafId = requestAnimationFrame(gameLoop);
  } catch (error) {
    console.error('Could not start match:', error);
    state.mode = 'menu';
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('lobbyScreen').classList.remove('hidden');
    document.getElementById('connectionStatus').textContent = 'Could not load the match. Please try again.';
  } finally {
    if (startToken === matchStartToken) matchStarting = false;
  }
}

// Return to the lobby without a page reload. This stops the render loop,
// clears match-only state, and tears down any room connection cleanly.
function returnToLobby(keepJoinedRoom = false) {
  ++matchStartToken; matchStarting=false;
  if(gameLoopRafId!==null){cancelAnimationFrame(gameLoopRafId);gameLoopRafId=null;}
  window.removeEventListener('resize',resizeCanvas);
  const wasRoom=Boolean(state.roomCode&&state.roomCode!=='BOTS'), wasHost=Boolean(state.isHost);
  const preserveRoom=wasRoom&&(wasHost||keepJoinedRoom);
  if(!preserveRoom){
    if(wasRoom&&!wasHost&&hostConn&&hostConn.open){try{hostConn.send({type:'leave',id:state.myId});}catch(_){}}
    joinCompleted=false;
    Object.values(connections).forEach(c=>{try{c.close();}catch(_){}}); connections={};
    if(hostConn){try{hostConn.close();}catch(_){}hostConn=null;}
    if(peer){try{peer.destroy();}catch(_){}peer=null;}
    state.players={};state.roomCode='';state.isHost=true;
  } else if(wasHost) broadcastToClients({type:'return_lobby',players:state.players,mapId:state.mapId,selectedMode:state.selectedMode});
  state.mode='menu';state.matchTime=state.selectedDuration;
  state.bullets=[];state.grenades=[];state.clouds=[];state.fxList=[];state.killFeed=[];
  state.zombies=[];state.zombieKills=0;state.zombieWave=1;state.ctfFlags=null;state.ctfScore=[0,0];state.boss=null;state._progressAwarded=false;
  document.getElementById('gameContainer').classList.add('hidden');document.getElementById('lobbyScreen').classList.remove('hidden');
  document.getElementById('waitingRoom').classList.toggle('hidden',!preserveRoom);
  document.getElementById('scoreboardModal').classList.add('hidden');document.getElementById('matchOverModal').classList.add('hidden');document.getElementById('settingsDrawer').classList.add('hidden');
  const hub=document.getElementById('modeHub');if(hub)hub.classList.add('hidden');
  document.getElementById('displayRoomCode').textContent=preserveRoom?state.roomCode:'----';
  document.getElementById('connectionStatus').textContent=preserveRoom?(wasHost?'Room stays open. Invite players or start another match.':'Back in the room lobby. Waiting for the host.'):'Back in the lobby. Ready for another deployment.';
  document.getElementById('matchTimer').textContent=formatClock(state.matchTime);
  if(preserveRoom){updateLobbyPlayersUI();document.getElementById('startMatchBtn').classList.toggle('hidden',!wasHost);}
}

let viewWidth = 0, viewHeight = 0, renderDpr = 1;
function resizeCanvas() {
  viewWidth = Math.max(1, canvas.clientWidth || window.innerWidth);
  viewHeight = Math.max(1, canvas.clientHeight || window.innerHeight);
  renderDpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(viewWidth * renderDpr);
  canvas.height = Math.round(viewHeight * renderDpr);
  ctx.setTransform(renderDpr, 0, 0, renderDpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
}

function updateKeyboardInput() {
  let kx = 0, ky = 0;
  if (keys['KeyA'] || keys['ArrowLeft']) kx -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) kx += 1;
  if (keys['KeyW'] || keys['ArrowUp'] || keys['Space']) ky -= 1;
  if (keys['KeyS'] || keys['ArrowDown']) ky += 1;
  if (kx !== 0 || ky !== 0) { input.moveX = kx; input.moveY = ky; }
  else if (!('ontouchstart' in window)) { input.moveX = 0; input.moveY = 0; }
}

function showMatchOverScreen() {
  awardMatchProgress();
  const modeBadge=document.querySelector('#matchOverModal .pill-badge');if(modeBadge)modeBadge.textContent=getModeLabel().toUpperCase()+' • MATCH COMPLETE';
  state.mode = 'gameover';
  const rows = document.getElementById('finalLeaderboardRows');
  rows.innerHTML = '';
  const standings = Object.values(state.players).sort((a, b) => b.kills - a.kills);
  const me = state.players[state.myId];
  const myRank = standings.findIndex((p) => p.id === state.myId);
  const resultTitle = document.getElementById('matchResultTitle');
  if (resultTitle) resultTitle.textContent = myRank === 0 ? 'VICTORY' : 'MATCH COMPLETE';
  const statKills = document.getElementById('finalKills');
  const statDeaths = document.getElementById('finalDeaths');
  const statWins = document.getElementById('finalWins');
  if (statKills) statKills.textContent = String(me ? me.kills : 0);
  if (statDeaths) statDeaths.textContent = String(me ? me.deaths : 0);
  if (statWins) statWins.textContent = String(operatorProfile.wins);
  const xpText = document.getElementById('finalXpText');
  const xpFill = document.getElementById('finalXpFill');
  if (xpText) xpText.textContent = (operatorProfile.xp % 250) + ' / 250 XP';
  if (xpFill) xpFill.style.width = ((operatorProfile.xp % 250) / 250 * 100) + '%';
  standings.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'sb-row';
    row.innerHTML = `<span>#${i + 1} ${p.name}</span><span>Kills: <b>${p.kills}</b> • Deaths: ${p.deaths}</span>`;
    rows.appendChild(row);
  });
  document.getElementById('rematchBtn').classList.toggle('hidden', !state.isHost);
  document.getElementById('matchOverModal').classList.remove('hidden');
}

let lastStateBroadcastAt=0,lastInputSentAt=0,lastInputSignature='';
function gameLoop(now) {
  const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
  lastFrameTime = now;
  updateKeyboardInput();

  if (state.mode === 'playing') {
    if (state.isHost) {
      stepHostSimulation(dt, now);
      if(now-lastStateBroadcastAt>=50){
        lastStateBroadcastAt=now;
        const players=Object.fromEntries(Object.entries(state.players).map(([id,p])=>[id,{id,x:p.x,y:p.y,hp:p.hp,armor:p.armor,weaponIdx:p.weaponIdx,aimAngle:p.aimAngle,name:p.name,charId:p.charId,kills:p.kills,deaths:p.deaths,team:p.team}]));
        broadcastToClients({type:'state',players,zombies:state.zombies||[],zombieWave:state.zombieWave||1,zombieKills:state.zombieKills||0,ctfFlags:state.ctfFlags,ctfScore:state.ctfScore,boss:state.boss,battleZone:state.battleZone,bullets:state.bullets,grenades:state.grenades,clouds:state.clouds,killFeed:state.killFeed,matchTime:state.matchTime,mapId:state.mapId});
      }
    } else if(hostConn&&hostConn.open){
      const signature=JSON.stringify(input);
      if(now-lastInputSentAt>=33&&(signature!==lastInputSignature||now-lastInputSentAt>=100)){hostConn.send({type:'input',id:state.myId,input,weaponIdx:state.players[state.myId]?.weaponIdx});lastInputSentAt=now;lastInputSignature=signature;}
    }

    checkObjectiveEnd();
    if (state.matchTime <= 0) {
      showMatchOverScreen();
    }
  }

  if(!state.isHost&&state.fxList.length){state.fxList.forEach(fx=>{fx.life-=dt;});state.fxList=state.fxList.filter(fx=>fx.life>0);}
  updateProximityVoiceVolumes();
  updateCamera();
  renderGame();
  updateHudUI();
  gameLoopRafId = state.mode === 'playing' ? requestAnimationFrame(gameLoop) : null;
}

function stepHostSimulation(dt, now) {
  state.matchTime = Math.max(0, state.matchTime - dt);
  const platforms = getActivePlatforms();
  const activeMap = MAPS[getActiveMapId()] || MAPS[0];

  Object.values(state.players).forEach((p, idx) => {
    if (p.boostTimer > 0) p.boostTimer = Math.max(0, p.boostTimer - dt);

    if (p.hp <= 0) {
      p.deadTimer -= dt;
      if (p.deadTimer <= 0 && state.selectedMode !== 'br') {
        const sp = activeMap.spawns[(idx + Math.floor(Math.random() * 6)) % activeMap.spawns.length];
        p.x = sp.x; p.y = sp.y; p.vx = 0; p.vy = 0; p.hp = 100; p.armor = 0;
      }
      return;
    }

    let ctrl = input;
    if (p.isBot) ctrl = computeBotAI(p, dt);
    else if (p.id !== state.myId) ctrl = p.remoteInput || { moveX: 0, moveY: 0, aimX: 1, aimY: 0, shooting: false };

    p.vx = ctrl.moveX * 350;
    if (ctrl.moveY < -0.22 && (p.jetFuel == null || p.jetFuel > 0)) {
      p.jetFuel = Math.max(0, (p.jetFuel == null ? 100 : p.jetFuel) - 34 * dt);
      p.vy += ctrl.moveY * 1450 * dt;
      p.vy = Math.max(p.vy, -460);
      if (Math.random() < .45) {
        addFxSprite('fire', p.x - p.facing * 14, p.y + 24, 30 + Math.random()*12, .2);
        if (Math.random() < .45) addFxSprite('smokeWhite', p.x - p.facing*18, p.y+32, 24, .34);
      }
    } else {
      p.jetFuel = Math.min(100, (p.jetFuel == null ? 100 : p.jetFuel) + 19 * dt);
      p.vy = Math.min(p.vy + 980 * dt, 680);
    }

    p.aimAngle = Math.atan2(ctrl.aimY, ctrl.aimX);
    p.facing = Math.cos(p.aimAngle) >= 0 ? 1 : -1;
    moveAndCollide(p, dt, platforms);

    if (ctrl.shooting) fireWeapon(p, now);
  });

  // Zombie Survival: host-authoritative enemy waves.
  if (state.selectedMode === 'zombie') {
    state.zombies = state.zombies || [];
    state.zombieKills = state.zombieKills || 0;
    state.zombieWave = Math.min(10, Math.floor(state.zombieKills / 8) + 1);
    state.zombieSpawnClock = (state.zombieSpawnClock || 0) - dt;
    const aliveSurvivors = Object.values(state.players).filter(p => p.hp > 0);
    if (aliveSurvivors.length === 0) {
      state.matchTime = 0;
    } else {
      if (state.zombieSpawnClock <= 0 && state.zombies.length < Math.min(18, 5 + state.zombieWave * 2)) {
        const edge = Math.random() < .5 ? 45 : WORLD.width - 45;
        state.zombies.push({ id:'z_'+Math.random().toString(36).slice(2),x:edge,y:900,hp:55+state.zombieWave*8,maxHp:55+state.zombieWave*8,speed:68+state.zombieWave*5,attackClock:0,wave:state.zombieWave,spriteIdx:Math.random()<.22?1:0 });
        state.zombieSpawnClock = Math.max(.65, 2.8 - state.zombieWave * .16);
      }
      
      for (let zi = state.zombies.length - 1; zi >= 0; zi--) {
        const z = state.zombies[zi];
        let target = null, nearest = Infinity;
        aliveSurvivors.forEach(p => { const d = Math.hypot(p.x-z.x,p.y-z.y); if (d < nearest) { nearest=d; target=p; } });
        if (!target) continue;
        const dx = target.x-z.x, dy = target.y-z.y;
        z.x += Math.sign(dx) * z.speed * dt;
        z.y += Math.max(-1, Math.min(1, dy / 80)) * z.speed * .22 * dt;
        z.attackClock -= dt;
        if (nearest < 48 && z.attackClock <= 0) {
          damagePlayer(target, 12, null, 'ZOMBIE CLAWS');
          z.attackClock = .9;
        }
        for (let bi = state.bullets.length - 1; bi >= 0; bi--) {
          const bullet = state.bullets[bi];
          if (Math.hypot(bullet.x-z.x, bullet.y-z.y) < 28) {
            z.hp -= bullet.damage || 12;
            state.bullets.splice(bi, 1);
            if (z.hp <= 0) {
              const killer = state.players[bullet.ownerId];
              if (killer) killer.kills++;
              state.zombieKills = (state.zombieKills || 0) + 1;
              state.zombieWave = Math.min(10, Math.floor(state.zombieKills / 8) + 1);
              addFxSprite('explosion', z.x, z.y, 70, .3);
              state.zombies.splice(zi, 1);
            }
            break;
          }
        }
      }
    }
  }

  // Co-op boss movement and close-range attacks.
  if(state.selectedMode==='boss' && state.boss && state.boss.hp>0){
    const boss=state.boss, survivors=Object.values(state.players).filter(p=>p.hp>0);
    if(survivors.length){ let target=survivors[0], nearest=Infinity; survivors.forEach(p=>{const d=Math.hypot(p.x-boss.x,p.y-boss.y);if(d<nearest){nearest=d;target=p;}});
      boss.x+=Math.sign(target.x-boss.x)*(42+(1-boss.hp/boss.maxHp)*35)*dt;
      boss.y+=Math.max(-1,Math.min(1,(target.y-boss.y)/180))*24*dt; boss.phase=boss.hp<boss.maxHp*.35?3:boss.hp<boss.maxHp*.7?2:1;
      boss.attackClock-=dt; if(nearest<108 && boss.attackClock<=0){damagePlayer(target,24+boss.phase*5,null,'OUTPOST TITAN');boss.attackClock=Math.max(.55,1.35-boss.phase*.2);}
    }
  }
  // CTF flags follow carriers; capture requires your own flag at home.
  if(state.selectedMode==='ctf' && state.ctfFlags){
    state.ctfFlags.forEach(flag=>{const carrier=flag.carrierId&&state.players[flag.carrierId];if(carrier&&carrier.hp>0){flag.x=carrier.x;flag.y=carrier.y-42;}else if(flag.carrierId){flag.carrierId=null;flag.x=flag.homeX;flag.y=flag.homeY;}});
    Object.values(state.players).forEach(p=>{if(p.hp<=0)return;const own=state.ctfFlags[p.team],enemy=state.ctfFlags[1-p.team];
      if(enemy.carrierId===p.id){if(Math.hypot(p.x-own.homeX,p.y-own.homeY)<78&&!own.carrierId&&own.x===own.homeX){state.ctfScore[p.team]++;enemy.carrierId=null;enemy.x=enemy.homeX;enemy.y=enemy.homeY;p.carryingFlag=null;state.killFeed.unshift(p.name+' CAPTURED THE FLAG!');state.killFeed.length=Math.min(4,state.killFeed.length);}}
      else if(!enemy.carrierId&&Math.hypot(p.x-enemy.x,p.y-enemy.y)<42){enemy.carrierId=p.id;p.carryingFlag=enemy.team;}
      if(!own.carrierId&&(own.x!==own.homeX||own.y!==own.homeY)&&Math.hypot(p.x-own.x,p.y-own.y)<42){own.x=own.homeX;own.y=own.homeY;}
    });
  }
  // Battle Royale zone contracts and damages players outside its boundary.
  if(state.selectedMode==='br'){const zone=state.battleZone;zone.radius=Math.max(zone.minRadius,zone.radius-3.8*dt);Object.values(state.players).forEach(p=>{if(p.hp>0&&Math.hypot(p.x-zone.x,p.y-zone.y)>zone.radius)damagePlayer(p,9*dt,null,'OUTSIDE THE ZONE');});}

  // Bullets & Rockets
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const b = state.bullets[i];
    b.x += b.vx; b.y += b.vy; b.life -= dt;

    const hitWall = platforms.some((pl) => b.x > pl.x && b.x < pl.x + pl.w && b.y > pl.y && b.y < pl.y + pl.h);
    if(state.selectedMode==='boss'&&state.boss&&state.boss.hp>0&&Math.hypot(b.x-state.boss.x,b.y-state.boss.y)<76){const shooter=state.players[b.ownerId],key=b.ownerId||'unknown',now=performance.now(),last=bossDamageCooldowns.get(key)||0,sniper=shooter&&WEAPONS[shooter.weaponIdx]?.type==='sniper',cooldown=sniper?500:180;if(now-last>=cooldown){const raw=b.damage||12,damage=sniper?Math.min(raw,85):Math.min(30,Math.max(1,Math.round(raw*.35)));state.boss.hp=Math.max(0,state.boss.hp-damage);bossDamageCooldowns.set(key,now);addFxSprite('sparks',b.x,b.y,44,.2);}state.bullets.splice(i,1);continue;}
    let hitPlayer = null;

    for (const p of Object.values(state.players)) {
      if (p.id !== b.ownerId && p.hp > 0 && Math.abs(b.x - p.x) < 24 && Math.abs(b.y - p.y) < 32) {
        const activeW = WEAPONS[p.weaponIdx];
        const bulletFromFront = Math.cos(p.aimAngle) * b.vx < 0;
        if (activeW && activeW.type === 'shield' && bulletFromFront) {
          addFxSprite('sparks', b.x, b.y, 44, 0.22);
          hitPlayer = 'BLOCKED';
        } else {
          hitPlayer = p;
        }
        break;
      }
    }

    if (hitWall || hitPlayer || b.life <= 0) {
      if (b.type === 'rocket') explodeBlast(b.x, b.y, b.ownerId, 135, 95, 'ROCKET RPG');
      else if (hitPlayer && hitPlayer !== 'BLOCKED') {
        addFxSprite('sparks', b.x, b.y, 38, 0.2);
        damagePlayer(hitPlayer, b.damage, b.ownerId, b.weaponName);
      } else if (hitWall) { addFxSprite('sparks', b.x, b.y, 38, .24); addFxSprite('dust', b.x, b.y, 24, .18); }
      state.bullets.splice(i, 1);
    }
  }

  // Grenades
  for (let i = state.grenades.length - 1; i >= 0; i--) {
    const g = state.grenades[i];
    g.vy += 850 * dt; g.x += g.vx * dt; g.y += g.vy * dt; g.fuse -= dt;
    for (const pl of platforms) {
      if (g.x > pl.x && g.x < pl.x + pl.w && g.y > pl.y && g.y < pl.y + pl.h) {
        g.vy *= -0.45; g.vx *= 0.7; g.y = pl.y - 4;
      }
    }
    if (g.fuse <= 0) {
      if (g.gType === 0) explodeBlast(g.x, g.y, g.ownerId, 150, 100, 'FRAG GRENADE');
      else if (g.gType === 1) state.clouds.push({ x: g.x, y: g.y, r: 135, life: 7.0, kind: 'gas', ownerId: g.ownerId });
      else state.clouds.push({ x: g.x, y: g.y, r: 165, life: 9.0, kind: 'smoke', ownerId: g.ownerId });
      state.grenades.splice(i, 1);
    }
  }

  // Gas & Smoke Clouds
  for (let i = state.clouds.length - 1; i >= 0; i--) {
    const cl = state.clouds[i];
    cl.life -= dt;
    if (cl.kind === 'gas') {
      Object.values(state.players).forEach((p) => {
        if (p.hp > 0 && Math.hypot(p.x - cl.x, p.y - cl.y) < cl.r) damagePlayer(p, 28 * dt, cl.ownerId, 'GREEN GAS');
      });
    }
    if (cl.life <= 0) state.clouds.splice(i, 1);
  }

  for (let i = state.fxList.length - 1; i >= 0; i--) {
    const fx = state.fxList[i]; fx.life -= dt;
    if (fx.fxKey === 'casing') { fx.x += fx.vx*dt; fx.y += fx.vy*dt; fx.vy += 360*dt; }
    if (fx.life <= 0) state.fxList.splice(i, 1);
  }
}

function moveAndCollide(p, dt, platforms) {
  const hw = 18, hh = 30;
  p.x += p.vx * dt;
  for (const pl of platforms) {
    if (p.x + hw > pl.x && p.x - hw < pl.x + pl.w && p.y + hh > pl.y && p.y - hh < pl.y + pl.h) {
      p.x = p.vx > 0 ? pl.x - hw : pl.x + pl.w + hw;
    }
  }
  p.y += p.vy * dt;
  for (const pl of platforms) {
    if (p.x + hw > pl.x && p.x - hw < pl.x + pl.w && p.y + hh > pl.y && p.y - hh < pl.y + pl.h) {
      if (p.vy > 0) { p.y = pl.y - hh; p.vy = 0; }
      else if (p.vy < 0) { p.y = pl.y + pl.h + hh; p.vy = 0; }
    }
  }
}

function fireWeapon(p, now) {
  const w = WEAPONS[p.weaponIdx];
  const effectiveRate = p.boostTimer > 0 ? w.rate * 0.55 : w.rate;
  if (now - p.lastShot < effectiveRate) return;
  p.lastShot = now;
  playWeaponSound(p, p.weaponIdx);

  // Slot 10: Medkit Box (+40 HP Heal)
  if (w.type === 'heal') {
    p.hp = Math.min(p.maxHp, p.hp + 40);
    addFxSprite('sparks', p.x, p.y, 68, 0.35);
    return;
  }

  // Slot 8: Ammo Crate (6-Second 2x Fire Rate & +25% Damage Boost)
  if (w.type === 'ammo_boost') {
    p.boostTimer = 6.0;
    addFxSprite('sparks', p.x, p.y, 74, 0.4);
    return;
  }

  // Slot 9: Gear Crate (+50 Armor Shield)
  if (w.type === 'armor_boost') {
    p.armor = Math.min(100, (p.armor || 0) + 50);
    addFxSprite('sparks', p.x, p.y, 74, 0.4);
    return;
  }

  // Slot 1 & 5: Riot Shield Bash & Chainsaw
  if (w.type === 'shield' || w.type === 'melee') {
    const rx = p.x + Math.cos(p.aimAngle) * 40;
    const ry = p.y + Math.sin(p.aimAngle) * 40;
    if (w.type === 'melee') addFxSprite('sparks', rx, ry, 42, 0.16);
    Object.values(state.players).forEach((t) => {
      if (t.id !== p.id && t.hp > 0 && Math.hypot(t.x - rx, t.y - ry) < 42) damagePlayer(t, w.damage, p.id, w.name);
    });
    return;
  }

  const mx = p.x + Math.cos(p.aimAngle) * 30;
  const my = p.y + Math.sin(p.aimAngle) * 30;
  addFxSprite('muzzle', mx, my, 36, .12);
  if (w.speed > 0 && w.type !== 'rocket' && state.fxList.length < 180) state.fxList.push({
    fxKey:'casing', x:p.x-Math.sin(p.aimAngle)*9, y:p.y+4,
    vx:-Math.cos(p.aimAngle)*70+(Math.random()-.5)*35, vy:-90-Math.random()*45,
    life:.42, maxLife:.42, size:4
  });
  if (w.type === 'sniper' || w.type === 'rocket' || w.id === 5)
    state.camera.shake = Math.max(state.camera.shake || 0, w.type === 'rocket' ? 9 : w.id === 5 ? 5 : 3.5);

  const dmgMult = p.boostTimer > 0 ? 1.25 : 1.0;
  for (let i = 0; i < w.count; i++) {
    const offset = w.count === 2 ? (i === 0 ? -5 : 5) : 0;
    const ang = p.aimAngle + (Math.random() - 0.5) * w.spread;
    state.bullets.push({
      x: mx, y: my + offset,
      vx: Math.cos(ang) * w.speed, vy: Math.sin(ang) * w.speed,
      damage: Math.round(w.damage * dmgMult), ownerId: p.id,
      weaponName: w.name, color: w.color, type: w.type, life: 1.8
    });
  }
}

function spawnGrenade(p, gType = 0) {
  const now = performance.now();
  if (now - p.lastGrenade < 420) return;
  p.lastGrenade = now;
  state.grenades.push({
    x: p.x + p.facing * 20, y: p.y - 8,
    vx: Math.cos(p.aimAngle) * 560, vy: Math.sin(p.aimAngle) * 560 - 140,
    fuse: 1.5, gType, ownerId: p.id
  });
}

function explodeBlast(x, y, ownerId, radius, maxDmg, label) {
  addFxSprite('explosion', x, y, radius * 1.45, 0.45);
  state.camera.shake = Math.max(state.camera.shake || 0, radius >= 140 ? 7 : 3);
  addFxSprite('dust', x, y + 18, radius * 1.3, 0.55);
  Object.values(state.players).forEach((p) => {
    if (p.hp > 0) {
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < radius) damagePlayer(p, Math.round(maxDmg * (1 - d / radius)), ownerId, label);
    }
  });
}

function damagePlayer(target, amount, attackerId, weaponName) {
  if (target.hp <= 0) return;
  const source = state.players[attackerId];
  if (modeTeamMode() && source && source.id !== target.id && source.team === target.team) return;
  if(['zombie','boss'].includes(state.selectedMode)&&source&&source.id!==target.id)return;
  let rem = amount;
  if (target.armor > 0) {
    const absorbed = Math.min(target.armor, rem);
    target.armor -= absorbed;
    rem -= absorbed;
  }
  target.hp -= rem;
  if (state.fxList.length < 180) {
    state.fxList.push({ fxKey:'damageText', x:target.x, y:target.y-48,
      text:`-${Math.max(1,Math.round(amount))}`, life:.72, maxLife:.72, size:15 });
    const hitFx={fxKey:'hitMarker',x:target.x,y:target.y-10,life:.2,maxLife:.2};
    state.fxList.push(hitFx);
    if(state.isHost&&state.mode==='playing'&&peer&&state.roomCode&&state.roomCode!=='BOTS')broadcastToClients({type:'fx',event:'hit',fx:hitFx});
  }
  if (target.hp <= 0) {
    target.hp = 0; target.deaths += 1; target.deadTimer = 3.0;
    addFxSprite('explosion', target.x, target.y, 110, 0.4, 'kill');
    const attacker = state.players[attackerId];
    if (attacker && attacker.id !== target.id) {
      attacker.kills += 1;
      state.killFeed.unshift(`${attacker.name} [${weaponName}] ${target.name}`);
      if (state.killFeed.length > 4) state.killFeed.pop();
    }
  }
}

function computeBotAI(bot, dt) {
  if(state.selectedMode==='zombie'){
    const z=(state.zombies||[]).reduce((best,item)=>!best||Math.hypot(item.x-bot.x,item.y-bot.y)<Math.hypot(best.x-bot.x,best.y-bot.y)?item:best,null);
    if(!z)return {moveX:0,moveY:0,aimX:1,aimY:0,shooting:false};
    const dx=z.x-bot.x,dy=z.y-bot.y,d=Math.hypot(dx,dy)||1;return {moveX:d>230?Math.sign(dx)*.65:0,moveY:dy< -70?-.75:0,aimX:dx/d,aimY:dy/d,shooting:d<720};
  }
  if(state.selectedMode==='boss'&&state.boss&&state.boss.hp>0){const dx=state.boss.x-bot.x,dy=state.boss.y-bot.y,d=Math.hypot(dx,dy)||1;return {moveX:d>330?Math.sign(dx)*.45:0,moveY:dy< -90?-.65:0,aimX:dx/d,aimY:dy/d,shooting:d<760};}
  if(state.selectedMode==='ctf'){
    const own=state.ctfFlags&&state.ctfFlags[bot.team],enemy=state.ctfFlags&&state.ctfFlags[1-bot.team];
    if(own&&enemy){const tx=bot.carryingFlag!==null&&bot.carryingFlag!==undefined?own.homeX:enemy.x,ty=bot.carryingFlag!==null&&bot.carryingFlag!==undefined?own.homeY:enemy.y;const dx=tx-bot.x,dy=ty-bot.y,d=Math.hypot(dx,dy)||1;return {moveX:Math.sign(dx)*.72,moveY:dy< -70?-.65:0,aimX:dx/d,aimY:dy/d,shooting:false};}
  }
  bot.aiTimer -= dt;
  if (bot.aiTimer <= 0) {
    bot.aiTimer = 0.8 + Math.random() * 1.1;
    bot.aiDir = Math.random() < 0.5 ? -1 : 1;
    if (Math.random() < 0.25) bot.weaponIdx = 1 + Math.floor(Math.random() * 6);
  }
  let nearest = null, bestDist = 9999;
  Object.values(state.players).forEach((o) => {
    if (o.id !== bot.id && o.hp > 0 && !(modeTeamMode() && o.team === bot.team)) {
      const d = Math.hypot(o.x - bot.x, o.y - bot.y);
      if (d < bestDist) { bestDist = d; nearest = o; }
    }
  });
  if (!nearest) return { moveX: 0, moveY: 0, aimX: 1, aimY: 0, shooting: false };
  const dx = nearest.x - bot.x, dy = nearest.y - bot.y, dist = Math.hypot(dx, dy) || 1;
  return {
    moveX: dist > 250 ? Math.sign(dx) * 0.75 : bot.aiDir * 0.6,
    moveY: dy < -60 || bot.y > 950 ? -0.8 : 0,
    aimX: dx / dist, aimY: dy / dist, shooting: dist < 650
  };
}

// ==========================================================================
// 9. CAMERA & CANVAS RENDERING
// ==========================================================================
function updateCamera() {
  const me = state.players[state.myId];
  if (!me) return;
  const targetZoom = state.sniperZoom ? 0.68 : (viewWidth < 750 ? 0.82 : 1.0);
  state.camera.zoom += (targetZoom - state.camera.zoom) * 0.1;
  const lookAhead = state.sniperZoom ? 150 : 82;
  const targetX = me.x + Math.cos(me.aimAngle || 0) * lookAhead;
  const targetY = me.y + Math.sin(me.aimAngle || 0) * lookAhead * .45;
  state.camera.x += (targetX - state.camera.x) * .085;
  state.camera.y += (targetY - state.camera.y) * .085;
}

function renderGame() {
  ctx.setTransform(renderDpr, 0, 0, renderDpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#0d120e';
  ctx.fillRect(0, 0, viewWidth, viewHeight);
  ctx.save();
  const shake = state.camera.shake || 0;
  ctx.translate(viewWidth / 2 + (shake > .15 ? (Math.random()-.5)*shake : 0),
    viewHeight / 2 + (shake > .15 ? (Math.random()-.5)*shake : 0));
  ctx.scale(state.camera.zoom, state.camera.zoom);
  ctx.translate(-state.camera.x, -state.camera.y);

  const activeMapId = getActiveMapId();
  const activeMap = MAPS[activeMapId] || MAPS[0];
  const mapImg = MAP_IMAGES[activeMapId];
  if (mapImg && mapImg.complete && mapImg.naturalWidth > 0) {
    ctx.drawImage(mapImg, 0, 0, WORLD.width, WORLD.height);
  } else {
    ctx.fillStyle = '#1b221c';
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    ctx.fillStyle = '#4b5563';
    activeMap.platforms.forEach((pl) => ctx.fillRect(pl.x, pl.y, pl.w, pl.h));
  }

  (activeMap.props || []).forEach((pr) => {
    const pSprite = SPRITES.props[pr.kind];
    if (pSprite) ctx.drawImage(pSprite, pr.x, pr.y, pr.w, pr.h);
  });

  if (state.selectedMode === 'zombie') {
    (state.zombies || []).forEach(z => {
      const zombieSprite=SPRITES.zombies[z.spriteIdx||0];
      if(zombieSprite){ctx.save();ctx.drawImage(zombieSprite,z.x-34,z.y-44,68,88);ctx.fillStyle='#111827';ctx.fillRect(z.x-22,z.y-54,44,5);ctx.fillStyle='#84cc16';ctx.fillRect(z.x-22,z.y-54,44*Math.max(0,z.hp/z.maxHp),5);ctx.restore();return;}
      ctx.save(); ctx.translate(z.x,z.y); ctx.fillStyle='#65a30d'; ctx.strokeStyle='#17230d'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(0,-12,15,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillRect(-12,-2,24,28); ctx.strokeRect(-12,-2,24,28);
      ctx.fillStyle='#ef4444'; ctx.fillRect(-19,-37,38,4); ctx.fillStyle='#84cc16'; ctx.fillRect(-19,-37,38*Math.max(0,z.hp/z.maxHp),4);
      ctx.fillStyle='#fef08a'; ctx.fillRect(-6,-15,4,3); ctx.fillRect(4,-15,4,3); ctx.restore();
    });
  }
  if(state.selectedMode==='boss'&&state.boss){const b=state.boss;ctx.save();if(SPRITES.boss)ctx.drawImage(SPRITES.boss,b.x-90,b.y-90,180,180);else{ctx.fillStyle='#7c2d12';ctx.beginPath();ctx.arc(b.x,b.y,65,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#111827';ctx.fillRect(b.x-76,b.y-112,152,10);ctx.fillStyle='#ef4444';ctx.fillRect(b.x-76,b.y-112,152*Math.max(0,b.hp/b.maxHp),10);ctx.restore();}
  if(state.selectedMode==='ctf'&&state.ctfFlags)state.ctfFlags.forEach(flag=>{ctx.save();ctx.strokeStyle=flag.team===0?'#22c55e':'#f59e0b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(flag.x,flag.y);ctx.lineTo(flag.x,flag.y-66);ctx.stroke();ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(flag.x,flag.y-66);ctx.lineTo(flag.x+34,flag.y-55);ctx.lineTo(flag.x,flag.y-42);ctx.closePath();ctx.fill();ctx.restore();});
  if(state.selectedMode==='br'&&state.battleZone){ctx.save();ctx.strokeStyle='#fb7185';ctx.lineWidth=8;ctx.setLineDash([24,18]);ctx.beginPath();ctx.arc(state.battleZone.x,state.battleZone.y,state.battleZone.radius,0,Math.PI*2);ctx.stroke();ctx.restore();}
  Object.values(state.players).forEach((p) => { if (p.hp > 0) drawCharacterAndWeapon(p); });

  for (const g of state.grenades) {
    const gSprite = SPRITES.grenades[g.gType];
    if (gSprite) ctx.drawImage(gSprite, g.x - 12, g.y - 14, 24, 28);
    else {
      ctx.fillStyle = g.gType === 1 ? '#22c55e' : g.gType === 2 ? '#cbd5e1' : '#4b5563';
      ctx.beginPath(); ctx.arc(g.x, g.y, 7, 0, Math.PI * 2); ctx.fill();
    }
  }

  for (const b of state.bullets) {
    const speed = Math.hypot(b.vx,b.vy) || 1;
    ctx.save(); ctx.strokeStyle=b.color; ctx.globalAlpha=b.type==='rocket'?.9:.48;
    ctx.lineWidth=b.type==='rocket'?5:2; ctx.lineCap='round'; ctx.beginPath();
    const trail=b.type==='rocket'?34:18;
    ctx.moveTo(b.x-b.vx/speed*trail,b.y-b.vy/speed*trail); ctx.lineTo(b.x,b.y); ctx.stroke();
    ctx.globalAlpha=1; ctx.fillStyle=b.color; ctx.beginPath();
    ctx.arc(b.x,b.y,b.type==='rocket'?6:2.8,0,Math.PI*2); ctx.fill(); ctx.restore();
  }

  for (const cl of state.clouds) {
    const cSprite = cl.kind === 'gas' ? SPRITES.fx.smokeGreen : SPRITES.fx.smokeWhite;
    ctx.save();
    ctx.globalAlpha = Math.min(0.92, cl.life * 0.45);
    if (cSprite) ctx.drawImage(cSprite, cl.x - cl.r, cl.y - cl.r * 0.85, cl.r * 2, cl.r * 1.6);
    else {
      ctx.fillStyle = cl.kind === 'gas' ? 'rgba(34,197,94,0.6)' : 'rgba(226,232,240,0.75)';
      ctx.beginPath(); ctx.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  for (const fx of state.fxList) {
    if (fx.fxKey === 'hitMarker') {
      ctx.save(); ctx.globalAlpha=Math.max(0,fx.life/fx.maxLife); ctx.strokeStyle='#f8fafc';
      ctx.lineWidth=2.2; ctx.lineCap='round'; const r=7;
      ctx.beginPath(); ctx.moveTo(fx.x-r,fx.y-r); ctx.lineTo(fx.x-2,fx.y-2);
      ctx.moveTo(fx.x+r,fx.y-r); ctx.lineTo(fx.x+2,fx.y-2);
      ctx.moveTo(fx.x-r,fx.y+r); ctx.lineTo(fx.x-2,fx.y+2);
      ctx.moveTo(fx.x+r,fx.y+r); ctx.lineTo(fx.x+2,fx.y+2); ctx.stroke(); ctx.restore(); continue;
    }
    if (fx.fxKey === 'damageText') {
      ctx.save(); ctx.globalAlpha=Math.min(1,fx.life/fx.maxLife); ctx.fillStyle='#fff1a8';
      ctx.strokeStyle='#17110b'; ctx.lineWidth=3; ctx.font='900 15px system-ui'; ctx.textAlign='center';
      const rise=(1-fx.life/fx.maxLife)*24; ctx.strokeText(fx.text,fx.x,fx.y-rise);
      ctx.fillText(fx.text,fx.x,fx.y-rise); ctx.restore(); continue;
    }
    if (fx.fxKey === 'casing') {
      ctx.save(); ctx.globalAlpha=Math.max(0,fx.life/fx.maxLife); ctx.fillStyle='#d6b56e';
      ctx.strokeStyle='#47351c'; ctx.lineWidth=1; ctx.beginPath();
      ctx.ellipse(fx.x,fx.y,2.1,3.2,.5,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore(); continue;
    }
    const fSprite = SPRITES.fx[fx.fxKey];
    if (fSprite) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, fx.life / fx.maxLife);
      ctx.drawImage(fSprite, fx.x - fx.size / 2, fx.y - fx.size / 2, fx.size, fx.size);
      ctx.restore();
    }
  }

  ctx.restore();
  if (state.camera.shake) state.camera.shake *= .82;
  if (state.camera.shake < .2) state.camera.shake = 0;
}

function drawCharacterAndWeapon(p) {
  ctx.save();
  ctx.translate(p.x, p.y);

  ctx.fillStyle = '#fff';
  ctx.font = '900 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
  ctx.strokeText(p.name, 0, -44);
  ctx.fillText(p.name, 0, -44);

  ctx.fillStyle = '#111';
  ctx.fillRect(-22, -38, 44, 5);
  ctx.fillStyle = p.hp > 35 ? '#22c55e' : '#ef4444';
  ctx.fillRect(-22, -38, 44 * (p.hp / p.maxHp), 5);

  const charImg = SPRITES.chars[p.charId] || CHARACTER_IMAGE_FALLBACK[p.charId];
  ctx.save();
  ctx.scale(p.facing, 1);
  if (charImg && charImg.complete !== false && (charImg.naturalWidth || charImg.width)) ctx.drawImage(charImg, -34, -34, 68, 68);
  else {
    // Visible tactical-soldier fallback instead of a blank rectangle during image loading.
    ctx.fillStyle = '#354b35'; ctx.strokeStyle = '#b7d58a'; ctx.lineWidth = 2;
    ctx.fillRect(-15, -25, 30, 48); ctx.strokeRect(-15, -25, 30, 48);
    ctx.fillStyle = '#202b27'; ctx.beginPath(); ctx.arc(0, -28, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#b7d58a'; ctx.fillRect(-9, -30, 18, 4);
  }
  ctx.restore();
  ctx.restore();

  const wImg = SPRITES.weapons[p.weaponIdx];
  if (wImg) {
    ctx.save();
    ctx.translate(p.x, p.y + 4);
    ctx.rotate(p.aimAngle);
    if (p.facing < 0) ctx.scale(1, -1);
    const isShield = p.weaponIdx === 0;
    ctx.drawImage(wImg, isShield ? 12 : 4, isShield ? -21 : -13, isShield ? 28 : 42, isShield ? 42 : 26);
    ctx.restore();
  }
}

function updateHudUI() {
  const me = state.players[state.myId];
  if (!me) return;
  const activeMap = MAPS[getActiveMapId()] || MAPS[0];
  document.getElementById('healthBar').style.width = `${Math.max(0, me.hp)}%`;
  document.getElementById('hpText').textContent = `HP ${Math.ceil(me.hp)}`;
  document.getElementById('armorBar').style.width = `${Math.min(100, me.armor || 0)}%`;
  document.getElementById('armorText').textContent = `SHIELD ${Math.ceil(me.armor || 0)}`;
  document.getElementById('fuelBar').style.width = `${Math.max(0, me.jetFuel == null ? 100 : me.jetFuel)}%`;
  document.getElementById('fuelText').textContent = `JET FUEL ${Math.ceil(me.jetFuel == null ? 100 : me.jetFuel)}`;
  document.getElementById('boostBadge').classList.toggle('hidden', !(me.boostTimer > 0));
  const objective=state.selectedMode==='ctf'?`FLAGS ${state.ctfScore[0]}-${state.ctfScore[1]}`:state.selectedMode==='boss'&&state.boss?`TITAN HP ${Math.ceil(state.boss.hp)}/${state.boss.maxHp}`:state.selectedMode==='br'&&state.battleZone?`SAFE ZONE ${Math.ceil(state.battleZone.radius)}`:state.selectedMode==='zombie'?`WAVE ${state.zombieWave} • KILLS ${state.zombieKills}`:'';
  document.getElementById('matchScore').textContent = `${activeMap.name.toUpperCase()} • ${getModeLabel().toUpperCase()}${modeTeamMode()?' • TEAM '+(me.team===0?'GREEN':'GOLD'):''} • ${objective||'KILLS: '+me.kills} • ${Object.keys(state.players).length}/${MAX_PLAYERS}`;
  document.getElementById('matchTimer').textContent = formatClock(state.matchTime);
  document.getElementById('killFeed').innerHTML = state.killFeed.map((item) => `<div class="kill-item">${item}</div>`).join('');
}


// ==========================================================================
/* ARCADE LOBBY PICKERS — visual selectors wired to the existing game state */
// ==========================================================================
(function buildArcadeLobbyPickers() {
  const soldierGrid = document.getElementById('lobbyCharacterGrid');
  const mapGrid = document.getElementById('lobbyMapGrid');
  if (!soldierGrid || !mapGrid) return;

  function refreshSoldierCards() {
    soldierGrid.querySelectorAll('.lobby-char-card').forEach((card) => {
      const selected = Number(card.dataset.character) === state.myCharId;
      card.classList.toggle('selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
  }

  CHARACTERS.forEach((character) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'lobby-char-card' + (character.id === state.myCharId ? ' selected' : '');
    card.dataset.character = String(character.id);
    card.setAttribute('aria-pressed', String(character.id === state.myCharId));
    card.innerHTML = '<img src="' + character.file + '" alt="" loading="lazy"><span><strong>' +
      character.name + '</strong><small>OPERATOR 0' + (character.id + 1) +
      '</small></span><b class="pick-check">✓</b>';
    card.addEventListener('click', () => {
      state.myCharId = character.id;
      localStorage.setItem('do_char', String(character.id));
      syncSoldierUI();
      refreshSoldierCards();
      if (state.players[state.myId]) {
        state.players[state.myId].charId = character.id;
        if (state.isHost) broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
      }
    });
    soldierGrid.appendChild(card);
  });

  function refreshMapCards() {
    mapGrid.querySelectorAll('.lobby-map-card').forEach((card) => {
      const mapId = Number(card.dataset.map);
      const selected = mapId === state.mapId;
      const zombieOnly = mapId === 10;
      card.hidden = zombieOnly && state.selectedMode !== 'zombie';
      card.classList.toggle('selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
  }

  MAPS.forEach((map) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'lobby-map-card' + (map.id === state.mapId ? ' selected' : '');
    card.dataset.map = String(map.id);
    card.dataset.zombieOnly = String(map.id === 10);
    card.hidden = map.id === 10 && state.selectedMode !== 'zombie';
    card.setAttribute('aria-pressed', String(map.id === state.mapId));
    card.innerHTML = '<img src="' + (map.file || './assets/map_outpost.png') + '" alt="" loading="lazy"><span class="map-number">' +
      String(map.id + 1).padStart(2, '0') + '</span><strong>' + map.name +
      '</strong><b class="map-check">✓</b>';
    card.addEventListener('click', () => {
      state.mapId = map.id;
      mapSelectEl.value = String(map.id);
      syncLobbyMapPreview();
      refreshMapCards();
      if (state.isHost) broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
    });
    mapGrid.appendChild(card);
  });

  mapSelectEl.addEventListener('change', refreshMapCards);
  refreshSoldierCards();
  refreshMapCards();
})();


// ==========================================================================
/* MODE SELECTOR, LOCAL OPERATOR PROFILE & MATCH REWARDS */
const progressionKey = 'do_operator_profile_v1';
function loadOperatorProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(progressionKey) || '{}');
    return { xp: Math.max(0, Number(saved.xp) || 0), wins: Math.max(0, Number(saved.wins) || 0),
      matches: Math.max(0, Number(saved.matches) || 0), kills: Math.max(0, Number(saved.kills) || 0),
      missionKills: Math.max(0, Number(saved.missionKills) || 0) };
  } catch (_) { return { xp: 0, wins: 0, matches: 0, kills: 0, missionKills: 0 }; }
}
const operatorProfile = loadOperatorProfile();
const savedMode=localStorage.getItem('do_mode');
state.selectedMode=['ffa','tdm','zombie','ctf','boss','br','clan'].includes(savedMode)?savedMode:'ffa';
function operatorLevel() { return Math.floor(operatorProfile.xp / 250) + 1; }
function saveOperatorProfile() {
  localStorage.setItem(progressionKey, JSON.stringify(operatorProfile));
  renderOperatorProfile();
}
function renderOperatorProfile() {
  const level = operatorLevel(), intoLevel = operatorProfile.xp % 250;
  document.getElementById('profileLevel').textContent = 'LEVEL ' + level;
  document.getElementById('profileXp').textContent = operatorProfile.xp + ' XP';
  document.getElementById('profileRecord').textContent = operatorProfile.wins + ' WINS • ' + operatorProfile.matches + ' MATCHES • ' + operatorProfile.kills + ' KILLS';
  document.getElementById('missionProgress').textContent = Math.min(5, operatorProfile.missionKills) + ' / 5 • Reward: 100 XP';
  document.getElementById('missionText').textContent = operatorProfile.missionKills >= 5 ? 'Mission complete — good work!' : 'Get 5 eliminations';
}
function renderModeSelection() {
  document.querySelectorAll('button[data-mode]').forEach((b) => {
    const active = b.dataset.mode === state.selectedMode;
    b.classList.toggle('selected', active); b.setAttribute('aria-pressed', String(active));
  });
  const modeName=getModeLabel();
  const guide=document.getElementById('modeGuide');
  const guides={ffa:'Eliminate everyone. The soldier with the most kills when the timer ends wins.',tdm:'Two teams fight together. Friendly fire is disabled; the team with the most eliminations wins.',zombie:'Survive escalating undead waves. Protect teammates, clear the horde and stay alive until time expires.',ctf:'Grab the enemy flag and return it to your base while your own flag is home. First team to 3 captures wins.',boss:'Co-op raid: all survivors fight the Outpost Titan. Aim at the boss, dodge its close-range strikes and defeat it before time runs out.',br:'Last soldier standing. No respawns. Stay inside the shrinking safe zone; the final survivor wins.',clan:'6-player 3v3 team battle. Room code required; up to three players per side.'};
  if(guide)guide.textContent=guides[state.selectedMode]||guides.ffa;
  const mapTenOption = mapSelectEl.querySelector('option[value="10"]');
  if (mapTenOption) mapTenOption.hidden = state.selectedMode !== 'zombie';
  const lobbyMapGrid = document.getElementById('lobbyMapGrid');
  if (lobbyMapGrid) lobbyMapGrid.querySelectorAll('.lobby-map-card[data-map="10"]').forEach((card) => { card.hidden = state.selectedMode !== 'zombie'; });
  document.getElementById('modeNotice').textContent=modeName+' selected';
  if(typeof syncLobbyMapPreview==='function')syncLobbyMapPreview();
}
document.querySelectorAll('button[data-mode]').forEach((b) => b.addEventListener('click', () => {
  state.selectedMode = b.dataset.mode;
  localStorage.setItem('do_mode', state.selectedMode);
  if (state.mode !== 'playing' && state.mode !== 'gameover') {
    syncPlayerTeams();
    if (state.isHost && state.roomCode && state.roomCode !== 'BOTS') {
      broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
    }
  }
  renderModeSelection();
}));
function awardMatchProgress() {
  if (state._progressAwarded) return;
  state._progressAwarded = true;
  const me = state.players[state.myId];
  if (!me) return;
  const gainedKills = Math.max(0, me.kills);
  const ranked = Object.values(state.players).sort((a,b) => b.kills-a.kills);
  const won = state.selectedMode==='ctf' ? state.ctfScore[me.team] > state.ctfScore[1-me.team]
    : ['tdm','clan'].includes(state.selectedMode) ? ranked.filter(p=>p.team===me.team).reduce((n,p)=>n+p.kills,0)>ranked.filter(p=>p.team!==me.team).reduce((n,p)=>n+p.kills,0)
    : state.selectedMode==='zombie' ? Object.values(state.players).some(p=>p.hp>0)&&state.matchTime<=0
    : state.selectedMode==='boss' ? !!state.boss&&state.boss.hp<=0
    : state.selectedMode==='br' ? Object.values(state.players).filter(p=>p.hp>0).length===1&&me.hp>0
    : ranked[0]&&ranked[0].id===me.id;
  const xpGain = 50 + gainedKills * 20 + (won ? 100 : 0);
  operatorProfile.xp += xpGain; operatorProfile.kills += gainedKills; operatorProfile.matches += 1;
  operatorProfile.missionKills += gainedKills;
  if (won) operatorProfile.wins += 1;
  if (operatorProfile.missionKills >= 5 && operatorProfile.missionKills - gainedKills < 5) operatorProfile.xp += 100;
  saveOperatorProfile();
  const reward = document.getElementById('profileRewardLine');
  if (reward) reward.textContent = '+' + xpGain + ' XP earned' + (won ? ' • VICTORY BONUS +100 XP' : '');
}
function renderPlayerShowcase() {
  const character = CHARACTERS[state.myCharId] || CHARACTERS[0];
  const weapon = WEAPONS[state.players[state.myId]?.weaponIdx ?? 1] || WEAPONS[1];
  const grenade = GRENADE_TYPES[state.myGrenadeType] || GRENADE_TYPES[0];
  const level = operatorLevel();
  const xpIntoLevel = operatorProfile.xp % 250;
  const xpFill = document.getElementById('showcaseXpFill');
  document.getElementById('showcaseLevel').textContent = 'LEVEL ' + level;
  document.getElementById('showcaseLevelBadge').textContent = 'LVL ' + String(level).padStart(2,'0');
  document.getElementById('showcaseXpText').textContent = xpIntoLevel + ' / 250 XP';
  if (xpFill) xpFill.style.width = (xpIntoLevel / 250 * 100) + '%';
  document.getElementById('showcasePrimaryWeapon').src = weapon.file;
  document.getElementById('showcasePrimaryWeapon').alt = weapon.name;
  document.getElementById('showcasePrimaryName').textContent = weapon.name;
  document.getElementById('showcaseGrenade').src = grenade.file;
  document.getElementById('showcaseGrenade').alt = grenade.name;
  document.getElementById('showcaseGrenadeName').textContent = grenade.name;
  document.getElementById('showcaseRole').textContent = 'JETPACK ASSAULT SPECIALIST';
  document.getElementById('showcaseStats').hidden = !(operatorProfile.matches || operatorProfile.kills || operatorProfile.wins);
  document.getElementById('showcaseWins').textContent = operatorProfile.wins;
  document.getElementById('showcaseMatches').textContent = operatorProfile.matches;
  document.getElementById('showcaseKills').textContent = operatorProfile.kills;
  const callsign = document.getElementById('playerNameInput');
  if (callsign && callsign.value !== state.myName) callsign.value = state.myName;
}
renderModeSelection();
renderOperatorProfile();
renderPlayerShowcase();

// Quick-access game mode panel. Selection still uses the existing live mode state.
(function wireGameModePanel() {
  const panel = document.getElementById('modeHub');
  const openBtn = document.getElementById('lobbyGameModesBtn');
  const closeBtn = document.getElementById('closeModeHubBtn');
  if (!panel || !openBtn || !closeBtn) return;
  function setOpen(open) {
    panel.classList.toggle('mode-hub-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    if (open) closeBtn.focus();
    else openBtn.focus();
  }
  openBtn.addEventListener('click', () => setOpen(!panel.classList.contains('mode-hub-open')));
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('mode-hub-open')) setOpen(false);
  });
})();

