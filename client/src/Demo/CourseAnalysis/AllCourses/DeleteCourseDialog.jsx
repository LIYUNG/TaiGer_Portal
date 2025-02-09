import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import i18next from 'i18next';

import { useSnackBar } from '../../../contexts/use-snack-bar';
import { deleteCourse } from '../../../api';
import { queryClient } from '../../../api/client';

export const DeleteCourseDialog = ({
    open,
    onClose,
    courses,
    handleOnSuccess
}) => {
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();
    const {
        mutate,
        isPending,
        isError: isMutateError,
        error: mutateError
    } = useMutation({
        mutationFn: deleteCourse,
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        },
        onSuccess: () => {
            handleOnSuccess();
            setSeverity('success');
            setMessage(i18next.t('Delete course successfully!'));
            queryClient.invalidateQueries({ queryKey: ['all-courses/all'] });
            setOpenSnackbar(true);
        }
    });

    const handleSubmit = () => {
        const courseId = courses?.map(({ _id }) => _id);
        mutate({ courseId });
    };

    return (
        <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
            <DialogTitle>
                {i18next.t('Delete Course', { ns: 'common' })}
            </DialogTitle>
            <DialogContent>
                {!isMutateError ? (
                    <>
                        {i18next.t(
                            'Are you sure you want to delete the course?'
                        )}{' '}
                        {courses?.map(
                            (
                                { all_course_chinese, all_course_english },
                                index
                            ) => (
                                <Box key={index}>
                                    {`${all_course_chinese} - ${all_course_english}`}
                                </Box>
                            )
                        )}
                    </>
                ) : null}
                {isMutateError ? (
                    <Typography color="error">
                        An error occurred: {mutateError.message}
                    </Typography>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={isPending}
                    onClick={(e) => handleSubmit(e)}
                    variant="contained"
                >
                    {isPending ? (
                        <CircularProgress size={20} />
                    ) : (
                        i18next.t('Delete', { ns: 'common' })
                    )}
                </Button>
                <Button color="primary" onClick={onClose}>
                    {i18next.t('Close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
