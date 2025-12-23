"""
Image Service - Planespotters Integration
Author: Umberto Casa
"""
import requests
import logging

logger = logging.getLogger(__name__)

class ImageService:
    BASE_URL = "https://api.planespotters.net/pub/photos/reg"

    @staticmethod
    def get_aircraft_image(icao24: str) -> dict:
        """
        Fetches an image URL for a given aircraft ICAO24 code.
        Since Planespotters searches by Registration, we might need a mapping DB.
        However, for this MVP, we will try to search by hex if possible or fallback.
        
        Actually, Planespotters API uses Registration. OpenSky gives us ICAO24.
        Converting ICAO24 to Registration is hard without a DB.
        
        WORKAROUND: We will use a public lookup or just search assuming we might have partial data,
        OR we can search by HEX on some other API.
        
        BETTER APPROACH for MVP:
        Use the OpenSky 'states' data which usually contains 'callsign'.
        We will try to fetch a generic image for the *Type* if we can derive it, 
        or just return a placeholder if we can't find a specific photo.
        
        Wait, there is a `hex` parameter for Planespotters!
        https://api.planespotters.net/pub/photos/hex/{hex}
        """
        try:
            url = f"https://api.planespotters.net/pub/photos/hex/{icao24}"
            headers = {
                "User-Agent": "FlightTrackerLab/1.0 (contact@example.com)"
            }
            response = requests.get(url, headers=headers, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("photos"):
                    photo = data["photos"][0]
                    return {
                        "url": photo["thumbnail_large"]["src"],
                        "link": photo["link"],
                        "photographer": photo["photographer"],
                        "found": True
                    }
            
            return {"found": False}
            
        except Exception as e:
            logger.error(f"Error fetching image for {icao24}: {e}")
            return {"found": False}
