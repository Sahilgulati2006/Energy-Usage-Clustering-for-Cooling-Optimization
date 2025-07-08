import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { CSVLink } from 'react-csv';

function Dashboard() {
  const [rackData, setRackData] = useState([]);
  const [summary, setSummary] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('All');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [intervalMs, setIntervalMs] = useState(10000);
  const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  const fetchData = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:5000/api/clusters')
      .then(response => {
        setRackData(response.data.data);
        setSummary({
          totalRacks: response.data.total_racks,
          avgTemp: response.data.avg_temp,
          totalEnergy: response.data.total_energy,
          anomalies: response.data.anomalies
        });
        setLastUpdated(new Date().toLocaleString());
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const clusterColors = {
    'Cluster A': '#FF6B6B',
    'Cluster B': '#4ECDC4',
    'Cluster C': '#1A535C',
    'Cluster D': '#FFA600'
  };

  let filteredRacks = rackData
    .filter(rack =>
      rack.rack_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(rack =>
      selectedCluster === 'All' ? true : rack.cluster_name === selectedCluster
    )
    .filter(rack =>
      showOnlyAnomalies ? rack.anomaly !== 'Normal' : true
    );

  if (sortKey) {
    filteredRacks = filteredRacks.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredRacks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRacks.length / rowsPerPage);

  const handleSort = key => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div style={{
      padding: '30px',
      backgroundColor: darkMode ? '#121212' : '#f8f9fa',
      color: darkMode ? '#eee' : '#000',
      minHeight: '100vh'
    }}>
      <h2 style={{ marginBottom: '10px' }}>📊 Rack Cluster Dashboard</h2>

      {/* Controls */}
      <div style={{
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '20px'
      }}>
        <input
          type="text"
          placeholder="🔍 Search Rack ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            width: '220px',
            border: '1px solid #ccc',
            borderRadius: '6px'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '8px' }}>🔗 Cluster:</label>
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              minWidth: '130px'
            }}
          >
            <option value="All">All</option>
            <option value="Cluster A">Cluster A</option>
            <option value="Cluster B">Cluster B</option>
            <option value="Cluster C">Cluster C</option>
            <option value="Cluster D">Cluster D</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '8px' }}>🧪 Show Only Anomalies:</label>
          <input
            type="checkbox"
            checked={showOnlyAnomalies}
            onChange={() => setShowOnlyAnomalies(!showOnlyAnomalies)}
            style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ marginRight: '8px' }}>⏱ Refresh:</label>
          <select
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          >
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={60000}>1 min</option>
          </select>
        </div>
      </div>

      {/* Theme toggle & Export */}
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>🌓 Theme:</label>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '8px 16px',
            backgroundColor: darkMode ? '#ddd' : '#333',
            color: darkMode ? '#000' : '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>

        <CSVLink
          data={filteredRacks}
          filename={"rack-data-export.csv"}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '6px',
            marginLeft: '20px'
          }}
        >
          ⬇ Export CSV
        </CSVLink>
      </div>

      <p style={{ fontStyle: 'italic', fontSize: '14px' }}>Last updated: {lastUpdated}</p>

      {loading ? (
        <p style={{ fontSize: '18px', marginTop: '30px' }}>⏳ Loading data...</p>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <KPI label="Total Racks" value={summary.totalRacks} />
            <KPI label="Avg Temp (°C)" value={summary.avgTemp} />
            <KPI label="Total Energy (W)" value={summary.totalEnergy} />
            <KPI label="Anomalies" value={summary.anomalies} color="#FF6B6B" />
          </div>

          {/* Table */}
          <div style={{
            background: darkMode ? '#1e1e1e' : '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.05)',
            marginBottom: '40px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: darkMode ? '#2c2c2c' : '#f4f6f8', textAlign: 'left' }}>
                <tr>
                  <th style={thStyle}>Rack ID</th>
                  <th style={thStyle} onClick={() => handleSort('energy_watts')}>⚡ Energy (W)</th>
                  <th style={thStyle} onClick={() => handleSort('temperature_c')}>🌡 Temp (°C)</th>
                  <th style={thStyle}>🔗 Cluster</th>
                  <th style={thStyle}>💡 Recommendation</th>
                  <th style={thStyle}>❗ Anomaly</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((rack, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #eee',
                    backgroundColor: rack.anomaly !== 'Normal' ? '#fff0f0' : 'transparent'
                  }}>
                    <td style={tdStyle}>{rack.rack_id}</td>
                    <td style={tdStyle}>{rack.energy_watts.toFixed(2)}</td>
                    <td style={tdStyle}>{rack.temperature_c.toFixed(2)}</td>
                    <td style={{ ...tdStyle, fontWeight: '500', color: clusterColors[rack.cluster_name] }}>
                      {rack.cluster_name}
                    </td>
                    <td style={tdStyle}>{rack.recommendation}</td>
                    <td style={{
                      ...tdStyle,
                      fontWeight: rack.anomaly !== 'Normal' ? '600' : '400',
                      color: rack.anomaly !== 'Normal' ? '#d00000' : '#666'
                    }}>
                      {rack.anomaly}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: currentPage === i + 1 ? '#007bff' : '#ddd',
                    color: currentPage === i + 1 ? '#fff' : '#333',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div style={{
            background: darkMode ? '#1e1e1e' : '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>📈 Energy vs Temperature (Clustered)</h3>
            <ScatterChart width={800} height={400} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <CartesianGrid stroke={darkMode ? "#444" : "#ccc"} />
              <XAxis type="number" dataKey="energy_watts" name="Energy (W)" stroke={darkMode ? '#ddd' : '#333'} />
              <YAxis type="number" dataKey="temperature_c" name="Temp (°C)" stroke={darkMode ? '#ddd' : '#333'} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend verticalAlign="top" />
              {Object.keys(clusterColors).map((cluster, idx) => (
                <Scatter
                  key={idx}
                  name={cluster}
                  data={filteredRacks.filter(d => d.cluster_name === cluster)}
                  fill={clusterColors[cluster]}
                />
              ))}
            </ScatterChart>
          </div>
        </>
      )}
    </div>
  );
}

// KPI component
function KPI({ label, value, color = '#333' }) {
  return (
    <div style={{
      background: '#f8f9fa',
      padding: '15px 20px',
      borderRadius: '8px',
      minWidth: '140px',
      boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '14px', color: '#666' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: '600', color }}>{value}</div>
    </div>
  );
}

const thStyle = {
  padding: '12px',
  borderBottom: '2px solid #ddd',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee'
};

export default Dashboard;
