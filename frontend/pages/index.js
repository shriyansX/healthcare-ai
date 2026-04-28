import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const FALLBACK = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', doctors:320, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', doctors:3, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', doctors:45, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', doctors:2, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', doctors:210, beds:800, ambulances:15, population_served:300000, equipment:['MRI','ICU','NICU','Dialysis'], status:'Good', score:95 },
];

const FALLBACK_STATS = { total_hospitals: 247, medical_deserts: 38, critical_zones: 61, good: 112, medium: 36 };

const STATUS_DOT = { Good: 'var(--green)', Medium: 'var(--amber)', Critical: 'var(--red)', 'Medical Desert': 'var(--red-deep)' };
const STATUS_COLOR = { Good: '#4ade80', Medium: '#fbbf24', Critical: '#f87171', 'Medical Desert': '#f87171' };

export default function Dashboard() {
  const [hospitals, setHospitals] = useState(FALLBACK);
  const [stats, setStats]         = useState(FALLBACK_STATS);
  const [live, setLive]           = useState(null);

  useEffect(() => {
    Promise.all([api.getHospitals(), api.getStats()])
      .then(([h, s]) => { setHospitals(h); setStats(s); setLive(true); })
      .catch(() => setLive(false));
  }, []);

  const STATS = [
    { label: 'Hospitals',       value: stats.total_hospitals, note: 'indexed' },
    { label: 'Medical Deserts', value: stats.medical_deserts, note: '< 5 doctors', accent: 'var(--red)' },
    { label: 'Critical Zones',  value: stats.critical_zones,  note: 'no ICU',       accent: 'var(--amber)' },
    { label: 'Good Coverage',   value: stats.good,            note: 'fully equipped', accent: 'var(--green)' },
  ];

  return (
    <>
      <Head><title>Dashboard — HealthcareAI</title></Head>
      <div className="container" style={{ padding: '40px 24px 60px' }}>

        {/* Header */}
        <div className="fade" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>Dashboard</h1>
            {live !== null && (
              <span className={`badge badge-${live ? 'ok' : 'warn'}`} style={{ fontSize: 10 }}>
                <span className="dot" style={{ width: 5, height: 5, background: live ? 'var(--green)' : 'var(--amber)' }} />
                {live ? 'Live' : 'Demo'}
              </span>
            )}
          </div>
          <p className="page-sub">Real-time hospital analytics across India's healthcare network</p>
        </div>

        {/* Stat row */}
        <div className="grid-4 fade fade-1" style={{ marginBottom: 28 }}>
          {STATS.map(s => (
            <div key={s.label} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: s.accent || 'var(--t1)', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="fade fade-2" style={{ marginBottom: 28 }}>
          <p className="section-label">Quick Actions</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { href: '/upload',  label: 'Upload documents' },
              { href: '/extract', label: 'Extract hospital data' },
              { href: '/rag',     label: 'Query knowledge base' },
              { href: '/map',     label: 'View coverage map' },
              { href: '/results', label: 'Browse all results' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="btn btn-ghost">{l.label}</Link>
            ))}
          </div>
        </div>

        {/* Two columns */}
        <div className="grid-2 fade fade-3" style={{ marginBottom: 28, alignItems: 'start' }}>
          {/* Alerts */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>Active Alerts</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {[
                { color: 'var(--red)',   label: 'Medical Desert', msg: 'Barmer PHC — 2 doctors for 12,000 people', time: '2m' },
                { color: 'var(--red)',   label: 'Critical Zone',   msg: 'Vidarbha — no ICU, no ambulances',         time: '5m' },
                { color: 'var(--amber)', label: 'High Occupancy',  msg: 'Pune City Hospital at 87% capacity',       time: '12m' },
                { color: 'var(--amber)', label: 'Equipment Gap',   msg: 'Jharkhand PHC missing ventilator',         time: '18m' },
                { color: 'var(--green)', label: 'Full Coverage',   msg: 'AIIMS Delhi — 500k+ served',               time: '25m' },
              ].map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 20px',
                  borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>{a.label} </span>
                    <span style={{ fontSize: 12, color: 'var(--t2)' }}>{a.msg}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--t3)', flexShrink: 0 }}>{a.time} ago</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>Pipeline Status</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {[
                'Data Ingestion', 'AI Extraction', 'RAG Indexing', 'Detection Logic', 'Map Rendering',
              ].map((p, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 20px',
                  borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ fontSize: 13, color: 'var(--t2)' }}>{p}</span>
                  <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
                    Active
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>
                {live === true  && 'Connected to backend API'}
                {live === false && 'Backend offline — showing demo data'}
                {live === null  && 'Connecting…'}
              </span>
            </div>
          </div>
        </div>

        {/* Hospital table */}
        <div className="fade fade-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p className="section-label" style={{ marginBottom: 0 }}>Hospital Registry</p>
            <Link href="/results" style={{ fontSize: 12, color: 'var(--blue)' }}>View all →</Link>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 60px 60px 70px 80px',
              padding: '10px 20px', borderBottom: '1px solid var(--border)',
              fontSize: 11, fontWeight: 600, color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              <span>Name</span><span>Location</span><span>Doctors</span><span>Beds</span><span>Score</span><span>Status</span>
            </div>
            {hospitals.slice(0, 6).map((h, i) => (
              <div key={h.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 60px 60px 70px 80px',
                padding: '12px 20px',
                borderBottom: i < Math.min(hospitals.length, 6) - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>{h.name}</span>
                <span style={{ fontSize: 12, color: 'var(--t2)' }}>{h.location}</span>
                <span style={{ fontSize: 13, color: 'var(--t1)' }}>{h.doctors}</span>
                <span style={{ fontSize: 13, color: 'var(--t1)' }}>{h.beds || '—'}</span>
                <div>
                  {h.score !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 3, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden', maxWidth: 40 }}>
                        <div style={{ height: '100%', width: `${h.score}%`, background: STATUS_DOT[h.status] || 'var(--blue)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--t3)' }}>{h.score}</span>
                    </div>
                  )}
                </div>
                <span className={`badge badge-${h.status === 'Good' ? 'good' : h.status === 'Medium' ? 'medium' : h.status === 'Critical' ? 'critical' : 'desert'}`}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_DOT[h.status], display: 'inline-block' }} />
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
