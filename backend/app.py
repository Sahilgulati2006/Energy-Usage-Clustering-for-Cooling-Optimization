from flask import Flask, jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # <-- This allows cross-origin requests from React


@app.route('/api/clusters', methods=['GET'])
def get_cluster_data():
    # Load data
    df = pd.read_csv("/Users/sahilgulati/Desktop/Energy-Usage-Clustering-for-Cooling-Optimization/data/simulated_rack_data.csv", parse_dates=['timestamp'])

    # Aggregate
    rack_features = df.groupby('rack_id')[['energy_watts', 'temperature_c']].mean().reset_index()

    # Normalize
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(rack_features[['energy_watts', 'temperature_c']])

    # KMeans
    kmeans = KMeans(n_clusters=4, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)

    rack_features['cluster'] = clusters
    rack_features['cluster_name'] = rack_features['cluster'].map({
        0: 'Cluster A',
        1: 'Cluster B',
        2: 'Cluster C',
        3: 'Cluster D'
    })

    # Optional: Recommendations
    rack_features['recommendation'] = rack_features['cluster_name'].map({
        'Cluster A': 'Check cooling',
        'Cluster B': 'Possibly idle',
        'Cluster C': 'Normal',
        'Cluster D': 'Efficient cooling'
    })

    # Convert to JSON
    result = rack_features.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
