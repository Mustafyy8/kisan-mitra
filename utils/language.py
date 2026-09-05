# Translation Dictionary for Multi-Language Support Architecture
TRANSLATIONS = {
    "English": {
        "dashboard_title": "Smart Farm Dashboard",
        "welcome": "Welcome back! Here's your farm's overview for today.",
        "weather_live": "Live Weather",
        "daily_tip": "Daily AI Farming Tip",
        "farm_status": "Farm Status"
    },
    "Hindi": {
        "dashboard_title": "स्मार्ट फार्म डैशबोर्ड",
        "welcome": "वापसी पर स्वागत है! आज का आपका फार्म अवलोकन यहां है।",
        "weather_live": "लाइव मौसम",
        "daily_tip": "दैनिक AI कृषि टिप",
        "farm_status": "फार्म की स्थिति"
    },
    "Telugu": {
        "dashboard_title": "స్మార్ట్ ఫార్మ్ డాష్‌బోర్డ్",
        "welcome": "తిరిగి స్వాగతం! ఈ రోజు మీ ఫార్మ్ అవలోకనం ఇక్కడ ఉంది.",
        "weather_live": "ప్రత్యక్ష వాతావరణం",
        "daily_tip": "రోజువారీ AI వ్యవసాయ చిట్కా",
        "farm_status": "పొలం స్థితి"
    }
}

def get_text(lang, key):
    return TRANSLATIONS.get(lang, TRANSLATIONS["English"]).get(key, key)
