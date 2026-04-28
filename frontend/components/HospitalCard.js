const STATUS_META = {
  Good:             { cls: 'badge-good',     dot: '#22c55e', barColor: '#22c55e', icon: '🟢' },
  Medium:           { cls: 'badge-medium',   dot: '#f59e0b', barColor: '#f59e0b', icon: '🟡' },
  Critical:         { cls: 'badge-critical', dot: '#ef4444', barColor: '#ef4444', icon: '⚠️' },
  'Medical Desert': { cls: 'badge-desert',   dot: '#dc2626', barColor: '#dc2626', icon: '🔴' },
};

export default function HospitalCard({ hospital }) {
  const meta = STATUS_META[hospital.status] || STATUS_META['Medium'];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        borderRadius: '14px 14px 0 0',
        background: meta.dot,
        opacity: 0.6,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '0.25rem' }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '0.75rem' }}>
          <h3 style={{ fontSize: '0.97rem', fontWeight: 700, marginBottom: '0.2rem', lineHeight: 1.3 }}>
            {hospital.name}
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>📍</span> {hospital.location}
          </p>
        </div>
        <span className={`badge ${meta.cls}`} style={{ flexShrink: 0, fontSize: '0.67rem' }}>
          {meta.icon} {hospital.status}
        </span>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.45rem' }}>
        {[
          { icon: '👨‍⚕️', label: 'Doctors',   value: hospital.doctors },
          { icon: '🛏',   label: 'Beds',       value: hospital.beds || '—' },
          { icon: '🚑',   label: 'Ambulances', value: hospital.ambulances ?? '—' },
          { icon: '👥',   label: 'Population', value: hospital.population_served ? `${(hospital.population_served/1000).toFixed(0)}K` : '—' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(10,15,30,0.6)',
            borderRadius: '8px', padding: '0.55rem 0.7rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            border: '1px solid rgba(30,41,59,0.7)',
          }}>
            <span style={{ fontSize: '1rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#475569', lineHeight: 1 }}>{s.label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.3 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment chips */}
      {hospital.equipment?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {hospital.equipment.slice(0, 6).map(e => (
            <span key={e} className="chip" style={{ fontSize: '0.67rem', padding: '0.15rem 0.55rem' }}>{e}</span>
          ))}
          {hospital.equipment.length > 6 && (
            <span className="chip" style={{ fontSize: '0.67rem', padding: '0.15rem 0.55rem', opacity: 0.6 }}>
              +{hospital.equipment.length - 6}
            </span>
          )}
        </div>
      )}

      {/* Score bar */}
      {hospital.score !== undefined && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', marginBottom: '0.3rem' }}>
            <span style={{ color: '#64748b' }}>Quality Score</span>
            <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{hospital.score}/100</span>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.8)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
            <div style={{
              height: '5px', borderRadius: '999px',
              width: `${hospital.score}%`,
              background: meta.barColor,
              boxShadow: `0 0 6px ${meta.dot}60`,
              transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
