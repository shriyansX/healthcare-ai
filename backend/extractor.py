import os
import re
import json
from dotenv import load_dotenv
from models import ExtractionResult, HealthcareStatus
from detector import detect_status

load_dotenv()

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
    patterns = [
        r"(?:located in|in|at|near|from)\s+([A-Z][a-zA-Z\s]+?)(?:,|\.|district|state|$)",
        r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+(?:hospital|clinic|facility|center|centre)",
    ]
    for p in patterns:
        match = re.search(p, text)
        if match:
            return match.group(1).strip()
    return None

def extract_with_llm(text: str) -> dict:
    """Extract structured data using LLM API if key is available."""
    api_key = os.getenv("NVIDIA_API_KEY") or os.getenv("OPENAI_API_KEY") or "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"
    base_url = "https://integrate.api.nvidia.com/v1" if (os.getenv("NVIDIA_API_KEY") or api_key.startswith("nvapi")) else None
    model_name = "meta/llama3-70b-instruct" if (os.getenv("NVIDIA_API_KEY") or api_key.startswith("nvapi")) else (os.getenv("LLM_MODEL") or "gpt-3.5-turbo")
    
    if not api_key or api_key.startswith("your_"):
        return {} # Fallback to regex if no valid key
        
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key, base_url=base_url)
        prompt = f"""
        Extract the following healthcare facility details from the text as a pure JSON object.
        Keys must be: "doctors" (int), "nurses" (int), "beds" (int), "ambulances" (int), "equipment" (list of strings), "location" (string or null), "population_served" (int or null).
        Text: "{text}"
        Return ONLY valid JSON.
        """
        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=256
        )
        content = response.choices[0].message.content
        # parse json from content which might have markdown fences
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        return json.loads(content.strip())
    except Exception as e:
        print(f"LLM Extraction failed: {e}")
        return {}


def extract_from_text(text: str) -> ExtractionResult:
    """
    Convert messy hospital description text into structured data.
    Attempts to use AI for extraction, falls back to regex.
    """
    llm_data = extract_with_llm(text)
    
    # regex fallback
    doctors = extract_number(r"(\d+)\s*(?:doctors?|physicians?|specialists?)", text)
    nurses = extract_number(r"(\d+)\s*(?:nurses?|nursing staff)", text)
    beds = extract_number(r"(\d+)\s*(?:beds?|patient beds?)", text)
    ambulances = extract_number(r"(\d+)\s*(?:ambulances?)", text)
    population = extract_number(r"(?:serves?|serving|population of)\s*([\d,]+)", text)
    
    if population == 0:
        pop_match = re.search(r"([\d,]+)\s*(?:people|residents|population)", text, re.IGNORECASE)
        if pop_match:
            population = int(pop_match.group(1).replace(",", ""))

    equipment = extract_equipment(text)
    location = extract_location(text)
    
    # Merge LLM data if available
    final_doctors = llm_data.get("doctors", doctors) or doctors
    final_nurses = llm_data.get("nurses", nurses) or nurses
    final_beds = llm_data.get("beds", beds) or beds
    final_ambulances = llm_data.get("ambulances", ambulances) or ambulances
    final_population = llm_data.get("population_served", population) or population
    final_equipment = llm_data.get("equipment", equipment) or equipment
    final_location = llm_data.get("location", location) or location

    status = detect_status(final_doctors, final_equipment)

    return ExtractionResult(
        doctors=final_doctors,
        nurses=final_nurses,
        beds=final_beds,
        ambulances=final_ambulances,
        equipment=final_equipment,
        location=final_location,
        population_served=final_population if final_population else None,
        status=status,
        raw_text=text,
    )
