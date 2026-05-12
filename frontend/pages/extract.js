import Head from 'next/head';
import { ExtractionSection } from '../components/Sections';

export default function ExtractPage() {
  return (
    <>
      <Head><title>AI Extraction — HealthcareAI</title></Head>
      <div className="container" style={{ padding:'48px 28px 72px', maxWidth:900 }}>
        <div className="fade">
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.20)', borderRadius:999, padding:'4px 12px', marginBottom:16, fontSize:12, fontWeight:600, color:'#a5b4fc' }}>
            Step 2 of 5 — Extract Structure
          </div>
          <h1 className="page-title">AI-Based Hospital Data <span className="title-accent">Extraction</span></h1>
          <p className="page-sub">Convert messy hospital descriptions into structured data using regex patterns + NLP rule engine. Detects doctors, equipment, and status automatically.</p>
        </div>

        <div className="grid-2 fade fade-1" style={{ marginBottom:20, alignItems:'start' }}>
          <div className="card-grad">
            <ExtractionSection />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="card">
              <p className="section-label">Detection Rules</p>
              {[
                { rule:'doctors < 5',       result:'Medical Desert', color:'#ef4444' },
                { rule:'no ICU',            result:'Critical',       color:'#f59e0b' },
                { rule:'partial equipment', result:'Medium',         color:'#fbbf24' },
                { rule:'full kit + staff',  result:'Good',           color:'#10b981' },
              ].map((r,i,arr)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:i<arr.length-1?'1px solid var(--border)':'none' }}>
                  <code style={{ fontFamily:'var(--mono)', fontSize:11.5, color:'var(--t2)', background:'var(--bg-2)', padding:'2px 8px', borderRadius:4, flex:1 }}>{r.rule}</code>
                  <span style={{ fontSize:12, fontWeight:700, color:r.color }}>→ {r.result}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="section-label">Equipment Keywords</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab','X-ray','Pharmacy','Dialysis','ECG','Ultrasound'].map(e=>(
                  <span key={e} className="chip">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
