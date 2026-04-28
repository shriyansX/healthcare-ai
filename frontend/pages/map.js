import Head from 'next/head';
import { useState } from 'react';
import MapView from '../components/MapView';

const FILTERS = [
  { label: '🌐 All',            value: 'all' },
  { label: '🔴 Medical Desert', value: 'Medical Desert' },
  { label: '⚠️ Critical',       value: 'Critical' },
  { label: '🟡 Medium',         value: 'Medium' },
  { label: '🟢 Good',           value: 'Good' },
];

const LEGEND = [
  { color: '#22c55e', label: 'Good',           desc: 'Full equipment, 15+ doctors' },
  { color: '#f59e0b', label: 'Medium',          desc: 'Some coverage gaps' },
  { color: '#ef4444', label: 'Critical',         desc: 'Missing ICU or key equipment' },
  { color: '#dc2626', label: 'Medical Desert',   desc: 'Fewer than 5 doctors' },
];

export default function MapPage() {
  const [filter, setFilter] = useState('all');

  return (
    <>
      <Head>
        <title>Map — Healthcare AI</title>
        <meta name="description" content="Interactive map of hospital coverage across India" />
      </Head>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        {/* Header */}
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <h1 className="page-title">🗺️ Healthcare Coverage Map</h1>
          <p className="page-subtitle">
            Click markers to view hospital details. Circle size reflects doctor count.
          </p>
        </div>

        {/* Filter controls */}
        <div className="fade-in fade-in-delay-1" style={{
          display: 'flex', gap: '0.5rem', marginBottom: '1.25rem',
          flexWrap: 'wrap', alignItems: 'center',
          background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(30,41,59,0.8)',
          borderRadius: '12px', padding: '0.75rem 1rem',
          backdropFilter: 'blur(10px)',
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginRight: '0.25rem' }}>Filter:</span>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`btn ${filter === f.value ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Map container */}
        <div className="card fade-in fade-in-delay-2" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <MapView filter={filter} />
        </div>

        {/* Legend + stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="fade-in fade-in-delay-3">
          {/* Legend */}
          <div className="card">
            <div className="section-title">🎨 Map Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {LEGEND.map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: l.color, flexShrink: 0,
                    boxShadow: `0 0 8px ${l.color}50`,
                  }} />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f1f5f9' }}>{l.label}</div>
                    <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{l.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(30,41,59,0.8)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <strong style={{ color: '#94a3b8' }}>Circle size</strong> = number of doctors (larger = more)
                </div>
              </div>
            </div>
          </div>

          {/* How to use */}
          <div className="card">
            <div className="section-title">💡 Map Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { icon: '🖱️', tip: 'Click any circle to see hospital details' },
                { icon: '🔍', tip: 'Scroll to zoom in/out on regions' },
                { icon: '🏃', tip: 'Drag the map to pan across India' },
                { icon: '🔘', tip: 'Use filter buttons to focus on specific status' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{t.tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
