import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_COLOR = {
  Good:             '#10b981',
  Medium:           '#f59e0b',
  Critical:         '#ef4444',
  'Medical Desert': '#dc2626',
};

function r(doctors) {
  if (doctors >= 200) return 18;
  if (doctors >= 50)  return 13;
  if (doctors >= 10)  return 9;
  return 7;
}

export default function LeafletMapInner({ hospitals }) {
  return (
    <MapContainer center={[22.5, 80.0]} zoom={5} style={{ height: 520, width: '100%' }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="" />
      {hospitals.map(h => {
        const c = STATUS_COLOR[h.status] || '#94a3b8';
        return (
          <CircleMarker key={h.id} center={[h.lat, h.lng]} radius={r(h.doctors)}
            pathOptions={{ color: c, fillColor: c, fillOpacity: 0.82, weight: 2, opacity: 1 }}
          >
            <Popup minWidth={200}>
              <div style={{ fontFamily:'Inter,sans-serif', padding:'6px 2px' }}>
                <div style={{ fontWeight:800, fontSize:14, color:'#f1f5f9', marginBottom:6 }}>{h.name}</div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:c, marginBottom:10, background:`${c}15`, padding:'3px 9px', borderRadius:999 }}>
                  <span style={{ width:5,height:5,borderRadius:'50%',background:c }} />{h.status}
                </div>
                <div style={{ fontSize:12.5, color:'#94a3b8', lineHeight:1.7 }}>
                  <div><span style={{ color:'#e2e8f0', fontWeight:600 }}>{h.doctors}</span> doctors</div>
                  {h.equipment?.length > 0 && <div>{h.equipment.slice(0,4).join(', ')}{h.equipment.length>4 ? ` +${h.equipment.length-4}`:''}</div>}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
