const INITIAL_TRACKS = [
  { id: 1, title: 'Midnight City Drive', genre: 'Synthwave', duration: '03:45' },
  { id: 2, title: 'Cybernetic Dreams', genre: 'Darksynth', duration: '04:12' },
  { id: 3, title: 'Retro Future Sunrise', genre: 'Chillwave', duration: '03:20' },
  { id: 4, title: 'Neon Horizon 2026', genre: 'Retrowave', duration: '04:05' }
];

const ALLOWED_STATES = ['loading', 'content', 'empty', 'error'];
let tracks = [...INITIAL_TRACKS];

// ЧИСТА ФУНКЦІЯ 1: перевірка валідності стану екрана (без звернення до DOM)
function isValidState(stateName) {
  if (typeof stateName !== 'string') return false;
  return ALLOWED_STATES.includes(stateName.trim());
}

// ЧИСТА ФУНКЦІЯ 2: безпечна фільтрація масиву треків за пошуковим запитом
function filterTracksList(items, rawQuery) {
  if (!Array.isArray(items)) return [];
  if (typeof rawQuery !== 'string' || rawQuery.trim() === '') return items;
  const query = rawQuery.trim().toLowerCase();
  return items.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.genre.toLowerCase().includes(query)
  );
}

// Елементи DOM
const stateViews = document.querySelectorAll('.state-view');
const switcherBtns = document.querySelectorAll('.switcher-btn');
const tracksContainer = document.querySelector('#tracksContainer');
const searchInput = document.querySelector('#searchInput');
const emptyQueryDisplay = document.querySelector('#emptyQueryDisplay');
const refreshBtn = document.querySelector('#refreshBtn');
const resetBtn = document.querySelector('#resetBtn');
const retryBtn = document.querySelector('#retryBtn');

function renderState(stateName) {
  if (!isValidState(stateName)) return;

  stateViews.forEach(view => {
    if (view.getAttribute('data-state') === stateName) {
      view.classList.remove('is-hidden');
    } else {
      view.classList.add('is-hidden');
    }
  });

  switcherBtns.forEach(btn => {
    if (btn.getAttribute('data-target') === stateName) {
      btn.classList.add('active-tab');
    } else {
      btn.classList.remove('active-tab');
    }
  });
}

function renderTracksList(items) {
  tracksContainer.innerHTML = '';

  items.forEach(track => {
    const card = document.createElement('div');
    card.className = 'track-card';

    const info = document.createElement('div');
    const titleEl = document.createElement('strong');
    titleEl.textContent = track.title;

    const metaEl = document.createElement('div');
    metaEl.className = 'track-meta';
    metaEl.textContent = `${track.genre} • ${track.duration}`;

    info.appendChild(titleEl);
    info.appendChild(metaEl);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-danger';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.setAttribute('data-id', track.id);

    card.appendChild(info);
    card.appendChild(deleteBtn);
    tracksContainer.appendChild(card);
  });
}

function simulateLoading() {
  renderState('loading');
  window.setTimeout(() => {
    if (tracks.length === 0) {
      tracks = [...INITIAL_TRACKS];
    }
    searchInput.value = '';
    renderTracksList(tracks);
    renderState('content');
  }, 1500);
}

switcherBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetState = btn.getAttribute('data-target');
    if (targetState === 'content' && tracks.length === 0) {
      tracks = [...INITIAL_TRACKS];
      renderTracksList(tracks);
    }
    if (targetState === 'empty') {
      emptyQueryDisplay.textContent = searchInput.value.trim() ? `«${searchInput.value.trim()}»` : '';
    }
    renderState(targetState);
  });
});

// Живий пошук із безпечним виведенням тексту через textContent (захист від XSS)
searchInput.addEventListener('input', (e) => {
  const rawValue = e.target.value;
  const filtered = filterTracksList(tracks, rawValue);

  if (filtered.length === 0) {
    emptyQueryDisplay.textContent = `«${rawValue.trim()}»`;
    renderState('empty');
  } else {
    renderTracksList(filtered);
    renderState('content');
  }
});

tracksContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-danger')) {
    const idToRemove = Number(e.target.getAttribute('data-id'));
    tracks = tracks.filter(t => t.id !== idToRemove);

    if (tracks.length === 0) {
      emptyQueryDisplay.textContent = '';
      renderState('empty');
    } else {
      renderTracksList(tracks);
    }
  }
});

refreshBtn.addEventListener('click', simulateLoading);
retryBtn.addEventListener('click', simulateLoading);

resetBtn.addEventListener('click', () => {
  tracks = [...INITIAL_TRACKS];
  searchInput.value = '';
  renderTracksList(tracks);
  renderState('content');
});

renderTracksList(tracks);
renderState('content');