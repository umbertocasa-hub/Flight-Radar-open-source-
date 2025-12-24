/**
 * Sidebar Component - Displays detailed flight info
 * @author Umberto Casa
 */
import React, { useEffect, useState } from 'react';
import { X, Plane, Share2, MoreHorizontal, Gauge, ArrowUp, Bell, Star, Copy, CloudRain } from 'lucide-react';
import type { Flight, FlightDetail, WeatherData } from '../services/api';
import { fetchFlightDetails, fetchWeather } from '../services/api';

interface SidebarProps {
    flight: Flight | null;
    onClose: () => void;
    useMetric: boolean;
    onShowLegal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ flight, onClose, useMetric, onShowLegal }) => {
    const [details, setDetails] = useState<FlightDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [show3D, setShow3D] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const [originWeather, setOriginWeather] = useState<WeatherData | null>(null);
    const [destWeather, setDestWeather] = useState<WeatherData | null>(null);

    // Helper for units
    const formatAlt = (val: number) => useMetric ? `${Math.round(val)} m` : `${Math.round(val * 3.28084)} ft`;
    const formatSpeed = (val: number) => useMetric ? `${Math.round(val * 3.6)} km/h` : `${Math.round(val * 1.94384)} kts`;
    const formatVert = (val: number) => useMetric ? `${Math.round(val)} m/s` : `${Math.round(val * 196.85)} fpm`;

    useEffect(() => {
        setDetails(null);
        setOriginWeather(null);
        setDestWeather(null);
        setShowMoreMenu(false); // Reset menu on new flight
        if (flight) {
            setLoading(true);
            fetchFlightDetails(flight.icao24, flight.callsign || "")
                .then(async data => {
                    setDetails(data);

                    // Fetch Weather if schedule exists
                    if (data.schedule) {
                        if (data.schedule.origin.coords) {
                            const w = await fetchWeather(data.schedule.origin.coords[0], data.schedule.origin.coords[1]);
                            if (w) setOriginWeather({ ...w, city: data.schedule.origin.city });
                        }
                        if (data.schedule.destination.coords) {
                            const w = await fetchWeather(data.schedule.destination.coords[0], data.schedule.destination.coords[1]);
                            if (w) setDestWeather({ ...w, city: data.schedule.destination.city });
                        }
                    }
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [flight]);

    const handleCopyLink = () => {
        const link = window.location.href; // In real app, build specific URL
        navigator.clipboard.writeText(link);
        setShowMoreMenu(false);
        // Could add toast here
        alert("Flight link copied to clipboard!");
    };

    if (!flight) return null;

    return (
        <div className={`fixed left-0 top-0 bottom-0 w-full md:w-96 bg-fr24-charcoal text-white shadow-2xl transform transition-transform duration-300 z-[1000] overflow-y-auto ${flight ? 'translate-x-0' : '-translate-x-full'}`}>

            {/* Header Image Area */}
            <div className="relative h-56 bg-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                    <X size={20} color="white" />
                </button>

                {loading ? (
                    <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Loading Photo...</span>
                    </div>
                ) : details?.image?.found ? (
                    <>
                        <img
                            src={details.image.url}
                            alt={flight.callsign || "Aircraft"}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 text-[10px] bg-black/50 px-2 py-0.5 rounded text-white">
                            © {details.image.photographer} (Planespotters)
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-gray-400">
                        <Plane size={48} className="mb-2 opacity-50" />
                        <span className="text-xs">No Photo Available</span>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{flight.callsign || 'N/A'}</h2>
                    <p className="text-sm text-gray-300 font-medium">{flight.origin_country}</p>
                </div>
            </div>

            {/* Flight Info Actions */}
            <div className="flex justify-around py-3 border-b border-gray-700 bg-[#333] relative">
                <button className="flex flex-col items-center text-xs text-gray-400 hover:text-fr24-yellow transition-colors">
                    <Share2 size={18} className="mb-1" />
                    Share
                </button>
                <button
                    onClick={() => setShow3D(true)}
                    className="flex flex-col items-center text-xs text-gray-400 hover:text-fr24-yellow transition-colors"
                >
                    <Plane size={18} className="mb-1" />
                    3D View
                </button>
                <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`flex flex-col items-center text-xs transition-colors ${showMoreMenu ? 'text-fr24-yellow' : 'text-gray-400 hover:text-fr24-yellow'}`}
                >
                    <MoreHorizontal size={18} className="mb-1" />
                    More
                </button>

                {/* Dropdown Menu */}
                {showMoreMenu && (
                    <div className="absolute top-14 right-2 w-48 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-2xl z-50 text-white overflow-hidden animate-in fade-in zoom-in duration-200">
                        <button onClick={handleCopyLink} className="w-full text-left px-4 py-3 hover:bg-[#3a3a3a] text-sm flex items-center gap-3 border-b border-gray-700">
                            <Copy size={16} className="text-gray-400" /> Copy Permalink
                        </button>
                        <button onClick={() => setShowMoreMenu(false)} className="w-full text-left px-4 py-3 hover:bg-[#3a3a3a] text-sm flex items-center gap-3 border-b border-gray-700">
                            <Bell size={16} className="text-gray-400" /> Flight Alerts
                        </button>
                        <button onClick={() => setShowMoreMenu(false)} className="w-full text-left px-4 py-3 hover:bg-[#3a3a3a] text-sm flex items-center gap-3">
                            <Star size={16} className="text-fr24-yellow" /> Add to Fly Fleet
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="p-4 space-y-6">

                {/* Route / Schedule (Real or Mocked) */}
                {details && details.schedule && (
                    <div className="bg-[#222] rounded-lg p-4 border border-gray-700 relative overflow-hidden">
                        {/* Delay Badge */}
                        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase rounded-bl-lg ${details.schedule.status === 'On Time' ? 'bg-green-600 text-white' :
                            details.schedule.status === 'Delayed' ? 'bg-red-600 text-white' :
                                'bg-gray-600 text-white'
                            }`}>
                            {details.schedule.status} {details.schedule.delay_minutes > 0 && `+${details.schedule.delay_minutes}m`}
                        </div>

                        <div className="flex justify-between items-center text-center mt-2">
                            <div className="flex-1">
                                <div className="text-3xl font-bold text-white">{details.schedule.origin.code}</div>
                                <div className="text-xs text-gray-400">{details.schedule.origin.city}</div>
                                {originWeather && (
                                    <div className="text-xs text-teal-400 flex items-center justify-center gap-1 mt-1">
                                        <CloudRain size={10} />
                                        {originWeather.temperature}°C
                                    </div>
                                )}
                                <div className="text-sm font-mono mt-1 text-gray-300">
                                    {new Date(details.schedule.scheduled_departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col items-center px-2">
                                <Plane className="transform rotate-90 text-gray-500 mb-1" size={20} />
                                <div className="w-full h-1 bg-gray-600 relative rounded-full">
                                    <div
                                        className={`absolute h-full rounded-full ${details.schedule.status === 'Delayed' ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${details.schedule.progress_percent}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="text-3xl font-bold text-white">{details.schedule.destination.code}</div>
                                <div className="text-xs text-gray-400">{details.schedule.destination.city}</div>
                                {destWeather && (
                                    <div className="text-xs text-teal-400 flex items-center justify-center gap-1 mt-1">
                                        <CloudRain size={10} />
                                        {destWeather.temperature}°C
                                    </div>
                                )}
                                <div className="text-sm font-mono mt-1 text-gray-300">
                                    {new Date(details.schedule.scheduled_arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#222] p-3 rounded-lg flex flex-col items-center border border-gray-700">
                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Altitude</div>
                        <div className="text-xl font-bold text-white flex items-baseline">
                            {formatAlt(flight.geo_altitude || flight.baro_altitude || 0)}
                        </div>
                        <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                            <div className="bg-fr24-yellow h-full transition-all duration-500" style={{ width: `${Math.min(((flight.geo_altitude || 0) / 40000) * 100, 100)}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-[#222] p-3 rounded-lg flex flex-col items-center border border-gray-700">
                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Ground Speed</div>
                        <div className="text-xl font-bold text-white flex items-baseline">
                            {formatSpeed(flight.velocity || 0)}
                        </div>
                        <Gauge size={16} className="text-gray-600 mt-2" />
                    </div>

                    <div className="bg-[#222] p-3 rounded-lg flex flex-col items-center border border-gray-700">
                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Vertical Rate</div>
                        <div className="text-lg font-mono text-white flex items-center">
                            {flight.vertical_rate && flight.vertical_rate > 0 ? <ArrowUp size={14} className="text-green-500 mr-1" /> : null}
                            {flight.vertical_rate && flight.vertical_rate < 0 ? <ArrowUp size={14} className="text-red-500 mr-1 transform rotate-180" /> : null}
                            {formatVert(flight.vertical_rate || 0)}
                        </div>
                    </div>

                    <div className="bg-[#222] p-3 rounded-lg flex flex-col items-center border border-gray-700">
                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Heading</div>
                        <div className="text-lg font-mono text-white flex items-center">
                            {Math.round(flight.true_track || 0)}°
                        </div>
                        <div className="relative w-6 h-6 mt-1 flex items-center justify-center">
                            <Plane size={16} className="text-gray-500 absolute" style={{ transform: `rotate(${flight.true_track}deg)` }} />
                        </div>
                    </div>
                </div>

                {/* Aircraft Details */}
                <div className="bg-[#222] rounded-lg border border-gray-700 overflow-hidden text-sm">
                    <div className="px-4 py-2 bg-[#2a2a2a] border-b border-gray-700 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        AIRCRAFT INFORMATION
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span className="text-gray-400">ICAO 24 Hex</span>
                            <span className="font-mono text-fr24-yellow select-all">{flight.icao24.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-2">
                            <span className="text-gray-400">Callsign</span>
                            <span className="font-mono text-white">{flight.callsign || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Country of Reg.</span>
                            <span className="text-white text-right">{flight.origin_country}</span>
                        </div>
                    </div>
                </div>

                {/* Free / Legal Notice */}
                <div onClick={onShowLegal} className="p-4 rounded-lg border border-gray-800 bg-gray-900 text-center cursor-pointer hover:bg-gray-800 transition-colors">
                    <CloudRain size={24} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-xs text-gray-500 mb-2">Weather data provided by Open-Meteo & RainViewer.</p>
                    <span className="text-[10px] text-fr24-yellow underline">Legal Disclaimer</span>
                </div>

            </div>

            {/* 3D View Modal */}
            {show3D && (
                <div className="fixed inset-0 z-[1100] bg-black flex flex-col animate-in fade-in duration-300">
                    <div className="absolute top-4 right-4 z-50">
                        <button onClick={() => setShow3D(false)} className="bg-black/50 text-white p-2 rounded-full hover:bg-white/20">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Simulated Cockpit View */}
                    <div className="flex-1 relative bg-sky-400 overflow-hidden">
                        {/* Sky/Ground Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200 h-1/2"></div>
                        <div className="absolute top-1/2 inset-x-0 bottom-0 bg-[#3b603b]"></div> {/* Ground */}

                        {/* Horizon Line Animation (Simulated) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[200%] h-1 bg-white/50 transform rotate-12 origin-center"></div>
                        </div>

                        {/* HUD Overlay */}
                        <div className="absolute inset-x-0 top-0 p-8 flex justify-between font-mono text-green-400 text-shadow-md">
                            <div className="flex flex-col gap-1 border-l-2 border-green-400/50 pl-2">
                                <span className="text-xl font-bold">{Math.round((flight.velocity || 0) * 1.94)} KTS</span>
                                <span className="text-sm">SPD</span>
                            </div>
                            <div className="flex flex-col gap-1 border-r-2 border-green-400/50 pr-2 text-right">
                                <span className="text-xl font-bold">{Math.round((flight.geo_altitude || 0))} FT</span>
                                <span className="text-sm">ALT</span>
                            </div>
                        </div>

                        {/* Center Crosshair */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-8 h-8 border-2 border-green-400 rounded-full flex items-center justify-center">
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-10 text-white font-mono bg-black/50 p-2 rounded">
                            CAM: COCKPIT VIEW
                            <br />
                            {flight.callsign}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
