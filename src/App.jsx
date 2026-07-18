import { useEffect, useRef, useState } from "react";

const STYLES = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#252F5C;font-family:'Kanit',sans-serif;color:#fff;min-height:100vh}
.app{min-height:100vh;background:linear-gradient(160deg,#2C3A6B 0%,#3A4A85 45%,#2A3563 100%);padding-bottom:2.5rem}

.topbar{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 1.2rem .6rem;position:relative}
.loc{display:flex;align-items:center;gap:.5rem;font-weight:700;font-size:1.3rem}
.loc svg{opacity:.85;flex-shrink:0}
.locbtn{background:none;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;gap:.5rem;font-family:inherit;font-size:1.3rem;font-weight:700}

.search-wrap{position:relative}
.search-toggle{background:rgba(255,255,255,.1);border:none;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff}
.search-panel{position:absolute;top:48px;right:0;z-index:20;width:min(320px,80vw);background:#1E274D;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:.9rem;box-shadow:0 20px 50px rgba(0,0,0,.4)}
.search-panel input{width:100%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:.65rem .8rem;color:#fff;font-family:inherit;font-size:.9rem;outline:none;margin-bottom:.6rem}
.search-panel input::placeholder{color:rgba(255,255,255,.35)}
.search-panel button.go{width:100%;background:#3B82F6;border:none;border-radius:10px;color:#fff;font-family:inherit;font-weight:600;font-size:.85rem;padding:.6rem;cursor:pointer;margin-bottom:.6rem}
.dropdown-item{display:flex;align-items:center;gap:.5rem;padding:.55rem .3rem;font-size:.85rem;color:#fff;opacity:.85;cursor:pointer;border-radius:8px}
.dropdown-item:hover{background:rgba(255,255,255,.08);opacity:1}
.dropdown-label{font-size:.65rem;text-transform:uppercase;letter-spacing:.08em;opacity:.4;padding:.4rem .3rem .1rem}

.state-msg{text-align:center;padding:3rem 1.5rem;opacity:.7;font-size:.9rem;line-height:1.6}
.state-msg button{margin-top:1rem;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;font-family:inherit;
  font-size:.8rem;font-weight:600;padding:.6rem 1.2rem;border-radius:9999px;cursor:pointer}

.hero{text-align:center;padding:1.5rem 1.2rem 2rem}
.hero-temp{font-size:clamp(4rem,20vw,5.5rem);font-weight:200;line-height:1}
.hero-cond{font-size:1.1rem;font-weight:600;margin-top:.2rem}
.hero-range{opacity:.6;font-size:.88rem;margin-top:.8rem}
.hero-feels{opacity:.6;font-size:.88rem;margin-top:.1rem}

.hourly{margin:0 1.2rem 1.2rem;background:rgba(255,255,255,.06);border-radius:20px;padding:1.1rem .9rem;overflow-x:auto}
.hourly-track{display:flex;gap:1.4rem;width:max-content}
.hour{text-align:center;font-size:.78rem}
.hour-time{opacity:.6;margin-bottom:.5rem}
.hour-icon{font-size:1.3rem;margin-bottom:.4rem}
.hour-temp{font-weight:700;margin-bottom:.3rem}
.hour-precip{color:#7DD3FC;font-size:.68rem}

.grid2{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin:0 1.2rem 1.2rem}
.detail-card{background:rgba(255,255,255,.06);border-radius:18px;padding:1rem 1.1rem}
.detail-label{display:flex;align-items:center;gap:.4rem;font-size:.72rem;opacity:.6;margin-bottom:.6rem;text-transform:uppercase;letter-spacing:.04em}
.detail-val{font-size:1.5rem;font-weight:700}
.detail-sub{font-size:.72rem;opacity:.55;margin-top:.15rem}

.daily{margin:0 1.2rem 1.2rem;background:rgba(255,255,255,.06);border-radius:20px;padding:.4rem 1rem}
.day-row{display:flex;align-items:center;justify-content:space-between;padding:.65rem 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:.88rem}
.day-row:last-child{border-bottom:none}
.day-name{width:70px;font-weight:600}
.day-icon{font-size:1.1rem;width:34px;text-align:center}
.day-precip{width:44px;color:#7DD3FC;font-size:.75rem;text-align:right}
.day-range{display:flex;align-items:center;gap:.5rem;opacity:.9}
.day-lo{opacity:.5}

.sunrow{margin:0 1.2rem;display:flex;justify-content:space-around;background:rgba(255,255,255,.06);border-radius:20px;padding:1.1rem;text-align:center}
.sun-label{font-size:.7rem;opacity:.55;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.4rem}
.sun-val{font-weight:700;font-size:1.05rem}
`;

const WIND_DIRS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
function windDirLabel(deg) {
  if (deg == null) return "";
  return WIND_DIRS[Math.round(deg / 22.5) % 16];
}
function formatHour(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric" });
}
function formatDay(iso, idx) {
  if (idx === 0) return "Today";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
function formatClock(iso) {
  if (!iso) return "--";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function App() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("locating");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [recents, setRecents] = useState([]);
  const searchRef = useRef(null);

  async function loadWeather(body, label) {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not fetch weather");
        setStatus("error");
        return;
      }
      setData(json);
      setStatus("ready");
      setRecents((r) => {
        const entry = { name: json.city, lat: json.lat, lon: json.lon };
        const filtered = r.filter((x) => x.name !== entry.name);
        return [entry, ...filtered].slice(0, 5);
      });
    } catch {
      setError("Could not reach the server");
      setStatus("error");
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Your browser doesn't support location access — search for a city instead.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        setStatus("denied");
        setError("Location access was denied — search for a city instead.");
      },
      { timeout: 10000 }
    );
  }

  useEffect(() => {
    useCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    loadWeather({ city: query.trim() });
    setShowSearch(false);
    setQuery("");
  }

  function pickRecent(entry) {
    loadWeather({ lat: entry.lat, lon: entry.lon });
    setShowSearch(false);
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="topbar">
          <div className="loc">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></svg>
            {data ? `${data.city}${data.admin1 ? ", " + data.admin1 : ""}` : "Locating..."}
          </div>
          <div className="search-wrap" ref={searchRef}>
            <button className="search-toggle" onClick={() => setShowSearch((s) => !s)} aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
            {showSearch && (
              <div className="search-panel">
                <form onSubmit={handleSearchSubmit}>
                  <input autoFocus type="text" placeholder="Search city..." value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button type="submit" className="go">Search</button>
                </form>
                <div className="dropdown-item" onClick={useCurrentLocation}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="8" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /></svg>
                  Use current location
                </div>
                {recents.length > 0 && (
                  <>
                    <div className="dropdown-label">Recent</div>
                    {recents.map((r) => (
                      <div className="dropdown-item" key={r.name} onClick={() => pickRecent(r)}>{r.name}</div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {(status === "locating" || status === "loading") && (
          <div className="state-msg">Getting weather...</div>
        )}

        {(status === "denied" || status === "error") && (
          <div className="state-msg">
            {error}
            <div>
              <button onClick={useCurrentLocation}>Try location again</button>
            </div>
          </div>
        )}

        {status === "ready" && data && (
          <>
            <div className="hero">
              <div style={{ fontSize: "3rem" }}>{data.icon}</div>
              <div className="hero-temp">{Math.round(data.temperature)}°</div>
              <div className="hero-cond">{data.condition}</div>
              {data.daily?.[0] && (
                <div className="hero-range">
                  ↑{Math.round(data.daily[0].hi)}° / ↓{Math.round(data.daily[0].lo)}°
                </div>
              )}
              <div className="hero-feels">Feels like {Math.round(data.feelsLike)}°</div>
            </div>

            {data.hourly?.length > 0 && (
              <div className="hourly">
                <div className="hourly-track">
                  {data.hourly.map((h, i) => (
                    <div className="hour" key={h.time}>
                      <div className="hour-time">{i === 0 ? "Now" : formatHour(h.time)}</div>
                      <div className="hour-icon">{h.icon}</div>
                      <div className="hour-temp">{Math.round(h.temp)}°</div>
                      <div className="hour-precip">{h.precip}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid2">
              <div className="detail-card">
                <div className="detail-label">💧 Humidity</div>
                <div className="detail-val">{data.humidity}%</div>
              </div>
              <div className="detail-card">
                <div className="detail-label">🧭 Wind</div>
                <div className="detail-val">{Math.round(data.windSpeed)} <span style={{ fontSize: ".55em" }}>km/h</span></div>
                <div className="detail-sub">{windDirLabel(data.windDir)}</div>
              </div>
              <div className="detail-card">
                <div className="detail-label">🌡️ Pressure</div>
                <div className="detail-val">{Math.round(data.pressure)}</div>
                <div className="detail-sub">hPa</div>
              </div>
              <div className="detail-card">
                <div className="detail-label">☀️ UV Index</div>
                <div className="detail-val">{data.daily?.[0]?.uv != null ? Math.round(data.daily[0].uv) : "--"}</div>
              </div>
            </div>

            {data.daily?.length > 0 && (
              <div className="daily">
                {data.daily.map((d, i) => (
                  <div className="day-row" key={d.date}>
                    <div className="day-name">{formatDay(d.date, i)}</div>
                    <div className="day-icon">{d.icon}</div>
                    <div className="day-precip">{d.precip}%</div>
                    <div className="day-range">
                      <span className="day-lo">{Math.round(d.lo)}°</span>
                      <span>{Math.round(d.hi)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="sunrow">
              <div>
                <div className="sun-label">Sunrise</div>
                <div className="sun-val">{formatClock(data.sunrise)}</div>
              </div>
              <div>
                <div className="sun-label">Sunset</div>
                <div className="sun-val">{formatClock(data.sunset)}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
