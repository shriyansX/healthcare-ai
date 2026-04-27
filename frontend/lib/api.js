const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  // Hospitals
  getHospitals: () => apiFetch('/api/hospitals/'),
  getHospital: (id) => apiFetch(`/api/hospitals/${id}`),
  createHospital: (data) => apiFetch('/api/hospitals/', { method: 'POST', body: JSON.stringify(data) }),
  getStats: () => apiFetch('/api/hospitals/stats/summary'),

  // Extraction
  extract: (text) => apiFetch('/api/extract/', { method: 'POST', body: JSON.stringify({ text }) }),

  // RAG
  queryRAG: (query, top_k = 3) =>
    apiFetch('/api/rag/query', { method: 'POST', body: JSON.stringify({ query, top_k }) }),
};
