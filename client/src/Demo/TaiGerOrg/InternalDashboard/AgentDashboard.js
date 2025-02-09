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
                height={250}
                series={[
                    { label: 'No Offer', data: noAdmissionDataset },
                    { label: 'Has Offer', data: admissionDataset }
                ]}
                width={400}
                xAxis={[{ scaleType: 'band', data: combinedKeys }]}
                yAxis={[
                    {
                        label: 'Student'
                    }
                ]}
            />
        </Box>
    );
};

const AgentDashboard = ({ agentStudentDistribution }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">
                    Active Students distribution
                </Typography>
            </Grid>
            {agentStudentDistribution.map((agentDistr, idx) => (
                <Grid item key={idx} md={4} xs={12}>
                    <AgentBarCharts agentDistr={agentDistr} />
                </Grid>
            ))}
        </Grid>
    );
};

export default AgentDashboard;
