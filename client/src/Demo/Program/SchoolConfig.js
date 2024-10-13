import React, { Suspense } from 'react';
import {
  Navigate,
  Link as LinkDom,
  useLoaderData,
  Await
} from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';

import { is_TaiGer_role } from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function SchoolConfig() {
  const { user } = useAuth();

  const { distinctSchools } = useLoaderData();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  TabTitle('Student Database');
  return (
    <Box data-testid="student_datdabase">
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
                <Typography color="text.primary">Config</Typography>
              </Breadcrumbs>
              <Box>
                <Card>
                  {loadedData?.map((data, i) => (
                    <li key={i}>
                      {data.school}, {data.isPrivateSchool},{' '}
                      {data.isPartnerSchool}, {data.schoolType}, {data.tags?.join(', ')}
                    </li>
                  ))}
                </Card>
              </Box>
            </>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default SchoolConfig;
