import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import axios from 'axios';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('https://85319u635c.execute-api.us-east-1.amazonaws.com/dev/events?limit=100')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: 'black' }}>🛰️ SentinelGrid Explorer</h2>
      <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom style={{ height: '90vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map(event => (
          <Marker key={event.id} position={event.coordinates}>
            <Popup>
              <strong>{event.title}</strong><br />
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
