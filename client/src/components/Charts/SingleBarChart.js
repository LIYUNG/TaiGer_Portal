import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const SingleBarChart = ({ data, label, yLabel }) => {
  const labels = data.map((d) => d.name);
  const active_a = data.map((d) => d.uv);
  return (
    <BarChart
      series={[{ data: active_a, label: label }]}
      xAxis={[
        {
          data: labels,
          scaleType: 'band',
          id: 'axis2',
          interval: 0
        }
      ]}
      yAxis={[
        {
          label: yLabel
        }
      ]}
      barLabel="value"
      height={300}
    />
  );
};

export default SingleBarChart;
