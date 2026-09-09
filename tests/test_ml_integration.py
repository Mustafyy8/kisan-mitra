from datetime import datetime, timedelta, timezone
from io import BytesIO
from pathlib import Path
import tempfile
import unittest
from unittest import mock

import edge_server
from ml_service import MLService


ROOT = Path(__file__).resolve().parents[1]


class MLServiceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.service = MLService()

    def test_crop_model_returns_ranked_candidates(self):
        results = self.service.recommend_crops({"n": 90, "p": 42, "k": 43, "temperature": 20.9, "humidity": 82.0, "ph": 6.5, "rainfall": 203.0})
        self.assertEqual(len(results), 3)
        self.assertGreater(results[0]["confidence"], 0)

    def test_soil_model_returns_fertility_class(self):
        result = self.service.assess_soil_fertility({"n": 138, "p": 8.6, "k": 560, "ph": 7.46, "ec": 0.62, "organic_carbon": 0.7})
        self.assertEqual(result["status"], "ready")
        self.assertIn(result["fertility"], {"Less fertile", "Fertile", "Highly fertile"})

    def test_disease_model_identifies_known_plantvillage_sample(self):
        image_path = next((ROOT / "Data" / "plantvillage" / "Potato___Late_blight").glob("*"))
        result = self.service.diagnose(image_path.read_bytes())
        self.assertEqual(result["label"], "Potato___Late_blight")
        self.assertGreater(result["confidence"], 90)


class EdgeAPITests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        edge_server.DATABASE = Path(self.temp.name) / "kisan_mitra.db"
        edge_server.initialise_database()
        with edge_server.state_lock:
            edge_server.sensor_data_received = False
            edge_server.latest_telemetry = edge_server.normalise_telemetry({})
        # Keep tests hermetic: never reach the weather API even if .env sets a key.
        edge_server.WEATHER_API_KEY = None
        with edge_server.weather_lock:
            edge_server._weather_cache.clear()
        self.client = edge_server.app.test_client()

    def tearDown(self):
        self.temp.cleanup()

    def _set_telemetry_age(self, seconds_ago):
        """Simulate a real reading received `seconds_ago` seconds in the past."""
        with edge_server.state_lock:
            telemetry = edge_server.normalise_telemetry({"source": "serial"})
            telemetry["updated_at"] = (datetime.now(timezone.utc) - timedelta(seconds=seconds_ago)).isoformat()
            edge_server.latest_telemetry = telemetry
            edge_server.sensor_data_received = True

    def test_telemetry_flows_to_all_model_endpoints(self):
        payload = {"npk": {"n": 90, "p": 42, "k": 43}, "moisture": 42, "temperature": 20.9, "humidity": 82, "ph": 6.5, "ec": 0.62, "organic_carbon": 0.7, "rainfall": 203}
        self.assertEqual(self.client.post("/api/sensors", json=payload).status_code, 201)
        self.assertEqual(self.client.get("/api/recommendations").status_code, 200)
        soil = self.client.get("/api/soil").json
        self.assertEqual(soil["fertility"]["status"], "ready")
        self.assertEqual(self.client.get("/api/farm").json["soil_assessment"]["status"], "ready")

    def test_leaf_upload_is_persisted_and_retrievable(self):
        image_path = next((ROOT / "Data" / "plantvillage" / "Tomato_healthy").glob("*"))
        response = self.client.post("/api/disease", data={"image": (BytesIO(image_path.read_bytes()), image_path.name)}, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json["healthy"])
        self.assertEqual(self.client.get("/api/disease").json["last_scan"]["label"], "Tomato_healthy")

    def test_health_reports_no_data_and_model_readiness(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        body = response.json
        self.assertEqual(body["sensors"]["status"], "no_data")
        self.assertTrue(all(info["ready"] for info in body["models"].values()))
        self.assertTrue(body["database"]["ok"])
        self.assertEqual(body["status"], "degraded")
        self.assertGreater(body["uptime_seconds"], 0)

    def test_health_reports_fresh_after_sensor_post(self):
        payload = {"npk": {"n": 90, "p": 42, "k": 43}, "moisture": 42, "temperature": 20.9, "humidity": 82, "ph": 6.5}
        self.assertEqual(self.client.post("/api/sensors", json=payload).status_code, 201)
        body = self.client.get("/api/health").json
        self.assertEqual(body["sensors"]["status"], "fresh")
        self.assertLess(body["sensors"]["age_seconds"], 60)
        self.assertEqual(body["status"], "ok")

    def test_health_reports_stale_and_critical_sensor_age(self):
        self._set_telemetry_age(10 * 60)
        self.assertEqual(self.client.get("/api/health").json["sensors"]["status"], "stale")
        self._set_telemetry_age(60 * 60)
        body = self.client.get("/api/health").json
        self.assertEqual(body["sensors"]["status"], "critical")
        self.assertEqual(body["status"], "degraded")

    def test_weather_falls_back_to_local_sensors_when_unavailable(self):
        data = edge_server.current_telemetry()
        self.assertEqual(data["weather"]["source"], "sensor")
        self.assertEqual(data["temperature"], edge_server.latest_telemetry["temperature"])
        self.assertEqual(data["humidity"], edge_server.latest_telemetry["humidity"])

    def test_weather_overlays_live_values_when_api_available(self):
        fake_weather = {"temperature": 18.5, "humidity": 66.0, "description": "Clear Sky", "city": "New Delhi", "rainfall": 2.3}
        with mock.patch.object(edge_server, "fetch_weather", return_value=fake_weather):
            data = edge_server.current_telemetry()
        self.assertEqual(data["weather"]["source"], "api")
        self.assertEqual(data["weather"]["city"], "New Delhi")
        self.assertEqual(data["temperature"], 18.5)
        self.assertEqual(data["humidity"], 66.0)
        self.assertEqual(data["rainfall"], 2.3)

    def test_climate_endpoint_reports_weather_source(self):
        response = self.client.get("/api/climate")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["weather"]["source"], "sensor")

    def test_dashboard_payload_uses_weather_enriched_values(self):
        fake_weather = {"temperature": 38.0, "humidity": 85.0, "description": "Humid", "city": "New Delhi"}
        with mock.patch.object(edge_server, "fetch_weather", return_value=fake_weather):
            body = self.client.get("/api/farm").json
        self.assertEqual(body["telemetry"]["temperature"], 38.0)
        # High humidity from the weather API should drive the disease alert.
        self.assertTrue(any(alert["title"] == "Disease risk increasing" for alert in body["alerts"]))

    def test_profile_location_partial_update(self):
        response = self.client.post("/api/profile", json={"location": "Ludhiana, IN"})
        self.assertEqual(response.status_code, 200)
        farm = response.json["farm"]
        self.assertEqual(farm["location"], "Ludhiana, IN")
        # Unrelated fields are preserved.
        self.assertEqual(farm["name"], "Kisan Mitra Farm")
        self.assertEqual(farm["crop"], "Wheat")
        self.assertEqual(farm["acreage"], 5.0)

    def test_weather_params_priority(self):
        # 1. No GPS, no farm location: env default city.
        self.assertEqual(edge_server.weather_params(), {"q": edge_server.WEATHER_CITY})
        # 2. Farm location saved: city query wins over env default.
        self.client.post("/api/profile", json={"location": "Ludhiana, IN"})
        self.assertEqual(edge_server.weather_params(), {"q": "Ludhiana, IN"})
        # 3. Real GPS from the Arduino beats the saved location.
        with edge_server.state_lock:
            edge_server.sensor_data_received = True
            edge_server.latest_telemetry = edge_server.normalise_telemetry({"source": "serial", "gps": {"lat": 30.9, "lng": 75.85}})
        params = edge_server.weather_params()
        self.assertEqual(params["lat"], "30.900000")
        self.assertEqual(params["lon"], "75.850000")

    def test_fetch_weather_builds_query_from_params(self):
        edge_server.WEATHER_API_KEY = "test-key"
        with edge_server.weather_lock:
            edge_server._weather_cache.clear()
        captured = {}

        class FakeResponse:
            def __enter__(self):
                return self

            def __exit__(self, *args):
                return False

            def read(self):
                return b'{"main":{"temp":20,"humidity":60},"weather":[{"description":"clear sky"}],"name":"Ludhiana","rain":{"1h":1.5}}'

        def fake_urlopen(url, timeout=3):
            captured["url"] = url
            return FakeResponse()

        with mock.patch.object(edge_server, "urlopen", side_effect=fake_urlopen):
            weather = edge_server.fetch_weather({"q": "Ludhiana, IN"})
        self.assertEqual(weather["temperature"], 20.0)
        self.assertEqual(weather["city"], "Ludhiana")
        self.assertIn("q=Ludhiana%2C+IN", captured["url"])
        self.assertIn("appid=test-key", captured["url"])
        self.assertIn("units=metric", captured["url"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
