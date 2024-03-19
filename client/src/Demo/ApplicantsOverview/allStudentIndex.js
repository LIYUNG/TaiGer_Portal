import React from 'react';
import { Link as LinkDom, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';

function AllApplicantsOverview() {
  const { t } = useTranslation();
  const {
    data: { data: students }
  } = useLoaderData();

  TabTitle('Applications Overview');

  return (
    <Box>
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
          {t('All Students Applications Overview')}
        </Typography>
      </Breadcrumbs>
      <ApplicationOverviewTabs students={students} />
    </Box>
  );
}

export default AllApplicantsOverview;
