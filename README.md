# 🏥 Healthcare AI

A full-stack AI-powered healthcare analytics platform — FastAPI backend with regex extraction + LlamaIndex RAG, and a Next.js dashboard with a Leaflet map of India.

## Project Structure

```
healthcare-ai/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── models.py            # Pydantic models
│   ├── extractor.py         # AI text → structured data (Step 6)
│   ├── detector.py          # Status detection logic (Step 8)
│   ├── requirements.txt
│   ├── .env.example
│   └── routers/
│       ├── hospitals.py     # CRUD endpoints
│       ├── extract.py       # /api/extract
│       └── rag.py           # /api/rag/query
├── rag/
│   ├── pipeline.py          # ChromaDB + LlamaIndex setup (Step 7)
│   ├── ingest.py            # Document ingestion script
│   └── query.py             # Query the vector store
├── frontend/
│   ├── pages/
│   │   ├── index.js         # Dashboard (Steps 9)
│   │   ├── map.js           # Leaflet map (Step 10)
│   │   ├── extract.js       # AI Extraction (Step 6)
│   │   ├── rag.js           # RAG Engine (Step 7)
│   │   ├── upload.js        # Upload page (Step 9)
│   │   └── results.js       # Results page (Step 9)
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── HospitalCard.js
│   │   ├── StatCard.js
│   │   ├── AlertPanel.js
│   │   ├── FileUpload.js
│   │   ├── RAGQuery.js
│   │   ├── ExtractionForm.js
│   │   ├── MapView.js
│   │   └── LeafletMapInner.js
│   ├── lib/api.js           # API client helper
│   └── styles/globals.css   # Design system
└── docker-compose.yml
```

## Quickstart

### 1. Backend

```bash
cd backend
cp .env.example .env
# Add your OPENAI_API_KEY to .env
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 2. Ingest documents into RAG

```bash
python rag/ingest.py
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 4. Docker (all services)

```bash
cp backend/.env.example backend/.env  # fill in OPENAI_API_KEY
docker-compose up --build
```

## Detection Logic (Step 8)

```python
if doctors < 5:
    status = "Medical Desert"
elif "ICU" not in equipment:
    status = "Critical"
elif doctors < 15 or len(equipment) < 3:
    status = "Medium"
else:
    status = "Good"
```

## Map Colors (Step 10)

| Color | Meaning |
|-------|---------|
| 🟢 Green | Good — fully equipped, 15+ doctors |
| 🟡 Yellow | Medium — some gaps |
| 🔴 Red | Critical — missing ICU |
| 🔴 Dark Red | Medical Desert — < 5 doctors |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/hospitals/` | List all hospitals |
| GET | `/api/hospitals/stats/summary` | Dashboard stats |
| POST | `/api/hospitals/` | Add hospital |
| POST | `/api/extract/` | Extract structured data from text |
| POST | `/api/rag/query` | Query RAG pipeline |
