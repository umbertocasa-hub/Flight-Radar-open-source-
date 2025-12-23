/**
 * Controls Component - UI for Maps, Weather, and Filters
 * @author Umberto Casa
 */
import React from 'react';
import { CloudRain, Ruler, Filter, Moon, Sun, Globe } from 'lucide-react';

export interface AppSettings {
    mapStyle: 'dark' | 'light' | 'satellite';
    showWeather: boolean;
    useMetric: boolean;
    filters: {
        minAltitude: number;
        airline: string;
    };
}

interface ControlsProps {
    settings: AppSettings;
    onUpdate: (newSettings: AppSettings) => void;
}

const Controls: React.FC<ControlsProps> = ({ settings, onUpdate }) => {

    const update = (key: keyof AppSettings, value: any) => {
        onUpdate({ ...settings, [key]: value });
    };

    const updateFilter = (key: keyof AppSettings['filters'], value: any) => {
        onUpdate({ ...settings, filters: { ...settings.filters, [key]: value } });
    };

    return (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
            {/* Map Style Toggle */}
            <div className="bg-black/80 backdrop-blur-md p-2 rounded-lg border border-gray-700 pointer-events-auto flex gap-2 shadow-xl">
                <button
                    onClick={() => update('mapStyle', 'dark')}
                    className={`p-2 rounded hover:bg-white/10 ${settings.mapStyle === 'dark' ? 'text-fr24-yellow bg-white/10' : 'text-gray-400'}`}
                    title="Dark Mode"
                >
                    <Moon size={20} />
                </button>
                <button
                    onClick={() => update('mapStyle', 'light')}
                    className={`p-2 rounded hover:bg-white/10 ${settings.mapStyle === 'light' ? 'text-fr24-yellow bg-white/10' : 'text-gray-400'}`}
                    title="Light Mode"
                >
                    <Sun size={20} />
                </button>
                <button
                    onClick={() => update('mapStyle', 'satellite')}
                    className={`p-2 rounded hover:bg-white/10 ${settings.mapStyle === 'satellite' ? 'text-fr24-yellow bg-white/10' : 'text-gray-400'}`}
                    title="Satellite"
                >
                    <Globe size={20} />
                </button>
            </div>

            {/* Toggles */}
            <div className="bg-black/80 backdrop-blur-md p-2 rounded-lg border border-gray-700 pointer-events-auto flex flex-col gap-2 shadow-xl w-48">

                <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-2">
                        <CloudRain size={16} className="text-blue-400" /> Weather
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.showWeather} onChange={(e) => update('showWeather', e.target.checked)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
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
            </div>
        </div>
    );
};

export default Controls;
