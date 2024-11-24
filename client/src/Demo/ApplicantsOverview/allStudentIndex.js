import React, { Suspense } from 'react';
import { Await, Link as LinkDom, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function AllApplicantsOverview() {
  const { t } = useTranslation();
  const { students } = useLoaderData();

  TabTitle('All Applications Overview');

  return (
    <Box>
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
                  {t('All Students Applications Overview', { ns: 'common' })}
                </Typography>
              </Breadcrumbs>
              <ApplicationOverviewTabs students={loadedData} />
            </>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default AllApplicantsOverview;
