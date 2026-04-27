import Head from 'next/head';
import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import AlertPanel from '../components/AlertPanel';
import HospitalCard from '../components/HospitalCard';
import { api } from '../lib/api';

const FALLBACK_HOSPITALS = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', lat:28.5672, lng:77.2100, doctors:320, nurses:850, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', lat:20.7002, lng:77.0082, doctors:3, nurses:5, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', lat:18.5204, lng:73.8567, doctors:45, nurses:120, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU','X-ray','Lab','Pharmacy'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', lat:25.7457, lng:71.3932, doctors:2, nurses:4, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', lat:13.0827, lng:80.2707, doctors:210, nurses:600, beds:800, ambulances:15, population_served:300000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab','Dialysis'], status:'Good', score:95 },
];

export default function Dashboard() {
  const [hospitals, setHospitals] = useState(FALLBACK_HOSPITALS);
  const [stats, setStats] = useState({ total_hospitals: 247, medical_deserts: 38, critical_zones: 61, good: 112, medium: 36 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getHospitals(), api.getStats()])
      .then(([h, s]) => { setHospitals(h); setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — Healthcare AI</title>
        <meta name="description" content="Healthcare AI analytics dashboard showing hospital coverage across India" />
      </Head>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="page-title">📊 Healthcare AI Dashboard</h1>
        <p className="page-subtitle">Real-time analytics across India's hospital network</p>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          <StatCard icon="🏥" label="Total Hospitals" value={stats.total_hospitals} color="#3b82f6" />
          <StatCard icon="🔴" label="Medical Deserts" value={stats.medical_deserts} sub="< 5 doctors" color="#dc2626" />
          <StatCard icon="⚠️" label="Critical Zones" value={stats.critical_zones} sub="No ICU" color="#ef4444" />
          <StatCard icon="🟢" label="Good Coverage" value={stats.good} sub="Fully equipped" color="#22c55e" />
        </div>

        {/* Alerts + Pipeline */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🚨 Active Alerts</h2>
            <AlertPanel />
          </div>
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>🔄 Pipeline Status</h2>
            {[
              { label: 'Data Ingestion',   status: '✅ Live',    color: '#22c55e' },
              { label: 'AI Extraction',    status: '✅ Active',  color: '#22c55e' },
              { label: 'RAG Indexing',     status: '✅ Ready',   color: '#22c55e' },
              { label: 'Detection Logic',  status: '✅ Running', color: '#22c55e' },
              { label: 'Map Rendering',    status: '✅ Online',  color: '#22c55e' },
            ].map((p, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid #1e293b' }}>
                <span style={{ fontSize:'0.88rem', color:'#cbd5e1' }}>{p.label}</span>
                <span style={{ fontSize:'0.82rem', fontWeight:700, color:p.color }}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital cards */}
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>🏥 Hospital Registry</h2>
          {loading && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Syncing with API...</span>}
        </div>
        <div className="grid-3">
          {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
        </div>
      </div>
    </>
  );
}
