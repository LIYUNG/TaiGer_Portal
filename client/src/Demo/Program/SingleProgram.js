import React, { Suspense, useState } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Await, useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { processProgramListAi } from '../../api';
import SingleProgramView from './SingleProgramView';
import ProgramDeleteWarning from './ProgramDeleteWarning';
import { deleteProgram } from '../../api';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ProgramDiffModal from './ProgramDiffModal';
import { AssignProgramsToStudentDialog } from './AssignProgramsToStudentDialog';

function SingleProgram() {
  const { data } = useLoaderData();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [singleProgramState, setSingleProgramState] = useState({
    error: '',
    isLoaded: false,
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
    processProgramListAi('TODO').then(
      () => {},
      () => {}
    );
  };

  // if (isDeleted) {
  //   return (
  //     <Card sx={{ p: 2 }}>
  //       <Typography variant="h5">The program is deleted</Typography>
  //       <Typography>
  //         <LinkDom to={`${DEMO.PROGRAMS}`}>
  //           Click me back to the program list
  //         </LinkDom>
  //       </Typography>
  //     </Card>
  //   );
  // }

  return (
    <Box data-testid="single_program_page">
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          {(loadedData) => (
            <>
              <SingleProgramView
                program={loadedData.data}
                user={user}
                students={loadedData.students}
                versions={loadedData.vc}
                programListAssistant={programListAssistant}
                handleClick={handleClick}
                setModalShow2={setModalShow2}
                setModalShowDDelete={setModalShowDDelete}
                setDiffModalShow={setDiffModal(true)}
              />
              <ProgramDeleteWarning
                deleteProgramWarning={singleProgramState.deleteProgramWarning}
                setModalHideDDelete={setModalHideDDelete}
                uni_name={loadedData.data.school}
                program_name={loadedData.data.program_name}
                RemoveProgramHandler={RemoveProgramHandler}
                program_id={loadedData.data._id?.toString()}
              />
              <AssignProgramsToStudentDialog
                open={singleProgramState.modalShowAssignWindow}
                onClose={setModalHide}
                programs={[loadedData.data]}
                handleOnSuccess={setModalHide}
              />
              <Dialog
                open={singleProgramState.modalShowAssignSuccessWindow}
                onClose={onHideAssignSuccessWindow}
                aria-labelledby="contained-modal-title-vcenter"
              >
                <DialogTitle>{t('Success', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {t('Program(s) assigned to student successfully!', {
                      ns: 'programList'
                    })}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={onHideAssignSuccessWindow}
                  >
                    {t('Close', { ns: 'common' })}
                  </Button>
                </DialogActions>
              </Dialog>

              {singleProgramState.modalShowDiffWindow && (
                <ProgramDiffModal
                  open={singleProgramState.modalShowDiffWindow}
                  setModalHide={setDiffModal(false)}
                  originalProgram={loadedData.data}
                />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}
export default SingleProgram;
