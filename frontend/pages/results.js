import Head from 'next/head';
import { useEffect, useState } from 'react';
import HospitalCard from '../components/HospitalCard';
import { api } from '../lib/api';

const FALLBACK = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', doctors:320, nurses:850, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', doctors:3, nurses:5, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', doctors:45, nurses:120, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU','X-ray','Lab','Pharmacy'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', doctors:2, nurses:4, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', doctors:210, nurses:600, beds:800, ambulances:15, population_served:300000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab','Dialysis'], status:'Good', score:95 },
];

const STATUS_ORDER = { 'Medical Desert': 0, Critical: 1, Medium: 2, Good: 3 };
const STATUS_CONFIG = {
  'Medical Desert': { icon: '🔴', color: '#f87171', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.3)' },
  Critical:         { icon: '⚠️', color: '#fca5a5', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
  Medium:           { icon: '🟡', color: '#fcd34d', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  Good:             { icon: '🟢', color: '#86efac', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)' },
};

export default function ResultsPage() {
  const [hospitals, setHospitals] = useState(FALLBACK);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [sortBy, setSortBy]       = useState('status');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    api.getHospitals()
      .then(setHospitals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  let displayed = hospitals;
  if (filter !== 'all') displayed = displayed.filter(h => h.status === filter);
  if (search.trim())    displayed = displayed.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );
  if (sortBy === 'status')    displayed = [...displayed].sort((a,b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  else if (sortBy === 'doctors') displayed = [...displayed].sort((a,b) => b.doctors - a.doctors);
  else if (sortBy === 'score')   displayed = [...displayed].sort((a,b) => (b.score||0) - (a.score||0));
  else if (sortBy === 'beds')    displayed = [...displayed].sort((a,b) => b.beds - a.beds);

  const counts = {
    all: hospitals.length,
    'Medical Desert': hospitals.filter(h => h.status === 'Medical Desert').length,
    Critical: hospitals.filter(h => h.status === 'Critical').length,
    Medium:   hospitals.filter(h => h.status === 'Medium').length,
    Good:     hospitals.filter(h => h.status === 'Good').length,
  };

  return (
    <>
      <Head>
        <title>Results — Healthcare AI</title>
        <meta name="description" content="Filtered and sorted hospital analysis results" />
      </Head>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">📋 Analysis Results</h1>
          <p className="page-subtitle">Browse, filter, and sort all analysed hospitals across India</p>
        </div>

        {/* Status summary strip */}
        <div className="fade-in fade-in-delay-1" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem',
        }}>
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? 'all' : status)}
              style={{
                background: filter === status ? cfg.bg : 'rgba(15,23,42,0.6)',
                border: `1px solid ${filter === status ? cfg.border : 'rgba(30,41,59,0.8)'}`,
                borderRadius: '12px', padding: '0.9rem 1rem',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
                textAlign: 'left', backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={e => { if (filter !== status) { e.currentTarget.style.borderColor=cfg.border; e.currentTarget.style.background=`${cfg.bg.slice(0,-2)}08)`; }}}
              onMouseLeave={e => { if (filter !== status) { e.currentTarget.style.borderColor='rgba(30,41,59,0.8)'; e.currentTarget.style.background='rgba(15,23,42,0.6)'; }}}
            >
              <span style={{ fontSize: '1.3rem' }}>{cfg.icon}</span>
              <span style={{ fontWeight: 800, fontSize: '1.5rem', color: cfg.color, lineHeight: 1 }}>{counts[status]}</span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{status}</span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="fade-in fade-in-delay-2" style={{
          display: 'flex', gap: '0.75rem', marginBottom: '1.5rem',
          flexWrap: 'wrap', alignItems: 'center',
          background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(30,41,59,0.8)',
          borderRadius: '12px', padding: '0.85rem 1rem',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Search */}
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '0.9rem' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hospitals or locations…"
              style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
            />
          </div>

          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['all', 'Medical Desert', 'Critical', 'Medium', 'Good'].map(k => (
              <button key={k} onClick={() => setFilter(k)}
                className={`btn ${filter === k ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.76rem', padding: '0.38rem 0.8rem' }}>
                {k === 'all' ? '🌐 All' : k} ({counts[k] ?? counts.all})
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ fontSize: '0.82rem', paddingRight: '1.5rem', width: 'auto', minWidth: '180px' }}
            >
              <option value="status">Sort: By Status (worst first)</option>
              <option value="doctors">Sort: Most Doctors</option>
              <option value="score">Sort: Quality Score</option>
              <option value="beds">Sort: Most Beds</option>
            </select>
          </div>

          <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            {loading ? 'Loading…' : `${displayed.length} hospital${displayed.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner" />
        ) : displayed.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#64748b' }}>
            <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>No hospitals match this filter</div>
            <div style={{ fontSize: '0.85rem' }}>Try adjusting your search or filter criteria</div>
          </div>
        ) : (
          <div className="grid-3 fade-in fade-in-delay-3">
            {displayed.map((h, i) => (
              <div key={h.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.04}s both` }}>
                <HospitalCard hospital={h} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
