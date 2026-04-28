import Head from 'next/head';
import RAGQuery from '../components/RAGQuery';

const STEPS = [
  { n: '1', label: 'Query received',    desc: 'Natural language question submitted by user', color: '#3b82f6' },
  { n: '2', label: 'Embedding created', desc: 'Query vectorized using embedding model', color: '#8b5cf6' },
  { n: '3', label: 'Cosine similarity', desc: 'ChromaDB finds closest document vectors', color: '#ec4899' },
  { n: '4', label: 'Top-K retrieved',   desc: 'LlamaIndex returns most relevant chunks', color: '#f59e0b' },
  { n: '5', label: 'LLM synthesis',     desc: 'GPT-4o-mini generates a grounded answer', color: '#22c55e' },
];

export default function RAGPage() {
  return (
    <>
      <Head>
        <title>RAG Engine — Healthcare AI</title>
        <meta name="description" content="Query hospital knowledge base using Retrieval-Augmented Generation" />
      </Head>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '960px' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">🔍 RAG Engine</h1>
          <p className="page-subtitle">
            Ask questions about any hospital using LlamaIndex + ChromaDB vector search
          </p>
        </div>

        {/* Query interface */}
        <div className="card fade-in fade-in-delay-1" style={{ marginBottom: '1.5rem' }}>
          <div className="section-title">💬 Ask the Knowledge Base</div>
          <RAGQuery />
        </div>

        {/* Architecture pipeline */}
        <div className="card fade-in fade-in-delay-2">
          <div className="section-title">🏗️ RAG Pipeline Architecture</div>
          <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.5rem', gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ textAlign: 'center', flex: 1, minWidth: '110px', padding: '0 0.25rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', margin: '0 auto 0.6rem',
                    background: `${s.color}20`,
                    border: `2px solid ${s.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '1rem', color: s.color,
                    boxShadow: `0 0 16px ${s.color}20`,
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 0 24px ${s.color}40`; e.currentTarget.style.transform='scale(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 0 16px ${s.color}20`; e.currentTarget.style.transform='scale(1)'; }}
                  >{s.n}</div>
                  <div style={{ fontSize: '0.77rem', fontWeight: 700, marginBottom: '0.25rem', color: '#f1f5f9' }}>{s.label}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ color: '#334155', fontSize: '1.4rem', padding: '0 0.1rem', flexShrink: 0, marginBottom: '1.8rem' }}>→</div>
                )}
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(30,41,59,0.8)' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tech Stack
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {[
                { label: 'LlamaIndex', color: 'blue' },
                { label: 'ChromaDB', color: 'teal' },
                { label: 'OpenAI Embeddings', color: 'blue' },
                { label: 'GPT-4o-mini', color: 'teal' },
                { label: 'FastAPI', color: 'blue' },
                { label: 'Next.js', color: 'teal' },
              ].map(t => (
                <span key={t.label} className={`chip chip-${t.color}`}>{t.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
