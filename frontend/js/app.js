"use strict";

const $ = (id) => document.getElementById(id);
const setText = (id, value) => { const node = $(id); if (node) node.textContent = value ?? "—"; };

const COPY = {
  en: {
    brand_tag: "Local farm intelligence", nav_overview: "Overview", nav_field: "Field tools", nav_field_short: "Field", nav_system: "System",
    nav_models: "AI Models", nav_models_short: "Models", nav_history: "History", nav_chat: "Chatbot", chat_title: "Ask Kisan Mitra", chat_intro: "Ask about farm data or attach an image for model analysis and Gemini guidance.", chat_empty: "Ask about your sensors, soil, crops, or leaf scans.", chat_message: "Message", chat_placeholder: "Ask a farm question…", chat_attach: "Attach image", chat_route: "Image analysis route", chat_auto: "Auto route", chat_photo: "Photo", chat_model_output: "Model result", chat_view_history: "View in History", chat_sending: "Analyzing image…", send: "Send", nav_rover: "Rover", rover_title: "Field rover", rover_intro: "Monitor the rover and prepare field commands. Hardware control will connect when the rover protocol is available.", rover_image_pending: "Rover image coming soon", rover_controls: "Movement controls", protocol_pending: "Protocol pending", rover_safe: "Controls are simulated and do not transmit commands.", rover_log: "Prototype activity", rover_empty: "Use a control to preview the command log.", home_title: "One farm system, online or offline", home_intro: "Monitor sensors, analyze crops and leaves, hear results, review history, and connect field robotics from one interface.",
    connecting: "Connecting", live: "Live", offline: "Offline", checking_server: "Checking edge server…", edge_device: "Edge device", sample_data: "Sample data", sensor_data: "Sensor data", weather_data: "Live weather",
    offline_message: "Live updates are unavailable. Showing the last reading.", retry: "Retry", field_health: "Field health", priority: "Priority",
    soil_moisture: "Soil moisture", temperature: "Temperature", humidity: "Humidity", soil_ph: "Soil pH", ph_note: "Optimal 6.0–7.0", optimal: "Optimal", below_range: "Below target", above_range: "Above target", field_sensor: "Field sensor", live_weather: "Live weather", comfortable: "Comfortable", high_check_leaves: "High — check leaves",
    conditions: "Conditions", soil: "Soil", water: "Water", climate: "Climate", disease_risk: "Leaf health", notices: "Notices", waiting_data: "Waiting for data", updated_now: "Updated now", updated_minutes: (n) => `Updated ${n} min ago`, no_notices: "No active notices.",
    field_tools: "Field tools", soil_and_leaf: "Soil & leaf", field_intro: "Turn sensor readings and one clear leaf photo into practical guidance.", soil_nutrients: "Soil nutrients", checking: "Checking", unavailable: "Unavailable", nitrogen: "Nitrogen", phosphorus: "Phosphorus", potassium: "Potassium", ec: "Electrical conductivity", organic_carbon: "Organic carbon", rainfall: "Rainfall",
    crop_matches: "Crop matches", top_three: "Top 3", crop_disclaimer: "Use these rankings as a starting point alongside local agronomic advice.", no_crops: "Recommendations unavailable",
    leaf_scanner: "Disease detection", scanner_help: "Pepper, potato, and tomato. One leaf, close up, in daylight.", choose_photo: "Choose a leaf photo", choose_pest_photo: "Choose a pest or crop photo", photo_types: "JPG, PNG, or WEBP · up to 10 MB", remove: "Remove", scan_leaf: "Scan leaf", scanning: "Scanning locally", scan_result: "Scan result", local_private: "Processed locally · photo not stored", select_photo: "Choose a photo before scanning.", bad_file: "Choose a JPG, PNG, or WEBP image up to 10 MB.", scan_failed: "The leaf could not be scanned.", healthy_leaf: "Healthy leaf", not_recognized: "Not recognized", listen: "Listen", listening: "Speaking", tts_unavailable: "Speech is not available in this browser.",
    system: "System", device_status: "Device status", system_intro: "Connection, local models, and farm settings for setup and support.", edge_models: "Installed models", installed_models: "Installed models", local: "Local", disease_model: "Disease model", last_inference: "Last inference", confidence: "Confidence", cloud_required: "Cloud required", yes: "Yes", no: "No", not_run: "Not run yet", models_shortcut: "Run models from the AI Models page.",
    models_title: "Run a model", models_intro: "Choose a model and hear the result.", model_input: "Model input", run_model: "Analyze", running_model: "Running", model_result: "Model result", model_failed: "The model could not be run.", select_model: "Select a model to run.", crop_model: "Crop recommendation", soil_model: "Soil fertility", disease_model_card: "Leaf disease detection", pest_model: "Pest detection (prototype)", sensor_auto: "Uses the latest Raspberry Pi sensor reading. Connect the sensor before analyzing.", stop: "Stop", theme_toggle: "Toggle dark mode", mode_edge: "Edge AI · Offline", mode_cloud: "Cloud AI · Online",
    recent_activity: "Recent activity", activity_empty: "Activity appears after you run a model or scan a leaf.", activity_count: (n) => `${n} events`,
    analyses_title: "Saved analyses", analyses_intro: "Open any previous disease, crop, or soil result stored on this device.", past_analyses: "Past analyses", analyses_empty: "Run a model to start saving history.", analysis_detail: "Result", select_analysis: "Select an analysis to view it.", analyses_count: (n) => `${n} saved`,
    account: "Account", signed_out: "Signed out", signed_in: "Signed in", account_help: "Create an account to attach your scans and model runs to a name. The farm dashboard stays usable without signing in.", sign_up: "Sign up", sign_in: "Sign in", sign_out: "Sign out", username: "Username", password: "Password", signup_help: "Choose a username and a password of at least 8 characters.", login_help: "Sign in with your farm username and password.", have_account: "Already have an account? Sign in", need_account: "Need an account? Sign up", signed_in_as: (name) => `Signed in as ${name}`,
    farm_location: "Farm location", location_help: "Used for live weather only when sensor GPS is unavailable.", village_city: "Village or city", location_placeholder: "e.g. Ludhiana, Punjab", save: "Save", saving: "Saving", location_required: "Enter a village or city.", location_saved: (v) => `Saved ${v}.`,
    write_access: "Write access", token_help: "If this device protects changes with an API token, enter it for this browser session.", api_token: "API token", token_placeholder: "Optional", apply: "Apply", token_set: "Token applied for this browser session.", token_cleared: "No token is being used.", authorization_required: "This device requires an API token. Add it under System → Write access.",
    raw_sensor_data: "Raw sensor data", expand: "Expand", request_failed: "Could not reach the edge server. Try again.", fertility: "Fertility", acres_of: (a, c) => `${a} acres · ${c}`, in_location: (v) => ` · ${v}`,
    history_title: "Recent readings", history_empty: "History appears after a few sensor readings are stored.", history_count: (n) => `${n} readings`,
    less_fertile: "Less fertile", fertile: "Fertile", highly_fertile: "Highly fertile",
  },
  hi: {
    brand_tag: "स्थानीय खेत जानकारी", nav_overview: "मुख्य", nav_field: "खेत के औज़ार", nav_field_short: "खेत", nav_system: "सिस्टम",
    nav_models: "AI मॉडल", nav_models_short: "मॉडल", nav_history: "इतिहास", nav_chat: "चैटबॉट", chat_title: "किसान मित्र से पूछें", chat_intro: "खेत का डेटा पूछें या मॉडल जांच और जेमिनी सलाह के लिए फोटो जोड़ें।", chat_empty: "सेंसर, मिट्टी, फसल या पत्ती स्कैन के बारे में पूछें।", chat_message: "संदेश", chat_placeholder: "खेती का सवाल पूछें…", chat_attach: "फोटो जोड़ें", chat_route: "फोटो जांच का रास्ता", chat_auto: "अपने आप चुनें", chat_photo: "फोटो", chat_model_output: "मॉडल परिणाम", chat_view_history: "इतिहास में देखें", chat_sending: "फोटो की जांच जारी…", send: "भेजें", nav_rover: "रोवर", rover_title: "खेत रोवर", rover_intro: "रोवर देखें और खेत कमांड तैयार करें। प्रोटोकॉल मिलने पर हार्डवेयर नियंत्रण जुड़ेगा।", rover_image_pending: "रोवर की फोटो जल्द जोड़ी जाएगी", rover_controls: "हलचल नियंत्रण", protocol_pending: "प्रोटोकॉल बाकी", rover_safe: "ये नियंत्रण केवल प्रदर्शन हैं और कमांड नहीं भेजते।", rover_log: "प्रोटोटाइप गतिविधि", rover_empty: "कमांड लॉग देखने के लिए नियंत्रण दबाएं।", home_title: "ऑनलाइन या ऑफ़लाइन, एक खेत प्रणाली", home_intro: "एक ही इंटरफेस से सेंसर देखें, फसल और पत्ती जांचें, परिणाम सुनें और रोवर जोड़ें।",
    connecting: "जुड़ रहा है", live: "लाइव", offline: "ऑफ़लाइन", checking_server: "डिवाइस जांच रहा है…", edge_device: "खेत का डिवाइस", sample_data: "नमूना डेटा", sensor_data: "सेंसर डेटा", weather_data: "लाइव मौसम",
    offline_message: "लाइव अपडेट उपलब्ध नहीं हैं। पिछली रीडिंग दिखाई जा रही है।", retry: "फिर कोशिश करें", field_health: "खेत की सेहत", priority: "आज का काम",
    soil_moisture: "मिट्टी की नमी", temperature: "तापमान", humidity: "हवा की नमी", soil_ph: "मिट्टी का pH", ph_note: "6.0–7.0 सही", optimal: "सही स्तर", below_range: "स्तर कम", above_range: "स्तर ज़्यादा", field_sensor: "खेत का सेंसर", live_weather: "लाइव मौसम", comfortable: "ठीक है", high_check_leaves: "ज़्यादा — पत्तियां देखें",
    conditions: "स्थिति", soil: "मिट्टी", water: "पानी", climate: "मौसम", disease_risk: "पत्ती की सेहत", notices: "सूचनाएं", waiting_data: "डेटा का इंतज़ार", updated_now: "अभी अपडेट हुआ", updated_minutes: (n) => `${n} मिनट पहले अपडेट`, no_notices: "कोई जरूरी सूचना नहीं।",
    field_tools: "खेत के औज़ार", soil_and_leaf: "मिट्टी और पत्ती", field_intro: "सेंसर रीडिंग और एक साफ पत्ती की फोटो से उपयोगी सलाह पाएं।", soil_nutrients: "मिट्टी के पोषक तत्व", checking: "जांच जारी", unavailable: "उपलब्ध नहीं", nitrogen: "नाइट्रोजन", phosphorus: "फॉस्फोरस", potassium: "पोटैशियम", ec: "विद्युत चालकता", organic_carbon: "जैविक कार्बन", rainfall: "बारिश",
    crop_matches: "फसल सुझाव", top_three: "शीर्ष 3", crop_disclaimer: "इन सुझावों के साथ स्थानीय कृषि विशेषज्ञ की सलाह भी लें।", no_crops: "सुझाव उपलब्ध नहीं",
    leaf_scanner: "रोग पहचान", scanner_help: "मिर्च, आलू और टमाटर। दिन की रोशनी में एक पत्ती की पास से फोटो लें।", choose_photo: "पत्ती की फोटो चुनें", choose_pest_photo: "कीट या फसल की फोटो चुनें", photo_types: "JPG, PNG या WEBP · 10 MB तक", remove: "हटाएं", scan_leaf: "पत्ती स्कैन करें", scanning: "डिवाइस पर जांच जारी", scan_result: "स्कैन परिणाम", local_private: "डिवाइस पर जांच · फोटो सेव नहीं होती", select_photo: "स्कैन से पहले फोटो चुनें।", bad_file: "10 MB तक की JPG, PNG या WEBP फोटो चुनें।", scan_failed: "पत्ती की जांच नहीं हो सकी।", healthy_leaf: "पत्ती स्वस्थ है", not_recognized: "पहचाना नहीं गया", listen: "सुनें", listening: "बोल रहा है", tts_unavailable: "इस ब्राउज़र में आवाज़ उपलब्ध नहीं है।",
    system: "सिस्टम", device_status: "डिवाइस की स्थिति", system_intro: "सेटअप और सहायता के लिए कनेक्शन, स्थानीय मॉडल और खेत की सेटिंग।", edge_models: "इंस्टॉल मॉडल", installed_models: "इंस्टॉल मॉडल", local: "स्थानीय", disease_model: "रोग मॉडल", last_inference: "पिछली जांच", confidence: "भरोसा", cloud_required: "इंटरनेट जरूरी", yes: "हां", no: "नहीं", not_run: "अभी जांच नहीं हुई", models_shortcut: "AI मॉडल पेज से मॉडल चलाएं।",
    models_title: "मॉडल चलाएं", models_intro: "मॉडल चुनें और परिणाम सुनें।", model_input: "मॉडल इनपुट", run_model: "जांच करें", running_model: "चल रहा है", model_result: "मॉडल परिणाम", model_failed: "मॉडल नहीं चल सका।", select_model: "चलाने के लिए मॉडल चुनें।", crop_model: "फसल सुझाव", soil_model: "मिट्टी की उर्वरता", disease_model_card: "पत्ती रोग पहचान", pest_model: "कीट पहचान (प्रोटोटाइप)", sensor_auto: "पिछली रास्पबेरी पाई सेंसर रीडिंग इस्तेमाल होगी। जांच से पहले सेंसर जोड़ें।", stop: "रोकें", theme_toggle: "डार्क मोड बदलें", mode_edge: "एज AI · ऑफ़लाइन", mode_cloud: "क्लाउड AI · ऑनलाइन",
    recent_activity: "हाल की गतिविधि", activity_empty: "मॉडल चलाने या पत्ती स्कैन करने के बाद गतिविधि दिखेगी।", activity_count: (n) => `${n} घटनाएं`,
    analyses_title: "सेव जांच", analyses_intro: "इस डिवाइस पर सेव रोग, फसल या मिट्टी के परिणाम खोलें।", past_analyses: "पिछली जांच", analyses_empty: "इतिहास सेव करने के लिए मॉडल चलाएं।", analysis_detail: "परिणाम", select_analysis: "देखने के लिए एक जांच चुनें।", analyses_count: (n) => `${n} सेव`,
    account: "खाता", signed_out: "साइन आउट", signed_in: "साइन इन", account_help: "स्कैन और मॉडल रन को नाम से जोड़ने के लिए खाता बनाएं। बिना साइन इन भी डैशबोर्ड चलता है।", sign_up: "साइन अप", sign_in: "साइन इन", sign_out: "साइन आउट", username: "यूज़रनेम", password: "पासवर्ड", signup_help: "यूज़रनेम और कम से कम 8 अक्षर का पासवर्ड चुनें।", login_help: "अपने खेत के यूज़रनेम और पासवर्ड से साइन इन करें।", have_account: "खाता है? साइन इन करें", need_account: "खाता चाहिए? साइन अप करें", signed_in_as: (name) => `${name} के रूप में साइन इन`,
    farm_location: "खेत की जगह", location_help: "सेंसर GPS न मिलने पर लाइव मौसम के लिए इस्तेमाल होता है।", village_city: "गांव या शहर", location_placeholder: "जैसे लुधियाना, पंजाब", save: "सेव करें", saving: "सेव हो रहा है", location_required: "गांव या शहर लिखें।", location_saved: (v) => `${v} सेव हो गया।`,
    write_access: "बदलाव की अनुमति", token_help: "अगर इस डिवाइस पर API टोकन लगा है, तो इस ब्राउज़र सत्र के लिए यहां डालें।", api_token: "API टोकन", token_placeholder: "वैकल्पिक", apply: "लागू करें", token_set: "इस ब्राउज़र सत्र के लिए टोकन लागू है।", token_cleared: "कोई टोकन इस्तेमाल नहीं हो रहा।", authorization_required: "इस डिवाइस को API टोकन चाहिए। सिस्टम → बदलाव की अनुमति में टोकन डालें।",
    raw_sensor_data: "सेंसर का कच्चा डेटा", expand: "खोलें", request_failed: "खेत के डिवाइस से संपर्क नहीं हुआ। फिर कोशिश करें।", fertility: "उपजाऊपन", acres_of: (a, c) => `${a} एकड़ · ${c}`, in_location: (v) => ` · ${v}`,
    history_title: "हाल की रीडिंग", history_empty: "कुछ सेंसर रीडिंग जमा होने के बाद इतिहास दिखेगा।", history_count: (n) => `${n} रीडिंग`,
    less_fertile: "कम उपजाऊ", fertile: "उपजाऊ", highly_fertile: "बहुत उपजाऊ",
  },
};

let language = localStorage.getItem("km-language") === "hi" ? "hi" : "en";
let state = null;
let lastHistory = [];
let lastActivity = [];
let lastAnalyses = [];
let currentUser = null;
let selectedModel = "disease";
let lastScanSpeech = "";
let lastModelSpeech = "";
let lastDetailSpeech = "";
let ttsLang = { scan: "en", model: "en", detail: "en" };
let authMode = "signup";
let previewUrl = null;
let modelPreviewUrl = null;
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
    const response = await fetch(url, { credentials: "same-origin", ...options, headers: authHeaders(options.headers), signal: controller.signal });
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
  const valid = ["overview", "models", "chat", "rover", "history", "system"].includes(name) ? name : "overview";
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
$("brandHome").addEventListener("click", () => activateTab("overview"));
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

// Dataset maxima from Data/crop_recommendation.csv (N 0-140, P 5-145, K 5-205).
const NPK_MAX = { n: 140, p: 145, k: 205 };
function npkPercent(nutrient, value) {
  const max = NPK_MAX[nutrient] || 100;
  return (Math.max(0, Number(value) || 0) / max) * 100;
}

function sparkPoints(values) {
  if (!values.length) return "";
  return values.map((pct, i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 300;
    const y = 118 - (Math.max(0, Math.min(100, pct)) / 100) * 112;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function renderHistory(rows = []) {
  lastHistory = rows;
  const clamp100 = (v) => Math.max(0, Math.min(100, Number(v) || 0));
  const moisture = rows.map((r) => clamp100(r.moisture));
  const humidity = rows.map((r) => clamp100(r.humidity));
  const temperature = rows.map((r) => clamp100(((Number(r.temperature) || 0) / 50) * 100));
  const moistureNode = $("sparkMoisture");
  const tempNode = $("sparkTemperature");
  const humidityNode = $("sparkHumidity");
  if (moistureNode) moistureNode.setAttribute("points", sparkPoints(moisture));
  if (tempNode) tempNode.setAttribute("points", sparkPoints(temperature));
  if (humidityNode) humidityNode.setAttribute("points", sparkPoints(humidity));
  setText("historyCount", rows.length ? t("history_count", rows.length) : "");
  const empty = $("historyEmpty");
  if (empty) empty.hidden = rows.length >= 2;
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
  if (!box) return;
  const recognized = result.recognized !== false;
  box.hidden = false;
  box.classList.toggle("is-good", recognized && result.healthy);
  box.classList.toggle("is-warning", !recognized || !result.healthy);
  setText("resultIcon", recognized && result.healthy ? "✓" : "!");
  setText("resultTitle", !recognized ? t("not_recognized") : result.healthy ? t("healthy_leaf") : result.disease);
  setText("resultConfidence", recognized && Number.isFinite(Number(result.confidence)) ? `${Number(result.confidence).toFixed(1)}%` : "");
  setText("resultTreatment", localizedTreatment(result));
  setText("resultSpeed", Number.isFinite(Number(result.inference_ms)) ? `${Number(result.inference_ms).toFixed(1)} ms` : "");
  lastScanSpeech = result.speech || `${$("resultTitle").textContent}. ${localizedTreatment(result)}`;
}

function formatWhen(iso) {
  if (!iso) return "";
  const locale = language === "hi" ? "hi-IN" : "en-IN";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

function toolLabel(tool) {
  const map = { field_tools: t("nav_field"), ai_models: t("nav_models"), account: t("account"), sensors: t("sensor_data") };
  return map[tool] || tool;
}

function typeLabel(type) {
  if (type === "disease") return t("disease_model_card");
  if (type === "crop") return t("crop_model");
  if (type === "soil") return t("soil_model");
  if (type === "pest") return t("pest_model");
  return type;
}

function renderActivity(rows = []) {
  lastActivity = rows;
  const list = $("activityList");
  if (!list) return;
  setText("activityCount", rows.length ? t("activity_count", rows.length) : "");
  list.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = t("activity_empty");
    list.append(empty);
    return;
  }
  rows.slice(0, 8).forEach((item) => {
    const article = document.createElement("article");
    article.className = "activity-item";
    const title = document.createElement("b");
    title.textContent = item.summary;
    const meta = document.createElement("p");
    meta.textContent = [toolLabel(item.tool), item.model, formatWhen(item.created_at)].filter(Boolean).join(" · ");
    article.append(title, meta);
    if (item.analysis_id) {
      article.tabIndex = 0;
      article.style.cursor = "pointer";
      article.addEventListener("click", () => { activateTab("history"); openAnalysis(item.analysis_id); });
    }
    list.append(article);
  });
}

function analysisSummary(item) {
  const result = item.result || {};
  if (item.analysis_type === "disease") {
    if (result.recognized === false) return t("not_recognized");
    if (result.healthy) return t("healthy_leaf");
    return result.disease || result.label || t("scan_result");
  }
  if (item.analysis_type === "crop") {
    return result.crops?.[0]?.crop || result.recommendation?.title || t("crop_model");
  }
  if (item.analysis_type === "pest") {
    return result.summary || result.analysis?.slice(0, 80) || t("pest_model");
  }
  return result.fertility?.fertility || t("soil_model");
}

function renderAnalyses(rows = []) {
  lastAnalyses = rows;
  const list = $("analysisList");
  if (!list) return;
  setText("analysesCount", rows.length ? t("analyses_count", rows.length) : "");
  list.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = t("analyses_empty");
    list.append(empty);
    return;
  }
  rows.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "analysis-row";
    button.dataset.id = String(item.id);
    const title = document.createElement("b");
    title.textContent = `${typeLabel(item.analysis_type)} · ${analysisSummary(item)}`;
    const meta = document.createElement("span");
    meta.textContent = [item.model, item.user?.username, formatWhen(item.created_at)].filter(Boolean).join(" · ");
    button.append(title, meta);
    button.addEventListener("click", () => openAnalysis(item.id, item));
    list.append(button);
  });
}

function showAnalysisDetail(item) {
  const detail = $("analysisDetail");
  if (!detail) return;
  detail.replaceChildren();
  const title = document.createElement("strong");
  title.textContent = `${typeLabel(item.analysis_type)} · ${analysisSummary(item)}`;
  const meta = document.createElement("p");
  meta.className = "panel-copy";
  meta.textContent = [item.model, item.user?.username, formatWhen(item.created_at)].filter(Boolean).join(" · ");
  const body = document.createElement("p");
  const result = item.result || {};
  if (result.chat_answer) body.textContent = result.chat_answer;
  else if (item.analysis_type === "disease") body.textContent = localizedTreatment(result);
  else if (item.analysis_type === "crop") {
    const crops = (result.crops || []).map((c) => `${c.crop} ${c.confidence}%`).join(", ");
    body.textContent = `${result.recommendation?.title || ""}. ${result.recommendation?.message || ""} ${crops}`.trim();
  } else if (item.analysis_type === "pest") {
    body.textContent = result.analysis || result.summary || JSON.stringify(result);
  } else {
    const fert = result.fertility || {};
    body.textContent = fert.fertility ? `${fert.fertility} (${fert.confidence}%)` : JSON.stringify(result);
  }
  const input = document.createElement("pre");
  input.className = "analysis-input";
  input.textContent = JSON.stringify(item.input || {}, null, 2);
  const image = item.image_url ? document.createElement("img") : null;
  if (image) {
    image.className = "analysis-image";
    image.src = item.image_url;
    image.alt = `${typeLabel(item.analysis_type)} upload`;
    image.loading = "lazy";
  }
  const listen = document.createElement("button");
  listen.type = "button";
  listen.className = "listen-button";
  listen.innerHTML = `<span>${t("listen")}</span>`;
  lastDetailSpeech = result.speech || body.textContent;
  listen.addEventListener("click", () => speakResult(lastDetailSpeech, ttsLang.detail || language));
  const stop = document.createElement("button");
  stop.type = "button";
  stop.className = "secondary-button stop-speech";
  stop.textContent = t("stop");
  stop.addEventListener("click", () => window.speechSynthesis?.cancel());
  detail.append(title, meta);
  if (image) detail.append(image);
  detail.append(body, listen, stop, input);
  document.querySelectorAll(".analysis-row").forEach((row) => row.classList.toggle("is-active", Number(row.dataset.id) === item.id));
}

async function openAnalysis(id, cached) {
  try {
    const item = cached || await api(`/api/analyses/${id}`);
    showAnalysisDetail(item);
  } catch (error) {
    showToast(errorMessage(error), true);
  }
}

async function speakResult(text, lang) {
  const spoken = (text || "").trim();
  if (!spoken) return;
  const chosen = lang === "hi" ? "hi" : "en";
  try {
    const payload = await api("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: spoken, lang: chosen }) });
    if (!window.speechSynthesis) {
      showToast(t("tts_unavailable"), true);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(payload.text);
    utterance.lang = payload.voice_lang || (chosen === "hi" ? "hi-IN" : "en-IN");
    utterance.onerror = () => showToast(t("tts_unavailable"), true);
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    showToast(errorMessage(error, t("tts_unavailable")), true);
  }
}

function fillModelFields() {
  const telemetry = state?.telemetry || {};
  const npk = telemetry.npk || {};
  const cropFields = [
    ["n", "N", npk.n], ["p", "P", npk.p], ["k", "K", npk.k],
    ["temperature", t("temperature"), telemetry.temperature],
    ["humidity", t("humidity"), telemetry.humidity],
    ["ph", t("soil_ph"), telemetry.ph],
    ["rainfall", t("rainfall"), telemetry.rainfall],
  ];
  const soilFields = [
    ["n", "N", npk.n], ["p", "P", npk.p], ["k", "K", npk.k],
    ["ph", t("soil_ph"), telemetry.ph], ["ec", t("ec"), telemetry.ec],
    ["organic_carbon", t("organic_carbon"), telemetry.organic_carbon],
  ];
  const fields = selectedModel === "soil" ? soilFields : cropFields;
  const grid = $("modelFields");
  grid.replaceChildren();
  fields.forEach(([name, label, value]) => {
    const wrap = document.createElement("label");
    wrap.textContent = label;
    const input = document.createElement("input");
    input.name = name;
    input.type = "number";
    input.step = "any";
    input.value = value ?? "";
    wrap.append(input);
    grid.append(wrap);
  });
}

function renderModelCards(models = state?.models) {
  const cards = $("modelCards");
  if (!cards) return;
  const items = models || [
    { id: "disease", name: t("disease_model_card"), ready: true, description: t("scanner_help") },
    { id: "crop", name: t("crop_model"), ready: true, description: t("crop_disclaimer") },
    { id: "soil", name: t("soil_model"), ready: true, description: t("soil_nutrients") },
    { id: "pest", name: t("pest_model"), ready: false, description: "Cloud image screening prototype; connect the server and configure Gemini to run it." },
  ];
  cards.replaceChildren();
  items.forEach((model) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `model-card${selectedModel === model.id ? " is-active" : ""}`;
    const title = document.createElement("b");
    title.textContent = typeLabel(model.id);
    const copy = document.createElement("span");
    copy.textContent = model.description || "";
    const status = document.createElement("small");
    status.textContent = model.ready === false ? t("unavailable") : model.id === "pest" ? t("mode_cloud") : t("local");
    button.append(title, copy, status);
    button.addEventListener("click", () => selectModel(model.id));
    cards.append(button);
  });
}

function selectModel(id) {
  selectedModel = id;
  renderModelCards();
  setText("selectedModelLabel", typeLabel(id));
  const image = $("modelImageForm");
  const sensors = $("modelSensorForm");
  image.hidden = !["disease", "pest"].includes(id);
  sensors.hidden = ["disease", "pest"].includes(id);
  $("runImageModelBtn").querySelector("span").textContent = t(id === "pest" ? "run_model" : "scan_leaf");
  const uploadLabel = $("modelUploadPlaceholder")?.querySelector("b");
  if (uploadLabel) {
    uploadLabel.dataset.i18n = id === "pest" ? "choose_pest_photo" : "choose_photo";
    uploadLabel.textContent = t(uploadLabel.dataset.i18n);
  }
  $("modelLeafPreview").alt = id === "pest" ? "Selected pest preview" : "Selected leaf preview";
  if (!["disease", "pest"].includes(id)) {
    $("modelFields").replaceChildren();
    $("modelSensorForm").querySelector(".sensor-source-note").textContent = t("sensor_auto");
  }
  $("modelResult").hidden = true;
  $("modelRunStatus").textContent = "";
}

function showModelResult(title, body, speech, good = true, confidence = "", mode = "edge") {
  const box = $("modelResult");
  box.hidden = false;
  box.classList.toggle("is-good", good);
  box.classList.toggle("is-warning", !good);
  setText("modelResultIcon", good ? "✓" : "!");
  setText("modelResultTitle", title);
  setText("modelResultBody", body);
  setText("modelResultConfidence", confidence);
  setText("modelModeBadge", t(mode === "cloud" ? "mode_cloud" : "mode_edge"));
  lastModelSpeech = speech || `${title}. ${body}`;
}

function formValues(form) {
  const data = {};
  new FormData(form).forEach((value, key) => { if (value !== "") data[key] = Number(value); });
  return data;
}

function renderAccount() {
  const signedIn = Boolean(currentUser);
  if ($("accountSignedOut")) $("accountSignedOut").hidden = signedIn;
  if ($("accountSignedIn")) $("accountSignedIn").hidden = !signedIn;
  const chip = $("accountChip");
  if (chip) {
    chip.textContent = signedIn ? t("signed_in") : t("signed_out");
    chip.classList.toggle("success", signedIn);
  }
  if (signedIn) setText("signedInAs", t("signed_in_as", currentUser.username));
  document.body.classList.toggle("guest", !signedIn);
  if ($("landingPanel")) $("landingPanel").hidden = signedIn;
  document.querySelectorAll('[data-tab]:not([data-tab="overview"])').forEach((node) => { node.disabled = !signedIn; });
  if (!signedIn && !$("page-overview").classList.contains("is-active")) activateTab("overview");
}

function openAuth(mode) {
  authMode = mode;
  $("authModal").hidden = false;
  $("authStatus").textContent = "";
  $("authStatus").classList.remove("is-error");
  $("authTitle").textContent = t(mode === "login" ? "sign_in" : "sign_up");
  $("authHelp").textContent = t(mode === "login" ? "login_help" : "signup_help");
  $("authSubmitBtn").querySelector("span").textContent = t(mode === "login" ? "sign_in" : "sign_up");
  $("switchAuthBtn").textContent = t(mode === "login" ? "need_account" : "have_account");
  $("authPassword").autocomplete = mode === "login" ? "current-password" : "new-password";
  $("authUsername").focus();
}

function closeAuth() { $("authModal").hidden = true; }

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
  setBar("nBar", npkPercent("n", telemetry.npk.n)); setBar("pBar", npkPercent("p", telemetry.npk.p)); setBar("kBar", npkPercent("k", telemetry.npk.k));
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
  if (data.user) currentUser = data.user;
  else if (data.user === null) currentUser = null;
  renderAccount();
  renderModelCards(data.models);
}

function applyLanguage() {
  document.documentElement.lang = language === "hi" ? "hi" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  if ($("themeToggle")) $("themeToggle").setAttribute("aria-label", t("theme_toggle"));
  $("locationInput").placeholder = t("location_placeholder"); $("tokenInput").placeholder = t("token_placeholder");
  [["langEn", "en"], ["langHi", "hi"]].forEach(([id, value]) => { const active = language === value; $(id).classList.toggle("is-active", active); $(id).setAttribute("aria-pressed", String(active)); });
  if (state) {
    const mode = $("connection").classList.contains("is-offline") ? "offline" : "online";
    render(state); setConnection(mode);
    if (lastHistory.length) renderHistory(lastHistory);
    else { setText("historyCount", ""); const empty = $("historyEmpty"); if (empty) empty.hidden = false; }
    if (lastActivity.length) renderActivity(lastActivity);
    if (lastAnalyses.length) renderAnalyses(lastAnalyses);
    renderAccount();
    renderModelCards();
    applyAuthCopy();
  } else setConnection("connecting");
}

$("langEn").addEventListener("click", () => { language = "en"; localStorage.setItem("km-language", language); applyLanguage(); });
$("langHi").addEventListener("click", () => { language = "hi"; localStorage.setItem("km-language", language); applyLanguage(); });

async function loadDashboard() {
  setConnection("connecting");
  try { render(await api("/api/farm")); setConnection("online"); }
  catch (error) { setConnection("offline"); if (!state) showToast(errorMessage(error), true); }
  try { renderHistory(await api("/api/history")); } catch { /* sparkline is optional */ }
  try { renderActivity(await api("/api/activity")); } catch { /* activity is optional */ }
  try { renderAnalyses(await api("/api/analyses")); } catch { /* history page is optional */ }
  try {
    const me = await api("/api/auth/me");
    currentUser = me.user;
    renderAccount();
  } catch { /* guest mode */ }
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
  try {
    const result = await api("/api/disease", { method: "POST", body: form }, 125000);
    showScan(result);
    if (state) { state.disease = result; state.edge.inference_ms = result.inference_ms; state.edge.confidence = result.confidence; }
    try { renderActivity(await api("/api/activity")); renderAnalyses(await api("/api/analyses")); } catch { /* keep current lists */ }
  }
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

let chatPreviewUrl = null;
function clearChatImage() {
  if (chatPreviewUrl) URL.revokeObjectURL(chatPreviewUrl);
  chatPreviewUrl = null;
  $("chatImage").value = "";
  $("chatPreview").removeAttribute("src");
  $("chatAttachment").hidden = true;
  $("chatRoute").value = "auto";
}
$("chatImage").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return clearChatImage();
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
    clearChatImage();
    showToast(t("bad_file"), true);
    return;
  }
  if (chatPreviewUrl) URL.revokeObjectURL(chatPreviewUrl);
  chatPreviewUrl = URL.createObjectURL(file);
  $("chatPreview").src = chatPreviewUrl;
  $("chatFileName").textContent = file.name;
  $("chatAttachment").hidden = false;
});
$("chatRemoveImage").addEventListener("click", clearChatImage);

$("chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = $("chatInput");
  const message = input.value.trim();
  const file = $("chatImage").files?.[0];
  if (!message && !file) return;
  const send = $("chatForm").querySelector('button[type="submit"]');
  const status = $("chatStatus");
  status.textContent = file ? t("chat_sending") : "";
  status.classList.remove("is-error");
  send.disabled = true;
  const log = $("chatLog");
  if (log.querySelector(".empty")) log.replaceChildren();
  const user = document.createElement("p");
  user.className = "chat-message user";
  user.textContent = message || t("chat_photo");
  const photo = file ? document.createElement("img") : null;
  if (photo) {
    photo.src = chatPreviewUrl;
    photo.alt = file.name;
    user.append(photo);
  }
  log.append(user);
  try {
    let result;
    if (file) {
      const form = new FormData();
      form.append("image", file);
      form.append("message", message);
      form.append("route", $("chatRoute").value);
      result = await api("/api/chat/image", { method: "POST", body: form }, 125000);
    } else {
      result = await api("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) }, 45000);
    }
    const reply = document.createElement("div");
    reply.className = "chat-message assistant";
    const mode = document.createElement("small");
    mode.textContent = t(result.mode === "cloud" ? "mode_cloud" : "mode_edge");
    const text = document.createElement("p");
    text.textContent = result.answer;
    if (file) {
      const model = document.createElement("span");
      model.className = "chat-model-note";
      const output = result.analysis_type === "pest"
        ? result.model_output?.analysis?.slice(0, 140)
        : result.model_output?.recognized === false ? t("not_recognized") : result.model_output?.disease || result.model_output?.label;
      model.textContent = `${t("chat_model_output")}: ${typeLabel(result.analysis_type)} · ${output || ""}`;
      reply.append(model);
    }
    const listen = document.createElement("button");
    listen.type = "button";
    listen.className = "listen-button";
    listen.textContent = t("listen");
    listen.addEventListener("click", () => speakResult(result.answer, language));
    reply.append(mode, text, listen);
    if (file) {
      const history = document.createElement("button");
      history.type = "button";
      history.className = "text-link";
      history.textContent = t("chat_view_history");
      history.addEventListener("click", () => { activateTab("history"); openAnalysis(result.analysis_id); });
      reply.append(history);
      photo.src = result.image_url;
      clearChatImage();
    }
    log.append(reply);
    input.value = "";
    status.textContent = "";
    if (file) {
      const [activity, analyses] = await Promise.allSettled([api("/api/activity"), api("/api/analyses")]);
      if (activity.status === "fulfilled") renderActivity(activity.value);
      if (analyses.status === "fulfilled") renderAnalyses(analyses.value);
    }
  } catch (error) {
    user.remove();
    status.textContent = errorMessage(error);
    status.classList.add("is-error");
  } finally {
    send.disabled = false;
  }
});

function applyAuthCopy() {
  if ($("authModal")?.hidden === false) openAuth(authMode);
}

$("scanListenBtn")?.addEventListener("click", () => speakResult(lastScanSpeech, ttsLang.scan));
$("modelListenBtn")?.addEventListener("click", () => speakResult(lastModelSpeech, ttsLang.model));
document.querySelectorAll(".result-actions").forEach((actions) => {
  const stop = document.createElement("button");
  stop.type = "button";
  stop.className = "secondary-button stop-speech";
  stop.dataset.i18n = "stop";
  stop.textContent = t("stop");
  stop.addEventListener("click", () => window.speechSynthesis?.cancel());
  actions.append(stop);
});
document.querySelectorAll("[data-tts-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.for;
    ttsLang[target] = button.dataset.ttsLang;
    document.querySelectorAll(`[data-for="${target}"]`).forEach((node) => node.classList.toggle("is-active", node === button));
  });
});

$("openSignupBtn")?.addEventListener("click", () => openAuth("signup"));
$("openLoginBtn")?.addEventListener("click", () => openAuth("login"));
$("landingSignup")?.addEventListener("click", () => openAuth("signup"));
$("landingLogin")?.addEventListener("click", () => openAuth("login"));
$("closeAuthBtn")?.addEventListener("click", closeAuth);
$("authModal")?.addEventListener("click", (event) => { if (event.target === $("authModal")) closeAuth(); });
$("switchAuthBtn")?.addEventListener("click", () => openAuth(authMode === "login" ? "signup" : "login"));
$("logoutBtn")?.addEventListener("click", async () => {
  try { await api("/api/auth/logout", { method: "POST" }); } catch { /* local sign-out still applies */ }
  currentUser = null;
  renderAccount();
});
$("authForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = $("authStatus");
  status.classList.remove("is-error");
  const username = $("authUsername").value.trim();
  const password = $("authPassword").value;
  const path = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
  try {
    const result = await api(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
    currentUser = result.user;
    renderAccount();
    closeAuth();
    $("authForm").reset();
    await loadDashboard();
  } catch (error) {
    status.textContent = errorMessage(error);
    status.classList.add("is-error");
  }
});

$("runModelBtn")?.closest("form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (selectedModel === "disease") return;
  const button = $("runModelBtn");
  button.disabled = true;
  button.classList.add("is-loading");
  button.querySelector("span").textContent = t("running_model");
  $("modelRunStatus").classList.remove("is-error");
  try {
    const path = selectedModel === "soil" ? "/api/models/soil" : "/api/models/crop";
    const result = await api(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formValues($("modelSensorForm"))) }, 45000);
    if (selectedModel === "crop") {
      const top = result.crops?.[0];
      showModelResult(result.recommendation?.title || t("crop_model"), `${result.recommendation?.message || ""} ${(result.crops || []).map((c) => `${c.crop} ${c.confidence}%`).join(", ")} ${result.cloud_analysis || ""}`.trim(), result.speech, true, top ? `${top.confidence}%` : "", result.mode);
    } else {
      const fert = result.fertility || {};
      showModelResult(fert.fertility || t("soil_model"), result.speech || "", result.speech, fert.status === "ready", fert.confidence != null ? `${fert.confidence}%` : "", result.mode);
    }
    renderActivity(await api("/api/activity"));
    renderAnalyses(await api("/api/analyses"));
  } catch (error) {
    $("modelRunStatus").textContent = errorMessage(error, t("model_failed"));
    $("modelRunStatus").classList.add("is-error");
  } finally {
    button.disabled = false;
    button.classList.remove("is-loading");
    button.querySelector("span").textContent = t("run_model");
  }
});

function setModelFile(file) {
  if (!file) return clearModelFile();
  const valid = ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 10 * 1024 * 1024;
  if (!valid) { clearModelFile(); showToast(t("bad_file"), true); return; }
  if (modelPreviewUrl) URL.revokeObjectURL(modelPreviewUrl);
  modelPreviewUrl = URL.createObjectURL(file);
  $("modelLeafPreview").src = modelPreviewUrl;
  $("modelLeafPreview").hidden = false;
  $("modelUploadPlaceholder").hidden = true;
  $("runImageModelBtn").disabled = false;
  $("clearModelPhotoBtn").hidden = false;
}

function clearModelFile() {
  if (modelPreviewUrl) URL.revokeObjectURL(modelPreviewUrl);
  modelPreviewUrl = null;
  $("modelLeafInput").value = "";
  $("modelLeafPreview").removeAttribute("src");
  $("modelLeafPreview").hidden = true;
  $("modelUploadPlaceholder").hidden = false;
  $("runImageModelBtn").disabled = true;
  $("clearModelPhotoBtn").hidden = true;
}

$("modelLeafInput")?.addEventListener("change", (event) => setModelFile(event.target.files?.[0]));
$("clearModelPhotoBtn").addEventListener("click", clearModelFile);
const modelDropZone = $("modelDropZone");
["dragenter", "dragover"].forEach((name) => modelDropZone.addEventListener(name, (event) => { event.preventDefault(); modelDropZone.classList.add("is-dragging"); }));
["dragleave", "drop"].forEach((name) => modelDropZone.addEventListener(name, (event) => { event.preventDefault(); modelDropZone.classList.remove("is-dragging"); }));
modelDropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  $("modelLeafInput").files = transfer.files;
  setModelFile(file);
});
$("runImageModelBtn")?.addEventListener("click", async () => {
  const file = $("modelLeafInput").files?.[0];
  if (!file) { showToast(t("select_photo"), true); return; }
  const button = $("runImageModelBtn");
  button.disabled = true;
  button.classList.add("is-loading");
  button.querySelector("span").textContent = t("scanning");
  const form = new FormData();
  form.append("image", file);
  try {
    const result = await api(selectedModel === "pest" ? "/api/models/pest" : "/api/disease", { method: "POST", body: form }, 125000);
    const title = selectedModel === "pest" ? t("pest_model") : result.recognized === false ? t("not_recognized") : result.healthy ? t("healthy_leaf") : result.disease;
    const body = selectedModel === "pest" ? result.analysis : `${localizedTreatment(result)} ${result.cloud_analysis || ""}`.trim();
    showModelResult(title, body, result.speech || `${title}. ${body}`, selectedModel === "pest" || (result.recognized !== false && result.healthy), result.confidence != null ? `${Number(result.confidence).toFixed(1)}%` : "", result.mode);
    if (selectedModel === "disease") showScan(result);
    renderActivity(await api("/api/activity"));
    renderAnalyses(await api("/api/analyses"));
  } catch (error) {
    showToast(errorMessage(error, t("scan_failed")), true);
  } finally {
    button.disabled = false;
    button.classList.remove("is-loading");
    button.querySelector("span").textContent = t(selectedModel === "pest" ? "run_model" : "scan_leaf");
  }
});

const overviewGrid = $("page-overview").querySelector(".overview-grid");
const modeBadge = document.createElement("span");
modeBadge.id = "modelModeBadge";
modeBadge.className = "status-chip";
$("modelResult").prepend(modeBadge);
const oldFieldPage = $("page-field");
overviewGrid.insertBefore(oldFieldPage.querySelector(".soil-panel"), overviewGrid.querySelector(".activity-panel"));
overviewGrid.insertBefore(oldFieldPage.querySelector("#cropTitle").closest(".panel"), overviewGrid.querySelector(".activity-panel"));
oldFieldPage.remove();
document.querySelectorAll('[data-tab="field"]').forEach((button) => button.remove());
document.querySelectorAll("#page-overview > :not(#landingPanel)").forEach((node) => node.classList.add("dashboard-private"));
const mobileNav = document.querySelector(".mobile-nav");
[["chat", "nav_chat"], ["rover", "nav_rover"]].forEach(([name, key]) => {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.tab = name;
  const label = document.createElement("span");
  label.dataset.i18n = key;
  label.textContent = t(key);
  button.append(label);
  button.addEventListener("click", () => activateTab(name));
  mobileNav.insertBefore(button, mobileNav.querySelector('[data-tab="history"]'));
});

document.querySelectorAll("[data-rover-command]").forEach((button) => button.addEventListener("click", () => {
  const log = $("roverLog");
  if (log.querySelector(".empty")) log.replaceChildren();
  const item = document.createElement("article");
  item.className = "activity-item";
  const command = button.dataset.roverCommand;
  item.innerHTML = `<b>${command}</b><p>${new Date().toLocaleTimeString()} · simulated</p>`;
  log.prepend(item);
}));

const themeToggle = document.createElement("button");
themeToggle.id = "themeToggle";
themeToggle.type = "button";
themeToggle.className = "theme-toggle";
themeToggle.setAttribute("aria-label", t("theme_toggle"));
themeToggle.textContent = "☀ / ☾";
themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
  localStorage.setItem("km-theme", dark ? "dark" : "light");
});
document.querySelector(".sidebar-footer").prepend(themeToggle);
document.documentElement.dataset.theme = localStorage.getItem("km-theme") === "dark" ? "dark" : "light";
themeToggle.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "dark"));

selectModel("disease");

applyLanguage();
activateTab(location.hash.slice(1) || "overview", false);
loadDashboard();
if (window.io) {
  const socket = io();
  socket.on("connect", () => { if (state) setConnection("online"); });
  socket.on("disconnect", () => setConnection("offline"));
  socket.on("connect_error", () => { if (!state) setConnection("offline"); });
  socket.on("telemetry", (data) => {
    render(data); setConnection("online");
    api("/api/activity").then(renderActivity).catch(() => {});
    api("/api/analyses").then(renderAnalyses).catch(() => {});
  });
} else {
  window.setInterval(loadDashboard, 5000);
}
