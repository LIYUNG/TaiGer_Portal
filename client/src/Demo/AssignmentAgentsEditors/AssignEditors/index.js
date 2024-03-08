import React, { useState } from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';

import AssignEditorsPage from './AssignEditorsPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { updateEditors } from '../../../api';
import DEMO from '../../../store/constant';
import { is_TaiGer_role } from '../../Utils/checking-functions';
import { useAuth } from '../../../components/AuthProvider';

function AssignEditors() {
  const { user } = useAuth();
  const {
    data: { data: students }
  } = useLoaderData();
  const [assignEditorsState, setAssignEditorsState] = useState({
    error: '',
    editor_list: [],
    isLoaded: false,
    students: students,
    updateEditorList: {},
    success: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateEditorlist(e, updateEditorList, student_id);
  };

  const UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...assignEditorsState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setAssignEditorsState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateEditorList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setAssignEditorsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setAssignEditorsState((prevState) => ({
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
    setAssignEditorsState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const { res_modal_status, res_modal_message } = assignEditorsState;

  return (
    <Box data-testid="assignment_editors">
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <AssignEditorsPage
        students={assignEditorsState.students}
        updateEditorList={assignEditorsState.updateEditorList}
        submitUpdateEditorlist={submitUpdateEditorlist}
      />
    </Box>
  );
}

export default AssignEditors;
