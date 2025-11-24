import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

function ChatUserGrowthChart() {
  const data = [
    { month: "May", users: 0 },
    { month: "Jun", users: 7 },
    { month: "Jul", users: 3.5 },
    { month: "Aug", users: 10.5 },
    { month: "Sep", users: 5.5 },
    { month: "Oct", users: 13.5 },
    { month: "Nov", users: 7 },
    { month: "Dec", users: 20 }
  ];

  return (
    <div className="w-full mt-4 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Chat User Growth Overview
      </h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="0" 
            stroke="#ff6b35" 
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#000', fontSize: 14 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#000', fontSize: 14 }}
            ticks={[0, 4, 8, 12, 16, 20]}
            domain={[0, 20]}
            tickFormatter={(value) => value.toString().padStart(2, '0')}
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#ff6b35" 
            strokeWidth={3}
            dot={false}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChatUserGrowthChart;