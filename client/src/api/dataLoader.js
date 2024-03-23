import { json } from 'react-router-dom';
import {
  getStudents,
  getAllActiveStudents,
  getArchivStudents,
  getStudentAndDocLinks,
  getApplicationStudent,
  getMyAcademicBackground,
  getAllActiveEssays
} from '.';

export async function getStudentsLoader() {
  const response = await getStudents();
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}

export async function getAllActiveEssaysLoader() {
  const response = await getAllActiveEssays();
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

export async function combinedLoader() {
  // Fetch data from both getAllActiveEssays and getStudents
  const [essaysResponse, studentsResponse] = await Promise.all([
    getAllActiveEssays(),
    getStudents()
  ]);

  // Check if any response has a status code >= 400
  if (essaysResponse.status >= 400 || studentsResponse.status >= 400) {
    const error = {
      message: 'Error fetching data',
      status:
        essaysResponse.status >= 400
          ? essaysResponse.status
          : studentsResponse.status
    };
    throw error;
  }

  // Return an object containing both essays and students data
  return {
    essays: essaysResponse.data, // Assuming essaysResponse.data contains the essays data
    data: studentsResponse.data // Assuming studentsResponse.data contains the students data
  };
}
