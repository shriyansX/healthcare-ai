import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FILE_ICONS = { pdf: '📕', txt: '📄', csv: '📊', docx: '📝' };
const TYPE_COLORS = {
  pdf:  { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   color: '#fca5a5' },
  txt:  { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)',  color: '#93c5fd' },
  csv:  { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   color: '#86efac' },
  docx: { bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)', color: '#c4b5fd' },
};

export default function UploadPage() {
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchDocs = async () => {
    try {
      const [docsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/upload/`),
        fetch(`${API_BASE}/api/upload/stats`),
      ]);
      if (!docsRes.ok) throw new Error('Failed to load documents');
      const docsData = await docsRes.json();
      const statsData = statsRes.ok ? await statsRes.json() : null;
      setDocs(docsData);
      setStats(statsData);
      setError('');
    } catch (e) {
      setError('Could not reach the API. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleNewFiles = (files) => {
    // Add files that come from the uploader optimistically; then refresh
    setDocs(prev => {
      const newOnes = files.filter(f => !prev.find(d => d.name === f.name));
      return [...prev, ...newOnes];
    });
    setTimeout(fetchDocs, 800);
  };

  const handleDelete = async (docId) => {
    setDeleting(docId);
    try {
      await fetch(`${API_BASE}/api/upload/${docId}`, { method: 'DELETE' });
      await fetchDocs();
    } catch {
      // silently ignore
    } finally {
      setDeleting(null);
    }
  };

  const totalChunks = docs.reduce((a, d) => a + (d.chunks || 0), 0);

  return (
    <>
      <Head>
        <title>Upload — Healthcare AI</title>
        <meta name="description" content="Upload hospital documents for RAG indexing and vector embedding" />
      </Head>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '900px' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">📁 Document Upload</h1>
          <p className="page-subtitle">
            Upload hospital reports, surveys, or data files — they'll be chunked and embedded into the RAG vector store for semantic search
          </p>
        </div>

        {/* Stats strip */}
        <div className="fade-in fade-in-delay-1" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem',
        }}>
          {[
            { icon: '📚', label: 'Documents', value: loading ? '…' : docs.length, color: '#60a5fa' },
            { icon: '🧩', label: 'Total Chunks', value: loading ? '…' : totalChunks.toLocaleString(), color: '#5eead4' },
            { icon: '✅', label: 'Embedded', value: loading ? '…' : docs.filter(d => d.status === 'Embedded').length, color: '#86efac' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(30,41,59,0.8)',
              borderRadius: '12px', padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div className="card fade-in fade-in-delay-2" style={{ marginBottom: '1.5rem' }}>
          <div className="section-title">📤 Add Documents</div>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px', padding: '0.85rem 1rem',
              fontSize: '0.85rem', color: '#fca5a5', marginBottom: '1rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              ⚠️ {error}
            </div>
          )}
          <FileUpload onFilesAdded={handleNewFiles} />
        </div>

        {/* Vector store */}
        <div className="card fade-in fade-in-delay-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              🗃️ Vector Store
              <span style={{
                marginLeft: '0.5rem', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                borderRadius: '999px', padding: '0.15rem 0.6rem',
                fontSize: '0.72rem', color: '#60a5fa', fontWeight: 700,
              }}>{docs.length} docs</span>
            </div>
            <button
              onClick={fetchDocs}
              className="btn btn-ghost"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : docs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
              <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>No documents yet</div>
              <div style={{ fontSize: '0.82rem' }}>Upload your first file above to get started</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '0.75rem' }}>
              {docs.map((doc, i) => {
                const ext = doc.type || doc.name?.split('.').pop()?.toLowerCase() || 'txt';
                const icon = FILE_ICONS[ext] || '📄';
                const typeStyle = TYPE_COLORS[ext] || TYPE_COLORS.txt;
                return (
                  <div key={doc.id || i} style={{
                    background: 'rgba(10,15,30,0.6)',
                    border: '1px solid rgba(30,41,59,0.9)',
                    borderRadius: '12px', padding: '1rem',
                    transition: 'all 0.2s', position: 'relative',
                    animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(51,65,85,0.7)'; e.currentTarget.style.background='rgba(15,23,42,0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(30,41,59,0.9)'; e.currentTarget.style.background='rgba(10,15,30,0.6)'; }}
                  >
                    <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
                      <span style={{ fontSize: '1.6rem', flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.15rem', wordBreak: 'break-all', lineHeight: 1.3 }}>
                          {doc.name}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                          {doc.size_human || doc.size} · {doc.chunks} chunks
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <span style={{
                          background: typeStyle.bg, border: `1px solid ${typeStyle.border}`,
                          color: typeStyle.color,
                          borderRadius: '5px', padding: '0.18rem 0.5rem',
                          fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                        }}>{ext}</span>
                        <span style={{
                          background: doc.status === 'Embedded' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                          border: `1px solid ${doc.status === 'Embedded' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
                          borderRadius: '5px', padding: '0.18rem 0.5rem',
                          fontSize: '0.68rem', fontWeight: 700,
                          color: doc.status === 'Embedded' ? '#22c55e' : '#f59e0b',
                        }}>
                          {doc.status === 'Embedded' ? '✓' : '⏳'} {doc.status}
                        </span>
                      </div>

                      {doc.id && (
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleting === doc.id}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#475569', fontSize: '1rem', padding: '0.2rem',
                            lineHeight: 1, transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color='#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color='#475569'}
                          title="Remove from store"
                        >
                          {deleting === doc.id ? '⏳' : '🗑'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="card fade-in fade-in-delay-4" style={{ marginTop: '1.5rem' }}>
          <div className="section-title">⚙️ How RAG Ingestion Works</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { step: '1', icon: '📤', title: 'Upload File', desc: 'PDF, TXT, CSV accepted and stored' },
              { step: '2', icon: '✂️', title: 'Chunking',   desc: 'Split into ~500 char semantic chunks' },
              { step: '3', icon: '🧠', title: 'Embedding',  desc: 'Each chunk vectorized via embeddings' },
              { step: '4', icon: '🗄️', title: 'IndexStore', desc: 'Vectors stored in ChromaDB for retrieval' },
            ].map(s => (
              <div key={s.step} style={{
                background: 'rgba(10,15,30,0.5)', borderRadius: '10px',
                padding: '1rem', border: '1px solid rgba(30,41,59,0.7)',
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem' }}>{s.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
