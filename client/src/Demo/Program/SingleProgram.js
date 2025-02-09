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

const SingleProgram = () => {
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
    const [modalShowAssignWindowOpen, setModalShowAssignWindow] =
        useState(false);
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
                                programListAssistant={programListAssistant}
                                setDeleteProgramWarningOpen={
                                    setDeleteProgramWarningOpen
                                }
                                setDiffModalShow={setDiffModal(true)}
                                setModalShowAssignWindow={
                                    setModalShowAssignWindow
                                }
                                students={loadedData.students}
                                user={user}
                                versions={loadedData.vc}
                            />
                            <ProgramDeleteWarning
                                RemoveProgramHandler={RemoveProgramHandlerV2}
                                deleteProgramWarning={deleteProgramWarningOpen}
                                isPending={isPending}
                                program_id={loadedData.data._id?.toString()}
                                program_name={loadedData.data.program_name}
                                setDeleteProgramWarningOpen={
                                    setDeleteProgramWarningOpen
                                }
                                uni_name={loadedData.data.school}
                            />
                            <AssignProgramsToStudentDialog
                                handleOnSuccess={() =>
                                    setModalShowAssignWindow(false)
                                }
                                onClose={() => setModalShowAssignWindow(false)}
                                open={modalShowAssignWindowOpen}
                                programs={[loadedData.data]}
                            />
                            {singleProgramState.modalShowDiffWindow ? (
                                <ProgramDiffModal
                                    open={
                                        singleProgramState.modalShowDiffWindow
                                    }
                                    originalProgram={loadedData.data}
                                    setModalHide={setDiffModal(false)}
                                />
                            ) : null}
                        </>
                    )}
                </Await>
            </Suspense>
        </Box>
    );
};
export default SingleProgram;
