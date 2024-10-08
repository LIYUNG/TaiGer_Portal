import React, { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  Typography
} from '@mui/material';

import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { is_TaiGer_role, is_TaiGer_Student } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramList from '../Program/ProgramList';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { ImportStudentProgramsCard } from './ImportStudentProgramsCard';
import { StudentPreferenceCard } from './StudentPreferenceCard';

function StudentApplicationsAssignProgramlistPage(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [
    studentApplicationsAssignProgramlistState,
    setStudentApplicationsAssignProgramlistPageState
  ] = useState({
    error: '',
    student: props.student,
    applications: props.student.applications,
    isLoaded: props.isLoaded,
    program_ids: [],
    modalShowAssignSuccessWindow: false,
    student_id: null,
    success: false,
    showProgramCorrectnessReminderModal: true,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  const onClickBackToApplicationOverviewnHandler = () => {
    navigate(
      `/student-applications/${studentApplicationsAssignProgramlistState.student._id.toString()}`
    );
  };

  const closeProgramCorrectnessModal = () => {
    setStudentApplicationsAssignProgramlistPageState((prevState) => ({
      ...prevState,
      showProgramCorrectnessReminderModal: false
    }));
  };
  const ConfirmError = () => {
    setStudentApplicationsAssignProgramlistPageState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const {
    res_status,
    isLoaded,
    res_modal_status,
    res_modal_message,
    showProgramCorrectnessReminderModal
  } = studentApplicationsAssignProgramlistState;

  if (!isLoaded && !studentApplicationsAssignProgramlistState.student) {
    return <Loading />;
  }
  TabTitle(
    `Student ${studentApplicationsAssignProgramlistState.student.firstname} ${studentApplicationsAssignProgramlistState.student.lastname} || Applications Status`
  );
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      {is_TaiGer_Student(user) && (
        <Dialog open={showProgramCorrectnessReminderModal}>
          <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
          <DialogContent>
            <Typography
              variant="body1"
              sx={{ mt: 2 }}
            >{`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}</Typography>
            <Typography
              sx={{ mt: 2 }}
            >{`若發現 ${appConfig.companyName} Portal 資訊和學校官方網站資料有不同之處，請和顧問討論。`}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={closeProgramCorrectnessModal}
              sx={{ mt: 2 }}
            >
              {t('Accept', { ns: 'common' })}
            </Button>
          </DialogActions>
        </Dialog>
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
        {is_TaiGer_role(user) && (
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id.toString(),
              DEMO.PROFILE_HASH
            )}`}
          >
            {props.student.firstname} {props.student.lastname}
          </Link>
        )}
        <Typography color="text.primary">{t('Applications')}</Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} md={is_TaiGer_role(user) ? 6 : 12}>
          <StudentPreferenceCard student={props.student} />
        </Grid>
        {is_TaiGer_role(user) && (
          <Grid item xs={12} md={6}>
            <ImportStudentProgramsCard student={props.student} />
          </Grid>
        )}
      </Grid>
      <>
        <ProgramList student={props.student} isStudentApplicationPage={true} />
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={onClickBackToApplicationOverviewnHandler}
        >
          {t('Back')}
        </Button>
      </>
    </Box>
  );
}

export default StudentApplicationsAssignProgramlistPage;
