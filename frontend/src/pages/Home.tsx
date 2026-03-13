import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { GradientDots } from '@/components/ui/gradient-dots';
import StatGrid from '../components/CommandCenter/StatGrid';
import MainDashboard from '../components/CommandCenter/MainDashboard';
import PredictionHub from '../components/CommandCenter/PredictionHub';
import ResultGauge from '../components/CommandCenter/ResultGauge';
import AIExplanation from '../components/CommandCenter/AIExplanation';
import BulkUpload from '../components/BulkUpload';
import { predictDropoutRisk } from '../services/api';
import { Bell, Search, User, ShieldCheck, LayoutDashboard, Database, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Home = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentResult, setCurrentResult] = useState<any>(null);

    const { scrollY } = useScroll();
    const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);
    const headerOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
    const headerBorder = useTransform(scrollY, [0, 100], [0, 1]);

    useEffect(() => {
        const saved = sessionStorage.getItem('risk_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const updateHistory = (newResult: any) => {
        const updated = [newResult, ...history].slice(0, 50);
        setHistory(updated);
        sessionStorage.setItem('risk_history', JSON.stringify(updated));
    };

    const handlePredict = async (data: any) => {
        setLoading(true);
        try {
            const result = await predictDropoutRisk(data);
            setCurrentResult(result);
            updateHistory({
                ...result,
                name: data.name || 'Anonymous Student',
                timestamp: new Date().toLocaleTimeString()
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'predict', label: 'Predictive Link', icon: ShieldCheck },
        { id: 'bulk', label: 'Mass Stream', icon: Database },
        { id: 'analytics', label: 'Deep Insights', icon: BarChart3 },
    ];

    return (
        <div className="relative min-h-screen bg-slate-950 text-slate-400 selection:bg-brand-500/30 selection:text-brand-200 overflow-x-hidden">
            {/* ── High-End Animated Background ── */}
            <GradientDots 
                dotSize={2} 
                spacing={45} 
                backgroundColor="#020617" 
                className="opacity-60"
            />

            {/* ── Progressive Blur Header ── */}
            <motion.header 
                style={{ 
                    backdropFilter: useTransform(headerBlur, b => `blur(${b}px)`),
                    backgroundColor: useTransform(headerOpacity, o => `rgba(2, 6, 23, ${o})`),
                    borderBottom: useTransform(headerBorder, b => `${b}px solid rgba(255, 255, 255, 0.05)`)
                }}
                className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50"
            >
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6 stroke-[2.5px]" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-white font-black text-sm tracking-widest uppercase leading-none">DROPOUT<span className="text-brand-400">AI</span></h1>
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">v2.4 Stable</span>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2.5",
                                    activeTab === tab.id 
                                        ? "bg-white/5 text-white shadow-inner border border-white/5" 
                                        : "hover:bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent"
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-brand-400 animate-pulse" : "text-slate-600")} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-4 text-slate-500 px-5 py-2.5 rounded-2xl bg-white/[0.03] group border border-white/[0.05] hover:border-brand-500/50 transition-all cursor-text overflow-hidden relative">
                        <Search className="w-3.5 h-3.5 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Search System...</span>
                        <div className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px] border border-white/10 ml-4 font-black">⌘K</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative cursor-pointer group p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                             <Bell className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                             <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-slate-950 animate-pulse" />
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:border-brand-500 transition-all cursor-pointer group overflow-hidden">
                            <User className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </div>
                    </div>
                </div>
            </motion.header>

            <main className="max-w-7xl mx-auto px-6 pt-40 pb-24 relative z-10">
                {/* ── Hero Section ── */}
                <header className="mb-20 text-center space-y-6 max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-[9px] font-black text-brand-400 uppercase tracking-[0.3em] backdrop-blur-md"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                        NEURAL NODES OPERATIONAL
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] overflow-hidden"
                    >
                        PREDICTING <span className="gradient-text">STUDENT SUCCESS</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Leverage the power of Architectural Machine Learning to identify risk factors and secure educational outcomes.
                    </motion.p>
                </header>

                {/* ── Content Switcher ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    >
                        {activeTab === 'dashboard' && (
                            <div className="space-y-16">
                                <StatGrid stats={{ total: history.length + 1240, critical: 42, avgAttendance: '78%' }} />
                                <div className="panel-glass rounded-[3.5rem] p-2 shadow-2xl relative">
                                    <div className="absolute inset-0 bg-brand-500/5 blur-[120px] rounded-full -z-10" />
                                    <MainDashboard history={history} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'predict' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                                <div className="lg:col-span-12 xl:col-span-7">
                                    <PredictionHub onSubmit={handlePredict} loading={loading} />
                                </div>
                                <div className="lg:col-span-12 xl:col-span-5 space-y-10 lg:mt-4">
                                    {currentResult ? (
                                        <>
                                            <ResultGauge probability={currentResult.probability} riskLevel={currentResult.risk_level} />
                                            <AIExplanation result={currentResult} />
                                        </>
                                    ) : (
                                        <div className="panel-glass rounded-[3rem] p-16 text-center flex flex-col items-center justify-center min-h-[500px] border-dashed border-2 border-white/[0.05]">
                                            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center mb-8 text-slate-700 shadow-inner group">
                                                <Search className="w-10 h-10 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <h3 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-4">Establishing Link</h3>
                                            <p className="text-slate-500 text-xs max-w-[280px] leading-relaxed font-medium">Please finalize the behavioral diagnostic sequence in the Predictive Interface to visualize risk vectors.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'bulk' && (
                            <div className="max-w-4xl mx-auto">
                                <BulkUpload onResult={() => setActiveTab('dashboard')} />
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="space-y-12">
                                <div className="panel-glass rounded-[3.5rem] p-8">
                                     <MainDashboard history={history} />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Cyber Footer ── */}
            <footer className="max-w-7xl mx-auto px-10 py-16 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-brand-400">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                        <div className="text-[10px] font-black text-white uppercase tracking-[0.2em]">DROPOUT AI INFRASTRUCTURE</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Global Intelligence Layer</div>
                    </div>
                </div>
                
                <div className="flex gap-10 uppercase tracking-[0.3em] text-[9px] font-black text-slate-500">
                    <a href="#" className="hover:text-brand-400 transition-colors">Neural Docs</a>
                    <a href="#" className="hover:text-brand-400 transition-colors">API Status</a>
                    <a href="#" className="hover:text-brand-400 transition-colors">Governance</a>
                </div>
                
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none text-center md:text-right">
                    © 2026 ANALYTICAL PROTOCOL <br/>
                    <span className="text-brand-500/30">ALL RIGHTS RESERVED</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
