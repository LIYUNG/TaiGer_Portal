import React, { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { TabTitle } from '../../Utils/TabTitle';

import ProgramRequirementsOverview from './ProgramRequirementsOverview';
import { Box } from '@mui/material';
import Loading from '../../../components/Loading/Loading';

function Dashboard() {
  const { programRequirements } = useLoaderData();

  TabTitle('Program Requirement Edit');

  return (
    <Box data-testid="dashoboard_component">
      <Suspense fallback={<Loading />}>
        <Await resolve={programRequirements}>
          {(loadedData) => <ProgramRequirementsOverview programRequirements={loadedData} />}
        </Await>
      </Suspense>
    </Box>
  );
}

export default Dashboard;
