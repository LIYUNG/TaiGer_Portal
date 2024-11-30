import React from 'react';

import { Grid, Typography } from '@mui/material';

import {
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Legend,
  Label
} from 'recharts';

const fileTypes = [
  'communication',
  'CV',
  'ML',
  'RL_A',
  'RL_B',
  'RL_C',
  'Essay',
  'Supplementary_Form'
];

const BarChartTest = ({ chartData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={270}
          dx={0}
          dy={25}
          minTickGap={-200}
          axisLine={false}
        />
        <YAxis>
          <Label value="Duration (days)" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip labelStyle={{ color: 'black' }} />
        <Legend />
        <Bar dataKey="duration" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const responseTimeToChartData = (responseTime, threadType) => {
  return responseTime?.map((student) => ({
    name: student?.name,
    duration: student?.avgByType?.[threadType]
  }));
};

const ResponseTimeDashboardTab = ({ studentAvgResponseTime }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        test
      </Grid>
      {fileTypes.map((fileType) => (
        <Grid item key={fileType} xs={12}>
          <Typography>{fileType}</Typography>
          <BarChartTest
            chartData={responseTimeToChartData(
              studentAvgResponseTime,
              fileType
            )}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ResponseTimeDashboardTab;
