import re
from models import ExtractionResult, HealthcareStatus
from detector import detect_status

# Equipment keywords to scan for
EQUIPMENT_PATTERNS = [
    "MRI", "CT scan", "CT-scan", "X-ray", "Xray", "Ultrasound",
    "ICU", "Ventilator", "Defibrillator", "ECG", "EEG",
    "Operating Theater", "OT", "NICU", "PICU", "Dialysis",
    "Blood Bank", "Ambulance", "Lab", "Pharmacy",
]


def extract_number(pattern: str, text: str, default: int = 0) -> int:
    """Extract first integer matching a pattern from text."""
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return default


def extract_equipment(text: str) -> list[str]:
    """Scan text for known medical equipment keywords."""
    found = []
    text_lower = text.lower()
    for equip in EQUIPMENT_PATTERNS:
        if equip.lower() in text_lower:
            found.append(equip)
    return found


def extract_location(text: str) -> str | None:
    """Try to extract location/city from text."""
    # Patterns like "in Mumbai", "at Delhi", "located in Kolkata"
    patterns = [
        r"(?:located in|in|at|near|from)\s+([A-Z][a-zA-Z\s]+?)(?:,|\.|district|state|$)",
        r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+(?:hospital|clinic|facility|center|centre)",
    ]
    for p in patterns:
        match = re.search(p, text)
        if match:
            return match.group(1).strip()
    return None


def extract_from_text(text: str) -> ExtractionResult:
    """
    Convert messy hospital description text into structured data.
    Example input: 'Hospital has 20 doctors and MRI machine'
    """
    doctors = extract_number(r"(\d+)\s*(?:doctors?|physicians?|specialists?)", text)
    nurses = extract_number(r"(\d+)\s*(?:nurses?|nursing staff)", text)
    beds = extract_number(r"(\d+)\s*(?:beds?|patient beds?)", text)
    ambulances = extract_number(r"(\d+)\s*(?:ambulances?)", text)
    population = extract_number(
        r"(?:serves?|serving|population of)\s*([\d,]+)", text
    )
    # Remove commas from population
    if population == 0:
        pop_match = re.search(r"([\d,]+)\s*(?:people|residents|population)", text, re.IGNORECASE)
        if pop_match:
            population = int(pop_match.group(1).replace(",", ""))

    equipment = extract_equipment(text)
    location = extract_location(text)
    status = detect_status(doctors, equipment)

    return ExtractionResult(
        doctors=doctors,
        nurses=nurses,
        beds=beds,
        ambulances=ambulances,
        equipment=equipment,
        location=location,
        population_served=population if population else None,
        status=status,
        raw_text=text,
    )
