import Head from 'next/head';
import { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import { api } from '../lib/api';

const FILTERS = [
  { label:'All',            value:'all',            color:'#4f8ef7' },
  { label:'Medical Desert', value:'Medical Desert',  color:'#dc2626' },
  { label:'Critical',       value:'Critical',        color:'#ef4444' },
  { label:'Medium',         value:'Medium',          color:'#f59e0b' },
  { label:'Good',           value:'Good',            color:'#10b981' },
];

const LEGEND = [
  { emoji:'🟢', label:'Good',           desc:'15+ doctors, full equipment' },
  { emoji:'🟡', label:'Critical',       desc:'Missing ICU / key equipment' },
  { emoji:'🔴', label:'Medical Desert', desc:'Fewer than 5 doctors' },
];

export default function MapPage() {
  const [filter, setFilter] = useState('all');
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    api.getHospitals().then(setHospitals).catch(() => {});
  }, []);

  return (
    <>
      <Head><title>Coverage Map — HealthcareAI</title></Head>
      <div className="container" style={{ padding:'48px 28px 72px' }}>
        <div className="fade">
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.20)', borderRadius:999, padding:'4px 12px', marginBottom:16, fontSize:12, fontWeight:600, color:'#6ee7b7' }}>
            Step 5 of 5 — Visualise Coverage
          </div>
          <h1 className="page-title">Coverage <span className="title-accent">Map</span></h1>
          <p className="page-sub">Interactive hospital network across India. Circle size reflects doctor count. Click markers for details.</p>
        </div>

        {/* Filter row */}
        <div className="fade fade-1" style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
          {FILTERS.map(f=>(
            <button key={f.value} onClick={()=>setFilter(f.value)}
              className="btn"
              style={{
                fontSize:13, padding:'7px 14px',
                background: filter===f.value ? `${f.color}18` : 'rgba(14,14,28,0.6)',
                border:`1px solid ${filter===f.value ? f.color+'40' : 'var(--border)'}`,
                color: filter===f.value ? f.color : 'var(--t2)',
                fontWeight: filter===f.value ? 700 : 400,
                transition:'all .15s',
              }}
              onMouseEnter={e=>{ if(filter!==f.value){e.currentTarget.style.borderColor=f.color+'30';e.currentTarget.style.color=f.color;}}}
              onMouseLeave={e=>{ if(filter!==f.value){e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--t2)';}}}
            >
              <span style={{ width:6,height:6,borderRadius:'50%',background:f.color,display:'inline-block',marginRight:5,boxShadow:`0 0 6px ${f.color}` }} />
              {f.label}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="card fade fade-2" style={{ padding:0, overflow:'hidden', marginBottom:14, borderColor:'rgba(79,142,247,0.12)' }}>
          <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 8px #10b981' }} />
              <span style={{ fontSize:12.5, fontWeight:600, color:'var(--t1)' }}>Live Network Map</span>
            </div>
            <span style={{ fontSize:11.5, color:'var(--t3)', fontFamily:'var(--mono)' }}>India · {filter === 'all' ? 'All hospitals' : filter}</span>
          </div>
          <MapView filter={filter} hospitals={hospitals} />
        </div>

        {/* Legend + tips */}
        <div className="grid-2 fade fade-3">
          <div className="card">
            <p className="section-label">Map Legend</p>
            {LEGEND.map(l=>(
              <div key={l.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{l.emoji}</span>
                <div>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{l.label}</span>
                  <span style={{ fontSize:12, color:'var(--t3)', marginLeft:8 }}>{l.desc}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop:10, fontSize:12, color:'var(--t3)' }}>Circle size = number of doctors</div>
          </div>
          <div className="card">
            <p className="section-label">Interaction Guide</p>
            {[
              ['Click','any circle to see hospital details'],
              ['Scroll','to zoom in or out on regions'],
              ['Drag','to pan across the map'],
              ['Filter','by status tier using the buttons above'],
            ].map(([k,v])=>(
              <div key={k} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:12, fontWeight:700, color:'var(--blue)', fontFamily:'var(--mono)', minWidth:44 }}>{k}</span>
                <span style={{ fontSize:12.5, color:'var(--t2)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
