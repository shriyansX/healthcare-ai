from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import hospitals, extract, rag, upload

app = FastAPI(
    title="Healthcare AI API",
    description="AI-powered healthcare analytics backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hospitals.router, prefix="/api/hospitals", tags=["Hospitals"])
app.include_router(extract.router, prefix="/api/extract", tags=["AI Extraction"])
app.include_router(rag.router, prefix="/api/rag", tags=["RAG"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])


@app.get("/")
def home():
    return {"message": "Healthcare AI running", "status": "ok", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
