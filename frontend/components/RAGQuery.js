import { useState } from 'react';
import { api } from '../lib/api';

const SAMPLES = [
  'Which hospitals qualify as medical deserts in India?',
  'What equipment does AIIMS Delhi have?',
  'How many doctors serve Vidarbha region?',
  'Which hospitals have ICU and ventilator facilities?',
];

export default function RAGQuery() {
  const [query, setQuery]   = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

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
      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>
          💬 Your Question
        </label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runQuery()}
            placeholder="Ask anything about hospital data…"
            id="rag-query-input"
          />
          <button
            className="btn btn-teal"
            onClick={() => runQuery()}
            disabled={loading || !query.trim()}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {loading ? <><div className="spinner spinner-sm" /> Searching…</> : <>🔍 Search</>}
          </button>
        </div>
      </div>

      {/* Sample queries */}
      <div>
        <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Try a sample query:
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {SAMPLES.map((s, i) => (
            <button
              key={i}
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.8rem', textAlign: 'left' }}
              onClick={() => { setQuery(s); runQuery(s); }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '10px', padding: '0.9rem 1rem',
          color: '#fca5a5', fontSize: '0.85rem',
          display: 'flex', gap: '0.6rem',
        }}>
          <span>⚠️</span>
          <div>
            <strong>Query failed:</strong> {error}
            <div style={{ fontSize: '0.78rem', marginTop: '0.25rem', opacity: 0.7 }}>
              Ensure the backend is running.
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeInUp 0.4s ease' }}>
          {/* Answer box */}
          <div style={{
            background: 'rgba(20,184,166,0.06)',
            border: '1px solid rgba(20,184,166,0.2)',
            borderRadius: '12px', padding: '1.25rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, #14b8a6, #3b82f6)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '8px',
                background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem',
              }}>🤖</div>
              <span style={{ fontSize: '0.78rem', color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Answer
              </span>
              <span style={{ fontSize: '0.72rem', color: '#475569', marginLeft: 'auto' }}>
                {result.total_documents_searched} docs searched
              </span>
            </div>
            <p style={{ lineHeight: 1.75, color: '#e2e8f0', fontSize: '0.92rem' }}>
              {result.answer}
            </p>
          </div>

          {/* Sources */}
          {result.sources?.length > 0 && (
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.6rem', fontWeight: 600 }}>
                📚 Retrieved Sources ({result.sources.length} of {result.total_documents_searched} searched)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {result.sources.map((s, i) => (
                  <div key={i} style={{
                    background: 'rgba(10,15,30,0.6)',
                    borderRadius: '10px', padding: '0.85rem 1rem',
                    border: '1px solid rgba(30,41,59,0.8)',
                    display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                    transition: 'border-color 0.2s',
                    animation: `fadeInUp 0.3s ease ${i * 0.07}s both`,
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(139,92,246,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='rgba(30,41,59,0.8)'}
                  >
                    <div style={{
                      background: 'rgba(139,92,246,0.12)', color: '#a78bfa',
                      borderRadius: '8px', padding: '0.3rem 0.6rem',
                      fontSize: '0.75rem', fontWeight: 800, alignSelf: 'flex-start', flexShrink: 0,
                      border: '1px solid rgba(139,92,246,0.25)',
                    }}>
                      {(s.score * 100).toFixed(0)}%
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.73rem', color: '#64748b', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>📄</span> {s.source}
                      </div>
                      <div style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.5 }}>{s.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
