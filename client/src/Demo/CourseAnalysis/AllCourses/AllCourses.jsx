import { useQuery } from '@tanstack/react-query';
import { getAllCoursessQuery } from '../../../api/query';
import Loading from '../../../components/Loading/Loading';
import { AllCoursesTable } from './AllCoursesTable';

const AllCourses = () => {
  const { data, isLoading } = useQuery(getAllCoursessQuery());
  const courses = data?.data;

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && <AllCoursesTable data={courses} isLoading={isLoading} />}
    </>
  );
};

export default AllCourses;
