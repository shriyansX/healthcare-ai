import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const FALLBACK = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', doctors:320, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', doctors:3, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', doctors:45, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', doctors:2, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', doctors:210, beds:800, ambulances:15, population_served:300000, equipment:['MRI','ICU','NICU','Dialysis'], status:'Good', score:95 },
];
const FALLBACK_STATS = { total_hospitals: 247, medical_deserts: 38, critical_zones: 61, good: 112, medium: 36 };

const STATUS_COLOR = { Good:'#10b981', Medium:'#f59e0b', Critical:'#ef4444', 'Medical Desert':'#dc2626' };
const STATUS_BADGE = { Good:'badge-good', Medium:'badge-medium', Critical:'badge-critical', 'Medical Desert':'badge-desert' };

// SVG illustration for the hero
function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="480" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4f8ef7" stopOpacity="0.08"/>
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0.04"/>
        </linearGradient>
        <linearGradient id="line-grad" x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4f8ef7" stopOpacity="0"/>
          <stop offset="0.5" stopColor="#4f8ef7" stopOpacity="0.6"/>
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="node-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8ef7"/>
          <stop offset="1" stopColor="#06b6d4"/>
        </linearGradient>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#4f8ef7" stopOpacity="0.25"/>
          <stop offset="1" stopColor="#4f8ef7" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#10b981" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#10b981" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ef4444" stopOpacity="0.2"/>
          <stop offset="1" stopColor="#ef4444" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="240" cy="180" rx="200" ry="160" fill="url(#bg-grad)"/>

      {/* Grid lines */}
      {[60,120,180,240,300,360,420].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="360" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      ))}
      {[60,120,180,240,300].map(y => (
        <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
      ))}

      {/* Connecting lines */}
      <line x1="80" y1="180" x2="240" y2="120" stroke="url(#line-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="240" y1="120" x2="390" y2="80" stroke="url(#line-grad)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="80" y1="180" x2="200" y2="260" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="240" y1="120" x2="360" y2="230" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" strokeDasharray="5 4"/>
      <line x1="360" y1="230" x2="430" y2="300" stroke="rgba(245,158,11,0.3)" strokeWidth="1.5" strokeDasharray="5 4"/>

      {/* Glow spots */}
      <ellipse cx="240" cy="120" rx="60" ry="60" fill="url(#glow1)"/>
      <ellipse cx="360" cy="230" rx="40" ry="40" fill="url(#glow2)"/>
      <ellipse cx="200" cy="260" rx="35" ry="35" fill="url(#glow3)"/>

      {/* Good hospital node — large */}
      <circle cx="240" cy="120" r="28" fill="rgba(79,142,247,0.15)" stroke="url(#node-grad)" strokeWidth="1.5"/>
      <circle cx="240" cy="120" r="18" fill="rgba(79,142,247,0.25)"/>
      <rect x="236" y="110" width="8" height="20" rx="2" fill="#4f8ef7"/>
      <rect x="230" y="116" width="20" height="8" rx="2" fill="#06b6d4"/>
      <text x="240" y="158" textAnchor="middle" fill="#4f8ef7" fontSize="9" fontWeight="700" fontFamily="Inter">AIIMS Delhi</text>
      <text x="240" y="168" textAnchor="middle" fill="#6b7280" fontSize="7.5" fontFamily="Inter">Score 92 · Good</text>

      {/* Apollo Chennai */}
      <circle cx="390" cy="80" r="20" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5"/>
      <circle cx="390" cy="80" r="12" fill="rgba(16,185,129,0.25)"/>
      <text x="390" y="80" textAnchor="middle" dominantBaseline="middle" fill="#10b981" fontSize="8" fontWeight="700" fontFamily="Inter">95</text>
      <text x="390" y="106" textAnchor="middle" fill="#10b981" fontSize="7.5" fontFamily="Inter">Apollo Chennai</text>

      {/* Medical Desert */}
      <circle cx="200" cy="260" r="18" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.5"/>
      <circle cx="200" cy="260" r="11" fill="rgba(220,38,38,0.25)"/>
      <text x="200" y="260" textAnchor="middle" dominantBaseline="middle" fill="#f87171" fontSize="8" fontWeight="700" fontFamily="Inter">8</text>
      <text x="200" y="283" textAnchor="middle" fill="#f87171" fontSize="7.5" fontFamily="Inter">Vidarbha</text>

      {/* Good hospital */}
      <circle cx="360" cy="230" r="15" fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="360" y="230" textAnchor="middle" dominantBaseline="middle" fill="#6ee7b7" fontSize="7.5" fontWeight="700" fontFamily="Inter">71</text>
      <text x="360" y="250" textAnchor="middle" fill="#6ee7b7" fontSize="7" fontFamily="Inter">Pune</text>

      {/* Medium/critical */}
      <circle cx="80" cy="180" r="14" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="80" y="180" textAnchor="middle" dominantBaseline="middle" fill="#fcd34d" fontSize="7.5" fontWeight="700" fontFamily="Inter">38</text>
      <text x="80" y="200" textAnchor="middle" fill="#fcd34d" fontSize="7" fontFamily="Inter">Barmer</text>

      <circle cx="430" cy="300" r="12" fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth="1" strokeOpacity="0.4"/>
      <text x="430" y="300" textAnchor="middle" dominantBaseline="middle" fill="#fca5a5" fontSize="7" fontWeight="700" fontFamily="Inter">Crit</text>
    </svg>
  );
}

function StatCard({ value, label, sub, accent = '#4f8ef7', delay = 0 }) {
  return (
    <div className="stat-card fade" style={{ animationDelay: `${delay}s` }}>
      <div style={{
        fontSize: 38, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
        fontFamily: 'Space Grotesk, Inter, sans-serif',
        color: accent,
        textShadow: `0 0 24px ${accent}40`,
      }}>{value}</div>
      <div style={{ fontSize: 14, color: 'var(--t1)', marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function HospitalRow({ h, last }) {
  const c = STATUS_COLOR[h.status] || '#94a3b8';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 140px 70px 80px 160px',
      padding: '13px 24px', alignItems: 'center', gap: 12,
      borderBottom: last ? 'none' : '1px solid var(--border)',
      borderLeft: h.status === 'Medical Desert' ? '3px solid #dc2626' : '3px solid transparent',
      background: h.status === 'Medical Desert' ? 'rgba(220,38,38,0.04)' : 'transparent',
      transition: 'background 0.15s',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.background = h.status === 'Medical Desert' ? 'rgba(220,38,38,0.08)' : 'rgba(79,142,247,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = h.status === 'Medical Desert' ? 'rgba(220,38,38,0.04)' : 'transparent'}
    >
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{h.name}</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {(h.equipment || []).slice(0, 3).map(e => <span key={e} className="chip" style={{ fontSize: 10.5, padding: '2px 7px' }}>{e}</span>)}
          {(h.equipment || []).length > 3 && <span className="chip" style={{ fontSize: 10.5, opacity: 0.5 }}>+{h.equipment.length - 3}</span>}
        </div>
      </div>
      <span style={{ fontSize: 12.5, color: 'var(--t2)' }}>{h.location}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{h.doctors}</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
          <div className="progress-track" style={{ flex: 1, height: 4 }}>
            <div className="progress-fill" style={{ width: `${h.score || 0}%`, background: `linear-gradient(90deg, ${c}, ${c}aa)` }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--mono)', width: 22, textAlign: 'right' }}>{h.score}</span>
        </div>
      </div>
      <span className={`badge ${STATUS_BADGE[h.status] || 'badge-medium'}`} style={{ justifySelf: 'start' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />
        {h.status}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [hospitals, setHospitals] = useState(FALLBACK);
  const [stats, setStats]         = useState(FALLBACK_STATS);
  const [live, setLive]           = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    Promise.all([api.getHospitals(), api.getStats()])
      .then(([h, s]) => { setHospitals(h); setStats(s); setLive(true); })
      .catch(() => setLive(false));
  }, []);

  return (
    <>
      <Head>
        <title>MedIntel AI – Healthcare Desert Detection System</title>
        <meta name="description" content="AI-powered platform to identify underserved healthcare regions" />
      </Head>

      <div className="container" style={{ padding: '48px 28px 72px' }}>

        {/* ── Hero ── */}
        <div className="fade" style={{
          display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48,
          marginBottom: 56, alignItems: 'center',
        }}>
          <div>
            {/* Live badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(79,142,247,0.10)', border: '1px solid rgba(79,142,247,0.22)',
              borderRadius: 999, padding: '5px 12px', marginBottom: 20,
              fontSize: 12, fontWeight: 600, color: '#93c5fd',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8ef7', boxShadow: '0 0 8px #4f8ef7' }} />
              AI-Powered Healthcare Analytics
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              fontSize: 'clamp(32px, 4vw, 42px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
              color: '#f1f5f9',
            }}>
              MedIntel AI –<br />
              <span style={{
                background: 'linear-gradient(135deg, #4f8ef7 0%, #06b6d4 60%, #6366f1 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Healthcare Desert Detection</span>
            </h1>

            <p style={{ fontSize: 15.5, color: 'var(--t2)', lineHeight: 1.7, marginBottom: 28, maxWidth: 460 }}>
              AI-powered platform to identify underserved healthcare regions. Real-time analytics detecting medical deserts and critical zones across {stats.total_hospitals}+ hospitals nationwide.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/upload" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: 14 }}>
                Upload Documents
              </Link>
              <Link href="/map" className="btn btn-ghost" style={{ padding: '10px 22px', fontSize: 14 }}>
                View Coverage Map →
              </Link>
            </div>

            {/* Live indicator */}
            {live !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 12, color: 'var(--t3)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: live ? '#10b981' : '#f59e0b' }} />
                {live ? 'Connected to live backend' : 'Demo mode — start backend to see live data'}
              </div>
            )}
          </div>

          {/* SVG illustration */}
          <div style={{
            position: 'relative', borderRadius: 20,
            background: 'rgba(14,14,28,0.6)',
            border: '1px solid rgba(79,142,247,0.15)',
            overflow: 'hidden',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ padding: 8 }}>
              <HeroIllustration />
            </div>
            <div style={{
              position: 'absolute', bottom: 12, left: 12, right: 12,
              display: 'flex', justifyContent: 'space-between',
              fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--mono)',
              padding: '6px 10px', background: 'rgba(6,6,15,0.6)', borderRadius: 6,
            }}>
              <span>● Live network graph</span>
              <span>{hospitals.length} nodes</span>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid-4 fade fade-1" style={{ marginBottom: 36 }}>
          <StatCard value={stats.total_hospitals} label="Hospitals Indexed" sub="across India" delay={0.05} />
          <StatCard value={stats.medical_deserts} label="Medical Deserts" sub="< 5 doctors" accent="#ef4444" delay={0.10} />
          <StatCard value={stats.critical_zones}  label="Critical Zones"  sub="no ICU access" accent="#f59e0b" delay={0.15} />
          <StatCard value={stats.good}             label="Good Coverage"   sub="fully equipped" accent="#10b981" delay={0.20} />
        </div>

        {/* ── Quick actions ── */}
        <div className="fade fade-2" style={{ marginBottom: 32 }}>
          <p className="section-label">Explore the platform</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { href:'/upload',  icon:'⬆', title:'Upload Docs',     desc:'PDF, CSV, TXT into RAG',  color:'#4f8ef7' },
              { href:'/extract', icon:'⚡', title:'AI Extract',      desc:'Parse hospital text',      color:'#6366f1' },
              { href:'/rag',     icon:'🔮', title:'Query RAG',       desc:'Ask the knowledge base',   color:'#06b6d4' },
              { href:'/results', icon:'📊', title:'All Results',     desc:'Filter & sort hospitals',  color:'#10b981' },
            ].map(q => (
              <Link key={q.href} href={q.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: 'rgba(14,14,28,0.7)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${q.color}35`; e.currentTarget.style.background=`${q.color}08`; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='rgba(14,14,28,0.7)'; e.currentTarget.style.transform='translateY(0)'; }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                  background: `${q.color}15`, border: `1px solid ${q.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{q.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>{q.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--t3)' }}>{q.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Alerts + Pipeline ── */}
        <div className="grid-2 fade fade-3" style={{ marginBottom: 32, alignItems: 'start' }}>
          {/* Alerts */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--t1)', fontFamily: 'Space Grotesk, Inter, sans-serif' }}>Active Alerts</span>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>{currentTime}</span>
            </div>
            {[
              { type:'err',  label:'Medical Desert',  msg:'Barmer PHC — 2 doctors for 12,000 people',    time:'2m' },
              { type:'err',  label:'Critical Zone',   msg:'Vidarbha — no ICU or ambulances',             time:'5m' },
              { type:'warn', label:'High Occupancy',  msg:'Pune City Hospital at 87% bed capacity',      time:'12m' },
              { type:'warn', label:'Equipment Gap',   msg:'Jharkhand PHC — missing ventilator & CT',     time:'18m' },
              { type:'ok',   label:'Full Coverage',   msg:'AIIMS Delhi serving 500k+ with full kit',     time:'25m' },
            ].map((a, i, arr) => {
              const col = a.type==='err' ? '#ef4444' : a.type==='warn' ? '#f59e0b' : '#10b981';
              return (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '12px 22px', alignItems: 'flex-start',
                  borderBottom: i<arr.length-1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.12s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(79,142,247,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}
                >
                  <span style={{ width:7, height:7, borderRadius:'50%', background:col, flexShrink:0, marginTop:5, boxShadow:`0 0 6px ${col}` }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:col }}>{a.label} </span>
                    <span style={{ fontSize:12.5, color:'var(--t2)' }}>{a.msg}</span>
                  </div>
                  <span style={{ fontSize:11, color:'var(--t3)', flexShrink:0, paddingTop:1 }}>{a.time} ago</span>
                </div>
              );
            })}
          </div>

          {/* Pipeline */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--t1)', fontFamily: 'Space Grotesk, Inter, sans-serif' }}>Pipeline Status</span>
            </div>
            {[
              { label:'Data Ingestion',  color:'#10b981', pct:100 },
              { label:'AI Extraction',   color:'#10b981', pct:100 },
              { label:'RAG Indexing',    color:'#4f8ef7', pct:88 },
              { label:'Detection Logic', color:'#10b981', pct:100 },
              { label:'Map Rendering',   color:'#10b981', pct:100 },
            ].map((p, i, arr) => (
              <div key={i} style={{
                padding: '13px 22px',
                borderBottom: i<arr.length-1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, color:'var(--t2)' }}>{p.label}</span>
                  <span style={{ fontSize:12, color:p.color, fontWeight:600 }}>{p.pct}%</span>
                </div>
                <div className="progress-track" style={{ height:3 }}>
                  <div className="progress-fill" style={{ width:`${p.pct}%`, background:`linear-gradient(90deg, ${p.color}aa, ${p.color})` }} />
                </div>
              </div>
            ))}
            <div style={{ padding:'12px 22px', borderTop:'1px solid var(--border)', fontSize:12, color:'var(--t3)' }}>
              {live===true && '✓ Live backend connected'}{live===false && '⚠ Demo mode — backend offline'}{live===null && '… Connecting'}
            </div>
          </div>
        </div>

        {/* ── Hospital table ── */}
        <div className="fade fade-4">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <p className="section-label" style={{ marginBottom:0 }}>Healthcare Coverage Overview</p>
            <Link href="/results" style={{ fontSize:13, color:'var(--blue)', fontWeight:500 }}>View all results →</Link>
          </div>
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{
              display:'grid', gridTemplateColumns:'1fr 140px 70px 80px 160px',
              padding:'9px 24px', borderBottom:'1px solid var(--border)', gap:12,
              fontSize:11, fontWeight:700, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.08em',
            }}>
              <span>Hospital</span><span>Location</span><span>Doctors</span><span>Score</span><span>Status</span>
            </div>
            {hospitals.slice(0, 6).map((h, i) => (
              <HospitalRow key={h.id} h={h} last={i === Math.min(hospitals.length, 6) - 1} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
