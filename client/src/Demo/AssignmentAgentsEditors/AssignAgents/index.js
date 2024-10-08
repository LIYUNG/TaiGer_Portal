import React from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';

import AssignAgentsPage from './AssignAgentsPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import DEMO from '../../../store/constant';
import { is_TaiGer_role } from '../../Utils/checking-functions';
import { useAuth } from '../../../components/AuthProvider';
import useStudents from '../../../hooks/useStudents';

function AssignAgents() {
  const { user } = useAuth();
  const {
    data: { data: fetchedStudents }
  } = useLoaderData();

  const {
    students,
    res_modal_message,
    res_modal_status,
    submitUpdateAgentlist,
    ConfirmError
  } = useStudents({
    students: fetchedStudents
  });

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  return (
    <Box data-testid="assignment_agents">
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <AssignAgentsPage
        students={students}
        submitUpdateAgentlist={submitUpdateAgentlist}
      />
    </Box>
  );
}

export default AssignAgents;
