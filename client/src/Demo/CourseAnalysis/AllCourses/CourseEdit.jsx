import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Link,
    TextField,
    Typography
} from '@mui/material';
import { Link as LinkDom, useNavigate, useParams } from 'react-router-dom';
import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';
import i18next from 'i18next';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { updateCourse } from '../../../api';
import { useSnackBar } from '../../../contexts/use-snack-bar';
import { queryClient } from '../../../api/client';
import { getCoursessQuery } from '../../../api/query';

const CourseEdit = () => {
    const { courseId } = useParams();
    const { data } = useQuery(getCoursessQuery(courseId));
    const [course, setCourse] = useState({
        all_course_chinese: data?.data?.all_course_chinese || '',
        all_course_english: data?.data?.all_course_english || ''
    });
    const navigate = useNavigate();
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();

    const { mutate, isPending } = useMutation({
        mutationFn: updateCourse,
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
        mutate({ courseId, payload: course });
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
                    {i18next.t('Edit Course', { ns: 'common' })}
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
                        {i18next.t('Update', { ns: 'common' })}
                    </Button>
                    <Button
                        color="primary"
                        component={LinkDom}
                        to={`${DEMO.COURSE_DATABASE}`}
                        variant="outlined"
                    >
                        {i18next.t('Back', { ns: 'common' })}
                    </Button>
                </form>
            </Box>
        </>
    );
};

export default CourseEdit;
