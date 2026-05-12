from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class HealthcareStatus(str, Enum):
    GOOD = "Good"
    MEDIUM = "Medium"
    CRITICAL = "Critical"
    MEDICAL_DESERT = "Medical Desert"


class HospitalBase(BaseModel):
    name: str
    location: str
    lat: float
    lng: float
    doctors: int
    nurses: Optional[int] = 0
    beds: Optional[int] = 0
    ambulances: Optional[int] = 0
    population_served: Optional[int] = 0
    equipment: List[str] = []


class HospitalCreate(HospitalBase):
    pass


class Hospital(HospitalBase):
    id: int
    status: HealthcareStatus

    class Config:
        from_attributes = True


class ExtractionRequest(BaseModel):
    text: str = Field(..., description="Raw messy hospital description text")


class ExtractionResult(BaseModel):
    doctors: int = 0
    nurses: int = 0
    beds: int = 0
    ambulances: int = 0
    equipment: List[str] = []
    location: Optional[str] = None
    population_served: Optional[int] = None
    status: HealthcareStatus = HealthcareStatus.GOOD
    raw_text: str


class RAGQueryRequest(BaseModel):
    query: str = Field(..., description="Natural language query")
    top_k: int = Field(default=3, ge=1, le=10)


class RAGDocument(BaseModel):
    content: str
    source: str
    score: float


class RAGQueryResult(BaseModel):
    query: str
    answer: str
    sources: List[RAGDocument]
    total_documents_searched: int
