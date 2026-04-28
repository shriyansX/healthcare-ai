const API_BASE =
  (typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:8000';

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
      const text = await res.text();
      throw new Error(text || `API error ${res.status}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('Request timed out — is the backend running?');
    throw err;
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
    const res = await fetch(`${API_BASE}/api/upload/`, { method: 'POST', body: form });
    if (!res.ok) { const t = await res.text(); throw new Error(t || `Upload failed ${res.status}`); }
    return res.json();
  },
};
