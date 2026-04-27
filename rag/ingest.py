"""
ingest.py — Load hospital documents into ChromaDB via LlamaIndex
Run this once (or whenever you add new documents):
    python rag/ingest.py
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


SAMPLE_DOCUMENTS = [
    {
        "id": "doc1",
        "text": (
            "AIIMS Delhi is a premier government hospital with 320 doctors, 850 nurses, "
            "1000 beds, and 12 ambulances. Equipped with MRI, CT scan, ICU, Ventilator, "
            "NICU, Blood Bank, and Lab. Serves ~500,000 people in Delhi NCR."
        ),
        "metadata": {"source": "aiims_delhi.txt", "location": "Delhi"},
    },
    {
        "id": "doc2",
        "text": (
            "Rural Clinic in Vidarbha, Maharashtra has only 3 doctors and 5 nurses with "
            "10 beds. Only an X-ray machine available. Serves 8000 villagers. "
            "No ambulance. Classified as a Medical Desert."
        ),
        "metadata": {"source": "vidarbha_clinic.txt", "location": "Vidarbha"},
    },
    {
        "id": "doc3",
        "text": (
            "City Hospital Pune has 45 doctors, 120 nurses, 200 beds, 5 ambulances. "
            "Equipment: MRI, CT scan, ICU, X-ray, Lab, Pharmacy. Serves 75,000 people. "
            "Status: Good."
        ),
        "metadata": {"source": "pune_hospital.txt", "location": "Pune"},
    },
    {
        "id": "doc4",
        "text": (
            "Primary Health Centre in Barmer, Rajasthan: 2 doctors, 4 nurses, 6 beds, "
            "1 ambulance. Equipment: X-ray only. Serves 12,000 people. "
            "Classified as Medical Desert."
        ),
        "metadata": {"source": "barmer_phc.txt", "location": "Barmer"},
    },
    {
        "id": "doc5",
        "text": (
            "Apollo Hospitals Chennai: 210 doctors, 600 nurses, 800 beds, 15 ambulances. "
            "Equipment: MRI, CT scan, ICU, Ventilator, NICU, Blood Bank, Lab, Dialysis. "
            "Serves 300,000 people. Status: Good."
        ),
        "metadata": {"source": "apollo_chennai.txt", "location": "Chennai"},
    },
]


def ingest_documents():
    from llama_index.core import Document, VectorStoreIndex, StorageContext
    from llama_index.vector_stores.chroma import ChromaVectorStore
    import chromadb

    chroma_persist = os.getenv("CHROMA_PERSIST_DIR", "./chroma_store")
    chroma_client = chromadb.PersistentClient(path=chroma_persist)
    collection = chroma_client.get_or_create_collection("healthcare_docs")

    vector_store = ChromaVectorStore(chroma_collection=collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    docs = [
        Document(text=d["text"], doc_id=d["id"], metadata=d["metadata"])
        for d in SAMPLE_DOCUMENTS
    ]

    VectorStoreIndex.from_documents(docs, storage_context=storage_context)
    print(f"✅ Ingested {len(docs)} documents into ChromaDB at '{chroma_persist}'")


if __name__ == "__main__":
    ingest_documents()
