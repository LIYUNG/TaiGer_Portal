import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Navigate, Link as LinkDom, useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { is_TaiGer_Student, is_TaiGer_role } from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';

function ApplicantsOverview() {
  const { user } = useAuth();
  const {
    data: { data: fetchedStudents }
  } = useLoaderData();

  const { t } = useTranslation();

  if (is_TaiGer_Student(user)) {
    return (
      <Navigate
        to={`${DEMO.STUDENT_APPLICATIONS_LINK}/${user._id.toString()}`}
      />
    );
  }
  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const myStudents = fetchedStudents.filter(
    (student) =>
      student.editors.some((editor) => editor._id === user._id.toString()) ||
      student.agents.some((agent) => agent._id === user._id.toString())
  );
  TabTitle('Applications Overview');

  return (
    <Box data-testid="application_overview_component">
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
          {is_TaiGer_role(user)
            ? `${t('My Students Application Overview')}`
            : `${user.firstname} ${user.lastname} Applications Overview`}
        </Typography>
      </Breadcrumbs>
      <ApplicationOverviewTabs students={myStudents} />
    </Box>
  );
}

export default ApplicantsOverview;
