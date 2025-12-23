# Flight Tracker Pro ✈️
**Author:** Umberto Casa
**License:** Open Source (Unlicense / MIT - Do whatever you want)

Flight Tracker Pro is a modern, real-time flight tracking application inspired by FlightRadar24. It visualizes live air traffic using a modern tech stack and provides detailed flight information, including simulated schedules and 3D cockpit views.

![Demo](https://via.placeholder.com/800x400.png?text=Flight+Tracker+Pro+Demo)

## 🚀 Features

*   **Real-time Tracking**: Live aircraft positions on an interactive map.
*   **Detailed Flight Data**: Speed, altitude, vertical rate, and origin/destination (simulated for commercial flights).
*   **Real Imagery**: Fetches actual aircraft photos using the Planespotters.net API.
*   **Pro Features**:
    *   **3D Cockpit View**: Simulated pilot perspective.
    *   **Emergency Alerts**: Visual highlighting for Squawk 7700 (Emergency) aircraft.
    *   **Weather Layers**: Real-time precipitation radar overlay.
    *   **Filters**: Filter by altitude or airline.
    *   **Map Styles**: Switch between Dark, Light, and Satellite views.

## 🛠️ Architecture

The project is containerized using Docker and consists of:

*   **Frontend**: React (Vite) + TailwindCSS + Leaflet (Map).
*   **Backend**: Python FastAPI.
    *   **Data Sources**: OpenSky Network (ADS-B Data), Planespotters.net (Images), OpenWeatherMap (Tiles).
    *   **Logic**: Data aggregation, commercial flight simulation (mock schedules), and caching.

## 📦 Installation

This project is designed to run with Docker Compose.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/YourUsername/flight-tracker.git
    cd flight-tracker
    ```

2.  **Start the application**:
    ```bash
    docker-compose up --build
    ```

3.  **Access**:
    *   **Frontend**: [http://localhost:5173](http://localhost:5173)
    *   **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🔧 APIs & Credits

*   **OpenSky Network**: For providing free academic access to live ADS-B data.
*   **Planespotters.net**: For the extensive database of aircraft photography.
*   **OpenWeatherMap**: For weather tile layers.

---
*Built with ❤️ by Umberto Casa.*
