import { useState } from 'react';
import { api } from '../lib/api';

const SAMPLES = [
  'Hospital has 20 doctors and MRI machine',
  'Rural clinic in Barmer, Rajasthan with 2 doctors, 4 nurses, X-ray only, serves 12000 people',
  'AIIMS-level facility: 320 doctors, 850 nurses, 1000 beds, ICU, Ventilator, NICU, MRI, CT scan, Blood Bank',
];

export default function ExtractionForm() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const STATUS_COLORS = {
    Good: '#22c55e', Medium: '#f59e0b', Critical: '#ef4444', 'Medical Desert': '#dc2626',
  };

  const runExtract = async (t = text) => {
    if (!t.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await api.extract(t);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <textarea
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter messy hospital description..."
      />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => runExtract()} disabled={loading}>
          {loading ? '⏳ Processing...' : '🤖 Extract with AI'}
        </button>
        {SAMPLES.map((s, i) => (
          <button key={i} className="btn btn-ghost" style={{ fontSize: '0.78rem' }}
            onClick={() => { setText(s); runExtract(s); }}>
            Sample {i + 1}
          </button>
        ))}
      </div>

      {loading && <div className="spinner" />}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status banner */}
          <div style={{
            padding: '1rem 1.25rem', borderRadius: '10px',
            background: `${STATUS_COLORS[result.status]}18`,
            border: `1px solid ${STATUS_COLORS[result.status]}44`,
            display: 'flex', gap: '1rem', alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.5rem' }}>
              {result.status === 'Good' ? '🟢' : result.status === 'Medium' ? '🟡' : '🔴'}
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: STATUS_COLORS[result.status] }}>
                {result.status}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Detection result based on Step 8 rules</div>
            </div>
          </div>

          {/* Extracted fields */}
          <div className="grid-3" style={{ gap: '0.75rem' }}>
            {[
              { icon: '👨‍⚕️', label: 'Doctors',    value: result.doctors },
              { icon: '👩‍⚕️', label: 'Nurses',     value: result.nurses },
              { icon: '🛏',   label: 'Beds',        value: result.beds },
              { icon: '🚑',   label: 'Ambulances',  value: result.ambulances },
              { icon: '📍',   label: 'Location',    value: result.location || '—' },
              { icon: '👥',   label: 'Population',  value: result.population_served?.toLocaleString() ?? '—' },
            ].map(f => (
              <div key={f.label} style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{f.icon}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{f.label}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{f.value}</div>
              </div>
            ))}
          </div>

          {/* Equipment */}
          {result.equipment?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem' }}>🏥 Equipment Detected</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.equipment.map(e => (
                  <span key={e} style={{
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: '6px', padding: '0.25rem 0.7rem',
                    fontSize: '0.8rem', color: '#93c5fd',
                  }}>{e}</span>
                ))}
              </div>
            </div>
          )}

          {/* JSON output */}
          <details>
            <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              {'{ }'} View raw JSON output
            </summary>
            <pre style={{
              background: '#0f172a', borderRadius: '8px', padding: '1rem',
              fontSize: '0.8rem', color: '#a5f3fc', overflowX: 'auto',
              border: '1px solid #1e293b',
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
