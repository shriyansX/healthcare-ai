const ALERTS = [
  { type: 'danger',  icon: '🔴', title: 'Medical Desert Detected',  msg: 'Barmer PHC has only 2 doctors for 12,000 people' },
  { type: 'danger',  icon: '🔴', title: 'Critical Zone',             msg: 'Vidarbha Rural Clinic: No ICU, no ambulances' },
  { type: 'warning', icon: '🟡', title: 'Low Resource Alert',        msg: 'Pune City Hospital bed occupancy at 87%' },
  { type: 'success', icon: '🟢', title: 'Excellent Coverage',        msg: 'AIIMS Delhi serves 500k+ with full equipment' },
];

const COLORS = {
  danger:  { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  text: '#fca5a5' },
  warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#fcd34d' },
  success: { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.25)',  text: '#86efac' },
};

export default function AlertPanel({ alerts = ALERTS }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {alerts.map((a, i) => {
        const c = COLORS[a.type] || COLORS['warning'];
        return (
          <div key={i} style={{
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>{a.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: c.text }}>{a.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>{a.msg}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
