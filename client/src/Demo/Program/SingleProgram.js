import React, { Suspense, useState } from 'react';
import { Box } from '@mui/material';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { deleteProgramV2, processProgramListAi } from '../../api';
import SingleProgramView from './SingleProgramView';
import ProgramDeleteWarning from './ProgramDeleteWarning';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ProgramDiffModal from './ProgramDiffModal';
import { AssignProgramsToStudentDialog } from './AssignProgramsToStudentDialog';
import { queryClient } from '../../api/client';
import DEMO from '../../store/constant';
import { useSnackBar } from '../../contexts/use-snack-bar';

function SingleProgram() {
  const { data } = useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProgramV2,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setSeverity('success');
      setMessage('Delete the program successfully!');
      setOpenSnackbar(true);
      navigate(DEMO.PROGRAMS);
    },
    onError: (error) => {
      setSeverity('error');
      setMessage(error.message || 'An error occurred. Please try again.');
      setOpenSnackbar(true);
    }
  });

  const [deleteProgramWarningOpen, setDeleteProgramWarningOpen] =
    useState(false);
  const [modalShowAssignWindowOpen, setModalShowAssignWindow] = useState(false);
  const [singleProgramState, setSingleProgramState] = useState({
    error: '',
    isReport: false,
    modalShowAssignSuccessWindow: false,
    modalShowDiffWindow: false,
    isDeleted: false,
    res_status: 0,
    students: [],
    tickets: [],
    res_modal_message: '',
    res_modal_status: 0
  });

  const setDiffModal = (show = true) => {
    return () => {
      setSingleProgramState((prevState) => ({
        ...prevState,
        modalShowDiffWindow: show
      }));
    };
  };
  const RemoveProgramHandlerV2 = (program_id) => {
    mutate({ program_id });
  };

  const programListAssistant = () => {
    processProgramListAi('TODO').then(
      () => {},
      () => {}
    );
  };

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
                setModalShowAssignWindow={setModalShowAssignWindow}
                setDeleteProgramWarningOpen={setDeleteProgramWarningOpen}
                setDiffModalShow={setDiffModal(true)}
              />
              <ProgramDeleteWarning
                deleteProgramWarning={deleteProgramWarningOpen}
                setDeleteProgramWarningOpen={setDeleteProgramWarningOpen}
                uni_name={loadedData.data.school}
                program_name={loadedData.data.program_name}
                RemoveProgramHandler={RemoveProgramHandlerV2}
                isPending={isPending}
                program_id={loadedData.data._id?.toString()}
              />
              <AssignProgramsToStudentDialog
                open={modalShowAssignWindowOpen}
                onClose={() => setModalShowAssignWindow(false)}
                programs={[loadedData.data]}
                handleOnSuccess={() => setModalShowAssignWindow(false)}
              />
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
