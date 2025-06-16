import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Dashboard({ events, category, setCategory }) {
  const filtered = category === 'All'
    ? events
    : events.filter((e) => e.category === category);

  const categoryCounts = filtered.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const latest = filtered[0];

  return (
    <aside style={{
      width: '320px',
      background: '#222',
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box',
      overflowY: 'auto',
    }}>
      <h2>🛰️ SentinelGrid</h2>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '20px', borderRadius: '4px' }}
      >
        <option value="All">All Categories</option>
        {[...new Set(events.map((e) => e.category))].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div className="stats">
        <p><strong>Total Events:</strong> {filtered.length}</p>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <p key={cat}>
            <strong>{cat}:</strong> {count}
          </p>
        ))}
        {latest && (
          <div style={{ marginTop: 10 }}>
            <p><strong>Latest:</strong><br />{latest.title}</p>
          </div>
        )}
      </div>

      <h4 style={{ marginTop: 20 }}>Events by Category</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={Object.entries(categoryCounts).map(([k, v]) => ({
            name: k,
            count: v,
          }))}
        >
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </aside>
  );
}

export default Dashboard;
