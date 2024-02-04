import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import ErrorPage from '../Utils/ErrorPage';
import { getAllActiveStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import StudentOverviewTable from '../../components/StudentOverviewTable';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function StudentOverviewPage() {
  const { user } = useAuth();
  const [StudentOverviewPageState, setStudentOverviewPageState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });
  useEffect(() => {
    getAllActiveStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentOverviewPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setStudentOverviewPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setStudentOverviewPageState((prevState) => ({
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
  const { res_status, isLoaded } = StudentOverviewPageState;
  TabTitle('Students Overview');
  if (!isLoaded && !StudentOverviewPageState.students) {
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
        <Typography color="text.primary">
          All Active Student Overview (
          {StudentOverviewPageState.students?.length})
        </Typography>
      </Breadcrumbs>
      <StudentOverviewTable
        title="All"
        students={StudentOverviewPageState.students}
        user={user}
      />
    </Box>
  );
}

export default StudentOverviewPage;
