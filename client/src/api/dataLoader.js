import { json } from 'react-router-dom';
import {
  getStudents,
  getAllActiveStudents,
  getArchivStudents,
  getStudentAndDocLinks,
  getApplicationStudent,
  getMyAcademicBackground
} from '.';

export async function getStudentsLoader() {
  const response = await getStudents();
  // console.log(response);
  // console.log(response.statusText);
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}

export async function getAllActiveStudentsLoader() {
  const response = await getAllActiveStudents();
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}

export async function getArchivStudentsLoader() {
  const response = await getArchivStudents();
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}

export async function getStudentAndDocLinksLoader({ params }) {
  const studentId = params.studentId;
  const response = await getStudentAndDocLinks(studentId);
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}

export async function getApplicationStudentLoader({ params }) {
  const student_id = params.student_id;
  const response = await getApplicationStudent(student_id);
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}

export async function getMyAcademicBackgroundLoader() {
  const response = await getMyAcademicBackground();
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}
