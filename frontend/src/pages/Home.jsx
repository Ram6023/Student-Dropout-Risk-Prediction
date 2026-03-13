import { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import BulkUpload from '../components/BulkUpload';
import { predictDropoutRisk } from '../services/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'bulk'
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
      setHistory(prev => [newResult, ...prev].slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10">
      {/* Responsive Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 anim-up">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            Risk Analysis Dashboard
          </h2>
          <p className="text-sm text-zinc-600 max-w-md leading-relaxed">
            ML-powered dropout forecasting. Analyzed student data is evaluated against historical patterns to generate risk scores.
          </p>
        </div>
        
        {/* Tab Switcher - Mobile friendly */}
        <div className="flex p-1 bg-zinc-900/50 backdrop-blur rounded-xl border border-zinc-800/80 w-fit shrink-0">
          <TabButton 
            active={activeTab === 'individual'} 
            onClick={() => setActiveTab('individual')} 
            label="Single" 
            icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
          <TabButton 
            active={activeTab === 'bulk'} 
            onClick={() => setActiveTab('bulk')} 
            label="Bulk" 
            icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
          />
        </div>
      </div>

      {/* Main Grid: Responsive 12-col */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Section: 8 cols (Input Areas + History) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* Main Card: Transitions from flex-col to grid-md */}
          <div className="card p-5 sm:p-8 anim-up d2 overflow-hidden">
            {activeTab === 'individual' ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-3 md:border-r md:border-border/50 md:pr-8">
                  <PredictionForm onSubmit={handlePredict} isLoading={isLoading} />
                </div>
                <div className="md:col-span-2 min-h-[300px] flex flex-col">
                  {error && <StateCard type="error" message={error} onRetry={() => setError(null)} />}
                  {isLoading && <StateCard type="loading" />}
                  {result && !isLoading && <ResultCard result={result} onReset={handleReset} />}
                  {!result && !isLoading && !error && <StateCard type="empty" />}
                </div>
              </div>
            ) : (
              <div className="max-w-xl mx-auto py-4">
                <BulkUpload />
              </div>
            )}
          </div>

          {/* History Panel: Horizontal scroll on mobile */}
          {history.length > 0 && activeTab === 'individual' && (
            <div className="anim-up d4">
              <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-4 ml-1">Recent Evaluations</h3>
              <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto pb-4 sm:pb-0 scrollbar-none">
                {history.map((item, i) => (
                  <HistoryCard key={i} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: 4 cols (Info/Sidebar) - Hidden on smallest, visible on larger */}
        <aside className="lg:col-span-4 space-y-4 sm:space-y-6 anim-right d3">
          <div className="card p-5 bg-gradient-to-br from-surface-card to-accent-900/5">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Model Information</h4>
            <div className="space-y-4">
              <InfoItem label="Architecture" value="Weighted Sigmoid Regressor" />
              <InfoItem label="Accuracy" value="~94% Conf." />
              <InfoItem label="Features" value="4 Metrics" />
              <InfoItem label="Last Update" value="Mar 2026" />
            </div>
          </div>

          {/* Mobile Info Tip */}
          <div className="card p-5 border-amber-500/10 bg-amber-500/5 block lg:hidden">
            <p className="text-[11px] text-amber-300/60 leading-relaxed font-medium">
              <span className="text-amber-400 mr-1 font-black">TIP:</span> Use the <span className="text-amber-200">Bulk Upload</span> tab for processing large student lists via CSV.
            </p>
          </div>

          <div className="card p-5 border-blue-500/10 bg-blue-500/5 hidden md:block">
            <h4 className="border-b border-blue-500/10 pb-3 text-[10px] font-black text-blue-400/80 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy Note
            </h4>
            <p className="text-[11px] text-blue-300/40 leading-relaxed">
              All processing is done via secure serverless functions. Data is not stored after session close, ensuring FERPA-aligned privacy.
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}

/* ── Support Components ── */

function TabButton({ active, onClick, label, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
        active 
          ? 'bg-accent-500 text-surface shadow-lg shadow-accent-500/20' 
          : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StateCard({ type, message, onRetry }) {
  if (type === 'loading') return (
    <div className="flex flex-col items-center justify-center flex-1 py-12 gap-4">
      <div className="spinner-sm" />
      <div className="text-center">
        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] animate-pulse">Computing Risk</p>
      </div>
    </div>
  );

  if (type === 'error') return (
    <div className="card-raised border-rose-500/20 p-5 anim-scale flex-1 flex flex-col justify-center items-center text-center">
      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-3">
        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-xs font-bold text-rose-400 uppercase tracking-wider">Analysis Failed</p>
      <p className="text-[10px] text-rose-500/60 leading-relaxed mt-1 mb-4">{message}</p>
      <button onClick={onRetry} className="text-[10px] font-bold text-zinc-500 hover:text-rose-400 transition-colors uppercase tracking-widest">Retry</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center flex-1 py-12 anim-fade text-center">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-border/40 flex items-center justify-center mb-5 opacity-40">
        <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </div>
      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Ready for Prediction</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[10px] sm:text-[11px]">
      <span className="text-zinc-600 uppercase font-bold tracking-tight">{label}</span>
      <span className="text-zinc-400 font-semibold">{value}</span>
    </div>
  );
}

function HistoryCard({ item }) {
  const pct = Math.round(item.probability * 100);
  const colorClass = pct < 30 ? 'text-accent-400' : pct < 60 ? 'text-amber-400' : 'text-rose-400';
  const bgClass = pct < 30 ? 'bg-accent-400/5 border-accent-400/10' : pct < 60 ? 'bg-amber-400/5 border-amber-400/10' : 'bg-rose-400/5 border-rose-400/10';

  return (
    <div className={`card-raised p-4 min-w-[180px] sm:min-w-0 ${bgClass} anim-scale shrink-0`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{item.date}</span>
        <span className={`text-[10px] font-black ${colorClass}`}>{pct}%</span>
      </div>
      <h5 className="text-[13px] font-bold text-zinc-200 truncate">{item.studentName}</h5>
      <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${colorClass}`}>
        {item.risk_level}
      </p>
    </div>
  );
}
