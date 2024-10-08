import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';

import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { getTeamMembers } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

function Accounting() {
  const { user } = useAuth();
  const [accountingState, setAccountingState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    teams: null,
    res_status: 0
  });

  useEffect(() => {
    getTeamMembers().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAccountingState((prevState) => ({
            ...prevState,
            isLoaded: true,
            teams: data,
            success: success,
            res_status: status
          }));
        } else {
          setAccountingState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setAccountingState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(`${appConfig.companyName} Accounting`);
  const { res_status, isLoaded } = accountingState;

  if (!isLoaded && !accountingState.teams) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const agents = accountingState.teams.filter(
    (member) => member.role === 'Agent'
  );
  const editors = accountingState.teams.filter(
    (member) => member.role === 'Editor'
  );

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
        <Typography color="text.primary">Accounting</Typography>
      </Breadcrumbs>
      <Card>
        <Typography variant="h5">Agent:</Typography>
        {agents.map((agent, i) => (
          <Typography fontWeight="bold" key={i}>
            <LinkDom
              to={`${DEMO.ACCOUNTING_USER_ID_LINK(agent._id.toString())}`}
            >
              {agent.firstname} {agent.lastname}{' '}
            </LinkDom>
          </Typography>
        ))}
        <Typography variant="h5">Editor:</Typography>
        {editors.map((editor, i) => (
          <Typography fontWeight="bold" key={i}>
            <Link to={`${DEMO.ACCOUNTING_USER_ID_LINK(editor._id.toString())}`}>
              {editor.firstname} {editor.lastname}{' '}
            </Link>
          </Typography>
        ))}
      </Card>
    </Box>
  );
}

export default Accounting;
