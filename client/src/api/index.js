import request from "./request";

// TODO: organize to different files

// TODO: replace auth APIs
export const login = (credentials) => request.post("/auth/login", credentials);

export const logout = () => request.get("/auth/logout");

export const register = (credentials) =>
  request.post("/auth/signup", credentials);

export const forgotPassword = ({ email }) =>
  request.post("/auth/forgot-password", { email });

export const resendActivation = ({ email }) =>
  request.post("/auth/resend-activation", { email });

export const verify = () => request.get("/auth/verify");

// User APIs
export const getUsers = () => request.get("/api/users");

export const deleteUser = (id) => request.delete(`/api/users/${id}`);

export const updateUser = (user) => request.put(`/api/users/${user._id}`, user);

export const changeUserRole = (id, role) => updateUser({ _id: id, role });

export const getAgents = () => request.get("/api/agents");

export const getEditors = () => request.get("/api/editors");

export const getStudents = () => request.get(`/api/students`);

export const getArchivStudents = () => request.get(`/api/students/archiv`);

export const updateArchivStudents = (studentId, isArchived) =>
  request.post(`/api/students/archiv/${studentId}`, { isArchived: isArchived });

// Student APIs
export const updateAgents = (agentsId, id) =>
  request.post(`/api/students/${id}/agents`, agentsId);

export const updateEditors = (editorsId, id) =>
  request.post(`/api/students/${id}/editors`, editorsId);

export const assignProgramToStudent = (studentId, programId) =>
  request.post(`/api/students/${studentId}/applications`, {
    programId: programId,
  });

export const removeProgramFromStudent = (programId, studentId) =>
  request.delete(`/api/students/${studentId}/applications/${programId}`);

export const downloadProfile = (category, studentId) =>
  request.get(`/api/students/${studentId}/files/${category}`, {
    responseType: "blob",
  });

export const uploadforstudent = (category, studentId, data) =>
  request.post(`/api/students/${studentId}/files/${category}`, data);

export const updateProfileDocumentStatus = (
  category,
  studentId,
  status,
  message
) =>
  request.post(`/api/students/${studentId}/${category}/status`, {
    status: status,
    feedback: message,
  });

export const deleteFile = (category, studentId) =>
  request.delete(`/api/students/${studentId}/files/${category}`);

// Account APIs
export const getMyfiles = () => request.get(`/api/account/files`);

export const templateDownload = (category) =>
  request.get(`/api/account/files/${category}`, { responseType: "blob" });

export const upload = (studentId, docName, data) =>
  request.post(`/api/account/files/${studentId}/${docName}`, data);

export const uploadtemplate = (studentId, docName, data) =>
  request.post(`/api/account/files/template/${docName}`, data);

export const transcriptanalyser = (studentId, category, data) =>
  request.post(`/api/account/transcript/${studentId}/${category}`, data);

export const generatedFileDownload = (studentId, filename) =>
  request.get(`/api/account/transcript/${studentId}/${filename}`, {
    responseType: "blob",
  });
export const getTemplateDownload = (category) =>
  request.get(`/api/account/download/template/${category}`, {
    responseType: "blob",
  });
export const SetAsDecidedProgram = (studentId, applicationId) =>
  request.put(`/api/account/program/decided/${studentId}/${applicationId}`);
export const SetAsCloseProgram = (studentId, applicationId) =>
  request.put(`/api/account/program/close/${studentId}/${applicationId}`);
export const SetAsGetAdmissionProgram = (studentId, applicationId) =>
  request.put(`/api/account/program/admission/${studentId}/${applicationId}`);

export const createManualFileUploadPlace = (
  studentId,
  applicationId,
  docName
) =>
  request.put(
    `/api/account/files/placeholder/${studentId}/${applicationId}/${docName}`
  );
export const deleteProgramSpecificFileUpload = (
  studentId,
  applicationId,
  docName,
  whoupdate
) =>
  request.delete(
    `/api/account/files/programspecific/${studentId}/${applicationId}/${docName}/${whoupdate}`
  );

export const deleteGenralFileUpload = (studentId, docName, whoupdate) =>
  request.delete(
    `/api/account/files/general/${studentId}/${docName}/${whoupdate}`
  );

export const SetAsFinalProgramSpecificFile = (
  studentId,
  applicationId,
  docName,
  whoupdate
) =>
  request.put(
    `/api/account/files/programspecific/${studentId}/${applicationId}/${docName}/${whoupdate}`
  );

export const SetAsFinalGenralFile = (studentId, docName, whoupdate) =>
  request.put(
    `/api/account/files/general/${studentId}/${docName}/${whoupdate}`
  );

export const uploadEditGeneralFileforstudent = (
  studentId,
  fileCategory,
  data
) =>
  request.post(
    `/api/account/files/general/upload/${studentId}/${fileCategory}`,
    data
  );

export const updateStudentFeedbackGeneralFileByStudent = (
  studentId,
  docName,
  whoupdate,
  student_feedback
) =>
  request.post(
    `/api/account/files/general/studentfeedback/${studentId}/${whoupdate}/${docName}`,
    { student_feedback }
  );

export const updateEditGeneralFileCommentsforstudent = (
  studentId,
  docName,
  whoupdate,
  comments
) =>
  request.post(
    `/api/account/files/general/comments/${studentId}/${whoupdate}/${docName}`,
    { comments }
  );
export const downloadGeneralHandWrittenFile = (
  studentId,
  docName,
  student_inputs
) =>
  request.get(
    `/api/account/files/general/${studentId}/${docName}/${student_inputs}`,
    {
      responseType: "blob",
    }
  );
export const uploadHandwrittenFileforstudent = (
  studentId,
  applicationId,
  fileCategory,
  data
) =>
  request.post(
    `/api/account/files/programspecific/upload/${studentId}/${applicationId}/${fileCategory}`,
    data
  );

export const updateHandwrittenFileCommentsforstudent = (
  studentId,
  applicationId,
  docName,
  whoupdate,
  comments
) =>
  request.post(
    `/api/account/files/programspecific/comments/${studentId}/${applicationId}/${docName}/${whoupdate}`,
    { comments }
  );

export const updateStudentFeedbackProgramSpecificFileByStudent = (
  studentId,
  applicationId,
  docName,
  whoupdate,
  student_feedback
) =>
  request.post(
    `/api/account/files/programspecific/studentfeedback/${studentId}/${applicationId}/${docName}/${whoupdate}`,
    { student_feedback }
  );

export const downloadHandWrittenFile = (
  studentId,
  applicationId,
  docName,
  student_inputs
) =>
  request.get(
    `/api/account/files/programspecific/${studentId}/${applicationId}/${docName}/${student_inputs}`,
    {
      responseType: "blob",
    }
  );

//obsolete(? double check)
export const deleteWrittenFile = (
  studentId,
  applicationId,
  docName,
  student_inputs
) =>
  request.delete(
    `/api/account/files/programspecific/${studentId}/${applicationId}/${docName}/${student_inputs}`
  );

// Program APIs
export const getPrograms = () => request.get("/api/programs");
export const getProgram = (programId) => request.get(`/api/programs/${programId}`);

export const deleteProgram = (id) => request.delete(`/api/programs/${id}`);

export const createProgram = (program) =>
  request.post("/api/programs", program);

export const updateProgram = (program) =>
  request.post(`/api/programs/${program._id}`, program);

// Docs APIs
export const deleteDoc = (id) => request.delete(`/api/docs/${id}`);
export const addDoc = (id) => request.post(`/api/docs/${id}`);
export const updateDoc = (id, doc_temp) =>
  request.post(`/api/docs/${id}`, doc_temp);

export const createArticle = (article) => request.post("/api/docs", article);

export const updateArticle = (id, article) =>
  request.post(`/api/docs/${id}`, article);

const getArticle = (type) => request.get(`/api/docs/${type}`);

export const getApplicationArticle = () => getArticle("application");

export const getVisaArticle = () => getArticle("visa");

export const getUniassistArticle = () => getArticle("uniassist");

export const getCertificationArticle = () => getArticle("certification");

//Survey:
export const updateAcademicBackground = (university) =>
  request.post(`/api/account/survey/university`, { university });
export const updateLanguageSkill = (language) =>
  request.post(`/api/account/survey/language`, { language });

export const getMyAcademicBackground = () => request.get("/api/account/survey");

//Personal Data:
export const updatePersonalData = (personaldata) =>
  request.post(`/api/account/profile`, { personaldata });
