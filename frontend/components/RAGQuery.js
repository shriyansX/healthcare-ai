import { useState } from 'react';
import { api } from '../lib/api';

const SAMPLES = [
  'Which hospitals qualify as medical deserts in India?',
  'What equipment does AIIMS Delhi have?',
  'How many doctors serve Vidarbha region?',
];

export default function RAGQuery() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runQuery = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await api.queryRAG(q);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Query input */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runQuery()}
          placeholder="Ask a question about hospital data..."
        />
        <button className="btn btn-teal" onClick={() => runQuery()} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
          {loading ? '⏳' : '🔍'} Search
        </button>
      </div>

      {/* Sample queries */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {SAMPLES.map((s, i) => (
          <button key={i} className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '0.35rem 0.85rem' }}
            onClick={() => { setQuery(s); runQuery(s); }}>
            {s}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <div className="spinner" />}

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#14b8a6', fontWeight: 700, marginBottom: '0.5rem' }}>🤖 AI Answer</div>
            <p style={{ lineHeight: 1.7, color: '#e2e8f0' }}>{result.answer}</p>
          </div>

          {result.sources?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
                Sources ({result.sources.length} / {result.total_documents_searched} searched)
              </div>
              {result.sources.map((s, i) => (
                <div key={i} style={{
                  background: '#0f172a', borderRadius: '8px', padding: '0.75rem 1rem',
                  marginBottom: '0.5rem', border: '1px solid #1e293b',
                  display: 'flex', gap: '1rem',
                }}>
                  <span style={{
                    background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                    borderRadius: '6px', padding: '0.2rem 0.5rem',
                    fontSize: '0.75rem', fontWeight: 700, alignSelf: 'flex-start',
                  }}>{(s.score * 100).toFixed(0)}%</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>📄 {s.source}</div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{s.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
