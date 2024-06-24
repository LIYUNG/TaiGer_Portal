import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Link,
  Typography
} from '@mui/material';

import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { is_TaiGer_role, is_TaiGer_Student } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { getStudentApplications, getQueryStudentsResults } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramList from '../Program/ProgramList';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';
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
    importedStudentPrograms: [],
    program_ids: [],
    importedStudentModalOpen: false,
    isImportingStudentPrograms: false,
    modalShowAssignSuccessWindow: false,
    student_id: null,
    success: false,
    showProgramCorrectnessReminderModal: true,
    searchContainerRef: useRef(),
    searchResults: [],
    isResultsVisible: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (studentApplicationsAssignProgramlistState.searchTerm) {
        fetchSearchResults();
      } else {
        setStudentApplicationsAssignProgramlistPageState((prevState) => ({
          ...prevState,
          searchResults: []
        }));
      }
    }, 300); // Adjust the delay as needed
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(delayDebounceFn);
    };
  }, [studentApplicationsAssignProgramlistState.searchTerm]);

  const handleClickOutside = () => {
    // Clicked outside, hide the result list
    setStudentApplicationsAssignProgramlistPageState((prevState) => ({
      ...prevState,
      isResultsVisible: false
    }));
  };

  const fetchSearchResults = async () => {
    try {
      setStudentApplicationsAssignProgramlistPageState((prevState) => ({
        ...prevState,
        isLoading: true
      }));
      const response = await getQueryStudentsResults(
        studentApplicationsAssignProgramlistState.searchTerm
      );
      if (response.data.success) {
        setStudentApplicationsAssignProgramlistPageState((prevState) => ({
          ...prevState,
          searchResults: response.data.data,
          isResultsVisible: true,
          isLoading: false
        }));
      } else {
        setStudentApplicationsAssignProgramlistPageState((prevState) => ({
          ...prevState,
          isResultsVisible: false,
          searchTerm: '',
          searchResults: [],
          isErrorTerm: true,
          isLoading: false,
          res_modal_status: 401,
          res_modal_message: 'Session expired. Please refresh.'
        }));
      }
    } catch (error) {
      setStudentApplicationsAssignProgramlistPageState((prevState) => ({
        ...prevState,
        isResultsVisible: false,
        searchTerm: '',
        searchResults: [],
        isErrorTerm: true,
        isLoading: false,
        res_modal_status: 403,
        res_modal_message: error
      }));
    }
  };

  const onClickStudentHandler = (result) => {
    setStudentApplicationsAssignProgramlistPageState((prevState) => ({
      ...prevState,
      importedStudentModalOpen: true,
      isImportingStudentPrograms: true
    }));
    // Call api:
    getStudentApplications(result._id.toString()).then(
      (res) => {
        const { data, success } = res.data;
        const { status } = res;
        if (success) {
          setStudentApplicationsAssignProgramlistPageState((prevState) => ({
            ...prevState,
            isImportingStudentPrograms: false,
            importedStudentPrograms: data,
            program_ids: data?.map((program) =>
              program.programId._id.toString()
            ),
            res_modal_status: status
          }));
        } else {
          const { message } = res.data;
          setStudentApplicationsAssignProgramlistPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      () => {}
    );
  };

  const handleInputChange = (e) => {
    setStudentApplicationsAssignProgramlistPageState((prevState) => ({
      ...prevState,
      searchTerm: e.target.value.trimLeft()
    }));
    if (e.target.value.length === 0) {
      setStudentApplicationsAssignProgramlistPageState((prevState) => ({
        ...prevState,
        isResultsVisible: false
      }));
    }
  };

  const handleInputBlur = () => {
    setStudentApplicationsAssignProgramlistPageState((prevState) => ({
      ...prevState,
      isResultsVisible: false
    }));
  };

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
        <ModalNew open={showProgramCorrectnessReminderModal}>
          <Typography variant="h6" fontWeight="bold">
            {t('Warning', { ns: 'common' })}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2 }}
          >{`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}</Typography>
          <Typography
            sx={{ mt: 2 }}
          >{`若發現 ${appConfig.companyName} Portal 資訊和學校官方網站資料有不同之處，請和顧問討論。`}</Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={closeProgramCorrectnessModal}
            sx={{ mt: 2 }}
          >
            {t('Accept', { ns: 'common' })}
          </Button>
        </ModalNew>
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
            <ImportStudentProgramsCard
              searchTerm={studentApplicationsAssignProgramlistState.searchTerm}
              isResultsVisible={
                studentApplicationsAssignProgramlistState.isResultsVisible
              }
              searchResults={
                studentApplicationsAssignProgramlistState.searchResults
              }
              handleInputBlur={handleInputBlur}
              handleInputChange={handleInputChange}
              onClickStudentHandler={onClickStudentHandler}
            />
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
