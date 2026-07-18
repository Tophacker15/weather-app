<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:3B82F6,100:F59E0B&height=180&section=header&text=Weather%20App&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=38" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-3B82F6?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6366F1?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-F59E0B?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

Weather app. Auto-detects your location on load, React on the frontend, Python doing the actual API calls and JSON parsing on the backend.

---

### ⚙️ Stack

- React + Vite
- Python function on Vercel (`api/weather.py`) — uses `requests`
- Open-Meteo for weather + geocoding, BigDataCloud for reverse geocoding
- No API key, no signup, no database

---

### 📍 Location behavior

- Loads → asks for browser geolocation → auto-fetches weather for wherever you are
- Denied or unavailable → shows a retry prompt instead of guessing
- Search icon → search any city, jump back to current location, or pick from your last 5 searches

---

### 🔧 How it works

1. Browser sends coordinates (or a typed city name) to `/api/weather`
2. Python reverse-geocodes coordinates to a place name (or forward-geocodes a typed city to coordinates)
3. Python calls Open-Meteo for current + hourly + daily forecast
4. Parses the JSON, maps weather codes to plain text + emoji, slices the next 12 hours starting from right now
5. Sends a clean payload back, frontend renders it

---

### 📁 Structure

```
weather-app/
├── package.json
├── vite.config.js
├── index.html
├── api/
│   ├── weather.py
│   └── requirements.txt
└── src/
    ├── main.jsx
    └── App.jsx
```

---

### ▶️ Running it

```bash
npm i -g vercel
vercel dev
```

`npm run dev` alone only runs the frontend — won't hit the Python function.

---

### 🚀 Deploy

Push to GitHub, import into Vercel, deploy. No env vars needed.

---

### ✅ Shows

Current temp, condition, hi/lo, feels-like, 12-hour scroll strip, humidity, wind + direction, pressure, UV index, 7-day forecast, sunrise/sunset.

### ❌ Doesn't show

Radar map, moon phase, activity suitability panels — left out on purpose to keep scope sane.
