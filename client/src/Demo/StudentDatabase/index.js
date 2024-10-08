import React from 'react';
import { Navigate, Link as LinkDom, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import useStudents from '../../hooks/useStudents';
import ModalMain from '../Utils/ModalHandler/ModalMain';

function StudentDatabase() {
  const { user } = useAuth();
  const {
    data: { data: fetchedAllStudents }
  } = useLoaderData();
  const {
    res_modal_status,
    res_modal_message,
    ConfirmError,
    students,
    submitUpdateAgentlist,
    submitUpdateEditorlist,
    submitUpdateAttributeslist,
    updateStudentArchivStatus
  } = useStudents({
    students: fetchedAllStudents
  });

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  TabTitle('Student Database');
  return (
    <Box data-testid="student_datdabase">
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
          Students Database ({students?.length})
        </Typography>
      </Breadcrumbs>
      <Box>
        <Card>
          <TabStudBackgroundDashboard
            students={students}
            submitUpdateAgentlist={submitUpdateAgentlist}
            submitUpdateEditorlist={submitUpdateEditorlist}
            submitUpdateAttributeslist={submitUpdateAttributeslist}
            updateStudentArchivStatus={updateStudentArchivStatus}
          />
        </Card>
      </Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
    </Box>
  );
}

export default StudentDatabase;
