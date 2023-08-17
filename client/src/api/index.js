import request from './request';

export const login = (credentials) => request.post('/auth/login', credentials);

export const logout = () => request.get('/auth/logout');

export const register = (credentials) =>
  request.post('/auth/signup', credentials);

export const forgotPassword = ({ email }) =>
  request.post('/auth/forgot-password', { email });

export const resetPassword = ({ email, password, token }) =>
  request.post('/auth/reset-password', { email, password, token });

export const activation = (email, token) =>
  request.post('/auth/activation', { email, token });

// TODO: make resendActivation works
export const resendActivation = ({ email }) =>
  request.post('/auth/resend-activation', { email });

export const verify = () => request.get('/auth/verify');

// Search API
export const getQueryResults = (keywords) =>
  request.get(`/api/search?q=${keywords}`);
export const getQueryPublicResults = (keywords) =>
  request.get(`/api/search/public?q=${keywords}`);
export const getQueryStudentResults = (keywords) =>
  request.get(`/api/communications?q=${keywords}`);
// User APIs
export const getUsers = () => request.get('/api/users');
export const getUser = (user_id) => request.get(`/api/users/${user_id}`);
export const addUser = (user_information) =>
  request.post('/api/users', user_information);

export const deleteUser = (id) => request.delete(`/api/users/${id}`);

export const updateUser = (user) =>
  request.post(`/api/users/${user._id}`, user);

export const changeUserRole = (id, role) => updateUser({ _id: id, role });

export const getAgents = () => request.get('/api/agents');

export const getEditors = () => request.get('/api/editors');

export const getStudents = () => request.get(`/api/students`);

export const getAllStudents = () => request.get(`/api/students/all`);

export const getAdmissions = () => request.get(`/api/admissions`);

export const getExpenses = () => request.get(`/api/expenses`);

export const getStudent = (studentId) =>
  request.get(`/api/students/${studentId}`);

export const getArchivStudents = (TaiGerStaffId) =>
  request.get(`/api/teams/archiv/${TaiGerStaffId}`);

export const updateArchivStudents = (studentId, isArchived) =>
  request.post(`/api/students/archiv/${studentId}`, { isArchived: isArchived });

export const updateArchivUser = (user_id, isArchived) =>
  request.post(`/api/users/archiv/${user_id}`, {
    isArchived: isArchived
  });

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

export const ToggleProgramStatus = (studentId, program_id) =>
  request.put(`/api/students/${studentId}/${program_id}`);

export const downloadProfile = (category, studentId) =>
  request.get(`/api/students/${studentId}/files/${category}`, {
    responseType: 'blob'
  });

export const getProfilePdf = (studentId, path) =>
  request.get(`/api/students/${studentId}/files/${path}`, {
    responseType: 'blob'
  });

// export const getProfilePdf = (path, studentId) =>
//   request.get(`/api/students/${studentId}/files/${path}`, {
//     responseType: 'blob'
//   });

export const uploadforstudent = (category, studentId, data) =>
  request.post(`/api/students/${studentId}/files/${category}`, data);

export const getStudentAndDocLinks = (studentId) =>
  request.get(`/api/students/doc-links/${studentId}`);

export const getStudentsAndDocLinks = () =>
  request.get(`/api/students/doc-links`);

export const updateDocumentationHelperLink = (link, key, category) =>
  request.post(`/api/students/doc-links`, { link, key, category });

export const deleteFile = (category, studentId) =>
  request.delete(`/api/students/${studentId}/files/${category}`);

export const downloadVPDProfile = (studentId, program_id) =>
  request.get(`/api/students/${studentId}/vpd/${program_id}`, {
    responseType: 'blob'
  });
export const uploadVPDforstudent = (studentId, program_id, data) =>
  request.post(`/api/students/${studentId}/vpd/${program_id}`, data);

export const deleteVPDFile = (studentId, program_id) =>
  request.delete(`/api/students/${studentId}/vpd/${program_id}`);

export const SetAsNotNeeded = (studentId, program_id) =>
  request.put(`/api/students/${studentId}/vpd/${program_id}`);

export const SetUniAssistPaid = (studentId, program_id, isPaid) =>
  request.post(`/api/students/${studentId}/vpd/${program_id}/payments`, {
    isPaid
  });
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

// Account APIs
export const getMyfiles = () => request.get(`/api/account/files`);

export const getTemplates = () => request.get(`/api/account/files/template`);
export const uploadtemplate = (category, data) =>
  request.post(`/api/account/files/template/${category}`, data);
export const deleteTemplateFile = (category) =>
  request.delete(`/api/account/files/template/${category}`);
export const getTemplateDownload = (category) =>
  request.get(`/api/account/files/template/${category}`, {
    responseType: 'blob'
  });
export const WidgetTranscriptanalyser = (category, language, courses) =>
  request.post(`/api/widgets/transcript/${category}/${language}`, { courses });
export const WidgetanalyzedFileDownload = (adminId) =>
  request.get(`/api/widgets/transcript/${adminId}`, {
    responseType: 'blob'
  });
export const transcriptanalyser_test = (studentId, category, language) =>
  request.post(`/api/account/transcript/${studentId}/${category}/${language}`);
export const analyzedFileDownload_test = (studentId, filename) =>
  request.get(`/api/account/transcript/${studentId}`, {
    responseType: 'blob'
  });
export const transcriptanalyser = (studentId, category, data) =>
  request.post(`/api/account/transcript/${studentId}/${category}`, data);

export const generatedFileDownload = (studentId, filename) =>
  request.get(`/api/account/transcript/${studentId}/${filename}`, {
    responseType: 'blob'
  });

export const UpdateStudentApplications = (
  studentId,
  applications,
  applying_program_count
) =>
  request.put(`/api/account/applications/${studentId}`, {
    applications,
    applying_program_count
  });

export const deleteGenralFileThread = (documentsthreadId, studentId) =>
  request.delete(`/api/document-threads/${documentsthreadId}/${studentId}`);

export const deleteProgramSpecificFileThread = (
  documentsthreadId,
  programId,
  studentId
) =>
  request.delete(
    `/api/document-threads/${documentsthreadId}/${programId}/${studentId}`
  );

export const getAllCVMLRLOverview = () =>
  request.get(`/api/document-threads/overview/all`);

export const getCVMLRLOverview = () =>
  request.get(`/api/document-threads/overview`);

export const SetFileAsFinal = (documentsthreadId, studentId, program_id) =>
  request.put(`/api/document-threads/${documentsthreadId}/${studentId}`, {
    program_id
  });

// Portal Informations APIs
export const getPortalCredentials = (student_id) =>
  request.get(`/api/portal-informations/${student_id}`);
export const postPortalCredentials = (student_id, program_id, credentials) =>
  request.post(
    `/api/portal-informations/${student_id}/${program_id}`,
    credentials
  );

// Course, Transcript APIs
export const getMycourses = (student_id) =>
  request.get(`/api/courses/${student_id}`);
export const postMycourses = (student_id, file) =>
  request.post(`/api/courses/${student_id}`, file);

// Documentation APIs
// Internal docs
export const getInternalDocumentationPage = () =>
  request.get(`/api/docs/taiger/internal/confidential`);
export const updateInternalDocumentationPage = (doc) =>
  request.put(`/api/docs/taiger/internal/confidential`, doc);
// External docs
export const uploadImage = (file) =>
  request.post(`/api/docs/upload/image`, file);
export const uploadDocDocs = (file) =>
  request.post(`/api/docs/upload/docs`, file);
export const getCategorizedDocumentationPage = (category) =>
  request.get(`/api/docs/pages/${category}`);
export const updateDocumentationPage = (category, doc) =>
  request.put(`/api/docs/pages/${category}`, doc);
export const getCategorizedDocumentation = (category) =>
  request.get(`/api/docs/${category}`);
export const deleteDocumentation = (doc_id) =>
  request.delete(`/api/docs/${doc_id}`);
export const getDocumentation = (doc_id) =>
  request.get(`/api/docs/search/${doc_id}`);
export const getAllDocumentations = () => request.get(`/api/docs/all`);

export const updateDocumentation = (doc_id, doc) =>
  request.put(`/api/docs/${doc_id}`, doc);
export const createDocumentation = (doc) => request.post(`/api/docs`, doc);

export const getInternalDocumentation = (doc_id) =>
  request.get(`/api/docs/internal/search/${doc_id}`);
export const getAllInternalDocumentations = () =>
  request.get(`/api/docs/internal/all`);
export const updateInternalDocumentation = (doc_id, doc) =>
  request.put(`/api/docs/internal/${doc_id}`, doc);
export const createInternalDocumentation = (doc) =>
  request.post(`/api/docs/internal`, doc);
export const deleteInternalDocumentation = (doc_id) =>
  request.delete(`/api/docs/internal/${doc_id}`);

// Program APIs
export const getPrograms = () => request.get('/api/programs');
export const getProgram = (programId) =>
  request.get(`/api/programs/${programId}`);

export const deleteProgram = (programId) =>
  request.delete(`/api/programs/${programId}`);

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
export const uploadDocumentThreadImage = (documentsthreadId, studentId, file) =>
  request.post(
    `/api/document-threads/image/${documentsthreadId}/${studentId}`,
    file
  );

export const SubmitMessageWithAttachment = (
  documentsthreadId,
  studentId,
  newFile
) =>
  request.post(
    `/api/document-threads/${documentsthreadId}/${studentId}`,
    newFile
  );

export const getMessageFileDownload = (documentsthreadId, messageId, fileId) =>
  request.get(
    `/api/document-threads/${documentsthreadId}/${messageId}/${fileId}`,
    {
      responseType: 'blob'
    }
  );

export const getMyCommunicationUnreadNumber = () =>
  request.get('/api/communications/ping/all');
export const getMyCommunicationThread = () =>
  request.get('/api/communications/all');
export const getCommunicationThread = (studentId) =>
  request.get(`/api/communications/${studentId}`);
export const loadCommunicationThread = (studentId, pageNumber) =>
  request.get(`/api/communications/${studentId}/pages/${pageNumber}`);
export const postCommunicationThread = (studentId, message) =>
  request.post(`/api/communications/${studentId}`, {
    message
  });
export const updateAMessageInCommunicationThread = (
  communication_id,
  communication_messageId,
  message
) =>
  request.put(
    `/api/communications/${communication_id}/${communication_messageId}`,
    message
  );
export const deleteAMessageInCommunicationThread = (
  student_id,
  communication_messageId
) =>
  request.delete(
    `/api/communications/${student_id}/${communication_messageId}`
  );

export const getMessagThread = (documentsthreadId) =>
  request.get(`/api/document-threads/${documentsthreadId}`);
export const deleteAMessageInThread = (documentsthreadId, messageId) =>
  request.delete(
    `/api/document-threads/delete/${documentsthreadId}/${messageId}`
  );

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

// remove Banner/notification
export const updateBanner = (notification_key) =>
  request.post(`/api/account/student/notifications`, {
    notification_key
  });

export const updateAgentBanner = (notification_key, student_id) =>
  request.post(`/api/account/agent/notifications`, {
    notification_key,
    student_id
  });

//Survey:
export const updateAcademicBackground = (university, student_id) =>
  request.post(`/api/account/survey/university/${student_id}`, { university });
export const updateLanguageSkill = (language, student_id) =>
  request.post(`/api/account/survey/language/${student_id}`, { language });
export const updateApplicationPreference = (
  application_preference,
  student_id
) =>
  request.post(`/api/account/survey/preferences/${student_id}`, {
    application_preference
  });

export const getMyAcademicBackground = () => request.get('/api/account/survey');

export const getStudentNotes = (student_id) =>
  request.get(`/api/notes/${student_id}`);
export const updateStudentNotes = (student_id, notes) =>
  request.put(`/api/notes/${student_id}`, { notes });

// Time Slot events:
export const getTimeSlots = (student_id) =>
  request.get(`/api/events/${student_id}`);
export const postEvent = (student_id, event) =>
  request.post(`/api/events/${student_id}`, event);
export const updateEvent = (student_id) =>
  request.put(`/api/events/${student_id}`);
export const deleteEvent = (student_id) =>
  request.put(`/api/events/${student_id}`);
export const updateOfficehours = (user_id, officehours, timezone) =>
  request.put(`/api/account/profile/officehours/${user_id}`, {
    officehours,
    timezone
  });

// Teams
export const getTeamMembers = () => request.get('/api/teams');
export const getStatistics = () => request.get('/api/teams/statistics');
export const getAgent = (agent_id) =>
  request.get(`/api/teams/agents/${agent_id}`);
export const getAgentProfile = (agent_id) =>
  request.get(`/api/agents/profile/${agent_id}`);
export const getEditor = (editor_id) =>
  request.get(`/api/teams/editors/${editor_id}`);
export const getExpense = (taiger_user_id) =>
  request.get(`/api/expenses/users/${taiger_user_id}`);
export const updateUserPermission = (taiger_user_id, permissions) =>
  request.post(`/api/permissions/${taiger_user_id}`, permissions);

//Personal Data:
export const updatePersonalData = (user_id, personaldata) =>
  request.post(`/api/account/profile/${user_id}`, { personaldata });

export const updateCredentials = (credentials, email, password) =>
  request.post(`/api/account/credentials`, { credentials, email, password });

//Interview:
export const getAllInterviews = () => request.get('/api/interviews');
export const getInterview = (interview_id) =>
  request.get(`/api/interviews/${interview_id}`);
export const deleteInterview = (interview_id) =>
  request.delete(`/api/interviews/${interview_id}`);
export const updateInterview = (interview_id, payload) =>
  request.put(`/api/interviews/${interview_id}`, payload);
export const getMyInterviews = () =>
  request.get(`/api/interviews/my-interviews`);
export const createInterview = (program_id, student_id, payload) =>
  request.post(`/api/interviews/${program_id}/${student_id}`, payload);
