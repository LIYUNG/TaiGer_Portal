import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role } from '@taiger-common/core';

import AdmissionsTable from './AdmissionsTable';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';
import AdmissionsStat from './AdmissionsStat';
import { getAdmissionsQuery } from '../../api/query';

function Admissions() {
  const { user } = useAuth();
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useQuery(getAdmissionsQuery());
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const result = data?.result;
  const admissions = data?.data || [];

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(`${appConfig.companyName} Admissions`);

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
      {isLoading && <Loading />}
      {isError && <>{error}</>}
      {!isLoading && !isError && (
        <>
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
            <AdmissionsTable admissions={admissions} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AdmissionsStat result={result} />
          </CustomTabPanel>
        </>
      )}
    </Box>
  );
}

export default Admissions;
