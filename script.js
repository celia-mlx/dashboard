// ══════════════════════════════════════════
// 1. DONNÉES
// ══════════════════════════════════════════

const STEPS = [
  { key: 'matlab',     icon: '⌂', label: 'Matlab' },
  { key: 'check_conf', icon: '⊙', label: 'Check conf' },
  { key: 'preconf',    icon: '⊡', label: 'Préconf' },
  { key: 'ci',         icon: '∞', label: 'CI' },
  { key: 'preconfig',  icon: '⊕', label: 'Préconfig' },
  { key: 'studio',     icon: '◈', label: 'Studio' },
  { key: 'mes_base',   icon: '◎', label: 'Mes. base' },
  { key: 'mes_cpu',    icon: '◉', label: 'Mes. CPU' },
];

const FONCTIONS_INIT = [
  { code: 'PMC',          nom: 'Protection masse câble',                   statut: 'supprimee',
    init: { matlab:1, check_conf:1, preconf:1, ci:1, preconfig:1, studio:1, mes_base:1, mes_cpu:0 } },
  { code: 'PW',           nom: 'Protection wattmétrique',                  statut: 'en-cours',
    init: { matlab:1, check_conf:1, preconf:1, ci:0, preconfig:0, studio:0, mes_base:0, mes_cpu:0 } },
  { code: 'ADD',          nom: 'Automate de défaillance disjoncteur',      statut: 'presente',  init: {} },
  { code: 'ADA',          nom: 'Automate de Débouclage',                   statut: 'presente',  init: {} },
  { code: 'AIVO',         nom: "Automate d'inter-verrouillage d'organes",  statut: 'analyse',   init: {} },
  { code: 'ARS',          nom: 'Automate de Reprise de Service',           statut: 'presente',  init: {} },
  { code: 'DISCORDANCE',  nom: 'Discordance du disjoncteur',               statut: 'presente',  init: {} },
  { code: 'PX tri',       nom: 'Protection de distance',                   statut: 'presente',  init: {} },
  { code: 'BALIS',        nom: 'Balisage',                                 statut: 'presente',  init: {} },
  { code: 'CAP',          nom: 'Mesures et Capteurs',                      statut: 'presente',  init: {} },
  { code: 'CCO',          nom: 'Contrôle Cohérence',                       statut: 'presente',  init: {} },
  { code: 'CRITENC',      nom: 'Critère Enclenchement',                    statut: 'presente',  init: {} },
  { code: 'FUSTT',        nom: 'Fusion fusible',                           statut: 'presente',  init: {} },
  { code: 'GEST.DJ',      nom: 'Gestion disjoncteur',                      statut: 'presente',  init: {} },
  { code: 'GEST.ICITN',   nom: 'Gestion commutateur ICITN',                statut: 'presente',  init: {} },
  { code: 'GEST.SA1',     nom: 'Gestion des sectionneurs SA1',             statut: 'presente',  init: {} },
  { code: 'GEST.SA2',     nom: 'Gestion des sectionneurs SA2',             statut: 'presente',  init: {} },
  { code: 'GEST.SL',      nom: 'Gestion des sectionneurs SL',             statut: 'presente',  init: {} },
  { code: 'GEST.STA',     nom: 'Gestion des sectionneurs STA',             statut: 'presente',  init: {} },
  { code: 'GEST.STB',     nom: 'Gestion des sectionneurs STB',             statut: 'presente',  init: {} },
  { code: 'GEST.STC',     nom: 'Gestion des sectionneurs STC',             statut: 'presente',  init: {} },
  { code: 'GIDBS',        nom: 'Gestion Interface Diff. Barres & Superv.', statut: 'presente',  init: {} },
  { code: 'LD',           nom: 'Localisation de Défauts',                  statut: 'presente',  init: {} },
  { code: 'MODEXP',       nom: "Mode d'exploitation de la tranche",        statut: 'presente',  init: {} },
  { code: 'PERTURBO',     nom: 'Perturbographie',                          statut: 'presente',  init: {} },
  { code: 'PERTURBO BAR', nom: 'Perturbographie barres',                   statut: 'presente',  init: {} },
  { code: 'SURVUA',       nom: 'Surveillance des Polarités',               statut: 'presente',  init: {} },
  { code: 'TAC',          nom: 'Gestion des Télé-Actions',                 statut: 'presente',  init: {} },
  { code: 'Equip. tiers', nom: 'Interface protections tiers',              statut: 'presente',  init: {} },
  { code: '2 ORG. BAN.',  nom: '2 Organes banalisées',                     statut: 'presente',  init: {} },
];

const CONFIGS_INIT = [
  { pack: 'Base', nom: 'DEPART_HTB',
    supprimees: 'aucune',  cpu_dsp: 90, ram: null, cpu_arm: null, iram: null,  cpu_stim: null, ok: 'NON' },
  { pack: '.15',  nom: 'DEPART_HTB_SANS_PMC',
    supprimees: 'PMC',     cpu_dsp: 77, ram: 60,   cpu_arm: 20,   iram: 94.6,  cpu_stim: '/',  ok: 'EN COURS', dsp_max: 84 },
  { pack: '.16',  nom: 'DEPART_HTB_16',
    supprimees: 'PMC, PW', cpu_dsp: 77, ram: 60,   cpu_arm: 30,   iram: 93.98, cpu_stim: '/',  ok: 'EN COURS', dsp_max: 78 },
];

const STATUT_OPTIONS = [
  { value: 'supprimee',   label: 'Supprimée',              cls: 's-supprimee' },
  { value: 'en-cours',    label: 'En cours',               cls: 's-en-cours' },
  { value: 'analyse',     label: 'Candidate suppression',  cls: 's-analyse' },
  { value: 'presente',    label: 'Présente',               cls: 's-presente' },
  { value: 'intouchable', label: 'Intouchable',            cls: 's-intouchable' },
];

const OK_OPTIONS = ['OUI', 'EN COURS', 'NON'];

const OK_CLASS = { 'OUI': 'ok-oui', 'EN COURS': 'ok-encours', 'NON': 'ok-non' };


// ══════════════════════════════════════════
// 2. STATE & PERSISTENCE
// ══════════════════════════════════════════

const STORAGE_KEY = 'htb_dash_v3';

// L'état complet de l'application
let state = {
  fonctions: {},   // cases à cocher + statut par fonction
  configs:   [],   // packs de mesures
  history:   [],   // log des modifications
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state = saved;
    }
  } catch(e) {}

  // Initialise les fonctions manquantes
  FONCTIONS_INIT.forEach(fn => {
    if (!state.fonctions[fn.code]) {
      const steps = {};
      STEPS.forEach(s => { steps[s.key] = fn.init[s.key] || 0; });
      state.fonctions[fn.code] = { statut: fn.statut, steps };
    }
  });

  // Initialise les configs si vides
  if (!state.configs || state.configs.length === 0) {
    state.configs = JSON.parse(JSON.stringify(CONFIGS_INIT));
  }

  if (!state.history) state.history = [];
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const el = document.getElementById('save-status');
    el.classList.add('show');
    clearTimeout(window._saveTimer);
    window._saveTimer = setTimeout(() => el.classList.remove('show'), 1600);
  } catch(e) {}
}


// ══════════════════════════════════════════
// 3. HISTORIQUE
// ══════════════════════════════════════════

// Ouvre la modale de commentaire, appelle callback(commentaire) à la validation
function askComment(description, callback) {
  const overlay = document.getElementById('modal-overlay');
  const desc    = document.getElementById('modal-desc');
  const input   = document.getElementById('modal-comment');
  const btnOk   = document.getElementById('modal-ok');
  const btnSkip = document.getElementById('modal-skip');

  desc.textContent = description;
  input.value = '';
  overlay.classList.add('open');
  input.focus();

  // clone pour supprimer les anciens listeners
  const newOk   = btnOk.cloneNode(true);
  const newSkip = btnSkip.cloneNode(true);
  btnOk.replaceWith(newOk);
  btnSkip.replaceWith(newSkip);

  const close = (comment) => {
    overlay.classList.remove('open');
    callback(comment);
  };

  document.getElementById('modal-ok').addEventListener('click', () => {
    close(document.getElementById('modal-comment').value.trim());
  });
  document.getElementById('modal-skip').addEventListener('click', () => {
    close('');
  });
  document.getElementById('modal-comment').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      close(document.getElementById('modal-comment').value.trim());
    }
  });
}

function logAction(action, comment) {
  const now = new Date();
  const entry = {
    date:    now.toLocaleDateString('fr-FR'),
    time:    now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    action,
    comment: comment || '',
  };
  state.history.unshift(entry); // ajoute en tête de liste
  renderHistory();
}

function renderHistory() {
  const list  = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');

  if (!state.history || state.history.length === 0) {
    empty.style.display = 'block';
    list.innerHTML = '';
    return;
  }

  empty.style.display = 'none';
  list.innerHTML = state.history.map(e => `
    <div class="history-item">
      <div class="history-time">${e.date} ${e.time}<br><span style="color:var(--accent); font-size:9px;">MARLEIX Célia (CMA)</span></div>
      <div class="history-content">
        <div class="history-action">${e.action}</div>
        ${e.comment ? `<div class="history-comment">💬 ${e.comment}</div>` : ''}
      </div>
    </div>`).join('');
}

function exportHistory() {
  if (!state.history.length) return alert('Aucun historique à exporter.');
  const lines = state.history.map(e =>
    `[${e.date} ${e.time}] MARLEIX Célia (CMA)\n${e.action}${e.comment ? '\nCommentaire : ' + e.comment : ''}`
  ).join('\n\n---\n\n');
  const blob = new Blob([lines], { type: 'text/plain' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `historique_HTB_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
}

function clearHistory() {
  if (!confirm('Effacer tout l\'historique ?')) return;
  state.history = [];
  saveState();
  renderHistory();
}


// ══════════════════════════════════════════
// 4. RENDU KPIs
// ══════════════════════════════════════════

function calcFnPct(code) {
  const s = state.fonctions[code]?.steps || {};
  const done = STEPS.filter(st => s[st.key]).length;
  return Math.round((done / STEPS.length) * 100);
}

function globalStats() {
  const total = FONCTIONS_INIT.length * STEPS.length;
  let done = 0;
  FONCTIONS_INIT.forEach(fn => {
    STEPS.forEach(st => { if (state.fonctions[fn.code]?.steps?.[st.key]) done++; });
  });
  return { total, done, pct: Math.round((done / total) * 100) };
}

function renderKPIs() {
  const g = globalStats();
  const fonctions = FONCTIONS_INIT;

  document.getElementById('kpi-total').textContent =
    fonctions.length;
  document.getElementById('kpi-supprimees').textContent =
    fonctions.filter(f => state.fonctions[f.code]?.statut === 'supprimee').length;
  document.getElementById('kpi-encours').textContent =
    fonctions.filter(f => state.fonctions[f.code]?.statut === 'en-cours').length;
  document.getElementById('kpi-pct').textContent        = g.pct + '%';
  document.getElementById('global-pct').textContent     = g.pct + '%';
  document.getElementById('global-bar').style.width     = g.pct + '%';
  document.getElementById('global-steps').textContent   = `${g.done} / ${g.total} étapes`;
}


// ══════════════════════════════════════════
// 5. RENDU CARTES FONCTIONS
// ══════════════════════════════════════════

function renderCards() {
  const grid = document.getElementById('fn-grid');
  grid.innerHTML = '';

  FONCTIONS_INIT.forEach(fn => {
    const fnState  = state.fonctions[fn.code];
    const statut   = fnState?.statut || fn.statut;
    const pct      = calcFnPct(fn.code);
    const barColor = pct === 100 ? 'var(--green)' : pct > 0 ? 'var(--accent)' : 'var(--border)';
    const statutOpt = STATUT_OPTIONS.find(o => o.value === statut) || STATUT_OPTIONS[3];

    // options du menu déroulant
    const optionsHtml = STATUT_OPTIONS.map(o =>
      `<option value="${o.value}" ${o.value === statut ? 'selected' : ''}>${o.label}</option>`
    ).join('');

    // cases étapes
    const stepsHtml = STEPS.map(step => {
      const done = fnState?.steps?.[step.key] ? 'done' : '';
      return `
        <div class="step ${done}"
             data-fn="${fn.code}"
             data-step="${step.key}"
             role="checkbox"
             aria-checked="${!!done}"
             tabindex="0"
             title="${step.label}">
          <span class="step-icon">${done ? '✓' : step.icon}</span>
          <span class="step-name">${step.label}</span>
        </div>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'fn-card';
    card.dataset.fn = fn.code;
    card.innerHTML = `
      <div class="fn-card-head">
        <div>
          <div class="fn-code">${fn.code}</div>
          <div class="fn-name">${fn.nom}</div>
        </div>
        <select class="fn-select ${statutOpt.cls}" data-fn="${fn.code}" aria-label="Statut de ${fn.code}">
          ${optionsHtml}
        </select>
      </div>
      <div class="steps">${stepsHtml}</div>
      <div class="fn-progress">
        <div class="fn-track">
          <div class="fn-bar" style="width:${pct}%; background:${barColor};"></div>
        </div>
        <span class="fn-pct" style="color:${barColor}">${pct}%</span>
      </div>`;

    // ── Listener : changement de statut ──
    card.querySelector('.fn-select').addEventListener('change', function() {
      const newStatut = this.value;
      const oldStatut = state.fonctions[fn.code].statut;
      const oldLabel  = STATUT_OPTIONS.find(o => o.value === oldStatut)?.label || oldStatut;
      const newLabel  = STATUT_OPTIONS.find(o => o.value === newStatut)?.label || newStatut;
      const newCls    = STATUT_OPTIONS.find(o => o.value === newStatut)?.cls || '';

      const sel = this;
      askComment(
        `Changement statut "${fn.code}" : ${oldLabel} → ${newLabel}`,
        (comment) => {
          state.fonctions[fn.code].statut = newStatut;
          sel.className = `fn-select ${newCls}`;
          logAction(`Statut "${fn.code}" : ${oldLabel} → ${newLabel}`, comment);
          renderKPIs();
          saveState();
        }
      );
    });

    // ── Listeners : cases à cocher ──
    card.querySelectorAll('.step').forEach(el => {
      const toggle = () => {
        const fnCode  = el.dataset.fn;
        const stepKey = el.dataset.step;
        const stepLabel = STEPS.find(s => s.key === stepKey)?.label || stepKey;

        state.fonctions[fnCode].steps[stepKey] =
          state.fonctions[fnCode].steps[stepKey] ? 0 : 1;
        const checked = !!state.fonctions[fnCode].steps[stepKey];

        el.classList.toggle('done', checked);
        el.setAttribute('aria-checked', checked);
        el.querySelector('.step-icon').textContent = checked
          ? '✓'
          : STEPS.find(s => s.key === stepKey).icon;

        const newPct   = calcFnPct(fnCode);
        const newColor = newPct === 100 ? 'var(--green)' : newPct > 0 ? 'var(--accent)' : 'var(--border)';
        card.querySelector('.fn-bar').style.width      = newPct + '%';
        card.querySelector('.fn-bar').style.background = newColor;
        card.querySelector('.fn-pct').textContent      = newPct + '%';
        card.querySelector('.fn-pct').style.color      = newColor;

        const action = `Étape "${stepLabel}" (${fnCode}) : ${checked ? '✓ cochée' : '✗ décochée'}`;
        askComment(action, (comment) => {
          logAction(action, comment);
          renderKPIs();
          saveState();
        });
      };

      el.addEventListener('click', toggle);
      el.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
      });
    });

    grid.appendChild(card);
  });
}


// ══════════════════════════════════════════
// 6. RENDU TABLEAU MESURES
// ══════════════════════════════════════════

function renderMesures() {
  const tbody = document.getElementById('mes-tbody');
  tbody.innerHTML = '';

  state.configs.forEach((cfg, idx) => {

    const fmtBar = (val, color = 'var(--accent)') => {
      if (val == null || val === '' || val === '/') {
        return `<span style="color:var(--muted)">${val ?? '—'}</span>`;
      }
      return `
        <div class="mes-bar-wrap">
          <div class="mes-bar-track">
            <div class="mes-bar-fill" style="width:${Math.min(Number(val),100).toFixed(0)}%; background:${color};"></div>
          </div>
          <span class="editable" data-idx="${idx}" data-field="${arguments[2]}" title="Cliquer pour modifier">${val}%</span>
        </div>`;
    };

    // version sans bar pour les champs texte
    const fmtText = (val, field) => {
      if (val == null || val === '') return `<span class="editable" data-idx="${idx}" data-field="${field}" style="color:var(--muted)" title="Cliquer pour modifier">—</span>`;
      return `<span class="editable" data-idx="${idx}" data-field="${field}" title="Cliquer pour modifier">${val}</span>`;
    };

    const dspColor = cfg.dsp_max && Number(cfg.cpu_dsp) >= Number(cfg.dsp_max) * 0.9
      ? 'var(--orange)' : 'var(--accent)';
    const dspWarn = cfg.dsp_max
      ? `<span style="font-size:9px; color:var(--orange); margin-left:4px;">⚠ max ${cfg.dsp_max}%</span>` : '';

    const okOptionsHtml = OK_OPTIONS.map(o =>
      `<option value="${o}" ${o === cfg.ok ? 'selected' : ''}>${o}</option>`
    ).join('');
    const okCls = OK_CLASS[cfg.ok] || 'ok-non';

    tbody.innerHTML += `
      <tr data-cfg-idx="${idx}">
        <td>
          <div class="pack-code editable" data-idx="${idx}" data-field="pack" title="Cliquer pour modifier">${cfg.pack}</div>
          <div class="pack-name editable" data-idx="${idx}" data-field="nom"  title="Cliquer pour modifier">${cfg.nom}</div>
        </td>
        <td><span class="editable" data-idx="${idx}" data-field="supprimees" style="font-size:11px;" title="Cliquer pour modifier">${cfg.supprimees}</span></td>
        <td>
          <div class="mes-bar-wrap">
            <div class="mes-bar-track">
              <div class="mes-bar-fill" style="width:${cfg.cpu_dsp ? Math.min(cfg.cpu_dsp,100) : 0}%; background:${dspColor};"></div>
            </div>
            <span class="editable" data-idx="${idx}" data-field="cpu_dsp" title="Cliquer pour modifier">${cfg.cpu_dsp != null ? cfg.cpu_dsp + '%' : '—'}</span>
          </div>${dspWarn}
        </td>
        <td>
          <div class="mes-bar-wrap">
            <div class="mes-bar-track">
              <div class="mes-bar-fill" style="width:${cfg.ram ? Math.min(cfg.ram,100) : 0}%; background:var(--accent);"></div>
            </div>
            <span class="editable" data-idx="${idx}" data-field="ram" title="Cliquer pour modifier">${cfg.ram != null ? cfg.ram + '%' : '—'}</span>
          </div>
        </td>
        <td>
          <div class="mes-bar-wrap">
            <div class="mes-bar-track">
              <div class="mes-bar-fill" style="width:${cfg.cpu_arm ? Math.min(cfg.cpu_arm,100) : 0}%; background:var(--accent);"></div>
            </div>
            <span class="editable" data-idx="${idx}" data-field="cpu_arm" title="Cliquer pour modifier">${cfg.cpu_arm != null ? cfg.cpu_arm + '%' : '—'}</span>
          </div>
        </td>
        <td>
          <div class="mes-bar-wrap">
            <div class="mes-bar-track">
              <div class="mes-bar-fill" style="width:${cfg.iram ? Math.min(cfg.iram,100) : 0}%; background:var(--accent);"></div>
            </div>
            <span class="editable" data-idx="${idx}" data-field="iram" title="Cliquer pour modifier">${cfg.iram != null ? cfg.iram + '%' : '—'}</span>
          </div>
        </td>
        <td><span class="editable" data-idx="${idx}" data-field="cpu_stim" style="font-family:var(--mono)" title="Cliquer pour modifier">${cfg.cpu_stim ?? '—'}</span></td>
        <td>
          <select class="ok-select ${okCls}" data-idx="${idx}" aria-label="Statut mesures">
            ${okOptionsHtml}
          </select>
        </td>
      </tr>`;
  });

  // ── Listeners : cellules éditables ──
  tbody.querySelectorAll('.editable').forEach(el => {
    el.addEventListener('click', function() {
      const idx   = parseInt(this.dataset.idx);
      const field = this.dataset.field;
      const old   = state.configs[idx][field];

      // remplace le span par un input
      const input = document.createElement('input');
      input.className = 'inline-input';
      input.value = old ?? '';
      this.replaceWith(input);
      input.focus();
      input.select();

      const commit = () => {
        const newVal = input.value.trim();
        const oldVal = old;
        if (newVal !== String(oldVal ?? '')) {
          const numFields = ['cpu_dsp','ram','cpu_arm','iram','dsp_max'];
          state.configs[idx][field] = numFields.includes(field)
            ? (newVal === '' ? null : parseFloat(newVal))
            : newVal;

          askComment(
            `Mesure pack "${state.configs[idx].pack}" — ${field} : "${oldVal ?? '—'}" → "${newVal}"`,
            (comment) => {
              logAction(`Mesure pack "${state.configs[idx].pack}" — ${field} modifié : "${oldVal ?? '—'}" → "${newVal}"`, comment);
              saveState();
              renderMesures();
              renderCharts();
            }
          );
        } else {
          renderMesures();
        }
      };

      input.addEventListener('blur',  commit);
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter')  { e.preventDefault(); commit(); }
        if (e.key === 'Escape') { renderMesures(); }
      });
    });
  });

  // ── Listeners : select statut mesures ──
  tbody.querySelectorAll('.ok-select').forEach(sel => {
    sel.addEventListener('change', function() {
      const idx    = parseInt(this.dataset.idx);
      const oldVal = state.configs[idx].ok;
      const newVal = this.value;
      const newCls = OK_CLASS[newVal] || 'ok-non';

      const selEl = this;
      askComment(
        `Statut mesures pack "${state.configs[idx].pack}" : ${oldVal} → ${newVal}`,
        (comment) => {
          state.configs[idx].ok = newVal;
          selEl.className = `ok-select ${newCls}`;
          logAction(`Statut mesures pack "${state.configs[idx].pack}" : ${oldVal} → ${newVal}`, comment);
          saveState();
        }
      );
    });
  });
}

// ── Ajouter un nouveau pack ──
function addPack() {
  const newPack = {
    pack: 'Nouveau', nom: 'NOM_CONFIG',
    supprimees: '', cpu_dsp: null, ram: null,
    cpu_arm: null, iram: null, cpu_stim: null, ok: 'NON'
  };
  state.configs.push(newPack);
  askComment('Ajout d\'un nouveau pack de mesures', (comment) => {
    logAction('Nouveau pack de mesures ajouté', comment);
    saveState();
    renderMesures();
    renderCharts();
  });
}


// ══════════════════════════════════════════
// 7. GRAPHIQUES
// ══════════════════════════════════════════

let chartCPU = null;
let chartRAM = null;

function renderCharts() {
  const labels    = state.configs.map(c => c.pack);
  const gridColor = 'rgba(255,255,255,.06)';
  const tickColor = '#6b7280';

  const cpuDsp = state.configs.map(c => c.cpu_dsp ?? null);
  const cpuArm = state.configs.map(c => c.cpu_arm ?? null);
  const ram    = state.configs.map(c => c.ram    ?? null);
  const iram   = state.configs.map(c => c.iram   ?? null);

  // détruit les anciens graphiques si on re-render
  if (chartCPU) { chartCPU.destroy(); chartCPU = null; }
  if (chartRAM) { chartRAM.destroy(); chartRAM = null; }

  chartCPU = new Chart(document.getElementById('chart-cpu'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'CPU DSP (%)', data: cpuDsp, backgroundColor: 'rgba(79,142,247,.7)',  borderColor: '#4f8ef7', borderWidth: 1 },
        { label: 'CPU ARM (%)', data: cpuArm, backgroundColor: 'rgba(46,204,113,.6)',  borderColor: '#2ecc71', borderWidth: 1 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: tickColor, font: { size: 10 } } } },
      scales: {
        y: { min: 0, max: 100, ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor } },
        x: { ticks: { color: tickColor, font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  chartRAM = new Chart(document.getElementById('chart-ram'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'RAM ARM (%)',    data: ram,  backgroundColor: 'rgba(243,156,18,.65)', borderColor: '#f39c12', borderWidth: 1 },
        { label: 'IRAM CCNLF (%)',data: iram, backgroundColor: 'rgba(124,92,191,.65)', borderColor: '#7c5cbf', borderWidth: 1 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: tickColor, font: { size: 10 } } } },
      scales: {
        y: { min: 0, max: 100, ticks: { color: tickColor, font: { size: 10 } }, grid: { color: gridColor } },
        x: { ticks: { color: tickColor, font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}


// ══════════════════════════════════════════
// 8. RESET
// ══════════════════════════════════════════

function resetAll() {
  if (!confirm('Réinitialiser toutes les cases ? Les données seront perdues.')) return;
  FONCTIONS_INIT.forEach(fn => {
    STEPS.forEach(step => { state.fonctions[fn.code].steps[step.key] = 0; });
  });
  logAction('Réinitialisation complète de toutes les cases', '');
  saveState();
  renderCards();
  renderKPIs();
}


// ══════════════════════════════════════════
// 9. DÉMARRAGE
// ══════════════════════════════════════════

document.getElementById('date-label').textContent =
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

loadState();
renderKPIs();
renderCards();
renderMesures();
renderCharts();
renderHistory();