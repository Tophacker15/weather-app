from http.server import BaseHTTPRequestHandler
import json
import requests
import concurrent.futures

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
REVERSE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

CURRENT_VARS = "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl"
HOURLY_VARS = "temperature_2m,precipitation_probability,weather_code"
DAILY_VARS = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset"

WEATHER_CODES = {
    0: ("Clear", "☀️"),
    1: ("Mainly Clear", "🌤️"),
    2: ("Partly Cloudy", "⛅"),
    3: ("Cloudy", "☁️"),
    45: ("Fog", "🌫️"),
    48: ("Fog", "🌫️"),
    51: ("Light Drizzle", "🌦️"),
    53: ("Drizzle", "🌦️"),
    55: ("Heavy Drizzle", "🌦️"),
    56: ("Freezing Drizzle", "🌧️"),
    57: ("Freezing Drizzle", "🌧️"),
    61: ("Light Rain", "🌧️"),
    63: ("Rain", "🌧️"),
    65: ("Heavy Rain", "🌧️"),
    66: ("Freezing Rain", "🌧️"),
    67: ("Freezing Rain", "🌧️"),
    71: ("Light Snow", "🌨️"),
    73: ("Snow", "🌨️"),
    75: ("Heavy Snow", "🌨️"),
    77: ("Snow Grains", "🌨️"),
    80: ("Rain Showers", "🌦️"),
    81: ("Rain Showers", "🌦️"),
    82: ("Violent Showers", "⛈️"),
    85: ("Snow Showers", "🌨️"),
    86: ("Snow Showers", "🌨️"),
    95: ("Thunderstorm", "⛈️"),
    96: ("Thunderstorm", "⛈️"),
    99: ("Severe Storm", "⛈️"),
}


def describe(code):
    return WEATHER_CODES.get(code, ("Unknown", "❓"))


def geocode_by_name(city):
    res = requests.get(
        GEOCODE_URL,
        params={"name": city, "count": 1, "language": "en", "format": "json"},
        timeout=6,
    )
    data = res.json()
    results = data.get("results")
    if not results:
        return None
    place = results[0]
    return {
        "name": place.get("name", city),
        "country": place.get("country", ""),
        "admin1": place.get("admin1", ""),
        "lat": place["latitude"],
        "lon": place["longitude"],
    }


def reverse_geocode(lat, lon):
    try:
        res = requests.get(
            REVERSE_URL,
            params={"latitude": lat, "longitude": lon, "localityLanguage": "en"},
            timeout=6,
        )
        data = res.json()
        name = data.get("city") or data.get("locality") or "Current Location"
        return {
            "name": name,
            "country": data.get("countryName", ""),
            "admin1": data.get("principalSubdivision", ""),
            "lat": lat,
            "lon": lon,
        }
    except requests.exceptions.RequestException:
        return {"name": "Current Location", "country": "", "admin1": "", "lat": lat, "lon": lon}


def fetch_forecast(lat, lon):
    res = requests.get(
        FORECAST_URL,
        params={
            "latitude": lat,
            "longitude": lon,
            "current": CURRENT_VARS,
            "hourly": HOURLY_VARS,
            "daily": DAILY_VARS,
            "timezone": "auto",
            "forecast_days": 8,
        },
        timeout=6,
    )
    return res.json()


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            body = json.loads(raw or b"{}")

            city = str(body.get("city", "")).strip()
            lat = body.get("lat")
            lon = body.get("lon")

            if lat is not None and lon is not None:
                with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                    place_future = pool.submit(reverse_geocode, lat, lon)
                    forecast_future = pool.submit(fetch_forecast, lat, lon)
                    place = place_future.result()
                    forecast = forecast_future.result()
            elif city:
                place = geocode_by_name(city)
                if not place:
                    self._send(404, {"error": f'No location found for "{city}"'})
                    return
                forecast = fetch_forecast(place["lat"], place["lon"])
            else:
                self._send(400, {"error": "Provide a city name or coordinates"})
                return
            current = forecast.get("current")
            hourly = forecast.get("hourly")
            daily = forecast.get("daily")

            if not current or not hourly or not daily:
                self._send(502, {"error": "Weather service did not return data"})
                return

            condition, icon = describe(current.get("weather_code"))

            times = hourly.get("time", [])
            now_iso = current.get("time")
            try:
                start = times.index(now_iso)
            except ValueError:
                start = 0

            hourly_out = []
            for i in range(start, min(start + 12, len(times))):
                h_cond, h_icon = describe(hourly["weather_code"][i])
                hourly_out.append({
                    "time": times[i],
                    "temp": hourly["temperature_2m"][i],
                    "precip": hourly["precipitation_probability"][i],
                    "icon": h_icon,
                })

            daily_out = []
            for i in range(len(daily.get("time", []))):
                d_cond, d_icon = describe(daily["weather_code"][i])
                daily_out.append({
                    "date": daily["time"][i],
                    "hi": daily["temperature_2m_max"][i],
                    "lo": daily["temperature_2m_min"][i],
                    "precip": daily["precipitation_probability_max"][i],
                    "uv": daily.get("uv_index_max", [None])[i],
                    "icon": d_icon,
                })

            payload = {
                "city": place["name"],
                "country": place["country"],
                "admin1": place["admin1"],
                "lat": place["lat"],
                "lon": place["lon"],
                "temperature": current.get("temperature_2m"),
                "feelsLike": current.get("apparent_temperature"),
                "humidity": current.get("relative_humidity_2m"),
                "windSpeed": current.get("wind_speed_10m"),
                "windDir": current.get("wind_direction_10m"),
                "pressure": current.get("pressure_msl"),
                "condition": condition,
                "icon": icon,
                "hourly": hourly_out,
                "daily": daily_out,
                "sunrise": daily["sunrise"][0] if daily.get("sunrise") else None,
                "sunset": daily["sunset"][0] if daily.get("sunset") else None,
            }

            self._send(200, payload)

        except requests.exceptions.Timeout:
            self._send(504, {"error": "Weather service took too long to respond"})
        except requests.exceptions.RequestException:
            self._send(502, {"error": "Could not reach the weather service"})
        except (json.JSONDecodeError, KeyError, TypeError, IndexError):
            self._send(502, {"error": "Weather service returned unexpected data"})
        except Exception:
            self._send(500, {"error": "Something went wrong"})

    def _send(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
