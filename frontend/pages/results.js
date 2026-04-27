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

const STATUS_ORDER = ['Medical Desert', 'Critical', 'Medium', 'Good'];

export default function ResultsPage() {
  const [hospitals, setHospitals] = useState(FALLBACK);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('status');

  useEffect(() => {
    api.getHospitals().then(setHospitals).catch(() => {});
  }, []);

  let displayed = filter === 'all' ? hospitals : hospitals.filter(h => h.status === filter);
  if (sortBy === 'status')   displayed = [...displayed].sort((a,b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  if (sortBy === 'doctors')  displayed = [...displayed].sort((a,b) => b.doctors - a.doctors);
  if (sortBy === 'score')    displayed = [...displayed].sort((a,b) => (b.score||0) - (a.score||0));

  const counts = {
    all: hospitals.length,
    'Medical Desert': hospitals.filter(h=>h.status==='Medical Desert').length,
    Critical: hospitals.filter(h=>h.status==='Critical').length,
    Medium: hospitals.filter(h=>h.status==='Medium').length,
    Good: hospitals.filter(h=>h.status==='Good').length,
  };

  return (
    <>
      <Head>
        <title>Results — Healthcare AI</title>
        <meta name="description" content="Filtered and sorted hospital analysis results" />
      </Head>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="page-title">📋 Analysis Results</h1>
        <p className="page-subtitle">Browse, filter, and sort all analysed hospitals</p>

        {/* Controls */}
        <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
            {Object.entries(counts).map(([k, v]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`btn ${filter === k ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize:'0.8rem', padding:'0.4rem 0.85rem' }}>
                {k === 'all' ? '🌐 All' : k} ({v})
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ background:'#111827', border:'1px solid #1e293b', borderRadius:'8px', padding:'0.5rem 0.85rem', color:'#f1f5f9', fontSize:'0.85rem', cursor:'pointer' }}>
            <option value="status">Sort: By Status (worst first)</option>
            <option value="doctors">Sort: Most Doctors</option>
            <option value="score">Sort: Quality Score</option>
          </select>
          <span style={{ fontSize:'0.82rem', color:'#64748b', marginLeft:'auto' }}>
            {displayed.length} hospital{displayed.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Results grid */}
        <div className="grid-3">
          {displayed.map(h => <HospitalCard key={h.id} hospital={h} />)}
        </div>

        {displayed.length === 0 && (
          <div style={{ textAlign:'center', padding:'3rem', color:'#64748b' }}>
            <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>🔍</div>
            <div>No hospitals match this filter</div>
          </div>
        )}
      </div>
    </>
  );
}
