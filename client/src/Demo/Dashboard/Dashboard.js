import React, { useState } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as LinkDom, useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AdminMainView from './AdminDashboard/AdminMainView';
import AgentMainView from './AgentDashboard/AgentMainView';
import EditorMainView from './EditorDashboard/EditorMainView';
import ManagerMainView from './ManagerDashboard/ManagerMainView';
import StudentDashboard from './StudentDashboard/StudentDashboard';
import GuestDashboard from './GuestDashboard/GuestDashboard';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  updateArchivStudents,
  updateProfileDocumentStatus,
  updateAgents,
  updateEditors
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
  is_TaiGer_Admin,
  is_TaiGer_Agent,
  is_TaiGer_Editor,
  is_TaiGer_Guest,
  is_TaiGer_Manager,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';

function Dashboard() {
  const { user } = useAuth();
  const {
    students: { data: students, isCoursesFilled, notification },
    essays: { data: essayDocumentThreads}
  } = useLoaderData();
  // const Data = useLoaderData()
  // console.log('Data:', Data)
  const { t } = useTranslation();
  const [dashboardState, setDashboardState] = useState({
    error: '',
    agent_list: [],
    editor_list: [],
    students: students,
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: '',
    notification: notification,
    isCoursesFilled: isCoursesFilled,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0,
    essayDocumentThreads: essayDocumentThreads
  });

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    UpdateAgentlist(e, updateAgentList, student_id);
  };

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateEditorlist(e, updateEditorList, student_id);
  };

  const UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...dashboardState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setDashboardState((prevState) => ({
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
          var students_temp = [...dashboardState.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          setDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setDashboardState((prevState) => ({
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
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setDashboardState((prevState) => ({
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
    var student_arrayidx = dashboardState.students.findIndex(
      (student) => student._id === student_id
    );
    var students = [...dashboardState.students];
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (res) => {
        const { success, data } = res.data;
        const { status } = res;
        if (success) {
          students[student_arrayidx] = data;
          setDashboardState((prevState) => ({
            ...prevState,
            students: students,
            success,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = res.data;
          setDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setDashboardState((prevState) => ({
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
    setDashboardState({
      ...dashboardState,
      res_modal_status: 0,
      res_modal_message: ''
    });
  };

  const { res_modal_status, res_modal_message } = dashboardState;
  TabTitle('Home Page');

  return (
    <Box data-testid="dashoboard_component">
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">{t('Dashboard')}</Typography>
      </Breadcrumbs>
      {is_TaiGer_Admin(user) && (
        <AdminMainView
          students={dashboardState.students}
          submitUpdateAgentlist={submitUpdateAgentlist}
          submitUpdateEditorlist={submitUpdateEditorlist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          isDashboard={dashboardState.isDashboard}
          essayDocumentThreads={dashboardState.essayDocumentThreads}
        />
      )}
      {is_TaiGer_Manager(user) && (
        <ManagerMainView
          students={dashboardState.students}
          notification={dashboardState.notification}
          submitUpdateAgentlist={submitUpdateAgentlist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          isDashboard={dashboardState.isDashboard}
          onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        />
      )}
      {is_TaiGer_Agent(user) && (
        <AgentMainView
          students={dashboardState.students}
          notification={dashboardState.notification}
          submitUpdateAgentlist={submitUpdateAgentlist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          isDashboard={dashboardState.isDashboard}
          onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        />
      )}
      {is_TaiGer_Editor(user) && (
        <EditorMainView
          students={dashboardState.students}
          updateStudentArchivStatus={updateStudentArchivStatus}
          submitUpdateEditorlist={submitUpdateEditorlist}
          isDashboard={dashboardState.isDashboard}
        />
      )}
      {is_TaiGer_Student(user) && (
        <StudentDashboard
          isCoursesFilled={dashboardState.isCoursesFilled}
          student={dashboardState.students[0]}
        />
      )}
      {is_TaiGer_Guest(user) && (
        <GuestDashboard
          success={dashboardState.success}
          students={dashboardState.students}
        />
      )}
    </Box>
  );
}

export default Dashboard;
