import { useQuery } from '@tanstack/react-query';
import { getAllCoursessQuery } from '../../../api/query';
import Loading from '../../../components/Loading/Loading';

const AllCourses = () => {
  const { data, isLoading } = useQuery(getAllCoursessQuery());
  const courses = data?.data;
  console.log(courses);
  return (
    <>
      {isLoading && <Loading />}
      {!isLoading &&
        courses?.map((course) => (
          <li key={course._id?.toString()}>{course.all_course_chinese}</li>
        ))}
    </>
  );
};

export default AllCourses;
