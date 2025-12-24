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
        origin: { code: string; city: string; coords: [number, number] };
        destination: { code: string; city: string; coords: [number, number] };
        scheduled_departure: string;
        scheduled_arrival: string;
        status: string;
        delay_minutes: number;
        progress_percent: number;
    };
}

export interface WeatherData {
    temperature: number;
    weathercode: number;
    city: string;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        return {
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
            city: "" // to be filled by caller context
        };
    } catch (e) {
        console.error("Weather fetch failed", e);
        return null;
    }
};

export const fetchFlights = async (bbox?: string): Promise<Flight[]> => {
    try {
        const url = bbox
            ? `http://localhost:8000/api/flights/?bbox=${bbox}`
            : `http://localhost:8000/api/flights/`;

        // 500ms timeout to detect if backend is down (local dev vs github pages)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.flights;
    } catch (error) {
        console.warn("Backend unreachable, switching to DEMO MODE (Mock Data)", error);

        // Fallback to static mock data for GitHub Pages / Demo
        // Note: In production build, base path might affect this, but public/ file is usually at root
        // leveraging Vite's import.meta.env.BASE_URL if needed, but relative path usually works
        try {
            // For GitHub Pages, we need to respect the base path if fetching relative
            const mockUrl = import.meta.env.BASE_URL + 'mock_data.json';
            const demoRes = await fetch(mockUrl.replace('//', '/')); // simple cleanup
            const demoData = await demoRes.json();

            // Transform mock data if wrapped
            return demoData.flights || demoData;
        } catch (mockErr) {
            console.error("Failed to load demo data", mockErr);
            return [];
        }
    }
};

export const fetchFlightDetails = async (icao24: string, callsign: string, id?: string): Promise<FlightDetail> => {
    try {
        let url = `http://localhost:8000/api/flights/${icao24}?callsign=${callsign}`;
        if (id) {
            url += `&id=${id}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching flight details:", error);
        throw error;
    }
};
