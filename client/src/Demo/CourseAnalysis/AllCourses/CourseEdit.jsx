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
    console.log(course);
    mutate({ courseId, payload: course });
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.INTERNAL_WIDGET_COURSE_ANALYSER_LINK}`}
        >
          {i18next.t('Course Analyser', { ns: 'common' })}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.COURSE_DATABASE}`}
        >
          {i18next.t('All Courses DB', { ns: 'common' })}
        </Link>
        <Typography color="text.primary">
          {i18next.t('Edit Course', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {i18next.t('New Course', { ns: 'common' })}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {i18next.t('Create a new course', { ns: 'common' })}
        </Typography>
        <form onSubmit={(e) => onSubmit(e)}>
          <TextField
            fullWidth
            id="all_course_chinese"
            name="all_course_chinese"
            label={i18next.t('Course Name in Chinese', { ns: 'common' })}
            inputProps={{ maxLength: 200 }}
            placeholder="物理"
            value={course.all_course_chinese}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id="all_course_english"
            name="all_course_english"
            label={i18next.t('Course Name in English', { ns: 'common' })}
            inputProps={{ maxLength: 200 }}
            placeholder="Physics"
            value={course.all_course_english}
            onChange={handleChange}
            sx={{ my: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={
              course.all_course_chinese === '' ||
              course.all_course_english === ''
            }
            startIcon={isPending && <CircularProgress size={20} />}
          >
            {i18next.t('Update', { ns: 'common' })}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            component={LinkDom}
            to={`${DEMO.COURSE_DATABASE}`}
          >
            {i18next.t('Back', { ns: 'common' })}
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CourseEdit;
