import request from './request';

// TODO: organize to different files

// TODO: replace auth APIs
export const login = (credentials) => request.post('/auth/login', credentials);

export const logout = () => request.get('/auth/logout');

export const register = (credentials) =>
  request.post('/auth/signup', credentials);

export const forgotPassword = ({ email }) =>
  request.post('/auth/forgot-password', { email });

export const activation = (email, token) =>
  request.post('/auth/activation', { email, token });

export const resendActivation = ({ email }) =>
  request.post('/auth/resend-activation', { email });

export const verify = () => request.get('/auth/verify');

// User APIs
export const getUsers = () => request.get('/api/users');

export const deleteUser = (id) => request.delete(`/api/users/${id}`);

export const updateUser = (user) => request.post(`/api/users/${user._id}`, user);

export const changeUserRole = (id, role) => updateUser({ _id: id, role });

export const getAgents = () => request.get('/api/agents');

export const getEditors = () => request.get('/api/editors');

export const getStudents = () => request.get(`/api/students`);

export const getAllStudents = () => request.get(`/api/students/all`);

export const getStudent = (studentId) =>
  request.get(`/api/students/${studentId}`);

export const getArchivStudents = () => request.get(`/api/students/archiv`);

export const updateArchivStudents = (studentId, isArchived) =>
  request.post(`/api/students/archiv/${studentId}`, { isArchived: isArchived });

// Student APIs
export const updateAgents = (agentsId, id) =>
  request.post(`/api/students/${id}/agents`, agentsId);

export const updateEditors = (editorsId, id) =>
  request.post(`/api/students/${id}/editors`, editorsId);

export const assignProgramToStudent = (studentId, program_ids) =>
  request.post(`/api/students/${studentId}/applications`, {
    program_id_set: program_ids
  });

export const removeProgramFromStudent = (programId, studentId) =>
  request.delete(`/api/students/${studentId}/applications/${programId}`);

export const downloadProfile = (category, studentId) =>
  request.get(`/api/students/${studentId}/files/${category}`, {
    responseType: 'blob'
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
    feedback: message
  });

export const deleteFile = (category, studentId) =>
  request.delete(`/api/students/${studentId}/files/${category}`);

// Account APIs
export const getMyfiles = () => request.get(`/api/account/files`);

export const templateDownload = (category) =>
  request.get(`/api/account/files/${category}`, { responseType: 'blob' });

export const upload = (studentId, docName, data) =>
  request.post(`/api/account/files/${studentId}/${docName}`, data);

export const uploadtemplate = (studentId, docName, data) =>
  request.post(`/api/account/files/template/${docName}`, data);

export const transcriptanalyser = (studentId, category, data) =>
  request.post(`/api/account/transcript/${studentId}/${category}`, data);

export const generatedFileDownload = (studentId, filename) =>
  request.get(`/api/account/transcript/${studentId}/${filename}`, {
    responseType: 'blob'
  });
export const getTemplateDownload = (category) =>
  request.get(`/api/account/download/template/${category}`, {
    responseType: 'blob'
  });

export const UpdateStudentApplications = (studentId, applications) =>
  request.put(`/api/account/applications/${studentId}`, { applications });

export const deleteGenralFileThread = (documentsthreadId, studentId) =>
  request.delete(`/api/document-threads/${studentId}/${documentsthreadId}`);

export const deleteProgramSpecificFileThread = (
  documentsthreadId,
  programId,
  studentId
) =>
  request.delete(
    `/api/document-threads/${documentsthreadId}/${programId}/${studentId}`
  );

export const getCVMLRLOverview = () =>
  request.get(`/api/document-threads/overview`);

export const SetAsFinalProgramSpecificFile = (
  studentId,
  applicationId,
  docName,
  whoupdate
) =>
  request.put(
    `/api/account/files/programspecific/${studentId}/${applicationId}/${whoupdate}/${docName}`
  );

export const SetAsFinalGenralFile = (documentsthreadId, studentId, program_id) =>
  request.put(`/api/document-threads/${documentsthreadId}/${studentId}`, {
    program_id
  });

// Program APIs
export const getPrograms = () => request.get('/api/programs');
export const getProgram = (programId) =>
  request.get(`/api/programs/${programId}`);

export const deleteProgram = (id) => request.delete(`/api/programs/${id}`);

export const createProgram = (program) =>
  request.post('/api/programs', program);

export const updateProgram = (program) =>
  request.put(`/api/programs/${program._id}`, program);

// Docs APIs
export const deleteDoc = (id) => request.delete(`/api/docs/${id}`);
export const addDoc = (id) => request.post(`/api/docs/${id}`);
export const updateDoc = (id, doc_temp) =>
  request.post(`/api/docs/${id}`, doc_temp);

export const createArticle = (article) => request.post('/api/docs', article);

export const updateArticle = (id, article) =>
  request.post(`/api/docs/${id}`, article);

const getArticle = (type) => request.get(`/api/docs/${type}`);

export const getApplicationArticle = () => getArticle('application');
export const SubmitMessageWithAttachment = (
  documentsthreadId,
  // userId,
  studentId,
  // file_type,
  // message,
  newFile
) =>
  request.post(
    `/api/document-threads/${documentsthreadId}/${studentId}`,
    newFile,
    {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json'
    }
  );
export const getMessageFileDownload = (documentsthreadId, messageId, fileId) =>
  request.get(
    `/api/document-threads/${documentsthreadId}/${messageId}/${fileId}`,
    {
      responseType: 'blob'
    }
  );

export const getMessagThread = (documentsthreadId) =>
  request.get(`/api/document-threads/${documentsthreadId}`);
export const initGeneralMessageThread = (studentId, document_catgory) =>
  request.post(
    `/api/document-threads/init/general/${studentId}/${document_catgory}`
  );
export const initApplicationMessageThread = (
  studentId,
  applicationId,
  document_catgory
) =>
  request.post(
    `/api/document-threads/init/application/${studentId}/${applicationId}/${document_catgory}`
  );

export const getVisaArticle = () => getArticle('visa');

export const getUniassistArticle = () => getArticle('uniassist');

export const getCertificationArticle = () => getArticle('certification');

//Task:
export const initTasks = (studentId) => request.post(`/api/tasks/${studentId}`);
export const getMyStudentsTasks = () =>
  request.get('/api/tasks/my-students-tasks');
export const getMyStudentTasks = (studentId) =>
  request.get(`/api/tasks/${studentId}`);
export const getMyTask = () => request.get('/api/tasks/mytask');
export const getStudentTask = (student_id) =>
  request.get(`/api/tasks/${student_id}`);

//Survey:
export const updateAcademicBackground = (university) =>
  request.post(`/api/account/survey/university`, { university });
export const updateLanguageSkill = (language) =>
  request.post(`/api/account/survey/language`, { language });

export const getMyAcademicBackground = () => request.get('/api/account/survey');

//Personal Data:
export const updatePersonalData = (personaldata) =>
  request.post(`/api/account/profile`, { personaldata });

export const updateCredentials = (credentials, email, password) =>
  request.post(`/api/account/credentials`, { credentials, email, password });
