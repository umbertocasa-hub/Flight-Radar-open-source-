"""
OpenSky Network Service
Author: Umberto Casa
"""
import requests
from typing import List, Dict, Any, Optional

class OpenSkyService:
    BASE_URL = "https://opensky-network.org/api"

    def get_all_states(self, bbox: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Retrieves state vectors for all aircraft.
        Optionally filters by a bounding box "min_lat,min_lon,max_lat,max_lon".
        """
        url = f"{self.BASE_URL}/states/all"
        params = {}
        if bbox:
            try:
                lamin, lomin, lamax, lomax = map(float, bbox.split(','))
                params = {
                    "lamin": lamin,
                    "lomin": lomin,
                    "lamax": lamax,
                    "lomax": lomax
                }
            except ValueError:
                print("Invalid bbox format. Ignoring.")

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # OpenSky returns a list of lists. We should map it to dicts for easier consumption.
            # Columns: icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source
            
            states = data.get('states', [])
            if not states:
                return []

            flights = []
            for s in states:
                # Basic cleaning
                if not s[5] or not s[6]: # Skip if no lat/lon
                    continue
                    
                flight = {
                    "icao24": s[0],
                    "callsign": s[1].strip(),
                    "origin_country": s[2],
                    "longitude": s[5],
                    "latitude": s[6],
                    "baro_altitude": s[7],
                    "on_ground": s[8],
                    "velocity": s[9],
                    "true_track": s[10],
                    "vertical_rate": s[11],
                    "geo_altitude": s[13]
                }
                flights.append(flight)
                
            return flights

        except requests.RequestException as e:
            print(f"Error fetching data from OpenSky: {e}")
            # print("Falling back to mock traffic data...")
            # return self.generate_mock_traffic(bbox)
            return [] # Strict Real Data Only

    def generate_mock_traffic(self, bbox: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Generates realistic random traffic for demo purposes when API is unavailable.
        """
        import random
        flights = []
        
        # Default bounds (Europe-ish) if not provided
        lamin, lomin, lamax, lomax = 35.0, 6.0, 47.0, 19.0
        if bbox:
            try:
                lamin, lomin, lamax, lomax = map(float, bbox.split(','))
            except:
                pass

        # Generate ~150 flights
        count = 150
        for _ in range(count):
            lat = random.uniform(lamin, lamax)
            lon = random.uniform(lomin, lomax)
            track = random.uniform(0, 360)
            
            flights.append({
                "icao24": f"aa{random.randint(1000,9999)}",
                "callsign": f"MOCK{random.randint(10,99)}",
                "origin_country": "System Demo",
                "longitude": lon,
                "latitude": lat,
                "baro_altitude": random.randint(1000, 35000),
                "on_ground": False,
                "velocity": random.uniform(200, 500),
                "true_track": track,
                "vertical_rate": 0,
                "geo_altitude": random.randint(1000, 35000)
            })
        return flights

    def get_flight_details(self, icao24: str):
        # OpenSky free API doesn't have a direct "details" endpoint for a specific live flight 
        # other than /states/all?icao24=...
        # We can reuse the states endpoint filtering by icao24.
        url = f"{self.BASE_URL}/states/all"
        params = {"icao24": icao24}
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            states = data.get('states', [])
            
            if states:
                s = states[0]
                return {
                    "icao24": s[0],
                    "callsign": s[1].strip(),
                    "origin_country": s[2],
                    "longitude": s[5],
                    "latitude": s[6],
                    "baro_altitude": s[7],
                    "on_ground": s[8],
                    "velocity": s[9],
                    "true_track": s[10],
                    "geo_altitude": s[13]
                }
            return None
        except Exception as e:
            print(f"Error details: {e}")
            return None
