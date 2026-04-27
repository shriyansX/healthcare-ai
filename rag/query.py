"""
query.py — Query the LlamaIndex RAG pipeline
"""
import os
from dotenv import load_dotenv

load_dotenv()


def query_rag(query: str, top_k: int = 3) -> dict:
    """
    Query the ChromaDB-backed LlamaIndex vector store.
    Returns a dict compatible with RAGQueryResult model.
    """
    import chromadb
    from llama_index.core import VectorStoreIndex, StorageContext
    from llama_index.vector_stores.chroma import ChromaVectorStore

    chroma_persist = os.getenv("CHROMA_PERSIST_DIR", "./chroma_store")
    chroma_client = chromadb.PersistentClient(path=chroma_persist)
    collection = chroma_client.get_or_create_collection("healthcare_docs")

    vector_store = ChromaVectorStore(chroma_collection=collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        storage_context=storage_context,
    )

    query_engine = index.as_query_engine(similarity_top_k=top_k)
    response = query_engine.query(query)

    sources = []
    for node in response.source_nodes:
        sources.append({
            "content": node.node.get_content()[:300],
            "source": node.node.metadata.get("source", "unknown"),
            "score": round(float(node.score or 0.0), 4),
        })

    return {
        "query": query,
        "answer": str(response),
        "sources": sources,
        "total_documents_searched": collection.count(),
    }


if __name__ == "__main__":
    result = query_rag("Which hospitals are medical deserts in Rajasthan?")
    print("Answer:", result["answer"])
    print("\nSources:")
    for s in result["sources"]:
        print(f"  [{s['score']:.4f}] {s['source']}: {s['content'][:100]}...")
