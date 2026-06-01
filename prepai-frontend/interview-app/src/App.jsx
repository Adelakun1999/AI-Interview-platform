import { useState, useEffect, useRef } from "react";
import * as api from "./services/api";

// ─── Palette & theme ────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #09090f;
    --surface: #0f0f1a;
    --card: #141425;
    --border: #1e1e35;
    --accent: #6c63ff;
    --accent2: #ff6584;
    --accent3: #43e97b;
    --text: #e8e8f0;
    --muted: #6b6b8a;
    --font: 'Syne', sans-serif;
    --mono: 'DM Mono', monospace;
  }

  html, body, #root { height: 100%; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* layout */
  .app { display: flex; min-height: 100vh; }

  /* sidebar */
  .sidebar {
    width: 220px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 24px 0; position: fixed; left: 0; top: 0; bottom: 0;
    z-index: 10;
  }
  .logo {
    font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
    padding: 0 20px 28px;
    display: flex; align-items: center; gap: 10px;
  }
  .logo-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    box-shadow: 0 0 12px var(--accent);
    flex-shrink: 0;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px; cursor: pointer; font-size: 13px; font-weight: 600;
    color: var(--muted); transition: all .2s; border-left: 2px solid transparent;
    letter-spacing: .5px; text-transform: uppercase;
  }
  .nav-item:hover { color: var(--text); background: rgba(108,99,255,.06); }
  .nav-item.active {
    color: var(--accent); border-left-color: var(--accent);
    background: rgba(108,99,255,.1);
  }
  .nav-icon { font-size: 16px; }
  .sidebar-bottom { margin-top: auto; padding: 20px; }
  .user-chip {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 12px; font-size: 12px;
    display: flex; align-items: center; gap: 8px; color: var(--muted);
  }
  .user-chip span { color: var(--text); font-weight: 600; }
  .avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .logout-btn {
    margin-top: 8px; width: 100%; padding: 8px; background: none;
    border: 1px solid var(--border); border-radius: 8px; color: var(--muted);
    font-family: var(--font); font-size: 12px; cursor: pointer; transition: all .2s;
  }
  .logout-btn:hover { border-color: var(--accent2); color: var(--accent2); }

  /* main */
  .main { margin-left: 220px; flex: 1; padding: 32px 36px; min-height: 100vh; }
  .page-title {
    font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px;
  }
  .page-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; font-weight: 400; }

  /* cards */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 24px;
  }
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

  /* stat cards */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px;
  }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .stat-value { font-size: 30px; font-weight: 800; letter-spacing: -1px; }
  .stat-accent { color: var(--accent); }
  .stat-green { color: var(--accent3); }
  .stat-red { color: var(--accent2); }

  /* buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 9px; font-family: var(--font);
    font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s;
    border: none; letter-spacing: .3px;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), #8b5cf6);
    color: #fff; box-shadow: 0 4px 14px rgba(108,99,255,.3);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108,99,255,.4); }
  .btn-outline {
    background: none; border: 1px solid var(--border); color: var(--text);
  }
  .btn-outline:hover { border-color: var(--accent); color: var(--accent); }
  .btn-ghost { background: rgba(108,99,255,.1); color: var(--accent); }
  .btn-ghost:hover { background: rgba(108,99,255,.2); }
  .btn-danger { background: rgba(255,101,132,.1); color: var(--accent2); border: 1px solid rgba(255,101,132,.2); }
  .btn-danger:hover { background: rgba(255,101,132,.2); }
  .btn:disabled { opacity: .4; cursor: not-allowed; transform: none !important; }
  .btn-sm { padding: 7px 12px; font-size: 12px; }

  /* inputs */
  .input-group { margin-bottom: 16px; }
  .input-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 6px; display: block; }
  .input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 9px; padding: 11px 14px; color: var(--text);
    font-family: var(--font); font-size: 14px; transition: border .2s;
    outline: none;
  }
  .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(108,99,255,.12); }
  .input::placeholder { color: var(--muted); }
  select.input { cursor: pointer; }
  textarea.input { resize: vertical; min-height: 100px; font-family: var(--mono); font-size: 13px; }

  /* auth */
  .auth-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(108,99,255,.07) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(255,101,132,.05) 0%, transparent 50%);
  }
  .auth-box {
    width: 380px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 36px;
    animation: fadeUp .4s ease;
  }
  .auth-logo { font-size: 22px; font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 10px; }
  .auth-sub { color: var(--muted); font-size: 13px; margin-bottom: 28px; }
  .auth-switch { font-size: 13px; color: var(--muted); margin-top: 16px; text-align: center; }
  .auth-switch button { background: none; border: none; color: var(--accent); font-family: var(--font); font-size: 13px; cursor: pointer; font-weight: 600; }
  .auth-error { background: rgba(255,101,132,.1); border: 1px solid rgba(255,101,132,.3); border-radius: 8px; padding: 10px 14px; color: var(--accent2); font-size: 13px; margin-bottom: 14px; }

  /* badges */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .5px;
  }
  .badge-purple { background: rgba(108,99,255,.15); color: var(--accent); }
  .badge-green { background: rgba(67,233,123,.12); color: var(--accent3); }
  .badge-red { background: rgba(255,101,132,.12); color: var(--accent2); }
  .badge-blue { background: rgba(56,189,248,.12); color: #38bdf8; }

  /* resume card */
  .resume-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px;
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color .2s;
  }
  .resume-card:hover { border-color: var(--accent); }
  .resume-name { font-weight: 700; font-size: 14px; margin-bottom: 3px; }
  .resume-meta { font-size: 12px; color: var(--muted); font-family: var(--mono); }
  .resume-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  /* drop zone */
  .dropzone {
    border: 2px dashed var(--border); border-radius: 14px; padding: 40px;
    text-align: center; cursor: pointer; transition: all .2s;
    background: rgba(108,99,255,.02);
  }
  .dropzone:hover, .dropzone.active {
    border-color: var(--accent); background: rgba(108,99,255,.06);
  }
  .dropzone-icon { font-size: 36px; margin-bottom: 10px; }
  .dropzone-text { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
  .dropzone-sub { font-size: 12px; color: var(--muted); }

  /* analysis panel */
  .analysis-box {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 16px; font-family: var(--mono);
    font-size: 12.5px; line-height: 1.8; color: #c4c4e0; white-space: pre-wrap;
    max-height: 400px; overflow-y: auto; margin-top: 14px;
  }

  /* interview */
  .question-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 22px; margin-bottom: 16px;
    position: relative;
  }
  .q-number {
    font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 8px; font-family: var(--mono);
  }
  .q-text { font-size: 15px; font-weight: 600; line-height: 1.6; margin-bottom: 14px; }
  .score-bar-wrap { margin-top: 10px; }
  .score-bar-track { background: var(--border); border-radius: 4px; height: 6px; margin-top: 6px; overflow: hidden; }
  .score-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--accent), var(--accent3)); transition: width .6s ease; }

  /* tabs */
  .tabs { display: flex; gap: 4px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 4px; margin-bottom: 24px; width: fit-content; }
  .tab { padding: 8px 16px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--muted); transition: all .2s; border: none; background: none; font-family: var(--font); }
  .tab.active { background: var(--accent); color: #fff; }
  .tab:hover:not(.active) { color: var(--text); }

  /* progress ring */
  .ring-wrap { position: relative; width: 90px; height: 90px; }
  .ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-value { font-size: 22px; font-weight: 800; }
  .ring-sub { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }

  /* toasts */
  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 999; display: flex; flex-direction: column; gap: 8px; }
  .toast {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 16px; font-size: 13px;
    display: flex; align-items: center; gap: 10px; min-width: 260px;
    animation: slideIn .3s ease; box-shadow: 0 8px 30px rgba(0,0,0,.4);
  }
  .toast.success { border-color: rgba(67,233,123,.3); }
  .toast.error { border-color: rgba(255,101,132,.3); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.2); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
  .spinner-dark { border-color: rgba(108,99,255,.2); border-top-color: var(--accent); }

  /* divider */
  .divider { border: none; border-top: 1px solid var(--border); margin: 24px 0; }

  /* empty state */
  .empty { text-align: center; padding: 48px 20px; color: var(--muted); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }

  /* section header */
  .section-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-size: 16px; font-weight: 700; }

  /* voice */
  .voice-bar {
    display: flex; align-items: center; gap: 10px; margin-top: 10px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px;
  }
  .mic-btn {
    width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 17px;
    flex-shrink: 0; transition: all .2s;
    background: rgba(108,99,255,.15); color: var(--accent);
  }
  .mic-btn.recording {
    background: rgba(255,101,132,.2); color: var(--accent2);
    animation: pulse 1.2s ease infinite;
  }
  .mic-btn:disabled { opacity: .4; cursor: not-allowed; }
  .voice-transcript {
    flex: 1; font-family: var(--mono); font-size: 12.5px; color: var(--text);
    line-height: 1.6; min-height: 20px;
  }
  .voice-hint { font-size: 11px; color: var(--muted); }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,101,132,.4); }
    50% { box-shadow: 0 0 0 8px rgba(255,101,132,.0); }
  }

  /* eval card */
  .eval-section { margin-top: 16px; padding: 14px; background: var(--bg); border-radius: 10px; border: 1px solid var(--border); }
  .eval-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 6px; font-weight: 700; }
  .eval-text { font-family: var(--mono); font-size: 12.5px; line-height: 1.8; color: #c4c4e0; white-space: pre-wrap; }

  @media (max-width: 768px) {
    .sidebar { width: 60px; }
    .nav-item span, .logo-text, .user-chip .user-info { display: none; }
    .main { margin-left: 60px; padding: 20px; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastId = 0;
let toastSetter = null;
const toast = (msg, type = "success") => {
  if (toastSetter) toastSetter((p) => [...p, { id: ++toastId, msg, type }]);
};

function Toasts() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => { toastSetter = setToasts; return () => { toastSetter = null; }; }, []);
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => setToasts((p) => p.slice(1)), 3500);
    return () => clearTimeout(t);
  }, [toasts]);
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "register") {
        const r = await api.register(form.name, form.email, form.password);
        if (r.detail) { setError(r.detail); return; }
        toast("Account created! Please login.");
        setMode("login");
      } else {
        const r = await api.login(form.email, form.password);
        if (r.detail || !r.access_token) { setError(r.detail || "Login failed"); return; }
        localStorage.setItem("token", r.access_token);
        localStorage.setItem("userEmail", form.email);
        onLogin(form.email);
      }
    } catch { setError("Network error. Is the backend running?"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="logo-dot" />
          <span>PrepAI</span>
        </div>
        <p className="auth-sub">
          {mode === "login" ? "Welcome back. Let's get you interview-ready." : "Create your account to start practising."}
        </p>
        {error && <div className="auth-error">{error}</div>}
        {mode === "register" && (
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input className="input" placeholder="John Doe" value={form.name} onChange={set("name")} />
          </div>
        )}
        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : null}
          {mode === "login" ? "Sign In" : "Create Account"}
        </button>
        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    api.getAnalytics().then((d) => setAnalytics(d)).catch(() => {});
  }, []);

  const a = analytics;
  const avg = a?.average_score ?? 0;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (avg / 10) * circumference;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Your interview performance at a glance.</p>

      <div className="stat-grid">
        {[
          { label: "Total Sessions", value: a?.total_sessions ?? "—", cls: "stat-accent" },
          { label: "Avg Score", value: a?.average_score != null ? `${a.average_score}/10` : "—", cls: "stat-green" },
          { label: "Best Score", value: a?.highest_score != null ? `${a.highest_score}/10` : "—", cls: "stat-accent" },
          { label: "Lowest Score", value: a?.lowest_score != null ? `${a.lowest_score}/10` : "—", cls: "stat-red" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-value ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {a?.total_sessions > 0 && (
        <div className="card" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <div className="ring-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle cx="45" cy="45" r="36" fill="none" stroke="var(--accent)" strokeWidth="6"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                transform="rotate(-90 45 45)" style={{ transition: "stroke-dashoffset .8s ease" }} />
            </svg>
            <div className="ring-label">
              <span className="ring-value" style={{ color: "var(--accent)" }}>{avg}</span>
              <span className="ring-sub">/ 10</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Average Performance</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              {avg >= 8 ? "🌟 Excellent — you're interview-ready!" :
               avg >= 6 ? "👍 Good progress — keep practising." :
               "📈 Room to improve — try more sessions."}
            </div>
          </div>
        </div>
      )}

      {(!a || a.message) && (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">🎯</div>
            <div className="empty-text">No sessions yet. Upload a resume and start an interview to see your stats here.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Resumes ─────────────────────────────────────────────────────────────────
function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analysisMap, setAnalysisMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const load = () => api.getResumes().then(setResumes).catch(() => {});
  useEffect(() => { load(); }, []);

  const doUpload = async (file) => {
    if (!file || !file.name.endsWith(".pdf")) { toast("Only PDF files allowed.", "error"); return; }
    setUploading(true);
    try {
      const r = await api.uploadResume(file);
      if (r.id) { toast("Resume uploaded!"); load(); }
      else toast(r.detail || "Upload failed", "error");
    } catch { toast("Upload error", "error"); }
    finally { setUploading(false); }
  };

  const analyze = async (id, type) => {
    setLoadingMap((p) => ({ ...p, [`${id}-${type}`]: true }));
    try {
      const r = type === "llm" ? await api.llmAnalyzeResume(id) : await api.analyzeResume(id);
      const text = r.llm_analysis || JSON.stringify(r.analysis, null, 2);
      setAnalysisMap((p) => ({ ...p, [id]: text }));
    } catch { toast("Analysis failed", "error"); }
    finally { setLoadingMap((p) => ({ ...p, [`${id}-${type}`]: false })); }
  };

  return (
    <div>
      <h1 className="page-title">Resumes</h1>
      <p className="page-sub">Upload your PDF resume to unlock AI-powered analysis.</p>

      <div
        className={`dropzone ${drag ? "active" : ""}`}
        style={{ marginBottom: 28 }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); doUpload(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current.click()}
      >
        <div className="dropzone-icon">📄</div>
        <div className="dropzone-text">{uploading ? "Uploading…" : "Drop your PDF here, or click to browse"}</div>
        <div className="dropzone-sub">PDF only · max 10MB</div>
        <input ref={fileRef} type="file" accept=".pdf" hidden onChange={(e) => doUpload(e.target.files[0])} />
      </div>

      {resumes.length === 0 && (
        <div className="empty"><div className="empty-icon">📂</div><div className="empty-text">No resumes yet.</div></div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {resumes.map((r) => (
          <div key={r.id}>
            <div className="resume-card">
              <div>
                <div className="resume-name">{r.file_name}</div>
                <div className="resume-meta">ID #{r.id}</div>
              </div>
              <div className="resume-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => analyze(r.id, "basic")} disabled={loadingMap[`${r.id}-basic`]}>
                  {loadingMap[`${r.id}-basic`] ? <span className="spinner spinner-dark" /> : "🔍"} Analyse
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => analyze(r.id, "llm")} disabled={loadingMap[`${r.id}-llm`]}>
                  {loadingMap[`${r.id}-llm`] ? <span className="spinner" /> : "✨"} AI Analysis
                </button>
              </div>
            </div>
            {analysisMap[r.id] && (
              <div className="analysis-box">{analysisMap[r.id]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Voice hook ──────────────────────────────────────────────────────────────
function useVoice(onResult) {
  const recogRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [supported] = useState(() => "webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const start = () => {
    if (!supported) { toast("Voice not supported in this browser. Use Chrome.", "error"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onstart = () => setRecording(true);
    r.onend = () => setRecording(false);
    r.onerror = () => { setRecording(false); toast("Microphone error. Check permissions.", "error"); };
    r.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join("");
      onResult(transcript);
    };
    r.start();
    recogRef.current = r;
  };

  const stop = () => { recogRef.current?.stop(); setRecording(false); };
  const toggle = () => recording ? stop() : start();

  return { recording, toggle, supported };
}

// ─── Voice answer card ────────────────────────────────────────────────────────
function VoiceAnswerCard({ idx, question, answer, onAnswer, onEvaluate, loadingEval, evalResult }) {
  const { recording, toggle, supported } = useVoice((t) => onAnswer(idx, t));

  return (
    <div className="question-card">
      <div className="q-number">Question {idx + 1}</div>
      <div className="q-text">{question}</div>

      <div className="voice-bar">
        <button className={`mic-btn ${recording ? "recording" : ""}`} onClick={toggle} title={recording ? "Stop recording" : "Start recording"}>
          {recording ? "⏹" : "🎙️"}
        </button>
        <div style={{ flex: 1 }}>
          {answer
            ? <div className="voice-transcript">{answer}</div>
            : <div className="voice-hint">{recording ? "🔴 Listening… speak your answer" : supported ? "Click 🎙️ to start speaking your answer" : "Voice not supported — type below"}</div>
          }
        </div>
        {answer && (
          <button className="btn btn-ghost btn-sm" onClick={() => onAnswer(idx, "")} title="Clear answer">✕</button>
        )}
      </div>

      {/* fallback text input */}
      <textarea
        className="input"
        style={{ marginTop: 8 }}
        placeholder="Or type your answer here…"
        value={answer || ""}
        onChange={(e) => onAnswer(idx, e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={() => onEvaluate(idx, question)} disabled={loadingEval}>
          {loadingEval ? <><span className="spinner" /> Evaluating…</> : "✓ Evaluate"}
        </button>
      </div>

      {evalResult && (
        <div className="eval-section">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span className="eval-title">Score</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: evalResult.score >= 7 ? "var(--accent3)" : evalResult.score >= 5 ? "var(--accent)" : "var(--accent2)" }}>
              {evalResult.score}/10
            </span>
            <div className="score-bar-track" style={{ flex: 1 }}>
              <div className="score-bar-fill" style={{ width: `${evalResult.score * 10}%` }} />
            </div>
          </div>
          <div className="eval-title">Feedback</div>
          <div className="eval-text">{evalResult.evaluation}</div>
        </div>
      )}
    </div>
  );
}

// ─── Interview ────────────────────────────────────────────────────────────────
function InterviewPage() {
  const [resumes, setResumes] = useState([]);
  const [config, setConfig] = useState({ resumeId: "", type: "technical", difficulty: "medium" });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [evals, setEvals] = useState({});
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingE, setLoadingE] = useState({});
  const [step, setStep] = useState("config");

  useEffect(() => { api.getResumes().then(setResumes).catch(() => {}); }, []);

  const generate = async () => {
    if (!config.resumeId) { toast("Select a resume first.", "error"); return; }
    setLoadingQ(true); setQuestions([]); setAnswers({}); setEvals({});
    try {
      const r = await api.generateQuestions(config.resumeId, config.type, config.difficulty);
      if (r.detail) { toast(r.detail, "error"); return; }
      if (r.questions) {
        // Backend returns a plain string — split into individual questions
        let parsed = [];
        if (Array.isArray(r.questions)) {
          parsed = r.questions;
        } else if (typeof r.questions === "string") {
          parsed = r.questions
            .split("\n")
            .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
            .filter((l) => l.length > 10);
        }
        if (parsed.length === 0) { toast("No questions returned. Try again.", "error"); return; }
        setQuestions(parsed);
        setStep("interview");
      } else {
        toast("Failed to generate questions", "error");
      }
    } catch (e) { toast("Error generating questions", "error"); console.error(e); }
    finally { setLoadingQ(false); }
  };

  const evaluate = async (idx, q) => {
    const ans = answers[idx];
    if (!ans?.trim()) { toast("Please write an answer first.", "error"); return; }
    setLoadingE((p) => ({ ...p, [idx]: true }));
    try {
      const r = await api.evaluateAnswer(q, ans, config.type, config.difficulty);
      setEvals((p) => ({ ...p, [idx]: r }));
      toast(`Score: ${r.score}/10`);
    } catch { toast("Evaluation failed", "error"); }
    finally { setLoadingE((p) => ({ ...p, [idx]: false })); }
  };

  if (step === "config") return (
    <div>
      <h1 className="page-title">Interview Practice</h1>
      <p className="page-sub">Configure your session and get AI-generated questions based on your resume.</p>
      <div className="card" style={{ maxWidth: 500 }}>
        <div className="input-group">
          <label className="input-label">Resume</label>
          <select className="input" value={config.resumeId} onChange={(e) => setConfig((p) => ({ ...p, resumeId: e.target.value }))}>
            <option value="">— Select a resume —</option>
            {resumes.map((r) => <option key={r.id} value={r.id}>{r.file_name}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Interview Type</label>
          <select className="input" value={config.type} onChange={(e) => setConfig((p) => ({ ...p, type: e.target.value }))}>
            {["technical", "behavioural", "system design", "hr"].map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Difficulty</label>
          <select className="input" value={config.difficulty} onChange={(e) => setConfig((p) => ({ ...p, difficulty: e.target.value }))}>
            {["easy", "medium", "hard"].map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={generate} disabled={loadingQ}>
          {loadingQ ? <><span className="spinner" /> Generating…</> : "⚡ Generate Questions"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <button className="btn btn-outline btn-sm" onClick={() => setStep("config")}>← Back</button>
        <h1 className="page-title" style={{ margin: 0 }}>Your Session</h1>
        <span className="badge badge-purple">{config.type}</span>
        <span className={`badge ${config.difficulty === "easy" ? "badge-green" : config.difficulty === "hard" ? "badge-red" : "badge-blue"}`}>
          {config.difficulty}
        </span>
      </div>
      <p className="page-sub">Answer each question, then click Evaluate to get AI feedback.</p>

      {(questions || []).map((q, i) => (
        <VoiceAnswerCard
          key={i}
          idx={i}
          question={q}
          answer={answers[i]}
          onAnswer={(idx, val) => setAnswers((p) => ({ ...p, [idx]: val }))}
          onEvaluate={evaluate}
          loadingEval={loadingE[i]}
          evalResult={evals[i]}
        />
      ))}
    </div>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--muted)", padding: 40 }}>Loading…</div>;

  if (!data || data.message) return (
    <div>
      <h1 className="page-title">Analytics</h1>
      <p className="page-sub">Detailed performance metrics.</p>
      <div className="card"><div className="empty"><div className="empty-icon">📊</div><div className="empty-text">Complete some interview sessions to see analytics here.</div></div></div>
    </div>
  );

  const scores = [
    { label: "Average", value: data.average_score, max: 10, color: "var(--accent)" },
    { label: "Highest", value: data.highest_score, max: 10, color: "var(--accent3)" },
    { label: "Lowest", value: data.lowest_score, max: 10, color: "var(--accent2)" },
  ];

  return (
    <div>
      <h1 className="page-title">Analytics</h1>
      <p className="page-sub">Your performance across {data.total_sessions} interview sessions.</p>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginBottom: 24 }}>
        {scores.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label} Score</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}/10</div>
            <div className="score-bar-track" style={{ marginTop: 10 }}>
              <div className="score-bar-fill" style={{ width: `${(s.value / 10) * 100}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>Performance Summary</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["Total Sessions Completed", data.total_sessions, "🗂️"],
            ["Average Score", `${data.average_score} / 10`, "📊"],
            ["Best Performance", `${data.highest_score} / 10`, "🏆"],
            ["Needs Improvement", `${data.lowest_score} / 10`, "📈"],
          ].map(([label, val, icon]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--muted)", fontSize: 14 }}>{icon} {label}</span>
              <span style={{ fontWeight: 700, fontFamily: "var(--mono)" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "resumes", label: "Resumes", icon: "📄" },
  { id: "interview", label: "Interview", icon: "🎙️" },
  { id: "analytics", label: "Analytics", icon: "📊" },
];

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("userEmail"));
  const [page, setPage] = useState("dashboard");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  const initial = user ? user[0].toUpperCase() : "?";

  if (!user) return (
    <>
      <style>{CSS}</style>
      <AuthPage onLogin={(email) => setUser(email)} />
      <Toasts />
    </>
  );

  const pages = { dashboard: <Dashboard />, resumes: <ResumePage />, interview: <InterviewPage />, analytics: <AnalyticsPage /> };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-dot" />
            <span className="logo-text">PrepAI</span>
          </div>
          {NAV.map((n) => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </div>
          ))}
          <div className="sidebar-bottom">
            <div className="user-chip">
              <div className="avatar">{initial}</div>
              <div className="user-info">
                <span>{user.split("@")[0]}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>Sign Out</button>
          </div>
        </aside>
        <main className="main">
          {pages[page]}
        </main>
      </div>
      <Toasts />
    </>
  );
}
