/**
 * Main Application Component
 * @author Umberto Casa
 */
import React, { useState } from 'react';
import FlightMap from './components/FlightMap';
import Sidebar from './components/Sidebar';
import Controls, { type AppSettings } from './components/Controls';
import { type Flight } from './services/api';

import LegalDisclaimer from './components/LegalDisclaimer';

function App() {
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [showLegal, setShowLegal] = useState(false);
    const [settings, setSettings] = useState<AppSettings>({
        mapStyle: 'dark',
        weatherLayer: 'radar',
        useMetric: false, // Default to nautical/feet as request implied standard
        filters: {
            minAltitude: 0,
            airline: ''
        }
    });

    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col relative bg-fr24-dark">
            <LegalDisclaimer isOpen={showLegal} onClose={() => setShowLegal(false)} />

            <div className="flex-1 relative">
                <FlightMap
                    selectedFlight={selectedFlight}
                    onSelectFlight={setSelectedFlight}
                    settings={settings}
                />

                <Controls
                    settings={settings}
                    onUpdate={setSettings}
                    onShowLegal={() => setShowLegal(true)}
                />

                <Sidebar
                    flight={selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                    useMetric={settings.useMetric}
                    onShowLegal={() => setShowLegal(true)}
                />
            </div>
        </div>
    );
}

export default App;
