from FlightRadar24 import FlightRadar24API
fr_api = FlightRadar24API()
bounds = "55.0,35.0,-10.0,25.0" # N, S, W, E
flights = fr_api.get_flights(bounds=bounds)
print(f"Flights found: {len(flights)}")
if len(flights) > 0:
    print(flights[0].__dict__)
