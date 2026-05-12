import os
from fastapi import APIRouter
from models import RAGQueryRequest, RAGQueryResult, RAGDocument
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Demo knowledge base used when ChromaDB/LlamaIndex not installed
_DEMO_KB = [
    {
        "source": "aiims_delhi.txt",
        "content": "AIIMS Delhi is a premier public hospital with 320 doctors, 850 nurses, 1000 beds, "
                   "and 12 ambulances. It serves over 500,000 patients annually. Equipment includes MRI, "
                   "CT scan, ICU, Ventilator, NICU, Blood Bank, and a full Lab. Status: Good.",
        "score": 0.95,
        "keywords": ["aiims", "delhi", "premier", "mri", "icu", "blood bank", "nicu"],
    },
    {
        "source": "vidarbha_report.pdf",
        "content": "Rural Clinic Vidarbha has only 3 doctors and 5 nurses for 8,000 people. "
                   "Only X-ray is available. No ICU, no ambulance. Classified as Medical Desert. "
                   "Urgent intervention required.",
        "score": 0.91,
        "keywords": ["vidarbha", "rural", "desert", "x-ray", "clinic", "3 doctors"],
    },
    {
        "source": "rajasthan_phcs.csv",
        "content": "PHC Barmer, Rajasthan serves 12,000 people with 2 doctors and 4 nurses. "
                   "Beds: 6. Ambulances: 1. Equipment: X-ray only. Status: Medical Desert. "
                   "No ICU or critical care facilities.",
        "score": 0.89,
        "keywords": ["barmer", "rajasthan", "phc", "2 doctors", "desert", "primary health"],
    },
    {
        "source": "pune_hospital_data.txt",
        "content": "City Hospital Pune has 45 doctors, 120 nurses, 200 beds, 5 ambulances. "
                   "Equipment: MRI, CT scan, ICU, X-ray, Lab, Pharmacy. Serves 75,000 people. "
                   "Status: Good. Coverage score: 71/100.",
        "score": 0.87,
        "keywords": ["pune", "city hospital", "45 doctors", "mri", "icu", "good"],
    },
    {
        "source": "apollo_chennai.txt",
        "content": "Apollo Hospitals Chennai: 210 doctors, 600 nurses, 800 beds, 15 ambulances. "
                   "Serves 300,000. Equipment: MRI, CT scan, ICU, Ventilator, NICU, Blood Bank, "
                   "Lab, Dialysis. Status: Good. Score: 95/100.",
        "score": 0.93,
        "keywords": ["apollo", "chennai", "dialysis", "nicu", "ventilator", "blood bank"],
    },
]

def _search(query: str, top_k: int) -> list[dict]:
    """Simple keyword-based similarity search over demo KB."""
    q_lower = query.lower()
    scored = []
    for doc in _DEMO_KB:
        hits = sum(1 for kw in doc["keywords"] if kw in q_lower)
        content_hits = sum(1 for word in q_lower.split() if len(word) > 3 and word in doc["content"].lower())
        total_score = doc["score"] + hits * 0.04 + content_hits * 0.02
        scored.append({**doc, "score": min(total_score, 0.99)})
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]

def _generate_answer_with_llm(query: str, context: str) -> str:
    """Generate answer using LLM."""
    api_key = os.getenv("NVIDIA_API_KEY") or os.getenv("OPENAI_API_KEY") or "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"
    base_url = "https://integrate.api.nvidia.com/v1" if (os.getenv("NVIDIA_API_KEY") or api_key.startswith("nvapi")) else None
    model_name = "meta/llama3-70b-instruct" if (os.getenv("NVIDIA_API_KEY") or api_key.startswith("nvapi")) else (os.getenv("LLM_MODEL") or "gpt-3.5-turbo")
    
    if not api_key or api_key.startswith("your_"):
        return None
        
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url=base_url)
        prompt = f"Answer the user's query based on the following context. If the answer isn't in the context, say so.\nContext: {context}\nQuery: {query}"
        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=256
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"LLM Generation failed: {e}")
        return None

def _generate_answer_fallback(query: str, sources: list[dict]) -> str:
    """Generate a contextual answer statically."""
    q = query.lower()
    if any(w in q for w in ["desert", "underserved", "shortage", "lack"]):
        deserts = [s for s in sources if "desert" in s["content"].lower()]
        if deserts:
            names = [s["source"].replace(".txt", "").replace(".pdf", "").replace(".csv", "").replace("_", " ").title() for s in deserts]
            return f"Based on the indexed documents, the following locations qualify as Medical Deserts: {', '.join(names[:3])}. These areas urgently need additional healthcare resources."
    if sources:
        combined = " | ".join(s["content"][:120] for s in sources[:2])
        return f"Based on {len(sources)} retrieved document chunks: {combined}."
    return "No relevant documents found for this query."

def _generate_answer(query: str, sources: list[dict]) -> str:
    """Generate a contextual answer from retrieved sources."""
    context = "\n".join([f"Source ({s['source']}): {s['content']}" for s in sources])
    llm_answer = _generate_answer_with_llm(query, context)
    if llm_answer:
        return llm_answer
    return _generate_answer_fallback(query, sources)


@router.get("/status")
def get_ai_status():
    """Check if the AI API is configured."""
    nvidia_key = os.getenv("NVIDIA_API_KEY") or "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"
    openai_key = os.getenv("OPENAI_API_KEY")
    
    # Check if a valid-looking key exists (not starting with 'your_')
    has_nvidia = nvidia_key and not nvidia_key.startswith("your_")
    has_openai = openai_key and not openai_key.startswith("your_")
    
    if has_nvidia or has_openai:
        return {"status": "online", "provider": "Nvidia NIM" if has_nvidia else "OpenAI"}
    
    return {"status": "offline", "provider": "none"}


@router.post("/query", response_model=RAGQueryResult)
def query_rag(request: RAGQueryRequest):
    """Query the RAG pipeline."""
    try:
        import sys
        import os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../rag"))
        from query import query_rag as _query

        result = _query(request.query, top_k=request.top_k)
        return RAGQueryResult(**result)

    except (ImportError, Exception):
        # Smart demo fallback
        matched = _search(request.query, request.top_k)
        answer = _generate_answer(request.query, matched)
        sources = [
            RAGDocument(
                content=m["content"][:300],
                source=m["source"],
                score=round(m["score"], 3),
            )
            for m in matched
        ]
        return RAGQueryResult(
            query=request.query,
            answer=answer,
            sources=sources,
            total_documents_searched=len(_DEMO_KB),
        )
