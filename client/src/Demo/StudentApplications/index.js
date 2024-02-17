import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import StudentApplicationsTableTemplate from './StudentApplicationsTableTemplate';
import ErrorPage from '../Utils/ErrorPage';
import { getApplicationStudent } from '../../api';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

function StudentApplicationsIndividual() {
  const { student_id } = useParams();
  const { user } = useAuth();
  const [studentApplicationsIndividual, setStudentApplicationsIndividual] =
    useState({
      error: '',
      isLoaded: false,
      student: null,
      success: false,
      res_status: 0
    });
  useEffect(() => {
    getApplicationStudent(student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentApplicationsIndividual((prevState) => ({
            ...prevState,
            isLoaded: true,
            student: data,
            success: success,
            res_status: status
          }));
        } else {
          setStudentApplicationsIndividual((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setStudentApplicationsIndividual((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const { res_status, isLoaded } = studentApplicationsIndividual;

  if (!isLoaded && !studentApplicationsIndividual.student) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  return (
    <StudentApplicationsTableTemplate
      isLoaded={isLoaded}
      role={user.role}
      user={user}
      student={studentApplicationsIndividual.student}
    />
  );
}

export default StudentApplicationsIndividual;
