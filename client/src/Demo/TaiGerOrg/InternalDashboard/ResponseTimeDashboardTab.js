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
import { BarChart, LineChart } from '@mui/x-charts';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const { getResponseIntervalByStudent } = require('../../../api');

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

const ResponseTimeBarChart = ({ chartData, onBarClick }) => {
  return (
    <BarChart
      dataset={chartData}
      series={[{ dataKey: 'duration' }]}
      xAxis={[
        {
          dataKey: 'name',
          scaleType: 'band',
          tickLabelStyle: {
            angle: -90,
            textAnchor: 'end'
          }
        }
      ]}
      yAxis={[{ label: 'Average duration (days)' }]}
      height={400}
      margin={{ top: 20, right: 30, left: 50, bottom: 110 }}
      onClick={onBarClick}
      onItemClick={(event, barItemIdentifier) =>
        onBarClick(chartData[barItemIdentifier.dataIndex]?.userId)
      }
    ></BarChart>
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
          <Card key={fileType}>
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
        );
      })}
    </>
  );
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

const MemberOverview = ({
  studentAvgResponseTime,
  memberId,
  teamType,
  onBarClick
}) => {
  const memberStats = studentAvgResponseTime?.filter(
    (student) => student?.[teamType]?.[0] === memberId
  );
  return (
    <ChartOverview
      data={memberStats}
      teamType={teamType}
      onBarClick={onBarClick}
    />
  );
};

const StudentOverview = ({ studentId }) => {
  const [studentIntervals, setStudentIntervals] = useState('error');
  useEffect(() => {
    if (!studentId) return;
    getResponseIntervalByStudent(studentId).then((res) => {
      if (res?.status === 200) {
        const { data } = res.data;
        const convertedDate = data
          ?.map((item) => ({
            ...item,
            intervalStartAt: new Date(item.intervalStartAt)
          }))
          ?.sort((a, b) => a.intervalStartAt - b.intervalStartAt);

        setStudentIntervals(convertedDate);
      } else {
        setStudentIntervals('error');
      }
    });
  }, [studentId]);

  // const sumDuration = studentIntervals?.y?.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue,
  //   0
  // );
  // const averageDuration = sumDuration / studentIntervals?.y?.length;
  const averageDuration = 0.015555;

  return (
    <>
      {studentIntervals != 'error' && (
        <>
          <Card>
            <CardHeader
              title={`${studentId} Response Times`}
              subheader={`Average response time: ${averageDuration.toFixed(
                2
              )} days`}
            />
            <CardContent>
              <LineChart
                dataset={studentIntervals}
                series={[{ dataKey: 'interval' }]}
                xAxis={[
                  {
                    dataKey: 'intervalStartAt',
                    scaleType: 'time'
                  }
                ]}
                yAxis={[{ label: 'Duration (days)' }]}
                height={400}
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

const ResponseTimeDashboardTab = ({
  studentAvgResponseTime,
  agents,
  editors
}) => {
  const [viewMode, setViewMode] = useState('agents');
  const [member, setMember] = useState(null);
  const [student, setStudent] = useState(null);

  const teams = { agents: agents, editors: editors };
  const teamTypeLabel = viewMode === 'agents' ? 'Agent' : 'Editor';

  useEffect(() => {
    setMember(null);
    setStudent(null);
  }, [viewMode]);

  const onBarClickLayer1 = (userId) => {
    if (!teams?.[viewMode]?.[userId]) {
      return;
    }
    setMember(userId);
  };
  const onBarClickLayer2 = (userId) => {
    setStudent(userId);
  };

  const memberName = teams?.[viewMode]?.[member]?.firstname;

  return (
    <Grid container spacing={2}>
      {!member && !student && (
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
          <Grid item xs={12}>
            <TeamOverview
              studentAvgResponseTime={studentAvgResponseTime}
              teamMembers={teams?.[viewMode]}
              teamType={viewMode}
              onBarClick={onBarClickLayer1}
            />
          </Grid>
        </>
      )}
      {member && !student && (
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
          <Grid item xs={12}>
            <MemberOverview
              studentAvgResponseTime={studentAvgResponseTime}
              memberId={member}
              teamType={viewMode}
              onBarClick={onBarClickLayer2}
            />
          </Grid>
        </>
      )}
      {student && (
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}>
            <Button
              sx={{ mr: 1 }}
              onClick={() => setStudent(null)}
              color="primary"
            >
              <KeyboardReturnIcon sx={{ mr: 1 }} /> Return
            </Button>
            {`Student Overview - ${memberName}`}
          </Box>
          <Grid item xs={12}>
            <StudentOverview studentId={student} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default ResponseTimeDashboardTab;
