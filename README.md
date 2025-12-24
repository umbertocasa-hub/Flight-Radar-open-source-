# ✈️ Flight Tracker Pro

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)

![Status](https://img.shields.io/badge/status-active-success.svg?style=for-the-badge)

<p align="center">
  <img src="assets/demo-1.png" width="45%" alt="Radar View" />
  <img src="assets/demo-2.png" width="45%" alt="Cloud View" />
</p>


A modern, real-time flight tracking application built with passion. Visualize air traffic, weather conditions, and aircraft details in a beautiful, responsive interface.

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

### APIs & Services
![FlightRadar24](https://img.shields.io/badge/FlightRadar24-Unofficial-yellow?style=for-the-badge)
![RainViewer](https://img.shields.io/badge/RainViewer-Weather-blue?style=for-the-badge)
![Open-Meteo](https://img.shields.io/badge/Open--Meteo-Weather-orange?style=for-the-badge)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Map-green?style=for-the-badge)

## ✨ key Features

-   **Real-Time Tracking**: Watch aircraft move in real-time across the map.
-   **Live Weather**: Animated Radar and Satellite layers to see clouds and precipitation.
-   **Accurate Details**: Click on any flight to see the *actual* aircraft photo and detailed schedule.
-   **Cockpit View**: Simulated view from the aircraft's perspective.
-   **Filters**: Filter by altitude or airline to find exactly what you're looking for.

## � Getting Started

### Prerequisites
-   Docker & Docker Compose
-   Node.js 20+ (for local frontend dev)
-   Python 3.10+ (for local backend dev)

### Quick Start (Docker)
The easiest way to run the full stack:

```bash
docker-compose up -d --build
```

Access the app at `http://localhost:5173`.

### Local Development

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork** the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  **Push** to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a **Pull Request**

## ⚠️ Disclaimer
This project is for **educational purposes only**. It uses unofficial APIs which may change or be restricted at any time. Do not use for safety-critical applications.

---
Made with ❤️ by [Umberto Casa](https://github.com/umbertocasa-hub)
