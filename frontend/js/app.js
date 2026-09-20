"use strict";

const $ = (id) => document.getElementById(id);
const setText = (id, value) => { const node = $(id); if (node) node.textContent = value ?? "—"; };

const COPY = {
  en: {
    brand_tag: "Local farm intelligence", nav_overview: "Farm Dashboard", nav_field: "Field tools", nav_field_short: "Field", nav_system: "Edge AI",
    connecting: "Connecting", live: "Live", offline: "Offline", checking_server: "Checking edge server…", edge_device: "Edge device", sample_data: "Sample data", sensor_data: "Sensor data", weather_data: "Live weather",
    offline_message: "Live updates are unavailable. Showing the last reading.", retry: "Retry", field_health: "Field health", priority: "Priority",
    soil_moisture: "Soil moisture", temperature: "Temperature", humidity: "Humidity", soil_ph: "Soil pH", ph_note: "Optimal 6.0–7.0", optimal: "Optimal", below_range: "Below target", above_range: "Above target", field_sensor: "Field sensor", live_weather: "Live weather", comfortable: "Comfortable", high_check_leaves: "High — check leaves",
    conditions: "Conditions", soil: "Soil", water: "Water", climate: "Climate", disease_risk: "Leaf health", notices: "Notices", waiting_data: "Waiting for data", updated_now: "Updated now", updated_minutes: (n) => `Updated ${n} min ago`, no_notices: "No active notices.",
    field_tools: "Field tools", soil_and_leaf: "Soil & leaf", field_intro: "Turn sensor readings and one clear leaf photo into practical guidance.", soil_nutrients: "Soil nutrients", checking: "Checking", unavailable: "Unavailable", nitrogen: "Nitrogen", phosphorus: "Phosphorus", potassium: "Potassium", ec: "Electrical conductivity", organic_carbon: "Organic carbon", rainfall: "Rainfall",
    crop_matches: "Crop matches", top_three: "Top 3", crop_disclaimer: "Use these rankings as a starting point alongside local agronomic advice.", no_crops: "Recommendations unavailable",
    leaf_scanner: "Leaf scanner", scanner_help: "Pepper, potato, and tomato. One leaf, close up, in daylight.", choose_photo: "Choose a leaf photo", photo_types: "JPG, PNG, or WEBP · up to 10 MB", remove: "Remove", scan_leaf: "Scan leaf", scanning: "Scanning locally", scan_result: "Scan result", local_private: "Processed locally · photo not stored", select_photo: "Choose a photo before scanning.", bad_file: "Choose a JPG, PNG, or WEBP image up to 10 MB.", scan_failed: "The leaf could not be scanned.", healthy_leaf: "Healthy leaf", not_recognized: "Not recognized",
    system: "EDGE AI", device_status: "Local intelligence for your field", system_intro: "Connection, local models, and farm settings for setup and support.", edge_models: "Edge models", local: "Local", disease_model: "Disease model", last_inference: "Last inference", confidence: "Confidence", cloud_required: "Cloud required", yes: "Yes", no: "No", not_run: "Not run yet",
    farm_location: "Farm location", location_help: "Used for live weather only when sensor GPS is unavailable.", village_city: "Village or city", location_placeholder: "e.g. Ludhiana, Punjab", save: "Save", saving: "Saving", location_required: "Enter a village or city.", location_saved: (v) => `Saved ${v}.`,
    write_access: "Write access", token_help: "If this device protects changes with an API token, enter it for this browser session.", api_token: "API token", token_placeholder: "Optional", apply: "Apply", token_set: "Token applied for this browser session.", token_cleared: "No token is being used.", authorization_required: "This device requires an API token. Add it under System → Write access.",
    raw_sensor_data: "Raw sensor data", expand: "Expand", request_failed: "Could not reach the edge server. Try again.", fertility: "Fertility", acres_of: (a, c) => `${a} acres · ${c}`, in_location: (v) => ` · ${v}`,
    less_fertile: "Less fertile", fertile: "Fertile", highly_fertile: "Highly fertile",
    nav_rover: "Rover", rover_overline: "ROVER", rover_title: "Field operations & live control", rover_desc: "Monitor the rover, control movement and manage field operations.",
    rover_status: "ROVER STATUS", running_time: "Running time", rpi_label: "Raspberry Pi", arduino_label: "Arduino Mega", camera_label: "Camera", npk_sensor_label: "NPK Sensor",
    status_online: "Online", status_connected: "Connected", status_ready: "Ready",
    live_camera: "LIVE CAMERA", camera_ready: "Camera Ready", camera_placeholder_title: "Live Camera", camera_placeholder_desc: "Camera feed will appear here",
    movement_title: "MOVEMENT", movement_stopped: "Stopped", movement_forward: "Moving forward", movement_reverse: "Moving reverse", movement_left: "Turning left", movement_right: "Turning right",
    move_forward: "Forward", move_reverse: "Reverse", move_left: "Left", move_right: "Right", move_stop: "Stop",
    field_actions_title: "FIELD ACTIONS", action_npk_title: "NPK SAMPLE", action_npk_desc: "Deploy sensor and collect soil reading",
    seq_deploy: "Deploy", seq_read: "Read", seq_save: "Save location", seq_retract: "Retract", btn_sample: "Sample",
    action_seeder_title: "SEEDER", action_seeder_desc: "Activate seeder", seeder_servo_spec: "Servo action: 45°", btn_seed: "Seed",
    action_pesticide_title: "PESTICIDE", action_pesticide_desc: "Activate spray pump", btn_spray: "Spray",
    emergency_stop: "EMERGENCY STOP", emergency_stop_activated: "Emergency stop activated", emergency_stop_help: "Movement controls locked for safety.", reset_emergency: "Reset Stop", emergency_reset_msg: "Emergency stop cleared. Movement controls active.",
    field_map_title: "FIELD MAP", field_map_desc: "4×4 parcel navigation grid with active rover position and sensor logs.", legend_rover: "Rover", legend_npk: "NPK reading", legend_path: "Rover path",
    recent_activity_title: "RECENT ACTIVITY", prototype_log: "Prototype log", activity_npk_sample: "NPK sample", activity_rover_moved: "Rover moved", activity_seeder_activated: "Seeder activated", location_prefix: "Location:",
    simulated_action_toast: (name) => `${name} prototype command triggered.`,
    nav_history: "History", nav_system_short: "System",
    system_status_overline: "SYSTEM", system_status_title: "Device & diagnostics",
    system_status_desc: "Local edge compute, hardware interfaces, network telemetry and runtime status.",
    edge_diagnostics_title: "EDGE HARDWARE & RUNTIME", edge_server_host: "Edge Server", runtime_env: "Runtime Env", storage_engine: "Local Storage",
    history_overline: "HISTORY", history_title: "Past field analyses", history_desc: "Review previous crop, disease, pest and soil assessments.",
    summary_analyses: "Analyses", summary_crop: "Crop", summary_disease: "Disease", summary_pest: "Pest", summary_soil: "Soil",
    sample_data_badge: "Sample data", sample_records: "Sample records", search_analyses_placeholder: "Search analyses...",
    filter_all: "All", filter_crop: "Crop", filter_disease: "Disease", filter_pest: "Pest", filter_soil: "Soil",
    opt_all_locations: "All locations", opt_all_dates: "All dates", opt_today: "Today", opt_yesterday: "Yesterday", opt_older: "Older",
    th_datetime: "Date & Time", th_location: "Location", th_analysis: "Analysis", th_result: "Result", th_confidence: "Confidence",
    no_analyses_found: "No analyses found", no_analyses_help: "Try changing your search or filters.", btn_reset_filters: "Reset filters",
    modal_overline: "ANALYSIS DETAILS", location_label: "Location:",
    original_image_title: "ORIGINAL IMAGE", prototype_sample_image: "Prototype sample image", prototype_image_disclaimer: "Prototype sample capture · Offline edge inference",
    soil_assessment_title: "SOIL ASSESSMENT", prototype_sensor_telemetry: "Sensor telemetry",
    modal_results_title: "ANALYSIS RESULTS", sample_inference: "Sample inference",
    overall_field_analysis_title: "OVERALL FIELD ANALYSIS", priority_actions_title: "PRIORITY ACTIONS",
    tts_title: "LISTEN TO SUMMARY", tts_help: "Voice narration for farmer-friendly field summary and priority actions.",
    btn_tts_en: "🔊 English", btn_tts_hi: "🔊 हिंदी",
    tts_prototype_toast_en: "TTS Prototype: Voice narration of field analysis and priority actions in English.",
    tts_prototype_toast_hi: "TTS Prototype: Voice narration of field analysis and priority actions in Hindi.",
    severity_label: "Severity", severity_low: "Low", severity_moderate: "Moderate", severity_high: "High", confidence_suffix: "confidence",
    rpi_4b_label: "Raspberry Pi 4B",
    runtime_label: "Runtime:",
    runtime_val: "Python / Flask / Socket.IO",
    storage_label: "Storage:",
    storage_val: "SQLite / RAM",
    farm_location_title: "FARM LOCATION",
    advanced_title: "ADVANCED",
    theme_label: "Theme",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_toggle_title: "Toggle light or dark theme",

    auth_welcome_back: "Welcome back",
    auth_create_account_title: "Create your account",
    auth_email: "Email",
    auth_password: "Password",
    auth_confirm_password: "Confirm password",
    auth_full_name: "Full name",
    auth_enter_email: "Enter your email",
    auth_enter_password: "Enter your password",
    auth_enter_name: "Enter your name",
    auth_create_password: "Create a password",
    auth_confirm_your_password: "Confirm your password",
    auth_login_btn: "Log in",
    auth_signup_link: "Sign up",
    auth_login_link: "Log in",
    auth_create_account_btn: "Create account",
    auth_forgot_password: "Forgot password?",
    auth_dont_have_account: "Don't have an account?",
    auth_already_have_account: "Already have an account?",
    auth_welcome_farmer: "Farmer",
    log_out: "Log out",
    auth_err_email_required: "Please enter your email address.",
    auth_err_email_invalid: "Please enter a valid email address.",
    auth_err_password_required: "Please enter your password.",
    auth_err_name_required: "Please enter your full name.",
    auth_err_password_match: "Passwords do not match. Please re-enter.",
    auth_err_password_short: "Password must be at least 6 characters.",
    auth_err_invalid_credentials: "Incorrect email or password. Please try again.",
    auth_err_email_exists: "An account with this email already exists.",
    auth_msg_forgot_pw: "For this local prototype, please sign up for a new account or contact system administrator.",
    auth_msg_signup_success: "Account created successfully! Welcome to Kisan Mitra.",


  },
  hi: {
    brand_tag: "स्थानीय खेत जानकारी", nav_overview: "फार्म डैशबोर्ड", nav_field: "खेत के औज़ार", nav_field_short: "खेत", nav_system: "एज एआई",
    connecting: "जुड़ रहा है", live: "लाइव", offline: "ऑफ़लाइन", checking_server: "डिवाइस जांच रहा है…", edge_device: "खेत का डिवाइस", sample_data: "नमूना डेटा", sensor_data: "सेंसर डेटा", weather_data: "लाइव मौसम",
    offline_message: "लाइव अपडेट उपलब्ध नहीं हैं। पिछली रीडिंग दिखाई जा रही है।", retry: "फिर कोशिश करें", field_health: "खेत की सेहत", priority: "आज का काम",
    soil_moisture: "मिट्टी की नमी", temperature: "तापमान", humidity: "हवा की नमी", soil_ph: "मिट्टी का pH", ph_note: "6.0–7.0 सही", optimal: "सही स्तर", below_range: "स्तर कम", above_range: "स्तर ज़्यादा", field_sensor: "खेत का सेंसर", live_weather: "लाइव मौसम", comfortable: "ठीक है", high_check_leaves: "ज़्यादा — पत्तियां देखें",
    conditions: "स्थिति", soil: "मिट्टी", water: "पानी", climate: "मौसम", disease_risk: "पत्ती की सेहत", notices: "सूचनाएं", waiting_data: "डेटा का इंतज़ार", updated_now: "अभी अपडेट हुआ", updated_minutes: (n) => `${n} मिनट पहले अपडेट`, no_notices: "कोई जरूरी सूचना नहीं।",
    field_tools: "खेत के औज़ार", soil_and_leaf: "मिट्टी और पत्ती", field_intro: "सेंसर रीडिंग और एक साफ पत्ती की फोटो से उपयोगी सलाह पाएं।", soil_nutrients: "मिट्टी के पोषक तत्व", checking: "जांच जारी", unavailable: "उपलब्ध नहीं", nitrogen: "नाइट्रोजन", phosphorus: "फॉस्फोरस", potassium: "पोटैशियम", ec: "विद्युत चालकता", organic_carbon: "जैविक कार्बन", rainfall: "बारिश",
    crop_matches: "फसल सुझाव", top_three: "शीर्ष 3", crop_disclaimer: "इन सुझावों के साथ स्थानीय कृषि विशेषज्ञ की सलाह भी लें।", no_crops: "सुझाव उपलब्ध नहीं",
    leaf_scanner: "पत्ती स्कैनर", scanner_help: "मिर्च, आलू और टमाटर। दिन की रोशनी में एक पत्ती की पास से फोटो लें।", choose_photo: "पत्ती की फोटो चुनें", photo_types: "JPG, PNG या WEBP · 10 MB तक", remove: "हटाएं", scan_leaf: "पत्ती स्कैन करें", scanning: "डिवाइस पर जांच जारी", scan_result: "स्कैन परिणाम", local_private: "डिवाइस पर जांच · फोटो सेव नहीं होती", select_photo: "स्कैन से पहले फोटो चुनें।", bad_file: "10 MB तक की JPG, PNG या WEBP फोटो चुनें।", scan_failed: "पत्ती की जांच नहीं हो सकी।", healthy_leaf: "पत्ती स्वस्थ है", not_recognized: "पहचाना नहीं गया",
    system: "एज एआई", device_status: "खेत के लिए स्थानीय एआई", system_intro: "सेटअप और सहायता के लिए कनेक्शन, स्थानीय मॉडल और खेत की सेटिंग।", edge_models: "डिवाइस मॉडल", local: "स्थानीय", disease_model: "रोग मॉडल", last_inference: "पिछली जांच", confidence: "भरोसा", cloud_required: "इंटरनेट जरूरी", yes: "हां", no: "नहीं", not_run: "अभी जांच नहीं हुई",
    farm_location: "खेत की जगह", location_help: "सेंसर GPS न मिलने पर लाइव मौसम के लिए इस्तेमाल होता है।", village_city: "गांव या शहर", location_placeholder: "जैसे लुधियाना, पंजाब", save: "सेव करें", saving: "सेव हो रहा है", location_required: "गांव या शहर लिखें।", location_saved: (v) => `${v} सेव हो गया।`,
    write_access: "बदलाव की अनुमति", token_help: "अगर इस डिवाइस पर API टोकन लगा है, तो इस ब्राउज़र सत्र के लिए यहां डालें।", api_token: "API टोकन", token_placeholder: "वैकल्पिक", apply: "लागू करें", token_set: "इस ब्राउज़र सत्र के लिए टोकन लागू है।", token_cleared: "कोई टोकन इस्तेमाल नहीं हो रहा।", authorization_required: "इस डिवाइस को API टोकन चाहिए। सिस्टम → बदलाव की अनुमति में टोकन डालें।",
    raw_sensor_data: "सेंसर का कच्चा डेटा", expand: "खोलें", request_failed: "खेत के डिवाइस से संपर्क नहीं हुआ। फिर कोशिश करें।", fertility: "उपजाऊपन", acres_of: (a, c) => `${a} एकड़ · ${c}`, in_location: (v) => ` · ${v}`,
    less_fertile: "कम उपजाऊ", fertile: "उपजाऊ", highly_fertile: "बहुत उपजाऊ",
    nav_rover: "रोवर", rover_overline: "रोवर", rover_title: "खेत संचालन और लाइव नियंत्रण", rover_desc: "रोवर की निगरानी करें, हलचल नियंत्रित करें और खेत के काम संभालें।",
    rover_status: "रोवर स्थिति", running_time: "कार्य समय", rpi_label: "रास्पबेरी पाई", arduino_label: "आर्डुइनो मेगा", camera_label: "कैमरा", npk_sensor_label: "एनपीके सेंसर",
    status_online: "ऑनलाइन", status_connected: "कनेक्टेड", status_ready: "तैयार",
    live_camera: "लाइव कैमरा", camera_ready: "कैमरा तैयार", camera_placeholder_title: "लाइव कैमरा", camera_placeholder_desc: "कैमरा फीड यहां दिखाई देगा",
    movement_title: "हलचल", movement_stopped: "रुका हुआ", movement_forward: "आगे बढ़ रहा है", movement_reverse: "पीछे जा रहा है", movement_left: "बाएं मुड़ रहा है", movement_right: "दाएं मुड़ रहा है",
    move_forward: "आगे", move_reverse: "पीछे", move_left: "बाएं", move_right: "दाएं", move_stop: "रुकें",
    field_actions_title: "खेत की क्रियाएं", action_npk_title: "एनपीके नमूना", action_npk_desc: "सेंसर लगाएं और मिट्टी की रीडिंग लें",
    seq_deploy: "लगाएं", seq_read: "पढ़ें", seq_save: "जगह सेव करें", seq_retract: "वापस लें", btn_sample: "नमूना लें",
    action_seeder_title: "सीडर", action_seeder_desc: "सीडर चालू करें", seeder_servo_spec: "सर्वो क्रिया: 45°", btn_seed: "बीज डालें",
    action_pesticide_title: "कीटनाशक", action_pesticide_desc: "स्प्रे पंप चालू करें", btn_spray: "स्प्रे करें",
    emergency_stop: "आपातकालीन रोक", emergency_stop_activated: "आपातकालीन रोक सक्रिय", emergency_stop_help: "सुरक्षा के लिए नियंत्रण बंद हैं।", reset_emergency: "रोक रीसेट करें", emergency_reset_msg: "आपातकालीन रोक हटाई गई। नियंत्रण सक्रिय हैं।",
    field_map_title: "खेत का नक्शा", field_map_desc: "सक्रिय रोवर स्थिति और सेंसर लॉग के साथ 4×4 ग्रिड।", legend_rover: "रोवर", legend_npk: "एनपीके रीडिंग", legend_path: "रोवर का रास्ता",
    recent_activity_title: "हालिया गतिविधि", prototype_log: "प्रोटोटाइप लॉग", activity_npk_sample: "एनपीके नमूना", activity_rover_moved: "रोवर आगे बढ़ा", activity_seeder_activated: "सीडर चालू हुआ", location_prefix: "स्थान:",
    simulated_action_toast: (name) => `${name} प्रोटोटाइप कमांड सक्रिय की गई।`,
    nav_history: "इतिहास", nav_system_short: "सिस्टम",
    system_status_overline: "सिस्टम", system_status_title: "डिवाइस और जांच",
    system_status_desc: "स्थानीय एज सिस्टम, हार्डवेयर कनेक्शन, नेटवर्क टेलीमेट्री और रनटाइम स्थिति।",
    edge_diagnostics_title: "एज हार्डवेयर और रनटाइम", edge_server_host: "एज सर्वर", runtime_env: "रनटाइम वातावरण", storage_engine: "लोकल स्टोरेज",
    history_overline: "इतिहास", history_title: "खेत की पिछली जांचें", history_desc: "पिछली फसल, रोग, कीट और मिट्टी की जांचों की समीक्षा करें।",
    summary_analyses: "कुल जांचें", summary_crop: "फसल", summary_disease: "रोग", summary_pest: "कीट", summary_soil: "मिट्टी",
    sample_data_badge: "नमूना डेटा", sample_records: "नमूना रिकॉर्ड", search_analyses_placeholder: "जांच खोजें...",
    filter_all: "सभी", filter_crop: "फसल", filter_disease: "रोग", filter_pest: "कीट", filter_soil: "मिट्टी",
    opt_all_locations: "सभी स्थान", opt_all_dates: "सभी तारीखें", opt_today: "आज", opt_yesterday: "कल", opt_older: "पुराने",
    th_datetime: "तारीख और समय", th_location: "स्थान", th_analysis: "जांच प्रकार", th_result: "परिणाम", th_confidence: "भरोसा",
    no_analyses_found: "कोई जांच नहीं मिली", no_analyses_help: "अपनी खोज या फिल्टर बदलकर देखें।", btn_reset_filters: "फिल्टर रीसेट करें",
    modal_overline: "जांच विवरण", location_label: "स्थान:",
    original_image_title: "मूल फोटो", prototype_sample_image: "नमूना फोटो", prototype_image_disclaimer: "नमूना फोटो · डिवाइस पर स्थानीय जांच",
    soil_assessment_title: "मिट्टी का आकलन", prototype_sensor_telemetry: "सेंसर टेलीमेट्री",
    modal_results_title: "जांच परिणाम", sample_inference: "नमूना परिणाम",
    overall_field_analysis_title: "खेत का समग्र विश्लेषण", priority_actions_title: "प्राथमिक कार्य",
    tts_title: "सारांश सुनें", tts_help: "किसान अनुकूल सारांश और प्राथमिक कार्यों का स्वर वाचन।",
    btn_tts_en: "🔊 अंग्रेजी", btn_tts_hi: "🔊 हिंदी",
    tts_prototype_toast_en: "टीटीएस प्रोटोटाइप: विश्लेषण और जरूरी कदमों का अंग्रेजी में वाचन।",
    tts_prototype_toast_hi: "टीटीएस प्रोटोटाइप: खेत के विश्लेषण और प्राथमिक कार्यों का हिंदी में वाचन।",
    severity_label: "गंभीरता", severity_low: "कम", severity_moderate: "मध्यम", severity_high: "अधिक", confidence_suffix: "भरोसा",
    rpi_4b_label: "रास्पबेरी पाई 4B",
    runtime_label: "रनटाइम:",
    runtime_val: "Python / Flask / Socket.IO",
    storage_label: "स्टोरेज:",
    storage_val: "SQLite / RAM",
    farm_location_title: "खेत की जगह",
    advanced_title: "उन्नत सेटिंग",
    theme_label: "थीम",
    theme_light: "लाइट",
    theme_dark: "डार्क",
    theme_toggle_title: "लाइट या डार्क थीम बदलें",

    auth_welcome_back: "वापसी पर स्वागत है",
    auth_create_account_title: "अपना खाता बनाएं",
    auth_email: "ईमेल",
    auth_password: "पासवर्ड",
    auth_confirm_password: "पासवर्ड की पुष्टि करें",
    auth_full_name: "पूरा नाम",
    auth_enter_email: "अपना ईमेल दर्ज करें",
    auth_enter_password: "अपना पासवर्ड दर्ज करें",
    auth_enter_name: "अपना नाम दर्ज करें",
    auth_create_password: "एक पासवर्ड बनाएं",
    auth_confirm_your_password: "अपने पासवर्ड की पुष्टि करें",
    auth_login_btn: "लॉग इन करें",
    auth_signup_link: "साइन अप करें",
    auth_login_link: "लॉग इन करें",
    auth_create_account_btn: "खाता बनाएं",
    auth_forgot_password: "पासवर्ड भूल गए?",
    auth_dont_have_account: "क्या आपका खाता नहीं है?",
    auth_already_have_account: "पहले से खाता है?",
    auth_welcome_farmer: "किसान",
    log_out: "लॉग आउट",
    auth_err_email_required: "कृपया अपना ईमेल दर्ज करें।",
    auth_err_email_invalid: "कृपया सही ईमेल पता दर्ज करें।",
    auth_err_password_required: "कृपया अपना पासवर्ड दर्ज करें।",
    auth_err_name_required: "कृपया अपना पूरा नाम दर्ज करें।",
    auth_err_password_match: "दोनों पासवर्ड मेल नहीं खाते। कृपया दोबारा दर्ज करें।",
    auth_err_password_short: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    auth_err_invalid_credentials: "गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।",
    auth_err_email_exists: "इस ईमेल से पहले से एक खाता मौजूद है।",
    auth_msg_forgot_pw: "इस ऑफ़लाइन प्रोटोटाइप के लिए, कृपया नया खाता बनाएं या व्यवस्थापक से संपर्क करें।",
    auth_msg_signup_success: "खाता सफलतापूर्वक बन गया! किसान मित्र में आपका स्वागत है।",


  },
};

let language = localStorage.getItem("km-language") === "hi" ? "hi" : "en";
let currentTheme = localStorage.getItem("km-theme") || "light";
let state = null;
let previewUrl = null;
let toastTimer = null;

function t(key, ...args) {
  const value = COPY[language][key] ?? COPY.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

function applyTheme(theme) {
  currentTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  document.documentElement.classList.toggle("theme-dark", currentTheme === "dark");
  if (document.body) {
    document.body.classList.toggle("theme-dark", currentTheme === "dark");
  }
  try {
    localStorage.setItem("km-theme", currentTheme);
  } catch (e) {}

  const isDark = currentTheme === "dark";
  const labelText = isDark ? t("theme_dark") : t("theme_light");
  const titleText = t("theme_toggle_title");

  document.querySelectorAll(".theme-label, #themeLabelText, .auth-theme-label").forEach((el) => {
    if (el) el.textContent = labelText;
  });

  document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
    btn.setAttribute("aria-label", titleText);
    btn.setAttribute("title", titleText);
    btn.setAttribute("role", "switch");
    btn.setAttribute("aria-checked", isDark ? "true" : "false");
  });
}

function toggleTheme() {
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
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

// ==================================================
// LOCAL AUTHENTICATION STATE & CONTROLLER
// ==================================================
let currentAuthSession = null;
let pendingDestinationTab = "overview";
let socketInstance = null;

function getStoredUsers() {
  try {
    const raw = localStorage.getItem("km_auth_users");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem("km_auth_users", JSON.stringify(users));
  } catch (e) {}
}

function getAuthSession() {
  try {
    const raw = localStorage.getItem("km_auth_session");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function setAuthSession(session) {
  currentAuthSession = session;
  try {
    if (session) localStorage.setItem("km_auth_session", JSON.stringify(session));
    else localStorage.removeItem("km_auth_session");
  } catch (e) {}
  updateUserDisplay();
}

function isAuthenticated() {
  if (!currentAuthSession) currentAuthSession = getAuthSession();
  return !!(currentAuthSession && currentAuthSession.email);
}

function updateUserDisplay() {
  const session = currentAuthSession || getAuthSession();
  const badge = $("userProfileBadge");
  const nameEl = $("userNameDisplay");
  if (session && session.name) {
    if (nameEl) nameEl.textContent = session.name;
    if (badge) badge.hidden = false;
  } else {
    if (badge) badge.hidden = true;
  }
}

function showAuthScreen(view = "login", targetTab = null) {
  if (targetTab && targetTab !== "login") pendingDestinationTab = targetTab;
  document.body.classList.add("is-unauthenticated");
  document.body.classList.remove("is-authenticated");
  const shell = $("appShell") || document.querySelector(".app-shell");
  if (shell) shell.hidden = true;
  const mobileNav = $("mobileNav") || document.querySelector(".mobile-nav");
  if (mobileNav) mobileNav.hidden = true;
  document.querySelectorAll(".page").forEach((p) => { p.hidden = true; p.classList.remove("is-active"); });
  const screen = $("authScreen");
  if (screen) screen.hidden = false;
  const loginView = $("loginView");
  const signupView = $("signupView");
  if (view === "signup") {
    if (loginView) loginView.hidden = true;
    if (signupView) signupView.hidden = false;
  } else {
    if (loginView) loginView.hidden = false;
    if (signupView) signupView.hidden = true;
  }
  setAuthMessage("loginMessage", "");
  setAuthMessage("signupMessage", "");
}

function hideAuthScreen() {
  document.body.classList.remove("is-unauthenticated");
  document.body.classList.add("is-authenticated");
  const screen = $("authScreen");
  if (screen) screen.hidden = true;
  const shell = $("appShell") || document.querySelector(".app-shell");
  if (shell) shell.hidden = false;
  const mobileNav = $("mobileNav") || document.querySelector(".mobile-nav");
  if (mobileNav) mobileNav.hidden = false;
  updateUserDisplay();
}

function logout() {
  setAuthSession(null);
  showAuthScreen("login", "overview");
  history.replaceState(null, "", location.pathname);
  if ($("loginEmail")) $("loginEmail").value = "";
  if ($("loginPassword")) $("loginPassword").value = "";
  setAuthMessage("loginMessage", "");
}

function setAuthMessage(elId, text, type = "error") {
  const el = $(elId);
  if (!el) return;
  if (!text) {
    el.hidden = true;
    el.textContent = "";
    el.className = "auth-message";
    return;
  }
  el.textContent = text;
  el.className = `auth-message is-${type}`;
  el.hidden = false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function hashPassword(password) {
  try {
    if (window.crypto && window.crypto.subtle) {
      const enc = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(password));
      return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch (e) {}
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash) + password.charCodeAt(i);
    hash |= 0;
  }
  return "hash_" + Math.abs(hash).toString(16);
}

function activateTab(name, updateHash = true) {
  if (!isAuthenticated()) {
    showAuthScreen("login", name);
    return;
  }
  hideAuthScreen();
  const valid = ["overview", "field", "edge", "rover", "history", "system"].includes(name) ? name : "overview";
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
  if ($("systemLocationInput") && document.activeElement !== $("systemLocationInput")) $("systemLocationInput").value = farm.location || "";

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
  if (currentMovementState && $("movementStateBadge")) {
    $("movementStateBadge").textContent = t(`movement_${currentMovementState}`);
  }
  $("locationInput").placeholder = t("location_placeholder"); $("tokenInput").placeholder = t("token_placeholder");
  if ($("systemLocationInput")) $("systemLocationInput").placeholder = t("location_placeholder");
  if ($("systemTokenInput")) $("systemTokenInput").placeholder = t("token_placeholder");
  if ($("loginEmail")) $("loginEmail").placeholder = t("auth_enter_email");
  if ($("loginPassword")) $("loginPassword").placeholder = t("auth_enter_password");
  if ($("signupName")) $("signupName").placeholder = t("auth_enter_name");
  if ($("signupEmail")) $("signupEmail").placeholder = t("auth_enter_email");
  if ($("signupPassword")) $("signupPassword").placeholder = t("auth_create_password");
  if ($("signupConfirmPassword")) $("signupConfirmPassword").placeholder = t("auth_confirm_your_password");
  if ($("historySearchInput")) $("historySearchInput").placeholder = t("search_analyses_placeholder");
  const isDarkTheme = currentTheme === "dark";
  const currentThemeLabel = isDarkTheme ? t("theme_dark") : t("theme_light");
  document.querySelectorAll(".theme-label, #themeLabelText, .auth-theme-label").forEach((el) => {
    if (el) el.textContent = currentThemeLabel;
  });
  renderHistoryTable();
  if (currentlyOpenedRecord) openHistoryDetail(currentlyOpenedRecord);
  [["langEn", "en"], ["langHi", "hi"], ["authLangEn", "en"], ["authLangHi", "hi"]].forEach(([id, value]) => {
    const el = $(id);
    if (el) {
      const active = language === value;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-pressed", String(active));
    }
  });
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

function handleLocationSubmit(formId, inputId, statusId, btnId) {
  const form = $(formId);
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = $(inputId); const status = $(statusId); const button = $(btnId);
    if (!input || !status || !button) return;
    const locationValue = input.value.trim();
    status.classList.remove("is-error");
    if (!locationValue) { status.textContent = t("location_required"); status.classList.add("is-error"); return; }
    button.disabled = true; button.textContent = t("saving");
    try {
      const result = await api("/api/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location: locationValue }) });
      status.textContent = t("location_saved", result.farm.location);
      document.querySelectorAll("#locationInput, #systemLocationInput").forEach((el) => {
        if (el !== document.activeElement) el.value = result.farm.location || "";
      });
      document.querySelectorAll("#locationStatus, #systemLocationStatus").forEach((el) => {
        if (el !== status) el.textContent = t("location_saved", result.farm.location);
      });
      await loadDashboard();
    } catch (error) {
      status.textContent = errorMessage(error); status.classList.add("is-error");
    } finally {
      button.disabled = false; button.textContent = t("save");
    }
  });
}
handleLocationSubmit("locationForm", "locationInput", "locationStatus", "saveLocationBtn");
handleLocationSubmit("systemLocationForm", "systemLocationInput", "systemLocationStatus", "systemSaveLocationBtn");

function handleTokenSubmit(formId, inputId, statusId) {
  const form = $(formId);
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $(inputId); const value = input ? input.value.trim() : "";
    if (value) sessionStorage.setItem("km-api-token", value); else sessionStorage.removeItem("km-api-token");
    setText(statusId, value ? t("token_set") : t("token_cleared"));
    if ($("tokenStatus") && statusId !== "tokenStatus") setText("tokenStatus", value ? t("token_set") : t("token_cleared"));
    if ($("systemTokenStatus") && statusId !== "systemTokenStatus") setText("systemTokenStatus", value ? t("token_set") : t("token_cleared"));
    if (input) input.value = "";
  });
}
handleTokenSubmit("tokenForm", "tokenInput", "tokenStatus");
handleTokenSubmit("systemTokenForm", "systemTokenInput", "systemTokenStatus");

// Edge AI Workspace: Image Selection & Multi-Model Validation Logic
let edgeSelectedFile = null;
let edgePreviewUrl = null;

function setEdgeFile(file) {
  if (!file) return clearEdgeFile();
  const valid = ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 10 * 1024 * 1024;
  if (!valid) { clearEdgeFile(); showToast(t("bad_file"), true); return; }
  if (edgePreviewUrl) URL.revokeObjectURL(edgePreviewUrl);
  edgePreviewUrl = URL.createObjectURL(file);
  edgeSelectedFile = file;
  const preview = $("edgeImagePreview");
  if (preview) { preview.src = edgePreviewUrl; preview.hidden = false; }
  if ($("edgeUploadPlaceholder")) $("edgeUploadPlaceholder").hidden = true;
  if ($("edgeFileRow")) $("edgeFileRow").hidden = false;
  setText("edgeFileName", file.name);
  updateEdgeAnalysisState();
}

function clearEdgeFile() {
  if (edgePreviewUrl) URL.revokeObjectURL(edgePreviewUrl);
  edgePreviewUrl = null;
  edgeSelectedFile = null;
  if ($("edgeImageInput")) $("edgeImageInput").value = "";
  const preview = $("edgeImagePreview");
  if (preview) { preview.removeAttribute("src"); preview.hidden = true; }
  if ($("edgeUploadPlaceholder")) $("edgeUploadPlaceholder").hidden = false;
  if ($("edgeFileRow")) $("edgeFileRow").hidden = true;
  updateEdgeAnalysisState();
}

function updateEdgeAnalysisState() {
  const crop = Boolean($("checkCrop")?.checked);
  const disease = Boolean($("checkDisease")?.checked);
  const pest = Boolean($("checkPest")?.checked);
  const soil = Boolean($("checkSoil")?.checked);
  const btn = $("edgeAnalyzeBtn");
  const help = $("edgeHelpText");
  const feedback = $("edgeFeedback");
  if (feedback) feedback.hidden = true;

  const anyVision = crop || disease || pest;
  const anySelected = crop || disease || pest || soil;
  const hasImage = Boolean(edgeSelectedFile);

  if (!anySelected) {
    if (btn) btn.disabled = true;
    if (help) {
      help.textContent = "Select at least one analysis type.";
      help.className = "edge-help-text";
    }
  } else if (anyVision && !hasImage) {
    if (btn) btn.disabled = true;
    if (help) {
      help.textContent = "Image required for selected vision model(s). Choose or drop a field image.";
      help.className = "edge-help-text";
    }
  } else {
    if (btn) btn.disabled = false;
    if (help) {
      if (!anyVision && soil) {
        help.textContent = "Ready: Soil assessment uses field sensor telemetry (no image required).";
      } else {
        const models = [];
        if (crop) models.push("Crop Type");
        if (disease) models.push("Disease");
        if (pest) models.push("Pest");
        if (soil) models.push("Soil Assessment");
        help.textContent = `Ready to analyze: ${models.join(", ")}.`;
      }
      help.className = "edge-help-text ready";
    }
  }
}

if ($("edgeImageInput")) {
  $("edgeImageInput").addEventListener("change", (event) => setEdgeFile(event.target.files?.[0]));
}
if ($("clearEdgePhotoBtn")) {
  $("clearEdgePhotoBtn").addEventListener("click", clearEdgeFile);
}
if ($("replaceEdgePhotoBtn")) {
  $("replaceEdgePhotoBtn").addEventListener("click", () => $("edgeImageInput")?.click());
}

const edgeDropZone = $("edgeDropZone");
if (edgeDropZone) {
  ["dragenter", "dragover"].forEach((name) => edgeDropZone.addEventListener(name, (event) => { event.preventDefault(); edgeDropZone.classList.add("is-dragging"); }));
  ["dragleave", "drop"].forEach((name) => edgeDropZone.addEventListener(name, (event) => { event.preventDefault(); edgeDropZone.classList.remove("is-dragging"); }));
  edgeDropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    if ($("edgeImageInput")) $("edgeImageInput").files = transfer.files;
    setEdgeFile(file);
  });
}

["checkCrop", "checkDisease", "checkPest", "checkSoil"].forEach((id) => {
  const node = $(id);
  if (node) node.addEventListener("change", updateEdgeAnalysisState);
});

if ($("edgeAnalyzeBtn")) {
  $("edgeAnalyzeBtn").addEventListener("click", () => {
    const crop = $("checkCrop")?.checked;
    const disease = $("checkDisease")?.checked;
    const pest = $("checkPest")?.checked;
    const soil = $("checkSoil")?.checked;
    const selected = [];
    if (crop) selected.push("Crop Type");
    if (disease) selected.push("Disease");
    if (pest) selected.push("Pest");
    if (soil) selected.push("Soil Assessment");

    const feedback = $("edgeFeedback");
    if (feedback) {
      feedback.hidden = false;
      feedback.textContent = `Analysis Simulated: Prototype run complete for [${selected.join(", ")}]. Offline edge models ready.`;
    }
  });
}

// Model Cards: Strict Accordion Exclusivity (Opening one closes all others)
document.querySelectorAll(".model-card").forEach((card) => {
  const toggle = () => {
    const isCurrentlyExpanded = card.classList.contains("is-expanded");
    // Collapse all model cards first
    document.querySelectorAll(".model-card").forEach((other) => {
      other.classList.remove("is-expanded");
      other.setAttribute("aria-expanded", "false");
      const label = other.querySelector(".detail-toggle-label");
      if (label) label.textContent = "View specifications";
    });

    // If it was not already expanded, expand this one
    if (!isCurrentlyExpanded) {
      card.classList.add("is-expanded");
      card.setAttribute("aria-expanded", "true");
      const label = card.querySelector(".detail-toggle-label");
      if (label) label.textContent = "Hide specifications";
    }
  };

  card.addEventListener("click", (event) => {
    if (event.target.closest("input, button, a")) return;
    toggle();
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });
});

// ROVER PROTOTYPE LOGIC
let currentMovementState = "stopped";
let isEmergencyStopped = false;

function setRoverMovement(direction) {
  if (isEmergencyStopped) return;
  currentMovementState = direction;
  const badge = $("movementStateBadge");
  const stopBtn = $("btnMoveStop");
  const dirButtons = {
    forward: $("btnMoveForward"),
    reverse: $("btnMoveReverse"),
    left: $("btnMoveLeft"),
    right: $("btnMoveRight")
  };

  // Reset active classes
  Object.values(dirButtons).forEach((btn) => btn?.classList.remove("is-active-dir"));
  stopBtn?.classList.remove("is-active");

  if (direction === "stopped") {
    stopBtn?.classList.add("is-active");
    if (badge) {
      badge.textContent = t("movement_stopped");
      badge.classList.remove("is-moving");
    }
  } else {
    dirButtons[direction]?.classList.add("is-active-dir");
    if (badge) {
      badge.textContent = t(`movement_${direction}`);
      badge.classList.add("is-moving");
    }
  }
}

if ($("btnMoveForward")) $("btnMoveForward").addEventListener("click", () => setRoverMovement("forward"));
if ($("btnMoveReverse")) $("btnMoveReverse").addEventListener("click", () => setRoverMovement("reverse"));
if ($("btnMoveLeft")) $("btnMoveLeft").addEventListener("click", () => setRoverMovement("left"));
if ($("btnMoveRight")) $("btnMoveRight").addEventListener("click", () => setRoverMovement("right"));
if ($("btnMoveStop")) $("btnMoveStop").addEventListener("click", () => setRoverMovement("stopped"));

// Emergency Stop Handlers
const emergencyBtn = $("btnEmergencyStop");
const resetEmergencyBtn = $("btnResetEmergency");
const emergencyAlertBox = $("emergencyAlertBox");
const movementControls = $("movementControls");

if (emergencyBtn) {
  emergencyBtn.addEventListener("click", () => {
    isEmergencyStopped = true;
    setRoverMovement("stopped");
    movementControls?.classList.add("is-locked");
    if (emergencyAlertBox) emergencyAlertBox.hidden = false;
    showToast(t("emergency_stop_activated"), true);
  });
}

if (resetEmergencyBtn) {
  resetEmergencyBtn.addEventListener("click", () => {
    isEmergencyStopped = false;
    movementControls?.classList.remove("is-locked");
    if (emergencyAlertBox) emergencyAlertBox.hidden = true;
    showToast(t("emergency_reset_msg"));
  });
}

// Field Actions Handlers
const roverActionButtons = [
  { id: "btnActionNpk", nameKey: "action_npk_title" },
  { id: "btnActionSeeder", nameKey: "action_seeder_title" },
  { id: "btnActionPesticide", nameKey: "action_pesticide_title" }
];

roverActionButtons.forEach(({ id, nameKey }) => {
  const btn = $(id);
  if (btn) {
    btn.addEventListener("click", () => {
      if (isEmergencyStopped) {
        showToast(t("emergency_stop_help"), true);
        return;
      }
      showToast(t("simulated_action_toast", t(nameKey)));
    });
  }
});

// ==================================================
// HISTORY PROTOTYPE DATA & INTERACTION LOGIC
// ==================================================
const SAMPLE_HISTORY = [
  {
    id: "hist-1",
    datetime: "Sep 20, 2026 · 14:32",
    datetime_hi: "20 सित 2026 · 14:32",
    dateGroup: "today",
    location: "C2",
    types: ["crop", "disease"],
    result_en: "Wheat · Early Blight",
    result_hi: "गेहूं · अगेती झुलसा",
    confidence: "96% · 91%",
    crop: { name_en: "Wheat", name_hi: "गेहूं", confidence: 96 },
    disease: { name_en: "Early Blight", name_hi: "अगेती झुलसा", confidence: 91, severity: "moderate" },
    pest: null,
    soil: null,
    overall_en: "Wheat detected with possible signs of disease. Nitrogen levels are low.",
    overall_hi: "गेहूं में रोग के संभावित लक्षण पाए गए हैं। नाइट्रोजन का स्तर कम है।",
    actions_en: ["Inspect affected plants.", "Review nitrogen levels.", "Monitor the affected field area."],
    actions_hi: ["प्रभावित पौधों की जांच करें।", "नाइट्रोजन स्तर की समीक्षा करें।", "प्रभावित खेत क्षेत्र की निगरानी करें।"]
  },
  {
    id: "hist-2",
    datetime: "Sep 20, 2026 · 13:51",
    datetime_hi: "20 सित 2026 · 13:51",
    dateGroup: "today",
    location: "B3",
    types: ["soil"],
    result_en: "N Low · P Normal",
    result_hi: "N कम · P सामान्य",
    confidence: "—",
    crop: null,
    disease: null,
    pest: null,
    soil: {
      n_en: "Low", n_hi: "कम",
      p_en: "Normal", p_hi: "सामान्य",
      k_en: "Good", k_hi: "अच्छा",
      ph: 6.5,
      moisture: "42%",
      ec: "0.62 mS/cm",
      carbon: "0.70%"
    },
    overall_en: "Soil nitrogen is below optimal threshold. Moisture and pH are within normal bounds.",
    overall_hi: "मिट्टी में नाइट्रोजन का स्तर कम है। नमी और pH सामान्य सीमा में हैं।",
    actions_en: ["Top-dress with nitrogen-rich compost.", "Check soil moisture before next irrigation.", "Re-sample parcel B3 after treatment."],
    actions_hi: ["नाइट्रोजन युक्त जैविक खाद डालें।", "अगली सिंचाई से पहले मिट्टी की नमी जांचें।", "उपचार के बाद पार्सल B3 की फिर से जांच करें।"]
  },
  {
    id: "hist-3",
    datetime: "Sep 20, 2026 · 12:24",
    datetime_hi: "20 सित 2026 · 12:24",
    dateGroup: "today",
    location: "A4",
    types: ["pest"],
    result_en: "Aphid",
    result_hi: "माहू (एफिड)",
    confidence: "87%",
    crop: null,
    disease: null,
    pest: { name_en: "Aphid", name_hi: "माहू (एफिड)", confidence: 87 },
    soil: null,
    overall_en: "Aphid infestation spotted on parcel boundary. Early localized cluster.",
    overall_hi: "पार्सल की सीमा पर माहू (एफिड) कीट देखा गया है। शुरुआती सीमित फैलाव।",
    actions_en: ["Inspect underside of leaves in A4.", "Deploy yellow sticky traps.", "Apply botanical neem spray if cluster grows."],
    actions_hi: ["A4 में पत्तियों की निचली सतह की जांच करें।", "पीले चिपचिपे ट्रैप लगाएं।", "फैलाव बढ़ने पर नीम का जैविक स्प्रे करें।"]
  },
  {
    id: "hist-4",
    datetime: "Sep 19, 2026 · 17:20",
    datetime_hi: "19 सित 2026 · 17:20",
    dateGroup: "yesterday",
    location: "D1",
    types: ["crop"],
    result_en: "Wheat",
    result_hi: "गेहूं",
    confidence: "94%",
    crop: { name_en: "Wheat", name_hi: "गेहूं", confidence: 94 },
    disease: null,
    pest: null,
    soil: null,
    overall_en: "Healthy vegetative wheat growth observed across parcel D1. Canopy density is good.",
    overall_hi: "पार्सल D1 में गेहूं की फसल स्वस्थ है। पौधों की सघनता और रंग अच्छा है।",
    actions_en: ["Maintain current irrigation routine.", "Check weed growth along border rows.", "Schedule next sensor telemetry check."],
    actions_hi: ["वर्तमान सिंचाई कार्यक्रम बनाए रखें।", "किनारे की कतारों में खरपतवार की जांच करें।", "अगले सेंसर चेक की योजना बनाएं।"]
  },
  {
    id: "hist-5",
    datetime: "Sep 18, 2026 · 11:15",
    datetime_hi: "18 सित 2026 · 11:15",
    dateGroup: "older",
    location: "C2",
    types: ["disease"],
    result_en: "Late Blight",
    result_hi: "पछेती झुलसा",
    confidence: "89%",
    crop: null,
    disease: { name_en: "Late Blight", name_hi: "पछेती झुलसा", confidence: 89, severity: "high" },
    pest: null,
    soil: null,
    overall_en: "Late blight lesion detected. High moisture environment accelerating risk.",
    overall_hi: "पछेती झुलसा के लक्षण मिले हैं। अधिक नमी के कारण खतरा अधिक है।",
    actions_en: ["Prune visibly infected leaf segments.", "Improve inter-row aeration.", "Consult local agronomist for protective spray."],
    actions_hi: ["संक्रमित पत्तियों को काटकर अलग करें।", "कतारों के बीच हवा का प्रवाह बढ़ाएं।", "सुरक्षात्मक छिड़काव के लिए कृषि विशेषज्ञ से परामर्श लें।"]
  },
  {
    id: "hist-6",
    datetime: "Sep 17, 2026 · 09:40",
    datetime_hi: "17 सित 2026 · 09:40",
    dateGroup: "older",
    location: "B3",
    types: ["soil"],
    result_en: "N Normal · K Good",
    result_hi: "N सामान्य · K अच्छा",
    confidence: "—",
    crop: null,
    disease: null,
    pest: null,
    soil: {
      n_en: "Normal", n_hi: "सामान्य",
      p_en: "Good", p_hi: "अच्छा",
      k_en: "Good", k_hi: "अच्छा",
      ph: 6.8,
      moisture: "51%",
      ec: "0.58 mS/cm",
      carbon: "0.82%"
    },
    overall_en: "Soil telemetry demonstrates balanced nutrient profile and optimal moisture.",
    overall_hi: "मिट्टी की टेलीमेट्री संतुलित पोषक तत्व और सही नमी स्तर दर्शाती है।",
    actions_en: ["Keep balanced moisture level.", "No supplementary fertilizer required.", "Log parcel reading in field records."],
    actions_hi: ["संतुलित नमी स्तर बनाए रखें।", "अतिरिक्त खाद की जरूरत नहीं है।", "खेत रिकॉर्ड में रीडिंग दर्ज करें।"]
  }
];

let historySearchQuery = "";
let historySelectedType = "all";
let historySelectedLocation = "all";
let historySelectedDate = "all";
let currentlyOpenedRecord = null;

function getFilteredHistory() {
  const query = historySearchQuery.trim().toLowerCase();
  return SAMPLE_HISTORY.filter((item) => {
    if (historySelectedType !== "all" && !item.types.includes(historySelectedType)) {
      return false;
    }
    if (historySelectedLocation !== "all" && item.location !== historySelectedLocation) {
      return false;
    }
    if (historySelectedDate !== "all" && item.dateGroup !== historySelectedDate) {
      return false;
    }
    if (query) {
      const isEn = language === "en";
      const resultText = (isEn ? item.result_en : item.result_hi).toLowerCase();
      const dateText = (isEn ? item.datetime : item.datetime_hi).toLowerCase();
      const locText = item.location.toLowerCase();
      const typesText = item.types.map((tp) => t(`filter_${tp}`).toLowerCase()).join(" ");
      const match = resultText.includes(query) ||
                    dateText.includes(query) ||
                    locText.includes(query) ||
                    typesText.includes(query);
      if (!match) return false;
    }
    return true;
  });
}

function renderHistoryTable() {
  const tbody = $("historyTableBody");
  const emptyState = $("historyEmptyState");
  const table = $("historyTable");
  if (!tbody) return;

  const records = getFilteredHistory();
  tbody.replaceChildren();

  if (records.length === 0) {
    if (emptyState) emptyState.hidden = false;
    if (table) table.hidden = true;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  if (table) table.hidden = false;

  const isEn = language === "en";

  records.forEach((rec) => {
    const tr = document.createElement("tr");
    tr.setAttribute("tabindex", "0");
    tr.setAttribute("role", "button");
    tr.setAttribute("aria-label", `View analysis details for ${rec.location} ${isEn ? rec.result_en : rec.result_hi}`);

    const tdDate = document.createElement("td");
    tdDate.className = "history-time-cell";
    tdDate.innerHTML = `<strong>${isEn ? rec.datetime : rec.datetime_hi}</strong>`;

    const tdLoc = document.createElement("td");
    tdLoc.innerHTML = `<span class="history-loc-coord">${rec.location}</span>`;

    const tdType = document.createElement("td");
    const badgeBox = document.createElement("div");
    badgeBox.className = "history-type-badges";
    rec.types.forEach((typeKey) => {
      const span = document.createElement("span");
      span.className = `badge-type badge-${typeKey}`;
      span.textContent = t(`filter_${typeKey}`);
      badgeBox.appendChild(span);
    });
    tdType.appendChild(badgeBox);

    const tdResult = document.createElement("td");
    tdResult.innerHTML = `<b>${isEn ? rec.result_en : rec.result_hi}</b>`;

    const tdConf = document.createElement("td");
    tdConf.className = "history-confidence-cell";
    tdConf.innerHTML = `<span>${rec.confidence}</span><span class="history-action-arrow" aria-hidden="true">→</span>`;

    tr.append(tdDate, tdLoc, tdType, tdResult, tdConf);

    tr.addEventListener("click", () => openHistoryDetail(rec));
    tr.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        openHistoryDetail(rec);
      }
    });

    tbody.appendChild(tr);
  });
}

function openHistoryDetail(rec) {
  currentlyOpenedRecord = rec;
  const isEn = language === "en";

  setText("modalHeading", isEn ? rec.result_en : rec.result_hi);
  setText("modalDateTime", isEn ? rec.datetime : rec.datetime_hi);
  setText("modalLocationCoord", rec.location);

  const typeChips = $("modalTypeChips");
  if (typeChips) {
    typeChips.replaceChildren();
    rec.types.forEach((typeKey) => {
      const span = document.createElement("span");
      span.className = `badge-type badge-${typeKey}`;
      span.textContent = t(`filter_${typeKey}`);
      typeChips.appendChild(span);
    });
  }

  const imageSection = $("modalImageSection");
  const soilSection = $("modalSoilSection");

  if (rec.types.length === 1 && rec.types[0] === "soil") {
    if (imageSection) imageSection.hidden = true;
    if (soilSection) {
      soilSection.hidden = false;
      const s = rec.soil;
      if (s) {
        setText("modalSoilN", isEn ? s.n_en : s.n_hi);
        setText("modalSoilP", isEn ? s.p_en : s.p_hi);
        setText("modalSoilK", isEn ? s.k_en : s.k_hi);
        setText("modalSoilPh", String(s.ph));
        setText("modalSoilMoisture", s.moisture);
        setText("modalSoilEc", s.ec);
        setText("modalSoilCarbon", s.carbon);
      }
    }
  } else {
    if (imageSection) imageSection.hidden = false;
    if (soilSection) soilSection.hidden = true;
  }

  const resultsGrid = $("modalResultsGrid");
  if (resultsGrid) {
    resultsGrid.replaceChildren();

    if (rec.crop) {
      const card = document.createElement("div");
      card.className = "result-card-item";
      card.innerHTML = `
        <span class="result-card-label">${t("filter_crop")}</span>
        <strong class="result-card-value">${isEn ? rec.crop.name_en : rec.crop.name_hi}</strong>
        <div class="result-meta-chips">
          <span class="confidence-chip">${rec.crop.confidence}% ${t("confidence_suffix")}</span>
        </div>
      `;
      resultsGrid.appendChild(card);
    }

    if (rec.disease) {
      const card = document.createElement("div");
      card.className = "result-card-item";
      const sevKey = `severity_${rec.disease.severity}`;
      card.innerHTML = `
        <span class="result-card-label">${t("filter_disease")}</span>
        <strong class="result-card-value">${isEn ? rec.disease.name_en : rec.disease.name_hi}</strong>
        <div class="result-meta-chips">
          <span class="confidence-chip">${rec.disease.confidence}% ${t("confidence_suffix")}</span>
          <span class="severity-chip severity-${rec.disease.severity}">
            ${t("severity_label")}: ${t(sevKey)}
          </span>
        </div>
      `;
      resultsGrid.appendChild(card);
    }

    if (rec.pest) {
      const card = document.createElement("div");
      card.className = "result-card-item";
      card.innerHTML = `
        <span class="result-card-label">${t("filter_pest")}</span>
        <strong class="result-card-value">${isEn ? rec.pest.name_en : rec.pest.name_hi}</strong>
        <div class="result-meta-chips">
          <span class="confidence-chip">${rec.pest.confidence}% ${t("confidence_suffix")}</span>
        </div>
      `;
      resultsGrid.appendChild(card);
    }

    if (rec.soil && rec.types.length > 1) {
      const card = document.createElement("div");
      card.className = "result-card-item";
      card.innerHTML = `
        <span class="result-card-label">${t("filter_soil")}</span>
        <strong class="result-card-value">${isEn ? rec.soil.n_en : rec.soil.n_hi} (N) · ${isEn ? rec.soil.p_en : rec.soil.p_hi} (P)</strong>
        <div class="result-meta-chips">
          <span class="confidence-chip">${t("status_ready")}</span>
        </div>
      `;
      resultsGrid.appendChild(card);
    }
  }

  setText("modalOverallSummary", isEn ? rec.overall_en : rec.overall_hi);

  const list = $("modalPriorityList");
  if (list) {
    list.replaceChildren();
    const actions = isEn ? rec.actions_en : rec.actions_hi;
    actions.forEach((act, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${idx + 1}</span><p>${act}</p>`;
      list.appendChild(li);
    });
  }

  const backdrop = $("historyModalBackdrop");
  if (backdrop) {
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
  }
}

function closeHistoryDetail() {
  const backdrop = $("historyModalBackdrop");
  if (backdrop) {
    backdrop.hidden = true;
    document.body.style.overflow = "";
  }
  currentlyOpenedRecord = null;
}

// Search and Filter Listeners
const historySearchInput = $("historySearchInput");
const historySearchClear = $("historySearchClear");
if (historySearchInput) {
  historySearchInput.addEventListener("input", (ev) => {
    historySearchQuery = ev.target.value;
    if (historySearchClear) historySearchClear.hidden = !historySearchQuery;
    renderHistoryTable();
  });
}
if (historySearchClear) {
  historySearchClear.addEventListener("click", () => {
    if (historySearchInput) historySearchInput.value = "";
    historySearchQuery = "";
    historySearchClear.hidden = true;
    renderHistoryTable();
  });
}

document.querySelectorAll(".history-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".history-pill").forEach((p) => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    historySelectedType = pill.dataset.filterType;
    renderHistoryTable();
  });
});

if ($("historyLocationFilter")) {
  $("historyLocationFilter").addEventListener("change", (ev) => {
    historySelectedLocation = ev.target.value;
    renderHistoryTable();
  });
}

if ($("historyDateFilter")) {
  $("historyDateFilter").addEventListener("change", (ev) => {
    historySelectedDate = ev.target.value;
    renderHistoryTable();
  });
}

if ($("historyResetFiltersBtn")) {
  $("historyResetFiltersBtn").addEventListener("click", () => {
    historySearchQuery = "";
    if (historySearchInput) historySearchInput.value = "";
    if (historySearchClear) historySearchClear.hidden = true;
    historySelectedType = "all";
    document.querySelectorAll(".history-pill").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.filterType === "all");
    });
    historySelectedLocation = "all";
    if ($("historyLocationFilter")) $("historyLocationFilter").value = "all";
    historySelectedDate = "all";
    if ($("historyDateFilter")) $("historyDateFilter").value = "all";
    renderHistoryTable();
  });
}

if ($("modalCloseBtn")) $("modalCloseBtn").addEventListener("click", closeHistoryDetail);
if ($("historyModalBackdrop")) {
  $("historyModalBackdrop").addEventListener("click", (ev) => {
    if (ev.target === $("historyModalBackdrop")) closeHistoryDetail();
  });
}
document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape" && $("historyModalBackdrop") && !$("historyModalBackdrop").hidden) {
    closeHistoryDetail();
  }
});

// Future TTS Placeholders
if ($("btnTtsEn")) {
  $("btnTtsEn").addEventListener("click", () => {
    showToast(t("tts_prototype_toast_en"));
  });
}
if ($("btnTtsHi")) {
  $("btnTtsHi").addEventListener("click", () => {
    showToast(t("tts_prototype_toast_hi"));
  });
}

// Wire up Authentication Form Handlers
if ($("showSignupBtn")) {
  $("showSignupBtn").addEventListener("click", () => showAuthScreen("signup"));
}
if ($("showLoginBtn")) {
  $("showLoginBtn").addEventListener("click", () => showAuthScreen("login"));
}
if ($("forgotPasswordBtn")) {
  $("forgotPasswordBtn").addEventListener("click", () => {
    setAuthMessage("loginMessage", t("auth_msg_forgot_pw"), "info");
  });
}
document.querySelectorAll(".logout-btn, #logoutBtn").forEach((btn) => {
  btn.addEventListener("click", logout);
});
document.querySelectorAll(".theme-toggle-btn, #themeToggleBtn, #authThemeToggleBtn").forEach((btn) => {
  btn.addEventListener("click", toggleTheme);
});
if ($("authLangEn")) {
  $("authLangEn").addEventListener("click", () => {
    language = "en";
    localStorage.setItem("km-language", language);
    applyLanguage();
  });
}
if ($("authLangHi")) {
  $("authLangHi").addEventListener("click", () => {
    language = "hi";
    localStorage.setItem("km-language", language);
    applyLanguage();
  });
}

// Login Form Submit
if ($("loginForm")) {
  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = $("loginEmail");
    const passwordInput = $("loginPassword");
    const submitBtn = $("loginSubmitBtn");
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    emailInput.classList.remove("is-invalid");
    passwordInput.classList.remove("is-invalid");
    setAuthMessage("loginMessage", "");

    if (!email) {
      emailInput.classList.add("is-invalid");
      setAuthMessage("loginMessage", t("auth_err_email_required"));
      emailInput.focus();
      return;
    }
    if (!isValidEmail(email)) {
      emailInput.classList.add("is-invalid");
      setAuthMessage("loginMessage", t("auth_err_email_invalid"));
      emailInput.focus();
      return;
    }
    if (!password) {
      passwordInput.classList.add("is-invalid");
      setAuthMessage("loginMessage", t("auth_err_password_required"));
      passwordInput.focus();
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    try {
      const users = getStoredUsers();
      const pwHash = await hashPassword(password);
      const matched = users.find((u) => u.email.toLowerCase() === email && u.passwordHash === pwHash);

      if (!matched) {
        setAuthMessage("loginMessage", t("auth_err_invalid_credentials"));
        passwordInput.classList.add("is-invalid");
        return;
      }

      setAuthSession({
        id: matched.id,
        name: matched.name,
        email: matched.email,
        token: "km_tok_" + Math.random().toString(36).slice(2),
        timestamp: Date.now()
      });

      emailInput.value = "";
      passwordInput.value = "";
      hideAuthScreen();
      activateTab(pendingDestinationTab || "overview", true);
      loadDashboard();
      initSocket();
    } catch (err) {
      setAuthMessage("loginMessage", t("auth_err_invalid_credentials"));
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Sign Up Form Submit
if ($("signupForm")) {
  $("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = $("signupName");
    const emailInput = $("signupEmail");
    const passwordInput = $("signupPassword");
    const confirmInput = $("signupConfirmPassword");
    const submitBtn = $("signupSubmitBtn");
    if (!nameInput || !emailInput || !passwordInput || !confirmInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    [nameInput, emailInput, passwordInput, confirmInput].forEach((inp) => inp.classList.remove("is-invalid"));
    setAuthMessage("signupMessage", "");

    if (!name) {
      nameInput.classList.add("is-invalid");
      setAuthMessage("signupMessage", t("auth_err_name_required"));
      nameInput.focus();
      return;
    }
    if (!email) {
      emailInput.classList.add("is-invalid");
      setAuthMessage("signupMessage", t("auth_err_email_required"));
      emailInput.focus();
      return;
    }
    if (!isValidEmail(email)) {
      emailInput.classList.add("is-invalid");
      setAuthMessage("signupMessage", t("auth_err_email_invalid"));
      emailInput.focus();
      return;
    }
    if (!password) {
      passwordInput.classList.add("is-invalid");
      setAuthMessage("signupMessage", t("auth_err_password_required"));
      passwordInput.focus();
      return;
    }
    if (password.length < 6) {
      passwordInput.classList.add("is-invalid");
      setAuthMessage("signupMessage", t("auth_err_password_short"));
      passwordInput.focus();
      return;
    }
    if (password !== confirmPassword) {
      confirmInput.classList.add("is-invalid");
      setAuthMessage("signupMessage", t("auth_err_password_match"));
      confirmInput.focus();
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    try {
      const users = getStoredUsers();
      if (users.some((u) => u.email.toLowerCase() === email)) {
        emailInput.classList.add("is-invalid");
        setAuthMessage("signupMessage", t("auth_err_email_exists"));
        return;
      }

      const pwHash = await hashPassword(password);
      const newUser = {
        id: "usr_" + Date.now().toString(36),
        name: name,
        email: email,
        passwordHash: pwHash,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      saveStoredUsers(users);

      setAuthSession({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        token: "km_tok_" + Math.random().toString(36).slice(2),
        timestamp: Date.now()
      });

      nameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      confirmInput.value = "";

      hideAuthScreen();
      activateTab("overview", true);
      loadDashboard();
      initSocket();
    } catch (err) {
      setAuthMessage("signupMessage", errorMessage(err));
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function initSocket() {
  if (socketInstance) return;
  if (window.io) {
    socketInstance = io();
    socketInstance.on("connect", () => { if (state) setConnection("online"); });
    socketInstance.on("disconnect", () => setConnection("offline"));
    socketInstance.on("connect_error", () => { if (!state) setConnection("offline"); });
    socketInstance.on("telemetry", (data) => { if (isAuthenticated()) { render(data); setConnection("online"); } });
  } else {
    window.setInterval(() => { if (isAuthenticated()) loadDashboard(); }, 5000);
  }
}

// Global initialization
applyTheme(currentTheme);
applyLanguage();
updateEdgeAnalysisState();

if (isAuthenticated()) {
  hideAuthScreen();
  updateUserDisplay();
  const initialTab = location.hash.slice(1) || "overview";
  activateTab(initialTab, false);
  loadDashboard();
  initSocket();
} else {
  showAuthScreen("login", location.hash.slice(1) || "overview");
  history.replaceState(null, "", location.pathname);
}

window.addEventListener("hashchange", () => {
  const target = location.hash.slice(1) || "overview";
  if (!isAuthenticated()) {
    showAuthScreen("login", target);
    history.replaceState(null, "", location.pathname);
  } else {
    activateTab(target, false);
  }
});

