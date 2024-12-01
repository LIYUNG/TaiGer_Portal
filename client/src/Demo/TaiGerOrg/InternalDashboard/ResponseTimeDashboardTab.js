import React, { useState } from 'react';

import { Button, ButtonGroup, Card, Grid, Typography } from '@mui/material';

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
    ?.filter((user) => user?.avgByType?.[threadType])
    ?.map((user) => ({
      name: user?.name,
      duration: user?.avgByType?.[threadType]
    }));
};

const calculateAveragesByType = (data) => {
  const avgByType = data.reduce((acc, item) => {
    for (const [key, value] of Object.entries(item.avgByType)) {
      if (!acc[key]) {
        acc[key] = { sum: 0, count: 0 };
      }
      acc[key].sum += value;
      acc[key].count += 1;
    }
    return acc;
  }, {});

  return Object.fromEntries(
    Object.entries(avgByType).map(([key, { sum, count }]) => [key, sum / count])
  );
};

const getTeamStats = (studentAvgResponseTime, teamType) => {
  const groupStats = studentAvgResponseTime.reduce((acc, student) => {
    const userId = student?.[teamType]?.[0];
    if (!userId) return acc;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(student);
    return acc;
  }, {});

  const averages = Object.fromEntries(
    Object.entries(groupStats).map(([key, array]) => [
      key,
      { avgByType: calculateAveragesByType(array) }
    ])
  );

  return averages;
};

const TeamOverview = ({ studentAvgResponseTime, teamMembers, teamType }) => {
  const teamStats = getTeamStats(studentAvgResponseTime, teamType);
  Object.keys(teamStats).forEach((userId) => {
    teamStats[userId].name = teamMembers?.[userId]?.firstname || userId;
  });

  const teamData = Object.values(teamStats).flat();
  const threadTypes =
    teamType === 'agents' ? agentThreadTypes : editorThreadTypes;

  return (
    <>
      {threadTypes.map((fileType) => {
        const chartData = responseTimeToChartData(teamData, fileType);
        console.log('chartData', chartData);
        if (!chartData || chartData?.length === 0) return null;
        return (
          <Grid item key={fileType} xs={12}>
            <Typography variant="h4" sx={{ m: 3 }}>
              {fileType}
            </Typography>
            <ResponseTimeBarChart chartData={chartData} />
          </Grid>
        );
      })}
    </>
  );
};

const ResponseTimeDashboardTab = ({
  studentAvgResponseTime,
  agents,
  editors
}) => {
  const [viewMode, setViewMode] = useState('agents');
  // const threadTypes =
  //   viewMode === 'agents' ? agentThreadTypes : editorThreadTypes;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            style={{ marginBottom: '20px' }}
          >
            <Button
              onClick={() => setViewMode('agents')}
              variant={viewMode === 'agents' ? 'contained' : 'outlined'}
            >
              Agent View
            </Button>
            <Button
              onClick={() => setViewMode('editors')}
              variant={viewMode === 'editors' ? 'contained' : 'outlined'}
            >
              Editor View
            </Button>
          </ButtonGroup>
        </Card>
      </Grid>
      <TeamOverview
        studentAvgResponseTime={studentAvgResponseTime}
        teamMembers={viewMode === 'agents' ? agents : editors}
        teamType={viewMode}
      />
      {/* {threadTypes.map((fileType) => {
        const chartData = responseTimeToChartData(
          studentAvgResponseTime,
          fileType
        );
        if (!chartData || chartData?.length === 0) return null;
        return (
          <Grid item key={fileType} xs={12}>
            <Typography variant="h4" sx={{ m: 3 }}>
              {fileType}
            </Typography>
            <ResponseTimeBarChart chartData={chartData} />
          </Grid>
        );
      })} */}
    </Grid>
  );
};

export default ResponseTimeDashboardTab;
