export default function Navbar() {
  return (
    <nav className="w-full border-b border-border anim-fade">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-zinc-200 tracking-tight">
            Student Dropout Risk Prediction
          </span>
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shadow-sm shadow-accent-400/50" />
            API Connected
          </div>
        </div>
      </div>
    </nav>
  );
}
