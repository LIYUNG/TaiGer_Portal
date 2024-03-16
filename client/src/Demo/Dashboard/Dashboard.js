import React from 'react';
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
import useStudents from '../../hooks/useStudents';

function Dashboard() {
  const { user } = useAuth();
  const {
    data: { data: fetchedStudents, isCoursesFilled, notification }
  } = useLoaderData();
  const { t } = useTranslation();
  const {
    students,
    res_modal_message,
    res_modal_status,
    submitUpdateAgentlist,
    submitUpdateEditorlist,
    submitUpdateAttributeslist,
    updateStudentArchivStatus,
    onUpdateProfileFilefromstudent,
    ConfirmError
  } = useStudents({ students: fetchedStudents, isCoursesFilled, notification });
  console.log(students);
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
        <Typography color="text.primary">
          {t('Dashboard', { ns: 'dashboard' })}
        </Typography>
      </Breadcrumbs>
      {is_TaiGer_Admin(user) && (
        <AdminMainView
          students={students}
          submitUpdateAgentlist={submitUpdateAgentlist}
          submitUpdateEditorlist={submitUpdateEditorlist}
          submitUpdateAttributeslist={submitUpdateAttributeslist}
          updateStudentArchivStatus={updateStudentArchivStatus}
        />
      )}
      {is_TaiGer_Manager(user) && (
        <ManagerMainView
          students={students}
          notification={notification}
          submitUpdateAgentlist={submitUpdateAgentlist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        />
      )}
      {is_TaiGer_Agent(user) && (
        <AgentMainView
          students={students}
          notification={notification}
          submitUpdateAgentlist={submitUpdateAgentlist}
          submitUpdateAttributeslist={submitUpdateAttributeslist}
          updateStudentArchivStatus={updateStudentArchivStatus}
          onUpdateProfileFilefromstudent={onUpdateProfileFilefromstudent}
        />
      )}
      {is_TaiGer_Editor(user) && (
        <EditorMainView
          students={students}
          updateStudentArchivStatus={updateStudentArchivStatus}
          submitUpdateEditorlist={submitUpdateEditorlist}
        />
      )}
      {is_TaiGer_Student(user) && (
        <StudentDashboard
          isCoursesFilled={isCoursesFilled}
          student={students[0]}
        />
      )}
      {is_TaiGer_Guest(user) && <GuestDashboard students={students} />}
    </Box>
  );
}

export default Dashboard;
