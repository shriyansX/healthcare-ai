import os
import io
import hashlib
import math
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter()

# In-memory document store (replace with ChromaDB in production)
_documents: List[dict] = [
    {
        "id": "doc_aiims",
        "name": "aiims_delhi.txt",
        "size": 12595,
        "size_human": "12.3 KB",
        "chunks": 18,
        "status": "Embedded",
        "type": "txt",
    },
    {
        "id": "doc_vidarbha",
        "name": "vidarbha_report.pdf",
        "size": 86118,
        "size_human": "84.1 KB",
        "chunks": 43,
        "status": "Embedded",
        "type": "pdf",
    },
    {
        "id": "doc_rajasthan",
        "name": "rajasthan_phcs.csv",
        "size": 35533,
        "size_human": "34.7 KB",
        "chunks": 27,
        "status": "Embedded",
        "type": "csv",
    },
]


def _human_size(n: int) -> str:
    if n < 1024:
        return f"{n} B"
    if n < 1024 * 1024:
        return f"{n/1024:.1f} KB"
    return f"{n/(1024*1024):.1f} MB"


def _estimate_chunks(size_bytes: int, file_type: str) -> int:
    """Rough chunk estimate: ~500 chars per chunk, PDF ≈ 0.8x text ratio."""
    ratio = 0.8 if file_type == "pdf" else 1.0
    chars_estimate = size_bytes * ratio
    return max(1, math.ceil(chars_estimate / 500))


@router.get("/", response_model=List[dict])
def list_documents():
    """List all ingested documents in the vector store."""
    total_chunks = sum(d["chunks"] for d in _documents)
    return _documents


@router.get("/stats")
def get_stats():
    """Return vector store statistics."""
    total_chunks = sum(d["chunks"] for d in _documents)
    return {
        "total_documents": len(_documents),
        "total_chunks": total_chunks,
        "embedded": sum(1 for d in _documents if d["status"] == "Embedded"),
        "processing": sum(1 for d in _documents if d["status"] == "Processing"),
    }


@router.post("/", response_model=dict, status_code=201)
async def upload_document(file: UploadFile = File(...)):
    """
    Accept a PDF, TXT, or CSV file. Read its content, chunk it,
    and record it as embedded in the vector store.
    """
    allowed = {"pdf", "txt", "csv", "docx"}
    ext = (file.filename or "").rsplit(".", 1)[-1].lower()
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{ext}'. Allowed: {', '.join(allowed)}",
        )

    content = await file.read()
    size = len(content)
    doc_id = hashlib.md5(file.filename.encode() + str(size).encode()).hexdigest()[:12]

    # Check for duplicate
    existing = next((d for d in _documents if d["name"] == file.filename), None)
    if existing:
        return existing  # idempotent

    chunks = _estimate_chunks(size, ext)

    doc = {
        "id": doc_id,
        "name": file.filename,
        "size": size,
        "size_human": _human_size(size),
        "chunks": chunks,
        "status": "Embedded",
        "type": ext,
    }
    _documents.append(doc)

    # In production you'd call rag/ingest.py here:
    # from rag.ingest import ingest_bytes
    # ingest_bytes(content, file.filename, doc_id)

    return doc


@router.delete("/{doc_id}")
def delete_document(doc_id: str):
    """Remove a document from the vector store."""
    global _documents
    before = len(_documents)
    _documents = [d for d in _documents if d["id"] != doc_id]
    if len(_documents) == before:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"deleted": doc_id}
