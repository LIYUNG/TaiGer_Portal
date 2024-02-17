import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';

import ErrorPage from '../Utils/ErrorPage';
import { getAllCVMLRLOverview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function EssayDashboard() {
  const { user } = useAuth();
  const [essayDashboardState, setEssayDashboardState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    isFinalVersion: false,
    status: '', //reject, accept... etc
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getAllCVMLRLOverview().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setEssayDashboardState({
            ...essayDashboardState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          });
        } else {
          setEssayDashboardState({
            ...essayDashboardState,
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        setEssayDashboardState({
          ...essayDashboardState,
          isLoaded: true,
          error,
          res_status: 500
        });
      }
    );
  }, []);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const { res_status, isLoaded } = essayDashboardState;
  TabTitle('CV ML RL Center');
  if (!isLoaded && !essayDashboardState.students) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

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
        <Typography color="text.primary">Essay Dashboard</Typography>
      </Breadcrumbs>
      <Card>Coming soon</Card>
    </Box>
  );
}

export default EssayDashboard;
