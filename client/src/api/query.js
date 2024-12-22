import { getPrograms, getStudents, getStudentsAndDocLinks2 } from '.';

export const getProgramsQuery = () => ({
  queryKey: ['programs'],
  queryFn: async () => {
    try {
      const response = await getPrograms();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  staleTime: 1000 * 60 // 1 minutes
});

export const getStudentsQuery = () => ({
  queryKey: ['students'],
  queryFn: async () => {
    try {
      const response = await getStudents();
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getStudentsAndDocLinks2Query = () => ({
  queryKey: ['students/doc-links'],
  queryFn: getStudentsAndDocLinks2,
  staleTime: 1000 * 60 * 1 // 1 minutes
});
