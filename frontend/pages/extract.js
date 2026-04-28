import Head from 'next/head';
import { useState } from 'react';
import { api } from '../lib/api';

const SAMPLES = [
  'Hospital has 20 doctors and MRI machine',
  'Rural clinic in Barmer, Rajasthan with 2 doctors, 4 nurses, X-ray only, serves 12000 people',
  'AIIMS-level: 320 doctors, 850 nurses, 1000 beds, ICU, Ventilator, NICU, MRI, CT scan, Blood Bank',
];

const STATUS_CFG = {
  Good:             { color: '#4ade80', label: 'Good Coverage' },
  Medium:           { color: '#fbbf24', label: 'Medium Coverage' },
  Critical:         { color: '#f87171', label: 'Critical Zone' },
  'Medical Desert': { color: '#f87171', label: 'Medical Desert' },
};

export default function ExtractPage() {
  const [text, setText]       = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const run = async (t = text) => {
    if (!t.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await api.extract(t)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const cfg = result ? (STATUS_CFG[result.status] || STATUS_CFG.Medium) : null;

  return (
    <>
      <Head><title>Extract — HealthcareAI</title></Head>
      <div className="container" style={{ padding: '40px 24px 60px', maxWidth: 840 }}>

        <div className="fade">
          <h1 className="page-title">AI Extraction</h1>
          <p className="page-sub">Parse free-form hospital descriptions into structured data using regex + NLP rules.</p>
        </div>

        {/* Input card */}
        <div className="card fade fade-1" style={{ marginBottom: 12 }}>
          <textarea
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.ctrlKey && e.key === 'Enter' && run()}
            placeholder="Describe a hospital in plain text…"
            style={{ marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={() => run()} disabled={loading || !text.trim()} id="extract-btn">
              {loading ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Extracting</> : 'Extract'}
            </button>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>or try a sample:</span>
            {SAMPLES.map((s, i) => (
              <button key={i} className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { setText(s); run(s); }}>
                Sample {i + 1}
              </button>
            ))}
            {text && (
              <button className="btn btn-ghost" style={{ fontSize: 12, marginLeft: 'auto' }} onClick={() => { setText(''); setResult(null); setError(''); }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-err fade" style={{ marginBottom: 12 }}>{error}</div>}

        {/* Result */}
        {result && cfg && (
          <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>— detected from text analysis</span>
            </div>

            {/* Field grid */}
            <div className="grid-3" style={{ gap: 8 }}>
              {[
                ['Doctors',   result.doctors],
                ['Nurses',    result.nurses],
                ['Beds',      result.beds],
                ['Ambulances',result.ambulances],
                ['Location',  result.location || '—'],
                ['Population',result.population_served?.toLocaleString() ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="card" style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--t1)' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Equipment */}
            {result.equipment?.length > 0 && (
              <div className="card" style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Equipment ({result.equipment.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.equipment.map(e => <span key={e} className="chip">{e}</span>)}
                </div>
              </div>
            )}

            {/* JSON */}
            <details>
              <summary style={{ fontSize: 12 }}>View raw JSON</summary>
              <pre className="code" style={{ marginTop: 8 }}>{JSON.stringify(result, null, 2)}</pre>
            </details>
          </div>
        )}

        {/* How it works */}
        {!result && (
          <div className="card fade fade-2" style={{ marginTop: 12 }}>
            <p className="section-label">How it works</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                ['Regex patterns', 'Extract numbers — doctors, nurses, beds, ambulances, population'],
                ['Equipment scan', 'Match 15+ keywords: MRI, CT scan, ICU, Ventilator, NICU…'],
                ['Status rules',   'doctors < 5 → Medical Desert | no ICU → Critical | else → Medium/Good'],
              ].map(([title, desc], i, arr) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '12px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--blue)', fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>0{i+1}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--t2)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
