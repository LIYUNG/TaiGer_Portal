import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Link,
  Typography
} from '@mui/material';

import ApplicationOverviewTabs from '../ApplicantsOverview/ApplicationOverviewTabs';
import ErrorPage from '../Utils/ErrorPage';
import { getAgent } from '../../api';
import {
  frequencyDistribution,
  is_TaiGer_role,
  programs_refactor
} from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import TasksDistributionBarChart from '../../components/Charts/TasksDistributionBarChart';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

function AgentPage() {
  const { user_id } = useParams();
  const { user } = useAuth();
  const [agentPageState, setAgentPageState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    agent: null,
    res_status: 0
  });

  useEffect(() => {
    getAgent(user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAgentPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data.students,
            agent: data.agent,
            success: success,
            res_status: status
          }));
        } else {
          setAgentPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setAgentPageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [user_id]);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const { res_status, isLoaded } = agentPageState;

  if (!isLoaded && !agentPageState.students && !agentPageState.agent) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  TabTitle(
    `Agent: ${agentPageState.agent.firstname}, ${agentPageState.agent.lastname}`
  );

  const open_applications_arr = programs_refactor(agentPageState.students);
  const applications_distribution = open_applications_arr
    .filter(({ isFinalVersion }) => isFinalVersion !== true)
    .map(({ deadline, file_type, show }) => {
      return { deadline, file_type, show };
    });
  const open_distr = frequencyDistribution(applications_distribution);

  const sort_date = Object.keys(open_distr).sort();

  const sorted_date_freq_pair = [];
  sort_date.forEach((date) => {
    sorted_date_freq_pair.push({
      name: `${date}`,
      active: open_distr[date].show,
      potentials: open_distr[date].potentials
    });
  });

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.TEAM_MEMBERS_LINK}`}
        >
          {appConfig.companyName} Team
        </Link>
        <Typography color="text.primary">
          {agentPageState.agent.firstname} {agentPageState.agent.lastname}
          {` (${agentPageState.students.length})`}
        </Typography>
      </Breadcrumbs>
      <Card sx={{ p: 2 }}>
        <Typography variant="h5">
          {agentPageState.agent.firstname} {agentPageState.agent.lastname} Open
          Applications Distribution
        </Typography>
        <Typography>Applications distribute among the date.</Typography>
        <Typography>
          <b style={{ color: 'red' }}>active:</b> students decided programs.
          These will be shown in{' '}
          <LinkDom to={`${DEMO.STUDENT_APPLICATIONS_LINK}`}>
            Application Overview
          </LinkDom>
        </Typography>
        <Typography>
          <b style={{ color: '#A9A9A9' }}>potentials:</b> students do not decide
          programs yet. But the applications will be potentially activated when
          they would decide.
        </Typography>
        <TasksDistributionBarChart data={sorted_date_freq_pair} />
      </Card>
      <ApplicationOverviewTabs students={agentPageState.students} />
      <Link
        component={LinkDom}
        to={`${DEMO.TEAM_AGENT_ARCHIV_LINK(
          agentPageState.agent._id.toString()
        )}`}
      >
        <Button variant="contained" color="primary">
          See Archiv Student
        </Button>
      </Link>
    </Box>
  );
}

export default AgentPage;
