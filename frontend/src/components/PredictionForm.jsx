import { useState } from 'react';

const INITIAL = { name: '', attendance: '', sem1_cgpa: '', sem2_cgpa: '', fee_paid: '' };

export default function PredictionForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState(INITIAL);

  const set = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Validation
  const warnings = {};
  if (form.attendance !== '' && parseFloat(form.attendance) > 100)
    warnings.attendance = 'Attendance cannot exceed 100%';
  if (form.attendance !== '' && parseFloat(form.attendance) < 0)
    warnings.attendance = 'Attendance cannot be negative';
  if (form.sem1_cgpa !== '' && parseFloat(form.sem1_cgpa) > 10)
    warnings.sem1_cgpa = 'CGPA cannot exceed 10';
  if (form.sem1_cgpa !== '' && parseFloat(form.sem1_cgpa) < 0)
    warnings.sem1_cgpa = 'CGPA cannot be negative';
  if (form.sem2_cgpa !== '' && parseFloat(form.sem2_cgpa) > 10)
    warnings.sem2_cgpa = 'CGPA cannot exceed 10';
  if (form.sem2_cgpa !== '' && parseFloat(form.sem2_cgpa) < 0)
    warnings.sem2_cgpa = 'CGPA cannot be negative';

  const hasWarnings = Object.keys(warnings).length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (hasWarnings) return;
    onSubmit({
      name: form.name || 'Anonymous',
      attendance: parseFloat(form.attendance),
      sem1_cgpa: parseFloat(form.sem1_cgpa),
      sem2_cgpa: parseFloat(form.sem2_cgpa),
      fee_paid: parseInt(form.fee_paid, 10),
    });
  };

  const filled = Object.values(form).filter((v) => v !== '').length;

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Section: Profile */}
      <div className="anim-up">
        <SectionLabel number="00" title="Student Profile" />
        <div className="card-raised p-4 mt-2">
          <Field label="Full Name" type="text" name="name" value={form.name} onChange={set} placeholder="e.g. John Doe" />
        </div>
      </div>

      {/* Section: Attendance */}
      <div className="anim-up d1">
        <SectionLabel number="01" title="Attendance" />
        <div className="card-raised p-4 mt-2">
          <Field label="Attendance Rate" unit="%" name="attendance" value={form.attendance} onChange={set} placeholder="75" step="0.1" warning={warnings.attendance} />
        </div>
      </div>

      {/* Section: Academic */}
      <div className="anim-up d2">
        <SectionLabel number="02" title="Academic Performance" />
        <div className="card-raised p-4 mt-2 grid grid-cols-2 gap-4">
          <Field label="Sem 1 CGPA" unit="/10" name="sem1_cgpa" value={form.sem1_cgpa} onChange={set} placeholder="7.5" step="0.01" warning={warnings.sem1_cgpa} />
          <Field label="Sem 2 CGPA" unit="/10" name="sem2_cgpa" value={form.sem2_cgpa} onChange={set} placeholder="8.2" step="0.01" warning={warnings.sem2_cgpa} />
        </div>
      </div>

      {/* Section: Fee */}
      <div className="anim-up d3">
        <SectionLabel number="03" title="Financial Status" />
        <div className="card-raised p-4 mt-2 grid grid-cols-2 gap-3">
          <FeeOption value="1" label="Paid" sublabel="Fees cleared" selected={form.fee_paid === '1'} onClick={() => setForm((p) => ({ ...p, fee_paid: '1' }))} positive />
          <FeeOption value="0" label="Unpaid" sublabel="Outstanding" selected={form.fee_paid === '0'} onClick={() => setForm((p) => ({ ...p, fee_paid: '0' }))} />
        </div>
      </div>

      {/* Submit */}
      <div className="anim-up d4 pt-1">
        <button
          type="submit"
          disabled={isLoading || filled < 4 || hasWarnings}
          className="w-full h-12 rounded-xl font-medium text-sm text-white transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
            backgroundSize: '200% 200%',
            animation: filled >= 4 ? 'gradientShift 3s ease infinite' : 'none',
            boxShadow: filled >= 4 ? '0 4px 24px rgba(16, 185, 129, 0.2)' : 'none',
          }}
        >
          {isLoading ? (
            <><div className="spinner !w-4 !h-4 !border-2 !border-white/20 !border-t-white" /><span>Analyzing…</span></>
          ) : (
            <><span>Predict Risk</span><span className="text-white/50">→</span></>
          )}
        </button>
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < filled ? 'bg-accent-400 scale-100' : 'bg-zinc-800 scale-75'}`} />
          ))}
        </div>
      </div>
    </form>
  );
}

/* ── Sub-components ── */

function SectionLabel({ number, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-accent-500/50 tabular-nums">{number}</span>
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
    </div>
  );
}

function Field({ label, unit, name, value, onChange, placeholder, step, warning, type = "number" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={name} className="text-[11px] font-medium text-zinc-500">{label}</label>
        {unit && <span className="text-[10px] text-zinc-700">{unit}</span>}
      </div>
      <input
        type={type} id={name} name={name} value={value}
        onChange={onChange} placeholder={placeholder} step={step}
        required className={`field-input ${warning ? '!border-amber-500/50 !shadow-amber-500/10' : ''}`}
      />
      {warning && (
        <div className="flex items-center gap-1.5 mt-1.5 anim-scale">
          <svg className="w-3 h-3 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-[10px] font-medium text-amber-400">{warning}</span>
        </div>
      )}
    </div>
  );
}

function FeeOption({ label, sublabel, selected, onClick, positive }) {
  const ring = selected
    ? positive
      ? 'border-accent-500/40 bg-accent-500/8'
      : 'border-rose-500/40 bg-rose-500/8'
    : 'border-border bg-transparent hover:border-zinc-700';

  const dot = selected
    ? positive ? 'bg-accent-400' : 'bg-rose-400'
    : 'bg-zinc-700';

  return (
    <button
      type="button" onClick={onClick}
      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${ring}`}
    >
      <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${dot}`} />
      <div className="text-left">
        <p className={`text-xs font-semibold ${selected ? 'text-zinc-200' : 'text-zinc-500'}`}>{label}</p>
        <p className="text-[10px] text-zinc-700">{sublabel}</p>
      </div>
    </button>
  );
}
