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
  if (!modal || !host || !soldierGrid || !mapGrid) return;

  const original = new Map();
  [soldierGrid, mapGrid].forEach((grid) => {
    original.set(grid, { parent: grid.parentNode, next: grid.nextSibling });
  });
  let activeGrid = null;

  function openPicker(kind) {
    const isSoldier = kind === 'soldier';
    const grid = isSoldier ? soldierGrid : mapGrid;
    activeGrid = grid;
    host.replaceChildren(grid);
    title.textContent = isSoldier ? 'SELECT OPERATOR' : 'SELECT BATTLEFIELD';
    subtitle.textContent = isSoldier
      ? 'Tap a soldier to equip them and return home.'
      : 'Choose your arena. You will return to the home screen.';
    count.textContent = isSoldier ? '09 OPERATORS' : (grid.querySelectorAll('.lobby-map-card:not([hidden])').length + ' MAPS');
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
    modal.classList.add('hidden');
    document.body.classList.remove('picker-open');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  // Capture phase prevents the old settings-drawer click from also opening.
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

  mapTrigger?.addEventListener('click', () => openPicker('map'));
  mapTrigger?.setAttribute('role', 'button');
  mapTrigger?.setAttribute('tabindex', '0');
  mapTrigger?.setAttribute('aria-label', 'Change selected map');
  mapTrigger?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPicker('map'); }
  });

  // Existing game.js card handlers update/save the selection first; then return home.
  soldierGrid.addEventListener('click', (event) => {
    if (event.target.closest('.lobby-char-card')) requestAnimationFrame(closePicker);
  });
  mapGrid.addEventListener('click', (event) => {
    if (event.target.closest('.lobby-map-card')) requestAnimationFrame(closePicker);
  });
  back.addEventListener('click', closePicker);
  modal.addEventListener('click', (event) => { if (event.target === modal) closePicker(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) closePicker();
  });
})();
