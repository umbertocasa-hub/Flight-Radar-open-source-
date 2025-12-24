/**
 * Controls Component - UI for Maps, Weather, and Filters
 * @author Umberto Casa
 */
import React from 'react';
import { CloudRain, Ruler, Filter, Moon, Sun, Globe } from 'lucide-react';

export interface AppSettings {
    mapStyle: 'dark' | 'light' | 'satellite';
    weatherLayer: 'none' | 'radar' | 'satellite';
    useMetric: boolean;
    filters: {
        minAltitude: number;
        airline: string;
    };
}

// ... props
interface ControlsProps {
    settings: AppSettings;
    onUpdate: (newSettings: AppSettings) => void;
    onShowLegal: () => void;
}

const Controls: React.FC<ControlsProps> = ({ settings, onUpdate, onShowLegal }) => {

    const update = (key: keyof AppSettings, value: any) => {
        onUpdate({ ...settings, [key]: value });
    };

    const updateFilter = (key: keyof AppSettings['filters'], value: any) => {
        onUpdate({ ...settings, filters: { ...settings.filters, [key]: value } });
    };

    return (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
            {/* Map Style Toggle */}
            {/* ... */}

            {/* Toggles */}
            <div className="bg-black/80 backdrop-blur-md p-2 rounded-lg border border-gray-700 pointer-events-auto flex flex-col gap-2 shadow-xl w-48">

                <div className="flex flex-col gap-1 text-white text-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <CloudRain size={16} className="text-blue-400" /> Weather Layer
                    </div>
                    <div className="flex bg-gray-700 rounded p-0.5">
                        <button
                            onClick={() => update('weatherLayer', 'none')}
                            className={`flex-1 text-[10px] uppercase py-1 rounded ${settings.weatherLayer === 'none' ? 'bg-gray-500 text-white' : 'hover:bg-gray-600 text-gray-400'}`}
                        >
                            None
                        </button>
                        <button
                            onClick={() => update('weatherLayer', 'radar')}
                            className={`flex-1 text-[10px] uppercase py-1 rounded ${settings.weatherLayer === 'radar' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600 text-gray-400'}`}
                        >
                            Radar
                        </button>
                        <button
                            onClick={() => update('weatherLayer', 'satellite')}
                            className={`flex-1 text-[10px] uppercase py-1 rounded ${settings.weatherLayer === 'satellite' ? 'bg-purple-600 text-white' : 'hover:bg-gray-600 text-gray-400'}`}
                        >
                            Cloud
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-2">
                        <Ruler size={16} className="text-green-400" /> Units (Metric)
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.useMetric} onChange={(e) => update('useMetric', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>

            </div>

            {/* Filters */}
            <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-gray-700 pointer-events-auto flex flex-col gap-3 shadow-xl w-64">
                <div className="flex items-center gap-2 text-fr24-yellow text-sm font-bold uppercase border-b border-gray-600 pb-2">
                    <Filter size={16} /> Filters
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Min Altitude: {settings.filters.minAltitude}m</label>
                    <input
                        type="range"
                        min="0"
                        max="12000"
                        step="500"
                        value={settings.filters.minAltitude}
                        onChange={(e) => updateFilter('minAltitude', parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-fr24-yellow"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Airline (Callsign)</label>
                    <input
                        type="text"
                        placeholder="e.g. RYR, AZA..."
                        value={settings.filters.airline}
                        onChange={(e) => updateFilter('airline', e.target.value.toUpperCase())}
                        className="w-full bg-black/50 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:border-fr24-yellow outline-none uppercase"
                    />
                </div>

                <div className="pt-2 border-t border-gray-600">
                    <button onClick={onShowLegal} className="text-xs text-gray-500 hover:text-white underline w-full text-center">
                        Legal & Disclaimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Controls;
