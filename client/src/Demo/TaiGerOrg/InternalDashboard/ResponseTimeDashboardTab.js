import React, { useState } from 'react';

import { Button, ButtonGroup, Grid, Typography } from '@mui/material';

import {
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Label
} from 'recharts';

const editorThreadTypes = ['CV', 'ML', 'RL_A', 'RL_B', 'RL_C', 'Essay'];
const agentThreadTypes = ['communication', 'Supplementary_Form'];

const ResponseTimeBarChart = ({ chartData }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 110 }}
      >
        <XAxis
          dataKey="name"
          angle={-90}
          textAnchor="end"
          interval={0}
          padding="no-gap"
          tick={{ fontSize: 'small' }}
        />
        <YAxis>
          <Label value="Duration (days)" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip labelStyle={{ color: 'black' }} />
        <Bar dataKey="duration" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const responseTimeToChartData = (responseTime, threadType) => {
  return responseTime
    ?.filter((student) => student?.avgByType?.[threadType])
    ?.map((student) => ({
      name: student?.name,
      duration: student?.avgByType?.[threadType]
    }));
};

const ResponseTimeDashboardTab = ({ studentAvgResponseTime }) => {
  const [viewMode, setViewMode] = useState('agent');
  const threadTypes =
    viewMode === 'agent' ? agentThreadTypes : editorThreadTypes;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          style={{ marginBottom: '20px' }}
        >
          <Button
            onClick={() => setViewMode('agent')}
            variant={viewMode === 'agent' ? 'contained' : 'outlined'}
          >
            Agent View
          </Button>
          <Button
            onClick={() => setViewMode('editor')}
            variant={viewMode === 'editor' ? 'contained' : 'outlined'}
          >
            Editor View
          </Button>
        </ButtonGroup>
      </Grid>
      {threadTypes.map((fileType) => {
        const chartData = responseTimeToChartData(
          studentAvgResponseTime,
          fileType
        );
        if (!chartData || chartData?.length === 0) return null;
        return (
          <Grid item key={fileType} xs={12}>
            <Typography>{fileType}</Typography>
            <ResponseTimeBarChart chartData={chartData} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ResponseTimeDashboardTab;
