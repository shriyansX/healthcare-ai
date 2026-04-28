import { useState, useRef, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function humanSize(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b/1024).toFixed(1)} KB`;
  return `${(b/1048576).toFixed(2)} MB`;
}

export default function FileUpload({ onFilesAdded }) {
  const [dragging, setDragging]   = useState(false);
  const [queue, setQueue]         = useState([]);
  const inputRef = useRef(null);

  const upload = async (file) => {
    const id = Math.random().toString(36).slice(2);
    setQueue(p => [...p, { id, name: file.name, size: file.size, status: 'uploading', result: null, error: null }]);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/api/upload/`, { method: 'POST', body: form });
      if (!res.ok) { const t = await res.text(); throw new Error(t); }
      const data = await res.json();
      setQueue(p => p.map(e => e.id === id ? { ...e, status: 'done', result: data } : e));
      onFilesAdded?.([{ name: data.name, size: data.size_human, chunks: data.chunks, status: data.status, id: data.id, type: data.type }]);
    } catch (err) {
      setQueue(p => p.map(e => e.id === id ? { ...e, status: 'error', error: err.message } : e));
    }
  };

  const handleFiles = useCallback(files => {
    const valid = Array.from(files).filter(f => /\.(pdf|txt|csv|docx)$/i.test(f.name));
    valid.forEach(upload);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `1px dashed ${dragging ? 'var(--blue)' : 'var(--border-md)'}`,
          borderRadius: 'var(--radius)',
          padding: '32px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'var(--blue-dim)' : 'var(--bg)',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: dragging ? 'var(--blue)' : 'var(--t2)', marginBottom: 4 }}>
          {dragging ? 'Drop files here' : 'Click to browse or drag & drop'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)' }}>PDF, TXT, CSV, DOCX</div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.csv,.docx" hidden onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {queue.map(e => (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px',
              background: 'var(--bg-1)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', fontSize: 12,
              animation: 'fadeUp 0.2s ease',
            }}>
              <span style={{ flex: 1, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
              <span style={{ color: 'var(--t3)', flexShrink: 0 }}>{humanSize(e.size)}</span>
              {e.status === 'uploading' && <div className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, flexShrink: 0 }} />}
              {e.status === 'done'      && <span style={{ color: 'var(--green)', fontWeight: 500, flexShrink: 0 }}>✓ {e.result?.chunks} chunks</span>}
              {e.status === 'error'     && <span style={{ color: 'var(--red)', flexShrink: 0 }} title={e.error}>✗ Failed</span>}
              <button onClick={() => setQueue(p => p.filter(x => x.id !== e.id))}
                style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 14, padding: 0, flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
