import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const STYLES = `
:root {
  --accent:   #FB923C;
  --accent-b: #FDBA74;
  --rose:     #F43F5E;
  --purple:   #A855F7;
  --green:    #22C55E;
  --font-h:   'Plus Jakarta Sans',sans-serif;
  --font-b:   'Inter',sans-serif;
  --font-m:   'JetBrains Mono',monospace;
  --r-lg:20px;
  --trans:.22s ease;
}
[data-theme="dark"] {
  --bg:      #0B0709;
  --surf:    #14100F;
  --surf2:   #1C1513;
  --border:  rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.13);
  --text:    #FFF6F0;
  --muted:   #6B7280;
  --muted2:  #9CA3AF;
  --nav-bg:  rgba(11,7,9,0.85);
}
[data-theme="light"] {
  --bg:      #FFFBF8;
  --surf:    #FFFFFF;
  --surf2:   #FFF1E8;
  --border:  rgba(0,0,0,0.08);
  --border2: rgba(0,0,0,0.14);
  --text:    #180F0B;
  --muted:   #9CA3AF;
  --muted2:  #6B7280;
  --nav-bg:  rgba(255,251,248,0.88);
}

.landing{font-family:var(--font-b);background:var(--bg);color:var(--text);line-height:1.65;-webkit-font-smoothing:antialiased}
.landing *{box-sizing:border-box}
.landing a{color:inherit;text-decoration:none}
.landing button{cursor:pointer;font-family:var(--font-b);border:none;outline:none;background:none}

.l-nav{position:fixed;top:0;left:0;right:0;z-index:200;backdrop-filter:blur(20px);background:var(--nav-bg);border-bottom:1px solid var(--border);height:66px;display:flex;align-items:center;justify-content:space-between;padding:0 5%;transition:background .3s,border-color .3s}
.l-logo{display:flex;align-items:center;gap:10px;font-family:var(--font-h);font-weight:800;font-size:1.2rem;letter-spacing:-.3px}
.l-logo-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--rose));display:flex;align-items:center;justify-content:center}
.l-logo-icon svg{width:18px;height:18px;color:#fff}
.l-logo-accent{color:var(--accent-b)}
.l-nav-center{display:flex;align-items:center;gap:2px}
.l-nav-link{color:var(--muted2);font-size:.875rem;font-weight:500;padding:7px 14px;border-radius:9px;transition:color var(--trans),background var(--trans);cursor:pointer}
.l-nav-link:hover{color:var(--text);background:var(--surf2)}
.l-nav-right{display:flex;align-items:center;gap:8px}
.l-theme-switcher{display:flex;align-items:center;background:var(--surf2);border:1px solid var(--border2);border-radius:10px;padding:3px;gap:2px}
.l-theme-btn{width:30px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all var(--trans)}
.l-theme-btn svg{width:14px;height:14px}
.l-theme-btn.active{background:var(--surf);color:var(--accent);box-shadow:0 1px 4px rgba(0,0,0,.15)}
.l-btn-register{background:var(--accent);color:#fff;font-size:.875rem;font-weight:700;padding:8px 20px;border-radius:10px;transition:all var(--trans);box-shadow:0 0 18px rgba(251,146,60,.3)}
.l-btn-register:hover{background:var(--accent-b);transform:translateY(-1px);box-shadow:0 0 28px rgba(251,146,60,.45)}
.l-hamburger{display:none;flex-direction:column;gap:5px;padding:7px;border-radius:8px;border:1px solid var(--border2)}
.l-hamburger span{display:block;width:20px;height:2px;background:var(--text);border-radius:2px;transition:all .3s}
.l-hamburger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.l-hamburger.open span:nth-child(2){opacity:0}
.l-hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.l-mobile-menu{display:none;position:fixed;top:66px;left:0;right:0;z-index:199;background:var(--surf);border-bottom:1px solid var(--border);padding:16px 5% 20px;flex-direction:column;gap:4px}
.l-mobile-menu.open{display:flex}
.l-mobile-nav-link{color:var(--muted2);font-size:.95rem;font-weight:500;padding:13px 16px;border-radius:11px;cursor:pointer}
.l-mobile-nav-link:hover{color:var(--text);background:var(--surf2)}
.l-mobile-divider{height:1px;background:var(--border);margin:8px 0}
.l-mobile-theme-row{display:flex;align-items:center;justify-content:space-between;padding:8px 16px}
.l-mobile-theme-row span{font-size:.8rem;color:var(--muted);font-family:var(--font-m)}

.l-hero{padding:148px 5% 88px;text-align:center;position:relative;overflow:hidden}
.l-hero-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:900px;height:600px;background:radial-gradient(ellipse at center,rgba(251,146,60,.12) 0%,transparent 65%);pointer-events:none}
.l-hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(251,146,60,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 80% 55% at 50% 0%,black,transparent);pointer-events:none}
.l-hero>*{position:relative;z-index:1}
.l-hero-badges{display:inline-flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-bottom:28px}
.l-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:100px;font-size:.77rem;font-weight:500;border:1px solid var(--border2);background:var(--surf)}
.l-badge svg{width:14px;height:14px}
.l-bdot{width:7px;height:7px;border-radius:50%;display:inline-block}
.l-bdot-orange{background:var(--accent);box-shadow:0 0 6px var(--accent)}
.l-bdot-rose{background:var(--rose);box-shadow:0 0 6px var(--rose)}
.l-hero h1{font-family:var(--font-h);font-size:clamp(2.4rem,6.5vw,4.6rem);font-weight:800;line-height:1.1;letter-spacing:-1.5px;margin-bottom:22px}
.l-h1-orange{color:var(--accent-b)}
.l-h1-rose{color:var(--rose)}
.l-hero-sub{font-size:clamp(.95rem,2vw,1.1rem);color:var(--muted2);max-width:520px;margin:0 auto 38px}
.l-hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.l-btn-hero-p{background:var(--accent);color:#fff;font-weight:700;font-size:1rem;padding:15px 34px;border-radius:12px;transition:all var(--trans);box-shadow:0 0 30px rgba(251,146,60,.4);display:inline-flex;align-items:center;gap:8px}
.l-btn-hero-p:hover{background:var(--accent-b);transform:translateY(-2px)}
.l-btn-hero-o{background:transparent;color:var(--text);font-weight:600;font-size:1rem;padding:15px 34px;border-radius:12px;border:1px solid var(--border2);transition:all var(--trans);display:inline-flex;align-items:center;gap:8px;cursor:pointer}
.l-btn-hero-o:hover{border-color:var(--accent);color:var(--accent-b);background:rgba(251,146,60,.05)}

.l-features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:15px}
.l-feat-card{background:var(--surf);border:1px solid var(--border);border-radius:var(--r-lg);padding:26px;transition:all var(--trans);position:relative;overflow:hidden}
.l-feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(251,146,60,.5),transparent);opacity:0;transition:opacity var(--trans)}
.l-feat-card:hover{border-color:rgba(251,146,60,.25);transform:translateY(-3px);box-shadow:0 14px 44px rgba(0,0,0,.25)}
.l-feat-card:hover::before{opacity:1}
.l-feat-ico{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.l-feat-ico svg{width:22px;height:22px}
.l-feat-card h3{font-family:var(--font-h);font-size:.98rem;font-weight:700;margin-bottom:7px}
.l-feat-card p{font-size:.86rem;color:var(--muted2);line-height:1.65}

.l-stats-bar{display:flex;align-items:center;justify-content:space-around;flex-wrap:wrap;gap:20px;padding:34px 5%;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--surf)}
.l-stat-item{text-align:center}
.l-stat-num{font-family:var(--font-h);font-size:2rem;font-weight:800;letter-spacing:-.5px}
.l-stat-lbl{font-size:.76rem;color:var(--muted);margin-top:2px}
.l-stat-div{width:1px;height:40px;background:var(--border)}

.l-section{padding:88px 5%;max-width:1140px;margin:0 auto}
.l-section-full{padding:88px 5%}
.l-section-full-inner{max-width:1140px;margin:0 auto}
.l-sec-label{font-family:var(--font-m);font-size:.7rem;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.l-sec-title{font-family:var(--font-h);font-size:clamp(1.8rem,4vw,2.5rem);font-weight:800;letter-spacing:-0.8px;margin-bottom:10px}
.l-sec-sub{font-size:.95rem;color:var(--muted2);max-width:480px}
.l-sec-head{margin-bottom:52px;text-align:center}
.l-sec-head .l-sec-sub{margin:0 auto}
.l-alt-bg{background:var(--surf)}

.l-steps{max-width:620px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
.l-step-card{background:var(--surf2);border:1px solid var(--border);border-radius:var(--r-lg);padding:26px 26px 26px 22px;display:flex;gap:18px;align-items:flex-start;position:relative;overflow:hidden;transition:border-color var(--trans),transform var(--trans)}
.l-step-card:hover{border-color:rgba(251,146,60,.35);transform:translateX(4px)}
.l-step-num{position:absolute;right:18px;top:50%;transform:translateY(-50%);font-family:var(--font-h);font-size:5rem;font-weight:800;color:rgba(128,128,128,.06);line-height:1;user-select:none}
.l-step-ico{width:50px;height:50px;flex-shrink:0;border-radius:14px;display:flex;align-items:center;justify-content:center}
.l-step-ico svg{width:22px;height:22px}
.l-step-body h3{font-family:var(--font-h);font-size:1.02rem;font-weight:700;margin-bottom:6px}
.l-step-body p{font-size:.86rem;color:var(--muted2);line-height:1.65}

.l-services-list{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:10px}
.l-svc-row{background:var(--surf);border:1px solid var(--border);border-radius:var(--r-lg);padding:17px 20px;display:flex;align-items:center;gap:14px;transition:all var(--trans)}
.l-svc-row:hover{border-color:rgba(251,146,60,.4);background:var(--surf2);transform:translateY(-1px)}
.l-svc-ico{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.3rem}
.l-svc-name{font-family:var(--font-h);font-size:.98rem;font-weight:700}
.l-svc-desc{font-size:.78rem;color:var(--muted2);margin-top:2px}

.l-faq-wrap{max-width:680px;margin:0 auto;display:flex;flex-direction:column;gap:9px}
.l-faq-item{background:var(--surf2);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;transition:border-color var(--trans)}
.l-faq-item.open{border-color:rgba(251,146,60,.35)}
.l-faq-q{display:flex;align-items:center;justify-content:space-between;padding:19px 22px;cursor:pointer;font-weight:600;font-size:.92rem;gap:14px}
.l-faq-q:hover{color:var(--accent-b)}
.l-faq-arr{width:28px;height:28px;flex-shrink:0;background:var(--surf);border:1px solid var(--border);border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all var(--trans)}
.l-faq-arr svg{width:14px;height:14px;color:var(--muted);transition:transform var(--trans)}
.l-faq-item.open .l-faq-arr{background:var(--accent);border-color:var(--accent)}
.l-faq-item.open .l-faq-arr svg{color:#fff;transform:rotate(180deg)}
.l-faq-a{overflow:hidden;transition:max-height .3s ease;font-size:.86rem;color:var(--muted2);line-height:1.7;padding:0 22px}

.l-cta-wrap{padding:0 5% 88px}
.l-cta-inner{max-width:720px;margin:0 auto}
.l-cta-banner{background:linear-gradient(135deg,var(--accent) 0%,#DB2777 55%,var(--purple) 100%);border-radius:26px;padding:54px 44px;text-align:center;position:relative;overflow:hidden}
.l-cta-banner h2{font-family:var(--font-h);font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;letter-spacing:-1px;margin-bottom:12px;color:#fff}
.l-cta-banner p{font-size:.95rem;opacity:.85;max-width:440px;margin:0 auto 26px;color:#fff}
.l-btn-cta{display:inline-block;background:#fff;color:var(--accent);font-weight:700;font-size:1rem;padding:13px 36px;border-radius:11px;transition:all var(--trans)}
.l-btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.22)}

.l-footer{border-top:1px solid var(--border);background:var(--surf)}
.l-footer-inner{max-width:1140px;margin:0 auto;padding:56px 5% 36px;display:grid;grid-template-columns:2fr 1fr;gap:48px}
.l-footer-brand p{font-size:.86rem;color:var(--muted2);margin-top:10px;max-width:270px;line-height:1.65}
.l-footer-socials{display:flex;gap:8px;margin-top:18px}
.l-social-btn{width:36px;height:36px;background:var(--surf2);border:1px solid var(--border);border-radius:9px;display:flex;align-items:center;justify-content:center;transition:all var(--trans)}
.l-social-btn svg{width:16px;height:16px;color:var(--muted2)}
.l-social-btn:hover{border-color:var(--accent)}
.l-social-btn:hover svg{color:var(--accent)}
.l-footer-col h4{font-family:var(--font-h);font-size:.88rem;font-weight:700;margin-bottom:14px}
.l-footer-col ul{list-style:none;display:flex;flex-direction:column;gap:9px}
.l-footer-col ul li a{font-size:.86rem;color:var(--muted2);transition:color var(--trans);cursor:pointer}
.l-footer-col ul li a:hover{color:var(--accent-b)}
.l-footer-bottom{border-top:1px solid var(--border);max-width:1140px;margin:0 auto;padding:18px 5%;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.l-footer-bottom p{font-size:.76rem;color:var(--muted);font-family:var(--font-m)}
.l-footer-bottom a{color:var(--accent-b)}

@media(max-width:900px){
  .l-nav-center{display:none}
  .l-btn-register{display:none}
  .l-hamburger{display:flex}
  .l-theme-switcher{display:none}
}
@media(max-width:768px){
  .l-hero{padding:110px 5% 68px}
  .l-stat-div{display:none}
  .l-footer-inner{grid-template-columns:1fr}
  .l-cta-banner{padding:38px 24px}
  .l-features-grid{grid-template-columns:1fr}
}
`;

const FEATURES = [
  { name: "Instant on Load", desc: "Location detection and forecast fetching run in parallel behind a short intro animation — data's ready by the time you can interact.", color: "#FB923C", icon: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></> },
  { name: "No Account, No Tracking", desc: "No sign-up, no email, no ads. Your location is used to fetch a forecast and nothing else.", color: "#F43F5E", icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></> },
  { name: "Search Any City, Fast", desc: "Live suggestions as you type — disambiguates cities that share a name so you always get the right one.", color: "#A855F7", icon: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></> },
  { name: "Retries Automatically", desc: "If location access is briefly slow or fails, we retry once automatically before ever bothering you with an error.", color: "#22C55E", icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /> },
  { name: "Open Weather Data", desc: "Powered by Open-Meteo — accurate, global coverage, no API key required to use the app.", color: "#FDBA74", icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></> },
  { name: "Free, Always", desc: "No premium tier, no paywall on the 7-day forecast. It's free because it should be.", color: "#DB2777", icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></> },
];

const STEPS = [
  { n: "01", title: "Open the App", desc: "Your browser asks for location access once. Allow it, and we know exactly where you are — no typing required.", color: "#FB923C", icon: <><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" /><circle cx="12" cy="9" r="3" /></> },
  { n: "02", title: "Or Search Any City", desc: "Prefer to check somewhere else? Type a city name and pick from live suggestions as you type.", color: "#F43F5E", icon: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></> },
  { n: "03", title: "See Your Forecast", desc: "Current temperature, condition, humidity, wind, UV index, a 12-hour scroll strip, and a 7-day outlook.", color: "#A855F7", icon: <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /> },
];

const INCLUDED = [
  { name: "Current Conditions", desc: "Temperature, condition, feels-like, and daily high/low", icon: "🌡️", color: "#FB923C" },
  { name: "12-Hour Forecast", desc: "Scrollable hourly strip with temp and rain chance", icon: "🕐", color: "#F43F5E" },
  { name: "7-Day Outlook", desc: "Full week ahead with daily highs, lows, and conditions", icon: "📅", color: "#A855F7" },
  { name: "Humidity & Wind", desc: "Wind speed, direction, and humidity at a glance", icon: "💨", color: "#22C55E" },
  { name: "UV Index & Pressure", desc: "Know when to grab sunscreen or expect a shift in weather", icon: "☀️", color: "#FDBA74" },
  { name: "Sunrise & Sunset", desc: "Exact times for wherever you are", icon: "🌅", color: "#DB2777" },
];

const FAQS = [
  { q: "Do I have to allow location access?", a: "No. If you decline or it fails, you can search for any city instead — full functionality either way." },
  { q: "Is my location stored anywhere?", a: "No. It's used once to fetch your forecast from Open-Meteo and is never saved or logged." },
  { q: "Does it work outside Nigeria?", a: "Yes — Open-Meteo has global coverage, so it works for any city worldwide." },
  { q: 'Why does it say "Locating..." for a few seconds?', a: "That's your browser acquiring a GPS/network location fix. If it's slow, the app automatically retries once before showing an error." },
  { q: "Is there a mobile app?", a: "No native app — it's a web app that works fully in your mobile browser, so there's nothing to install." },
  { q: "Is it really free?", a: "Yes, completely. No account, no premium tier, no ads." },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".l-reveal");
    const ro = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("l-visible")),
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);
}

export default function Landing() {
  const [theme, setThemeState] = useState(() => localStorage.getItem("tbw-theme") || "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const rootRef = useRef(null);

  useReveal();

  useEffect(() => {
    const resolved = theme === "auto" ? (window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light") : theme;
    if (rootRef.current) rootRef.current.setAttribute("data-theme", resolved);
  }, [theme]);

  function setTheme(t) {
    localStorage.setItem("tbw-theme", t);
    setThemeState(t);
  }

  return (
    <div className="landing" ref={rootRef} data-theme="dark">
      <style>{STYLES}</style>

      <nav className="l-nav">
        <a className="l-logo" href="#top">
          <div className="l-logo-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg></div>
          Topboy<span className="l-logo-accent">Weather</span>
        </a>
        <div className="l-nav-center">
          <a className="l-nav-link" href="#features">Why This One</a>
          <a className="l-nav-link" href="#how">How It Works</a>
          <a className="l-nav-link" href="#faq">FAQ</a>
        </div>
        <div className="l-nav-right">
          <div className="l-theme-switcher">
            {["light", "dark", "auto"].map((t) => (
              <button key={t} className={`l-theme-btn ${theme === t ? "active" : ""}`} onClick={() => setTheme(t)} title={t}>
                {t === "light" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>}
                {t === "dark" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>}
                {t === "auto" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>}
              </button>
            ))}
          </div>
          <Link className="l-btn-register" to="/app">Open App</Link>
          <button className={`l-hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className={`l-mobile-menu ${menuOpen ? "open" : ""}`}>
        <a className="l-mobile-nav-link" href="#features" onClick={() => setMenuOpen(false)}>Why This One</a>
        <a className="l-mobile-nav-link" href="#how" onClick={() => setMenuOpen(false)}>How It Works</a>
        <a className="l-mobile-nav-link" href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        <div className="l-mobile-divider"></div>
        <Link className="l-btn-register" to="/app" style={{ textAlign: "center" }}>Open App</Link>
      </div>

      <section className="l-hero" id="top">
        <div className="l-hero-glow"></div>
        <div className="l-hero-grid"></div>
        <div className="l-hero-badges">
          <span className="l-badge"><span className="l-bdot l-bdot-orange"></span>Auto-Detects Your Location</span>
          <span className="l-badge"><span className="l-bdot l-bdot-rose"></span>Free, No Signup</span>
        </div>
        <h1>Real-Time Weather.<br /><span className="l-h1-orange">Anywhere.</span><br /><span className="l-h1-rose">Instantly.</span></h1>
        <p className="l-hero-sub">Open the app and it just knows where you are — current conditions, a 12-hour forecast, and a full 7-day outlook, no login, no app store, no API key.</p>
        <div className="l-hero-cta">
          <Link to="/app" className="l-btn-hero-p">
            Open the App
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <a href="#features" className="l-btn-hero-o">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Why This One
          </a>
        </div>
      </section>

      <div className="l-section-full" id="features">
        <div className="l-section-full-inner">
          <div className="l-sec-head">
            <div className="l-sec-label l-reveal">Why This One</div>
            <h2 className="l-sec-title l-reveal">Built to Be Fast and Honest</h2>
            <p className="l-sec-sub l-reveal">Nothing you don't need, nothing hidden behind a paywall</p>
          </div>
          <div className="l-features-grid">
            {FEATURES.map((f, i) => (
              <div className="l-feat-card l-reveal" key={f.name}>
                <div className="l-feat-ico" style={{ background: `${f.color}22` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2">{f.icon}</svg>
                </div>
                <h3>{f.name}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="l-stats-bar">
        <div className="l-stat-item l-reveal"><div className="l-stat-num">190+</div><div className="l-stat-lbl">Countries Covered</div></div>
        <div className="l-stat-div"></div>
        <div className="l-stat-item l-reveal"><div className="l-stat-num">12h</div><div className="l-stat-lbl">Hourly Forecast</div></div>
        <div className="l-stat-div"></div>
        <div className="l-stat-item l-reveal"><div className="l-stat-num">7-Day</div><div className="l-stat-lbl">Outlook</div></div>
        <div className="l-stat-div"></div>
        <div className="l-stat-item l-reveal"><div className="l-stat-num">100%</div><div className="l-stat-lbl">Free</div></div>
      </div>

      <div className="l-section-full l-alt-bg" id="how">
        <div className="l-section-full-inner">
          <div className="l-sec-head">
            <div className="l-sec-label l-reveal">Getting Started</div>
            <h2 className="l-sec-title l-reveal">How It Works</h2>
            <p className="l-sec-sub l-reveal">See your forecast in three simple steps</p>
          </div>
          <div className="l-steps">
            {STEPS.map((s) => (
              <div className="l-step-card l-reveal" key={s.n}>
                <div className="l-step-ico" style={{ background: `${s.color}22` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2">{s.icon}</svg>
                </div>
                <div className="l-step-body"><h3>{s.title}</h3><p>{s.desc}</p></div>
                <div className="l-step-num">{s.n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="l-section" id="included">
        <div className="l-sec-head">
          <div className="l-sec-label l-reveal">On Every Forecast</div>
          <h2 className="l-sec-title l-reveal">What's Included</h2>
          <p className="l-sec-sub l-reveal">Everything you'd expect from a real weather app</p>
        </div>
        <div className="l-services-list">
          {INCLUDED.map((s) => (
            <div className="l-svc-row l-reveal" key={s.name}>
              <div className="l-svc-ico" style={{ background: `${s.color}22` }}>{s.icon}</div>
              <div><div className="l-svc-name">{s.name}</div><div className="l-svc-desc">{s.desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="l-section" id="faq">
        <div className="l-sec-head">
          <div className="l-sec-label l-reveal">Questions</div>
          <h2 className="l-sec-title l-reveal">Frequently Asked Questions</h2>
          <p className="l-sec-sub l-reveal">Everything worth knowing before you open the app</p>
        </div>
        <div className="l-faq-wrap">
          {FAQS.map((f, i) => (
            <div className={`l-faq-item ${openFaq === i ? "open" : ""}`} key={f.q}>
              <div className="l-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <div className="l-faq-arr"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg></div>
              </div>
              <div className="l-faq-a" style={{ maxHeight: openFaq === i ? "300px" : "0", paddingBottom: openFaq === i ? "18px" : "0" }}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="l-cta-wrap">
        <div className="l-cta-inner">
          <div className="l-cta-banner l-reveal">
            <h2>Check your weather right now</h2>
            <p>No sign-up, no download. Open the app and see your forecast in seconds.</p>
            <Link to="/app" className="l-btn-cta">Open the App</Link>
          </div>
        </div>
      </div>

      <footer className="l-footer">
        <div className="l-footer-inner">
          <div className="l-footer-brand">
            <div className="l-logo">
              <div className="l-logo-icon" style={{ width: 30, height: 30 }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 15, height: 15 }}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg></div>
              Topboy<span className="l-logo-accent">Weather</span>
            </div>
            <p>Real-time weather with automatic location detection. Built by Topboy Innovation.</p>
            <div className="l-footer-socials">
              <a className="l-social-btn" href="https://www.tiktok.com/@topboy_innovation" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.67a8.27 8.27 0 0 0 4.83 1.56V6.78a4.85 4.85 0 0 1-1.06-.09z" /></svg>
              </a>
              <a className="l-social-btn" href="https://wa.me/2347037808537" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>
          <div className="l-footer-col">
            <h4>Weather App</h4>
            <ul>
              <li><Link to="/app">Open App</Link></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="l-footer-bottom">
          <p>© 2026 Topboy Weather by <a href="https://topboyinnovation.com">Topboy Innovation</a>. All rights reserved.</p>
          <p>Made with ❤️ in 🇳🇬 Nigeria</p>
        </div>
      </footer>
    </div>
  );
}
