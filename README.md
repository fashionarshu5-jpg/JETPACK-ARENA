# Doodle Outpost

Doodle Outpost is a browser-based 2D jetpack shooter with seven playable modes, eleven selectable battlefields, bot practice, and optional PeerJS friend rooms. The separate `3d.html` page is an experimental single-player 3D prototype; it is not multiplayer and does not share match state with the 2D game.

## Run locally

Serve this folder with any static HTTP server (recommended; opening files directly can limit browser APIs):

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Play

- Choose a soldier, battlefield, and match duration in the lobby.
- Use **PRACTICE VS BOTS** for offline solo practice. This mode does not create a PeerJS connection.
- Create a room to host up to six players (Clan Wars is a 3v3 match), or join using its four-character room code. Anyone who knows the code can join; the room is not invite-list restricted.
- Zombie Survival always uses Quarantine District. Other modes use the battlefield selected in the lobby.
- Ammo is unlimited; there is no reload mechanic.
- Returning to the lobby from a hosted match keeps the room open for another round. Closing the browser or losing the host connection ends the room.

## Multiplayer and offline behavior

Friend rooms use PeerJS signaling and reliable data connections. Connectivity depends on the PeerJS cloud service, browser networking, and firewall/NAT behavior. The lobby status shows signaling readiness rather than claiming a game server is always online. The service worker caches the app shell and assets for offline practice after a successful first load; multiplayer still requires network access.

## 3D prototype assets

The separate 3D prototype loads Three.js from jsDelivr and rigged GLB soldier models at runtime from Gobkit. Those external models require an internet connection; procedural fallback characters remain if they cannot load. The prototype is single-player only.

## Repository

This project is maintained in the `fashionarshu5-jpg/JETPACK-ARENA` repository and can be published with GitHub Pages from the repository root. GitHub Pages is static hosting; it does not provide a multiplayer signaling server.

## Project notes

Keep the original 2D game and the 3D prototype separate. Do not rename or remove the existing maps, modes, characters, weapons, sounds, or art assets.
