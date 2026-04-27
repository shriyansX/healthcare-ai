import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_COLOR = {
  Good: '#22c55e',
  Medium: '#f59e0b',
  Critical: '#ef4444',
  'Medical Desert': '#dc2626',
};

export default function LeafletMapInner({ hospitals }) {
  return (
    <MapContainer
      center={[22.5, 80.0]}
      zoom={5}
      style={{ height: '520px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map(h => (
        <CircleMarker
          key={h.id}
          center={[h.lat, h.lng]}
          radius={h.doctors > 100 ? 14 : h.doctors > 20 ? 10 : 7}
          pathOptions={{
            color: STATUS_COLOR[h.status] || '#94a3b8',
            fillColor: STATUS_COLOR[h.status] || '#94a3b8',
            fillOpacity: 0.85,
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ minWidth: '180px' }}>
              <strong style={{ fontSize: '0.95rem' }}>{h.name}</strong><br />
              <span style={{ color: STATUS_COLOR[h.status], fontWeight: 700 }}>{h.status}</span><br />
              👨‍⚕️ {h.doctors} doctors<br />
              🏥 {h.equipment.join(', ')}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
