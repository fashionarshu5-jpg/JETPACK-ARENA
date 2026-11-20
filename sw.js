const CACHE_NAME = 'doodle-outpost-all-modes-v17';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.json',
  './assets/doodle-outpost-logo.png', './assets/favicon.png',
  './assets/zombie-grunt.svg', './assets/zombie-armored.svg', './assets/outpost-titan.svg',
  './assets/char1.png', './assets/char2.png', './assets/char3.png',
  './assets/char4.png', './assets/char5.png', './assets/char6.png',
  './assets/char7.png', './assets/char8.png', './assets/char9.png',
  './assets/weap1.png', './assets/weap2.png', './assets/weap3.png',
  './assets/weap4.png', './assets/weap5.png', './assets/weap6.png',
  './assets/weap7.png', './assets/weap8.png', './assets/weap9.png',
  './assets/weap10.png', './assets/weapons.png', './assets/soldiers.png', './assets/lobby_bg.png', './assets/map_outpost.png',
  './assets/map1.png.jpeg', './assets/map2.png.jpeg', './assets/map3.png.jpeg',
  './assets/map4.png', './assets/map5.png', './assets/map6.png',
  './assets/map7.png', './assets/map8.png', './assets/map9.png',
  './assets/map10.png.jpeg',
  './assets/grenade_frag.png', './assets/grenade_gas.png', './assets/grenade_smoke.png',
  './assets/fx_smoke_white.png', './assets/fx_smoke_green.png', './assets/fx_explosion.png',
  './assets/fx_sparks.png', './assets/fx_fire.png', './assets/fx_dust.png', './assets/fx_muzzle.png',
  './assets/prop_bunker.png', './assets/prop_tower.png', './assets/prop_crate.png',
  './assets/prop_door.png', './assets/prop_sandbag.png', './assets/prop_catwalk.png',
  './assets/prop_pipes.png', './assets/prop_container.png', './assets/prop_cave.png',
  './sounds/w1_shield.mp3', './sounds/w2_uzi.mp3', './sounds/w3_deagle.mp3',
  './sounds/w4_sniper.mp3', './sounds/w5_chainsaw.mp3', './sounds/w6_shotgun.mp3',
  './sounds/w7_rocket.mp3', './sounds/w8_ammo_crate.mp3', './sounds/w9_gear_crate.mp3',
  './sounds/w10_medkit.mp3'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.allSettled(ASSETS.map((url) => cache.add(url))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;

  const requestUrl = new URL(e.request.url);
  const isAppShell = e.request.mode === 'navigate' ||
    /\.(?:html|css|js)$/.test(requestUrl.pathname);

  if (isAppShell) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const fresh = await fetch(e.request, { cache: 'no-store' });
        if (fresh && fresh.ok) await cache.put(e.request, fresh.clone());
        return fresh;
      } catch (_) {
        return (await cache.match(e.request)) ||
          (e.request.mode === 'navigate' ? await cache.match('./index.html') : undefined) ||
          Response.error();
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (cached) return cached;
    const fresh = await fetch(e.request);
    if (fresh && fresh.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(e.request, fresh.clone());
    }
    return fresh;
  })());
});
