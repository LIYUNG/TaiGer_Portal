import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Card, Typography } from '@mui/material';

import ErrorPage from '../Utils/ErrorPage';
import { getStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { is_TaiGer_Student, is_TaiGer_role } from '../Utils/checking-functions';

function LearningResources() {
  const { user } = useAuth();
  const [learningResourcesState, setLearningResourcesState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    status: '', //reject, accept... etc
    res_status: 0
  });

  useEffect(() => {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setLearningResourcesState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setLearningResourcesState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setLearningResourcesState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  if (!is_TaiGer_role(user) && !is_TaiGer_Student(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Applications Overview');
  const { res_status, isLoaded } = learningResourcesState;

  if (!isLoaded && !learningResourcesState.students) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  return (
    <Box>
      <Card>
        <Typography>Resources A</Typography>
        <Typography>Comming soon!</Typography>
      </Card>
    </Box>
  );
}

export default LearningResources;
