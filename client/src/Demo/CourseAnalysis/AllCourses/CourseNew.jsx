import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Link,
    TextField,
    Typography
} from '@mui/material';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';
import i18next from 'i18next';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createCourse } from '../../../api';
import { useSnackBar } from '../../../contexts/use-snack-bar';
import { queryClient } from '../../../api/client';

const CourseNew = () => {
    const [course, setCourse] = useState({
        all_course_chinese: '',
        all_course_english: ''
    });
    const navigate = useNavigate();
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();

    const { mutate, isPending } = useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            setSeverity('success');
            setMessage('Updated program successfully!');
            setOpenSnackbar(true);
            queryClient.invalidateQueries({ queryKey: ['all-courses/all'] });
            navigate(DEMO.COURSE_DATABASE);
        },
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        mutate({ payload: course });
    };

    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.INTERNAL_WIDGET_COURSE_ANALYSER_LINK}`}
                    underline="hover"
                >
                    {i18next.t('Course Analyser', { ns: 'common' })}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.COURSE_DATABASE}`}
                    underline="hover"
                >
                    {i18next.t('All Courses DB', { ns: 'common' })}
                </Link>
                <Typography color="text.primary">
                    {i18next.t('New Course', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Box>
                <Typography sx={{ mb: 2 }} variant="h5">
                    {i18next.t('New Course', { ns: 'common' })}
                </Typography>
                <Typography sx={{ mb: 2 }} variant="body1">
                    {i18next.t('Create a new course', { ns: 'common' })}
                </Typography>
                <form onSubmit={(e) => onSubmit(e)}>
                    <TextField
                        fullWidth
                        id="all_course_chinese"
                        inputProps={{ maxLength: 200 }}
                        label={i18next.t('Course Name in Chinese', {
                            ns: 'common'
                        })}
                        name="all_course_chinese"
                        onChange={handleChange}
                        placeholder="物理"
                        value={course.all_course_chinese}
                    />
                    <TextField
                        fullWidth
                        id="all_course_english"
                        inputProps={{ maxLength: 200 }}
                        label={i18next.t('Course Name in English', {
                            ns: 'common'
                        })}
                        name="all_course_english"
                        onChange={handleChange}
                        placeholder="Physics"
                        sx={{ my: 1 }}
                        value={course.all_course_english}
                    />
                    <Button
                        disabled={
                            course.all_course_chinese === '' ||
                            course.all_course_english === ''
                        }
                        startIcon={
                            isPending ? <CircularProgress size={20} /> : null
                        }
                        type="submit"
                        variant="contained"
                    >
                        {i18next.t('Create', { ns: 'common' })}
                    </Button>
                </form>
            </Box>
        </>
    );
};

export default CourseNew;
