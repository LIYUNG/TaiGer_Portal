import {
  getAdmissions,
  getProgramsV2,
  getProgramTicketsV2,
  getProgramV2,
  getStudentsAndDocLinks2,
  getStudentsV2
} from '.';

export const getProgramQuery = ({ programId }) => ({
  queryKey: ['programs', programId],
  queryFn: () => getProgramV2(programId),
  staleTime: 1000 * 60 // 1 minutes
});

export const getProgramTicketsQuery = ({ type, status }) => ({
  queryKey: ['tickets', { type, status }],
  queryFn: () => getProgramTicketsV2({ type, status }),
  staleTime: 1000 * 60 // 1 minutes
});

export const getProgramsQuery = () => ({
  queryKey: ['programs'],
  queryFn: getProgramsV2,
  staleTime: 1000 * 60 // 1 minutes
});

export const getStudentsQuery = () => ({
  queryKey: ['students'],
  queryFn: getStudentsV2,
  staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getStudentsAndDocLinks2Query = () => ({
  queryKey: ['students/doc-links'],
  queryFn: getStudentsAndDocLinks2,
  staleTime: 1000 * 60 * 1 // 1 minutes
});

export const getAdmissionsQuery = () => ({
  queryKey: ['admissions'],
  queryFn: getAdmissions,
  staleTime: 1000 * 60 * 5 // 5 minutes
});
