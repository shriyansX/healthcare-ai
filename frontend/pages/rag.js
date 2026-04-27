import Head from 'next/head';
import RAGQuery from '../components/RAGQuery';

const STEPS = [
  { n: '1', label: 'Query received',       desc: 'User submits natural language question' },
  { n: '2', label: 'Embedding created',    desc: 'OpenAI text-embedding-3-small vectorizes query' },
  { n: '3', label: 'Cosine similarity',     desc: 'ChromaDB finds closest document vectors' },
  { n: '4', label: 'Top-K retrieved',       desc: 'LlamaIndex returns most relevant chunks' },
  { n: '5', label: 'LLM synthesis',         desc: 'GPT-4o-mini generates a grounded answer' },
];

export default function RAGPage() {
  return (
    <>
      <Head>
        <title>RAG Engine — Healthcare AI</title>
        <meta name="description" content="Query hospital knowledge base using Retrieval-Augmented Generation" />
      </Head>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '900px' }}>
        <h1 className="page-title">🔍 RAG Engine</h1>
        <p className="page-subtitle">Ask questions about any hospital using LlamaIndex + ChromaDB vector search</p>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <RAGQuery />
        </div>

        {/* Architecture */}
        <div className="card">
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>🏗 RAG Architecture (Step 7)</h2>
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display:'flex', alignItems:'center', flex:1 }}>
                <div style={{ textAlign:'center', flex:1, minWidth:'120px' }}>
                  <div style={{
                    width:40, height:40, borderRadius:'50%', margin:'0 auto 0.5rem',
                    background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:800, fontSize:'1rem', color:'#a78bfa',
                  }}>{s.n}</div>
                  <div style={{ fontSize:'0.78rem', fontWeight:700, marginBottom:'0.2rem' }}>{s.label}</div>
                  <div style={{ fontSize:'0.72rem', color:'#64748b' }}>{s.desc}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ color:'#3b82f6', fontSize:'1.2rem', padding:'0 0.25rem', flexShrink:0 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
