import React from 'react';

import { Typography, Grid } from '@mui/material';

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

import ExampleWithLocalizationProvider from '../../../components/MaterialReactTable/index';

// TODO: to be moved to single student
const StudentResponseTimeChart = ({ studentResponseTime }) => {
  const fileTypes = ['CV', 'ML', 'RL', 'Essay', 'Messages', 'Agent Support'];

  const chartData = fileTypes.map((type) => ({
    name: type,
    ResponseTime:
      parseFloat(studentResponseTime.intervalGroup[type]?.toFixed(2)) || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis>
          <Label
            value={`${studentResponseTime.student?.firstname} ${studentResponseTime.student?.lastname}`}
            angle={-90}
            position="insideLeft"
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <Bar dataKey="ResponseTime" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ResponseTimeDashboard = ({
  studentResponseTimeLookupTable,
  normalizedResults,
  memoizedColumnsMrt
}) => {
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography variant="h6">Student Response Time</Typography>
    </Grid>
    <Grid item xs={12}>
      <ExampleWithLocalizationProvider
        data={normalizedResults}
        col={memoizedColumnsMrt}
      />
    </Grid>
    {false &&
      studentResponseTimeLookupTable.map((studentResponseTime, idx) => (
        <Grid item xs={12} md={4} key={idx}>
          <StudentResponseTimeChart studentResponseTime={studentResponseTime} />
        </Grid>
      ))}
  </Grid>;
};

export default ResponseTimeDashboard;
