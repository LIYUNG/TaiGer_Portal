import React from 'react';
import { Link as LinkDom, useLoaderData } from 'react-router-dom';

import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { Navigate } from 'react-router-dom';
import DEMO from '../../store/constant';
import StudentOverviewTable from '../../components/StudentOverviewTable';
import { useAuth } from '../../components/AuthProvider';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { appConfig } from '../../config';
import { useTranslation } from 'react-i18next';

function MyStudentsOverview() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    data: { data: students }
  } = useLoaderData();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  TabTitle('My Students Overview');

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
          {t('My Active Student Overview')} (
          {
            students?.filter(
              (student) =>
                student.editors.some(
                  (editor) => editor._id === user._id.toString()
                ) ||
                student.agents.some(
                  (agent) => agent._id === user._id.toString()
                )
            ).length
          }
          )
        </Typography>
      </Breadcrumbs>
      <StudentOverviewTable
        title="All"
        students={students?.filter(
          (student) =>
            student.editors.some(
              (editor) => editor._id === user._id.toString()
            ) ||
            student.agents.some((agent) => agent._id === user._id.toString())
        )}
        user={user}
      />
    </Box>
  );
}

export default MyStudentsOverview;
