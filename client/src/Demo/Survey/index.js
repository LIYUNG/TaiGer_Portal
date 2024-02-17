import React from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';

import SurveyComponent from './SurveyComponent';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { SurveyProvider } from '../../components/SurveyProvider';

function Survey() {
  const { user } = useAuth();
  const {
    data: { data, survey_link }
  } = useLoaderData();

  TabTitle('Academic Background Survey');

  if (is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  return (
    <Box data-testid="student_survey">
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
