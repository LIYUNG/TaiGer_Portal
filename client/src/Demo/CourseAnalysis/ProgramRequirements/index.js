import React, { Suspense } from 'react';
import { Await, useLoaderData, Link as LinkDom } from 'react-router-dom';
import { TabTitle } from '../../Utils/TabTitle';

import ProgramRequirementsOverview from './ProgramRequirementsOverview';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import Loading from '../../../components/Loading/Loading';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';
import { useTranslation } from 'react-i18next';

function ProgramRequirements() {
  const { t } = useTranslation();
  const { programRequirements } = useLoaderData();

  TabTitle('Program Requirement Edit');

  return (
    <Box data-testid="dashoboard_component">
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
          {t('Program Requirements', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Suspense fallback={<Loading />}>
        <Await resolve={programRequirements}>
          {(loadedData) => (
            <ProgramRequirementsOverview programRequirements={loadedData} />
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default ProgramRequirements;
