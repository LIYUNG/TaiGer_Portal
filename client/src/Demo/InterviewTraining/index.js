import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { Box, Button, Breadcrumbs, Link, Typography } from '@mui/material';

import { isProgramDecided, is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getMyInterviews, deleteInterview, getAllInterviews } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import InterviewItems from './InterviewItems';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';

function InterviewTraining() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    isAdd: false,
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
    navigate(`${DEMO.INTERVIEW_ADD_LINK}`);
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
            isAdd: false,
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

  TabTitle('Interview training');
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
            {t('Add', { ns: 'common' })}
          </Button>
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
          {t('Yes', { ns: 'common' })}
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
