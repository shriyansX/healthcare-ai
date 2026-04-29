const API_BASE =
  (typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) || '';

const FALLBACK_HOSPITALS = [
  { id:1, name:'AIIMS Delhi', location:'Delhi', doctors:320, beds:1000, ambulances:12, population_served:500000, equipment:['MRI','CT scan','ICU','Ventilator','NICU','Blood Bank','Lab'], status:'Good', score:92 },
  { id:2, name:'Rural Clinic Vidarbha', location:'Vidarbha, MH', doctors:3, beds:10, ambulances:0, population_served:8000, equipment:['X-ray'], status:'Medical Desert', score:8 },
  { id:3, name:'City Hospital Pune', location:'Pune, MH', doctors:45, beds:200, ambulances:5, population_served:75000, equipment:['MRI','CT scan','ICU'], status:'Good', score:71 },
  { id:4, name:'PHC Barmer', location:'Barmer, RJ', doctors:2, beds:6, ambulances:1, population_served:12000, equipment:['X-ray'], status:'Medical Desert', score:5 },
  { id:5, name:'Apollo Chennai', location:'Chennai, TN', doctors:210, beds:800, ambulances:15, population_served:300000, equipment:['MRI','ICU','NICU','Dialysis'], status:'Good', score:95 },
];

const FALLBACK_STATS = { total_hospitals: 247, medical_deserts: 38, critical_zones: 61, good: 112, medium: 36 };

// Helper to trigger demo mode banner
function triggerDemoMode() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('demoModeActivated'));
  }
}

// Mock logic for extraction
function getMockExtraction(text) {
  const t = text.toLowerCase();
  
  // Try to find doctor count
  let doctors = 10; // default
  const docMatch = text.match(/(\d+)\s+doctor/i);
  if (docMatch) doctors = parseInt(docMatch[1], 10);
  
  // Extract common equipment
  const equipment = [];
  if (t.includes('mri')) equipment.push('MRI');
  if (t.includes('ct')) equipment.push('CT Scan');
  if (t.includes('icu')) equipment.push('ICU');
  if (t.includes('ventilator')) equipment.push('Ventilator');
  if (t.includes('x-ray') || t.includes('xray')) equipment.push('X-ray');
  
  // Apply strict rules
  let status = 'Medium';
  if (doctors < 5) {
    status = 'Medical Desert';
  } else if (!t.includes('icu')) {
    status = 'Critical';
  } else if (equipment.length >= 3) {
    status = 'Good';
  }
  
  return {
    doctors,
    nurses: Math.round(doctors * 2.5),
    beds: doctors * 10,
    ambulances: Math.max(0, Math.floor(doctors / 10)),
    location: 'Sample Region',
    population_served: doctors * 2000,
    equipment,
    status,
    confidence_score: 0.94,
    raw_text: text
  };
}

async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeout);
    
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    
    // API failed -> trigger Demo Mode and return mock data based on endpoint
    triggerDemoMode();
    
    // Wait briefly to simulate network delay for AI processing
    await new Promise(r => setTimeout(r, 800));
    
    if (path === '/api/hospitals/') return FALLBACK_HOSPITALS;
    if (path === '/api/hospitals/stats/summary') return FALLBACK_STATS;
    
    if (path === '/api/extract/') {
      const body = JSON.parse(options.body || '{}');
      return getMockExtraction(body.text || '');
    }
    
    if (path === '/api/rag/query') {
      const body = JSON.parse(options.body || '{}');
      return {
        answer: `**Analysis for:** "${body.query}"\n\n**Key Findings:**\n• Rural clinics face severe shortages of specialized medical equipment.\n• Regions lacking ICUs are automatically flagged as Critical Zones.\n• A threshold of fewer than 5 doctors correlates directly with higher mortality rates in emergency situations.\n\n**Conclusion:**\nThe data indicates clear systemic gaps in healthcare coverage, requiring immediate allocation of ICU equipment and additional medical staff to the affected regions.\n\n*Confidence Score: 0.89*`,
        sources: [
          { source: 'simulated_report_2023.pdf', content: 'Rural clinics often face shortages in specialized equipment, primarily ICUs.', score: 0.89 },
          { source: 'health_data_survey.csv', content: 'Regions with fewer than 5 doctors per 10k population are classified as Medical Deserts.', score: 0.82 }
        ],
        total_documents_searched: 12,
        confidence_score: 0.89
      };
    }
    
    if (path === '/api/upload/') return []; // Mock empty docs
    if (path === '/health' || path === '/api/rag/status') return { status: 'offline' };
    
    // For anything else, return an empty object to avoid UI crashes
    return {};
  }
}

export const api = {
  // Health
  health: () => apiFetch('/health'),

  // Hospitals
  getHospitals:   () => apiFetch('/api/hospitals/'),
  getHospital:    (id) => apiFetch(`/api/hospitals/${id}`),
  createHospital: (data) => apiFetch('/api/hospitals/', { method: 'POST', body: JSON.stringify(data) }),
  getStats:       () => apiFetch('/api/hospitals/stats/summary'),

  // Extraction
  extract: (text) => apiFetch('/api/extract/', { method: 'POST', body: JSON.stringify({ text }) }),

  // RAG
  queryRAG: (query, top_k = 3) =>
    apiFetch('/api/rag/query', { method: 'POST', body: JSON.stringify({ query, top_k }) }),

  // Upload / Documents
  getDocuments: () => apiFetch('/api/upload/'),
  getDocumentStats: () => apiFetch('/api/upload/stats'),
  deleteDocument: (id) => apiFetch(`/api/upload/${id}`, { method: 'DELETE' }),
  uploadDocument: async (file) => {
    const form = new FormData();
    form.append('file', file);
    
    try {
      const res = await fetch(`${API_BASE}/api/upload/`, { method: 'POST', body: form });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch(err) {
      triggerDemoMode();
      await new Promise(r => setTimeout(r, 1000));
      return { 
        id: Math.random().toString(36).slice(2),
        name: file.name, 
        size_human: '1.2 MB', 
        chunks: Math.floor(Math.random() * 40) + 10, 
        status: 'Embedded', 
        type: file.name.split('.').pop() 
      };
    }
  },
};
