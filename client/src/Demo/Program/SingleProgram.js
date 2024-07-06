import React, { useEffect, useState } from 'react';
import {
  Card,
  Breadcrumbs,
  Button,
  Link,
  Typography,
  Box
} from '@mui/material';
import { Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  assignProgramToStudent,
  getProgram,
  processProgramListAi,
  updateProgram
} from '../../api';
import SingleProgramView from './SingleProgramView';
import ProgramDeleteWarning from './ProgramDeleteWarning';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { deleteProgram } from '../../api';
import ProgramListSubpage from './ProgramListSubpage';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import ModalNew from '../../components/Modal';
import NewProgramEdit from './NewProgramEdit';
import ProgramDiffModal from './ProgramDiffModal';

function SingleProgram() {
  const { programId } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [singleProgramState, setSingleProgramState] = useState({
    error: '',
    isLoaded: false,
    program: null,
    success: false,
    isEdit: false,
    isReport: false,
    modalShowAssignSuccessWindow: false,
    modalShowAssignWindow: false,
    modalShowDiffWindow: false,
    deleteProgramWarning: false,
    isDeleted: false,
    res_status: 0,
    students: [],
    student_id: '',
    tickets: [],
    res_modal_message: '',
    res_modal_status: 0
  });
  useEffect(() => {
    getProgram(programId).then(
      (resp) => {
        const { data, success, students, vc } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            program: data,
            students,
            vc,
            success: success,
            res_status: status
          }));
        } else {
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setSingleProgramState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [programId]);

  const assignProgram = (assign_data) => {
    const { student_id, program_ids } = assign_data;
    setSingleProgramState((prevState) => ({
      ...prevState,
      isAssigning: true
    }));
    assignProgramToStudent(student_id, program_ids).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isAssigning: false,
            modalShowAssignSuccessWindow: true,
            modalShowAssignWindow: false,
            success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isAssigning: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setSingleProgramState((prevState) => ({
          ...prevState,
          isLoaded: true,
          isAssigning: false,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const onSubmitAddToStudentProgramList = (e) => {
    e.preventDefault();
    const student_id = singleProgramState.student_id;
    assignProgram({
      student_id,
      program_ids: [singleProgramState.program._id.toString()]
    });
  };

  const onHideAssignSuccessWindow = () => {
    setSingleProgramState((prevState) => ({
      ...prevState,
      modalShowAssignSuccessWindow: false
    }));
  };

  const setModalShow2 = () => {
    setSingleProgramState((prevState) => ({
      ...prevState,
      modalShowAssignWindow: true
    }));
  };

  const setModalHide = () => {
    setSingleProgramState((prevState) => ({
      ...prevState,
      modalShowAssignWindow: false
    }));
  };

  const setDiffModal = (show = true) => {
    return () => {
      setSingleProgramState((prevState) => ({
        ...prevState,
        modalShowDiffWindow: show
      }));
    };
  };

  const handleSetStudentId = (e) => {
    const { value } = e.target;
    setSingleProgramState((prevState) => ({
      ...prevState,
      student_id: value
    }));
  };

  const handleSubmit_Program = (program) => {
    setIsSubmitting(true);
    updateProgram(program).then(
      (resp) => {
        const { data, success, vc } = resp.data;
        const { status } = resp;
        if (success) {
          setIsSubmitting(false);
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            program: data,
            vc,
            success: success,
            isEdit: !singleProgramState.isEdit,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setIsSubmitting(false);
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setIsSubmitting(false);
        setSingleProgramState((prevState) => ({
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
    // window.location.reload(true);
    setSingleProgramState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const handleClick = () => {
    setSingleProgramState((prevState) => ({
      ...prevState,
      isEdit: !singleProgramState.isEdit
    }));
  };

  const setModalShowDDelete = () => {
    setSingleProgramState((prevState) => ({
      ...prevState,
      deleteProgramWarning: true
    }));
  };

  const setModalHideDDelete = () => {
    setSingleProgramState((prevState) => ({
      ...prevState,
      deleteProgramWarning: false
    }));
  };
  const RemoveProgramHandler = (program_id) => {
    deleteProgram(program_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            deleteProgramWarning: false,
            isDeleted: true,
            success: success,
            isEdit: !singleProgramState.isEdit,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleProgramState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setSingleProgramState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const programListAssistant = () => {
    processProgramListAi(programId).then(
      () => {},
      () => {}
    );
  };

  const {
    res_status,
    isLoaded,
    isDeleted,
    res_modal_status,
    res_modal_message,
    program,
    students,
    vc
  } = singleProgramState;
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  if (!isLoaded) {
    return <Loading />;
  }
  TabTitle(`${program.school} - ${program.program_name}`);

  if (isDeleted) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="h5">The program is deleted</Typography>
        <Typography>
          <LinkDom to={`${DEMO.PROGRAMS}`}>
            Click me back to the program list
          </LinkDom>
        </Typography>
      </Card>
    );
  }
  if (singleProgramState.isEdit) {
    return (
      <Box data-testid="single_program_page_edit">
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <NewProgramEdit
          program={program}
          handleSubmit_Program={handleSubmit_Program}
          isSubmitting={isSubmitting}
          handleClick={handleClick}
          type={'edit'}
        />
      </Box>
    );
  } else {
    return (
      <Box data-testid="single_program_page">
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
          {is_TaiGer_role(user) ? (
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
              to={`${DEMO.PROGRAMS}`}
            >
              {t('Program List', { ns: 'common' })}
            </Link>
          ) : (
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(user._id.toString())}`}
            >
              {t('Applications')}
            </Link>
          )}
          <Typography color="text.primary">
            {`${program.school}-${program.program_name}`}
          </Typography>
        </Breadcrumbs>
        <SingleProgramView
          program={program}
          isLoaded={isLoaded}
          user={user}
          students={students}
          versions={vc}
          programId={programId}
          programListAssistant={programListAssistant}
          handleClick={handleClick}
          setModalShow2={setModalShow2}
          setModalShowDDelete={setModalShowDDelete}
          setDiffModalShow={setDiffModal(true)}
        />

        <ProgramDeleteWarning
          deleteProgramWarning={singleProgramState.deleteProgramWarning}
          setModalHideDDelete={setModalHideDDelete}
          uni_name={program.school}
          program_name={program.program_name}
          RemoveProgramHandler={RemoveProgramHandler}
          program_id={program._id.toString()}
        />
        {singleProgramState.modalShowAssignWindow && (
          <ProgramListSubpage
            show={singleProgramState.modalShowAssignWindow}
            setModalHide={setModalHide}
            uni_name={[program.school]}
            program_name={[program.program_name]}
            handleSetStudentId={handleSetStudentId}
            isButtonDisable={singleProgramState.isAssigning}
            studentId={singleProgramState.student_id}
            onSubmitAddToStudentProgramList={onSubmitAddToStudentProgramList}
          />
        )}
        <ModalNew
          open={singleProgramState.modalShowAssignSuccessWindow}
          onClose={onHideAssignSuccessWindow}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Typography>{t('Success', { ns: 'common' })}</Typography>
          <Typography>
            {t('Program(s) assigned to student successfully!', {
              ns: 'programList'
            })}
          </Typography>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={onHideAssignSuccessWindow}
          >
            {t('Close', { ns: 'common' })}
          </Button>
        </ModalNew>

        {singleProgramState.modalShowDiffWindow && (
          <ProgramDiffModal
            open={singleProgramState.modalShowDiffWindow}
            setModalHide={setDiffModal(false)}
          />
        )}
      </Box>
    );
  }
}
export default SingleProgram;
