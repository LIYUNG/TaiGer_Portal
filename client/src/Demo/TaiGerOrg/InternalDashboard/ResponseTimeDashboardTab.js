import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
    Button,
    ButtonGroup,
    Box,
    Card,
    CardHeader,
    CardContent,
    Collapse,
    Divider,
    Grid,
    Link,
    Typography
} from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import {
    KeyboardReturn,
    KeyboardArrowUp,
    KeyboardArrowDown
} from '@mui/icons-material';

const { getResponseIntervalByStudent } = require('../../../api');

const editorThreadTypes = ['CV', 'ML', 'RL_A', 'RL_B', 'RL_C', 'Essay'];
const agentThreadTypes = ['communication', 'Supplementary_Form'];

const getIntervalAvg = (intervals) => {
    if (!intervals) return 0;
    const sumInterval = intervals?.reduce(
        (acc, item) => acc + item?.interval,
        0
    );
    const averageInterval = sumInterval / intervals?.length;
    return averageInterval;
};

const responseTimeToChartData = (responseTime, threadType) => {
    return responseTime
        ?.filter((user) => user?.avgByType?.[threadType])
        ?.map((user) => ({
            userId: user?._id,
            name: user?.name,
            interval: Number(user?.avgByType?.[threadType]?.toFixed(2))
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
        Object.entries(avgByType).map(([key, { sum, count }]) => [
            key,
            sum / count
        ])
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
            height={400}
            margin={{ top: 20, right: 30, left: 50, bottom: 110 }}
            onClick={onBarClick}
            onItemClick={(event, barItemIdentifier) => {
                onBarClick({
                    userId: chartData[barItemIdentifier.dataIndex]?.userId,
                    name: chartData[barItemIdentifier.dataIndex]?.name
                });
            }}
            series={[{ dataKey: 'interval' }]}
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
        />
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
                const averageInterval = getIntervalAvg(chartData);
                return (
                    <Card key={fileType} sx={{ mb: 2 }}>
                        <CardHeader
                            subheader={`Average response time: ${averageInterval.toFixed(
                                2
                            )} days`}
                            title={`${fileType} Response Times`}
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
            onBarClick={onBarClick}
            teamType={teamType}
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
            onBarClick={onBarClick}
            teamType={teamType}
        />
    );
};

const StudentProgramOverview = ({
    title,
    threadIntervals,
    collapse = false,
    ...props
}) => {
    const [isCollapsed, setIsCollapsed] = useState(collapse);

    const handleClick = (e) => {
        e.stopPropagation();
        setIsCollapsed((prevOpen) => !prevOpen);
    };

    return (
        <Card sx={{ mb: 2 }} {...props}>
            <CardHeader
                onClick={handleClick}
                subheader={`Average response time: ${getIntervalAvg(
                    threadIntervals?.flatMap((thread) => thread.intervals)
                ).toFixed(2)} days`}
                title={
                    <>
                        {isCollapsed ? (
                            <KeyboardArrowUp />
                        ) : (
                            <KeyboardArrowDown />
                        )}{' '}
                        {title}
                    </>
                }
            />
            <CardContent>
                <Collapse in={isCollapsed}>
                    {threadIntervals.length !== 0
                        ? threadIntervals.map((thread) => (
                              <React.Fragment key={thread.threadId}>
                                  {thread.intervalType ? (
                                      <Divider
                                          sx={{ mb: 10, px: 6 }}
                                          textAlign="left"
                                      >
                                          <Typography
                                              sx={{ px: 1 }}
                                              variant="h6"
                                          >
                                              {thread.intervalType}
                                          </Typography>
                                      </Divider>
                                  ) : null}
                                  <LineChart
                                      dataset={thread.intervals
                                          .map((item) => ({
                                              ...item,
                                              intervalStartAt: new Date(
                                                  item.intervalStartAt
                                              )
                                          }))
                                          .sort(
                                              (a, b) =>
                                                  a.intervalStartAt -
                                                  b.intervalStartAt
                                          )}
                                      height={400}
                                      margin={{
                                          top: 20,
                                          right: 30,
                                          left: 50,
                                          bottom: 110
                                      }}
                                      series={[{ dataKey: 'interval' }]}
                                      xAxis={[
                                          {
                                              // label: thread.intervalType,
                                              dataKey: 'intervalStartAt',
                                              scaleType: 'time'
                                          }
                                      ]}
                                      yAxis={[{ label: 'Duration (days)' }]}
                                  />
                              </React.Fragment>
                          ))
                        : null}
                </Collapse>
            </CardContent>
        </Card>
    );
};

const StudentOverview = ({ studentId }) => {
    const [studentIntervals, setStudentIntervals] = useState('error');
    useEffect(() => {
        if (!studentId) return;
        getResponseIntervalByStudent(studentId).then((res) => {
            if (res?.status === 200) {
                const { data } = res.data;
                setStudentIntervals(data);
            } else {
                setStudentIntervals('error');
            }
        });
    }, [studentId]);

    return (
        <>
            {studentIntervals !== 'error' &&
            !studentIntervals?.communicationThreadIntervals &&
            studentIntervals?.applications?.length == 0 ? (
                <Typography sx={{ p: 2 }} variant="h5">
                    No data available.
                </Typography>
            ) : null}
            {studentIntervals !== 'error' &&
            studentIntervals?.communicationThreadIntervals?.length > 0 ? (
                <StudentProgramOverview
                    collapse={true}
                    key="communication"
                    threadIntervals={[
                        {
                            intervals:
                                studentIntervals?.communicationThreadIntervals
                        }
                    ]}
                    title="Communication Thread"
                />
            ) : null}
            {studentIntervals !== 'error' &&
            studentIntervals?.applications?.length > 0
                ? studentIntervals.applications.map((application) => (
                      <StudentProgramOverview
                          key={application._id}
                          threadIntervals={application?.threadIntervals}
                          title={`${application.school} - ${application.program_name} (${application.threadIntervals.length})`}
                      />
                  ))
                : null}
        </>
    );
};

const ResponseTimeDashboardTab = ({
    studentAvgResponseTime,
    agents,
    editors
}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const paramViewMode = searchParams.get('mode');
    const paramMemberId = searchParams.get('member');
    const paramStudentId = searchParams.get('student');

    const teams = { agents: agents, editors: editors };
    const modes = ['agents', 'editors'];
    const [viewMode, setViewMode] = useState(
        modes.includes(paramViewMode) ? paramViewMode : 'agents'
    );
    const teamTypeLabel = viewMode === 'agents' ? 'Agent' : 'Editor';

    const [member, setMember] = useState(
        paramMemberId
            ? {
                  userId: paramMemberId,
                  name: teams?.[viewMode]?.[paramMemberId]?.firstname
              }
            : null
    );
    const [student, setStudent] = useState(
        paramStudentId
            ? {
                  userId: paramStudentId,
                  name: studentAvgResponseTime?.find(
                      (student) => student._id === paramStudentId
                  )?.name
              }
            : null
    );

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);

        if (viewMode) {
            newParams.set('mode', viewMode);
        } else {
            newParams.delete('mode');
        }
        if (student) {
            newParams.set('student', student?.userId);
        } else {
            newParams.delete('student');
        }
        if (member) {
            newParams.set('member', member?.userId);
        } else {
            newParams.delete('member');
        }

        const currentHash = window.location.hash;
        setSearchParams(newParams);
        window.location.hash = currentHash;

        // Clear URL parameters when component unmounts or when switching tabs
        return () => {
            const currentHash = window.location.hash;
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('mode');
            newParams.delete('student');
            newParams.delete('member');
            setSearchParams(newParams);
            window.location.hash = currentHash;
        };
    }, [viewMode, student, member]);

    const onBarClickLayer1 = ({ userId, name }) => {
        const user = { userId, name };
        if (!teams?.[viewMode]?.[userId]) {
            return;
        }
        setMember(user);
    };
    const onBarClickLayer2 = ({ userId, name }) => {
        if (!userId) return;
        const user = { userId, name };
        setStudent(user);
    };

    return (
        <Grid container spacing={2}>
            {!member && !student ? (
                <>
                    <Grid item xs={12}>
                        <Box sx={{ p: 2 }}>
                            <ButtonGroup
                                aria-label="outlined primary button group"
                                variant="contained"
                            >
                                <Button
                                    onClick={() => setViewMode('agents')}
                                    variant={
                                        viewMode === 'agents'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                >
                                    Agent View
                                </Button>
                                <Button
                                    onClick={() => setViewMode('editors')}
                                    variant={
                                        viewMode === 'editors'
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                >
                                    Editor View
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <TeamOverview
                            onBarClick={onBarClickLayer1}
                            studentAvgResponseTime={studentAvgResponseTime}
                            teamMembers={teams?.[viewMode]}
                            teamType={viewMode}
                        />
                    </Grid>
                </>
            ) : null}
            {member && !student ? (
                <>
                    <Grid item xs={12}>
                        <Box sx={{ p: 2 }}>
                            <Button
                                color="primary"
                                onClick={() => setMember(null)}
                                sx={{ mr: 1 }}
                            >
                                <KeyboardReturn sx={{ mr: 1 }} /> Return
                            </Button>
                            <Typography
                                component="span"
                                variant="h5"
                            >{`${teamTypeLabel} Overview - ${member?.name}`}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <MemberOverview
                            memberId={member?.userId}
                            onBarClick={onBarClickLayer2}
                            studentAvgResponseTime={studentAvgResponseTime}
                            teamType={viewMode}
                        />
                    </Grid>
                </>
            ) : null}
            {student ? (
                <Grid item xs={12}>
                    <Box sx={{ p: 2 }}>
                        <Button
                            color="primary"
                            onClick={() => setStudent(null)}
                            sx={{ mr: 1 }}
                        >
                            <KeyboardReturn sx={{ mr: 1 }} /> Return
                        </Button>
                        <Typography component="span" variant="h5">
                            {`Student Overview - `}
                            <Link
                                href={`/communications/t/${student?.userId?.toString()}`}
                                target="_blank"
                                underline="hover"
                            >
                                {student?.name}
                            </Link>
                        </Typography>
                    </Box>
                    <Grid item xs={12}>
                        <StudentOverview studentId={student?.userId} />
                    </Grid>
                </Grid>
            ) : null}
        </Grid>
    );
};

export default ResponseTimeDashboardTab;
