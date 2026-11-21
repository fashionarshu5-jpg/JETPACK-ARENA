# Doodle Outpost

Doodle Outpost is a browser-based 2D jetpack shooter with seven playable modes, ten selectable maps plus the zombie-only Quarantine District, solo bot practice, and PeerJS room multiplayer. The 3D page is a separate single-player prototype; it is not connected to the 2D multiplayer rooms.

## Run locally

Serve the repository root with any static HTTP server. For example:

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Solo practice against bots does not require PeerJS or an internet connection once the local game assets are available.

## Publish with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and the `/ (root)` folder, then save.
4. Wait for the deployment to finish. GitHub Pages will show the published URL.

## Game modes and rooms

The 2D game includes Free for All, Team Deathmatch, Zombie Survival, Capture the Flag, Boss Battle, Battle Royale, and Clan Wars. Boss Battle is an untimed raid that ends only when the Titan is defeated. Clan Wars is a room-code 3v3 mode (six players maximum). Competitive playlist locks live match-time adjustments after deployment; Arcade allows the host to adjust the timer during a match. Ammo is unlimited in the 2D game.

Peer-to-peer rooms use PeerJS and the PeerJS cloud signaling service loaded from jsDelivr. Room connectivity therefore requires internet access and can be affected by the signaling service, browser networking, or firewalls. A room code is required to join; rooms are not restricted to a pre-approved friends list. The host can return to the room lobby without closing the room, or explicitly close it using **LEAVE / CLOSE ROOM**.

## Offline and asset notes

The service worker caches the local app shell and game assets for offline play after a successful first load. PeerJS room multiplayer is not available offline. The 3D prototype uses Three.js from jsDelivr and loads external GLB soldier models at runtime from Gobkit (gobkit.com), so those models require an internet connection; procedural fallback soldiers remain available if model downloads fail.

After an update, refresh once if an older cached version appears. This repository contains a fan-made game project; confirm that you have the rights to publish all included artwork, audio, and other assets.
