import React, { Suspense } from 'react';
import { Await, useLoaderData, Link as LinkDom } from 'react-router-dom';
import { TabTitle } from '../../Utils/TabTitle';

import CourseKeywordsOverview from './CourseKeywordsOverview';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import Loading from '../../../components/Loading/Loading';
import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';

function CourseKeywords() {
  const { courseKeywordSets } = useLoaderData();

  TabTitle('Course Keywords Edit');

  return (
    <Box data-testid="course-keywords-component">
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
          Program List
        </Link>
        <Typography color="text.primary">Keywords</Typography>
      </Breadcrumbs>
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

export default CourseKeywords;
