import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

import {
  isProgramDecided,
  isProgramSubmitted,
  is_TaiGer_role
} from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getMyInterviews, createInterview } from '../../api';
import NotesEditor from '../Notes/NotesEditor';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { showTimezoneOffset } from '../Utils/contants';

function AddInterview() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [interviewTrainingState, setAddInterviewState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    interviewslist: [],
    program_id: '',
    interviewData: {},
    isSubmitting: false,
    editorState: '',
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getMyInterviews().then(
      (resp) => {
        const { data, success, student, students } = resp.data;
        const { status } = resp;
        if (success) {
          setAddInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            interviewslist: data,
            students: students,
            student: student,
            success: success,
            res_status: status
          }));
        } else {
          setAddInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setAddInterviewState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const handleEditorChange = (content) => {
    setAddInterviewState((state) => ({
      ...state,
      editorState: content
    }));
  };

  const handleClickSave = (e, editorState) => {
    e.preventDefault();
    if (
      !interviewTrainingState.interviewData.program_id ||
      interviewTrainingState.interviewData.program_id === ''
    ) {
      alert('Interview University / Program is missing');
      return;
    }
    const message = JSON.stringify(editorState);
    const interviewData_temp = interviewTrainingState.interviewData;
    interviewData_temp.interview_description = message;
    setAddInterviewState((prevState) => ({
      ...prevState,
      isSubmitting: true
    }));
    createInterview(
      interviewTrainingState.interviewData.program_id,
      interviewTrainingState.student._id,
      interviewData_temp
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          navigate(`${DEMO.INTERVIEW_LINK}`);
        } else {
          const { message } = resp.data;
          setAddInterviewState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isSubmitting: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setAddInterviewState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
    setAddInterviewState((state) => ({ ...state, in_edit_mode: false }));
  };

  const handleChange_AddInterview = (e) => {
    if (e.target.name === 'student') {
      setAddInterviewState((prevState) => ({
        ...prevState,
        student: interviewTrainingState.students.find(
          (std) => e.target.value === std._id
        )
      }));
    } else {
      const interviewData_temp = { ...interviewTrainingState.interviewData };
      interviewData_temp[e.target.name] = e.target.value;
      setAddInterviewState((prevState) => ({
        ...prevState,
        interviewData: interviewData_temp
      }));
    }
  };

  const ConfirmError = () => {
    setAddInterviewState((prevState) => ({
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
    interviewslist,
    student
  } = interviewTrainingState;

  if (!isLoaded) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  let available_interview_request_programs = [];
  available_interview_request_programs = student?.applications
    .filter(
      (application) =>
        isProgramDecided(application) &&
        isProgramSubmitted(application) &&
        application.admission !== 'O' &&
        application.admission !== 'X' &&
        !interviewslist.find(
          (interview) =>
            interview.program_id._id.toString() ===
              application.programId._id.toString() &&
            interview.student_id._id.toString() ===
              student._id.toString()
        )
    )
    .map((application) => {
      return {
        key: application.programId._id.toString(),
        value: `${application.programId.school} ${application.programId.program_name} ${application.programId.degree} ${application.programId.semester}`
      };
    });

  return (
    <Box>
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
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.INTERVIEW_LINK}`}
        >
          {is_TaiGer_role(user)
            ? t('All Interviews', { ns: 'interviews' })
            : t('My Interviews', { ns: 'interviews' })}
        </Link>
        <Typography color="text.primary">
          {t('Create Interview Training', { ns: 'interviews' })}
        </Typography>
      </Breadcrumbs>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={() => navigate(`${DEMO.INTERVIEW_LINK}`)}
      >
        {t('Back')}
      </Button>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">
          {t('Please provide received interview information', {
            ns: 'interviews'
          })}
        </Typography>
        <Typography variant="body1">
          {t(
            'If you did not receive an interview invitation from the university. Please do not request the training.',
            { ns: 'interviews' }
          )}
        </Typography>
        <Typography variant="body1">
          {t(
            'If you have previously practiced interviews with our interview training officer, please do not request another interview training unless there are special requirements for the new interview (such as reading specific articles or books).',
            { ns: 'interviews' }
          )}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {is_TaiGer_role(user) && (
              <TableRow>
                <TableCell>
                  <Typography>{t('Student')}</Typography>
                </TableCell>
                <TableCell sx={{ display: 'flex' }}>
                  <TextField
                    fullWidth
                    size="small"
                    name="student"
                    id="student"
                    select
                    value={interviewTrainingState.student?._id}
                    onChange={(e) => handleChange_AddInterview(e)}
                  >
                    <MenuItem value={''}>Select Student</MenuItem>
                    {interviewTrainingState.students?.map((std) => (
                      <MenuItem value={std._id} key={std._id}>
                        {std.firstname} {std.lastname} {std.lastname_chinese}
                        {std.firstname_chinese}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell>
                <Typography>
                  {t('Interview Time')} (
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}{' '}
                  {showTimezoneOffset()})
                </Typography>
              </TableCell>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDateTimePicker
                    size="small"
                    required
                    fullWidth
                    id="interview_date"
                    value={interviewTrainingState.interviewData?.interview_date}
                    onChange={(newValue) => {
                      const interviewData_temp = {
                        ...interviewTrainingState.interviewData
                      };
                      interviewData_temp.interview_date = newValue;
                      setAddInterviewState((prevState) => ({
                        ...prevState,
                        interviewData: interviewData_temp
                      }));
                    }}
                  />
                </LocalizationProvider>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  {t('Interview duration', { ns: 'interviews' })}
                </Typography>
              </TableCell>
              <TableCell>
                <TextField
                  name="interview_duration"
                  size="small"
                  type="text"
                  required
                  fullWidth
                  id="interview_duration"
                  placeholder="30 minutes"
                  label={`${t('Interview duration')}`}
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={
                    interviewTrainingState.interviewData?.interview_duration
                  }
                  onChange={(e) => handleChange_AddInterview(e)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body1">
                  {t('Interview program', { ns: 'interviews' })}
                </Typography>
                <Typography variant="body2">
                  {t('In case programs not shown, make sure the programs are submitted.', { ns: 'interviews' })}
                </Typography>
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  name="program_id"
                  id="program_id"
                  select
                  value={interviewTrainingState.interviewData?.program_id || ''}
                  onChange={(e) => handleChange_AddInterview(e)}
                >
                  <MenuItem value={''}>Select Program</MenuItem>
                  {available_interview_request_programs?.map((cat, i) => (
                    <MenuItem value={cat.key} key={i}>
                      {cat.value}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  {t('Interviewer', { ns: 'interviews' })}
                </Typography>
              </TableCell>
              <TableCell>
                <TextField
                  name="interviewer"
                  size="small"
                  type="text"
                  required
                  fullWidth
                  id="interviewer"
                  placeholder="Prof. Sebastian"
                  label={`${t('Interviewer', { ns: 'interviews' })}`}
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={interviewTrainingState.interviewData?.interviewer}
                  onChange={(e) => handleChange_AddInterview(e)}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <br />
        <Typography>
          {t(
            'Please provide interview information (invitation email, reading assignment, etc.) so your interviewer trainer can prepare the training for you.',
            { ns: 'interviews' }
          )}
        </Typography>
        <NotesEditor
          thread={interviewTrainingState.thread}
          buttonDisabled={
            !interviewTrainingState.interviewData.program_id ||
            interviewTrainingState.interviewData.program_id === '' ||
            !interviewTrainingState.interviewData.interview_date ||
            interviewTrainingState.interviewData.interview_date === '' ||
            interviewTrainingState.isSubmitting
          }
          handleEditorChange={handleEditorChange}
          editorState={interviewTrainingState.editorState}
          handleClickSave={handleClickSave}
        />
      </Card>
    </Box>
  );
}

export default AddInterview;
