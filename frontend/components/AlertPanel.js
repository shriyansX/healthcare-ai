const ALERTS = [
  { type: 'danger',  icon: '🔴', title: 'Medical Desert Detected',    msg: 'Barmer PHC — only 2 doctors for 12,000 people', time: '2 min ago' },
  { type: 'danger',  icon: '🔴', title: 'Critical Zone Alert',         msg: 'Vidarbha: No ICU, no ambulances available',       time: '5 min ago' },
  { type: 'warning', icon: '🟡', title: 'High Occupancy Warning',      msg: 'Pune City Hospital at 87% bed capacity',          time: '12 min ago' },
  { type: 'warning', icon: '🟡', title: 'Equipment Deficit',           msg: 'Jharkhand PHC missing CT scan & ventilator',      time: '18 min ago' },
  { type: 'success', icon: '🟢', title: 'Full Coverage Active',        msg: 'AIIMS Delhi — 500k+ served with full equipment',  time: '25 min ago' },
];

const COLORS = {
  danger:  { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.25)',  titleColor: '#fca5a5' },
  warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', titleColor: '#fcd34d' },
  success: { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  titleColor: '#86efac' },
};

export default function AlertPanel({ alerts = ALERTS }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      {alerts.map((a, i) => {
        const c = COLORS[a.type] || COLORS.warning;
        return (
          <div
            key={i}
            className={`alert-item alert-${a.type === 'danger' ? 'critical' : a.type === 'warning' ? 'warning' : 'info'}`}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              animation: `fadeInUp 0.35s ease ${i * 0.06}s both`,
            }}
          >
            <span style={{ fontSize: '1.05rem', marginTop: '1px', flexShrink: 0 }}>{a.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.83rem', color: c.titleColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {a.title}
                </div>
                {a.time && (
                  <span style={{ fontSize: '0.68rem', color: '#475569', flexShrink: 0 }}>{a.time}</span>
                )}
              </div>
              <div style={{ fontSize: '0.77rem', color: '#94a3b8', marginTop: '0.1rem', lineHeight: 1.4 }}>{a.msg}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
