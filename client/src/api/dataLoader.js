import { defer, json } from 'react-router-dom';
import {
  getStudents,
  getAllActiveStudents,
  getArchivStudents,
  getAllArchivedStudents,
  getStudentAndDocLinks,
  getApplicationStudent,
  getMyAcademicBackground,
  getAllActiveEssays,
  getAllStudents,
  getStudentUniAssist,
  getComplaintsTickets,
  getComplaintsTicket
} from '.';

export async function getStudentsLoader() {
  const response = await getStudents();
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response;
  }
}

export async function getAllStudentsLoader() {
  const response = await getAllStudents();
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

export async function ComplaintTicketLoader({ params }) {
  const complaintTicketId = params.complaintTicketId;
  const response = await getComplaintsTicket(complaintTicketId);
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response.data.data;
  }
}

export function getComplaintTicketLoader({ params }) {
  return defer({ complaintTicket: ComplaintTicketLoader({ params }) });
}

export async function AllComplaintTicketsLoader() {
  const response = await getComplaintsTickets();
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response.data.data;
  }
}

export function getAllComplaintTicketsLoader() {
  return defer({ complaintTickets: AllComplaintTicketsLoader() });
}

export async function AllActiveStudentsLoader() {
  const response = await getAllActiveStudents();
  if (response.status >= 400) {
    throw json({ message: response.statusText }, { status: response.status });
  } else {
    return response.data.data;
  }
}

export function getAllActiveStudentsLoader() {
  return defer({ students: AllActiveStudentsLoader() });
}

export async function getStudentUniAssistLoader() {
  const response = await getStudentUniAssist();
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

export async function getAllArchivedStudentsLoader() {
  const response = await getAllArchivedStudents();
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

async function loadStudentAndEssays() {
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
    essays: await essaysResponse.data, // Assuming essaysResponse.data contains the essays data
    data: await studentsResponse.data // Assuming studentsResponse.data contains the students data
  };
}

export function combinedLoader() {
  return defer({ studentAndEssays: loadStudentAndEssays() });
}
