# Doodle Outpost

A browser-based 2D jetpack shooter. The game includes a solo practice mode, configurable matches, character and weapon assets, and peer-to-peer friend rooms powered by PeerJS.

## Play locally

Open `index.html` in a local static web server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a public GitHub repository named `doodle-outpost`.
2. Upload the **contents** of this folder to the repository root (so `index.html` is at the top level).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for the Pages deployment to finish. Your site URL will be `https://YOUR-USERNAME.github.io/doodle-outpost/`.

## Important notes

- GitHub Pages hosts the static game files; it does not provide a multiplayer signaling server. Friend-room connectivity uses the PeerJS cloud service loaded from jsDelivr and can be affected by that service, browser networking, or firewall restrictions.
- The game uses a service worker for offline asset caching. After updates, refresh the page once if an older cached version appears.
- This repository contains a fan-made game project. Make sure you have the rights to publish all included artwork, audio, and other assets before making the repository public.

## Visual refresh
The deployment lobby has been refreshed with an illustrated map preview, larger operator presentation, military-green arcade styling, responsive layout, and the Doodle Outpost logo. The original canvas game, controls, bot practice, and PeerJS room flow are retained. Select a map in Mission Setup to update its preview.
