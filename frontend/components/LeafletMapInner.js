import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_COLOR = {
  Good:             '#22c55e',
  Medium:           '#f59e0b',
  Critical:         '#ef4444',
  'Medical Desert': '#dc2626',
};

const STATUS_ICON = {
  Good: '🟢', Medium: '🟡', Critical: '⚠️', 'Medical Desert': '🔴',
};

function radius(doctors) {
  if (doctors >= 200) return 18;
  if (doctors >= 50)  return 13;
  if (doctors >= 10)  return 9;
  return 7;
}

export default function LeafletMapInner({ hospitals }) {
  return (
    <MapContainer
      center={[22.5, 80.0]}
      zoom={5}
      style={{ height: '540px', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map(h => {
        const color = STATUS_COLOR[h.status] || '#94a3b8';
        const r = radius(h.doctors);
        return (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lng]}
            radius={r}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.85,
              weight: 2,
              opacity: 0.95,
            }}
          >
            <Popup minWidth={200}>
              <div style={{ fontFamily: 'Inter, sans-serif', padding: '0.25rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.3rem', color: '#0f172a' }}>
                  {h.name}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: `${color}20`, border: `1px solid ${color}40`,
                  borderRadius: '6px', padding: '0.15rem 0.5rem',
                  fontSize: '0.72rem', fontWeight: 700, color,
                  marginBottom: '0.5rem',
                }}>
                  {STATUS_ICON[h.status]} {h.status}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.6 }}>
                  <div>👨‍⚕️ <strong>{h.doctors}</strong> doctors</div>
                  <div>🏥 {h.equipment?.slice(0, 4).join(', ') || 'N/A'}
                    {h.equipment?.length > 4 && ` +${h.equipment.length - 4} more`}
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
