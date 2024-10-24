import React, { useEffect, useState } from 'react';
import { Navigate, useParams, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getArchivStudents, updateArchivStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import { useTranslation } from 'react-i18next';

function ArchivStudents() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { user_id } = useParams();
  const [archivStudentsState, setArchivStudentsState] = useState({
    error: '',
    isLoaded: false,
    students: [],
    success: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    const TaiGerStaffId = user_id || user._id.toString();
    getArchivStudents(TaiGerStaffId).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setArchivStudentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [archivStudentsState.isLoaded]);

  const updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setArchivStudentsState((prevState) => ({
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
    setArchivStudentsState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Archiv Student');
  const { res_status, isLoaded, res_modal_status, res_modal_message } =
    archivStudentsState;

  if (!isLoaded && !archivStudentsState.data) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  if (archivStudentsState.success) {
    return (
      <Box data-testid="archiv_student_component">
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
            {t('My Archived Students')}{' '}
            {` (${archivStudentsState.students.length})`}
          </Typography>
        </Breadcrumbs>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Box sx={{ mt: 2 }}>
          <TabStudBackgroundDashboard
            students={archivStudentsState.students}
            updateStudentArchivStatus={updateStudentArchivStatus}
          />
        </Box>
      </Box>
    );
  }
}

export default ArchivStudents;
