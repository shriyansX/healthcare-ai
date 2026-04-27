export default function StatCard({ icon, label, value, sub, color = '#3b82f6' }) {
  return (
    <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{
        width: 52, height: 52, borderRadius: '12px', flexShrink: 0,
        background: `${color}22`,
        border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color, marginTop: '0.15rem', fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}
