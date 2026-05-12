import dynamic from 'next/dynamic';

const HOSPITALS = [
  { id: 1, name: 'AIIMS Delhi', lat: 28.5672, lng: 77.2100, status: 'Good', doctors: 320, equipment: ['MRI','CT scan','ICU','Ventilator','NICU'] },
  { id: 2, name: 'Rural Clinic Vidarbha', lat: 20.7002, lng: 77.0082, status: 'Medical Desert', doctors: 3, equipment: ['X-ray'] },
  { id: 3, name: 'City Hospital Pune', lat: 18.5204, lng: 73.8567, status: 'Good', doctors: 45, equipment: ['MRI','CT scan','ICU'] },
  { id: 4, name: 'PHC Barmer', lat: 25.7457, lng: 71.3932, status: 'Medical Desert', doctors: 2, equipment: ['X-ray'] },
  { id: 5, name: 'Apollo Chennai', lat: 13.0827, lng: 80.2707, status: 'Good', doctors: 210, equipment: ['MRI','ICU','NICU','Ventilator'] },
  { id: 6, name: 'KEM Hospital Mumbai', lat: 18.9933, lng: 72.8397, status: 'Good', doctors: 180, equipment: ['MRI','ICU','CT scan'] },
  { id: 7, name: 'Rural PHC Jharkhand', lat: 23.6102, lng: 85.2799, status: 'Critical', doctors: 6, equipment: ['X-ray','Lab'] },
  { id: 8, name: 'District Hospital Guwahati', lat: 26.1445, lng: 91.7362, status: 'Medium', doctors: 28, equipment: ['X-ray','Lab','CT scan'] },
  { id: 9, name: 'Mehta Hospital Jaipur', lat: 26.9124, lng: 75.7873, status: 'Medium', doctors: 35, equipment: ['MRI','X-ray','Lab'] },
  { id: 10, name: 'CHC Chhattisgarh', lat: 21.2787, lng: 81.8661, status: 'Critical', doctors: 7, equipment: ['X-ray'] },
];

export { HOSPITALS };

const STATUS_COLOR = {
  Good: '#22c55e',
  Medium: '#f59e0b',
  Critical: '#ef4444',
  'Medical Desert': '#dc2626',
};

// Only render Leaflet map on client side (no SSR)
const LeafletMap = dynamic(() => import('./LeafletMapInner'), { ssr: false });

export default function MapView({ filter = 'all' }) {
  const hospitals = filter === 'all' ? HOSPITALS : HOSPITALS.filter(h => h.status === filter);
  return <LeafletMap hospitals={hospitals} />;
}
