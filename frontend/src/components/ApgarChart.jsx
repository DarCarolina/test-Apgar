import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const ApgarChart = ({ data }) => {
  // Format data for Recharts: [{ minute: 1, score: 8 }, ...]
  const chartData = data
    .sort((a, b) => a.minuto - b.minuto)
    .map(eva => ({
      minute: `Min ${eva.minuto}`,
      score: eva.puntaje_total,
    }));

  return (
    <div style={{ width: '100%', height: 200, marginTop: '1rem' }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="minute" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 10]} 
            ticks={[0, 2, 4, 6, 8, 10]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '14px'
            }} 
          />
          <ReferenceLine y={3} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Crítico', position: 'right', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={7} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Bien', position: 'right', fill: '#10b981', fontSize: 10 }} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8 }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApgarChart;
