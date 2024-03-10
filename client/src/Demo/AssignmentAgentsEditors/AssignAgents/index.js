import React, { useState } from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';

import AssignAgentsPage from './AssignAgentsPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { updateAgents } from '../../../api';
import DEMO from '../../../store/constant';
import { is_TaiGer_role } from '../../Utils/checking-functions';
import { useAuth } from '../../../components/AuthProvider';

function AssignAgents() {
  const { user } = useAuth();
  const {
    data: { data: students }
  } = useLoaderData();

  const [assignAgentsState, setAssignAgentsState] = useState({
    error: '',
    isLoaded: false,
    students: students,
    updateAgentList: {},
    success: false,
    res_modal_message: '',
    res_modal_status: 0
  });

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    UpdateAgentlist(e, updateAgentList, student_id);
  };

  const UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...assignAgentsState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setAssignAgentsState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setAssignAgentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setAssignAgentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const ConfirmError = () => {
    setAssignAgentsState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const { res_modal_status, res_modal_message } = assignAgentsState;

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
        UpdateAgentlist={UpdateAgentlist}
        students={assignAgentsState.students}
        submitUpdateAgentlist={submitUpdateAgentlist}
      />
    </Box>
  );
}

export default AssignAgents;
