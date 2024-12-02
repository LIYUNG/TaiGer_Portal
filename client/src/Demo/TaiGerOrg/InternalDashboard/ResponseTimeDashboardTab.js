import React, { useState, useEffect } from 'react';

import { Button, ButtonGroup, Box, Grid, Typography } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

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

const ResponseTimeBarChart = ({ chartData, onBarClick }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 110 }}
        onClick={onBarClick}
      >
        <XAxis
          dataKey="name"
          angle={-90}
          textAnchor="end"
          interval={0}
          tick={{ fontSize: 'small' }}
        />
        <YAxis>
          <Label
            value="Average duration (days)"
            angle={-90}
            position="insideEnd"
            dx={-15}
          />
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
      userId: user?._id,
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

const TeamOverview = ({
  studentAvgResponseTime,
  teamMembers,
  teamType,
  onBarClick
}) => {
  const teamStats = getTeamStats(studentAvgResponseTime, teamType);
  Object.keys(teamStats).forEach((userId) => {
    teamStats[userId]._id = userId;
    teamStats[userId].name = teamMembers?.[userId]?.firstname || userId;
  });

  const teamData = Object.values(teamStats).flat();
  const threadTypes =
    teamType === 'agents' ? agentThreadTypes : editorThreadTypes;

  return (
    <>
      {threadTypes.map((fileType) => {
        const chartData = responseTimeToChartData(teamData, fileType);
        if (!chartData || chartData?.length === 0) return null;
        return (
          <Grid item key={fileType} xs={12}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              {fileType}
            </Typography>
            <ResponseTimeBarChart
              chartData={chartData}
              onBarClick={onBarClick}
            />
          </Grid>
        );
      })}
    </>
  );
};

const MemberOverview = ({ studentAvgResponseTime, memberId, teamType }) => {
  const memberStats = studentAvgResponseTime?.filter(
    (student) => student?.[teamType]?.[0] === memberId
  );
  const threadTypes =
    teamType === 'agents' ? agentThreadTypes : editorThreadTypes;

  return (
    <>
      {threadTypes.map((fileType) => {
        const chartData = responseTimeToChartData(memberStats, fileType);
        if (!chartData || chartData?.length === 0) return null;
        return (
          <Grid item key={fileType} xs={12}>
            <Typography variant="h4" sx={{ mb: 3 }}>
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
  const [assignee, setAssignee] = useState(null);

  useEffect(() => {
    setAssignee(null);
  }, []);
  // const [student, setStudent] = useState(null);

  const onBarClick = (e) => {
    const index = e.activeTooltipIndex;
    const userId = e.activePayload?.[0]?.payload.userId;
    console.log(index, userId);
    setAssignee(userId);
  };

  const assigneeName = (viewMode === 'agents' ? agents : editors)?.[assignee]
    ?.firstname;
  console.log(assigneeName);

  return (
    <Grid container spacing={2}>
      {assignee && (
        <>
          <Grid item xs={12}>
            <Box sx={{ p: 2 }}>
              <Button onClick={() => setAssignee(null)} color="primary">
                <KeyboardReturnIcon sx={{ mr: 1 }} /> Return
              </Button>
              {(viewMode === 'agents' ? 'Agent' : 'Editor') +
                ' Overview - ' +
                assigneeName}
            </Box>
          </Grid>
          <MemberOverview
            studentAvgResponseTime={studentAvgResponseTime}
            memberId={assignee}
            teamType={viewMode}
          />
        </>
      )}
      {!assignee && (
        <>
          <Grid item xs={12}>
            <Box sx={{ p: 2 }}>
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
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
            </Box>
          </Grid>
          <TeamOverview
            studentAvgResponseTime={studentAvgResponseTime}
            teamMembers={viewMode === 'agents' ? agents : editors}
            teamType={viewMode}
            onBarClick={onBarClick}
          />
        </>
      )}
    </Grid>
  );
};

export default ResponseTimeDashboardTab;
