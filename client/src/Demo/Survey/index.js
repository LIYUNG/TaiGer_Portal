import React from 'react';
import { Navigate, useLoaderData, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role, is_TaiGer_Student } from '@taiger-common/core';

import SurveyComponent from './SurveyComponent';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { SurveyProvider } from '../../components/SurveyProvider';
import { useTranslation } from 'react-i18next';
import { appConfig } from '../../config';

function Survey() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    data: { data, survey_link }
  } = useLoaderData();

  TabTitle('Academic Background Survey');

  if (is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  return (
    <Box data-testid="student_survey">
      {is_TaiGer_Student(user) && (
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
            {t('My Profile', { ns: 'common' })}
          </Typography>
        </Breadcrumbs>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 1 }}
      >
        <Typography variant="h6">
          {t('My Profile', { ns: 'common' })}
        </Typography>
        {/* Button on the right */}
        <Box></Box>
      </Box>
      <SurveyProvider
        value={{
          academic_background: data.academic_background,
          application_preference: data.application_preference,
          survey_link: survey_link,
          student_id: user._id.toString()
        }}
      >
        <SurveyComponent />
      </SurveyProvider>
    </Box>
  );
}

export default Survey;
