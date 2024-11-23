import React, { Suspense } from 'react';
import {
  Navigate,
  Link as LinkDom,
  useLoaderData,
  Await
} from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import StudentOverviewTable from '../../components/StudentOverviewTable';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading/Loading';

function StudentOverviewPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { students } = useLoaderData();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(t('Students Overview', { ns: 'common' }));

  return (
    <Box data-testid="student_overview">
      <Suspense fallback={<Loading />}>
        <Await resolve={students}>
          {(loadedData) => (
            <>
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
                  {loadedData?.length})
                </Typography>
              </Breadcrumbs>
              <StudentOverviewTable
                title="All"
                students={loadedData}
                user={user}
              />
            </>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default StudentOverviewPage;
