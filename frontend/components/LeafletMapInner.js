import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_COLOR = {
  Good:             '#22c55e',
  Medium:           '#f59e0b',
  Critical:         '#ef4444',
  'Medical Desert': '#dc2626',
};

function dotRadius(doctors) {
  if (doctors >= 200) return 16;
  if (doctors >= 50)  return 11;
  if (doctors >= 10)  return 8;
  return 6;
}

export default function LeafletMapInner({ hospitals }) {
  return (
    <MapContainer
      center={[22.5, 80.0]}
      zoom={5}
      style={{ height: 500, width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      {hospitals.map(h => {
        const color = STATUS_COLOR[h.status] || '#94a3b8';
        return (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lng]}
            radius={dotRadius(h.doctors)}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.8, weight: 1.5 }}
          >
            <Popup minWidth={190}>
              <div style={{ fontFamily: 'Inter, sans-serif', padding: '4px 2px' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#f4f4f5', marginBottom: 4 }}>{h.name}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 8,
                  fontSize: 11, fontWeight: 600, color,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                  {h.status}
                </div>
                <div style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.7 }}>
                  <div>{h.doctors} doctors</div>
                  <div>{(h.equipment || []).slice(0, 4).join(', ')}{(h.equipment || []).length > 4 ? ` +${h.equipment.length - 4}` : ''}</div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
