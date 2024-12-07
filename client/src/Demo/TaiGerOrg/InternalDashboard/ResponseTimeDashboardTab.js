import React, { useState, useEffect } from 'react';

import {
  Button,
  ButtonGroup,
  Box,
  Card,
  CardHeader,
  CardContent,
  Grid
} from '@mui/material';
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

const responseTimeToChartData = (responseTime, threadType) => {
  return responseTime
    ?.filter((user) => user?.avgByType?.[threadType])
    ?.map((user) => ({
      userId: user?._id,
      name: user?.name,
      duration: Number(user?.avgByType?.[threadType]?.toFixed(2))
    }));
};

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
            dx={-20}
          />
        </YAxis>
        <Tooltip labelStyle={{ color: 'black' }} />
        <Bar dataKey="duration" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ChartOverview = ({ data, teamType, onBarClick }) => {
  const threadTypes =
    teamType === 'agents' ? agentThreadTypes : editorThreadTypes;

  return (
    <>
      {threadTypes.map((fileType) => {
        const chartData = responseTimeToChartData(data, fileType);
        if (!chartData || chartData?.length === 0) return null;
        const totalDuration = chartData.reduce(
          (sum, item) => sum + item.duration,
          0
        );
        const averageDuration = totalDuration / chartData.length;
        return (
          <Grid item key={fileType} xs={12}>
            <Card>
              <CardHeader
                title={`${fileType} Response Times`}
                subheader={`Average response time: ${averageDuration.toFixed(
                  2
                )} days`}
              />
              <CardContent>
                <ResponseTimeBarChart
                  chartData={chartData}
                  onBarClick={onBarClick}
                />
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </>
  );
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

  return (
    <ChartOverview
      data={teamData}
      teamType={teamType}
      onBarClick={onBarClick}
    />
  );
};

const MemberOverview = ({ studentAvgResponseTime, memberId, teamType }) => {
  const memberStats = studentAvgResponseTime?.filter(
    (student) => student?.[teamType]?.[0] === memberId
  );
  return <ChartOverview data={memberStats} teamType={teamType} />;
};

const ResponseTimeDashboardTab = ({
  studentAvgResponseTime,
  agents,
  editors
}) => {
  const [viewMode, setViewMode] = useState('agents');
  const [member, setMember] = useState(null);

  const teams = { agents: agents, editors: editors };
  const teamTypeLabel = viewMode === 'agents' ? 'Agent' : 'Editor';

  useEffect(() => {
    setMember(null);
  }, [viewMode]);
  // const [student, setStudent] = useState(null);

  const onBarClick = (e) => {
    // const index = e.activeTooltipIndex;
    const userId = e.activePayload?.[0]?.payload.userId;
    setMember(userId);
  };

  const memberName = teams?.[viewMode]?.[member]?.firstname;

  return (
    <Grid container spacing={2}>
      {member && (
        <>
          <Grid item xs={12}>
            <Box sx={{ p: 2 }}>
              <Button
                sx={{ mr: 1 }}
                onClick={() => setMember(null)}
                color="primary"
              >
                <KeyboardReturnIcon sx={{ mr: 1 }} /> Return
              </Button>
              {`${teamTypeLabel} Overview - ${memberName}`}
            </Box>
          </Grid>
          <MemberOverview
            studentAvgResponseTime={studentAvgResponseTime}
            memberId={member}
            teamType={viewMode}
          />
        </>
      )}
      {!member && (
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
            teamMembers={teams?.[viewMode]}
            teamType={viewMode}
            onBarClick={onBarClick}
          />
        </>
      )}
    </Grid>
  );
};

export default ResponseTimeDashboardTab;
