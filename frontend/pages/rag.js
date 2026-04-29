import Head from 'next/head';
import { RAGSection } from '../components/Sections';

const PIPELINE_STEPS = [
  { icon:'⌨', label:'Query Input',    desc:'Natural language question',            color:'#4f8ef7' },
  { icon:'🧮', label:'Embed Query',   desc:'Text → vector representation',         color:'#6366f1' },
  { icon:'🗄', label:'ChromaDB Search',desc:'Cosine similarity search',             color:'#8b5cf6' },
  { icon:'📑', label:'Top-K Chunks',  desc:'Most relevant document snippets',      color:'#06b6d4' },
  { icon:'🤖', label:'LLM Synthesis', desc:'GPT generates a grounded answer',      color:'#10b981' },
];

export default function RAGPage() {
  return (
    <>
      <Head><title>RAG Engine — HealthcareAI</title></Head>
      <div className="container" style={{ padding:'48px 28px 72px', maxWidth:960 }}>
        <div className="fade">
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.20)', borderRadius:999, padding:'4px 12px', marginBottom:16, fontSize:12, fontWeight:600, color:'#67e8f9' }}>
            Step 3 of 5 — Query Knowledge Base
          </div>
          <h1 className="page-title">RAG <span className="title-accent">Engine</span></h1>
          <p className="page-sub">Retrieval-Augmented Generation — ask natural language questions and get AI answers backed by real hospital documents.</p>
        </div>

        {/* Pipeline visualization */}
        <div className="card fade fade-1" style={{ marginBottom:20, padding:'20px 24px 18px' }}>
          <p className="section-label">Pipeline Architecture</p>
          <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto', paddingBottom:4 }}>
            {PIPELINE_STEPS.map((s,i,arr)=>(
              <div key={s.label} style={{ display:'flex', alignItems:'center', flex:1, minWidth:130 }}>
                <div style={{ flex:1, textAlign:'center' }}>
                  <div style={{
                    width:40, height:40, borderRadius:10, margin:'0 auto 8px',
                    background:`${s.color}14`, border:`1px solid ${s.color}28`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:18, transition:'all .2s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.background=`${s.color}24`;e.currentTarget.style.borderColor=`${s.color}50`;e.currentTarget.style.boxShadow=`0 0 16px ${s.color}30`;}}
                    onMouseLeave={e=>{e.currentTarget.style.background=`${s.color}14`;e.currentTarget.style.borderColor=`${s.color}28`;e.currentTarget.style.boxShadow='none';}}
                  >{s.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--t1)', marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:10.5, color:'var(--t3)', lineHeight:1.4 }}>{s.desc}</div>
                </div>
                {i<arr.length-1 && <div style={{ color:'var(--t3)', fontSize:16, padding:'0 4px', marginBottom:24, flexShrink:0 }}>→</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Query interface */}
        <div className="card-grad fade fade-2" style={{ marginBottom:20 }}>
          <p className="section-label">Ask questions about healthcare gaps</p>
          <RAGSection />
        </div>

        {/* Tech stack */}
        <div className="card fade fade-3">
          <p className="section-label">Tech Stack</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {[
              ['LlamaIndex','#4f8ef7'],['ChromaDB','#06b6d4'],['OpenAI Embeddings','#10b981'],
              ['GPT-4o-mini','#8b5cf6'],['FastAPI','#f59e0b'],['Next.js','#f1f5f9'],
            ].map(([t,c])=>(
              <span key={t} style={{ fontSize:12.5, fontWeight:600, color:c, background:`${c}12`, border:`1px solid ${c}22`, borderRadius:6, padding:'5px 12px' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
