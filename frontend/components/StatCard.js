export default function StatCard({ icon, label, value, sub, color = '#3b82f6', trend }) {
  return (
    <div className="stat-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{
        width: 54, height: 54, borderRadius: '14px', flexShrink: 0,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.55rem',
        boxShadow: `0 4px 16px ${color}15`,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1, color: '#f1f5f9' }}>{value}</div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>{label}</div>
        {sub && (
          <div style={{ fontSize: '0.72rem', color, marginTop: '0.18rem', fontWeight: 700 }}>{sub}</div>
        )}
      </div>
    </div>
  );
}
