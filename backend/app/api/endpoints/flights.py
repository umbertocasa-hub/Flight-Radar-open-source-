```python
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.services.opensky_service import OpenSkyService
from app.services.image_service import ImageService
import random
from datetime import datetime, timedelta
import pytz

router = APIRouter()
opensky_service = OpenSkyService()

AIRPORTS = [
    {"code": "FCO", "city": "Rome", "coords": [41.8003, 12.2389]},
    {"code": "MXP", "city": "Milan", "coords": [45.6301, 8.7255]},
    {"code": "LHR", "city": "London", "coords": [51.4700, -0.4543]},
    {"code": "CDG", "city": "Paris", "coords": [49.0097, 2.5479]},
    {"code": "JFK", "city": "New York", "coords": [40.6413, -73.7781]},
    {"code": "DXB", "city": "Dubai", "coords": [25.2532, 55.3657]},
    {"code": "HND", "city": "Tokyo", "coords": [35.5494, 139.7798]},
]

def generate_mock_schedule(icao24: str, callsign: str):
    # Deterministic randomness based on callsign or icao
    seed_str = callsign if callsign else icao24
    random.seed(seed_str)
    
    origin = random.choice(AIRPORTS)
    dest = random.choice([a for a in AIRPORTS if a["code"] != origin["code"]])
    
    # Mock times
    now = datetime.now(pytz.utc)
    duration_mins = random.randint(45, 600)
    progress_pct = random.random()
    
    duration = timedelta(minutes=duration_mins)
    elapsed = duration * progress_pct
    
    sched_dep = now - elapsed
    sched_arr = sched_dep + duration
    
    # Delays
    status_opts = ["On Time", "Delayed", "Landed", "Diverted"]
    weights = [0.7, 0.2, 0.05, 0.05]
    status = random.choices(status_opts, weights=weights)[0]
    
    delay_mins = 0
    if status == "Delayed":
        delay_mins = random.randint(15, 180)
    
    return {
        "origin": origin,
        "destination": dest,
        "scheduled_departure": sched_dep.isoformat(),
        "scheduled_arrival": sched_arr.isoformat(),
        "status": status,
        "delay_minutes": delay_mins,
        "progress_percent": int(progress_pct * 100)
    }

@router.get("/")
def get_flights(bbox: str = Query(None, description="min_lat,min_lon,max_lat,max_lon")):
    """
    Get live flights. 
    Optional bbox string: "min_lat,min_lon,max_lat,max_lon"
    """
    flights = opensky_service.get_all_states(bbox)
    return {"count": len(flights), "flights": flights}

@router.get("/{icao24}")
def get_flight_details(icao24: str, callsign: str = ""):
    # 2. Get Image
    image_data = ImageService.get_aircraft_image(icao24)
    
    # 3. Generate Schedule
    schedule = generate_mock_schedule(icao24, callsign)
    
    return {
        "icao24": icao24,
        "callsign": callsign.strip(),
        "image": image_data,
        "schedule": schedule,
        "trail": [] # Future: could simulate path points
    }
```
