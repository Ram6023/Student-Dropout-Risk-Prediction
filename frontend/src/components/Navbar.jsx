export default function Navbar() {
  return (
    <nav className="w-full border-b border-border/50 bg-surface/80 backdrop-blur-md sticky top-0 z-50 anim-fade">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <span className="text-xs sm:text-sm font-bold text-zinc-100 tracking-tight truncate max-w-[160px] sm:max-w-none">
            Student Dropout Prediction
          </span>
        </div>

        {/* Right: Status - Hide label on tiny screens */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 py-1 px-2.5 rounded-full bg-accent-500/5 border border-accent-500/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-500"></span>
            </span>
            <span className="text-[10px] font-black text-accent-500/80 uppercase tracking-widest hidden sm:inline">
              Model Online
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
