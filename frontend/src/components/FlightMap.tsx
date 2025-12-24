/**
 * FlightMap Component - Visualizes aircraft on Leaflet map
 * @author Umberto Casa
 */
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchFlights } from '../services/api';
import type { Flight } from '../services/api';
import { createFlightIcon } from './FlightIcon';
import type { AppSettings } from './Controls';

// Helper component to fly to selected flight
const MapFlyTo = ({ position, zoom }: { position: [number, number] | null, zoom?: number }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, zoom || map.getZoom(), { duration: 1.5 });
        }
    }, [position, map, zoom]);
    return null;
};

interface FlightMapProps {
    selectedFlight: Flight | null;
    onSelectFlight: (flight: Flight) => void;
    settings: AppSettings;
}

const FlightMap: React.FC<FlightMapProps> = ({ selectedFlight, onSelectFlight, settings }) => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [weatherUrl, setWeatherUrl] = useState<string | null>(null);
    const timerRef = useRef<number | undefined>(undefined);

    const loadData = async () => {
        try {
            // Central Europe BBox: min_lat,min_lon,max_lat,max_lon
            // Covers Italy, France, Germany, etc. to ensure visibility
            const data = await fetchFlights("35.0,-10.0,55.0,25.0");

            // Deduplicate flights and ensure valid data
            const uniqueFlights = new Map();
            data.forEach(f => {
                if (f.icao24 && f.latitude && f.longitude) {
                    uniqueFlights.set(f.icao24, f);
                }
            });
            setFlights(Array.from(uniqueFlights.values()));
        } catch (error) {
            console.error("Failed to fetch flights", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    useEffect(() => {
        const filtered = flights.filter(f => {
            const alt = f.geo_altitude || f.baro_altitude || 0;
            const lowAlt = settings.filters.minAltitude > 0 ? alt >= settings.filters.minAltitude : true;

            const airlineMatch = settings.filters.airline
                ? (f.callsign && f.callsign.toLowerCase().includes(settings.filters.airline.toLowerCase()))
                : true;

            return lowAlt && airlineMatch;
        });
        setFilteredFlights(filtered);
    }, [flights, settings.filters]);

    // Weather Animation State
    const [weatherFrames, setWeatherFrames] = useState<any[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

    useEffect(() => {
        loadData();
        timerRef.current = window.setInterval(loadData, 10000);

        // Fetch Weather Data from RainViewer
        const fetchWeather = async () => {
            try {
                const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
                const data = await res.json();

                if (data.host && data.radar && data.radar.past && data.radar.past.length > 0) {
                    // Combine past + nowcast if available, or just past
                    // We need to store standard URL parts: host + path
                    const frames = data.radar.past;
                    // Add "nowcast" if desired: data.radar.nowcast

                    const frameData = frames.map((f: any) => ({
                        url: `${data.host}${f.path}`,
                        time: f.time
                    }));

                    setWeatherFrames(frameData);
                    // Start at the last frame (most recent) initially
                    setCurrentFrameIndex(frameData.length - 1);
                    setWeatherUrl(frameData[frameData.length - 1].url);
                }
            } catch (err) {
                console.error("Failed to fetch weather configuration", err);
            }
        };
        fetchWeather();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Animation Loop
    useEffect(() => {
        if (weatherFrames.length === 0) return;
        if (settings.weatherLayer === 'none') return;

        const interval = setInterval(() => {
            setCurrentFrameIndex(prev => {
                const next = (prev + 1) % weatherFrames.length;
                setWeatherUrl(weatherFrames[next].url);
                return next;
            });
        }, 2000); // Change frame every 2 seconds (avoid rate limit)

        return () => clearInterval(interval);
    }, [weatherFrames, settings.weatherLayer]);

    // Map Layer Selection
    const getTileUrl = () => {
        switch (settings.mapStyle) {
            case 'light': return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
            case 'satellite': return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case 'dark':
            default: return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
        }
    }

    return (
        <div className="w-full h-full bg-[#1a1a1a]">
            {/* Loading overlay */}
            {loading && flights.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-[1001] bg-black/50 pointer-events-none">
                    <div className="text-fr24-yellow font-mono text-xl animate-pulse">RADAR INIT...</div>
                </div>
            )}

            <MapContainer
                center={[41.9028, 12.4964]}
                zoom={6}
                style={{ height: "100%", width: "100%", background: '#1a1a1a' }}
                zoomControl={false} // We will add custom controls later or let user use scroll
            >
                {/* Base Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={getTileUrl()}
                />

                {/* Weather Overlay (RainViewer) */}
                {settings.weatherLayer === 'radar' && weatherUrl && (
                    <TileLayer
                        url={`${weatherUrl}/256/{z}/{x}/{y}/2/1_1.png`}
                        opacity={0.8}
                        zIndex={500}
                        attribution='Weather data © <a href="https://www.rainviewer.com">RainViewer</a>'
                    />
                )}
                {settings.weatherLayer === 'satellite' && weatherUrl && (
                    <TileLayer
                        url={`${weatherUrl}/256/{z}/{x}/{y}/0/1_1.png`} // '0' is usually Satellite/Infrared
                        opacity={0.7}
                        zIndex={500}
                        attribution='Weather data © <a href="https://www.rainviewer.com">RainViewer</a>'
                    />
                )}

                {/* Handle FlyTo animations */}
                <MapFlyTo position={selectedFlight && selectedFlight.latitude && selectedFlight.longitude ? [selectedFlight.latitude, selectedFlight.longitude] : null} />

                {/* Trail for selected flight */}
                {selectedFlight && selectedFlight.latitude && selectedFlight.longitude && (
                    <Polyline
                        positions={[
                            [selectedFlight.latitude - 0.5, selectedFlight.longitude - 0.5], // Fake previous point
                            [selectedFlight.latitude - 0.2, selectedFlight.longitude - 0.2], // Fake previous point
                            [selectedFlight.latitude, selectedFlight.longitude]
                        ]}
                        color="#ffcc00"
                        weight={3}
                        opacity={0.7}
                        dashArray="5, 10"
                    />
                )}

                {filteredFlights.map((flight) => {
                    // Ensure we have valid coordinates
                    if (!flight.latitude || !flight.longitude) return null;

                    const isSelected = selectedFlight?.icao24 === flight.icao24;
                    const isEmergency = flight.squawk === "7700";

                    return (
                        <Marker
                            key={flight.icao24}
                            position={[flight.latitude, flight.longitude]}
                            icon={createFlightIcon(flight.true_track || 0, isSelected, isEmergency)}
                            eventHandlers={{
                                click: () => onSelectFlight(flight),
                            }}
                        >
                            {/* If emergency, maybe custom pulse or marker? Icon generator can handle it in future. */}
                        </Marker>
                    );
                })}

                {/* Airports Layers */}
                {(() => {
                    const positions: { [key: string]: [number, number] } = {
                        'FCO': [41.8003, 12.2389],
                        'MXP': [45.6301, 8.7255],
                        'LIN': [45.4451, 9.2767],
                        'VCE': [45.5053, 12.3519],
                        'LHR': [51.4700, -0.4543],
                        'CDG': [49.0097, 2.5479]
                    };

                    return ['FCO', 'MXP', 'LIN', 'VCE', 'LHR', 'CDG'].map((code) => (
                        <Marker
                            key={code}
                            position={positions[code]}
                            icon={L.divIcon({
                                html: `
                                    <div class="flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
                                        <div class="bg-blue-600 w-3 h-3 rounded-full border-2 border-white shadow-lg relative z-10"></div>
                                        <span class="mt-1 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md shadow-md transform scale-75 whitespace-nowrap border border-white/10">${code}</span>
                                    </div>
                                `,
                                className: 'airport-marker-custom',
                                iconSize: [40, 40], // Increased size for label
                                iconAnchor: [20, 20] // Center anchor
                            })}
                        >
                            <Popup className="airport-popup">
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-lg mb-2 border-b pb-1">{code} Arrivals</h3>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between"><span className="text-green-600 font-bold">AZA124</span> <span>14:30</span></div>
                                        <div className="flex justify-between"><span className="text-green-600 font-bold">RYR54</span> <span>14:45</span></div>
                                        <div className="flex justify-between"><span className="text-yellow-600 font-bold">BAW42 (Delayed)</span> <span>15:10</span></div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))
                })()}
            </MapContainer >

            {/* Stats overlay */}
            < div className="absolute top-4 left-4 z-[999] bg-black/60 backdrop-blur-sm p-3 rounded-md text-white border border-gray-700" >
                <div className="text-xs text-gray-400 font-bold uppercase">Flights in Range</div>
                <div className="text-2xl font-mono text-fr24-yellow">{filteredFlights.length} <span className="text-sm text-gray-500">/ {flights.length}</span></div>
            </div >
        </div >
    );
};

export default FlightMap;
