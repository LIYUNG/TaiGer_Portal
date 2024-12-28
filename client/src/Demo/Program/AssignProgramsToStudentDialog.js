import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  Typography
} from '@mui/material';
import { getStudentsQuery } from '../../api/query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { assignProgramToStudentV2 } from '../../api';
import { useTranslation } from 'react-i18next';
import { useSnackBar } from '../../contexts/use-snack-bar';

export const AssignProgramsToStudentDialog = ({
  open,
  onClose,
  programs,
  handleOnSuccess
}) => {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isError: isQueryError,
    error
  } = useQuery({
    ...getStudentsQuery(),
    enabled: open // Only fetch data when the modal is open
  });
  let [studentId, setStudentId] = useState('');
  const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();
  const {
    mutate,
    isPending,
    isError: isMutateError,
    error: mutateError
  } = useMutation({
    mutationFn: assignProgramToStudentV2,
    onError: (error) => {
      setSeverity('error');
      setMessage(error.message || 'An error occurred. Please try again.');
      setOpenSnackbar(true);
    },
    onSuccess: () => {
      handleOnSuccess();
      setSeverity('success');
      setMessage('Assigned programs successfully!');
      setStudentId('');
      setOpenSnackbar(true);
    }
  });

  const handleSetStudentId = (e) => {
    const { value } = e.target;
    setStudentId(value);
  };

  const handleSubmit = () => {
    const program_ids = programs?.map(({ _id }) => _id);
    mutate({ studentId, program_ids });
  };

  let students;
  if (data) {
    students = data?.data;
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('Selected Programs', { ns: 'programList' })}
        </DialogTitle>
        <DialogContent>
          {programs?.map(
            ({ school, program_name, degree, semester }, index) => (
              <Box key={index}>
                {school}
                {program_name}
                {degree}
                {semester}
              </Box>
            )
          )}
          ---
          {isLoading && <CircularProgress />}
          {isQueryError && (
            <Typography color="error">
              An error occurred: {error.message}
            </Typography>
          )}
          {!isLoading && !isQueryError && students && (
            <List dense>
              {students.map((student, i) => (
                <ListItem key={i} divider>
                  <FormControlLabel
                    label={`${student.firstname}, ${student.lastname}`}
                    control={
                      <Checkbox
                        checked={studentId === student._id}
                        onChange={handleSetStudentId}
                        value={student._id}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          {isMutateError && (
            <Typography color="error">
              An error occurred: {mutateError.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={isPending || studentId === ''}
            onClick={(e) => handleSubmit(e)}
          >
            {isPending ? (
              <CircularProgress size={20} />
            ) : (
              t('Assign', { ns: 'common' })
            )}
          </Button>
          <Button onClick={onClose} color="primary">
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
