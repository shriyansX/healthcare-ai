import Head from 'next/head';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const FALLBACK = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', doctors:320, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', doctors:3, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', doctors:45, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU','X-ray','Lab'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', doctors:2, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', doctors:210, beds:800, ambulances:15, population_served:300000, equipment:['MRI','ICU','NICU','Ventilator','Dialysis'], status:'Good', score:95 },
];

const STATUS_ORDER = { 'Medical Desert': 0, Critical: 1, Medium: 2, Good: 3 };
const STATUS_DOT   = { Good: 'var(--green)', Medium: 'var(--amber)', Critical: 'var(--red)', 'Medical Desert': 'var(--red-deep)' };
const STATUS_CLS   = { Good: 'badge-good', Medium: 'badge-medium', Critical: 'badge-critical', 'Medical Desert': 'badge-desert' };

const FILTERS = ['All', 'Medical Desert', 'Critical', 'Medium', 'Good'];

export default function ResultsPage() {
  const [hospitals, setHospitals] = useState(FALLBACK);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('All');
  const [sort, setSort]           = useState('status');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    api.getHospitals().then(setHospitals).catch(() => {}).finally(() => setLoading(false));
  }, []);

  let list = hospitals;
  if (filter !== 'All')  list = list.filter(h => h.status === filter);
  if (search.trim())     list = list.filter(h => `${h.name} ${h.location}`.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'status') list = [...list].sort((a,b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  if (sort === 'doctors')list = [...list].sort((a,b) => b.doctors - a.doctors);
  if (sort === 'score')  list = [...list].sort((a,b) => (b.score||0) - (a.score||0));

  const counts = FILTERS.reduce((o, f) => {
    o[f] = f === 'All' ? hospitals.length : hospitals.filter(h => h.status === f).length;
    return o;
  }, {});

  return (
    <>
      <Head><title>Results — HealthcareAI</title></Head>
      <div className="container" style={{ padding: '40px 24px 60px' }}>

        <div className="fade">
          <h1 className="page-title">Results</h1>
          <p className="page-sub">Browse, filter and sort all analysed hospitals</p>
        </div>

        {/* Controls */}
        <div className="fade fade-1" style={{
          display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hospitals…"
            style={{ width: 200, flex: 'none' }}
          />
          <div style={{ display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: 12, padding: '5px 10px' }}>
                {f} {counts[f] > 0 && <span style={{ opacity: 0.65 }}>({counts[f]})</span>}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto', fontSize: 12, padding: '6px 10px' }}>
            <option value="status">Sort: Status</option>
            <option value="doctors">Sort: Doctors</option>
            <option value="score">Sort: Score</option>
          </select>
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>{list.length} results</span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>
        ) : list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--t3)', fontSize: 13 }}>No hospitals match this filter</div>
        ) : (
          <div className="card fade fade-2" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 70px 70px 120px 90px',
              padding: '10px 20px', borderBottom: '1px solid var(--border)',
              fontSize: 11, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              <span>Hospital</span><span>Location</span><span>Doctors</span><span>Beds</span><span>Equipment</span><span>Status</span>
            </div>
            {list.map((h, i) => (
              <div key={h.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 70px 70px 120px 90px',
                padding: '12px 20px', alignItems: 'center',
                borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.1s',
                animation: `fadeUp 0.2s ease ${i * 0.03}s both`,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)', marginBottom: 1 }}>{h.name}</div>
                  {h.score !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 36, height: 2, background: 'var(--bg-3)', borderRadius: 1, overflow: 'hidden' }}>
                        <div style={{ width: `${h.score}%`, height: '100%', background: STATUS_DOT[h.status] }} />
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{h.score}</span>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 12, color: 'var(--t2)' }}>{h.location}</span>
                <span style={{ fontSize: 13, color: 'var(--t1)' }}>{h.doctors}</span>
                <span style={{ fontSize: 13, color: 'var(--t1)' }}>{h.beds || '—'}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {(h.equipment || []).slice(0, 3).map(e => (
                    <span key={e} className="chip" style={{ fontSize: 10 }}>{e}</span>
                  ))}
                  {(h.equipment || []).length > 3 && (
                    <span className="chip" style={{ fontSize: 10, opacity: 0.5 }}>+{h.equipment.length - 3}</span>
                  )}
                </div>
                <span className={`badge ${STATUS_CLS[h.status] || 'badge-medium'}`}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_DOT[h.status] }} />
                  {h.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
