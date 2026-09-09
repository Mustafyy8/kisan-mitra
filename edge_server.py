"""KISAN MITRA local edge server.

Runs on the Raspberry Pi (or any development computer), serves the lightweight
dashboard, stores the latest farm state locally, and broadcasts telemetry over
Socket.IO.  Network services are optional: every core route continues to work
with no internet connection.
"""
from __future__ import annotations

import json
import os
import secrets
import sqlite3
import threading
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutureTimeoutError
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from urllib.parse import urlencode
from urllib.request import urlopen

from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request, send_from_directory
from flask_socketio import SocketIO
from ml_service import MLService

load_dotenv()

ROOT = Path(__file__).resolve().parent
DATABASE = ROOT / "runtime" / "kisan_mitra.db"
DATABASE.parent.mkdir(exist_ok=True)

# In production set KISAN_SECRET_KEY; a random per-boot key is only a fallback
# so sessions do not ship with a well-known default.
secret_key = os.environ.get("KISAN_SECRET_KEY")
if not secret_key:
    secret_key = secrets.token_hex(32)
    print("WARNING: KISAN_SECRET_KEY is not set; using a random per-boot key. "
          "Set it (and KISAN_API_TOKEN) before deploying to the farm.")

# If KISAN_API_TOKEN is set, every write endpoint requires it as a bearer token.
API_TOKEN = os.environ.get("KISAN_API_TOKEN") or None

# Optional OpenWeatherMap integration: when a key is configured, live conditions
# enrich the dashboard. Any failure (offline, bad key, rate limit) falls back to
# the local sensor readings, so the farm works with no internet at all.
WEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY") or None
WEATHER_CITY = os.environ.get("OPENWEATHER_CITY", "Delhi")
WEATHER_CACHE_TTL_SECONDS = 1800  # how long a successful fetch is reused
WEATHER_RETRY_SECONDS = 60        # how long a failed fetch is remembered
weather_lock = threading.Lock()
_weather_cache: dict[str, Any] = {}

app = Flask(__name__, static_folder="frontend", static_url_path="")
app.config["SECRET_KEY"] = secret_key
# The dashboard is served from this same origin, so no cross-origin access is needed.
socketio = SocketIO(app, async_mode="threading")
state_lock = threading.Lock()
ml = MLService()

# Disease inference is CPU-heavy and releases the GIL inside ONNX Runtime.
# A single worker keeps scans queued instead of letting concurrent uploads
# thrash the Raspberry Pi CPU; the request waits for its own result.
scan_executor = ThreadPoolExecutor(max_workers=1, thread_name_prefix="scan")

START_TIME = time.monotonic()
# Sensor staleness thresholds: readings younger than SENSOR_FRESH_SECONDS are
# current, older than SENSOR_STALE_SECONDS are critical.
SENSOR_FRESH_SECONDS = 300
SENSOR_STALE_SECONDS = 1800

DEFAULT_TELEMETRY = {
    "npk": {"n": 35.0, "p": 21.0, "k": 48.0},
    "moisture": 42.0,
    "temperature": 31.4,
    "humidity": 74.0,
    "ph": 6.5,
    "ec": 0.62,
    "organic_carbon": 0.7,
    "rainfall": 150.0,
    # Zero coordinates mean "no GPS yet": real Arduino readings provide gps,
    # and anything else falls back to the farm location for live weather.
    "gps": {"lat": 0.0, "lng": 0.0},
    "source": "demo",
    "updated_at": None,
}


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def weather_params() -> dict[str, str]:
    """Where to query OpenWeatherMap: live GPS beats farm location beats env default."""
    with state_lock:
        received = sensor_data_received
        gps = latest_telemetry.get("gps") or {}
    try:
        lat, lng = float(gps.get("lat")), float(gps.get("lng"))
        has_gps = received and (lat != 0.0 or lng != 0.0)
    except (TypeError, ValueError):
        has_gps = False
    if has_gps:
        return {"lat": f"{lat:.6f}", "lon": f"{lng:.6f}"}
    location = profile().get("location", "").strip()
    if location:
        return {"q": location}
    return {"q": WEATHER_CITY}


def fetch_weather(params: dict[str, str] | None = None) -> dict[str, Any] | None:
    """Current conditions from OpenWeatherMap, or None when offline/unavailable.

    `params` is a city query ({"q": "Delhi"}) or coordinates ({"lat": ..,
    "lon": ..}). Successful fetches are cached per query for
    WEATHER_CACHE_TTL_SECONDS; failures are remembered for
    WEATHER_RETRY_SECONDS so an offline device does not block on a network
    timeout for every dashboard update.
    """
    if not WEATHER_API_KEY:
        return None
    params = params or {"q": WEATHER_CITY}
    cache_key = json.dumps(params, sort_keys=True)
    now = time.monotonic()
    with weather_lock:
        entry = _weather_cache.get(cache_key)
        if entry and entry.get("data") and now - entry.get("at", 0) < WEATHER_CACHE_TTL_SECONDS:
            return entry["data"]
        if entry and entry.get("failed_at") and now - entry["failed_at"] < WEATHER_RETRY_SECONDS:
            return None
    url = ("https://api.openweathermap.org/data/2.5/weather?"
           + urlencode(params) + f"&appid={WEATHER_API_KEY}&units=metric")
    try:
        with urlopen(url, timeout=3) as response:
            raw = json.loads(response.read().decode("utf-8"))
        weather: dict[str, Any] = {
            "temperature": float(raw["main"]["temp"]),
            "humidity": float(raw["main"]["humidity"]),
            "description": str(raw["weather"][0]["description"]).title(),
            "city": str(raw["name"]),
        }
        rain = raw.get("rain", {}).get("1h")
        if rain is not None:
            weather["rainfall"] = float(rain)
        with weather_lock:
            _weather_cache[cache_key] = {"data": weather, "at": time.monotonic(), "failed_at": 0}
        return weather
    except Exception:
        # Offline, revoked key, or rate-limited: fall back to local sensors.
        with weather_lock:
            _weather_cache.setdefault(cache_key, {})["failed_at"] = time.monotonic()
        return None


def with_weather(data: dict[str, Any]) -> dict[str, Any]:
    """Return a deep copy of telemetry enriched with live weather when available.

    Temperature, humidity and rainfall are overlaid from OpenWeatherMap using
    the farm's GPS, saved location, or env fallback; the local sensor values
    are kept untouched as the offline fallback.
    """
    enriched = json.loads(json.dumps(data))
    weather = fetch_weather(weather_params())
    if not weather:
        enriched["weather"] = {"source": "sensor", "message": "Local sensor readings (weather API unavailable or not configured)."}
        return enriched
    enriched["temperature"] = weather["temperature"]
    enriched["humidity"] = weather["humidity"]
    if "rainfall" in weather:
        enriched["rainfall"] = weather["rainfall"]
    enriched["weather"] = {"source": "api", "city": weather["city"], "description": weather["description"], "fetched_at": now()}
    return enriched


def current_telemetry() -> dict[str, Any]:
    """Latest sensor telemetry enriched with live weather when available."""
    with state_lock:
        snapshot = json.loads(json.dumps(latest_telemetry))
    return with_weather(snapshot)


def db() -> sqlite3.Connection:
    # Autocommit keeps each local sensor event durable even if the Pi loses power.
    connection = sqlite3.connect(DATABASE, isolation_level=None)
    connection.row_factory = sqlite3.Row
    return connection


def initialise_database() -> None:
    with closing(db()) as connection:
        connection.executescript("""
            CREATE TABLE IF NOT EXISTS telemetry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                received_at TEXT NOT NULL,
                payload TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                kind TEXT NOT NULL,
                message TEXT NOT NULL,
                severity TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS farm_profile (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                name TEXT NOT NULL,
                crop TEXT NOT NULL,
                acreage REAL NOT NULL,
                location TEXT NOT NULL DEFAULT ''
            );
            CREATE TABLE IF NOT EXISTS disease_scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                result TEXT NOT NULL
            );
        """)
        # Migrate databases created before the location column existed.
        columns = [row["name"] for row in connection.execute("PRAGMA table_info(farm_profile)")]
        if "location" not in columns:
            connection.execute("ALTER TABLE farm_profile ADD COLUMN location TEXT NOT NULL DEFAULT ''")
        connection.execute(
            "INSERT OR IGNORE INTO farm_profile (id, name, crop, acreage) VALUES (1, ?, ?, ?)",
            ("Kisan Mitra Farm", "Wheat", 5.0),
        )


def profile() -> dict[str, Any]:
    with closing(db()) as connection:
        row = connection.execute("SELECT name, crop, acreage, location FROM farm_profile WHERE id = 1").fetchone()
    return dict(row)


def alerts_for(data: dict[str, Any]) -> list[dict[str, str]]:
    alerts = []
    if float(data["moisture"]) < 35:
        alerts.append({"severity": "critical", "title": "Zone 1 needs attention", "message": "Soil is too dry. Plan irrigation today."})
    if float(data["humidity"]) >= 80:
        alerts.append({"severity": "warning", "title": "Disease risk increasing", "message": "High humidity can support fungal disease. Inspect leaves."})
    if float(data["temperature"]) >= 36:
        alerts.append({"severity": "warning", "title": "Heat stress risk", "message": "High temperature detected. Avoid midday irrigation."})
    n = float(data["npk"]["n"])
    if n < 40:
        alerts.append({"severity": "info", "title": "Soil needs nitrogen", "message": "Nitrogen is low. Review your fertilizer plan."})
    if not alerts:
        alerts.append({"severity": "success", "title": "Farm conditions stable", "message": "No urgent action is needed right now."})
    return alerts


def health_for(data: dict[str, Any]) -> dict[str, int]:
    moisture = float(data["moisture"])
    humidity = float(data["humidity"])
    n = float(data["npk"]["n"])
    soil = max(0, min(100, int(72 + min(n, 60) / 3)))
    water = max(0, min(100, int(100 - abs(55 - moisture) * 1.8)))
    climate = max(0, min(100, int(100 - max(0, humidity - 70) * 1.5)))
    disease = max(0, min(100, int(100 - max(0, humidity - 65) * 2)))
    overall = int((soil + water + climate + disease) / 4)
    return {"overall": overall, "soil": soil, "water": water, "climate": climate, "disease": disease}


def soil_assessment_for(data: dict[str, Any]) -> dict[str, Any]:
    return ml.assess_soil_fertility({"n": data["npk"]["n"], "p": data["npk"]["p"], "k": data["npk"]["k"], "ph": data["ph"], "ec": data["ec"], "organic_carbon": data["organic_carbon"]})


def recommendation_for(data: dict[str, Any]) -> dict[str, str]:
    recommendations = ml.recommend_crops({
        "n": data["npk"]["n"], "p": data["npk"]["p"], "k": data["npk"]["k"],
        "temperature": data["temperature"], "humidity": data["humidity"], "ph": data["ph"],
        "rainfall": data["rainfall"],
    })
    if recommendations:
        best = recommendations[0]
        return {"title": f"Consider {best['crop']}", "message": f"The local crop model ranks {best['crop']} at {best['confidence']}% suitability for the current soil and climate inputs."}
    if data["moisture"] < 35:
        return {"title": "Irrigate Zone 1", "message": "Your crop is losing water quickly. Give a short irrigation cycle this morning."}
    if data["npk"]["n"] < 40:
        return {"title": "Add nitrogen", "message": "Your soil needs nitrogen. Apply according to your local agronomist's plan."}
    if data["humidity"] >= 80:
        return {"title": "Inspect for leaf disease", "message": "High humidity increases disease risk. Check the crop before spraying."}
    return {"title": "Maintain current schedule", "message": "Soil and climate values are currently within a healthy range."}


def normalise_telemetry(payload: dict[str, Any]) -> dict[str, Any]:
    data = {**DEFAULT_TELEMETRY, **payload}
    data["npk"] = {**DEFAULT_TELEMETRY["npk"], **(payload.get("npk") or {})}
    data["gps"] = {**DEFAULT_TELEMETRY["gps"], **(payload.get("gps") or {})}
    for key in ("moisture", "temperature", "humidity", "ph", "ec", "organic_carbon", "rainfall"):
        data[key] = float(data[key])
    for key in ("n", "p", "k"):
        data["npk"][key] = float(data["npk"][key])
    data["updated_at"] = now()
    return data


latest_telemetry = normalise_telemetry({})
# True once a real reading has been ingested via POST /api/sensors; the
# default payload is demo data and must not be treated as a live reading.
sensor_data_received = False


def save_telemetry(data: dict[str, Any]) -> None:
    global latest_telemetry, sensor_data_received
    with state_lock:
        latest_telemetry = data
        sensor_data_received = True
    with closing(db()) as connection:
        connection.execute("INSERT INTO telemetry (received_at, payload) VALUES (?, ?)", (data["updated_at"], json.dumps(data)))
        connection.execute("DELETE FROM telemetry WHERE id NOT IN (SELECT id FROM telemetry ORDER BY id DESC LIMIT 720)")
    socketio.emit("telemetry", dashboard_payload())


def dashboard_payload() -> dict[str, Any]:
    telemetry = current_telemetry()
    with closing(db()) as connection:
        scan = connection.execute("SELECT result FROM disease_scans ORDER BY id DESC LIMIT 1").fetchone()
    latest_scan = json.loads(scan["result"]) if scan else None
    return {
        "farm": profile(),
        "telemetry": telemetry,
        "health": health_for(telemetry),
        "soil_assessment": soil_assessment_for(telemetry),
        "alerts": alerts_for(telemetry),
        "recommendation": recommendation_for(telemetry),
        "disease": latest_scan,
        "edge": {"online": True, "model": "PlantVillage EfficientNetV2",
                 "inference_ms": latest_scan["inference_ms"] if latest_scan else None,
                 "confidence": latest_scan["confidence"] if latest_scan else None, "cloud_required": False},
    }


@app.get("/")
def index() -> Response:
    return send_from_directory(app.static_folder, "index.html")


@app.get("/api/farm")
def farm() -> Response:
    return jsonify(dashboard_payload())


def sensor_health() -> dict[str, Any]:
    """Age of the latest sensor reading, or no_data if only demo telemetry exists."""
    with state_lock:
        received = sensor_data_received
        telemetry = latest_telemetry
    base = {"source": telemetry["source"], "last_update": telemetry["updated_at"]}
    if not received:
        return {"status": "no_data", "message": "No sensor readings yet; the dashboard is showing demo data.", "age_seconds": None, **base}
    age = (datetime.now(timezone.utc) - datetime.fromisoformat(telemetry["updated_at"])).total_seconds()
    if age < SENSOR_FRESH_SECONDS:
        status, message = "fresh", "Latest sensor reading is current."
    elif age < SENSOR_STALE_SECONDS:
        status, message = "stale", f"Latest sensor reading is {int(age // 60)} minutes old."
    else:
        status, message = "critical", "No fresh sensor data for over 30 minutes."
    return {"status": status, "message": message, "age_seconds": round(age, 1), **base}


def database_health() -> dict[str, Any]:
    try:
        with closing(db()) as connection:
            rows = connection.execute("SELECT COUNT(*) FROM telemetry").fetchone()[0]
        return {"ok": True, "telemetry_rows": int(rows)}
    except sqlite3.Error as error:
        return {"ok": False, "error": str(error)}


@app.get("/api/health")
def health() -> Response:
    """Operational health: model readiness, sensor freshness, and local database."""
    models = ml.model_status()
    sensors = sensor_health()
    database = database_health()
    missing = [name for name, info in models.items() if not info["ready"]]
    if not database["ok"]:
        status = "unhealthy"
    elif missing or sensors["status"] in ("no_data", "stale", "critical"):
        status = "degraded"
    else:
        status = "ok"
    return jsonify({
        "status": status,
        "uptime_seconds": round(time.monotonic() - START_TIME),
        "models": models,
        "sensors": sensors,
        "database": database,
    })


@app.get("/api/sensors")
def sensors() -> Response:
    return jsonify(latest_telemetry)


def require_token() -> Response | None:
    """Return a 401 response when an API token is configured but not supplied."""
    if not API_TOKEN:
        return None
    if request.headers.get("Authorization") == f"Bearer {API_TOKEN}":
        return None
    return jsonify({"error": "A valid KISAN_API_TOKEN bearer token is required"}), 401


@app.post("/api/sensors")
def ingest_sensors() -> Response:
    unauthorized = require_token()
    if unauthorized:
        return unauthorized
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "JSON telemetry payload required"}), 400
    try:
        data = normalise_telemetry(payload)
    except (TypeError, ValueError, KeyError):
        return jsonify({"error": "Telemetry must include numeric npk, moisture, temperature, humidity and ph values"}), 422
    save_telemetry(data)
    return jsonify({"ok": True, "telemetry": data}), 201


@app.get("/api/soil")
def soil() -> Response:
    data = latest_telemetry
    fertility = soil_assessment_for(data)
    return jsonify({"npk": data["npk"], "moisture": data["moisture"], "ph": data["ph"], "ec": data["ec"], "organic_carbon": data["organic_carbon"], "fertility": fertility, "health": health_for(data)["soil"]})


@app.get("/api/climate")
def climate() -> Response:
    data = current_telemetry()
    return jsonify({"temperature": data["temperature"], "humidity": data["humidity"], "risk": "high" if data["humidity"] >= 80 else "normal", "weather": data["weather"]})


@app.get("/api/disease")
def disease() -> Response:
    """Expose the current Edge AI status without requiring cloud connectivity.

    The model artefact is intentionally loaded by the inference worker when it
    is installed on the Pi; this lightweight server keeps the dashboard usable
    while the worker is unavailable or a model upgrade is in progress.
    """
    with closing(db()) as connection:
        row = connection.execute("SELECT result FROM disease_scans ORDER BY id DESC LIMIT 1").fetchone()
    risk = "high" if current_telemetry()["humidity"] >= 80 else "normal"
    return jsonify({"status": "ready" if ml.disease_ready() else "unavailable", "risk": risk, "model": "PlantVillage EfficientNetV2", "cloud_required": False, "last_scan": json.loads(row["result"]) if row else None})


@app.post("/api/disease")
def scan_disease() -> Response:
    unauthorized = require_token()
    if unauthorized:
        return unauthorized
    image = request.files.get("image")
    if image is None or not image.filename:
        return jsonify({"error": "Attach a leaf image using the image field"}), 400
    if image.mimetype not in {"image/jpeg", "image/png", "image/webp"}:
        return jsonify({"error": "Only JPG, PNG, and WEBP images are accepted"}), 415
    try:
        result = scan_executor.submit(ml.diagnose, image.read()).result(timeout=120)
    except (ValueError, RuntimeError) as error:
        return jsonify({"error": str(error)}), 422
    except FutureTimeoutError:
        return jsonify({"error": "Scan queue is busy; try again in a moment"}), 503
    with closing(db()) as connection:
        connection.execute("INSERT INTO disease_scans (created_at, result) VALUES (?, ?)", (now(), json.dumps(result)))
    socketio.emit("telemetry", dashboard_payload())
    return jsonify(result), 201


@app.get("/api/alerts")
def alerts() -> Response:
    return jsonify(alerts_for(current_telemetry()))


@app.get("/api/recommendations")
def recommendations() -> Response:
    data = current_telemetry()
    crops = ml.recommend_crops({"n": data["npk"]["n"], "p": data["npk"]["p"], "k": data["npk"]["k"], "temperature": data["temperature"], "humidity": data["humidity"], "ph": data["ph"], "rainfall": data["rainfall"]})
    return jsonify({"recommendation": recommendation_for(data), "crops": crops, "alerts": alerts_for(data)})


@app.get("/api/history")
def history() -> Response:
    with closing(db()) as connection:
        rows = connection.execute("SELECT received_at, payload FROM telemetry ORDER BY id DESC LIMIT 30").fetchall()
    return jsonify([{"received_at": row["received_at"], **json.loads(row["payload"])} for row in reversed(rows)])


@app.post("/api/profile")
def update_profile() -> Response:
    """Partially update the farm profile (name, crop, acreage, location)."""
    unauthorized = require_token()
    if unauthorized:
        return unauthorized
    payload = request.get_json(silent=True) or {}
    current = profile()
    name = str(payload.get("name", current["name"])).strip() or current["name"]
    crop = str(payload.get("crop", current["crop"])).strip() or current["crop"]
    try:
        acreage = float(payload.get("acreage", current["acreage"]))
    except (TypeError, ValueError):
        acreage = float(current["acreage"])
    if acreage <= 0:
        return jsonify({"error": "acreage must be a positive number"}), 422
    location = str(payload.get("location", current.get("location", ""))).strip()
    with closing(db()) as connection:
        connection.execute(
            "UPDATE farm_profile SET name = ?, crop = ?, acreage = ?, location = ? WHERE id = 1",
            (name, crop, acreage, location),
        )
    # A new location changes which city weather is fetched for: drop the cache.
    with weather_lock:
        _weather_cache.clear()
    socketio.emit("telemetry", dashboard_payload())
    return jsonify({"ok": True, "farm": profile()})


@socketio.on("connect")
def socket_connected() -> None:
    socketio.emit("telemetry", dashboard_payload(), to=request.sid)


def main() -> None:
    initialise_database()
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "3000")), debug=os.environ.get("FLASK_DEBUG") == "1", allow_unsafe_werkzeug=True)


if __name__ == "__main__":
    main()
