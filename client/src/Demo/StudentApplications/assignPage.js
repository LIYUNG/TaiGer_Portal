import React from 'react';
import { useLoaderData } from 'react-router-dom';

import StudentApplicationsAssignProgramlistPage from './StudentApplicationsAssignProgramlistPage';

function StudentApplicationsAssignPage() {
  const {
    data: { data: student }
  } = useLoaderData();

  return <StudentApplicationsAssignProgramlistPage student={student} />;
}

export default StudentApplicationsAssignPage;