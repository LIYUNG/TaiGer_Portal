import { useState } from 'react';
import {
  updateAgents,
  updateArchivStudents,
  updateAttributes,
  updateEditors,
  updateProfileDocumentStatus
} from '../api';

function useStudents(props) {
  const [studentsState, setStudentsState] = useState({
    error: '',
    agent_list: [],
    editor_list: [],
    students: props.students,
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: '',
    notification: props.notification || {},
    isCoursesFilled: props.isCoursesFilled || false,
    res_modal_message: '',
    res_modal_status: 0
  });

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    UpdateAgentlist(e, updateAgentList, student_id);
  };

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateEditorlist(e, updateEditorList, student_id);
  };

  const submitUpdateAttributeslist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateAttributeslist(e, updateEditorList, student_id);
  };

  const UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...studentsState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setStudentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...studentsState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setStudentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const UpdateAttributeslist = (e, updateAttributesList, student_id) => {
    e.preventDefault();
    updateAttributes(updateAttributesList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...studentsState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setStudentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          let students_temp = [...studentsState.students];
          let studentIdx = students_temp.findIndex(
            ({ _id }) => _id === studentId
          );
          students_temp[studentIdx].archiv = isArchived;
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: students_temp,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setStudentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const onUpdateProfileFilefromstudent = (
    category,
    student_id,
    status,
    feedback
  ) => {
    var student_arrayidx = studentsState.students.findIndex(
      (student) => student._id === student_id
    );
    var students = [...studentsState.students];
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (res) => {
        const { success, data } = res.data;
        const { status } = res;
        if (success) {
          students[student_arrayidx] = data;
          setStudentsState((prevState) => ({
            ...prevState,
            students: students,
            success,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = res.data;
          setStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setStudentsState((prevState) => ({
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
    setStudentsState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };
  return {
    students: studentsState.students,
    res_modal_message: studentsState.res_modal_message,
    res_modal_status: studentsState.res_modal_status,
    submitUpdateAgentlist,
    submitUpdateEditorlist,
    submitUpdateAttributeslist,
    updateStudentArchivStatus,
    onUpdateProfileFilefromstudent,
    ConfirmError
  };
}

export default useStudents;
