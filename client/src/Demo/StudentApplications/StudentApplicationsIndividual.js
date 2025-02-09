import React from 'react';
import { useLoaderData } from 'react-router-dom';

import StudentApplicationsTableTemplate from './StudentApplicationsTableTemplate';

const StudentApplicationsIndividual = () => {
    const {
        data: { data: student }
    } = useLoaderData();

    return <StudentApplicationsTableTemplate student={student} />;
};

export default StudentApplicationsIndividual;
