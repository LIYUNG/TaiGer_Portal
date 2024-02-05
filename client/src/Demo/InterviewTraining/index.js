import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
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
  Typography
} from '@mui/material';

import { is_TaiGer_role } from '../Utils/checking-functions';
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
import { useTranslation } from 'react-i18next';

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

  // if (!is_TaiGer_role(user)) {
  //   return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  // }
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
          application.decided === 'O' &&
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
            <Typography variant="h6">Provide Interview Information</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Interview Date</TableCell>
                  <TableCell>
                    <Form>
                      <Form.Group controlId="interview_date">
                        <Form.Control
                          type="date"
                          //   value={''}
                          placeholder="Date of Interview"
                          onChange={(e) => handleChange_InterviewTraining(e)}
                        />
                      </Form.Group>
                    </Form>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interview time</TableCell>
                  <TableCell>
                    <Form>
                      <Form.Group controlId="interview_time">
                        <Form.Control
                          type="text"
                          //   value={''}
                          placeholder="Date of Interview"
                          onChange={(e) => handleChange_InterviewTraining(e)}
                        />
                      </Form.Group>
                    </Form>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interview duration</TableCell>
                  <TableCell>
                    <Form>
                      <Form.Group controlId="interview_duration">
                        <Form.Control
                          type="text"
                          //   value={''}
                          placeholder="1 hour"
                          onChange={(e) => handleChange_InterviewTraining(e)}
                        />
                      </Form.Group>
                    </Form>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interview University</TableCell>
                  <TableCell>
                    <Form>
                      <Form.Group controlId="program_id">
                        <Form.Control
                          as="select"
                          onChange={(e) => handleChange_InterviewTraining(e)}
                        >
                          <option value={''}>Select Document Category</option>
                          {!is_TaiGer_role(user) &&
                            available_interview_request_programs.map(
                              (cat, i) => (
                                <option value={cat.key} key={i}>
                                  {cat.value}
                                </option>
                              )
                            )}
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interviewer</TableCell>
                  <TableCell>
                    <Form>
                      <Form.Group controlId="interviewer">
                        <Form.Control
                          type="text"
                          //   value={''}
                          placeholder="Prof. Sebastian"
                          onChange={(e) => handleChange_InterviewTraining(e)}
                        />
                      </Form.Group>
                    </Form>
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
        <b>{interviewTrainingState.interview_name_toBeDelete}</b>?
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
          {t('No')}
        </Button>
      </ModalNew>
    </Box>
  );
}

export default InterviewTraining;
