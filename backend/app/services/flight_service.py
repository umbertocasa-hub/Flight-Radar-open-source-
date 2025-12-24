from FlightRadar24 import FlightRadar24API
from typing import List, Dict, Any, Optional

class FlightService:
    def __init__(self):
        self.fr_api = FlightRadar24API()

    def get_flights(self, bbox: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Retrieves flights using FlightRadar24.
        BBox format: "min_lat,min_lon,max_lat,max_lon" -> FR24 expects "ymax,ymin,xmin,xmax" (North, South, West, East)
        Wait, FR24 bounds are usually y1, y2, x1, x2 (North, South, West, East).
        Let's verify wrapper convention. Wrapper set_bounds uses (bounds).
        Usually: self.fr_api.get_flights(bounds=str).
        """
        try:
            bounds = None
            if bbox:
                # bbox input: min_lat, min_lon, max_lat, max_lon
                # FR24API often wants: "max_lat,min_lat,min_lon,max_lon" (North, South, West, East) ?
                # The library `get_flights(bounds=...)` expects a string often like "60.0,40.0,-20.0,20.0"
                # Let's verify standard FR conventions: TL_lat, BR_lat, TL_lon, BR_lon? 
                # Actually commonly: max_lat, min_lat, min_lon, max_lon
                
                lamin, lomin, lamax, lomax = map(float, bbox.split(','))
                # Constructing string for FR24: North, South, West, East
                bounds = f"{lamax},{lamin},{lomin},{lomax}"
            
            # Fetch flights
            fr_flights = self.fr_api.get_flights(bounds=bounds)
            
            flight_data = []
            for f in fr_flights:
                # Filter out ground vehicles if needed, but FR24 usually separates ground
                if f.on_ground: 
                    continue
                    
                flight_data.append({
                    "id": f.id,  # FR24 internal ID (e.g., "3da2ba1d")
                    "icao24": f.icao_24bit,
                    "callsign": f.callsign or "N/A",
                    "origin_country": f.origin_airport_iata or "Unknown",
                    "longitude": f.longitude,
                    "latitude": f.latitude,
                    "baro_altitude": f.altitude, # FR24 gives altitude in feet usually
                    "on_ground": f.on_ground,
                    "velocity": f.ground_speed, # Knots
                    "true_track": f.heading,
                    "vertical_rate": f.vertical_speed,
                    "geo_altitude": f.altitude
                })
                
            return flight_data
            
        except Exception as e:
            print(f"Error fetching FR24 data: {e}")
            return []

    def get_flight_details(self, flight_id: str):
        """
        Fetch specific flight details using the FR24 ID (e.g. '3da2ba1d').
        This returns richer data including images.
        """
        try:
            # The wrapper expects a flight object or ID? 
            # Looking at library source: api.get_flight_details(flight_id)
            flight = self.fr_api.get_flight_details(flight_id)
            
            # The library returns a dictionary structure directly from the API response
            if flight:
                return flight
            return None
        except Exception as e:
            print(f"Error fetching FR24 details for {flight_id}: {e}")
            return None
