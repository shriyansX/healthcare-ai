import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import AlertPanel from '../components/AlertPanel';
import HospitalCard from '../components/HospitalCard';
import { api } from '../lib/api';

const FALLBACK_HOSPITALS = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', doctors:320, nurses:850, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', doctors:3, nurses:5, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', doctors:45, nurses:120, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU','X-ray','Lab','Pharmacy'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', doctors:2, nurses:4, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', doctors:210, nurses:600, beds:800, ambulances:15, population_served:300000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab','Dialysis'], status:'Good', score:95 },
];

const FALLBACK_STATS = { total_hospitals: 247, medical_deserts: 38, critical_zones: 61, good: 112, medium: 36 };

const PIPELINE = [
  { label: 'Data Ingestion',  status: 'Live',    color: '#22c55e', icon: '📥' },
  { label: 'AI Extraction',   status: 'Active',  color: '#22c55e', icon: '🤖' },
  { label: 'RAG Indexing',    status: 'Ready',   color: '#22c55e', icon: '🔍' },
  { label: 'Detection Logic', status: 'Running', color: '#22c55e', icon: '🚦' },
  { label: 'Map Rendering',   status: 'Online',  color: '#22c55e', icon: '🗺️' },
];

const QUICK_LINKS = [
  { href: '/upload',  label: 'Upload Docs',    icon: '📁', desc: 'Add PDFs, CSVs to RAG store', color: '#3b82f6' },
  { href: '/extract', label: 'AI Extract',     icon: '🤖', desc: 'Parse hospital descriptions',  color: '#8b5cf6' },
  { href: '/rag',     label: 'Query RAG',      icon: '🔍', desc: 'Ask the knowledge base',       color: '#14b8a6' },
  { href: '/map',     label: 'View Map',       icon: '🗺️', desc: 'Interactive coverage map',     color: '#f59e0b' },
];

export default function Dashboard() {
  const [hospitals, setHospitals] = useState(FALLBACK_HOSPITALS);
  const [stats, setStats]         = useState(FALLBACK_STATS);
  const [loading, setLoading]     = useState(false);
  const [apiConnected, setApiConnected] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getHospitals(), api.getStats()])
      .then(([h, s]) => {
        setHospitals(h);
        setStats(s);
        setApiConnected(true);
      })
      .catch(() => setApiConnected(false))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — Healthcare AI</title>
        <meta name="description" content="Healthcare AI analytics dashboard showing hospital coverage across India" />
      </Head>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Hero header */}
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              📊 Healthcare AI Dashboard
            </h1>
            {apiConnected !== null && (
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: apiConnected ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                border: `1px solid ${apiConnected ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                color: apiConnected ? '#22c55e' : '#f59e0b',
              }}>
                {apiConnected ? '● Live Data' : '● Demo Mode'}
              </span>
            )}
          </div>
          <p className="page-subtitle">
            Real-time analytics across India's hospital network — detecting medical deserts, critical zones, and coverage gaps
          </p>
        </div>

        {/* Stats row */}
        <div className="grid-4 fade-in fade-in-delay-1" style={{ marginBottom: '2rem' }}>
          <StatCard icon="🏥" label="Total Hospitals"  value={stats.total_hospitals} color="#3b82f6" />
          <StatCard icon="🔴" label="Medical Deserts"  value={stats.medical_deserts} sub="< 5 doctors" color="#dc2626" />
          <StatCard icon="⚠️" label="Critical Zones"   value={stats.critical_zones} sub="No ICU" color="#ef4444" />
          <StatCard icon="🟢" label="Good Coverage"    value={stats.good} sub="Fully equipped" color="#22c55e" />
        </div>

        {/* Quick links */}
        <div className="fade-in fade-in-delay-2" style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Actions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
            {QUICK_LINKS.map(ql => (
              <Link key={ql.href} href={ql.href} style={{
                background: 'rgba(15,23,42,0.7)',
                border: `1px solid rgba(30,41,59,0.8)`,
                borderRadius: '12px', padding: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${ql.color}40`; e.currentTarget.style.background=`${ql.color}0a`; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(30,41,59,0.8)'; e.currentTarget.style.background='rgba(15,23,42,0.7)'; e.currentTarget.style.transform='translateY(0)'; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
                  background: `${ql.color}15`, border: `1px solid ${ql.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                }}>{ql.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f1f5f9', marginBottom: '0.1rem' }}>{ql.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ql.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Alerts + Pipeline */}
        <div className="grid-2 fade-in fade-in-delay-3" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <div className="section-title">🚨 Active Alerts</div>
            <AlertPanel />
          </div>

          <div className="card">
            <div className="section-title">🔄 Pipeline Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {PIPELINE.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.65rem 0',
                  borderBottom: i < PIPELINE.length - 1 ? '1px solid rgba(30,41,59,0.5)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                    <span style={{ fontSize: '0.87rem', color: '#cbd5e1' }}>{p.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', background: p.color,
                      boxShadow: `0 0 6px ${p.color}70`,
                      animation: 'pulse-dot 2s ease-in-out infinite',
                    }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: p.color }}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* API connection note */}
            <div style={{
              marginTop: '1rem', paddingTop: '0.75rem',
              borderTop: '1px solid rgba(30,41,59,0.5)',
              fontSize: '0.75rem', color: '#475569',
            }}>
              {apiConnected === true && '✅ Connected to live backend API'}
              {apiConnected === false && '⚠️ Backend offline — showing demo data. Start backend with: uvicorn main:app --reload'}
              {apiConnected === null && '⏳ Connecting to backend…'}
            </div>
          </div>
        </div>

        {/* Hospital registry */}
        <div className="fade-in fade-in-delay-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>🏥 Hospital Registry</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {loading && (
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div className="spinner spinner-sm" /> Syncing…
                </span>
              )}
              <Link href="/results" className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}>
                View All →
              </Link>
            </div>
          </div>
          <div className="grid-3">
            {hospitals.slice(0, 6).map((h, i) => (
              <div key={h.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}>
                <HospitalCard hospital={h} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
