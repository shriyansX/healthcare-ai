import { useState, useRef } from 'react';

export default function FileUpload({ onFilesAdded }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (incoming) => {
    const arr = Array.from(incoming).map(f => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + ' KB',
      status: 'Processed',
      chunks: Math.floor(Math.random() * 20) + 5,
    }));
    setFiles(prev => [...prev, ...arr]);
    onFilesAdded?.(arr);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? '#3b82f6' : '#1e293b'}`,
          borderRadius: '12px',
          padding: '2.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(59,130,246,0.05)' : '#0f172a',
          transition: 'all 0.2s',
        }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
        <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>Click or drop files here</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PDF, TXT, CSV — hospital records, reports, surveys</div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.csv" hidden onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#0f172a', borderRadius: '8px', padding: '0.65rem 1rem',
              border: '1px solid #1e293b',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>📄</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{f.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.size} · {f.chunks} chunks</div>
                </div>
              </div>
              <span style={{
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '999px',
                padding: '0.2rem 0.7rem',
                fontSize: '0.72rem',
                color: '#22c55e',
                fontWeight: 700,
              }}>✓ {f.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
