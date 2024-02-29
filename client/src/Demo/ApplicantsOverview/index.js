import React, { useState } from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { Navigate, Link as LinkDom, useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import { updateArchivStudents } from '../../api';

function ApplicantsOverview() {
  const { user } = useAuth();
  const {
    data: { data: students }
  } = useLoaderData();
  const [applicantsOverviewState, setApplicantsOverviewState] = useState({
    students
  });
  const { t } = useTranslation();

  const updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setApplicantsOverviewState((prevState) => ({
            ...prevState,
            students: data,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setApplicantsOverviewState((prevState) => ({
            ...prevState,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setApplicantsOverviewState((prevState) => ({
          ...prevState,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  if (
    user.role !== 'Admin' &&
    user.role !== 'Editor' &&
    user.role !== 'Agent' &&
    user.role !== 'Student'
  ) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  if (user.role === 'Student') {
    return (
      <Navigate
        to={`${DEMO.STUDENT_APPLICATIONS_LINK}/${user._id.toString()}`}
      />
    );
  }
  TabTitle('Applications Overview');

  return (
    <Box data-testid="application_overview_component">
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
          {is_TaiGer_role(user)
            ? `${t('My Students Application Overview')}`
            : `${user.firstname} ${user.lastname} Applications Overview`}
        </Typography>
      </Breadcrumbs>
      <ApplicationOverviewTabs
        user={user}
        updateStudentArchivStatus={updateStudentArchivStatus}
        students={applicantsOverviewState.students.filter(
          (student) =>
            student.editors.some(
              (editor) => editor._id === user._id.toString()
            ) ||
            student.agents.some((agent) => agent._id === user._id.toString())
        )}
      />
    </Box>
  );
}

export default ApplicantsOverview;
