import Head from 'next/head';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const FALLBACK = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', doctors:320, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', doctors:3, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', doctors:45, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU','X-ray','Lab'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', doctors:2, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', doctors:210, beds:800, ambulances:15, population_served:300000, equipment:['MRI','ICU','NICU','Ventilator','Dialysis'], status:'Good', score:95 },
  { id:6, name:'KEM Mumbai', location:'Mumbai, MH', doctors:180, beds:650, ambulances:10, population_served:250000, equipment:['MRI','ICU','CT scan','Lab'], status:'Good', score:84 },
];

const ORDER = { 'Medical Desert':0, Critical:1, Medium:2, Good:3 };
const DOT   = { Good:'#10b981', Medium:'#f59e0b', Critical:'#ef4444', 'Medical Desert':'#dc2626' };
const BADGE = { Good:'badge-good', Medium:'badge-medium', Critical:'badge-critical', 'Medical Desert':'badge-desert' };

const STATUS_SUMMARY = [
  { status:'Medical Desert', color:'#dc2626', icon:'🔴', bg:'rgba(220,38,38,0.08)', border:'rgba(220,38,38,0.20)' },
  { status:'Critical',       color:'#ef4444', icon:'⚠️', bg:'rgba(239,68,68,0.08)', border:'rgba(239,68,68,0.20)' },
  { status:'Medium',         color:'#f59e0b', icon:'🟡', bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.20)' },
  { status:'Good',           color:'#10b981', icon:'✅', bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.20)' },
];

export default function ResultsPage() {
  const [hospitals, setHospitals] = useState(FALLBACK);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('All');
  const [sort, setSort]           = useState('status');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    api.getHospitals().then(setHospitals).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  let list = hospitals;
  if (filter !== 'All')  list = list.filter(h => h.status === filter);
  if (search.trim())     list = list.filter(h => `${h.name} ${h.location}`.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'status') list = [...list].sort((a,b) => ORDER[a.status]-ORDER[b.status]);
  if (sort === 'doctors')list = [...list].sort((a,b) => b.doctors-a.doctors);
  if (sort === 'score')  list = [...list].sort((a,b) => (b.score||0)-(a.score||0));

  const counts = { All:hospitals.length, ...Object.fromEntries(STATUS_SUMMARY.map(s=>[s.status, hospitals.filter(h=>h.status===s.status).length])) };

  return (
    <>
      <Head><title>Results — HealthcareAI</title></Head>
      <div className="container" style={{ padding:'48px 28px 72px' }}>
        <div className="fade">
          <h1 className="page-title">Analysis <span className="title-accent">Results</span></h1>
          <p className="page-sub">Browse, filter and analyse all indexed hospitals. Click column headers to sort.</p>
        </div>

        {/* Status summary cards */}
        <div className="grid-4 fade fade-1" style={{ marginBottom:24 }}>
          {STATUS_SUMMARY.map(s=>(
            <button key={s.status} onClick={()=>setFilter(filter===s.status?'All':s.status)} style={{
              padding:'16px 18px', textAlign:'left',
              background: filter===s.status ? s.bg : 'rgba(14,14,28,0.7)',
              border:`1px solid ${filter===s.status ? s.border : 'var(--border)'}`,
              borderRadius:12, cursor:'pointer', transition:'all .2s',
            }}
              onMouseEnter={e=>{if(filter!==s.status){e.currentTarget.style.borderColor=s.border;e.currentTarget.style.background=s.bg;}}}
              onMouseLeave={e=>{if(filter!==s.status){e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='rgba(14,14,28,0.7)';}}}
            >
              <div style={{ fontSize:9, fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>{s.status}</div>
              <div style={{ fontSize:32, fontWeight:800, color:s.color, fontFamily:'Space Grotesk, Inter, sans-serif', letterSpacing:'-0.03em', lineHeight:1, textShadow:`0 0 20px ${s.color}40` }}>{counts[s.status]}</div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="fade fade-2" style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center', padding:'12px 16px', background:'rgba(14,14,28,0.6)', border:'1px solid var(--border)', borderRadius:12, backdropFilter:'blur(12px)' }}>
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search hospitals or locations…" style={{ width:220, flex:'none' }} />
          <div style={{ display:'flex', gap:4, flex:1, flexWrap:'wrap' }}>
            {['All',...STATUS_SUMMARY.map(s=>s.status)].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={`btn ${filter===f?'btn-primary':'btn-ghost'}`} style={{ fontSize:12, padding:'6px 11px' }}>
                {f} <span style={{ opacity:.65 }}>({counts[f]??0})</span>
              </button>
            ))}
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'auto', fontSize:13, padding:'7px 12px' }}>
            <option value="status">Sort: Status</option>
            <option value="doctors">Sort: Doctors</option>
            <option value="score">Sort: Score</option>
          </select>
          <span style={{ fontSize:12, color:'var(--t3)' }}>{list.length} hospitals</span>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:64 }}><div className="spinner" /></div>
        ) : list.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 24px', color:'var(--t3)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:15, fontWeight:600, color:'var(--t2)', marginBottom:4 }}>No results found</div>
            <div style={{ fontSize:13 }}>Try adjusting your search or filter</div>
          </div>
        ) : (
          <div className="grid-3 fade fade-3">
            {list.map((h,i)=>{
              const c = DOT[h.status]||'#94a3b8';
              return (
                <div key={h.id} className="card" style={{
                  padding:0, overflow:'hidden',
                  animation:`fadeUp .3s ease ${i*.04}s both`,
                  transition:'all .2s', position:'relative',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${c}35`;e.currentTarget.style.boxShadow=`0 8px 32px ${c}12`;e.currentTarget.style.transform='translateY(-2px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}
                >
                  {/* Top accent */}
                  <div style={{ height:3, background:`linear-gradient(90deg, ${c}, ${c}55)` }} />
                  <div style={{ padding:'16px 18px' }}>
                    {/* Header */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div style={{ flex:1, minWidth:0, marginRight:8 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'var(--t1)', marginBottom:2, lineHeight:1.3 }}>{h.name}</div>
                        <div style={{ fontSize:12, color:'var(--t3)' }}>📍 {h.location}</div>
                      </div>
                      <span className={`badge ${BADGE[h.status]||'badge-medium'}`} style={{ flexShrink:0, fontSize:10.5 }}>
                        <span style={{ width:5,height:5,borderRadius:'50%',background:c }} />
                        {h.status}
                      </span>
                    </div>
                    {/* Stats */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
                      {[['👨‍⚕️','Doctors',h.doctors],['🛏','Beds',h.beds||'—'],['🚑','Ambulances',h.ambulances??'—'],['👥','Population',h.population_served?(h.population_served/1000).toFixed(0)+'K':'—']].map(([ic,lb,vl])=>(
                        <div key={lb} style={{ background:'rgba(255,255,255,0.03)', borderRadius:7, padding:'8px 10px', border:'1px solid var(--border)' }}>
                          <div style={{ fontSize:10.5, color:'var(--t3)', marginBottom:2 }}>{ic} {lb}</div>
                          <div style={{ fontSize:15, fontWeight:700, color:'var(--t1)', fontFamily:'Space Grotesk, Inter, sans-serif' }}>{vl}</div>
                        </div>
                      ))}
                    </div>
                    {/* Equipment */}
                    {(h.equipment||[]).length>0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
                        {h.equipment.slice(0,5).map(e=><span key={e} className="chip" style={{ fontSize:10.5, padding:'2px 7px' }}>{e}</span>)}
                        {h.equipment.length>5 && <span className="chip" style={{ fontSize:10.5, opacity:.5 }}>+{h.equipment.length-5}</span>}
                      </div>
                    )}
                    {/* Score */}
                    {h.score!==undefined && (
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, color:'var(--t3)', marginBottom:4 }}>
                          <span>Quality Score</span>
                          <span style={{ color:'var(--t1)', fontWeight:700, fontFamily:'var(--mono)' }}>{h.score}/100</span>
                        </div>
                        <div className="progress-track" style={{ height:4 }}>
                          <div className="progress-fill" style={{ width:`${h.score}%`, background:`linear-gradient(90deg, ${c}80, ${c})` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
