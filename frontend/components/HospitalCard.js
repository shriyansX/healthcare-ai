const STATUS_META = {
  Good:           { cls: 'badge-good',     dot: '#22c55e' },
  Medium:         { cls: 'badge-medium',   dot: '#f59e0b' },
  Critical:       { cls: 'badge-critical', dot: '#ef4444' },
  'Medical Desert':{ cls: 'badge-desert',  dot: '#dc2626' },
};

export default function HospitalCard({ hospital }) {
  const meta = STATUS_META[hospital.status] || STATUS_META['Medium'];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{hospital.name}</h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>📍 {hospital.location}</p>
        </div>
        <span className={`badge ${meta.cls}`}>{hospital.status}</span>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.5rem' }}>
        {[
          { icon: '👨‍⚕️', label: 'Doctors',    value: hospital.doctors },
          { icon: '🛏', label: 'Beds',        value: hospital.beds },
          { icon: '🚑', label: 'Ambulances',  value: hospital.ambulances },
          { icon: '👥', label: 'Population',  value: hospital.population_served?.toLocaleString() ?? '—' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.6rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{s.label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment */}
      {hospital.equipment?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {hospital.equipment.map(e => (
            <span key={e} style={{
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: '6px',
              padding: '0.2rem 0.6rem',
              fontSize: '0.73rem',
              color: '#93c5fd',
            }}>{e}</span>
          ))}
        </div>
      )}

      {/* Score bar */}
      {hospital.score !== undefined && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
            <span style={{ color: '#94a3b8' }}>Quality Score</span>
            <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{hospital.score}/100</span>
          </div>
          <div style={{ background: '#1e293b', borderRadius: '999px', height: '6px' }}>
            <div style={{
              height: '6px',
              borderRadius: '999px',
              width: `${hospital.score}%`,
              background: hospital.score > 70 ? '#22c55e' : hospital.score > 40 ? '#f59e0b' : '#ef4444',
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
