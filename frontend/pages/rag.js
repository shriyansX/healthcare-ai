import Head from 'next/head';
import { useState } from 'react';
import { api } from '../lib/api';

const SAMPLES = [
  'Which hospitals qualify as medical deserts in India?',
  'What equipment does AIIMS Delhi have?',
  'How many doctors serve Vidarbha region?',
  'Which hospitals have ICU and ventilator facilities?',
];

const PIPELINE = [
  ['Embed query',    'Text → vector via embedding model'],
  ['Search index',   'Cosine similarity in ChromaDB'],
  ['Retrieve top-k', 'Ranked relevant document chunks'],
  ['Synthesize',     'LLM generates grounded answer'],
];

export default function RAGPage() {
  const [query, setQuery]     = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const run = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await api.queryRAG(q)); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Head><title>RAG Engine — HealthcareAI</title></Head>
      <div className="container" style={{ padding: '40px 24px 60px', maxWidth: 860 }}>

        <div className="fade">
          <h1 className="page-title">RAG Engine</h1>
          <p className="page-sub">Query the hospital knowledge base using LlamaIndex + ChromaDB semantic search.</p>
        </div>

        {/* Query input */}
        <div className="card fade fade-1" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              placeholder="Ask about hospital data…"
              id="rag-input"
            />
            <button className="btn btn-primary" onClick={() => run()} disabled={loading || !query.trim()} style={{ flexShrink: 0 }}>
              {loading ? <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'Search'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SAMPLES.map((s, i) => (
              <button key={i} className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => { setQuery(s); run(s); }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-err fade" style={{ marginBottom: 12 }}>{error}</div>}

        {/* Result */}
        {result && (
          <div className="fade" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Answer */}
            <div className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Answer</span>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>· {result.total_documents_searched} docs searched</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--t1)', lineHeight: 1.7 }}>{result.answer}</p>
            </div>

            {/* Sources */}
            {result.sources?.length > 0 && (
              <div>
                <p className="section-label">Sources</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.sources.map((s, i) => (
                    <div key={i} className="card" style={{
                      padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
                      animation: `fadeUp 0.2s ease ${i * 0.05}s both`,
                    }}>
                      <span style={{
                        fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--blue)',
                        background: 'var(--blue-dim)', border: '1px solid var(--blue-border)',
                        borderRadius: 4, padding: '2px 6px', flexShrink: 0, whiteSpace: 'nowrap',
                      }}>{(s.score * 100).toFixed(0)}%</span>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 4 }}>{s.source}</div>
                        <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>{s.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pipeline info */}
        {!result && (
          <div className="card fade fade-2">
            <p className="section-label">Pipeline</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
              {PIPELINE.map(([step, desc], i, arr) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ padding: '8px 12px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 6, minWidth: 140 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{step}</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{desc}</div>
                  </div>
                  {i < arr.length - 1 && <span style={{ fontSize: 12, color: 'var(--t3)', flexShrink: 0 }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
