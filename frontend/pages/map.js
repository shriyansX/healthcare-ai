import Head from 'next/head';
import { useState } from 'react';
import MapView from '../components/MapView';

const FILTERS = [
  { label: 'All',            value: 'all' },
  { label: 'Medical Desert', value: 'Medical Desert' },
  { label: 'Critical',       value: 'Critical' },
  { label: 'Medium',         value: 'Medium' },
  { label: 'Good',           value: 'Good' },
];

const LEGEND = [
  { color: 'var(--green)', label: 'Good',           desc: '15+ doctors, full equipment' },
  { color: 'var(--amber)', label: 'Medium',          desc: 'Partial coverage gaps' },
  { color: 'var(--red)',   label: 'Critical',         desc: 'Missing ICU or key equipment' },
  { color: '#dc2626',      label: 'Medical Desert',   desc: 'Fewer than 5 doctors' },
];

export default function MapPage() {
  const [filter, setFilter] = useState('all');

  return (
    <>
      <Head><title>Map — HealthcareAI</title></Head>
      <div className="container" style={{ padding: '40px 24px 60px' }}>

        <div className="fade">
          <h1 className="page-title">Coverage Map</h1>
          <p className="page-sub">Interactive hospital map. Click markers to view details. Circle size = doctor count.</p>
        </div>

        {/* Controls */}
        <div className="fade fade-1" style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--t3)', marginRight: 4 }}>Filter:</span>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`btn ${filter === f.value ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: 12, padding: '5px 10px' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="card fade fade-2" style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
          <MapView filter={filter} />
        </div>

        {/* Legend + tips */}
        <div className="grid-2 fade fade-3" style={{ alignItems: 'start' }}>
          <div className="card" style={{ padding: '14px 18px' }}>
            <p className="section-label">Legend</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LEGEND.map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t1)' }}>{l.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--t3)', marginLeft: 6 }}>{l.desc}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--t3)' }}>
                Circle size reflects doctor count
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '14px 18px' }}>
            <p className="section-label">Tips</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Click', 'a circle to see hospital details'],
                ['Scroll', 'to zoom in or out on regions'],
                ['Drag', 'to pan across the map'],
                ['Filter', 'to focus on a specific status tier'],
              ].map(([k, v]) => (
                <div key={k} style={{ fontSize: 13, color: 'var(--t2)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{k}</span> {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
