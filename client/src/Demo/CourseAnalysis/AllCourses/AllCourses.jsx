import { useQuery } from '@tanstack/react-query';
import { Link as LinkDom } from 'react-router-dom';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { getAllCoursessQuery } from '../../../api/query';
import Loading from '../../../components/Loading/Loading';
import { AllCoursesTable } from './AllCoursesTable';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';
import i18next from 'i18next';

const AllCourses = () => {
  const { data, isLoading } = useQuery(getAllCoursessQuery());
  const courses = data?.data;

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
        <Typography color="text.primary">
          {i18next.t('All Courses DB', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      {isLoading && <Loading />}
      {!isLoading && <AllCoursesTable data={courses} isLoading={isLoading} />}
    </>
  );
};

export default AllCourses;
