from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATA_PATH = "/Users/sahilgulati/Desktop/Energy-Usage-Clustering-for-Cooling-Optimization/data/simulated_rack_data.csv"

@app.route('/api/clusters', methods=['GET'])
def get_cluster_data():
    # Check if file exists
    if not os.path.exists(DATA_PATH):
        return jsonify({"error": "Data file not found"}), 404

    try:
        # Load CSV
        df = pd.read_csv(DATA_PATH, parse_dates=['timestamp'])

        # Aggregate features by rack
        rack_features = df.groupby('rack_id')[['energy_watts', 'temperature_c']].mean().reset_index()

        # Normalize for clustering
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(rack_features[['energy_watts', 'temperature_c']])

        # Clustering
        kmeans = KMeans(n_clusters=4, random_state=42, n_init='auto')
        clusters = kmeans.fit_predict(X_scaled)

        rack_features['cluster'] = clusters
        rack_features['cluster_name'] = rack_features['cluster'].map({
            0: 'Cluster A',
            1: 'Cluster B',
            2: 'Cluster C',
            3: 'Cluster D'
        })

        rack_features['recommendation'] = rack_features['cluster_name'].map({
            'Cluster A': 'Check cooling',
            'Cluster B': 'Possibly idle',
            'Cluster C': 'Normal',
            'Cluster D': 'Efficient cooling'
        })

        # Anomaly Detection
        def detect_anomaly(row):
            if row['temperature_c'] > 34 and row['energy_watts'] < 250:
                return 'Inefficient Cooling'
            elif row['temperature_c'] > 34 and row['energy_watts'] > 300:
                return 'Overutilized & Hot'
            elif row['temperature_c'] < 28 and row['energy_watts'] < 200:
                return 'Underutilized'
            else:
                return 'Normal'

        rack_features['anomaly'] = rack_features.apply(detect_anomaly, axis=1)

        # Prepare response
        response = {
            'total_racks': int(len(rack_features)),
            'avg_temp': round(rack_features['temperature_c'].mean(), 2),
            'total_energy': round(rack_features['energy_watts'].sum(), 2),
            'anomalies': int(rack_features[rack_features['anomaly'] != 'Normal'].shape[0]),
            'data': rack_features.to_dict(orient='records')
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
