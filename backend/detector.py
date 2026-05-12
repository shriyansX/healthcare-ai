from models import HealthcareStatus


def detect_status(doctors: int, equipment: list[str]) -> HealthcareStatus:
    """
    Core detection logic (Step 8):
      - if doctors < 5  → Medical Desert
      - if ICU not in equipment → Critical
      - if doctors < 15 or limited equipment → Medium
      - otherwise → Good
    """
    if doctors < 5:
        return HealthcareStatus.MEDICAL_DESERT

    if "ICU" not in equipment:
        return HealthcareStatus.CRITICAL

    if doctors < 15 or len(equipment) < 3:
        return HealthcareStatus.MEDIUM

    return HealthcareStatus.GOOD


def score_hospital(doctors: int, beds: int, equipment: list[str], population: int) -> float:
    """
    Returns a quality score 0–100 for a hospital.
    Used for map color coding and dashboard metrics.
    """
    score = 0.0

    # Doctor-to-population ratio (weight: 40%)
    if population > 0:
        ratio = (doctors / population) * 10000  # doctors per 10k people
        score += min(ratio * 4, 40)
    else:
        score += min(doctors * 2, 40)

    # Bed count (weight: 20%)
    score += min(beds / 10, 20)

    # Equipment score (weight: 40%) — bonus for critical items
    critical_items = {"ICU", "Ventilator", "CT scan", "MRI", "NICU"}
    regular_items = set(equipment) - critical_items
    eq_score = len(set(equipment) & critical_items) * 6 + len(regular_items) * 2
    score += min(eq_score, 40)

    return round(score, 2)
