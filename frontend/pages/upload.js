import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import { useState } from 'react';

export default function UploadPage() {
  const [ingested, setIngested] = useState([
    { name: 'aiims_delhi.txt',    size: '12.3 KB', chunks: 18, status: 'Embedded' },
    { name: 'vidarbha_report.pdf', size: '84.1 KB', chunks: 43, status: 'Embedded' },
    { name: 'rajasthan_phcs.csv', size: '34.7 KB', chunks: 27, status: 'Embedded' },
  ]);

  const handleNew = (files) => {
    setIngested(prev => [...prev, ...files.map(f => ({ ...f, status: 'Processing' }))]);
  };

  return (
    <>
      <Head>
        <title>Upload — Healthcare AI</title>
        <meta name="description" content="Upload hospital documents for RAG indexing" />
      </Head>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '860px' }}>
        <h1 className="page-title">📁 Document Upload</h1>
        <p className="page-subtitle">Upload hospital reports, surveys, or text files — they'll be chunked and embedded into the RAG vector store</p>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Add Documents</h2>
          <FileUpload onFilesAdded={handleNew} />
        </div>

        {/* Already ingested */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h2 style={{ fontSize:'0.95rem', fontWeight:700 }}>📚 Vector Store ({ingested.length} documents)</h2>
            <span style={{ fontSize:'0.78rem', color:'#22c55e', fontWeight:600 }}>
              ✅ {ingested.reduce((a,d)=>a+d.chunks,0)} total chunks indexed
            </span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'0.75rem' }}>
            {ingested.map((doc, i) => (
              <div key={i} style={{ background:'#0f172a', borderRadius:'8px', padding:'0.85rem', border:'1px solid #1e293b' }}>
                <div style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1.4rem' }}>📄</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:'0.85rem', marginBottom:'0.2rem', wordBreak:'break-all' }}>{doc.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'#64748b' }}>{doc.size} · {doc.chunks} chunks</div>
                  </div>
                </div>
                <div style={{
                  marginTop:'0.6rem',
                  background: doc.status === 'Embedded' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                  border: `1px solid ${doc.status === 'Embedded' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
                  borderRadius:'6px', padding:'0.25rem 0.6rem',
                  fontSize:'0.72rem', fontWeight:700,
                  color: doc.status === 'Embedded' ? '#22c55e' : '#f59e0b',
                  display:'inline-block',
                }}>
                  {doc.status === 'Embedded' ? '✓' : '⏳'} {doc.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
