import { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import { predictDropoutRisk } from '../services/api';

export default function Home() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await predictDropoutRisk(data);
      const newResult = { ...res, studentName: data.name, date: new Date().toLocaleTimeString() };
      setResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 5)); // Keep last 5
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 anim-up">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Risk Analysis Dashboard
          </h2>
          <p className="text-sm text-zinc-600 mt-1.5 max-w-md">
            ML-powered dropout forecasting. Analyzed student data is evaluated against historical patterns to generate risk scores.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="card-raised px-4 py-2 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Active Session</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input & History (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Card */}
          <div className="card p-6 sm:p-8 anim-up d2">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3 md:border-r md:border-border md:pr-8">
                <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
              </div>
              <div className="md:col-span-2 min-h-[360px]">
                {error && <StateCard type="error" message={error} onRetry={() => setError(null)} />}
                {isLoading && <StateCard type="loading" />}
                {result && !isLoading && <ResultCard result={result} onReset={handleReset} />}
                {!result && !isLoading && !error && <StateCard type="empty" />}
              </div>
            </div>
          </div>

          {/* History Panel */}
          {history.length > 0 && (
            <div className="anim-up d4">
              <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-1">Recent Evaluations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {history.map((item, i) => (
                  <HistoryCard key={i} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Info Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6 anim-right d3">
          <div className="card p-5 bg-gradient-to-br from-surface-card to-accent-900/5">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">Model Information</h4>
            <div className="space-y-4">
              <InfoItem label="Architecture" value="Weighted Sigmoid Regressor" />
              <InfoItem label="Version" value="v1.4.2" />
              <InfoItem label="Features" value="4 Core Metrics" />
              <InfoItem label="Last Updated" value="March 13, 2026" />
            </div>
          </div>

          <div className="card p-5 border-blue-500/10 bg-blue-500/5">
            <h4 className="border-b border-blue-500/10 pb-3 text-xs font-bold text-blue-400/80 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Privacy Note
            </h4>
            <p className="text-[11px] text-blue-300/50 leading-relaxed">
              All data is processed locally in the current session. Results are not persisted to a permanent database unless explicitly exported.
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}

/* ── Support Components ── */

function StateCard({ type, message, onRetry }) {
  if (type === 'loading') return (
    <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
      <div className="spinner" />
      <div className="text-center">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Processing</p>
        <p className="text-[10px] text-zinc-700 mt-1">Analyzing student profile…</p>
      </div>
    </div>
  );

  if (type === 'error') return (
    <div className="card-raised border-rose-500/20 p-5 anim-scale">
      <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Analysis Failed</p>
      <p className="text-[11px] text-rose-500/60 leading-relaxed mb-4">{message}</p>
      <button onClick={onRetry} className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase">Dismiss</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 anim-fade">
      <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-border flex items-center justify-center mb-6">
        <svg className="w-7 h-7 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Ready for Analysis</p>
      <p className="text-[10px] text-zinc-700 mt-2 text-center max-w-[180px]">Fill the student details to begin ML assessment.</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="text-zinc-600 uppercase font-medium tracking-tight">{label}</span>
      <span className="text-zinc-400 font-semibold">{value}</span>
    </div>
  );
}

function HistoryCard({ item }) {
  const pct = Math.round(item.probability * 100);
  const colorClass = pct < 30 ? 'text-accent-400' : pct < 60 ? 'text-amber-400' : 'text-rose-400';
  const bgClass = pct < 30 ? 'bg-accent-400/5 border-accent-400/10' : pct < 60 ? 'bg-amber-400/5 border-amber-400/10' : 'bg-rose-400/5 border-rose-400/10';

  return (
    <div className={`card-raised p-4 ${bgClass} anim-scale`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.date}</span>
        <span className={`text-xs font-black ${colorClass}`}>{pct}%</span>
      </div>
      <h5 className="text-sm font-bold text-zinc-200 truncate">{item.studentName}</h5>
      <p className={`text-[10px] font-bold uppercase tracking-tight mt-1 ${colorClass}`}>
        {item.risk_level} Risk
      </p>
    </div>
  );
}
