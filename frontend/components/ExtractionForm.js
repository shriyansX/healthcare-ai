import { useState } from 'react';
import { api } from '../lib/api';

const SAMPLES = [
  'Hospital has 20 doctors and MRI machine',
  'Rural clinic in Barmer, Rajasthan with 2 doctors, 4 nurses, X-ray only, serves 12000 people',
  'AIIMS-level facility: 320 doctors, 850 nurses, 1000 beds, ICU, Ventilator, NICU, MRI, CT scan, Blood Bank',
];

const STATUS_CONFIG = {
  Good:             { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   icon: '🟢', label: 'Good Coverage' },
  Medium:           { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: '🟡', label: 'Medium Coverage' },
  Critical:         { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  icon: '⚠️', label: 'Critical Zone' },
  'Medical Desert': { color: '#dc2626', bg: 'rgba(220,38,38,0.1)',  border: 'rgba(220,38,38,0.25)',  icon: '🔴', label: 'Medical Desert' },
};

export default function ExtractionForm() {
  const [text, setText]     = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const runExtract = async (t = text) => {
    if (!t.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await api.extract(t);
      setResult(data);
    } catch (e) {
      setError('Analyzing offline — unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG.Medium) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Input */}
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>
          📝 Hospital Description (free-form text)
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.ctrlKey && runExtract()}
          placeholder="Describe a hospital in plain English…&#10;e.g. 'Rural clinic in Barmer with 2 doctors, X-ray only, serves 12000 people'"
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={() => runExtract()}
          disabled={loading || !text.trim()}
          id="extract-btn"
        >
          {loading ? (
            <><div className="spinner spinner-sm" /> Analyzing healthcare data…</>
          ) : (
            <>🤖 Extract with AI</>
          )}
        </button>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              className="btn btn-ghost"
              style={{ fontSize: '0.76rem', padding: '0.4rem 0.8rem' }}
              onClick={() => { setText(s); runExtract(s); }}
            >
              Sample {i + 1}
            </button>
          ))}
        </div>

        {text && (
          <button
            className="btn btn-ghost"
            style={{ fontSize: '0.76rem', padding: '0.4rem 0.7rem', marginLeft: 'auto', color: '#475569' }}
            onClick={() => { setText(''); setResult(null); setError(''); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '10px', padding: '0.9rem 1rem',
          color: '#fca5a5', fontSize: '0.85rem',
          display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <div>
            <strong>Extraction failed:</strong> {error}
          </div>
        </div>
      )}

      {/* Result */}
      {result && cfg && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeInUp 0.4s ease' }}>
          {/* Status banner */}
          <div style={{
            padding: '1rem 1.25rem', borderRadius: '12px',
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            display: 'flex', gap: '1rem', alignItems: 'center',
          }}>
            <span style={{ fontSize: '2rem' }}>{cfg.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: cfg.color }}>{cfg.label}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                Detection result based on doctor count and equipment rules
              </div>
            </div>
            {result.status === 'Medical Desert' && (
              <div style={{
                background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.4)',
                borderRadius: '8px', padding: '0.4rem 0.75rem',
                fontSize: '0.72rem', color: '#fca5a5', fontWeight: 700, textAlign: 'center',
              }}>
                🚨 Urgent<br/>Attention
              </div>
            )}
          </div>

          {/* Extracted fields grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {[
              { icon: '👨‍⚕️', label: 'Doctors',    value: result.doctors || 0 },
              { icon: '👩‍⚕️', label: 'Nurses',     value: result.nurses || 0 },
              { icon: '🛏',   label: 'Beds',        value: result.beds || 0 },
              { icon: '🚑',   label: 'Ambulances',  value: result.ambulances || 0 },
              { icon: '📍',   label: 'Location',    value: result.location || '—' },
              { icon: '👥',   label: 'Population',  value: result.population_served ? result.population_served.toLocaleString() : '—' },
            ].map(f => (
              <div key={f.label} style={{
                background: 'rgba(10,15,30,0.6)', borderRadius: '10px',
                padding: '0.75rem', border: '1px solid rgba(30,41,59,0.8)',
                display: 'flex', gap: '0.6rem', alignItems: 'center',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1 }}>{f.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.15rem' }}>{f.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Equipment */}
          {result.equipment?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
                🏥 Equipment Detected ({result.equipment.length} items)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.equipment.map(e => (
                  <span key={e} className="chip">{e}</span>
                ))}
              </div>
            </div>
          )}

          {/* JSON output */}
          <details>
            <summary>{'{ }'} View raw JSON output</summary>
            <pre className="code-block" style={{ marginTop: '0.5rem' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
