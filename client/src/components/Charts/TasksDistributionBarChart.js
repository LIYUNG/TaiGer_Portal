import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const TasksDistributionBarChart = ({ data, k, value1, value2, yLabel }) => {
  const labels = data.map((d) => d[k]);
  const active_a = data.map((d) => d[value1]);
  const potential_a = data.map((d) => d[value2]);
  return (
    <BarChart
      series={[
        { data: active_a, stack: 'A', label: 'Active' },
        { data: potential_a, stack: 'A', label: 'Potentials' }
      ]}
      xAxis={[
        {
          data: labels,
          scaleType: 'band',
          id: 'axis1',
          interval: 0
        }
      ]}
      yAxis={[
        {
          label: yLabel
        }
      ]}
      height={300}
      barLabel="value"
      sx={{
        [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
          transform: 'rotateZ(-45deg)',
          textAnchor: 'end',
          dy: '10px'
        }
      }}
    />
  );
};

export default TasksDistributionBarChart;
