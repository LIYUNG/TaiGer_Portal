import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import { getAllStudents, updateArchivStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function StudentDatabase() {
  const { user } = useAuth();
  const [studentDatabaseState, setStudentDatabaseState] = useState({
    error: '',
    timeouterror: null,
    unauthorizederror: null,
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    res_status: 0
  });
  useEffect(() => {
    getAllStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentDatabaseState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setStudentDatabaseState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setStudentDatabaseState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentDatabaseState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setStudentDatabaseState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setStudentDatabaseState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const { res_status, isLoaded } = studentDatabaseState;

  if (!isLoaded && !studentDatabaseState.data) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  TabTitle('Student Database');
  if (studentDatabaseState.success) {
    return (
      <Box data-testid="student_datdabase">
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
            Students Database ({studentDatabaseState.students?.length})
          </Typography>
        </Breadcrumbs>
        <Box>
          <Card>
            <TabStudBackgroundDashboard
              user={user}
              students={studentDatabaseState.students}
              updateStudentArchivStatus={updateStudentArchivStatus}
              isArchivPage={studentDatabaseState.isArchivPage}
            />
          </Card>
        </Box>
      </Box>
    );
  }
}

export default StudentDatabase;
