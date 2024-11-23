import React, { Suspense } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import {
  Navigate,
  Link as LinkDom,
  useParams,
  useLoaderData,
  Await
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'react-datasheet-grid/dist/style.css';
import { is_TaiGer_role } from '@taiger-common/core';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import CourseWidgetBody from './CourseWidgetBody';

export default function CourseWidget() {
  const { user } = useAuth();
  const { student_id } = useParams();
  const { t } = useTranslation();
  const { programRequirements } = useLoaderData();

  if (!student_id) {
    if (!is_TaiGer_role(user)) {
      return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
  }

  TabTitle(`Course Analyser`);

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
          {t('Pre-Customer Course Analyser', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Suspense fallback={<Loading />}>
        <Await resolve={programRequirements}>
          {(loadedData) => (
            <CourseWidgetBody programRequirements={loadedData} />
          )}
        </Await>
      </Suspense>
    </Box>
  );
}
