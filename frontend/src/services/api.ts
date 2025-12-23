export interface Flight {
    icao24: string;
    callsign: string | null;
    origin_country: string;
    time_position: number | null;
    last_contact: number | null;
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    on_ground: boolean;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    sensors: number[] | null;
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean;
    position_source: number;
}

export interface FlightDetail {
    icao24: string;
    callsign: string | null;
    origin_country: string;
    time_position: number | null;
    last_contact: number | null;
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    on_ground: boolean;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    sensors: number[] | null;
    geo_altitude: number | null;
    squawk: string | null;
    spi: boolean;
    position_source: number;
    // Extended fields
    image?: {
        found: boolean;
        url?: string;
        photographer?: string;
    };
    schedule?: {
        origin: { code: string; city: string };
        destination: { code: string; city: string };
        scheduled_departure: string;
        scheduled_arrival: string;
        status: string;
        delay_minutes: number;
        progress_percent: number;
    };
}

export const fetchFlights = async (bbox?: string): Promise<Flight[]> => {
    try {
        const url = bbox
            ? `http://localhost:8000/api/flights/?bbox=${bbox}`
            : `http://localhost:8000/api/flights/`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.flights;
    } catch (error) {
        console.error("Error fetching flights:", error);
        return [];
    }
};

export const fetchFlightDetails = async (icao24: string, callsign: string): Promise<FlightDetail> => {
    try {
        const response = await fetch(`http://localhost:8000/api/flights/${icao24}?callsign=${callsign}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching flight details:", error);
        throw error;
    }
};
