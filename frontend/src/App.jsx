import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f0f4ff;
    --surface: #ffffff;
    --surface2: #f8faff;
    --border: #e2e8f8;
    --border2: #c8d4f0;
    --blue: #2563eb;
    --blue-light: #eff4ff;
    --blue-mid: #dbeafe;
    --blue-dark: #1d4ed8;
    --blue-glow: rgba(37,99,235,0.12);
    --text: #0f172a;
    --text2: #334155;
    --muted: #94a3b8;
    --success: #059669;
    --success-bg: #ecfdf5;
    --warn: #d97706;
    --warn-bg: #fffbeb;
    --font: 'DM Sans', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --shadow-sm: 0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
    --shadow-md: 0 4px 16px rgba(15,23,42,0.08);
    --shadow-blue: 0 4px 24px rgba(37,99,235,0.15);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    min-height: 100vh;
  }

  body::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, #c7d4f0 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.4;
  }

  .app {
    position: relative; z-index: 1;
    max-width: 820px; margin: 0 auto;
    padding: 48px 24px 80px;
    display: flex; flex-direction: column; gap: 24px;
  }

  /* HEADER */
  .header { animation: fadeDown 0.7s ease both; }
  .header-inner { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
  .logo {
    width: 46px; height: 46px; border-radius: 14px;
    background: var(--blue);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
    box-shadow: var(--shadow-blue);
  }
  .header h1 { font-size: clamp(20px, 3.5vw, 28px); font-weight: 700; letter-spacing: -0.4px; }
  .header h1 span { color: var(--blue); }
  .header-sub { font-size: 13px; color: var(--muted); padding-left: 60px; }

  /* PIPELINE */
  .pipeline {
    display: flex; align-items: center; flex-wrap: wrap; gap: 4px;
    padding: 14px 18px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; box-shadow: var(--shadow-sm);
    animation: fadeUp 0.7s 0.1s ease both;
  }
  .p-agent {
    display: flex; align-items: center; gap: 7px;
    padding: 6px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 500; white-space: nowrap;
    transition: all 0.3s;
  }
  .p-agent.idle { color: var(--muted); }
  .p-agent.active { background: var(--blue-light); color: var(--blue); box-shadow: 0 0 0 1px var(--blue-mid); }
  .p-agent.done { color: var(--success); background: var(--success-bg); }
  .p-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .p-agent.active .p-dot { animation: pulse 1s infinite; }
  .p-arrow { color: var(--border2); font-size: 14px; padding: 0 2px; }

  /* INPUT */
  .input-section { animation: fadeUp 0.7s 0.15s ease both; }
  .input-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-sm);
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .input-card:focus-within { border-color: var(--blue); box-shadow: var(--shadow-blue); }
  .input-top { padding: 18px 20px 0; }
  .input-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 8px;
  }
  .query-input {
    width: 100%; background: none; border: none; outline: none;
    color: var(--text); font-family: var(--font);
    font-size: 15px; line-height: 1.65; resize: none; min-height: 52px;
  }
  .query-input::placeholder { color: #cbd5e1; }
  .input-bottom {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 20px 16px; margin-top: 8px;
    border-top: 1px solid var(--border);
  }
  .input-hint { font-size: 12px; color: var(--muted); }
  .run-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 22px; border-radius: 10px; border: none; cursor: pointer;
    font-family: var(--font); font-size: 13px; font-weight: 600;
    background: var(--blue); color: #fff; box-shadow: var(--shadow-blue);
    transition: all 0.2s;
  }
  .run-btn:hover:not(:disabled) { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.3); }
  .run-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

  .progress-wrap { height: 3px; background: var(--border); border-radius: 3px; margin-top: 10px; overflow: hidden; }
  .progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--blue), #60a5fa);
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }

  /* LOADING */
  .loading-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 48px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 28px;
    box-shadow: var(--shadow-sm); animation: fadeUp 0.4s ease both;
  }
  .loading-row { display: flex; align-items: center; }
  .l-agent { display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .l-ring {
    width: 48px; height: 48px; border-radius: 50%;
    border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.4s;
  }
  .l-ring.spinning { border-color: var(--blue-mid); border-top-color: var(--blue); animation: spin 0.9s linear infinite; }
  .l-ring.finished { border-color: var(--success); background: var(--success-bg); animation: none; }
  .l-name { font-size: 11px; color: var(--muted); font-weight: 500; }
  .l-connector { width: 32px; height: 1.5px; background: var(--border); flex-shrink: 0; }
  .loading-msg {
    font-size: 13px; color: var(--text2);
    background: var(--blue-light); padding: 10px 20px; border-radius: 8px;
    border: 1px solid var(--blue-mid);
  }

  /* RESULTS */
  .results { display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.5s ease both; }

  /* Answer card */
  .answer-card {
    background: var(--surface); border: 1.5px solid var(--blue);
    border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-blue);
  }
  .answer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px; background: var(--blue-light);
    border-bottom: 1px solid var(--blue-mid);
  }
  .answer-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--blue);
  }
  .answer-meta { display: flex; align-items: center; gap: 10px; }
  .meta-chip {
    font-size: 11px; color: var(--muted);
    background: var(--surface); border: 1px solid var(--border);
    padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono);
  }
  .meta-chip span { color: var(--blue); font-weight: 500; }
  .copy-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--surface);
    cursor: pointer; font-family: var(--font);
    font-size: 12px; font-weight: 500; color: var(--text2); transition: all 0.2s;
  }
  .copy-btn:hover { border-color: var(--blue); color: var(--blue); }

  /* Answer body — paragraph style */
  .answer-body { padding: 28px; display: flex; flex-direction: column; gap: 14px; }
  .answer-para { font-size: 15px; line-height: 1.85; color: var(--text2); }
  .answer-para strong { color: var(--text); font-weight: 600; }
  .answer-heading {
    font-size: 15px; font-weight: 700; color: var(--text);
    margin-bottom: -6px;
  }

  /* Collapsible */
  .detail-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-sm);
  }
  .detail-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; cursor: pointer; transition: background 0.15s; user-select: none;
  }
  .detail-header:hover { background: var(--surface2); }
  .detail-title { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--text); }
  .detail-badge {
    font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 5px;
    letter-spacing: 0.05em; text-transform: uppercase;
    background: var(--blue-light); color: var(--blue); border: 1px solid var(--blue-mid);
  }
  .detail-badge.good { background: var(--success-bg); color: var(--success); border-color: #a7f3d0; }
  .detail-badge.bad { background: var(--warn-bg); color: var(--warn); border-color: #fde68a; }
  .chevron { color: var(--muted); font-size: 11px; transition: transform 0.2s; }
  .chevron.open { transform: rotate(180deg); }
  .detail-body { padding: 20px; border-top: 1px solid var(--border); background: var(--surface2); }

  /* Plan */
  .plan-list { display: flex; flex-direction: column; gap: 10px; }
  .plan-step {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 12px 16px; border-radius: 10px;
    background: var(--surface); border: 1px solid var(--border);
    font-size: 13.5px; color: var(--text2); line-height: 1.6;
  }
  .step-num {
    font-family: var(--font-mono); font-size: 11px; font-weight: 500;
    color: var(--blue); background: var(--blue-light); border: 1px solid var(--blue-mid);
    min-width: 28px; height: 24px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
  }

  /* Research */
  .research-body { font-size: 14px; line-height: 1.85; color: var(--text2); white-space: pre-wrap; }

  /* Critique */
  .critique-box {
    padding: 16px; border-radius: 10px;
    font-size: 13.5px; line-height: 1.7; color: var(--text2); white-space: pre-wrap;
  }
  .critique-box.good { background: var(--success-bg); border: 1px solid #a7f3d0; }
  .critique-box.bad { background: var(--warn-bg); border: 1px solid #fde68a; }

  /* Empty */
  .empty-state {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 60px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    text-align: center; box-shadow: var(--shadow-sm);
    animation: fadeUp 0.7s 0.25s ease both;
  }
  .empty-icon { font-size: 44px; opacity: 0.25; }
  .empty-title { font-size: 18px; font-weight: 700; color: var(--text); opacity: 0.5; }
  .empty-sub { font-size: 13px; color: var(--muted); max-width: 320px; line-height: 1.65; }
  .examples { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 6px; }
  .ex-btn {
    padding: 7px 14px; border-radius: 20px;
    border: 1.5px solid var(--border); background: var(--surface);
    font-family: var(--font); font-size: 12px; font-weight: 500;
    color: var(--text2); cursor: pointer; transition: all 0.2s;
  }
  .ex-btn:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }

  /* Error */
  .error-card {
    background: #fff1f2; border: 1px solid #fecdd3;
    border-radius: 14px; padding: 20px 24px;
    font-size: 13px; color: #be123c; line-height: 1.6;
    animation: fadeUp 0.4s ease both;
  }
  .error-card code { background: #ffe4e6; padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; }

  /* History */
  .history-section { animation: fadeUp 0.7s 0.3s ease both; }
  .history-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .history-list { display: flex; flex-direction: column; gap: 6px; }
  .history-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 16px; border-radius: 10px;
    background: var(--surface); border: 1px solid var(--border);
    cursor: pointer; transition: all 0.2s; font-size: 13px; color: var(--text2);
    box-shadow: var(--shadow-sm);
  }
  .history-item:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-light); }
  .h-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--blue); flex-shrink: 0; opacity: 0.5; }

  @keyframes fadeDown { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.75); } }
  @keyframes spin { to { transform:rotate(360deg); } }
`;

const AGENTS = ["Planner", "Researcher", "Critic", "Writer"];
const ICONS = ["🧠", "🔍", "🔎", "✍️"];
const EXAMPLES = [
  "How does GPT-4 work under the hood?",
  "What is quantum computing used for today?",
  "How do transformer models process language?",
  "Latest breakthroughs in fusion energy",
];

// Renders a paragraph — detects **heading** lines vs normal text
function AnswerParagraph({ text }) {
  const isHeading = text.startsWith("**") && text.endsWith("**");
  if (isHeading) {
    return <p className="answer-heading">{text.slice(2, -2)}</p>;
  }
  // inline bold
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="answer-para">
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : p
      )}
    </p>
  );
}

function Collapsible({ title, icon, badge, badgeType, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="detail-card">
      <div className="detail-header" onClick={() => setOpen(o => !o)}>
        <div className="detail-title">
          <span>{icon}</span>{title}
          {badge && <span className={`detail-badge ${badgeType || ""}`}>{badge}</span>}
        </div>
        <span className={`chevron ${open ? "open" : ""}`}>▼</span>
      </div>
      {open && <div className="detail-body">{children}</div>}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const taRef = useRef(null);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = "auto";
      taRef.current.style.height = taRef.current.scrollHeight + "px";
    }
  }, [query]);

  const simulateProgress = () => {
    setActiveAgent(0); setProgress(8);
    setTimeout(() => { setActiveAgent(1); setProgress(32); }, 2200);
    setTimeout(() => { setActiveAgent(2); setProgress(68); }, 5500);
    setTimeout(() => { setActiveAgent(3); setProgress(88); }, 8000);
  };

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);
    simulateProgress();
    try {
      const res = await fetch("http://localhost:8000/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data); setProgress(100); setActiveAgent(-1);
      setHistory(prev => [query.trim(), ...prev.filter(q => q !== query.trim()).slice(0, 4)]);
    } catch (err) {
      setError(err.message); setActiveAgent(-1); setProgress(0);
    } finally {
      setLoading(false); }
  };

  const isGood = result?.verdict?.toUpperCase().includes("GOOD");
  const paragraphs = result?.final_answer?.split("\n").map(p => p.trim()).filter(Boolean) || [];

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        <header className="header">
          <div className="header-inner">
            <div className="logo">🤖</div>
            <h1>Multi<span>Agent</span> Research</h1>
          </div>
          <p className="header-sub">Planner · Researcher · Critic · Writer — powered by Groq + LangGraph</p>
        </header>

        <div className="pipeline">
          {AGENTS.map((agent, i) => (
            <div key={agent} style={{ display: "flex", alignItems: "center" }}>
              <div className={`p-agent ${activeAgent === i ? "active" : (result && activeAgent === -1) || activeAgent > i ? "done" : "idle"}`}>
                <span className="p-dot" />{ICONS[i]} {agent}
              </div>
              {i < AGENTS.length - 1 && <span className="p-arrow">›</span>}
            </div>
          ))}
        </div>

        <div className="input-section">
          <div className="input-card">
            <div className="input-top">
              <label className="input-label">Your Research Question</label>
              <textarea
                ref={taRef} className="query-input"
                placeholder="Ask anything — e.g. How do large language models work?"
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())}
                rows={2} disabled={loading}
              />
            </div>
            <div className="input-bottom">
              <span className="input-hint">Enter to run · Shift+Enter for new line</span>
              <button className="run-btn" onClick={handleSubmit} disabled={!query.trim() || loading}>
                {loading ? "⟳ Running agents..." : "▶ Run Research"}
              </button>
            </div>
          </div>
          {(loading || progress > 0) && (
            <div className="progress-wrap">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-card">
            <div className="loading-row">
              {AGENTS.map((agent, i) => (
                <div key={agent} style={{ display: "flex", alignItems: "center" }}>
                  <div className="l-agent">
                    <div className={`l-ring ${activeAgent === i ? "spinning" : activeAgent > i ? "finished" : ""}`}>{ICONS[i]}</div>
                    <span className="l-name">{agent}</span>
                  </div>
                  {i < AGENTS.length - 1 && <div className="l-connector" />}
                </div>
              ))}
            </div>
            <p className="loading-msg">
              {activeAgent === 0 && "🧠 Planning your research strategy..."}
              {activeAgent === 1 && "🔍 Searching the web and saving to Pinecone..."}
              {activeAgent === 2 && "🔎 Evaluating research quality..."}
              {activeAgent === 3 && "✍️ Writing your final answer..."}
            </p>
          </div>
        )}

        {error && (
          <div className="error-card">
            ❌ {error}<br />
            <span style={{ color: "#9f1239", fontSize: 12 }}>
              Make sure your backend is running: <code>uvicorn backend.main:app --reload</code>
            </span>
          </div>
        )}

        {result && !loading && (
          <div className="results">
            <div className="answer-card">
              <div className="answer-header">
                <div className="answer-label"><span>✦</span> Final Answer</div>
                <div className="answer-meta">
                  <span className="meta-chip">iterations <span>{result.iterations}</span></span>
                  <span className="meta-chip">steps <span>{result.plan?.length}</span></span>
                  <button className="copy-btn" onClick={() => {
                    navigator.clipboard.writeText(result.final_answer);
                    setCopied(true); setTimeout(() => setCopied(false), 2000);
                  }}>{copied ? "✓ Copied" : "⎘ Copy"}</button>
                </div>
              </div>
              <div className="answer-body">
                {paragraphs.map((para, i) => <AnswerParagraph key={i} text={para} />)}
              </div>
            </div>

            <Collapsible title="Research Plan" icon="📋" badge={`${result.plan?.length} steps`}>
              <div className="plan-list">
                {result.plan?.map((step, i) => (
                  <div className="plan-step" key={i}>
                    <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{step.replace(/^\d+\.\s*/, "")}</span>
                  </div>
                ))}
              </div>
            </Collapsible>

            <Collapsible title="Research Findings" icon="📚" badge={`${result.research?.length} chars`}>
              <p className="research-body">{result.research}</p>
            </Collapsible>

            <Collapsible title="Critic Evaluation" icon="🔎"
              badge={isGood ? "Good" : "Needs Work"} badgeType={isGood ? "good" : "bad"}>
              <div className={`critique-box ${isGood ? "good" : "bad"}`}>{result.critique}</div>
            </Collapsible>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">🔬</div>
            <p className="empty-title">Ready to Research</p>
            <p className="empty-sub">4 AI agents will collaborate to find the best answer to your question</p>
            <div className="examples">
              {EXAMPLES.map(ex => <button key={ex} className="ex-btn" onClick={() => setQuery(ex)}>{ex}</button>)}
            </div>
          </div>
        )}

        {history.length > 0 && !loading && (
          <div className="history-section">
            <p className="history-label">Recent Queries</p>
            <div className="history-list">
              {history.map((q, i) => (
                <div key={i} className="history-item" onClick={() => setQuery(q)}>
                  <span className="h-dot" />{q}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}