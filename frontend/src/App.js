import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import axios from 'axios';

import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import Dashboard from './Dashboard';

const CATEGORY_COLORS = {
  Wildfires: 'red',
  Volcanoes: 'orange',
  Floods: 'blue',
  SevereStorms: 'purple',
  Earthquakes: 'brown',
  Landslides: 'green',
  SeaLakeIce: 'cyan',
  Drought: 'gold',
  default: 'gray',
};

function App() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://85319u635c.execute-api.us-east-1.amazonaws.com/dev/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filtered = category === 'All'
    ? events
    : events.filter(e => e.category === category);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Dashboard events={events} category={category} setCategory={setCategory} />

      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Loading map data...</p>
          </div>
        ) : (
          <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
              {filtered.map(event => {
                const coords = event.coordinates;
                if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;

                const color = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.default;

                return (
                  <Marker
                    key={event.id}
                    position={[coords[1], coords[0]]}
                    pathOptions={{ color }}
                  >
                    <Popup>
                      <strong>{event.title}</strong><br />
                      <em>{event.category}</em><br />
                      {new Date(event.date).toLocaleString()}<br />
                      <a href={event.link} target="_blank" rel="noreferrer">Details</a>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default App;
