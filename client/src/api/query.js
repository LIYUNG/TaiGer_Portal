import {
    getAdmissions,
    verifyV2,
    getProgramsV2,
    getProgramTicketsV2,
    getProgramV2,
    getStudentsAndDocLinks2,
    getStudentsV2,
    getStatisticsV2,
    getAllActiveStudentsV2,
    getAllStudentsV2,
    getStudentUniAssistV2,
    getProgramRequirementsV2,
    getAllCourses,
    getCourse,
    getCommunicationThreadV2,
    getPdfV2,
    getMyCommunicationThreadV2
} from '.';

export const getProgramQuery = ({ programId }) => ({
    queryKey: ['programs', programId],
    queryFn: () => getProgramV2(programId),
    staleTime: 1000 * 60 // 1 minutes
});

export const getStudentUniAssistQuery = ({ studentId }) => ({
    queryKey: ['uniassist', studentId],
    queryFn: () => getStudentUniAssistV2({ studentId }),
    staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getProgramTicketsQuery = ({ type, status }) => ({
    queryKey: ['tickets', { type, status }],
    queryFn: () => getProgramTicketsV2({ type, status }),
    staleTime: 1000 * 60 // 1 minutes
});

export const getStatisticsQuery = () => ({
    queryKey: ['statistics'],
    queryFn: getStatisticsV2,
    staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getAllActiveStudentsQuery = () => ({
    queryKey: ['students/all/active'],
    queryFn: () => getAllActiveStudentsV2(),
    staleTime: 1000 * 60 * 1 // 1 minutes
});

export const getAllStudentsQuery = () => ({
    queryKey: ['students/all'],
    queryFn: () => getAllStudentsV2(),
    staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getAllCoursessQuery = () => ({
    queryKey: ['all-courses/all'],
    queryFn: () => getAllCourses(),
    staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getCoursessQuery = (courseId) => ({
    queryKey: ['all-courses/all', courseId],
    queryFn: () => getCourse({ courseId }),
    staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getCommunicationQuery = (studentId) => ({
    queryKey: ['communications', studentId],
    queryFn: () => getCommunicationThreadV2({ studentId }),
    staleTime: 1000 * 50 // 50 seconds
});

export const getMyCommunicationQuery = () => ({
    queryKey: ['communications', 'my'],
    queryFn: () => getMyCommunicationThreadV2(),
    staleTime: 1000 * 30 // 30 seconds
});

export const getPDFQuery = (apiPath) => ({
    queryKey: ['get-pdf', apiPath],
    queryFn: () => getPdfV2({ apiPath }),
    staleTime: 1000 * 60 * 1 // 50 seconds
});

export const getProgramRequirementsQuery = () => ({
    queryKey: ['students/all'],
    queryFn: () => getProgramRequirementsV2(),
    staleTime: 1000 * 60 * 5 // 5 minutes
});

export const getProgramsQuery = () => ({
    queryKey: ['programs'],
    queryFn: getProgramsV2,
    staleTime: 1000 * 60 // 1 minutes
});

export const getVerifyQuery = () => ({
    queryKey: ['verify'],
    queryFn: verifyV2,
    staleTime: 1000 * 60 * 10 // 10 minutes
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
