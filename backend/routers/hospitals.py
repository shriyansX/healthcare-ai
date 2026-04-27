from fastapi import APIRouter, HTTPException
from models import Hospital, HospitalCreate, HealthcareStatus
from detector import detect_status, score_hospital
from typing import List

router = APIRouter()

# In-memory store (replace with a real DB / ChromaDB metadata store)
_hospitals: List[dict] = [
    {
        "id": 1, "name": "AIIMS Delhi", "location": "Delhi",
        "lat": 28.5672, "lng": 77.2100,
        "doctors": 320, "nurses": 850, "beds": 1000, "ambulances": 12,
        "population_served": 500000,
        "equipment": ["MRI", "CT scan", "ICU", "Ventilator", "NICU", "Blood Bank", "Lab"],
    },
    {
        "id": 2, "name": "Rural Clinic Vidarbha", "location": "Vidarbha, Maharashtra",
        "lat": 20.7002, "lng": 77.0082,
        "doctors": 3, "nurses": 5, "beds": 10, "ambulances": 0,
        "population_served": 8000,
        "equipment": ["X-ray"],
    },
    {
        "id": 3, "name": "City Hospital Pune", "location": "Pune, Maharashtra",
        "lat": 18.5204, "lng": 73.8567,
        "doctors": 45, "nurses": 120, "beds": 200, "ambulances": 5,
        "population_served": 75000,
        "equipment": ["MRI", "CT scan", "ICU", "X-ray", "Lab", "Pharmacy"],
    },
    {
        "id": 4, "name": "Primary Health Centre Rajasthan", "location": "Barmer, Rajasthan",
        "lat": 25.7457, "lng": 71.3932,
        "doctors": 2, "nurses": 4, "beds": 6, "ambulances": 1,
        "population_served": 12000,
        "equipment": ["X-ray"],
    },
    {
        "id": 5, "name": "Apollo Hospitals Chennai", "location": "Chennai, Tamil Nadu",
        "lat": 13.0827, "lng": 80.2707,
        "doctors": 210, "nurses": 600, "beds": 800, "ambulances": 15,
        "population_served": 300000,
        "equipment": ["MRI", "CT scan", "ICU", "Ventilator", "NICU", "Blood Bank", "Lab", "Dialysis"],
    },
]


def _enrich(h: dict) -> dict:
    status = detect_status(h["doctors"], h["equipment"])
    score = score_hospital(h["doctors"], h["beds"], h["equipment"], h["population_served"])
    return {**h, "status": status, "score": score}


@router.get("/", response_model=List[dict])
def list_hospitals():
    return [_enrich(h) for h in _hospitals]


@router.get("/{hospital_id}", response_model=dict)
def get_hospital(hospital_id: int):
    hospital = next((h for h in _hospitals if h["id"] == hospital_id), None)
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return _enrich(hospital)


@router.post("/", response_model=dict, status_code=201)
def create_hospital(data: HospitalCreate):
    new_id = max(h["id"] for h in _hospitals) + 1
    new_hospital = {"id": new_id, **data.model_dump()}
    _hospitals.append(new_hospital)
    return _enrich(new_hospital)


@router.get("/stats/summary")
def get_stats():
    enriched = [_enrich(h) for h in _hospitals]
    total = len(enriched)
    deserts = sum(1 for h in enriched if h["status"] == HealthcareStatus.MEDICAL_DESERT)
    critical = sum(1 for h in enriched if h["status"] == HealthcareStatus.CRITICAL)
    good = sum(1 for h in enriched if h["status"] == HealthcareStatus.GOOD)
    medium = sum(1 for h in enriched if h["status"] == HealthcareStatus.MEDIUM)
    return {
        "total_hospitals": total,
        "medical_deserts": deserts,
        "critical_zones": critical,
        "good": good,
        "medium": medium,
    }
