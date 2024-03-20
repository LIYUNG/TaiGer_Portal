import React, { useState } from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';

import AssignEssayWritersPage from './AssignEssayWritersPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { updateEssayWriter } from '../../../api';
// import { updateEditors } from '../../../api';
import DEMO from '../../../store/constant';
import { is_TaiGer_role } from '../../Utils/checking-functions';
import { useAuth } from '../../../components/AuthProvider';

function AssignEssayWriters() {
  const { user } = useAuth();
  const {
    data: { data: students },
    essays: { data: essayDocumentThreads}
  } = useLoaderData();
  // console.log("students in fun assignEssayWriter", students)
  const [assignEditorsState, setAssignEditorsState] = useState({
    error: '',
    editor_list: [],
    isLoaded: false,
    students: students,
    updateEditorList: {},
    success: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0,
    essayDocumentThreads: essayDocumentThreads
  });

  const submitUpdateEssayWriterlist = (e, updateEditorList, essayDocumentThread_id) => {
    e.preventDefault();
    UpdateEssayWriterlist(e, updateEditorList, essayDocumentThread_id);
  };
  // (editor_id, documentsthreadId)
  const UpdateEssayWriterlist = (e, updateEditorList, essayDocumentThread_id) => {
    e.preventDefault();
    updateEssayWriter(updateEditorList, essayDocumentThread_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        // console.log('data:', data)// return student object
        if (success) {
          // console.log('success in index')
          var essays_temp = [...assignEditorsState.essayDocumentThreads];
          var essayIdx = essays_temp.findIndex(
            ({ _id }) => _id === essayDocumentThread_id
          );
          essays_temp[essayIdx] = data; // data is single student updated
          setAssignEditorsState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            essayDocumentThreads: essays_temp,
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
        console.log('error in index')
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
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <AssignEssayWritersPage
        students={assignEditorsState.students}
        updateEditorList={assignEditorsState.updateEditorList}
        submitUpdateEssayWriterlist={submitUpdateEssayWriterlist}
        essayDocumentThreads={assignEditorsState.essayDocumentThreads}
      />
    </Box>
  );
}

export default AssignEssayWriters;
