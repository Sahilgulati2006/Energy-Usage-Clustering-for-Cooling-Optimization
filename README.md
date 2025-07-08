# README for Rack Cluster Monitoring Dashboard

# 🚀 Rack Cluster Monitoring Dashboard (IoT-Based Cooling Optimization)

This project is a full-stack **IoT anomaly detection and energy optimization system**. It simulates or ingests real-time sensor data from server racks (energy usage and temperature), clusters them using machine learning, detects anomalies, and displays everything on a dynamic, interactive React dashboard.

---

## 🔧 Tech Stack

- **Frontend**: React, Recharts, CSV Export
- **Backend**: Python Flask API
- **ML**: KMeans clustering, rule-based anomaly detection
- **Data**: Real-time simulated or actual IoT sensor logs
- **Bonus**: Dark mode, auto-refresh, search/filter/sort, CSV export

---

## 📂 Project Structure

```
Energy-Usage-Clustering-for-Cooling-Optimization/
│
├── backend/
│   ├── app.py                # Flask backend with clustering and anomaly API
│   ├── combining_data.py     # Optional: data processing script
│   ├── simulated_data.csv    # Auto-generated data
│   └── models/               # ML logic (if separated)
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js
│       └── Dashboard.js      # Main React dashboard
│
└── data/                     # Optional folder to store downloaded datasets
```

---

## 📈 Features

- 🔄 **Auto-refreshing dashboard**
- 🌃 **Dark/Light mode toggle**
- 🔍 **Rack search + filter by cluster**
- ⚠️ **Show only anomalies**
- 📊 **Interactive clustering chart**
- ⬇️ **CSV Export of filtered data**
- ✅ **Realistic simulation for 100 racks**

---

## 🚀 How to Run

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/Energy-Usage-Clustering-for-Cooling-Optimization.git
cd Energy-Usage-Clustering-for-Cooling-Optimization
```

### 2️⃣ Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will run at `http://127.0.0.1:5000`.

### 3️⃣ Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

The React dashboard will be served at `http://localhost:3000`.

---

## 🧠 How It Works

- Sensor data (simulated or real) is ingested with `timestamp`, `rack_id`, `energy_watts`, and `temperature_c`.
- A clustering algorithm (e.g., KMeans) groups racks into energy/thermal profiles.
- Anomalies (e.g., too hot or too power-hungry) are detected and flagged.
- React dashboard fetches, displays, and updates everything automatically.

---

## 📊 Sample Output

```json
{
  "rack_id": "rack_52",
  "energy_watts": 422.5,
  "temperature_c": 41.2,
  "cluster_name": "Cluster C",
  "anomaly": "High Temp",
  "recommendation": "Increase cooling airflow"
}
```

---

## 📋 Visualization

- Energy vs Temperature scatter plot, color-coded by cluster
- KPI cards for:
  - Total racks
  - Average temperature
  - Total energy
  - Number of anomalies

---

## 📁 Dataset

You can:
- Use the built-in simulator (default: 100 racks over 7 days)
- Or use real IoT data by placing files in the `data/` folder and adjusting the loader in `app.py`.

---

## 📌 Customization Ideas

- Integrate real-time MQTT broker for live streaming IoT data
- Add alerts via email or dashboard popups
- Use DBSCAN or isolation forest for more robust anomaly detection
- Deploy using Docker or Render

---

## 🧑‍💻 Contributors

- [Sahil Gulati](https://github.com/Sahilgulati2006)

---
