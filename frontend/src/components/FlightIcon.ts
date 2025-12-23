import L from 'leaflet';

export const createFlightIcon = (rotation: number = 0, selected: boolean = false, isEmergency: boolean = false) => {
    // SVG for a simplified airplane shape
    // Using a path that points 'up' (0 degrees) by default so rotation logic works naturally
    const fillColor = isEmergency ? '#ef4444' : (selected ? '#ffcc00' : '#eab308');
    const strokeColor = selected || isEmergency ? '#ffffff' : '#000000';

    // Add pulsing class for emergency
    const animationClass = isEmergency ? 'animate-pulse' : '';

    const planeSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" class="${animationClass}" style="transform: rotate(${rotation}deg); transform-origin: center;">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" 
              fill="${fillColor}" 
              stroke="${strokeColor}" 
              stroke-width="${selected ? '2' : '1'}"
              style="filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.5));" />
    </svg>
  `;

    return L.divIcon({
        html: planeSvg,
        className: 'flight-icon', // Use this class to remove default square box if needed in CSS
        iconSize: [30, 30],
        iconAnchor: [15, 15], // Center the icon
        popupAnchor: [0, -15],
    });
};
