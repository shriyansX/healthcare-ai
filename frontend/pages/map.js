import Head from 'next/head';
import { useState } from 'react';
import MapView from '../components/MapView';

const FILTERS = [
  { label: '🌐 All',           value: 'all' },
  { label: '🔴 Medical Desert', value: 'Medical Desert' },
  { label: '⚠️ Critical',      value: 'Critical' },
  { label: '🟡 Medium',        value: 'Medium' },
  { label: '🟢 Good',          value: 'Good' },
];

const LEGEND = [
  { color: '#22c55e', label: 'Good — full equipment, 15+ doctors' },
  { color: '#f59e0b', label: 'Medium — some gaps in coverage' },
  { color: '#ef4444', label: 'Critical — missing ICU or key equipment' },
  { color: '#dc2626', label: 'Medical Desert — fewer than 5 doctors' },
];

export default function MapPage() {
  const [filter, setFilter] = useState('all');

  return (
    <>
      <Head>
        <title>Map — Healthcare AI</title>
        <meta name="description" content="Interactive map of hospital coverage across India" />
      </Head>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 className="page-title">🗺 Healthcare Coverage Map</h1>
        <p className="page-subtitle">Click markers to view hospital details. Circle size = doctor count.</p>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`btn ${filter === f.value ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.82rem' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <MapView filter={filter} />
        </div>

        {/* Legend */}
        <div className="card" style={{ marginTop: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Legend</h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {LEGEND.map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
