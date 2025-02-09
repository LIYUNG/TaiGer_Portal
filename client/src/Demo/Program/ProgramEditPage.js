import { Suspense } from 'react';
import { Box } from '@mui/material';
import { Await, useLoaderData, useNavigate, useParams } from 'react-router-dom';

import NewProgramEdit from './NewProgramEdit';
import Loading from '../../components/Loading/Loading';
import { updateProgramV2 } from '../../api';
import DEMO from '../../store/constant';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../api/client';
import { getProgramQuery } from '../../api/query';
import { useSnackBar } from '../../contexts/use-snack-bar';

const ProgramEditPage = () => {
    const { distinctSchools } = useLoaderData();
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();

    const navigate = useNavigate();
    const { programId } = useParams();
    const { data, isLoading } = useQuery({
        ...getProgramQuery({ programId })
    });

    const onClickIToSingleProgramPage = () => {
        navigate(DEMO.SINGLE_PROGRAM_LINK(programId));
    };

    const { mutate, isPending } = useMutation({
        mutationFn: updateProgramV2,
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        },
        onSuccess: () => {
            setSeverity('success');
            setMessage('Updated program successfully!');
            setOpenSnackbar(true);
            queryClient.invalidateQueries({
                queryKey: ['programs', programId]
            });
            navigate(DEMO.SINGLE_PROGRAM_LINK(programId));
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
                        <>
                            {isLoading ? <Loading /> : null}
                            {!isLoading ? (
                                <NewProgramEdit
                                    handleClick={onClickIToSingleProgramPage}
                                    handleSubmit_Program={handleSubmitProgram}
                                    isLoading={isLoading}
                                    isSubmitting={isPending}
                                    program={data?.data}
                                    programs={loadedData}
                                    type="edit"
                                />
                            ) : null}
                        </>
                    )}
                </Await>
            </Suspense>
        </Box>
    );
};
export default ProgramEditPage;
