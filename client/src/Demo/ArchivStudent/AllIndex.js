import React from 'react';
import { Navigate } from 'react-router-dom';
import { Link as LinkDom, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import useStudents from '../../hooks/useStudents';

function AllArchivStudents() {
  const { user } = useAuth();
  const {
    data: { data: initStudents }
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
    students: initStudents
  });

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('All 2Archiv Students');

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
          All Archived Students {` (${students.length})`}
        </Typography>
      </Breadcrumbs>
      <Box sx={{ mt: 2 }}>
        <TabStudBackgroundDashboard
          students={students?.filter((student) => student.archiv)}
          submitUpdateAgentlist={submitUpdateAgentlist}
          submitUpdateEditorlist={submitUpdateEditorlist}
          submitUpdateAttributeslist={submitUpdateAttributeslist}
          updateStudentArchivStatus={updateStudentArchivStatus}
        />
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

export default AllArchivStudents;
