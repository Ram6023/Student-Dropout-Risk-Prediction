import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';

interface MainDashboardProps {
  history?: any[];
}

const MainDashboard: React.FC<MainDashboardProps> = ({ history }) => {
  // Enhanced mock data for trends
  const lineData = [
    { name: 'W1', value: 40 }, { name: 'W2', value: 30 }, { name: 'W3', value: 45 },
    { name: 'W4', value: 35 }, { name: 'W5', value: 55 }, { name: 'W6', value: 40 },
  ];

  const pieData = [
    { name: 'Dropout', value: 32 },
    { name: 'Graduate', value: 48 },
    { name: 'Enrolled', value: 20 },
  ];

  const barData = [
    { label: 'Att.', value: 85 },
    { label: 'Sem1', value: 72 },
    { label: 'Sem2', value: 68 },
    { label: 'Fin.', value: 90 },
  ];

  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Attendance Trends (Area) ── */}
      <ChartCard title="System Utilization / Trends" span="col-span-12 lg:col-span-8">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={lineData}>
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /> */}
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#8b5cf6', strokeWidth: 1}} />
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorVal)" 
                animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Dropout Distribution (Pie) ── */}
      <ChartCard title="Outcome Entropy" span="col-span-12 lg:col-span-4">
        <div className="h-[250px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                >
                    {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-black text-white">32%</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Avg Risk</span>
            </div>
        </div>
      </ChartCard>

      {/* ── Feature Importance (Bar) ── */}
      <ChartCard title="Factor Influence Weight" span="col-span-12 lg:col-span-5">
         <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" stroke="#fff" fontSize={10} width={40} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500}>
                    {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 80 ? '#10b981' : '#8b5cf6'} fillOpacity={0.8} />
                    ))}
                </Bar>
            </BarChart>
         </ResponsiveContainer>
      </ChartCard>

      {/* ── Semester Averages (Line) ── */}
      <ChartCard title="Academic Trajectory" span="col-span-12 lg:col-span-7">
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
                {/* <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /> */}
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#8b5cf6' }} 
                    animationDuration={2000}
                />
            </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    span: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, span }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`${span} panel-glass rounded-[2.5rem] p-8 border border-white/5 relative group h-full`}
    >
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{title}</h3>
            <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-800" />)}
            </div>
        </div>
        {children}
    </motion.div>
);

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="panel-glass px-4 py-2 rounded-xl border border-brand-500/30 shadow-2xl backdrop-blur-md">
          <p className="font-black text-white text-[11px] mb-0.5">{payload[0].payload.name || payload[0].payload.label}</p>
          <p className="text-brand-400 font-bold text-[10px]">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
};

export default MainDashboard;
