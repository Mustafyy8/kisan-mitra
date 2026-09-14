"use strict";

const $ = (id) => document.getElementById(id);
const setText = (id, value) => { const node = $(id); if (node) node.textContent = value ?? "—"; };

const COPY = {
  en: {
    brand_tag: "Local farm intelligence", nav_overview: "Overview", nav_field: "Field tools", nav_field_short: "Field", nav_system: "System",
    connecting: "Connecting", live: "Live", offline: "Offline", checking_server: "Checking edge server…", edge_device: "Edge device", sample_data: "Sample data", sensor_data: "Sensor data", weather_data: "Live weather",
    offline_message: "Live updates are unavailable. Showing the last reading.", retry: "Retry", field_health: "Field health", priority: "Priority",
    soil_moisture: "Soil moisture", temperature: "Temperature", humidity: "Humidity", soil_ph: "Soil pH", ph_note: "Optimal 6.0–7.0", optimal: "Optimal", below_range: "Below target", above_range: "Above target", field_sensor: "Field sensor", live_weather: "Live weather", comfortable: "Comfortable", high_check_leaves: "High — check leaves",
    conditions: "Conditions", soil: "Soil", water: "Water", climate: "Climate", disease_risk: "Leaf health", notices: "Notices", waiting_data: "Waiting for data", updated_now: "Updated now", updated_minutes: (n) => `Updated ${n} min ago`, no_notices: "No active notices.",
    field_tools: "Field tools", soil_and_leaf: "Soil & leaf", field_intro: "Turn sensor readings and one clear leaf photo into practical guidance.", soil_nutrients: "Soil nutrients", checking: "Checking", unavailable: "Unavailable", nitrogen: "Nitrogen", phosphorus: "Phosphorus", potassium: "Potassium", ec: "Electrical conductivity", organic_carbon: "Organic carbon", rainfall: "Rainfall",
    crop_matches: "Crop matches", top_three: "Top 3", crop_disclaimer: "Use these rankings as a starting point alongside local agronomic advice.", no_crops: "Recommendations unavailable",
    leaf_scanner: "Leaf scanner", scanner_help: "Pepper, potato, and tomato. One leaf, close up, in daylight.", choose_photo: "Choose a leaf photo", photo_types: "JPG, PNG, or WEBP · up to 10 MB", remove: "Remove", scan_leaf: "Scan leaf", scanning: "Scanning locally", scan_result: "Scan result", local_private: "Processed locally · photo not stored", select_photo: "Choose a photo before scanning.", bad_file: "Choose a JPG, PNG, or WEBP image up to 10 MB.", scan_failed: "The leaf could not be scanned.", healthy_leaf: "Healthy leaf", not_recognized: "Not recognized",
    system: "System", device_status: "Device status", system_intro: "Connection, local models, and farm settings for setup and support.", edge_models: "Edge models", local: "Local", disease_model: "Disease model", last_inference: "Last inference", confidence: "Confidence", cloud_required: "Cloud required", yes: "Yes", no: "No", not_run: "Not run yet",
    farm_location: "Farm location", location_help: "Used for live weather only when sensor GPS is unavailable.", village_city: "Village or city", location_placeholder: "e.g. Ludhiana, Punjab", save: "Save", saving: "Saving", location_required: "Enter a village or city.", location_saved: (v) => `Saved ${v}.`,
    write_access: "Write access", token_help: "If this device protects changes with an API token, enter it for this browser session.", api_token: "API token", token_placeholder: "Optional", apply: "Apply", token_set: "Token applied for this browser session.", token_cleared: "No token is being used.", authorization_required: "This device requires an API token. Add it under System → Write access.",
    raw_sensor_data: "Raw sensor data", expand: "Expand", request_failed: "Could not reach the edge server. Try again.", fertility: "Fertility", acres_of: (a, c) => `${a} acres · ${c}`, in_location: (v) => ` · ${v}`,
    less_fertile: "Less fertile", fertile: "Fertile", highly_fertile: "Highly fertile",
  },
  hi: {
    brand_tag: "स्थानीय खेत जानकारी", nav_overview: "मुख्य", nav_field: "खेत के औज़ार", nav_field_short: "खेत", nav_system: "सिस्टम",
    connecting: "जुड़ रहा है", live: "लाइव", offline: "ऑफ़लाइन", checking_server: "डिवाइस जांच रहा है…", edge_device: "खेत का डिवाइस", sample_data: "नमूना डेटा", sensor_data: "सेंसर डेटा", weather_data: "लाइव मौसम",
    offline_message: "लाइव अपडेट उपलब्ध नहीं हैं। पिछली रीडिंग दिखाई जा रही है।", retry: "फिर कोशिश करें", field_health: "खेत की सेहत", priority: "आज का काम",
    soil_moisture: "मिट्टी की नमी", temperature: "तापमान", humidity: "हवा की नमी", soil_ph: "मिट्टी का pH", ph_note: "6.0–7.0 सही", optimal: "सही स्तर", below_range: "स्तर कम", above_range: "स्तर ज़्यादा", field_sensor: "खेत का सेंसर", live_weather: "लाइव मौसम", comfortable: "ठीक है", high_check_leaves: "ज़्यादा — पत्तियां देखें",
    conditions: "स्थिति", soil: "मिट्टी", water: "पानी", climate: "मौसम", disease_risk: "पत्ती की सेहत", notices: "सूचनाएं", waiting_data: "डेटा का इंतज़ार", updated_now: "अभी अपडेट हुआ", updated_minutes: (n) => `${n} मिनट पहले अपडेट`, no_notices: "कोई जरूरी सूचना नहीं।",
    field_tools: "खेत के औज़ार", soil_and_leaf: "मिट्टी और पत्ती", field_intro: "सेंसर रीडिंग और एक साफ पत्ती की फोटो से उपयोगी सलाह पाएं।", soil_nutrients: "मिट्टी के पोषक तत्व", checking: "जांच जारी", unavailable: "उपलब्ध नहीं", nitrogen: "नाइट्रोजन", phosphorus: "फॉस्फोरस", potassium: "पोटैशियम", ec: "विद्युत चालकता", organic_carbon: "जैविक कार्बन", rainfall: "बारिश",
    crop_matches: "फसल सुझाव", top_three: "शीर्ष 3", crop_disclaimer: "इन सुझावों के साथ स्थानीय कृषि विशेषज्ञ की सलाह भी लें।", no_crops: "सुझाव उपलब्ध नहीं",
    leaf_scanner: "पत्ती स्कैनर", scanner_help: "मिर्च, आलू और टमाटर। दिन की रोशनी में एक पत्ती की पास से फोटो लें।", choose_photo: "पत्ती की फोटो चुनें", photo_types: "JPG, PNG या WEBP · 10 MB तक", remove: "हटाएं", scan_leaf: "पत्ती स्कैन करें", scanning: "डिवाइस पर जांच जारी", scan_result: "स्कैन परिणाम", local_private: "डिवाइस पर जांच · फोटो सेव नहीं होती", select_photo: "स्कैन से पहले फोटो चुनें।", bad_file: "10 MB तक की JPG, PNG या WEBP फोटो चुनें।", scan_failed: "पत्ती की जांच नहीं हो सकी।", healthy_leaf: "पत्ती स्वस्थ है", not_recognized: "पहचाना नहीं गया",
    system: "सिस्टम", device_status: "डिवाइस की स्थिति", system_intro: "सेटअप और सहायता के लिए कनेक्शन, स्थानीय मॉडल और खेत की सेटिंग।", edge_models: "डिवाइस मॉडल", local: "स्थानीय", disease_model: "रोग मॉडल", last_inference: "पिछली जांच", confidence: "भरोसा", cloud_required: "इंटरनेट जरूरी", yes: "हां", no: "नहीं", not_run: "अभी जांच नहीं हुई",
    farm_location: "खेत की जगह", location_help: "सेंसर GPS न मिलने पर लाइव मौसम के लिए इस्तेमाल होता है।", village_city: "गांव या शहर", location_placeholder: "जैसे लुधियाना, पंजाब", save: "सेव करें", saving: "सेव हो रहा है", location_required: "गांव या शहर लिखें।", location_saved: (v) => `${v} सेव हो गया।`,
    write_access: "बदलाव की अनुमति", token_help: "अगर इस डिवाइस पर API टोकन लगा है, तो इस ब्राउज़र सत्र के लिए यहां डालें।", api_token: "API टोकन", token_placeholder: "वैकल्पिक", apply: "लागू करें", token_set: "इस ब्राउज़र सत्र के लिए टोकन लागू है।", token_cleared: "कोई टोकन इस्तेमाल नहीं हो रहा।", authorization_required: "इस डिवाइस को API टोकन चाहिए। सिस्टम → बदलाव की अनुमति में टोकन डालें।",
    raw_sensor_data: "सेंसर का कच्चा डेटा", expand: "खोलें", request_failed: "खेत के डिवाइस से संपर्क नहीं हुआ। फिर कोशिश करें।", fertility: "उपजाऊपन", acres_of: (a, c) => `${a} एकड़ · ${c}`, in_location: (v) => ` · ${v}`,
    less_fertile: "कम उपजाऊ", fertile: "उपजाऊ", highly_fertile: "बहुत उपजाऊ",
  },
};

let language = localStorage.getItem("km-language") === "hi" ? "hi" : "en";
let state = null;
let previewUrl = null;
let toastTimer = null;

function t(key, ...args) {
  const value = COPY[language][key] ?? COPY.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function authHeaders(headers = {}) {
  const token = sessionStorage.getItem("km-api-token");
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

async function api(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, headers: authHeaders(options.headers), signal: controller.signal });
    let body = {};
    try { body = await response.json(); } catch { body = {}; }
    if (!response.ok) {
      const error = new Error(body.error || `${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }
    return body;
  } finally {
    window.clearTimeout(timer);
  }
}

function showToast(message, isError = false) {
  const toast = $("toast");
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4500);
}

function errorMessage(error, fallback) {
  if (error?.status === 401) return t("authorization_required");
  if (error?.name === "AbortError") return t("request_failed");
  return error?.message || fallback || t("request_failed");
}

function setConnection(mode) {
  const connection = $("connection");
  connection.classList.toggle("is-online", mode === "online");
  connection.classList.toggle("is-offline", mode === "offline");
  setText("connectionText", mode === "online" ? t("live") : mode === "offline" ? t("offline") : t("connecting"));
  $("offlineBanner").hidden = mode !== "offline";
}

function activateTab(name, updateHash = true) {
  const valid = ["overview", "field", "system"].includes(name) ? name : "overview";
  document.querySelectorAll(".page").forEach((page) => {
    const active = page.id === `page-${valid}`;
    page.hidden = !active;
    page.classList.toggle("is-active", active);
  });
  document.querySelectorAll("[data-tab]").forEach((button) => {
    const active = button.dataset.tab === valid;
    button.classList.toggle("is-active", active);
    if (button.getAttribute("role") === "tab") {
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    }
  });
  if (updateHash) history.replaceState(null, "", valid === "overview" ? location.pathname : `#${valid}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => activateTab(button.dataset.tab)));
$("retryBtn").addEventListener("click", () => loadDashboard());
document.querySelector(".nav").addEventListener("keydown", (event) => {
  if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  const tabs = [...document.querySelectorAll(".nav-item")];
  const current = tabs.indexOf(document.activeElement);
  let next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length;
  event.preventDefault(); tabs[next].focus(); activateTab(tabs[next].dataset.tab);
});

const HINDI_ALERTS = {
  "Zone 1 needs attention": ["पानी की जरूरत", "मिट्टी सूखी है। आज सिंचाई की योजना बनाएं।"],
  "Disease risk increasing": ["रोग का खतरा बढ़ रहा है", "नमी ज्यादा है। पत्तियों की जांच करें।"],
  "Heat stress risk": ["गर्मी का खतरा", "तापमान ज्यादा है। दोपहर में सिंचाई न करें।"],
  "Soil needs nitrogen": ["नाइट्रोजन कम है", "खाद की योजना की समीक्षा करें।"],
  "Farm conditions stable": ["स्थिति सामान्य है", "अभी कोई जरूरी काम नहीं है।"],
};

function translatedRecommendation(item) {
  if (language === "en") return item;
  const match = item.title.match(/^Consider (.+)$/);
  if (match) return { title: `${match[1]} पर विचार करें`, message: `मौजूदा मिट्टी और मौसम के आधार पर स्थानीय मॉडल ने ${match[1]} को सबसे उपयुक्त माना है।` };
  const map = {
    "Maintain current schedule": ["अभी की योजना जारी रखें", "मिट्टी और मौसम अभी सही सीमा में हैं।"],
    "Irrigate Zone 1": ["सिंचाई करें", "मिट्टी में पानी कम है। आज सुबह थोड़ी सिंचाई करें।"],
    "Add nitrogen": ["नाइट्रोजन दें", "मिट्टी में नाइट्रोजन कम है। स्थानीय सलाह के अनुसार खाद दें।"],
    "Inspect for leaf disease": ["पत्तियों की जांच करें", "नमी ज्यादा है। छिड़काव से पहले फसल देखें।"],
  };
  const value = map[item.title];
  return value ? { title: value[0], message: value[1] } : item;
}

function formatUpdated(iso) {
  if (!iso) return t("waiting_data");
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return minutes < 1 ? t("updated_now") : t("updated_minutes", minutes);
}

function rangeNote(value, low, high) {
  if (value < low) return t("below_range");
  if (value > high) return t("above_range");
  return t("optimal");
}

function setBar(id, value) {
  const node = $(id);
  if (node) node.style.width = `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
}

function appendNotice(parent, alert) {
  const translated = language === "hi" ? HINDI_ALERTS[alert.title] : null;
  const item = document.createElement("article");
  item.className = `notice ${["critical", "warning", "info", "success"].includes(alert.severity) ? alert.severity : "info"}`;
  const title = document.createElement("b");
  const message = document.createElement("p");
  title.textContent = translated?.[0] || alert.title;
  message.textContent = translated?.[1] || alert.message;
  item.append(title, message);
  parent.append(item);
}

function renderCrops(crops = []) {
  const list = $("cropList");
  list.replaceChildren();
  if (!crops.length) {
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = t("no_crops"); item.append(label); list.append(item); return;
  }
  crops.slice(0, 3).forEach((crop) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    const confidence = document.createElement("b");
    label.textContent = crop.crop;
    confidence.textContent = `${Number(crop.confidence).toFixed(1)}%`;
    item.append(label, confidence); list.append(item);
  });
}

function showScan(result) {
  const box = $("scanResult");
  const recognized = result.recognized !== false;
  box.hidden = false;
  box.classList.toggle("is-good", recognized && result.healthy);
  box.classList.toggle("is-warning", !recognized || !result.healthy);
  setText("resultIcon", recognized && result.healthy ? "✓" : "!");
  setText("resultTitle", !recognized ? t("not_recognized") : result.healthy ? t("healthy_leaf") : result.disease);
  setText("resultConfidence", recognized && Number.isFinite(Number(result.confidence)) ? `${Number(result.confidence).toFixed(1)}%` : "");
  setText("resultTreatment", localizedTreatment(result));
  setText("resultSpeed", Number.isFinite(Number(result.inference_ms)) ? `${Number(result.inference_ms).toFixed(1)} ms` : "");
}

function localizedTreatment(result) {
  if (language === "en") return result.treatment;
  if (result.recognized === false) return "यह फोटो मॉडल की मिर्च, आलू या टमाटर की 15 श्रेणियों से साफ मेल नहीं खाती। इलाज से पहले सादे बैकग्राउंड पर एक पत्ती की पास से साफ फोटो लें।";
  if (result.healthy) return "कोई रोग नहीं मिला। नियमित जांच जारी रखें और साफ औज़ार इस्तेमाल करें।";
  const advice = {
    Bacterial_spot: "प्रभावित पत्तियां हटाएं, ऊपर से पानी न दें और तांबे के उपचार पर स्थानीय सलाह लें।",
    Early_blight: "नीचे की संक्रमित पत्तियां हटाएं, हवा का प्रवाह सुधारें और स्थानीय फफूंदनाशक सलाह मानें।",
    Late_blight: "प्रभावित पौधा अलग करें और तुरंत स्थानीय कृषि विशेषज्ञ से सलाह लें; लेट ब्लाइट तेजी से फैलता है।",
    Leaf_Mold: "हवा का प्रवाह बढ़ाएं, पत्तियों की नमी घटाएं और ज्यादा संक्रमित हिस्सा हटाएं।",
    Septoria_leaf_spot: "संक्रमित पत्तियां हटाएं, पत्तियां सूखी रखें और पौधों के बीच औज़ार साफ करें।",
    Spider_mites: "पत्तियों के नीचे जांचें, प्रभावित हिस्सा अलग करें और स्थानीय एकीकृत कीट प्रबंधन सलाह मानें।",
    Target_Spot: "संक्रमित पत्तियां हटाएं और उपचार से पहले पौधों के बीच जगह व हवा का प्रवाह सुधारें।",
    YellowLeaf__Curl_Virus: "बहुत प्रभावित पौधे हटाएं और स्थानीय सलाह से सफेद मक्खी नियंत्रित करें।",
    mosaic_virus: "संक्रमित पौधे हटाएं, औज़ार साफ करें और तंबाकू छूने के बाद फसल न छुएं।",
  };
  const key = Object.keys(advice).find((fragment) => result.label?.includes(fragment));
  return key ? advice[key] : "प्रभावित पौधा अलग करें और इलाज के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।";
}

function render(data) {
  if (!data?.farm || !data?.telemetry || !data?.health) return;
  state = data;
  const { farm, telemetry, health, recommendation, alerts = [], edge, soil_assessment: assessment } = data;
  const locale = language === "hi" ? "hi-IN" : "en-IN";
  setText("dateLine", new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date()));
  setText("farmName", farm.name);
  setText("farmMeta", t("acres_of", farm.acreage, farm.crop) + (farm.location ? t("in_location", farm.location) : ""));
  if (document.activeElement !== $("locationInput")) $("locationInput").value = farm.location || "";

  setText("healthScore", health.overall); setBar("healthBar", health.overall);
  const rec = translatedRecommendation(recommendation);
  setText("recommendationTitle", rec.title); setText("recommendationMessage", rec.message);
  setText("moistureValue", `${Math.round(telemetry.moisture)}%`); setText("moistureNote", rangeNote(telemetry.moisture, 45, 65));
  setText("temperatureValue", `${Number(telemetry.temperature).toFixed(1)}°C`); setText("temperatureNote", telemetry.weather?.source === "api" ? t("live_weather") : t("field_sensor"));
  setText("humidityValue", `${Math.round(telemetry.humidity)}%`); setText("humidityNote", telemetry.humidity >= 80 ? t("high_check_leaves") : t("comfortable"));
  setText("phValue", Number(telemetry.ph).toFixed(1)); setText("updatedAt", formatUpdated(telemetry.updated_at));

  [["soil", health.soil], ["water", health.water], ["climate", health.climate], ["disease", health.disease]].forEach(([name, value]) => { setBar(`${name}HealthBar`, value); setText(`${name}Health`, `${value}%`); });
  setText("noticeCount", alerts.length);
  const notices = $("noticeList"); notices.replaceChildren();
  if (alerts.length) alerts.forEach((alert) => appendNotice(notices, alert));
  else { const empty = document.createElement("p"); empty.className = "empty"; empty.textContent = t("no_notices"); notices.append(empty); }

  setText("nValue", Math.round(telemetry.npk.n)); setText("pValue", Math.round(telemetry.npk.p)); setText("kValue", Math.round(telemetry.npk.k));
  setBar("nBar", telemetry.npk.n); setBar("pBar", telemetry.npk.p * 2); setBar("kBar", telemetry.npk.k * 2);
  setText("ecValue", `${Number(telemetry.ec).toFixed(2)} mS/cm`); setText("carbonValue", `${Number(telemetry.organic_carbon).toFixed(2)}%`); setText("rainfallValue", `${Math.round(telemetry.rainfall)} mm`);
  const fertilityMap = { "Less fertile": "less_fertile", Fertile: "fertile", "Highly fertile": "highly_fertile" };
  setText("fertilityStatus", assessment?.status === "ready" ? t(fertilityMap[assessment.fertility] || "fertility") : t("unavailable"));
  $("fertilityStatus").classList.toggle("success", assessment?.status === "ready");
  renderCrops(data.crops || []);

  setText("modelName", edge?.model); setText("modelSpeed", edge?.inference_ms == null ? t("not_run") : `${edge.inference_ms} ms`); setText("modelConfidence", edge?.confidence == null ? "—" : `${edge.confidence}%`); setText("cloudRequired", edge?.cloud_required ? t("yes") : t("no"));
  setText("rawJson", JSON.stringify(telemetry, null, 2));
  const weatherSuffix = telemetry.weather?.source === "api" ? ` · ${telemetry.weather.city || t("weather_data")}` : "";
  const source = telemetry.source === "demo" ? `${t("sample_data")}${weatherSuffix}` : telemetry.weather?.source === "api" ? `${t("weather_data")}${weatherSuffix}` : t("sensor_data");
  setText("sourceText", source);
  if (data.disease) showScan(data.disease);
}

function applyLanguage() {
  document.documentElement.lang = language === "hi" ? "hi" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  $("locationInput").placeholder = t("location_placeholder"); $("tokenInput").placeholder = t("token_placeholder");
  [["langEn", "en"], ["langHi", "hi"]].forEach(([id, value]) => { const active = language === value; $(id).classList.toggle("is-active", active); $(id).setAttribute("aria-pressed", String(active)); });
  if (state) {
    const mode = $("connection").classList.contains("is-offline") ? "offline" : "online";
    render(state); setConnection(mode);
  } else setConnection("connecting");
}

$("langEn").addEventListener("click", () => { language = "en"; localStorage.setItem("km-language", language); applyLanguage(); });
$("langHi").addEventListener("click", () => { language = "hi"; localStorage.setItem("km-language", language); applyLanguage(); });

async function loadDashboard() {
  setConnection("connecting");
  try { render(await api("/api/farm")); setConnection("online"); }
  catch (error) { setConnection("offline"); if (!state) showToast(errorMessage(error), true); }
}

function setSelectedFile(file) {
  if (!file) return clearSelectedFile();
  const valid = ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 10 * 1024 * 1024;
  if (!valid) { clearSelectedFile(); showToast(t("bad_file"), true); return; }
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  const preview = $("leafPreview"); preview.src = previewUrl; preview.hidden = false;
  $("uploadPlaceholder").hidden = true; $("fileRow").hidden = false; setText("fileName", file.name); $("scanBtn").disabled = false;
}

function clearSelectedFile() {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null; $("leafInput").value = ""; $("leafPreview").removeAttribute("src"); $("leafPreview").hidden = true; $("uploadPlaceholder").hidden = false; $("fileRow").hidden = true; $("scanBtn").disabled = true;
}

$("leafInput").addEventListener("change", (event) => setSelectedFile(event.target.files?.[0]));
$("clearPhotoBtn").addEventListener("click", clearSelectedFile);
const dropZone = $("dropZone");
["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add("is-dragging"); }));
["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove("is-dragging"); }));
dropZone.addEventListener("drop", (event) => { const file = event.dataTransfer?.files?.[0]; if (!file) return; const transfer = new DataTransfer(); transfer.items.add(file); $("leafInput").files = transfer.files; setSelectedFile(file); });

$("scanBtn").addEventListener("click", async () => {
  const file = $("leafInput").files?.[0];
  if (!file) { showToast(t("select_photo"), true); return; }
  const button = $("scanBtn"); button.disabled = true; button.classList.add("is-loading"); button.querySelector("span").textContent = t("scanning");
  const form = new FormData(); form.append("image", file);
  try { const result = await api("/api/disease", { method: "POST", body: form }, 125000); showScan(result); if (state) { state.disease = result; state.edge.inference_ms = result.inference_ms; state.edge.confidence = result.confidence; } }
  catch (error) { showToast(errorMessage(error, t("scan_failed")), true); }
  finally { button.disabled = false; button.classList.remove("is-loading"); button.querySelector("span").textContent = t("scan_leaf"); }
});

$("locationForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const locationValue = $("locationInput").value.trim(); const status = $("locationStatus"); const button = $("saveLocationBtn");
  status.classList.remove("is-error");
  if (!locationValue) { status.textContent = t("location_required"); status.classList.add("is-error"); return; }
  button.disabled = true; button.textContent = t("saving");
  try { const result = await api("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: locationValue }) }); status.textContent = t("location_saved", result.farm.location); await loadDashboard(); }
  catch (error) { status.textContent = errorMessage(error); status.classList.add("is-error"); }
  finally { button.disabled = false; button.textContent = t("save"); }
});

$("tokenForm").addEventListener("submit", (event) => {
  event.preventDefault(); const value = $("tokenInput").value.trim();
  if (value) sessionStorage.setItem("km-api-token", value); else sessionStorage.removeItem("km-api-token");
  setText("tokenStatus", value ? t("token_set") : t("token_cleared")); $("tokenInput").value = "";
});

applyLanguage();
activateTab(location.hash.slice(1) || "overview", false);
loadDashboard();
if (window.io) {
  const socket = io();
  socket.on("connect", () => { if (state) setConnection("online"); });
  socket.on("disconnect", () => setConnection("offline"));
  socket.on("connect_error", () => { if (!state) setConnection("offline"); });
  socket.on("telemetry", (data) => { render(data); setConnection("online"); });
} else {
  window.setInterval(loadDashboard, 5000);
}
