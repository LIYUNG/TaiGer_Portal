import React from 'react';
import { Link as LinkDom, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import useStudents from '../../hooks/useStudents';

function AllApplicantsOverview() {
  const { t } = useTranslation();
  const {
    data: { data: fetchedStudents }
  } = useLoaderData();

  const {
    students,
    submitUpdateAgentlist,
    submitUpdateEditorlist,
    submitUpdateAttributeslist,
    updateStudentArchivStatus
  } = useStudents({
    students: fetchedStudents
  });

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
      <ApplicationOverviewTabs
        students={students}
        updateStudentArchivStatus={updateStudentArchivStatus}
        submitUpdateAgentlist={submitUpdateAgentlist}
        submitUpdateEditorlist={submitUpdateEditorlist}
        submitUpdateAttributeslist={submitUpdateAttributeslist}
      />
    </Box>
  );
}

export default AllApplicantsOverview;
