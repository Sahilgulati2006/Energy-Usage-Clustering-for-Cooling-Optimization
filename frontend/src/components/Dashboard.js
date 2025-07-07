import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

function Dashboard() {
  const [rackData, setRackData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/clusters')
      .then(response => {
        setRackData(response.data);
        console.log('✅ Data received:', response.data);
      })
      .catch(error => {
        console.error('❌ Error fetching data:', error);
      });
  }, []);

  const clusterColors = {
    'Cluster A': '#FF6B6B',
    'Cluster B': '#4ECDC4',
    'Cluster C': '#1A535C',
    'Cluster D': '#FFA600'
  };

  return (
    <div className="dashboard" style={{ padding: '30px' }}>
      
      {/* Info Table */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 3px 10px rgba(0,0,0,0.05)',
        marginBottom: '40px'
      }}>
        <h2 style={{ marginBottom: '10px' }}>Rack Cluster Dashboard</h2>
        <p style={{ fontSize: '18px', fontWeight: '500' }}>Total Racks: {rackData.length}</p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f4f6f8', textAlign: 'left' }}>
            <tr>
              <th style={thStyle}>Rack ID</th>
              <th style={thStyle}>⚡ Energy (W)</th>
              <th style={thStyle}>🌡 Temp (°C)</th>
              <th style={thStyle}>🔗 Cluster</th>
              <th style={thStyle}>💡 Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {rackData.map((rack, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{rack.rack_id}</td>
                <td style={tdStyle}>{rack.energy_watts.toFixed(2)}</td>
                <td style={tdStyle}>{rack.temperature_c.toFixed(2)}</td>
                <td style={{ ...tdStyle, fontWeight: '500', color: clusterColors[rack.cluster_name] }}>
                  {rack.cluster_name}
                </td>
                <td style={tdStyle}>{rack.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📈 Scatter Plot */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 3px 10px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Energy vs Temperature (Clustered)</h3>

        <ScatterChart
          width={800}
          height={400}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis 
            type="number" 
            dataKey="energy_watts" 
            name="Energy (W)" 
            label={{ value: "Energy (W)", position: "insideBottom", offset: -5 }}
          />
          <YAxis 
            type="number" 
            dataKey="temperature_c" 
            name="Temperature (°C)" 
            label={{ value: "Temp (°C)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend verticalAlign="top" />

          {Object.keys(clusterColors).map((cluster, idx) => (
            <Scatter
              key={idx}
              name={cluster}
              data={rackData.filter(d => d.cluster_name === cluster)}
              fill={clusterColors[cluster]}
            />
          ))}
        </ScatterChart>
      </div>
    </div>
  );
}

const thStyle = {
  padding: '12px',
  borderBottom: '2px solid #ddd',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee'
};

export default Dashboard;
