/**
 * Main Application Component
 * @author Umberto Casa
 */
import React, { useState } from 'react';
import FlightMap from './components/FlightMap';
import Sidebar from './components/Sidebar';
import Controls, { type AppSettings } from './components/Controls';
import { type Flight } from './services/api';

function App() {
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [settings, setSettings] = useState<AppSettings>({
        mapStyle: 'dark',
        showWeather: false,
        useMetric: false, // Default to nautical/feet as request implied standard
        filters: {
            minAltitude: 0,
            airline: ''
        }
    });

    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col relative bg-fr24-dark">
            <div className="flex-1 relative">
                <FlightMap
                    selectedFlight={selectedFlight}
                    onSelectFlight={setSelectedFlight}
                    settings={settings}
                />

                <Controls settings={settings} onUpdate={setSettings} />

                <Sidebar
                    flight={selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                    useMetric={settings.useMetric}
                />
            </div>
        </div>
    );
}

export default App;
