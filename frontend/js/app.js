const $ = (id) => document.getElementById(id);
let activeMode = 'basic';

function value(id, next) { $(id).textContent = next; }
function percent(n) { return `${Math.round(n)}%`; }

function render(data) {
  const { farm, telemetry: t, health, alerts, recommendation, edge, soil_assessment: soilAssessment } = data;
  value('farm-name', farm.name);
  value('farm-summary', `${farm.acreage} acres of ${farm.crop}${farm.location ? ' in ' + farm.location : ''}. Your farm is being watched locally, even when the internet is off.`);
  const locationInput = $('farm-location');
  if (document.activeElement !== locationInput) locationInput.value = farm.location || '';
  value('overall-health', health.overall);
  value('recommendation-title', recommendation.title.toUpperCase());
  value('recommendation-message', recommendation.message);
  value('basic-soil', `${health.soil}/100`); value('basic-soil-note', t.npk.n < 40 ? 'Your soil needs nitrogen' : 'Nutrients are stable');
  value('basic-water', `${health.water}/100`); value('basic-water-note', t.moisture < 35 ? 'Your crop needs water' : 'Water level is stable');
  value('basic-climate', `${health.climate}/100`); value('basic-climate-note', t.humidity >= 80 ? 'High disease risk' : 'Climate is stable');
  value('moisture', percent(t.moisture)); value('temperature', `${t.temperature.toFixed(1)}°C`); value('humidity', percent(t.humidity)); value('ph', t.ph.toFixed(1));
  value('nitrogen', t.npk.n); value('phosphorus', t.npk.p); value('potassium', t.npk.k);
  value('soil-fertility', soilAssessment.status === 'ready' ? `Local fertility model: ${soilAssessment.fertility} (${soilAssessment.confidence}% confidence)` : 'Local fertility model unavailable');
  value('last-updated', `Updated ${new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  value('edge-model', edge.model); value('edge-inference', edge.inference_ms == null ? '--' : `${edge.inference_ms} ms`); value('edge-confidence', edge.confidence == null ? '--' : `${edge.confidence}%`); value('edge-cloud', edge.cloud_required ? 'YES' : 'NO');
  value('raw-payload', JSON.stringify(t, null, 2));
  const weatherNote = t.weather && t.weather.source === 'api' ? ` · ${t.weather.description} (${t.weather.city})` : '';
  value('footer-source', `${t.source || 'Local'} sensor data${weatherNote}`);
  $('alert-list').innerHTML = alerts.map(a => `<article class="alert ${a.severity}"><h3>${a.title}</h3><p>${a.message}</p></article>`).join('');
  fetch('/api/recommendations').then(r => r.json()).then(result => {
    $('crop-recommendations').innerHTML = result.crops.length ? result.crops.map((crop, index) => `<li><b>${index + 1}. ${crop.crop}</b> — ${crop.confidence}% local-model suitability</li>`).join('') : '<li>Crop model is unavailable.</li>';
  }).catch(() => {});
  if (data.disease) showScan(data.disease);
}

function setConnected(online) { $('connection-dot').parentElement.classList.toggle('online', online); value('connection-text', online ? 'Connected to local edge server' : 'Reconnecting to edge server'); }
function chooseMode(mode) { activeMode = mode; document.querySelectorAll('.mode').forEach(b => b.classList.toggle('active', b.dataset.mode === mode)); document.querySelectorAll('.view').forEach(v => v.classList.toggle('hidden', v.id !== `${mode}-view`)); }
document.querySelectorAll('.mode').forEach(button => button.addEventListener('click', () => chooseMode(button.dataset.mode)));

function showScan(result) { $('scan-result').innerHTML = `<strong>${result.healthy ? 'Healthy leaf' : result.disease}</strong>${result.confidence}% confidence. ${result.treatment}`; }
$('scan-leaf').addEventListener('click', async () => {
  const image = $('leaf-image').files[0];
  if (!image) { $('scan-result').textContent = 'Choose a leaf image first.'; return; }
  const button = $('scan-leaf'); button.disabled = true; button.textContent = 'Diagnosing…';
  const form = new FormData(); form.append('image', image);
  try { const response = await fetch('/api/disease', { method: 'POST', body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error); showScan(result); }
  catch (error) { $('scan-result').textContent = error.message || 'Diagnosis failed. Try another image.'; }
  finally { button.disabled = false; button.textContent = 'Run local diagnosis'; }
});

$('save-location').addEventListener('click', async () => {
  const location = $('farm-location').value.trim();
  const status = $('location-status');
  if (!location) { status.textContent = 'Enter a location first.'; return; }
  const button = $('save-location'); button.disabled = true; button.textContent = 'Saving…';
  try {
    const response = await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to save');
    status.textContent = `Saved. Weather will be fetched for ${result.farm.location}.`;
    const farm = await (await fetch('/api/farm')).json();
    render(farm);
  }
  catch (error) { status.textContent = error.message || 'Save failed. Is KISAN_API_TOKEN set?'; }
  finally { button.disabled = false; button.textContent = 'Save location'; }
});

async function fetchState() { try { const response = await fetch('/api/farm'); if (!response.ok) throw new Error(); render(await response.json()); setConnected(true); } catch { setConnected(false); } }

fetchState();
if (window.io) { const socket = io(); socket.on('connect', () => setConnected(true)); socket.on('disconnect', () => setConnected(false)); socket.on('telemetry', render); socket.on('connect_error', () => setConnected(false)); } else { setInterval(fetchState, 4000); }
