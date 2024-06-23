import React from 'react';
import { Navigate, Link as LinkDom, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import StudentOverviewTable from '../../components/StudentOverviewTable';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import { useTranslation } from 'react-i18next';

function StudentOverviewPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    data: { data: students }
  } = useLoaderData();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Students Overview');

  return (
    <Box data-testid="student_overview">
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
          {t('All Active Student Overview', { ns: 'common' })} (
          {students?.length})
        </Typography>
      </Breadcrumbs>
      <StudentOverviewTable title="All" students={students} user={user} />
    </Box>
  );
}

export default StudentOverviewPage;
