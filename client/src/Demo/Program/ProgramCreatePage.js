import { Suspense, useState } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';

import NewProgramEdit from './NewProgramEdit';
import Loading from '../../components/Loading/Loading';
import { createProgramV2 } from '../../api';
import DEMO from '../../store/constant';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../api/client';

function ProgramCreatePage() {
  const { distinctSchools } = useLoaderData();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success'); // 'success' or 'error'
  const [message, setMessage] = useState('');
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
            <>
              <NewProgramEdit
                handleClick={onClickIsCreateApplicationMode}
                handleSubmit_Program={handleSubmitProgram}
                programs={loadedData}
                isSubmitting={isPending}
                type={'create'}
              />
            </>
          )}
        </Await>
      </Suspense>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default ProgramCreatePage;
