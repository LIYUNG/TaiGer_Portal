import React from 'react';
import {
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  ResponsiveContainer
} from 'recharts';

const TasksDistributionBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: 0,
          bottom: 40
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={315}
          dx={0}
          dy={25}
          minTickGap={-200}
          axisLine={false}
        />
        <YAxis allowDecimals={false} />
        <Legend verticalAlign="top" />
        <Tooltip />

        <Bar
          dataKey="active"
          fill="#FF0000"
          stackId={'a'}
          label={{ position: 'top' }}
        />
        <Bar
          dataKey="potentials"
          fill="#A9A9A9"
          stackId={'a'}
          label={{ position: 'top' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TasksDistributionBarChart;
