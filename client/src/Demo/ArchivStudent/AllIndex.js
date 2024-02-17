import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { SYMBOL_EXPLANATION } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getAllArchivedStudents, updateArchivStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';

function AllArchivStudents() {
  const { user } = useAuth();
  const [allArchivStudentsState, setAllArchivStudentsState] = useState({
    error: '',
    isLoaded: false,
    students: [],
    success: false,
    isArchivPage: true,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  useEffect(() => {
    getAllArchivedStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAllArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          setAllArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setAllArchivStudentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [allArchivStudentsState.isLoaded]);

  const updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setAllArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setAllArchivStudentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setAllArchivStudentsState((prevState) => ({
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
    setAllArchivStudentsState((prevState) => ({
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
    allArchivStudentsState;

  if (!isLoaded && !allArchivStudentsState.data) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  if (allArchivStudentsState.success) {
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
            All Archived Students{' '}
            {` (${allArchivStudentsState.students.length})`}
          </Typography>
        </Breadcrumbs>
        <Box sx={{ mt: 2 }}>
          <TabStudBackgroundDashboard
            user={user}
            students={allArchivStudentsState.students}
            updateStudentArchivStatus={updateStudentArchivStatus}
            isArchivPage={allArchivStudentsState.isArchivPage}
            SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
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
}

export default AllArchivStudents;
