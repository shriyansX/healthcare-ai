from fastapi import APIRouter
from models import ExtractionRequest, ExtractionResult
from extractor import extract_from_text

router = APIRouter()


@router.post("/", response_model=ExtractionResult)
def extract_hospital_data(request: ExtractionRequest):
    """
    Extract structured hospital data from messy free-form text.
    Example: 'Hospital has 20 doctors and MRI machine'
    """
    return extract_from_text(request.text)
