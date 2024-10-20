import React, { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { TabTitle } from '../../Utils/TabTitle';

import CourseKeywordsOverview from './CourseKeywordsOverview';
import { Box } from '@mui/material';
import Loading from '../../../components/Loading/Loading';

function Dashboard() {
  const { courseKeywordSets } = useLoaderData();

  TabTitle('Course Keywords Edit');

  return (
    <Box data-testid="dashoboard_component">
      <Suspense fallback={<Loading />}>
        <Await resolve={courseKeywordSets}>
          {(loadedData) => (
            <CourseKeywordsOverview courseKeywordSets={loadedData} />
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default Dashboard;
