import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const EXT_COLOR = { pdf: '#f87171', txt: '#60a5fa', csv: '#4ade80', docx: '#c084fc' };

export default function UploadPage() {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try {
      const r = await fetch(`${API_BASE}/api/upload/`);
      if (!r.ok) throw new Error();
      setDocs(await r.json()); setErr('');
    } catch { setErr('Cannot reach backend.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onAdd = files => { setDocs(p => [...p, ...files.filter(f => !p.find(d => d.name === f.name))]); setTimeout(load, 800); };

  const del = async id => {
    setDeleting(id);
    try { await fetch(`${API_BASE}/api/upload/${id}`, { method: 'DELETE' }); await load(); }
    catch {} finally { setDeleting(null); }
  };

  const total = docs.reduce((a, d) => a + (d.chunks || 0), 0);

  return (
    <>
      <Head><title>Upload — HealthcareAI</title></Head>
      <div className="container" style={{ padding: '40px 24px 60px', maxWidth: 840 }}>

        <div className="fade">
          <h1 className="page-title">Upload</h1>
          <p className="page-sub">Add documents to the RAG vector store. Supports PDF, TXT, CSV, DOCX.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }} className="fade fade-1">
          {[
            { n: docs.length, label: 'Documents' },
            { n: total,       label: 'Chunks indexed' },
            { n: docs.filter(d => d.status === 'Embedded').length, label: 'Embedded' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.02em' }}>{loading ? '—' : s.n}</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Uploader */}
        <div className="card fade fade-2" style={{ marginBottom: 12 }}>
          {err && <div className="alert alert-err" style={{ marginBottom: 12 }}>{err}</div>}
          <FileUpload onFilesAdded={onAdd} />
        </div>

        {/* Document list */}
        <div className="card fade fade-3" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>Vector Store</span>
            <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }} onClick={load}>Refresh</button>
          </div>

          {loading ? (
            <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>
          ) : docs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>No documents yet</div>
          ) : (
            docs.map((doc, i) => {
              const ext = (doc.type || doc.name?.split('.').pop() || 'txt').toLowerCase();
              return (
                <div key={doc.id || i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 20px',
                  borderBottom: i < docs.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* ext badge */}
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                    color: EXT_COLOR[ext] || 'var(--t3)',
                    background: `${EXT_COLOR[ext] || '#52525b'}14`,
                    border: `1px solid ${EXT_COLOR[ext] || '#52525b'}28`,
                    borderRadius: 4, padding: '2px 6px', flexShrink: 0, letterSpacing: '0.04em',
                  }}>{ext}</span>

                  {/* Name */}
                  <span style={{ fontSize: 13, color: 'var(--t1)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.name}
                  </span>

                  {/* Meta */}
                  <span style={{ fontSize: 12, color: 'var(--t3)', flexShrink: 0 }}>
                    {doc.size_human || doc.size} · {doc.chunks} chunks
                  </span>

                  {/* Status */}
                  <span style={{
                    fontSize: 12, color: doc.status === 'Embedded' ? 'var(--green)' : 'var(--amber)',
                    fontWeight: 500, flexShrink: 0,
                  }}>
                    {doc.status === 'Embedded' ? '✓ Embedded' : '⏳ Processing'}
                  </span>

                  {/* Delete */}
                  {doc.id && (
                    <button onClick={() => del(doc.id)} disabled={deleting === doc.id}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 14, padding: '2px 4px', transition: 'color 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
                    >
                      {deleting === doc.id ? <div className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} /> : '×'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Steps */}
        <div style={{ marginTop: 24, display: 'flex', gap: 8 }} className="fade fade-4">
          {['Upload file', 'Chunk text', 'Embed vectors', 'Index in ChromaDB'].map((s, i, arr) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600, width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i+1}</span>
                <span style={{ fontSize: 12, color: 'var(--t2)' }}>{s}</span>
              </div>
              {i < arr.length - 1 && <span style={{ fontSize: 12, color: 'var(--t3)' }}>→</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
