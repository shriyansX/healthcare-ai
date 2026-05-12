import Head from 'next/head';
import { FileUploadSection } from '../components/Sections';

export default function UploadPage() {
  return (
    <>
      <Head><title>Upload — HealthcareAI</title></Head>
      <div className="container" style={{ padding:'48px 28px 72px', maxWidth:860 }}>
        <div className="fade">
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(79,142,247,0.08)', border:'1px solid rgba(79,142,247,0.18)', borderRadius:999, padding:'4px 12px', marginBottom:16, fontSize:12, fontWeight:600, color:'#93c5fd' }}>
            Step 1 of 5 — Ingest Data
          </div>
          <h1 className="page-title">Upload <span className="title-accent">Documents</span></h1>
          <p className="page-sub">Add hospital documents to the RAG vector store. Files are automatically chunked, embedded, and indexed into ChromaDB.</p>
        </div>

        <div className="card fade fade-1" style={{ marginBottom:20 }}>
          <FileUploadSection />
        </div>

        {/* Pipeline steps */}
        <div className="fade fade-2">
          <p className="section-label">Processing Pipeline</p>
          <div style={{ display:'flex', gap:0, alignItems:'stretch' }}>
            {[
              { n:'1', label:'Upload', desc:'File received by FastAPI', color:'#4f8ef7' },
              { n:'2', label:'Chunk',  desc:'Split into ~512 token chunks', color:'#6366f1' },
              { n:'3', label:'Embed',  desc:'Vectorize with OpenAI', color:'#06b6d4' },
              { n:'4', label:'Index',  desc:'Store in ChromaDB', color:'#10b981' },
            ].map((s,i,arr)=>(
              <div key={s.n} style={{ display:'flex', alignItems:'center', flex:1 }}>
                <div style={{
                  flex:1, padding:'14px 16px',
                  background:'rgba(14,14,28,0.7)', border:`1px solid ${s.color}22`,
                  borderRadius:10, transition:'all .2s',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${s.color}44`;e.currentTarget.style.background=`${s.color}08`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=`${s.color}22`;e.currentTarget.style.background='rgba(14,14,28,0.7)';}}
                >
                  <div style={{ fontSize:11, fontFamily:'var(--mono)', color:s.color, fontWeight:700, marginBottom:4 }}>0{s.n}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--t1)', marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:11.5, color:'var(--t3)' }}>{s.desc}</div>
                </div>
                {i<arr.length-1 && <div style={{ fontSize:14, color:'var(--t3)', padding:'0 8px', flexShrink:0 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
