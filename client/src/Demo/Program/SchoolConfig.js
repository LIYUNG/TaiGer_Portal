import React, { Suspense } from 'react';
import {
  Navigate,
  Link as LinkDom,
  useLoaderData,
  Await
} from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import { is_TaiGer_role } from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';
import SchoolConfigContent from './SchoolConfigContent';

function SchoolConfig() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { distinctSchools } = useLoaderData();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  TabTitle('Student Database');
  return (
    <Box data-testid="school_config">
      <Suspense fallback={<Loading />}>
        <Await resolve={distinctSchools}>
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
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.PROGRAMS}`}
                >
                  {t('Program List', { ns: 'common' })}
                </Link>
                <Typography color="text.primary">
                  {t('School Configuration', { ns: 'common' })}
                </Typography>
              </Breadcrumbs>
              <SchoolConfigContent data={loadedData} />
            </>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default SchoolConfig;
