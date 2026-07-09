// 1. FIREBASE — connexion à la base de données

const firebaseConfig = {
apiKey: "AIzaSyCZugdhu9jkCOg-t59CGp3JINYBU7712hw",
authDomain: "dashboard-htb.firebaseapp.com",
databaseURL: "https://dashboard-htb-default-rtdb.europe-west1.firebasedatabase.app",
projectId: "dashboard-htb",
storageBucket: "dashboard-htb.firebasestorage.app",
messagingSenderId: "587750169338",
appId: "1:587750169338:web:8ce3c1ebb95f74381c8743"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Raccourcis pour lire/écrire dans Firebase
const ref = (path) => db.ref(path);
const set = (path, value) => db.ref(path).set(value);
const push = (path, value) => db.ref(path).push(value);


// 2. DONNÉES INITIALES


const STEPS = [
{ key: 'matlab', icon: '⌂', label: 'Matlab' },
{ key: 'check_conf', icon: '⊙', label: 'Check conf' },
{ key: 'preconf', icon: '⊡', label: 'Préconf' },
{ key: 'ci', icon: '∞', label: 'CI' },
{ key: 'preconfig', icon: '⊕', label: 'Préconfig' },
{ key: 'studio', icon: '◈', label: 'Studio' },
{ key: 'mes_base', icon: '◎', label: 'Mes. base' },
{ key: 'mes_cpu', icon: '◉', label: 'Mes. CPU' },
];

const FONCTIONS_INIT = [
  { code: 'PMC', nom: 'Protection masse câble', statut: 'supprimee',
    init: { matlab:1, check_conf:1, preconf:1, ci:1, preconfig:1, studio:1, mes_base:1, mes_cpu:0 } },
  { code: 'PW', nom: 'Protection wattmétrique', statut: 'en-cours',
    init: { matlab:1, check_conf:1, preconf:1, ci:0, preconfig:0, studio:0, mes_base:0, mes_cpu:0 } },
  { code: 'ADD', nom: 'Automate de défaillance disjoncteur', statut: 'presente', init: {} },
  { code: 'ADA', nom: 'Automate de Débouclage', statut: 'presente', init: {} },
  { code: 'AIVO', nom: "Automate d'inter-verrouillage d'organes", statut: 'analyse', init: {} },
  { code: 'ARS', nom: 'Automate de Reprise de Service', statut: 'presente', init: {} },
  { code: 'DISCORDANCE', nom: 'Discordance du disjoncteur', statut: 'presente', init: {} },
  { code: 'PX tri', nom: 'Protection de distance', statut: 'presente', init: {} },
  { code: 'BALIS', nom: 'Balisage', statut: 'presente', init: {} },
  { code: 'CAP', nom: 'Mesures et Capteurs', statut: 'presente', init: {} },
  { code: 'CCO', nom: 'Contrôle Cohérence', statut: 'presente', init: {} },
  { code: 'CRITENC', nom: 'Critère Enclenchement', statut: 'presente', init: {} },
  { code: 'FUSTT', nom: 'Fusion fusible', statut: 'presente', init: {} },
  { code: 'GEST_DJ', nom: 'Gestion disjoncteur', statut: 'presente', init: {} }, // Modifié
  { code: 'GEST_ICITN', nom: 'Gestion commutateur ICITN', statut: 'presente', init: {} }, // Modifié
  { code: 'GEST_SA1', nom: 'Gestion des sectionneurs SA1', statut: 'presente', init: {} }, // Modifié
  { code: 'GEST_SA2', nom: 'Gestion des sectionneurs SA2', statut: 'presente', init: {} }, // Modifié
  { code: 'GEST_SL', nom: 'Gestion des sectionneurs SL', statut: 'presente', init: {} }, // Modifié
  { code: 'GEST_STA', nom: 'Gestion des sectionneurs STA', statut: 'presente', init: {} }, // Modifié
  { code: 'GEST_STB', nom: 'Gestion des sectionneurs STB', statut: 'presente', init: {} }, // Modifié
  { code: 'GEST_STC', nom: 'Gestion des sectionneurs STC', statut: 'presente', init: {} }, // Modifié
  { code: 'GIDBS', nom: 'Gestion Interface Diff. Barres & Superv.', statut: 'presente', init: {} },
  { code: 'LD', nom: 'Localisation de Défauts', statut: 'presente', init: {} },
  { code: 'MODEXP', nom: "Mode d'exploitation de la tranche", statut: 'presente', init: {} },
  { code: 'PERTURBO', nom: 'Perturbographie', statut: 'presente', init: {} },
  { code: 'PERTURBO BAR', nom: 'Perturbographie barres', statut: 'presente', init: {} },
  { code: 'SURVUA', nom: 'Surveillance des Polarités', statut: 'presente', init: {} },
  { code: 'TAC', nom: 'Gestion des Télé-Actions', statut: 'presente', init: {} },
  { code: 'Equip_tiers', nom: 'Interface protections tiers', statut: 'presente', init: {} }, // Modifié
  { code: '2_ORG_BAN', nom: '2 Organes banalisées', statut: 'presente', init: {} }, // Modifié
];


const STATUT_OPTIONS = [
{ value: 'supprimee', label: 'Supprimée', cls: 's-supprimee' },
{ value: 'en-cours', label: 'En cours', cls: 's-en-cours' },
{ value: 'analyse', label: 'Candidate suppression', cls: 's-analyse' },
{ value: 'presente', label: 'Présente', cls: 's-presente' },
{ value: 'intouchable', label: 'Intouchable', cls: 's-intouchable' },
];

const OK_OPTIONS = ['OUI', 'EN COURS', 'NON'];
const OK_CLASS = { 'OUI': 'ok-oui', 'EN COURS': 'ok-encours', 'NON': 'ok-non' };


// 3. STATE LOCAL (miroir de Firebase)

// state est un miroir local de ce qui est dans Firebase
// Firebase reste la source de vérité
let state = { fonctions: {}, configs: [], history: [] };
let chartCarto = null ;

// Indicateur de connexion
let firebaseReady = false;

function showConnectionStatus(ok) {
const el = document.getElementById('save-status');
if (!ok) {
el.textContent = '⚠ Connexion Firebase perdue';
el.style.color = 'var(--orange)';
el.classList.add('show');
} else {
el.textContent = '✓ Synchronisé';
el.style.color = 'var(--green)';
el.classList.add('show');
clearTimeout(window._saveTimer);
window._saveTimer = setTimeout(() => el.classList.remove('show'), 2000);
}
}

// 4. INITIALISATION FIREBASE

function initData() {
// Vérifie si des données existent déjà dans Firebase
ref('state').once('value').then(snapshot => {
if (!snapshot.exists()) {
// Première fois : on écrit les données initiales
const initState = { fonctions: {}, configs: [], history: [] };

FONCTIONS_INIT.forEach(fn => {
const steps = {};
STEPS.forEach(s => { steps[s.key] = fn.init[s.key] || 0; });
initState.fonctions[fn.code] = { statut: fn.statut, steps };
});

initState.configs = CONFIGS_INIT;
set('state', initState);
}

// Écoute les changements en temps réel
// Dès que quelqu'un modifie quelque chose, tout le monde voit la mise à jour
ref('state').on('value', snapshot => {
const data = snapshot.val();
if (!data) return;

state.fonctions = data.fonctions || {};
state.configs = data.configs || [];
state.history = data.history ? Object.values(data.history).reverse() : [];

if (!firebaseReady) {
firebaseReady = true;
// Premier chargement : construit toute l'interface
renderAll();
} else {
// Mise à jour en temps réel : refresh l'interface
renderKPIs();
renderCards();
renderMesures();
renderCharts();
renderHistory();
}
});


}).catch((error) => {
  console.error("Erreur d'initialisation Firebase :", error);
  showConnectionStatus(false);
});

}


// Surveille la connexion réseau
db.ref('.info/connected').on('value', snap => {
if (firebaseReady) showConnectionStatus(snap.val() === true);
});

// 5. SAUVEGARDE DANS FIREBASE

// Sauvegarde un champ précis (évite d'écraser toute la base)
function save(path, value) {
db.ref(path).set(value)
.then(() => showConnectionStatus(true))
.catch(() => showConnectionStatus(false));
}


// 6. HISTORIQUE

function askComment(description, callback) {
const overlay = document.getElementById('modal-overlay');
const desc = document.getElementById('modal-desc');
const input = document.getElementById('modal-comment');

desc.textContent = description;
input.value = '';
overlay.classList.add('open');
input.focus();

const newOk = document.getElementById('modal-ok').cloneNode(true);
const newSkip = document.getElementById('modal-skip').cloneNode(true);
document.getElementById('modal-ok').replaceWith(newOk);
document.getElementById('modal-skip').replaceWith(newSkip);

const close = (comment) => {
overlay.classList.remove('open');
callback(comment);
};

document.getElementById('modal-ok').addEventListener('click', () => {
close(document.getElementById('modal-comment').value.trim());
});
document.getElementById('modal-skip').addEventListener('click', () => close(''));
document.getElementById('modal-comment').addEventListener('keydown', e => {
if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); close(document.getElementById('modal-comment').value.trim()); }
});
}

function logAction(action, comment) {
const now = new Date();
const entry = {
date: now.toLocaleDateString('fr-FR'),
time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
auteur: 'MARLEIX Célia (CMA)',
action,
comment: comment || ''
};
// push() ajoute une entrée sans écraser les autres
push('state/history', entry);
}

function renderHistory() {
const list = document.getElementById('history-list');
const empty = document.getElementById('history-empty');

if (!state.history || state.history.length === 0) {
empty.style.display = 'block';
list.innerHTML = '';
return;
}

empty.style.display = 'none';
list.innerHTML = state.history.map(e => `
<div class="history-item">
<div class="history-time">
${e.date} ${e.time}<br>
<span style="color:var(--accent); font-size:9px;">${e.auteur || 'MARLEIX Célia (CMA)'}</span>
</div>
<div class="history-content">
<div class="history-action">${e.action}</div>
${e.comment ? `<div class="history-comment">💬 ${e.comment}</div>` : ''}
</div>
</div>`).join('');
}

function exportHistory() {
if (!state.history.length) return alert('Aucun historique à exporter.');
const lines = state.history.map(e =>
`[${e.date} ${e.time}] ${e.auteur || 'MARLEIX Célia (CMA)'}\n${e.action}${e.comment ? '\nCommentaire : ' + e.comment : ''}`
).join('\n\n---\n\n');
const blob = new Blob([lines], { type: 'text/plain' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = `historique_HTB_${new Date().toISOString().slice(0,10)}.txt`;
a.click();
}

function clearHistory() {
if (!confirm("Effacer tout l'historique ?")) return;
save('state/history', null);
}

// 7. KPIs


function calcFnPct(code) {
const s = state.fonctions[code]?.steps || {};
return Math.round(STEPS.filter(st => s[st.key]).length / STEPS.length * 100);
}

function globalStats() {
const total = FONCTIONS_INIT.length * STEPS.length;
let done = 0;
FONCTIONS_INIT.forEach(fn => {
STEPS.forEach(st => { if (state.fonctions[fn.code]?.steps?.[st.key]) done++; });
});
return { total, done, pct: Math.round(done / total * 100) };
}

function renderKPIs() {
const g = globalStats();
document.getElementById('kpi-total').textContent = FONCTIONS_INIT.length;
document.getElementById('kpi-supprimees').textContent = FONCTIONS_INIT.filter(f => state.fonctions[f.code]?.statut === 'supprimee').length;
document.getElementById('kpi-encours').textContent = FONCTIONS_INIT.filter(f => state.fonctions[f.code]?.statut === 'en-cours').length;
document.getElementById('kpi-pct').textContent = g.pct + '%';
document.getElementById('global-pct').textContent = g.pct + '%';
document.getElementById('global-bar').style.width = g.pct + '%';
document.getElementById('global-steps').textContent = `${g.done} / ${g.total} étapes`;
}


// 8. CARTES FONCTIONS

function renderCards() {
const grid = document.getElementById('fn-grid');
grid.innerHTML = '';

FONCTIONS_INIT.forEach(fn => {
const fnState = state.fonctions[fn.code] || { statut: fn.statut, steps: {} };
const statut = fnState.statut || fn.statut;
const pct = calcFnPct(fn.code);
const barColor = pct === 100 ? 'var(--green)' : pct > 0 ? 'var(--accent)' : 'var(--border)';
const statutOpt = STATUT_OPTIONS.find(o => o.value === statut) || STATUT_OPTIONS[3];

const optionsHtml = STATUT_OPTIONS.map(o =>
`<option value="${o.value}" ${o.value === statut ? 'selected' : ''}>${o.label}</option>`
).join('');

const stepsHtml = STEPS.map(step => {
const done = fnState.steps?.[step.key] ? 'done' : '';
return `
<div class="step ${done}"
data-fn="${fn.code}" data-step="${step.key}"
role="checkbox" aria-checked="${!!done}" tabindex="0" title="${step.label}">
<span class="step-icon">${done ? '✓' : step.icon}</span>
<span class="step-name">${step.label}</span>
</div>`;
}).join('');

const card = document.createElement('div');
card.className = 'fn-card';
card.innerHTML = `
<div class="fn-card-head">
<div>
<div class="fn-code">${fn.code}</div>
<div class="fn-name">${fn.nom}</div>
</div>
<select class="fn-select ${statutOpt.cls}" data-fn="${fn.code}">
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

// ── Changement de statut ──
card.querySelector('.fn-select').addEventListener('change', function() {
const newStatut = this.value;
const oldStatut = state.fonctions[fn.code]?.statut || fn.statut;
const oldLabel = STATUT_OPTIONS.find(o => o.value === oldStatut)?.label || oldStatut;
const newLabel = STATUT_OPTIONS.find(o => o.value === newStatut)?.label || newStatut;

askComment(`Statut "${fn.code}" : ${oldLabel} → ${newLabel}`, comment => {
// Écrit uniquement le statut dans Firebase, pas toute la fonction
save(`state/fonctions/${fn.code}/statut`, newStatut);
logAction(`Statut "${fn.code}" : ${oldLabel} → ${newLabel}`, comment);
});
});

// ── Cases à cocher ──
card.querySelectorAll('.step').forEach(el => {
const toggle = () => {
const fnCode = el.dataset.fn;
const stepKey = el.dataset.step;
const stepLabel = STEPS.find(s => s.key === stepKey)?.label || stepKey;
const current = state.fonctions[fnCode]?.steps?.[stepKey] || 0;
const newVal = current ? 0 : 1;
const checked = !!newVal;
const action = `Étape "${stepLabel}" (${fnCode}) : ${checked ? '✓ cochée' : '✗ décochée'}`;

askComment(action, comment => {
// Écrit uniquement cette case dans Firebase
save(`state/fonctions/${fnCode}/steps/${stepKey}`, newVal);
logAction(action, comment);
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

// 9. TABLEAU MESURES

function renderMesures() {
const tbody = document.getElementById('mes-tbody');
tbody.innerHTML = '';

const configs = Array.isArray(state.configs) ? state.configs : Object.values(state.configs || {});

configs.forEach((cfg, idx) => {
const okClass = OK_CLASS[cfg.ok] || 'ok-non';
const dspColor = cfg.dsp_max && Number(cfg.cpu_dsp) >= Number(cfg.dsp_max) * 0.9 ? 'var(--orange)' : 'var(--accent)';
const dspWarn = cfg.dsp_max ? `<span style="font-size:9px;color:var(--orange);margin-left:4px;">⚠ max ${cfg.dsp_max}%</span>` : '';

const fmtBar = (val, color = 'var(--accent)', field) => {
if (val == null || val === '') return `<span class="editable" data-idx="${idx}" data-field="${field}" style="color:var(--muted)" title="Cliquer pour modifier">—</span>`;
return `<div class="mes-bar-wrap">
<div class="mes-bar-track"><div class="mes-bar-fill" style="width:${Math.min(Number(val),100).toFixed(0)}%;background:${color};"></div></div>
<span class="editable" data-idx="${idx}" data-field="${field}" title="Cliquer pour modifier">${val}%</span>
</div>`;
};

const okOptionsHtml = OK_OPTIONS.map(o =>
`<option value="${o}" ${o === cfg.ok ? 'selected' : ''}>${o}</option>`
).join('');

tbody.innerHTML += `
<tr>
<td>
<div class="pack-code editable" data-idx="${idx}" data-field="pack">${cfg.pack}</div>
<div class="pack-name editable" data-idx="${idx}" data-field="nom">${cfg.nom}</div>
</td>
<td><span class="editable" data-idx="${idx}" data-field="supprimees" style="font-size:11px;">${cfg.supprimees}</span></td>
<td>${fmtBar(cfg.cpu_dsp, dspColor, 'cpu_dsp')}${dspWarn}</td>
<td>${fmtBar(cfg.ram, 'var(--accent)', 'ram')}</td>
<td>${fmtBar(cfg.cpu_arm, 'var(--accent)', 'cpu_arm')}</td>
<td>${fmtBar(cfg.iram, 'var(--accent)', 'iram')}</td>
<td><span class="editable" data-idx="${idx}" data-field="cpu_stim" style="font-family:var(--mono)">${cfg.cpu_stim ?? '—'}</span></td>
<td><select class="ok-select ${okClass}" data-idx="${idx}">${okOptionsHtml}</select></td>
</tr>`;
});

// Cellules éditables
tbody.querySelectorAll('.editable').forEach(el => {
el.addEventListener('click', function() {
const idx = parseInt(this.dataset.idx);
const field = this.dataset.field;
const configs = Array.isArray(state.configs) ? state.configs : Object.values(state.configs);
const old = configs[idx]?.[field];
const input = document.createElement('input');
input.className = 'inline-input';
input.value = old ?? '';
this.replaceWith(input);
input.focus(); input.select();

const commit = () => {
const newVal = input.value.trim();
if (newVal !== String(old ?? '')) {
const numFields = ['cpu_dsp','ram','cpu_arm','iram','dsp_max'];
const parsed = numFields.includes(field)
? (newVal === '' ? null : parseFloat(newVal))
: newVal;

askComment(`Mesure pack "${configs[idx].pack}" — ${field} : "${old ?? '—'}" → "${newVal}"`, comment => {
save(`state/configs/${idx}/${field}`, parsed);
logAction(`Mesure pack "${configs[idx].pack}" — ${field} : "${old ?? '—'}" → "${newVal}"`, comment);
});
} else {
renderMesures();
}
};

input.addEventListener('blur', commit);
input.addEventListener('keydown', e => {
if (e.key === 'Enter') { e.preventDefault(); commit(); }
if (e.key === 'Escape') { renderMesures(); }
});
});
});

// Select statut mesures
tbody.querySelectorAll('.ok-select').forEach(sel => {
sel.addEventListener('change', function() {
const idx = parseInt(this.dataset.idx);
const configs = Array.isArray(state.configs) ? state.configs : Object.values(state.configs);
const oldVal = configs[idx]?.ok;
const newVal = this.value;
askComment(`Statut mesures pack "${configs[idx].pack}" : ${oldVal} → ${newVal}`, comment => {
save(`state/configs/${idx}/ok`, newVal);
logAction(`Statut mesures pack "${configs[idx].pack}" : ${oldVal} → ${newVal}`, comment);
});
});
});
}

function addPack() {
const configs = Array.isArray(state.configs) ? state.configs : Object.values(state.configs || {});
const newPack = { pack: 'Nouveau', nom: 'NOM_CONFIG', supprimees: '', cpu_dsp: null, ram: null, cpu_arm: null, iram: null, cpu_stim: null, ok: 'NON' };
const newConfigs = [...configs, newPack];
askComment("Ajout d'un nouveau pack de mesures", comment => {
save('state/configs', newConfigs);
logAction('Nouveau pack de mesures ajouté', comment);
});
}


// 10. GRAPHIQUE CARTOGRAPHIE DES POIDS
function renderCharts() {
if (chartCarto) { chartCarto.destroy(); chartCarto = null; }

const configs = Array.isArray(state.configs)
? state.configs
: Object.values(state.configs || {});

// On a besoin d'au moins 2 packs pour calculer une différence
if (configs.length < 2) return;

// ── Calcul des différences ──
// Pour chaque pack à partir du 2ème :
// différence = valeur de ce pack - valeur du pack du dessus
// Le label = la fonction supprimée dans ce pack
const diffs = [];
for (let i = 1; i < configs.length; i++) {
const current = configs[i];
const previous = configs[i - 1];

diffs.push({
  label: current.supprimees || current.pack,
  cpu_dsp: Math.abs((Number(current.cpu_dsp) || 0) - (Number(previous.cpu_dsp) || 0)),
iram: Math.abs((Number(current.iram) || 0) - (Number(previous.iram) || 0)),
cpu_arm: Math.abs((Number(current.cpu_arm) || 0) - (Number(previous.cpu_arm) || 0)),
ram: Math.abs((Number(current.ram) || 0) - (Number(previous.ram) || 0)),
});
}

const labels = diffs.map(d => d.label);
const gridColor = 'rgba(255,255,255,.06)';
const tickColor = '#6b7280';

chartCarto = new Chart(document.getElementById('chart-carto'), {
type: 'bar',
data: {
labels,
datasets: [
{
label: 'CPU DSP (%)',
data: diffs.map(d => d.cpu_dsp),
backgroundColor: 'rgba(79,142,247,.8)',
borderColor: '#4f8ef7',
borderWidth: 0,
borderRadius: 3,
},
{
label: 'IRAM CCNLF (%)',
data: diffs.map(d => d.iram),
backgroundColor: 'rgba(124,92,191,.8)',
borderColor: '#7c5cbf',
borderWidth: 0,
borderRadius: 3,
},
{
label: 'CPU ARM (%)',
data: diffs.map(d => d.cpu_arm),
backgroundColor: 'rgba(243,156,18,.75)',
borderColor: '#f39c12',
borderWidth: 0,
borderRadius: 3,
},
{
label: 'RAM ARM (%)',
data: diffs.map(d => d.ram),
backgroundColor: 'rgba(46,204,113,.7)',
borderColor: '#2ecc71',
borderWidth: 0,
borderRadius: 3,
},
]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
labels: { color: tickColor, font: { size: 10 }, boxWidth: 12 }
},
tooltip: {
callbacks: {
label: ctx => {
const v = ctx.raw;
const sign = v > 0 ? '+' : '';
return ` ${ctx.dataset.label} : ${sign}${v.toFixed(2)}%`;
}
}
}
},
scales: {
x: {
ticks: { color: tickColor, font: { size: 10 } },
grid: { display: false }
},
y: {
ticks: { color: tickColor, font: { size: 10 } },
grid: { color: gridColor },
border: { color: 'rgba(255,255,255,.2)' }
}
}
}
});
}

// 11. RESET & RENDER GLOBAL

function renderAll() {
renderKPIs();
renderCards();
renderMesures();
renderCharts();
renderHistory();
}

function resetAll() {
if (!confirm('Réinitialiser toutes les cases ? Les données seront perdues pour tout le monde.')) return;
const resetFonctions = {};
FONCTIONS_INIT.forEach(fn => {
const steps = {};
STEPS.forEach(s => { steps[s.key] = 0; });
resetFonctions[fn.code] = { statut: fn.statut, steps };
});
save('state/fonctions', resetFonctions);
logAction('Réinitialisation complète de toutes les cases', '');
}


// 12. DÉMARRAGE

document.getElementById('date-label').textContent =
new Date().toLocaleDateString('fr-FR', {
weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

// Affiche un loader pendant la connexion Firebase
document.getElementById('fn-grid').innerHTML =
'<p style="color:var(--muted); padding:20px;">Connexion à Firebase...</p>';

initData();
