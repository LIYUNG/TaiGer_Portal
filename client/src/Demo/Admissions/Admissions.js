import React, { useEffect, useState } from 'react';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role } from '@taiger-common/core';

import AdmissionsTable from './AdmissionsTable';
import ErrorPage from '../Utils/ErrorPage';
import { getAdmissions } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';
import AdmissionsStat from './AdmissionsStat';

function Admissions() {
  const { user } = useAuth();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [admissionsState, setAdmissionsState] = useState({
    error: '',
    isLoaded: false,
    students: [],
    result: [],
    success: false,
    res_status: 0
  });

  useEffect(() => {
    getAdmissions().then(
      (resp) => {
        const { result, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAdmissionsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            result,
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
            {t('All Students', { ns: 'common' })}
          </Typography>
          <Typography color="text.primary">
            {t('tenant-admissions', {
              ns: 'common',
              tenant: appConfig.companyName
            })}
          </Typography>
        </Breadcrumbs>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs example"
          >
            <Tab
              label={`${t('Admissions', {
                ns: 'admissions'
              })}`}
              {...a11yProps(0)}
            />
            <Tab
              label={`${t('Statistics', { ns: 'admissions' })}`}
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AdmissionsTable students={admissionsState.students} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AdmissionsStat result={admissionsState.result} />
        </CustomTabPanel>
      </Box>
    );
  }
}

export default Admissions;
