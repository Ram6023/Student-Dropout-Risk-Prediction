import { useState, useRef } from 'react';
import { predictDropoutCSV } from '../services/api';

export default function BulkUpload() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "text/csv") {
      setFile(selected);
      setError(null);
    } else {
      setError("Please select a valid CSV file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await predictDropoutCSV(file);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;
    const headers = Object.keys(results[0]).join(",");
    const rows = results.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dropout_predictions_${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 anim-up">
      <div className="card p-6 border-dashed border-2 border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-accent-500/10 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-zinc-200">Upload Student Data</h4>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
          CSV must include columns: <code className="text-accent-400">attendance</code>, <code className="text-accent-400">sem1_cgpa</code>, <code className="text-accent-400">sem2_cgpa</code>, <code className="text-accent-400">fee_paid</code>
        </p>
        
        <input 
          type="file" 
          accept=".csv" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        <button 
          onClick={() => fileInputRef.current.click()}
          className="mt-6 px-4 py-2 rounded-xl bg-zinc-800 text-[11px] font-bold text-zinc-300 hover:bg-zinc-700 transition-all active:scale-95"
        >
          {file ? file.name : "Select CSV File"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 text-center">
          {error}
        </div>
      )}

      {file && !results && (
        <button 
          onClick={handleUpload}
          disabled={isLoading}
          className="btn-primary w-full h-11 flex items-center justify-center gap-3"
        >
          {isLoading ? <div className="spinner-sm" /> : "Start Bulk Prediction"}
        </button>
      )}

      {results && (
        <div className="card-raised p-5 border-accent-500/20 bg-accent-500/5 anim-scale">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black text-accent-400 uppercase tracking-widest">Success</p>
              <h5 className="text-sm font-bold text-zinc-200">{results.length} Students Processed</h5>
            </div>
            <button 
              onClick={downloadResults}
              className="px-3 py-1.5 rounded-lg bg-accent-500 text-[10px] font-bold text-surface hover:bg-accent-400 transition-all flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download CSV
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            All predictions have been generated. Click the button above to download the annotated CSV with risk scores and recommendations.
          </p>
          <button 
            onClick={() => {setResults(null); setFile(null);}}
            className="mt-4 text-[10px] text-zinc-600 hover:text-zinc-400 font-bold uppercase tracking-widest"
          >
            Clear and reset
          </button>
        </div>
      )}
    </div>
  );
}
