import { useQuery } from '@tanstack/react-query';
import { getAllCoursessQuery } from '../../../api/query';

const AllCourses = () => {
  const { data, isLoading } = useQuery(getAllCoursessQuery());
  return <>{!isLoading && JSON.stringify(data)}</>;
};

export default AllCourses;
