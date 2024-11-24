import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';

const AgentBarCharts = ({ agentDistr }) => {
  // Extract unique years from both arrays

  const combinedKeys = Array.from(
    new Set(
      [
        ...Object.keys(agentDistr.admission),
        ...Object.keys(agentDistr.noAdmission)
      ]?.sort()
    )
  );
  const admissionDataset = [];
  const noAdmissionDataset = [];

  // Populate datasets
  combinedKeys.forEach((key) => {
    admissionDataset.push(agentDistr.admission[key] || 0);
    noAdmissionDataset.push(agentDistr.noAdmission[key] || 0);
  });
  return (
    <Box>
      <Typography variant="h6">{agentDistr.name}</Typography>
      <MuiBarChart
        xAxis={[{ scaleType: 'band', data: combinedKeys }]}
        yAxis={[
          {
            label: 'Student'
          }
        ]}
        series={[
          { label: 'No Offer', data: noAdmissionDataset },
          { label: 'Has Offer', data: admissionDataset }
        ]}
        height={250}
        width={400}
      />
    </Box>
  );
};

const AgentDashboard = ({ agentStudentDistribution }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Active Students distribution</Typography>
      </Grid>
      {agentStudentDistribution.map((agentDistr, idx) => (
        <Grid item xs={12} md={4} key={idx}>
          <AgentBarCharts agentDistr={agentDistr} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AgentDashboard;
