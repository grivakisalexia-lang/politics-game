const voterBlocs = [
  { id: 'workers', name: 'Workers & Unions', sentiment: 'positive', approval: 48, detail: 'Care about wages, jobs, and healthcare coverage.' },
  { id: 'environmentalists', name: 'Environmentalists', sentiment: 'positive', approval: 52, detail: 'Prioritize clean energy, public transit, and conservation.' },
  { id: 'moderates', name: 'Moderates & Independents', sentiment: 'positive', approval: 50, detail: 'Look for stability, bipartisanship, and pragmatic reforms.' },
  { id: 'business', name: 'Small Business Owners', sentiment: 'positive', approval: 46, detail: 'Value predictable taxes, low bureaucracy, and local growth.' },
  { id: 'civil', name: 'Civil Rights Advocates', sentiment: 'positive', approval: 55, detail: 'Watch court appointments, policing reforms, and voting access.' },
];

const stanceEffects = {
  econ: {
    'pro-stimulus': { workers: 4, business: -2, moderates: 1 },
    balanced: { moderates: 2, business: 1 },
    austerity: { business: 3, workers: -3, moderates: -1 },
  },
  env: {
    bold: { environmentalists: 5, business: -2, moderates: 1 },
    market: { environmentalists: 2, business: 2 },
    minimal: { business: 3, environmentalists: -5, moderates: -2 },
  },
  rights: {
    expansive: { civil: 5, moderates: 1 },
    moderate: { moderates: 2, civil: 1 },
    traditional: { civil: -6, moderates: -1, workers: 1 },
  },
};

const events = [
  {
    title: 'Economy Cools Unexpectedly',
    art: 'economy',
    body: 'Hiring slows and consumer spending dips. Reporters ask how your plan will protect workers without spiking inflation.',
    options: [
      { text: 'Launch a jobs package with union protections.', impact: { workers: 4, business: -2, moderates: 1 }, momentum: 2 },
      { text: 'Call for targeted relief but promise balanced budgets.', impact: { moderates: 2, workers: 1, business: 1 }, momentum: 1 },
      { text: 'Hold spending; emphasize fiscal restraint.', impact: { business: 3, workers: -3 }, momentum: -1 },
    ],
  },
  {
    title: 'Climate Protest Floods Downtown',
    art: 'climate',
    body: 'Tens of thousands rally for faster emissions cuts. Cameras capture chants demanding policy proof.',
    options: [
      { text: 'Announce a green jobs bill funded by carbon fees.', impact: { environmentalists: 5, business: -2, workers: 1 }, momentum: 3 },
      { text: 'Propose a bipartisan innovation taskforce.', impact: { moderates: 2, environmentalists: 1 }, momentum: 1 },
      { text: 'Prioritize energy affordability over new regulations.', impact: { business: 2, moderates: 1, environmentalists: -4 }, momentum: -2 },
    ],
  },
  {
    title: 'Voting Rights Case Hits the High Court',
    art: 'rights',
    body: 'A landmark case could roll back ballot access. Civil rights groups ask for your stance.',
    options: [
      { text: 'Back expansive protections and mobilize turnout.', impact: { civil: 5, moderates: 1 }, momentum: 2 },
      { text: 'Seek a narrow fix and promise bipartisan talks.', impact: { moderates: 2, civil: 1 }, momentum: 1 },
      { text: 'Defer to states and focus on stability.', impact: { civil: -4, moderates: -1, business: 1 }, momentum: -2 },
    ],
  },
  {
    title: 'Factory Automation Debate',
    art: 'factory',
    body: 'Automation spreads through regional factories. Workers fear layoffs; businesses tout efficiency.',
    options: [
      { text: 'Offer retraining & wage insurance funded by taxes.', impact: { workers: 4, business: -1, moderates: 1 }, momentum: 2 },
      { text: 'Give accelerated depreciation to firms that keep staff.', impact: { business: 3, workers: -2 }, momentum: 1 },
      { text: 'Let markets adjust without intervention.', impact: { business: 2, workers: -3, moderates: -1 }, momentum: -1 },
    ],
  },
  {
    title: 'Campus Speech Controversy',
    art: 'speech',
    body: 'Students and faculty clash over a contentious speaker. National pundits debate free expression vs. community safety.',
    options: [
      { text: 'Champion speech and add civil dialogue grants.', impact: { moderates: 2, civil: 2 }, momentum: 1 },
      { text: 'Create guardrails and expand bias training.', impact: { civil: 3, moderates: 1, business: -1 }, momentum: 2 },
      { text: 'Avoid statement; cite local autonomy.', impact: { moderates: -1 }, momentum: -1 },
    ],
  },
];

const artTemplates = {
  economy: drawEconomy,
  climate: drawClimate,
  rights: drawRights,
  factory: drawFactory,
  speech: drawSpeech,
};

const state = {
  approval: { workers: 48, environmentalists: 52, moderates: 50, business: 46, civil: 55 },
  momentum: 0,
  turn: 1,
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function drawEconomy(container) {
  container.innerHTML = `
    <svg viewBox="0 0 160 160">
      <rect x="16" y="40" width="26" height="90" rx="6" fill="#a78bfa" />
      <rect x="62" y="30" width="26" height="100" rx="6" fill="#22d3ee" />
      <rect x="108" y="70" width="26" height="60" rx="6" fill="#f97316" />
      <polyline points="16,120 48,84 80,90 110,60 140,72" fill="none" stroke="#10b981" stroke-width="6" stroke-linecap="round" />
    </svg>
  `;
}

function drawClimate(container) {
  container.innerHTML = `
    <svg viewBox="0 0 160 160">
      <circle cx="80" cy="80" r="50" fill="#22c55e" opacity="0.35" />
      <circle cx="82" cy="78" r="42" fill="#22d3ee" opacity="0.45" />
      <path d="M40 110 C60 80 100 80 120 110" fill="#0ea5e9" opacity="0.8" />
      <rect x="46" y="78" width="68" height="12" rx="6" fill="#0f172a" />
      <circle cx="82" cy="60" r="16" fill="#fde047" />
    </svg>
  `;
}

function drawRights(container) {
  container.innerHTML = `
    <svg viewBox="0 0 160 160">
      <rect x="30" y="40" width="100" height="80" rx="12" fill="#312e81" />
      <path d="M36 112 L124 48" stroke="#22d3ee" stroke-width="8" />
      <path d="M60 92 C70 82 90 82 100 92" stroke="#fbbf24" stroke-width="8" fill="none" />
      <circle cx="64" cy="74" r="8" fill="#10b981" />
      <circle cx="96" cy="68" r="8" fill="#f43f5e" />
    </svg>
  `;
}

function drawFactory(container) {
  container.innerHTML = `
    <svg viewBox="0 0 160 160">
      <rect x="20" y="70" width="120" height="60" rx="8" fill="#0ea5e9" opacity="0.9" />
      <polygon points="20,70 40,50 60,70" fill="#22c55e" />
      <polygon points="60,70 80,46 100,70" fill="#a78bfa" />
      <rect x="88" y="40" width="20" height="30" fill="#1e293b" />
      <rect x="50" y="90" width="12" height="16" fill="#0b1020" />
      <rect x="78" y="90" width="12" height="16" fill="#0b1020" />
      <rect x="106" y="90" width="12" height="16" fill="#0b1020" />
      <path d="M22 120 H138" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
    </svg>
  `;
}

function drawSpeech(container) {
  container.innerHTML = `
    <svg viewBox="0 0 160 160">
      <circle cx="60" cy="60" r="26" fill="#22d3ee" />
      <rect x="86" y="46" width="26" height="54" rx="12" fill="#a78bfa" />
      <path d="M46 96 Q60 112 80 116" stroke="#fbbf24" stroke-width="8" fill="none" />
      <rect x="46" y="112" width="80" height="18" rx="9" fill="#0ea5e9" />
      <rect x="60" y="118" width="10" height="22" fill="#111827" />
      <rect x="92" y="118" width="10" height="22" fill="#111827" />
    </svg>
  `;
}

function renderBars() {
  const pollContainer = document.getElementById('pollBars');
  pollContainer.innerHTML = '';

  if (!voterBlocs.length) {
    pollContainer.innerHTML = '<p class="empty">No voter blocs configured.</p>';
    return;
  }

  voterBlocs.forEach((bloc) => {
    const value = clamp(state.approval[bloc.id]);
    const sentiment = value >= 50 ? 'positive' : 'negative';
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.dataset.sentiment = sentiment;
    bar.innerHTML = `
      <span class="bar__label">${bloc.name}</span>
      <div class="bar__track" data-bloc="${bloc.id}">
        <div class="bar__fill" style="width:${value}%"></div>
      </div>
      <span class="bar__value">${value}%</span>
    `;
    pollContainer.appendChild(bar);
  });
}

function renderEvent(event) {
  const card = document.getElementById('eventCard');
  card.innerHTML = '';

  const art = document.createElement('div');
  art.className = 'event__art';
  const draw = artTemplates[event.art];
  if (draw) draw(art);

  const body = document.createElement('div');
  body.className = 'event__body';
  const title = document.createElement('h3');
  title.className = 'event__title';
  title.textContent = event.title;
  const text = document.createElement('p');
  text.textContent = event.body;
  const options = document.createElement('div');
  options.className = 'options';

  event.options.forEach((option) => {
    const el = document.createElement('button');
    el.className = 'option';
    el.innerHTML = `<strong>${option.text}</strong><div class="option__impact">Momentum ${option.momentum > 0 ? '+' : ''}${option.momentum}</div>`;
    el.addEventListener('click', () => applyChoice(option));
    options.appendChild(el);
  });

  body.append(title, text, options);
  card.append(art, body);
}

function applyChoice(option) {
  Object.entries(option.impact).forEach(([bloc, delta]) => {
    state.approval[bloc] = clamp(state.approval[bloc] + delta);
  });
  state.momentum += option.momentum;
  state.turn += 1;
  updateUI();
}

function applyStanceEffects() {
  state.approval = { ...state.approval };
  ['econ', 'env', 'rights'].forEach((key) => {
    const choice = document.getElementById(key).value;
    const effects = stanceEffects[key][choice];
    Object.entries(effects).forEach(([bloc, delta]) => {
      state.approval[bloc] = clamp(50 + delta);
    });
  });
  renderBars();
}

function randomEvent() {
  return events[Math.floor(Math.random() * events.length)];
}

function updateUI() {
  document.getElementById('turnIndicator').textContent = `Turn ${state.turn}`;
  document.getElementById('momentum').textContent = `Momentum: ${state.momentum}`;
  renderBars();
  renderEvent(randomEvent());
}

function newCandidate() {
  const names = ['Jordan Rivera', 'Dakota Singh', 'Casey Morgan', 'Taylor Chen', 'Samir Patel'];
  document.getElementById('candidateName').value = names[Math.floor(Math.random() * names.length)];
  document.getElementById('party').selectedIndex = Math.floor(Math.random() * document.getElementById('party').options.length);
  ['econ', 'env', 'rights'].forEach((id) => {
    const select = document.getElementById(id);
    select.selectedIndex = Math.floor(Math.random() * select.options.length);
  });
  applyStanceEffects();
  state.turn = 1;
  state.momentum = 0;
  updateUI();
}

function attachTooltip() {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  document.addEventListener('mousemove', (event) => {
    const track = event.target.closest('.bar__track');
    if (track) {
      const bloc = track.dataset.bloc;
      const blocData = voterBlocs.find((b) => b.id === bloc);
      tooltip.textContent = blocData?.detail ?? '';
      tooltip.style.display = 'block';
      tooltip.style.left = `${event.pageX + 12}px`;
      tooltip.style.top = `${event.pageY - 10}px`;
    } else {
      tooltip.style.display = 'none';
    }
  });
}

function bindControls() {
  document.getElementById('nextTurn').addEventListener('click', () => updateUI());
  document.getElementById('newCandidate').addEventListener('click', newCandidate);
  document.querySelectorAll('.profile select').forEach((select) => {
    select.addEventListener('change', applyStanceEffects);
  });
}

function init() {
  bindControls();
  attachTooltip();
  applyStanceEffects();
  renderEvent(randomEvent());
}

init();
