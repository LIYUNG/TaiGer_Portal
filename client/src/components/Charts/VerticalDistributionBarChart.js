import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const VerticalDistributionBarCharts = ({ data, k, value1, value2, xLabel }) => {
  const labels = data.map((d) => d[k]);
  const active_a = data.map((d) => d[value1]);
  const potential_a = data.map((d) => d[value2]);
  return (
    <BarChart
      series={[
        { data: active_a, stack: 'A', label: 'Active' },
        { data: potential_a, stack: 'A', label: 'Potentail' }
      ]}
      xAxis={[
        {
          label: xLabel
        }
      ]}
      yAxis={[
        {
          data: labels,
          scaleType: 'band',
          id: 'axis1',
          interval: 0
        }
      ]}
      height={300}
      layout="horizontal"
      grid={{ vertical: true }}
      barLabel="value"
    />
  );
};

export default VerticalDistributionBarCharts;
