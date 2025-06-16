import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import axios from 'axios';

const CATEGORY_COLORS = {
  Wildfires: 'red',
  Volcanoes: 'orange',
  Floods: 'blue',
  SevereStorms: 'purple',
  Earthquakes: 'brown',
  default: 'gray',
};

function App() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    axios.get('https://85319u635c.execute-api.us-east-1.amazonaws.com/dev/events?limit=100')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = category === 'All' ? events : events.filter(e => e.category === category);

  return (
    <div style={{ background: '#111', color: '#fff', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div style={{ padding: 10, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>🛰️ SentinelGrid Explorer</h2>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 8, borderRadius: 4 }}
        >
          <option value="All">All Categories</option>
          {[...new Set(events.map(e => e.category))].map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <MapContainer center={[20, 0]} zoom={2} style={{ height: '90vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map(event => (
          <Marker
            key={event.id}
            position={[event.coordinates[1], event.coordinates[0]]}
            pathOptions={{ color: CATEGORY_COLORS[event.category] || CATEGORY_COLORS.default }}
          >
            <Popup>
              <strong>{event.title}</strong><br />
              <em>{event.category}</em><br />
              {new Date(event.date).toLocaleString()}<br />
              <a href={event.link} target="_blank" rel="noreferrer">Details</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
