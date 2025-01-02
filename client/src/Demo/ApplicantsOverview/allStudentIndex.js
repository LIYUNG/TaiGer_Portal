import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import i18next from 'i18next';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { getAllActiveStudentsQuery } from '../../api/query';

function AllApplicantsOverview() {
  const { data } = useQuery(getAllActiveStudentsQuery());

  TabTitle(i18next.t('All Applications Overview'));

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
          {i18next.t('All Students', { ns: 'common' })}
        </Typography>
        <Typography color="text.primary">
          {i18next.t('All Students Applications Overview', {
            ns: 'common'
          })}
        </Typography>
      </Breadcrumbs>
      <ApplicationOverviewTabs students={data.data} />
    </Box>
  );
}

export default AllApplicantsOverview;
