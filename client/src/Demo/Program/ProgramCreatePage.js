import { Suspense } from 'react';
import { Box } from '@mui/material';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';

import NewProgramEdit from './NewProgramEdit';
import Loading from '../../components/Loading/Loading';
import { createProgramV2 } from '../../api';
import DEMO from '../../store/constant';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../api/client';
import { useSnackBar } from '../../contexts/use-snack-bar';

const ProgramCreatePage = () => {
    const { distinctSchools } = useLoaderData();
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();
    const navigate = useNavigate();

    const onClickIsCreateApplicationMode = () => {
        navigate(DEMO.PROGRAMS);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: createProgramV2,
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        },
        onSuccess: () => {
            setSeverity('success');
            setMessage('Created program successfully!');
            setOpenSnackbar(true);
            queryClient.invalidateQueries({ queryKey: ['programs'] });
            navigate(DEMO.PROGRAMS);
        }
    });

    const handleSubmitProgram = (program) => {
        mutate({ program });
    };

    return (
        <Box>
            <Suspense fallback={<Loading />}>
                <Await resolve={distinctSchools}>
                    {(loadedData) => (
                        <NewProgramEdit
                            handleClick={onClickIsCreateApplicationMode}
                            handleSubmit_Program={handleSubmitProgram}
                            isSubmitting={isPending}
                            programs={loadedData}
                            type="create"
                        />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
};
export default ProgramCreatePage;
