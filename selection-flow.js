/* Dedicated picker navigation. Selection is saved by the existing game.js handlers. */
(() => {
  const modal = document.getElementById('selectionHub');
  const host = document.getElementById('selectionGridHost');
  const title = document.getElementById('selectionTitle');
  const subtitle = document.getElementById('selectionSubtitle');
  const count = document.getElementById('selectionCount');
  const back = document.getElementById('selectionBackBtn');
  const soldierGrid = document.getElementById('lobbyCharacterGrid');
  const mapGrid = document.getElementById('lobbyMapGrid');
  const soldierTrigger = document.getElementById('openSoldierFromCard');
  const mapTrigger = document.getElementById('lobbyMapPreview');
  const mapCardTrigger = mapTrigger?.closest('.legacy-map-preview');
  const mapField = mapCardTrigger?.closest('.map-field');
  if (!modal || !host || !soldierGrid || !mapGrid) return;

  const original = new Map();
  [soldierGrid, mapGrid].forEach((grid) => {
    original.set(grid, { parent: grid.parentNode, next: grid.nextSibling });
  });
  let activeGrid = null;


  // Recover the picker if the legacy lobby-card builder did not populate its grids.
  // The project data is authoritative: use the existing CHARACTERS and MAPS arrays.
  function ensurePickerCards() {
    if (!soldierGrid.querySelector('.lobby-char-card') && typeof CHARACTERS !== 'undefined') {
      CHARACTERS.forEach((character) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'lobby-char-card';
        card.dataset.character = String(character.id);
        card.setAttribute('aria-pressed', String(character.id === state.myCharId));
        card.innerHTML = '<img src="' + character.file + '" alt="" loading="lazy"><span><strong>' +
          character.name + '</strong><small>OPERATOR 0' + (character.id + 1) +
          '</small></span><b class="pick-check">✓</b>';
        card.addEventListener('click', () => {
          state.myCharId = character.id;
          localStorage.setItem('do_char', String(character.id));
          if (typeof syncSoldierUI === 'function') syncSoldierUI();
          soldierGrid.querySelectorAll('.lobby-char-card').forEach((item) => {
            const selected = Number(item.dataset.character) === state.myCharId;
            item.classList.toggle('selected', selected);
            item.setAttribute('aria-pressed', String(selected));
          });
          if (state.players[state.myId]) {
            state.players[state.myId].charId = character.id;
            if (state.isHost && typeof broadcastToClients === 'function') {
              broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
            }
          }
        });
        soldierGrid.appendChild(card);
      });
    }

    if (!mapGrid.querySelector('.lobby-map-card') && typeof MAPS !== 'undefined') {
      MAPS.forEach((map) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'lobby-map-card';
        card.dataset.map = String(map.id);
        card.dataset.zombieOnly = String(map.id === 10);
        card.setAttribute('aria-pressed', String(map.id === state.mapId));
        card.innerHTML = '<img src="' + (map.file || './assets/map_outpost.png') +
          '" alt="" loading="lazy"><span class="map-number">' +
          String(map.id + 1).padStart(2, '0') + '</span><strong>' +
          map.name + '</strong><b class="map-check">✓</b>';
        card.addEventListener('click', () => {
          state.mapId = map.id;
          if (typeof mapSelectEl !== 'undefined' && mapSelectEl) mapSelectEl.value = String(map.id);
          if (typeof syncLobbyMapPreview === 'function') syncLobbyMapPreview();
          mapGrid.querySelectorAll('.lobby-map-card').forEach((item) => {
            const selected = Number(item.dataset.map) === state.mapId;
            item.classList.toggle('selected', selected);
            item.setAttribute('aria-pressed', String(selected));
          });
          if (state.isHost && typeof broadcastToClients === 'function') {
            broadcastToClients({ type: 'lobby_sync', players: state.players, mapId: state.mapId, selectedMode: state.selectedMode });
          }
        });
        mapGrid.appendChild(card);
      });
    }
  }

  function openPicker(kind) {
    ensurePickerCards();
    const isSoldier = kind === 'soldier';
    const grid = isSoldier ? soldierGrid : mapGrid;
    activeGrid = grid;
    modal.dataset.pickerKind = isSoldier ? 'soldier' : 'map';
    host.replaceChildren(grid);
    title.textContent = isSoldier ? 'SELECT OPERATOR' : 'SELECT BATTLEFIELD';
    subtitle.textContent = isSoldier
      ? 'Tap a soldier to equip them and return home.'
      : 'Choose your arena. You will return to the home screen.';
    if (!isSoldier) grid.querySelectorAll('.lobby-map-card').forEach((card) => { card.hidden = card.dataset.map === '10' && state.selectedMode !== 'zombie'; });
    count.textContent = isSoldier ? (grid.querySelectorAll('.lobby-char-card:not([hidden])').length + ' OPERATORS') : (grid.querySelectorAll('.lobby-map-card:not([hidden])').length + ' MAPS');
    modal.classList.remove('hidden');
    document.body.classList.add('picker-open');
    back.focus();
  }

  function closePicker() {
    if (activeGrid) {
      const spot = original.get(activeGrid);
      if (spot && spot.parent) spot.parent.insertBefore(activeGrid, spot.next && spot.next.parentNode === spot.parent ? spot.next : null);
    }
    activeGrid = null;
    delete modal.dataset.pickerKind;
    modal.classList.add('hidden');
    document.body.classList.remove('picker-open');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  // Capture phase prevents the old settings-drawer click from also opening.
  soldierTrigger?.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch') return;
    event.preventDefault(); event.stopImmediatePropagation(); openPicker('soldier');
  }, true);
  soldierTrigger?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    openPicker('soldier');
  }, true);
  soldierTrigger?.setAttribute('role', 'button');
  soldierTrigger?.setAttribute('tabindex', '0');
  soldierTrigger?.setAttribute('aria-label', 'Change selected operator');
  soldierTrigger?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPicker('soldier'); }
  });

  const openMapFromTap = (event) => {
    if (event.target.closest('button, select, input, a')) return;
    event.preventDefault();
    event.stopPropagation();
    openPicker('map');
  };
  mapCardTrigger?.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'touch') return;
    event.preventDefault(); event.stopImmediatePropagation(); openPicker('map');
  }, true);
  mapCardTrigger?.addEventListener('click', openMapFromTap, true);
  // The preview is the visible map-selection affordance. Listen on its field too,
  // so taps on image overlays/caption children still open the picker reliably.
  mapField?.addEventListener('click', (event) => {
    if (event.target.closest('.legacy-map-preview')) openMapFromTap(event);
  }, true);
  mapCardTrigger?.setAttribute('role', 'button');
  mapCardTrigger?.setAttribute('tabindex', '0');
  mapCardTrigger?.setAttribute('aria-label', 'Open map selection');
  mapCardTrigger?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPicker('map'); }
  });

  // Existing game.js card handlers update/save the selection first; then return home.
  soldierGrid.addEventListener('click', (event) => {
    if (event.target.closest('.lobby-char-card')) window.requestAnimationFrame(closePicker);
  });
  mapGrid.addEventListener('click', (event) => {
    if (event.target.closest('.lobby-map-card')) window.requestAnimationFrame(closePicker);
  });
  back.addEventListener('click', closePicker);
  modal.addEventListener('click', (event) => { if (event.target === modal) closePicker(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) closePicker();
  });
})();
