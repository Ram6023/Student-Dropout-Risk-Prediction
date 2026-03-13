import { useState, useEffect, useRef } from 'react';

/* ───────────────────────────────────────────
   Animated Speedometer Gauge
   ─────────────────────────────────────────── */
function Gauge({ percent = 0, size = 240 }) {
  const [val, setVal] = useState(0);
  const raf = useRef();
  const t0 = useRef();

  useEffect(() => {
    const dur = 2000;
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const tick = (ts) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / dur, 1);
      setVal(Math.round(ease(p) * percent));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    t0.current = null;
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [percent]);

  const cx = size / 2;
  const cy = size / 2 + 8;
  const r = size / 2 - 30;
  const sw = 10;

  const toRad = (deg) => ((deg - 90) * Math.PI) / 180;
  const pt = (angle) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });

  const arcStart = pt(180);
  const arcEnd = pt(360);
  const arcPath = `M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 1 1 ${arcEnd.x} ${arcEnd.y}`;
  const arcLen = Math.PI * r;
  const offset = arcLen - (val / 100) * arcLen;

  const needleAngle = 180 + (val / 100) * 180;
  const needleLen = r - 30;
  const nx = cx + needleLen * Math.cos(toRad(needleAngle));
  const ny = cy + needleLen * Math.sin(toRad(needleAngle));

  const color = val <= 30 ? '#10b981' : val <= 55 ? '#f59e0b' : val <= 75 ? '#f97316' : '#f43f5e';
  const glow = val <= 30 ? 'rgba(16,185,129,0.35)' : val <= 55 ? 'rgba(245,158,11,0.35)' : val <= 75 ? 'rgba(249,115,22,0.35)' : 'rgba(244,63,94,0.35)';
  const label = val <= 30 ? 'Low Risk' : val <= 55 ? 'Moderate' : val <= 75 ? 'High Risk' : 'Critical';

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 65 }}>
      <svg width={size} height={size / 2 + 70} viewBox={`0 0 ${size} ${size / 2 + 70}`} className="overflow-visible">
        <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} strokeLinecap="round" />
        <path d={arcPath} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={arcLen} strokeDashoffset={offset} className="gauge-track" style={{ filter: `drop-shadow(0 0 10px ${glow})` }} />
        
        {Array.from({ length: 21 }, (_, i) => {
          const a = 180 + (i / 20) * 180;
          const isMajor = i % 5 === 0;
          const p1 = { x: cx + (r - (isMajor ? 6 : 3)) * Math.cos(toRad(a)), y: cy + (r - (isMajor ? 6 : 3)) * Math.sin(toRad(a)) };
          const p2 = { x: cx + r * Math.cos(toRad(a)), y: cy + r * Math.sin(toRad(a)) };
          return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isMajor ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'} strokeWidth={isMajor ? 1.5 : 0.8} />;
        })}

        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${glow})`, transition: 'all 2000ms cubic-bezier(0.22,1,0.36,1)' }} />
        <circle cx={cx} cy={cy} r="4" fill={color} opacity="0.8" style={{ transition: 'fill 0.5s' }} />
        <circle cx={cx} cy={cy} r="1.5" fill="#0a0a0f" />

        <text x={cx} y={cy - 22} textAnchor="middle" fill="#e4e4e7" fontSize="34" fontWeight="800" fontFamily="Inter" className="anim-count d5">
          {val}<tspan fontSize="16" fill="#71717a">%</tspan>
        </text>

        <text x={cx} y={cy + 50} textAnchor="middle" fill={color} fontSize="10" fontWeight="700" fontFamily="Inter" letterSpacing="0.12em" style={{ transition: 'fill 0.5s' }}>
          {label.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

/* ─── Result Card ─── */
export default function ResultCard({ result, onReset }) {
  const prob = result?.probability ?? 0;
  const pct = Math.round(prob * 100);
  const factorData = result?.factors || { attendance: 0, academic: 0, financial: 0 };

  const getAdvice = () => {
    if (pct < 30) return "Student appears stable. Maintain standard monitoring and encourage continued participation.";
    if (factorData.financial > 0.7) return "Financial issues appear to be the primary risk. Recommend exploring scholarship opportunities or payment plans.";
    if (factorData.attendance > 0.7) return "Attendance is critically low. Early intervention and parent communication are strongly recommended.";
    if (factorData.academic > 0.6) return "Academic performance is declining. Peer mentoring and additional tutoring sessions may help.";
    return "Multiple risk factors detected. Comprehensive academic and welfare support is advised.";
  };

  return (
    <div className="anim-scale space-y-6">
      {/* Gauge Card */}
      <div className={`card p-6 flex flex-col items-center bg-gradient-to-b from-surface-card to-surface`}>
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] font-bold mb-4">Dropout Probability</p>
        <Gauge percent={pct} size={220} />
      </div>

      {/* Breakdown Card */}
      <div className="card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Risk Factors</h4>
          <span className="text-[10px] text-zinc-600">Influence Analysis</span>
        </div>

        <div className="space-y-4">
          <FactorBar label="Attendance" val={factorData.attendance} />
          <FactorBar label="Academics" val={factorData.academic} />
          <FactorBar label="Financials" val={factorData.financial} />
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            <span className="text-accent-400 mr-1.5">●</span>
            {getAdvice()}
          </p>
        </div>
      </div>

      {/* Reset */}
      <button onClick={onReset} className="w-full h-10 rounded-xl border border-zinc-800 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all duration-200 cursor-pointer active:scale-95 anim-up d6 uppercase letter tracking-widest">
        Create New Assessment
      </button>
    </div>
  );
}

function FactorBar({ label, val }) {
  // val is 0 to 1
  const width = `${Math.max(val * 100, 5)}%`;
  const isHigh = val > 0.7;
  const isMid = val > 0.4;
  
  const color = isHigh ? 'bg-rose-500' : isMid ? 'bg-amber-500' : 'bg-accent-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-medium tracking-tight">
        <span className="text-zinc-500 uppercase">{label}</span>
        <span className={isHigh ? 'text-rose-400' : isMid ? 'text-amber-400' : 'text-accent-400'}>
          {isHigh ? 'High Risk' : isMid ? 'Warning' : 'Stable'}
        </span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
        <div 
          className={`h-full ${color} transition-all duration-1000 cubic-bezier(0.22,1,0.36,1)`} 
          style={{ width }}
        />
      </div>
    </div>
  );
}
