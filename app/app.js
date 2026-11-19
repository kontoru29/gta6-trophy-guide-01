// Leonida Trophy Guide: checklist, filters, spoiler mode, roadmap helpers and progress
// that saves in the browser. Loads its data from data/trophies.json, the official 55,
// and never talks to the network.
const STORE_KEY = 'leonida-trophy-guide-earned-v1';
const SPOILER_KEY = 'leonida-trophy-guide-spoilers-v1';

const KIND_LABELS = {
  story: 'Story',
  side: 'Side missions',
  activity: 'Activities',
  collectible: 'Collectibles',
  crime: 'Crime',
  exploration: 'Exploration',
  completion: '100%',
  platinum: 'Platinum',
};
const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

let earned = new Set(JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]'));
let selectedId = null;
let kindFilter = 'all';
let gradeFilter = 'all';
let searchText = '';
let sortMode = 'default';
let spoilersHidden = localStorage.getItem(SPOILER_KEY) !== 'off';
let earnedOnly = false;

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const detailEmpty = $('detailEmpty');
const detailBody = $('detailBody');

function saveEarned() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned]));
}

function isSpoiler(t) {
  return spoilersHidden && t.kind === 'story' && !earned.has(t.name);
}

function targetText(t) {
  if (t.target == null) return null;
  if (t.target === 100 && t.kind === 'completion') return '100%';
  if (t.target >= 1000) return '$' + t.target.toLocaleString('en-US');
  return '×' + t.target;
}

function renderProgress() {
  const done = trophies.filter((t) => earned.has(t.name)).length;
  const pct = Math.round((done / trophies.length) * 100);
  $('progressText').textContent = done + ' of ' + trophies.length + ' earned';
  $('progressPct').textContent = pct + '%';
  $('progressFill').style.width = pct + '%';
  const box = $('gradeBreakdown');
  box.replaceChildren();
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const total = trophies.filter((t) => t.grade === grade).length;
    const got = trophies.filter((t) => t.grade === grade && earned.has(t.name)).length;
    const chip = document.createElement('span');
    chip.textContent = GRADE_LABEL[grade] + ' ' + got + '/' + total;
    box.append(chip);
  }
}

function renderChips() {
  const box = $('kindChips');
  box.replaceChildren();
  const kinds = [
    ['all', 'All 55'],
    ['story', 'Story'],
    ['side', 'Side missions'],
    ['activity', 'Activities'],
    ['collectible', 'Collectibles'],
    ['crime', 'Crime'],
    ['exploration', 'Exploration'],
    ['missable', 'Missable'],
  ];
  for (const [value, label] of kinds) {
    const count =
      value === 'all'
        ? trophies.length
        : value === 'missable'
          ? trophies.filter((t) => t.missable).length
          : trophies.filter((t) => t.kind === value).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (kindFilter === value ? ' active' : '');
    btn.textContent = label + ' (' + count + ')';
    btn.addEventListener('click', () => {
      kindFilter = value;
      renderChips();
      renderList();
    });
    box.append(btn);
  }
}

function filteredTrophies() {
  let rows = trophies.slice();
  if (kindFilter === 'missable') rows = rows.filter((t) => t.missable);
  else if (kindFilter !== 'all') rows = rows.filter((t) => t.kind === kindFilter);
  if (gradeFilter !== 'all') rows = rows.filter((t) => t.grade === gradeFilter);
  if (earnedOnly) rows = rows.filter((t) => earned.has(t.name));
  if (searchText) {
    const q = searchText.toLowerCase();
    rows = rows.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }
  if (sortMode === 'grade') rows.sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade]);
  if (sortMode === 'name') rows.sort((a, b) => a.name.localeCompare(b.name));
  if (sortMode === 'unearned') rows.sort((a, b) => Number(earned.has(a.name)) - Number(earned.has(b.name)));
  return rows;
}

function renderList() {
  const rows = filteredTrophies();
  $('resultCount').textContent =
    rows.length + ' of ' + trophies.length + ' trophies shown · ' +
    rows.filter((t) => earned.has(t.name)).length + ' earned in this view';
  listEl.replaceChildren();
  if (rows.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'result-count';
    empty.textContent = 'Nothing matches those filters. Clear the search or pick another kind.';
    listEl.append(empty);
    return;
  }
  for (const t of rows) {
    const card = document.createElement('div');
    card.className =
      'trophy-card' +
      (earned.has(t.name) ? ' earned' : '') +
      (selectedId === t.id ? ' selected' : '') +
      (isSpoiler(t) ? ' spoiler-hidden' : '');
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.setAttribute('aria-label', (isSpoiler(t) ? 'Hidden story trophy' : t.name) + ', ' + GRADE_LABEL[t.grade]);

    const dot = document.createElement('span');
    dot.className = 'grade-dot grade-' + t.grade;
    dot.textContent = t.grade.slice(0, 4).toUpperCase();
    card.append(dot);

    const mid = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = isSpoiler(t) ? 'Hidden story trophy' : t.name;
    mid.append(name);
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = isSpoiler(t)
      ? 'Earn it to reveal its name and guide, or turn off Hide story spoilers.'
      : t.description;
    mid.append(desc);
    const tags = document.createElement('span');
    tags.className = 'trophy-tags';
    const kindTag = document.createElement('span');
    kindTag.className = 'tag kind-' + t.kind;
    kindTag.textContent = KIND_LABELS[t.kind] ?? t.kind;
    tags.append(kindTag);
    const target = targetText(t);
    if (target) {
      const targetTag = document.createElement('span');
      targetTag.className = 'tag target';
      targetTag.textContent = 'Goal ' + target;
      tags.append(targetTag);
    }
    if (t.missable) {
      const missTag = document.createElement('span');
      missTag.className = 'tag missable';
      missTag.textContent = 'Missable';
      tags.append(missTag);
    }
    mid.append(tags);
    card.append(mid);

    const earnBox = document.createElement('span');
    earnBox.className = 'earn-box';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => {
      toggleEarned(t);
    });
    earnBox.append(box);
    const earnLabel = document.createElement('span');
    earnLabel.textContent = earned.has(t.name) ? 'Earned' : 'Earn';
    earnBox.append(earnLabel);
    card.append(earnBox);

    card.addEventListener('click', () => selectTrophy(t.id));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectTrophy(t.id);
      }
    });
    listEl.append(card);
  }
}

function toggleEarned(t) {
  if (earned.has(t.name)) earned.delete(t.name);
  else earned.add(t.name);
  saveEarned();
  renderProgress();
  renderList();
  renderDetail();
}

function selectTrophy(id) {
  selectedId = id;
  history.replaceState(null, '', '#trophy-' + id);
  renderList();
  renderDetail();
  document.querySelector('.detail').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selectedId);
  if (!t) {
    detailEmpty.hidden = false;
    detailBody.hidden = true;
    return;
  }
  detailEmpty.hidden = true;
  detailBody.hidden = false;
  detailBody.replaceChildren();

  const title = document.createElement('h2');
  title.textContent = isSpoiler(t) ? 'Hidden story trophy' : t.name;
  detailBody.append(title);

  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = isSpoiler(t)
    ? 'This trophy names a story chapter or mission. Earn it to reveal the details, or turn off Hide story spoilers above.'
    : t.description;
  detailBody.append(desc);

  const row = document.createElement('div');
  row.className = 'detail-row';
  const gradeTag = document.createElement('span');
  gradeTag.className = 'tag';
  gradeTag.textContent = GRADE_LABEL[t.grade];
  row.append(gradeTag);
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = KIND_LABELS[t.kind] ?? t.kind;
  row.append(kindTag);
  const target = targetText(t);
  if (target) {
    const targetTag = document.createElement('span');
    targetTag.className = 'tag target';
    targetTag.textContent = 'Goal ' + target;
    row.append(targetTag);
  }
  detailBody.append(row);

  if (t.missable) {
    const banner = document.createElement('div');
    banner.className = 'missable-banner';
    banner.textContent =
      'Missable: this is the one trophy the guides flag as potentially missable. Do Lucia’s balcony meditation before leaving Chapter 1, and keep a manual save at the start of every chapter.';
    detailBody.append(banner);
  }

  if (!isSpoiler(t)) {
    const guideHead = document.createElement('h3');
    guideHead.textContent = 'How to get it';
    detailBody.append(guideHead);
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    detailBody.append(guide);

    const sourcesHead = document.createElement('h3');
    sourcesHead.textContent = 'Sources';
    detailBody.append(sourcesHead);
    const sources = document.createElement('p');
    sources.className = 'sources';
    sources.textContent = t.sources;
    detailBody.append(sources);
  }

  const earnBtn = document.createElement('button');
  earnBtn.type = 'button';
  earnBtn.className = 'earn-btn' + (earned.has(t.name) ? ' earned' : '');
  earnBtn.textContent = earned.has(t.name) ? '✓ Earned — click to unmark' : 'Mark as earned';
  earnBtn.addEventListener('click', () => toggleEarned(t));
  detailBody.append(earnBtn);
}

function renderMissables() {
  const box = $('missableList');
  box.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const card = document.createElement('div');
    card.className = 'missable-card';
    const title = document.createElement('h3');
    title.textContent = t.name + ' — ' + GRADE_LABEL[t.grade];
    card.append(title);
    const desc = document.createElement('p');
    desc.textContent = t.description;
    card.append(desc);
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    card.append(guide);
    const sources = document.createElement('p');
    sources.className = 'sources';
    sources.textContent = t.sources;
    card.append(sources);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = earned.has(t.name) ? '✓ Earned' : 'Mark as earned';
    btn.addEventListener('click', () => {
      toggleEarned(t);
      renderMissables();
    });
    card.append(btn);
    box.append(card);
  }
}

function renderSources() {
  const box = $('sourceList');
  box.replaceChildren();
  for (const s of data.sources) {
    const item = document.createElement('li');
    if (s.url) {
      const link = document.createElement('a');
      link.href = s.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = s.name;
      item.append(link);
    } else {
      item.textContent = s.name;
    }
    box.append(item);
  }
}

function wireControls() {
  $('searchInput').addEventListener('input', (e) => {
    searchText = e.target.value.trim();
    renderList();
  });
  $('gradeFilter').addEventListener('change', (e) => {
    gradeFilter = e.target.value;
    renderList();
  });
  $('sortSelect').addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderList();
  });
  $('spoilerToggle').checked = spoilersHidden;
  $('spoilerToggle').addEventListener('change', (e) => {
    spoilersHidden = e.target.checked;
    localStorage.setItem(SPOILER_KEY, spoilersHidden ? 'on' : 'off');
    renderList();
    renderDetail();
  });
  $('earnedOnly').addEventListener('change', (e) => {
    earnedOnly = e.target.checked;
    renderList();
  });
  $('exportBtn').addEventListener('click', () => {
    const blob = new Blob(
      [JSON.stringify({ game: data.game, earned: [...earned] }, null, 2)],
      { type: 'application/json' },
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gta6-trophy-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $('importInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      const names = new Set(Array.isArray(imported) ? imported : imported.earned);
      const known = new Set(trophies.map((t) => t.name));
      earned = new Set([...names].filter((n) => known.has(n)));
      saveEarned();
      renderProgress();
      renderList();
      renderDetail();
    } catch {
      alert('That file is not valid progress JSON.');
    }
    e.target.value = '';
  });
  $('resetBtn').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies?')) return;
    earned = new Set();
    saveEarned();
    renderProgress();
    renderList();
    renderDetail();
  });
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      $('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
}

const hash = location.hash.match(/^#trophy-(\d+)$/);
if (hash) {
  const id = Number(hash[1]);
  if (trophies.some((t) => t.id === id)) selectedId = id;
}

wireControls();
renderProgress();
renderChips();
renderList();
renderDetail();
renderMissables();
renderSources();
