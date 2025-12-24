/**
 * LegalDisclaimer Component
 * Displays a modal with legal information and data usage policies.
 */
import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface LegalDisclaimerProps {
    isOpen: boolean;
    onClose: () => void;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#2a2a2a] w-full max-w-lg rounded-xl border border-gray-600 shadow-2xl overflow-hidden relative">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-fr24-yellow">
                        <ShieldAlert size={32} />
                        <h2 className="text-xl font-bold">Legal Disclaimer & Usage</h2>
                    </div>

                    <div className="space-y-4 text-sm text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                        <section>
                            <h3 className="text-white font-bold mb-1">Educational Purpose</h3>
                            <p>
                                This application ("Flight Tracker Pro") is developed strictly for
                                <strong> educational and demonstration purposes</strong>.
                                It is not intended for real-world navigation, flight planning, or safety-critical applications.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-1">Data Sources</h3>
                            <p>
                                Flight data is provided by the <a href="https://opensky-network.org" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">OpenSky Network</a>.
                                By using this app, you agree to comply with their Terms of Use.
                            </p>
                            <ul className="list-disc list-inside mt-2 text-xs text-gray-400 ml-2">
                                <li>Data is often delayed or interpolated.</li>
                                <li>Coverage is not guaranteed globally.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-1">Liability</h3>
                            <p>
                                The developer (Umberto Casa) assumes no liability for the accuracy, reliability, or completeness of the data presented.
                                Do not rely on this tool for any aviation activities.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-white font-bold mb-1">Hosting</h3>
                            <p>
                                This project is open-source. If you deploy this application (e.g., on Vercel, Netlify),
                                you are responsible for adhering to the API limits and licensing terms of the used data providers
                                (OpenSky Network, Open-Meteo, RainViewer).
                            </p>
                        </section>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-fr24-yellow hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalDisclaimer;
