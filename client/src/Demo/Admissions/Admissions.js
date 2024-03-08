import React, { useEffect, useState } from 'react';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import AdmissionsTable from './AdmissionsTable';
import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { getAdmissions } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

function Admissions() {
  const { user } = useAuth();
  const [admissionsState, setAdmissionsState] = useState({
    error: '',
    isLoaded: false,
    students: [],
    success: false,
    res_status: 0
  });

  useEffect(() => {
    getAdmissions().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAdmissionsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setAdmissionsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setAdmissionsState((prevState) => ({
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
  TabTitle(`${appConfig.companyName} Admissions`);
  const { res_status, isLoaded } = admissionsState;

  if (!isLoaded && !admissionsState.data) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  if (admissionsState.success) {
    return (
      <Box data-testid="admissinos_page">
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
            {appConfig.companyName} Admissions
          </Typography>
        </Breadcrumbs>
        <AdmissionsTable students={admissionsState.students} />
      </Box>
    );
  }
}

export default Admissions;
