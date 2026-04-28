import Head from 'next/head';
import { useState, useCallback, useRef } from 'react';
import { api } from '../lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const ALLOWED  = ['.pdf','.txt','.csv','.docx'];
const EXT_INFO = {
  pdf:  { color:'#f87171', label:'PDF' },
  txt:  { color:'#60a5fa', label:'TXT' },
  csv:  { color:'#4ade80', label:'CSV' },
  docx: { color:'#c084fc', label:'DOCX' },
};

const SAMPLES = [
  'Hospital has 20 doctors and MRI machine',
  'Rural clinic in Barmer, Rajasthan with 2 doctors, 4 nurses, X-ray only, serves 12000 people',
  'AIIMS-level: 320 doctors, 850 nurses, 1000 beds, ICU, Ventilator, NICU, MRI, CT scan, Blood Bank',
];

const STATUS_CFG = {
  Good:             { color:'#10b981', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.22)', label:'Good Coverage'   },
  Medium:           { color:'#f59e0b', bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.22)', label:'Medium Coverage' },
  Critical:         { color:'#ef4444', bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.22)',  label:'Critical Zone'   },
  'Medical Desert': { color:'#dc2626', bg:'rgba(220,38,38,0.08)',   border:'rgba(220,38,38,0.22)',  label:'Medical Desert'  },
};

const RAG_SAMPLES = [
  'Which hospitals qualify as medical deserts in India?',
  'What equipment does AIIMS Delhi have?',
  'How many doctors serve Vidarbha region?',
  'Which hospitals have ICU and ventilator facilities?',
];

// ── FileUploadSection ──
function FileUploadSection() {
  const [drag, setDrag] = useState(false);
  const [queue, setQueue] = useState([]);
  const [docs, setDocs]   = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const inputRef = useRef(null);

  const loadDocs = async () => {
    setLoadingDocs(true);
    try { const d = await fetch(`${API_BASE}/api/upload/`).then(r=>r.json()); setDocs(d); } catch {}
    finally { setLoadingDocs(false); }
  };

  useState(() => { loadDocs(); }, []);

  const upload = async (file) => {
    const id = Math.random().toString(36).slice(2);
    setQueue(p => [...p, { id, name:file.name, size:file.size, status:'uploading' }]);
    try {
      const form = new FormData(); form.append('file', file);
      const res = await fetch(`${API_BASE}/api/upload/`, { method:'POST', body:form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setQueue(p => p.map(e => e.id===id ? {...e, status:'done', chunks:data.chunks} : e));
      loadDocs();
    } catch (err) {
      setQueue(p => p.map(e => e.id===id ? {...e, status:'error'} : e));
    }
  };

  const handleFiles = files => Array.from(files).filter(f => ALLOWED.some(a => f.name.toLowerCase().endsWith(a))).forEach(upload);

  const del = async (docId) => {
    try { await fetch(`${API_BASE}/api/upload/${docId}`, {method:'DELETE'}); loadDocs(); } catch {}
  };

  const total = docs.reduce((a,d) => a+(d.chunks||0), 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* Stats strip */}
      <div style={{ display:'flex', gap:24 }}>
        {[{n:docs.length,l:'Documents'},{n:total,l:'Chunks'},{n:docs.filter(d=>d.status==='Embedded').length,l:'Embedded'}].map(s => (
          <div key={s.l}>
            <div style={{ fontSize:24, fontWeight:800, letterSpacing:'-0.03em', color:'var(--t1)', fontFamily:'Space Grotesk, Inter, sans-serif' }}>{s.n}</div>
            <div style={{ fontSize:11, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div onClick={() => inputRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files)}}
        style={{
          border:`1.5px dashed ${drag ? 'var(--blue)' : 'var(--border-2)'}`,
          borderRadius:14,
          padding:'36px 24px',
          textAlign:'center',
          cursor:'pointer',
          background: drag ? 'rgba(79,142,247,0.05)' : 'rgba(14,14,28,0.4)',
          transition:'all 0.15s',
          position:'relative', overflow:'hidden',
        }}>
        {drag && <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(79,142,247,0.06),rgba(6,182,212,0.04))', pointerEvents:'none' }} />}
        <div style={{ fontSize:32, marginBottom:8 }}>⬆</div>
        <div style={{ fontSize:14, fontWeight:600, color:drag?'var(--blue)':'var(--t1)', marginBottom:4 }}>
          {drag ? 'Drop files here' : 'Click or drag & drop files'}
        </div>
        <div style={{ fontSize:12, color:'var(--t3)' }}>PDF · TXT · CSV · DOCX</div>
        <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.csv,.docx" hidden onChange={e=>handleFiles(e.target.files)} />
      </div>

      {/* Upload queue */}
      {queue.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {queue.map(e => (
            <div key={e.id} style={{
              display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              background:'rgba(14,14,28,0.8)', border:'1px solid var(--border)', borderRadius:9,
              fontSize:13, animation:'fadeUp .2s ease',
            }}>
              <span style={{ flex:1, color:'var(--t1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{e.name}</span>
              {e.status==='uploading' && <div className="spinner spinner-sm" />}
              {e.status==='done'  && <span style={{color:'var(--green)',fontWeight:600}}>✓ {e.chunks} chunks</span>}
              {e.status==='error' && <span style={{color:'var(--red)'}}>✗ Failed</span>}
              <button onClick={()=>setQueue(p=>p.filter(x=>x.id!==e.id))} style={{background:'none',border:'none',color:'var(--t3)',cursor:'pointer',fontSize:16}}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Document list */}
      {loadingDocs ? <div className="spinner" style={{margin:'20px auto'}} /> : docs.length > 0 && (
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>Vector Store</span>
            <button className="btn btn-ghost" style={{ fontSize:11, padding:'4px 10px' }} onClick={loadDocs}>Refresh</button>
          </div>
          {docs.map((doc, i) => {
            const ext = (doc.type||doc.name?.split('.').pop()||'txt').toLowerCase();
            const ei  = EXT_INFO[ext] || { color:'#94a3b8', label:ext.toUpperCase() };
            return (
              <div key={doc.id||i} style={{
                display:'flex', alignItems:'center', gap:12, padding:'11px 18px',
                borderBottom: i<docs.length-1 ? '1px solid var(--border)' : 'none',
                transition:'background 0.12s',
              }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(79,142,247,0.03)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <span style={{
                  fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em',
                  color:ei.color, background:`${ei.color}14`, border:`1px solid ${ei.color}28`,
                  borderRadius:5, padding:'2px 7px', flexShrink:0,
                }}>{ei.label}</span>
                <span style={{ fontSize:13, color:'var(--t1)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.name}</span>
                <span style={{ fontSize:11.5, color:'var(--t3)', flexShrink:0 }}>{doc.size_human} · {doc.chunks} chunks</span>
                <span style={{ fontSize:12, color:doc.status==='Embedded'?'var(--green)':'var(--amber)', fontWeight:600, flexShrink:0 }}>
                  {doc.status==='Embedded' ? '✓' : '⏳'} {doc.status}
                </span>
                {doc.id && <button onClick={()=>del(doc.id)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--t3)',fontSize:16,padding:'0 2px',transition:'color .1s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--red)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--t3)'}>×</button>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── ExtractionSection ──
function ExtractionSection() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (t = text) => {
    if (!t.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await api.extract(t)); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const cfg = result ? (STATUS_CFG[result.status] || STATUS_CFG.Medium) : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <textarea rows={4} value={text} onChange={e=>setText(e.target.value)}
        onKeyDown={e=>e.ctrlKey&&e.key==='Enter'&&run()}
        placeholder="Describe a hospital in plain English…" />
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        <button className="btn btn-primary" onClick={()=>run()} disabled={loading||!text.trim()} id="extract-btn">
          {loading ? <><div className="spinner spinner-sm"/>Extracting…</> : '⚡ Extract'}
        </button>
        {SAMPLES.map((s,i) => (
          <button key={i} className="btn btn-ghost" style={{ fontSize:12 }} onClick={()=>{setText(s);run(s);}}>Sample {i+1}</button>
        ))}
        {text && <button className="btn btn-ghost" style={{fontSize:12,marginLeft:'auto'}} onClick={()=>{setText('');setResult(null);setError('');}}>Clear</button>}
      </div>
      {error && <div className="alert alert-err">{error}</div>}
      {result && cfg && (
        <div style={{ display:'flex', flexDirection:'column', gap:12, animation:'fadeUp .3s ease' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:10 }}>
            <span style={{ width:10,height:10,borderRadius:'50%',background:cfg.color,boxShadow:`0 0 12px ${cfg.color}` }} />
            <span style={{ fontSize:15, fontWeight:700, color:cfg.color }}>{cfg.label}</span>
          </div>
          <div className="grid-3" style={{ gap:8 }}>
            {[['Doctors',result.doctors],['Nurses',result.nurses],['Beds',result.beds],['Ambulances',result.ambulances],['Location',result.location||'—'],['Population',result.population_served?.toLocaleString()??'—']].map(([l,v])=>(
              <div key={l} className="card" style={{ padding:'12px 14px' }}>
                <div style={{ fontSize:11, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600, marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:20, fontWeight:700, color:'var(--t1)', fontFamily:'Space Grotesk, Inter, sans-serif' }}>{v}</div>
              </div>
            ))}
          </div>
          {result.equipment?.length > 0 && (
            <div className="card" style={{ padding:'14px 16px' }}>
              <div className="section-label">Equipment ({result.equipment.length})</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>{result.equipment.map(e=><span key={e} className="chip">{e}</span>)}</div>
            </div>
          )}
          <details><summary>View raw JSON</summary><pre className="code" style={{marginTop:8}}>{JSON.stringify(result,null,2)}</pre></details>
        </div>
      )}
    </div>
  );
}

// ── RAGSection ──
function RAGSection() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (qr = q) => {
    if (!qr.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await api.queryRAG(qr)); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:8 }}>
        <input type="text" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder="Ask about hospital data…" id="rag-input" />
        <button className="btn btn-teal" onClick={()=>run()} disabled={loading||!q.trim()} style={{ flexShrink:0 }}>
          {loading ? <div className="spinner spinner-sm"/> : '🔮 Search'}
        </button>
      </div>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {RAG_SAMPLES.map((s,i)=>(
          <button key={i} className="btn btn-ghost" style={{ fontSize:11.5 }} onClick={()=>{setQ(s);run(s);}}>{s}</button>
        ))}
      </div>
      {error && <div className="alert alert-err">{error}</div>}
      {result && (
        <div style={{ display:'flex', flexDirection:'column', gap:12, animation:'fadeUp .3s ease' }}>
          <div className="card-grad" style={{ padding:'18px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'var(--teal)', textTransform:'uppercase', letterSpacing:'0.08em' }}>AI Answer</span>
              <span style={{ fontSize:11, color:'var(--t3)' }}>· {result.total_documents_searched} docs searched</span>
            </div>
            <p style={{ fontSize:14.5, color:'var(--t1)', lineHeight:1.75 }}>{result.answer}</p>
          </div>
          {result.sources?.length > 0 && (
            <div>
              <p className="section-label">Sources ({result.sources.length})</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {result.sources.map((s,i)=>(
                  <div key={i} className="card" style={{ padding:'12px 16px', display:'flex', gap:12, animation:`fadeUp .2s ease ${i*.06}s both` }}>
                    <span style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:700, color:'var(--blue)', background:'rgba(79,142,247,0.10)', border:'1px solid rgba(79,142,247,0.20)', borderRadius:5, padding:'2px 8px', flexShrink:0, alignSelf:'flex-start' }}>
                      {(s.score*100).toFixed(0)}%
                    </span>
                    <div>
                      <div style={{ fontSize:11, color:'var(--t3)', marginBottom:4 }}>{s.source}</div>
                      <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.6 }}>{s.content}</div>
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

export { FileUploadSection, ExtractionSection, RAGSection };
