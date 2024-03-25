import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
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

import { isProgramDecided, is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  getMyInterviews,
  createInterview,
  deleteInterview,
  getAllInterviews
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import NotesEditor from '../Notes/NotesEditor';
import InterviewItems from './InterviewItems';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';

function InterviewTraining() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [interviewTrainingState, setInterviewTrainingState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    interviewslist: [],
    interview_id_toBeDelete: '',
    interview_name_toBeDelete: '',
    program_id: '',
    interviewData: {},
    category: '',
    SetDeleteDocModel: false,
    isEdit: false,
    expand: true,
    editorState: '',
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    if (is_TaiGer_role(user)) {
      getAllInterviews().then(
        (resp) => {
          const { data, success, student } = resp.data;
          const { status } = resp;
          if (success) {
            setInterviewTrainingState((prevState) => ({
              ...prevState,
              isLoaded: true,
              interviewslist: data,
              student: student,
              success: success,
              res_status: status
            }));
          } else {
            setInterviewTrainingState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_status: status
            }));
          }
        },
        (error) => {
          setInterviewTrainingState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    } else {
      getMyInterviews().then(
        (resp) => {
          const { data, success, student } = resp.data;
          const { status } = resp;
          if (success) {
            setInterviewTrainingState((prevState) => ({
              ...prevState,
              isLoaded: true,
              interviewslist: data,
              student: student,
              success: success,
              res_status: status
            }));
          } else {
            setInterviewTrainingState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_status: status
            }));
          }
        },
        (error) => {
          setInterviewTrainingState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }, []);

  const handleClick = () => {
    setInterviewTrainingState((prevState) => ({
      ...prevState,
      isEdit: !prevState.isEdit
    }));
  };

  const handleDeleteInterview = () => {
    deleteInterview(interviewTrainingState.interview_id_toBeDelete).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          let interviewslist_temp = [...interviewTrainingState.interviewslist];
          let to_be_delete_doc_idx = interviewslist_temp.findIndex(
            (doc) =>
              doc._id.toString() ===
              interviewTrainingState.interview_id_toBeDelete
          );
          if (to_be_delete_doc_idx > -1) {
            // only splice array when item is found
            interviewslist_temp.splice(to_be_delete_doc_idx, 1); // 2nd parameter means remove one item only
          }
          setInterviewTrainingState((prevState) => ({
            ...prevState,
            success,
            interviewslist: interviewslist_temp,
            SetDeleteDocModel: false,
            isEdit: false,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setInterviewTrainingState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setInterviewTrainingState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const openDeleteDocModalWindow = (e, interview) => {
    e.stopPropagation();
    setInterviewTrainingState((prevState) => ({
      ...prevState,
      interview_id_toBeDelete: interview._id,
      interview_name_toBeDelete: `${interview.program_id.school} ${interview.program_id.program_name}`,
      SetDeleteDocModel: true
    }));
  };

  const closeDeleteDocModalWindow = () => {
    setInterviewTrainingState((prevState) => ({
      ...prevState,
      SetDeleteDocModel: false
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
    createInterview(
      interviewTrainingState.interviewData.program_id,
      user._id.toString(),
      interviewData_temp
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          let interviewslist_temp = [...interviewTrainingState.interviewslist];
          interviewslist_temp.push(data);
          setInterviewTrainingState((prevState) => ({
            ...prevState,
            success,
            interviewslist: interviewslist_temp,
            editorState: '',
            isEdit: !prevState.isEdit,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setInterviewTrainingState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setInterviewTrainingState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
    setInterviewTrainingState((state) => ({ ...state, in_edit_mode: false }));
  };

  const handleChange_InterviewTraining = (e) => {
    const interviewData_temp = { ...interviewTrainingState.interviewData };
    interviewData_temp[e.target.id] = e.target.value;
    setInterviewTrainingState((prevState) => ({
      ...prevState,
      interviewData: interviewData_temp
    }));
  };

  const ConfirmError = () => {
    setInterviewTrainingState((prevState) => ({
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
  if (!is_TaiGer_role(user)) {
    available_interview_request_programs = student.applications
      .filter(
        (application) =>
          isProgramDecided(application) &&
          application.admission !== 'O' &&
          application.admission !== 'X' &&
          !interviewslist.find(
            (interview) =>
              interview.program_id._id.toString() ===
              application.programId._id.toString()
          )
      )
      .map((application) => {
        return {
          key: application.programId._id.toString(),
          value: `${application.programId.school} ${application.programId.program_name} ${application.programId.degree} ${application.programId.semester}`
        };
      });
  }

  TabTitle('Docs Database');
  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}

      {interviewTrainingState.isEdit ? (
        <>
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
                ? 'All Interviews'
                : 'Create Interview Training Request'}
            </Typography>
          </Breadcrumbs>
          <Button
            size="small"
            color="secondary"
            onClick={() =>
              setInterviewTrainingState((state) => ({
                ...state,
                isEdit: !interviewTrainingState.isEdit
              }))
            }
          >
            {t('Back')}
          </Button>
          <Card>
            <Typography variant="h6">
              {t('Provide Interview Information')}
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{t('Interview Date')}</TableCell>
                  <TableCell>
                    <TextField
                      name="interview_date"
                      type="date"
                      required
                      fullWidth
                      id="interview_date"
                      placeholder="Date of Interview"
                      label={`${t('Date of Interview')}`}
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={''}
                      onChange={(e) => handleChange_InterviewTraining(e)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('Interview time')}</TableCell>
                  <TableCell>
                    <TextField
                      name="interview_time"
                      type="text"
                      required
                      fullWidth
                      id="interview_time"
                      placeholder="Interview time"
                      label={`${t('Interview time')}`}
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={''}
                      onChange={(e) => handleChange_InterviewTraining(e)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('Interview duration')}</TableCell>
                  <TableCell>
                    <TextField
                      name="interview_duration"
                      type="text"
                      required
                      fullWidth
                      id="interview_duration"
                      placeholder="Interview duration"
                      label={`${t('Interview duration')}`}
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={''}
                      onChange={(e) => handleChange_InterviewTraining(e)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('Interview University')}</TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      name="program_id"
                      id="program_id"
                      select
                      onChange={(e) => handleChange_InterviewTraining(e)}
                    >
                      <MenuItem value={''}>Select Document Category</MenuItem>
                      {!is_TaiGer_role(user) &&
                        available_interview_request_programs.map((cat, i) => (
                          <MenuItem value={cat.key} key={i}>
                            {cat.value}
                          </MenuItem>
                        ))}
                    </TextField>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('Interviewer')}</TableCell>
                  <TableCell>
                    <TextField
                      name="interviewer"
                      type="text"
                      required
                      fullWidth
                      id="interviewer"
                      placeholder="Prof. Sebastian"
                      label={`${t('Interviewer')}`}
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={''}
                      onChange={(e) => handleChange_InterviewTraining(e)}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <br />
            <Typography>
              Please provide further information (invitation email content,
              reading assignment, etc.) below:{' '}
            </Typography>
            <NotesEditor
              thread={interviewTrainingState.thread}
              buttonDisabled={
                !interviewTrainingState.interviewData.program_id ||
                interviewTrainingState.interviewData.program_id === '' ||
                !interviewTrainingState.interviewData.interview_date ||
                interviewTrainingState.interviewData.interview_date === ''
              }
              editorState={interviewTrainingState.editorState}
              handleClickSave={handleClickSave}
            />
          </Card>
        </>
      ) : (
        <>
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
              {is_TaiGer_role(user) ? 'All Interviews' : 'My Interviews'}
            </Typography>
          </Breadcrumbs>
          {interviewslist.map((interview, i) => (
            <InterviewItems
              key={i}
              expanded={false}
              user={user}
              readOnly={true}
              interview={interview}
              openDeleteDocModalWindow={openDeleteDocModalWindow}
            />
          ))}
          {!is_TaiGer_role(user) &&
            available_interview_request_programs.length > 0 && (
              <Button size="small" onClick={handleClick}>
                {t('Add')}
              </Button>
            )}
        </>
      )}

      <ModalNew
        open={interviewTrainingState.SetDeleteDocModel}
        onClose={closeDeleteDocModalWindow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Typography variant="h6">Warning</Typography>
        Do you want to delete the interview request of{' '}
        <Typography fontWeight="bold">
          {interviewTrainingState.interview_name_toBeDelete}
        </Typography>
        ?
        <Button
          color="primary"
          variant="contained"
          disabled={!isLoaded}
          onClick={handleDeleteInterview}
        >
          {t('Yes')}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={closeDeleteDocModalWindow}
        >
          {t('No', { ns: 'common' })}
        </Button>
      </ModalNew>
    </Box>
  );
}

export default InterviewTraining;
