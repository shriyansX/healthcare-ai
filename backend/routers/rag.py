from fastapi import APIRouter
from models import RAGQueryRequest, RAGQueryResult

router = APIRouter()


@router.post("/query", response_model=RAGQueryResult)
def query_rag(request: RAGQueryRequest):
    """
    Query the RAG pipeline.
    In production, this calls rag/query.py which uses LlamaIndex + ChromaDB.
    """
    try:
        # Lazy import so backend starts even without rag deps installed
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../rag"))
        from query import query_rag as _query

        result = _query(request.query, top_k=request.top_k)
        return RAGQueryResult(**result)
    except ImportError:
        # Fallback stub when RAG deps not installed
        return RAGQueryResult(
            query=request.query,
            answer=(
                "RAG pipeline not initialized. "
                "Run `python rag/ingest.py` to load documents, "
                "then ensure LlamaIndex & ChromaDB are installed."
            ),
            sources=[],
            total_documents_searched=0,
        )
