from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional, Dict, Any
from app.services.flight_service import FlightService
from app.services.image_service import ImageService
import random
from datetime import datetime, timedelta
import pytz

router = APIRouter()
flight_service = FlightService()
image_service = ImageService()

# Mock Airports with coordinates for Demo/Weather purposes
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
async def get_flights(bbox: Optional[str] = Query(None, description="min_lat,min_lon,max_lat,max_lon")):
    """
    Get live flights using FlightRadar24 data.
    """
    flights = flight_service.get_flights(bbox)
    # Return matches frontend expectations: just a list or {flights: []} ? 
    # Frontend api.ts: return response.data directly which is likely List[Flight].
    # But wait, previous implementation returned {"count": len, "flights": flights} or just flights?
    # Let's check frontend. previous backend code was returning {"count": x, "flights": x}.
    # Wait, looking at "view_file" output of old backend:
    # 67:    return {"count": len(flights), "flights": flights}
    # However, frontend "fetchFlights" usually expects an array or extracts .flights?
    
    # Let's stick to the list for simplicity if I can, OR maintain the structure.
    # Frontend src/services/api.ts logic: "const data = await response.json(); return data.flights || data;"
    # So lets return the structure to be safe.
    
    return {"count": len(flights), "flights": flights}

@router.get("/{icao24}")
async def get_flight_details(icao24: str, callsign: str = "", id: Optional[str] = None):
    """
    Get flight details.
    Process:
    1. If `id` (FR24 ID) is provided, use it to get real details + photos.
    2. If not, use legacy fallback (image_service + mock schedule).
    """
    
    real_details = None
    image_url = None
    
    if id:
        real_details = flight_service.get_flight_details(id)
        
    if real_details:
        # Extract meaningful data from FR24 response
        # Structure varies, but usually: 'aircraft': {'images': ...}, 'time': {...}, 'airport': {...}
        
        # 1. Image
        try:
            images = real_details.get("aircraft", {}).get("images", {})
            if images:
                # usually "large" or "medium" list
                large_imgs = images.get("large", [])
                if large_imgs:
                    image_url = large_imgs[0]["src"]
        except:
            pass
            
    # Fallback Image if FR24 didn't return one or we didn't use `id`
    if not image_url:
        image_url = await image_service.get_aircraft_image(icao24)

    # 3. Generate Schedule (Mock for demo, until we parse FR24 schedule properly)
    # FR24 response has 'time' and 'airport' keys we could use, but for safety in this demo
    # let's keep the mock schedule unless we are sure.
    # Actually, let's try to basic parse if available
    schedule = generate_mock_schedule(icao24, callsign)
    
    if real_details:
        try:
            # Overwrite mock with real data if possible
            airport = real_details.get("airport", {})
            origin_data = airport.get("origin", {})
            dest_data = airport.get("destination", {})
            
            if origin_data and dest_data:
                schedule["origin"] = {
                    "code": origin_data.get("code", {}).get("iata", "ERR"),
                    "city": origin_data.get("position", {}).get("region", {}).get("city", "Unknown"),
                    # We need coords for weather!
                    "coords": [
                         origin_data.get("position", {}).get("latitude", 0),
                         origin_data.get("position", {}).get("longitude", 0)
                    ]
                }
                schedule["destination"] = {
                    "code": dest_data.get("code", {}).get("iata", "ERR"),
                    "city": dest_data.get("position", {}).get("region", {}).get("city", "Unknown"),
                     "coords": [
                         dest_data.get("position", {}).get("latitude", 0),
                         dest_data.get("position", {}).get("longitude", 0)
                    ]
                }
        except:
            pass # Keep mock

    return {
        "id": id,
        "icao24": icao24,
        "callsign": callsign.strip(),
        "image": image_url,
        "schedule": schedule,
        "trail": [] 
    }
