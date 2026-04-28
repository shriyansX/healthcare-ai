import { useState, useRef, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FILE_ICONS = { pdf: '📕', txt: '📄', csv: '📊', docx: '📝' };
const ALLOWED = ['application/pdf', 'text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileUpload({ onFilesAdded }) {
  const [dragging, setDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]); // { file, status, progress, result, error }
  const inputRef = useRef(null);

  const uploadFile = async (fileObj) => {
    const id = Math.random().toString(36).slice(2);
    const entry = { id, file: fileObj, status: 'uploading', progress: 0, result: null, error: null };

    setUploadQueue(prev => [...prev, entry]);

    try {
      const form = new FormData();
      form.append('file', fileObj);

      const res = await fetch(`${API_BASE}/api/upload/`, {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `Upload failed (${res.status})`);
      }

      const data = await res.json();

      setUploadQueue(prev =>
        prev.map(e => e.id === id ? { ...e, status: 'done', result: data } : e)
      );

      onFilesAdded?.([{
        name: data.name,
        size: data.size_human,
        chunks: data.chunks,
        status: data.status,
        id: data.id,
        type: data.type,
      }]);
    } catch (err) {
      setUploadQueue(prev =>
        prev.map(e => e.id === id ? { ...e, status: 'error', error: err.message } : e)
      );
    }
  };

  const handleFiles = useCallback((incoming) => {
    const arr = Array.from(incoming);
    const valid = arr.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      return ['pdf', 'txt', 'csv', 'docx'].includes(ext);
    });
    if (valid.length === 0) return;
    valid.forEach(f => uploadFile(f));
  }, []);

  const onDrop = e => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeEntry = id => setUploadQueue(prev => prev.filter(e => e.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragEnter={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={e => { setDragging(false); }}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? '#3b82f6' : 'rgba(30,41,59,0.9)'}`,
          borderRadius: '14px',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging
            ? 'rgba(59,130,246,0.07)'
            : 'rgba(10,15,30,0.5)',
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow effect when dragging */}
        {dragging && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}

        <div style={{
          fontSize: '3rem', marginBottom: '0.75rem',
          filter: dragging ? 'drop-shadow(0 0 12px rgba(59,130,246,0.5))' : 'none',
          transition: 'filter 0.25s',
        }}>
          {dragging ? '🎯' : '📂'}
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', color: dragging ? '#60a5fa' : '#f1f5f9' }}>
          {dragging ? 'Drop to upload' : 'Drag & drop files here'}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
          PDF, TXT, CSV, DOCX — hospital records, reports, surveys
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
          borderRadius: '8px', padding: '0.5rem 1.1rem',
          fontSize: '0.82rem', fontWeight: 600, color: '#60a5fa',
          transition: 'all 0.2s',
        }}>
          📎 Browse Files
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.csv,.docx"
          hidden
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Upload queue */}
      {uploadQueue.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Uploads
          </div>
          {uploadQueue.map(entry => {
            const ext = entry.file.name.split('.').pop().toLowerCase();
            const icon = FILE_ICONS[ext] || '📄';
            return (
              <div key={entry.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(10,15,30,0.7)',
                border: `1px solid ${
                  entry.status === 'done' ? 'rgba(34,197,94,0.2)' :
                  entry.status === 'error' ? 'rgba(239,68,68,0.2)' :
                  'rgba(30,41,59,0.8)'
                }`,
                borderRadius: '10px', padding: '0.75rem 1rem',
                transition: 'all 0.2s',
                animation: 'fadeInUp 0.3s ease',
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.87rem', marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.file.name}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                      {humanSize(entry.file.size)}
                      {entry.status === 'done' && entry.result && (
                        <> · <span style={{ color: '#22c55e' }}>{entry.result.chunks} chunks indexed</span></>
                      )}
                      {entry.status === 'error' && (
                        <> · <span style={{ color: '#fca5a5' }}>{entry.error}</span></>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                  {entry.status === 'uploading' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600,
                    }}>
                      <div className="spinner spinner-sm" />
                      Embedding…
                    </div>
                  )}
                  {entry.status === 'done' && (
                    <span style={{
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: '999px', padding: '0.22rem 0.7rem',
                      fontSize: '0.72rem', color: '#22c55e', fontWeight: 700,
                    }}>✓ Embedded</span>
                  )}
                  {entry.status === 'error' && (
                    <span style={{
                      background: 'rgba(239,68,68,0.12)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '999px', padding: '0.22rem 0.7rem',
                      fontSize: '0.72rem', color: '#fca5a5', fontWeight: 700,
                    }}>✗ Failed</span>
                  )}
                  <button
                    onClick={() => removeEntry(entry.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '1rem', padding: '0.15rem', lineHeight: 1 }}
                    title="Remove"
                  >×</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
