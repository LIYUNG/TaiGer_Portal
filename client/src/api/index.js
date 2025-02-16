import {
    BASE_URL,
    deleteData,
    getData,
    getDataBlob,
    postData,
    putData,
    request
} from './request';

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
export const verifyV2 = () => getData('/auth/verify');

// Search API
export const getQueryStudentsResults = (keywords) =>
    request.get(`/api/search/students?q=${keywords}`);
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

export const getEssayWriters = () => request.get('/api/essay-writers');

export const getStudents = () => request.get(`/api/students`);

export const getStudentsV2 = () => getData(`/api/students`);

export const getAllStudents = () => request.get(`/api/students/all`);

export const getAllStudentsV2 = () => getData(`/api/students/all`);

export const getAllActiveStudents = () =>
    request.get(`/api/students/all/active`);

export const getAllActiveStudentsV2 = () => getData(`/api/students/all/active`);

export const getAllArchivedStudents = () =>
    request.get(`/api/students/all/archiv`);

export const getAdmissions = () => getData(`/api/admissions`);

export const getExpenses = () => request.get(`/api/expenses`);

export const getApplicationConflicts = () =>
    request.get(`/api/student-applications/conflicts`);

export const getApplicationTaskDeltas = () =>
    request.get(`/api/student-applications/deltas`);

export const getApplicationStudent = (studentId) =>
    request.get(`/api/student-applications/${studentId}`);

export const getStudentUniAssist = (studentId) =>
    request.get(`/api/uniassist/${studentId}`);

export const getStudentUniAssistV2 = ({ studentId }) =>
    getData(`/api/uniassist/${studentId}`);

export const getArchivStudents = (TaiGerStaffId) =>
    request.get(`/api/teams/archiv/${TaiGerStaffId}`);

export const updateArchivStudents = (studentId, isArchived, shouldInform) =>
    request.post(`/api/students/archiv/${studentId}`, {
        isArchived,
        shouldInform
    });

export const updateArchivUser = (user_id, isArchived) =>
    request.post(`/api/users/archiv/${user_id}`, {
        isArchived: isArchived
    });

// Student APIs
export const updateAgents = (agentsId, studentId) =>
    request.post(`/api/students/${studentId}/agents`, agentsId);

export const updateEditors = (editorsId, studentId) =>
    request.post(`/api/students/${studentId}/editors`, editorsId);

export const updateAttributes = (attributesId, studentId) =>
    request.post(`/api/students/${studentId}/attributes`, attributesId);

export const assignProgramToStudent = (studentId, program_ids) =>
    request.post(`/api/students/${studentId}/applications`, {
        program_id_set: program_ids
    });

export const assignProgramToStudentV2 = ({ studentId, program_ids }) =>
    postData(`/api/students/${studentId}/applications`, {
        program_id_set: program_ids
    });

export const getStudentApplications = (studentId) =>
    request.get(`/api/students/${studentId}/applications`);

export const removeProgramFromStudent = (programId, studentId) =>
    request.delete(`/api/students/${studentId}/applications/${programId}`);
export const ToggleProgramStatus = (studentId, program_id) =>
    request.put(`/api/students/${studentId}/${program_id}`);

export const downloadProfile = (category, studentId) =>
    request.get(`/api/students/${studentId}/files/${category}`, {
        responseType: 'blob'
    });

export const getPdfV2 = ({ apiPath }) =>
    getDataBlob(apiPath, {
        responseType: 'blob'
    });

export const uploadforstudentV2 = ({ category, studentId, formData }) =>
    postData(`/api/students/${studentId}/files/${category}`, formData);

export const getStudentAndDocLinks = (studentId) =>
    request.get(`/api/students/doc-links/${studentId}`);

export const getStudentsAndDocLinks2 = () => getData(`/api/students/doc-links`);

export const updateDocumentationHelperLink = (link, key, category) =>
    request.post(`/api/students/doc-links`, { link, key, category });

export const deleteFileV2 = ({ category, studentId }) =>
    deleteData(`/api/students/${studentId}/files/${category}`);

export const uploadVPDforstudentV2 = ({
    studentId,
    program_id,
    data,
    fileType
}) =>
    postData(`/api/students/${studentId}/vpd/${program_id}/${fileType}`, data);

export const deleteVPDFile = (studentId, program_id, fileType) =>
    request.delete(`/api/students/${studentId}/vpd/${program_id}/${fileType}`);

export const deleteVPDFileV2 = ({ studentId, program_id, fileType }) =>
    deleteData(`/api/students/${studentId}/vpd/${program_id}/${fileType}`);

export const SetAsNotNeeded = (studentId, program_id) =>
    request.put(`/api/students/${studentId}/vpd/${program_id}/VPD`);

export const SetAsNotNeededV2 = ({ studentId, program_id }) =>
    putData(`/api/students/${studentId}/vpd/${program_id}/VPD`);

// export const SetUniAssistPaid = (studentId, program_id, isPaid) =>
//   request.post(`/api/students/${studentId}/vpd/${program_id}/payments`, {
//     isPaid
//   });

export const SetUniAssistPaidV2 = ({ studentId, program_id, isPaid }) =>
    postData(`/api/students/${studentId}/vpd/${program_id}/payments`, {
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

export const updateProfileDocumentStatusV2 = ({
    category,
    student_id,
    status,
    feedback
}) =>
    postData(`/api/students/${student_id}/${category}/status`, {
        status,
        feedback
    });

// Account APIs
export const getTemplates = () => request.get(`/api/account/files/template`);
export const uploadtemplate = (category, data) =>
    request.post(`/api/account/files/template/${category}`, data);
export const deleteTemplateFile = (category) =>
    request.delete(`/api/account/files/template/${category}`);
export const getTemplateDownload = (category) =>
    request.get(`/api/account/files/template/${category}`, {
        responseType: 'blob'
    });
export const WidgetTranscriptanalyser = (
    category,
    language,
    courses,
    table_data_string_taiger_guided
) =>
    request.post(`/api/widgets/transcript/${category}/${language}`, {
        courses,
        table_data_string_taiger_guided
    });
export const WidgetTranscriptanalyserV2 = (language, courses, requirementIds) =>
    request.post(`/api/widgets/transcript/engine/v2/${language}`, {
        courses,
        requirementIds
    });

export const WidgetanalyzedFileDownload = (adminId) =>
    request.get(`/api/widgets/transcript/${adminId}`, {
        responseType: 'blob'
    });

export const WidgetanalyzedFileV2Download = (adminId) =>
    request.get(`/api/widgets/transcript/v2/${adminId}`);

export const WidgetExportMessagePDF = (student_id) =>
    request.get(`/api/widgets/messages/export/${student_id}`, {
        responseType: 'blob'
    });

export const transcriptanalyser_test = (studentId, category, language) =>
    request.post(
        `/api/courses/transcript/${studentId}/${category}/${language}`
    );

export const transcriptanalyser_testV2 = ({
    language,
    studentId,
    requirementIds
}) =>
    request.post(`/api/courses/transcript/v2/${studentId}/${language}`, {
        requirementIds
    });

export const analyzedFileDownload_test = (studentId) =>
    request.get(`/api/courses/transcript/${studentId}`, {
        responseType: 'blob'
    });
export const analyzedFileV2Download = (user_id) =>
    request.get(`/api/courses/transcript/v2/${user_id}`);

export const getCourseKeywordSets = () => request.get(`/api/course-keywords`);
export const getCourseKeywordSet = (keywordsSetId) =>
    request.get(`/api/course-keywords/${keywordsSetId}`);
export const postKeywordSet = (keywordsSet) =>
    request.post('/api/course-keywords/new', keywordsSet);
export const putKeywordSet = (keywordsSetId, keywordsSet) =>
    request.put(`/api/course-keywords/${keywordsSetId}`, keywordsSet);
export const deleteKeywordSet = (keywordsSetId) =>
    request.delete(`/api/course-keywords/${keywordsSetId}`);

// Courses DB
export const getAllCourses = () => getData(`/api/all-courses`);
export const getCourse = ({ courseId }) =>
    getData(`/api/all-courses/${courseId}`);
export const updateCourse = ({ courseId, payload }) =>
    putData(`/api/all-courses/${courseId}`, payload);
export const deleteCourse = ({ courseId }) =>
    deleteData(`/api/all-courses/${courseId}`);
export const createCourse = ({ payload }) =>
    postData(`/api/all-courses`, payload);

export const getProgramRequirements = () =>
    request.get(`/api/program-requirements`);

export const getProgramRequirementsV2 = () =>
    getData(`/api/program-requirements`);

export const postProgramRequirements = (payload) =>
    request.post(`/api/program-requirements/new`, payload);
export const getProgramsAndCourseKeywordSets = () =>
    request.get(`/api/program-requirements/programs-and-keywords`);
export const getProgramRequirement = (programRequirementId) =>
    request.get(`/api/program-requirements/${programRequirementId}`);
export const putProgramRequirement = (programRequirementId, payload) =>
    request.put(`/api/program-requirements/${programRequirementId}`, payload);
export const deleteProgramRequirement = (programRequirementId) =>
    request.delete(`/api/program-requirements/${programRequirementId}`);

export const UpdateStudentApplications = (
    studentId,
    applications,
    applying_program_count
) =>
    request.put(`/api/account/applications/${studentId}`, {
        applications,
        applying_program_count
    });

export const updateStudentApplicationResult = (
    studentId,
    programId,
    result,
    data
) =>
    request.post(
        `/api/account/applications/result/${studentId}/${programId}/${result}`,
        data
    );

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

export const getCheckDocumentPatternIsPassed = (thread_id, file_type) =>
    request.get(
        `/api/document-threads/pattern/check/${thread_id}/${file_type}`
    );

export const getAllCVMLRLOverview = () =>
    request.get(`/api/document-threads/overview/all`);

export const getMyStudentThreadMetrics = () =>
    request.get(`/api/document-threads/overview/my-student-metrics`);

export const getThreadsByStudent = (studentId) =>
    request.get(`/api/document-threads/student-threads/${studentId}`);

export const getCVMLRLOverview = () =>
    request.get(`/api/document-threads/overview`);

export const SetFileAsFinal = (documentsthreadId, studentId, program_id) =>
    request.put(`/api/document-threads/${documentsthreadId}/${studentId}`, {
        program_id
    });

export const updateEssayWriter = (editor_id, documentsthreadId) =>
    request.post(`/api/document-threads/${documentsthreadId}/essay`, editor_id);

export const getAllActiveEssays = () =>
    request.get(`/api/document-threads/essays/all`);

export const putThreadFavorite = (documentsthreadId) =>
    request.put(`/api/document-threads/${documentsthreadId}/favorite`);

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
export const putMycourses = (student_id, locked) =>
    request.put(`/api/courses/${student_id}`, locked);

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
export const getProgramsV2 = () => getData('/api/programs');
export const getDistinctSchools = () => request.get('/api/programs/schools');
export const updateSchoolAttributes = (schoolAttributes) =>
    request.put('/api/programs/schools', schoolAttributes);

export const getProgram = (programId) =>
    request.get(`/api/programs/${programId}`);

export const getProgramV2 = (programId) =>
    getData(`/api/programs/${programId}`);

export const deleteProgram = (programId) =>
    request.delete(`/api/programs/${programId}`);

export const deleteProgramV2 = ({ program_id }) =>
    deleteData(`/api/programs/${program_id}`);

export const createProgram = (program) =>
    request.post('/api/programs', program);

export const createProgramV2 = ({ program }) =>
    postData('/api/programs', program);

export const updateProgram = (program) =>
    request.put(`/api/programs/${program._id}`, program);

export const updateProgramV2 = ({ program }) =>
    putData(`/api/programs/${program._id}`, program);

export const getProgramChangeRequests = (programId) =>
    request.get(`/api/programs/${programId}/change-requests`);

export const reviewProgramChangeRequests = (requestId) =>
    request.post(`/api/programs/review-changes/${requestId}`);

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

export const putOriginAuthorConfirmedByStudent = (
    documentsthreadId,
    studentId,
    checked
) =>
    request.put(
        `/api/document-threads/${documentsthreadId}/${studentId}/origin-author`,
        {
            checked
        }
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
export const getMyCommunicationThreadV2 = () =>
    getData('/api/communications/all');
export const getCommunicationThread = (studentId) =>
    request.get(`/api/communications/${studentId}`);
export const getCommunicationThreadV2 = ({ studentId }) =>
    getData(`/api/communications/${studentId}`);
export const loadCommunicationThread = (studentId, pageNumber) =>
    request.get(`/api/communications/${studentId}/pages/${pageNumber}`);
export const postCommunicationThreadV2 = ({ studentId, formData }) =>
    postData(`/api/communications/${studentId}`, formData);
export const updateAMessageInCommunicationThreadV2 = ({
    communication_id,
    communication_messageId,
    message
}) =>
    putData(
        `/api/communications/${communication_id}/${communication_messageId}`,
        { message }
    );
export const deleteAMessageInCommunicationThread = (
    student_id,
    communication_messageId
) =>
    request.delete(
        `/api/communications/${student_id}/${communication_messageId}`
    );

export const deleteAMessageInCommunicationThreadV2 = ({
    student_id,
    communication_messageId
}) =>
    deleteData(`/api/communications/${student_id}/${communication_messageId}`);

export const IgnoreMessage = (
    student_id,
    communication_messageId,
    message,
    ignoreMessageState
) =>
    request.put(
        `/api/communications/${student_id}/${communication_messageId}/${ignoreMessageState}/ignore`,
        message
    );

export const IgnoreMessageV2 = ({
    student_id,
    communication_messageId,
    message,
    ignoreMessageState
}) =>
    putData(
        `/api/communications/${student_id}/${communication_messageId}/${ignoreMessageState}/ignore`,
        message
    );

export const getSurveyInputs = (documentsthreadId) =>
    request.get(`/api/document-threads/${documentsthreadId}/survey-inputs`);

export const putSurveyInput = (surveyId, input, informEditor) =>
    request.put(`/api/document-threads/survey-input/${surveyId}`, {
        input,
        informEditor
    });

export const postSurveyInput = (input, informEditor) =>
    request.post(`/api/document-threads/survey-input/`, {
        input,
        informEditor
    });

export const resetSurveyInput = (surveyId) =>
    request.delete(`/api/document-threads/survey-input/${surveyId}`);

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

export const IgnoreMessageThread = (
    documentThreadId,
    documentsthreadMessageId,
    documentsthreadMessage,
    ignoreMessageState
) =>
    request.put(
        `/api/document-threads/${documentThreadId}/${documentsthreadMessageId}/${ignoreMessageState}/ignored`,
        documentsthreadMessage
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
    request.post(`/api/account/survey/university/${student_id}`, {
        university
    });
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
export const getActiveEventsNumber = () => request.get(`/api/events/ping`);
export const getAllEvents = () => request.get(`/api/events/all`);
export const getEvents = ({ startTime, endTime }) =>
    request.get(`/api/events?startTime=${startTime}&endTime=${endTime}`);
export const postEvent = (event) => request.post(`/api/events`, event);
export const confirmEvent = (event_id, updated_event) =>
    request.put(`/api/events/${event_id}/confirm`, updated_event);
export const updateEvent = (event_id, updated_event) =>
    request.put(`/api/events/${event_id}`, updated_event);
export const deleteEvent = (event_id) =>
    request.delete(`/api/events/${event_id}`);
export const updateOfficehours = (user_id, officehours, timezone) =>
    request.put(`/api/account/profile/officehours/${user_id}`, {
        officehours,
        timezone
    });

// Teams
export const getTeamMembers = () => request.get('/api/teams');
export const getStatisticsV2 = () => getData('/api/teams/statistics');
export const getResponseIntervalByStudent = (studentId) =>
    request.get(`/api/teams/response-interval/${studentId}`);

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
export const updateUserAttribute = (user_id, payload) =>
    request.post(`/api/users/${user_id}`, payload);

//Personal Data:
export const updatePersonalData = (user_id, personaldata) =>
    request.post(`/api/account/profile/${user_id}`, { personaldata });

export const updateCredentials = (credentials, email, password) =>
    request.post(`/api/account/credentials`, { credentials, email, password });

//TaiGer AI:
export const processProgramListAi = (programId) =>
    request.get(`/api/taigerai/program/${programId}`);
export const TaiGerAiGeneral = (prompt) =>
    request.post(`/api/taigerai/general`, {
        prompt
    });
export const TaiGerAiGeneral2 = (prompt) =>
    fetch(`${BASE_URL}/api/taigerai/general`, {
        method: 'post', // HTTP POST to send query to server
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'text/event-stream' // indicates what the server actually sent
        },
        credentials: 'include',
        body: JSON.stringify({ prompt }) // server is expecting JSON
    });

export const TaiGerChatAssistant = (prompt, studentId) =>
    fetch(`${BASE_URL}/api/taigerai/chat/${studentId}`, {
        method: 'post', // HTTP POST to send query to server
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'text/event-stream' // indicates what the server actually sent
        },
        credentials: 'include',
        body: JSON.stringify({ prompt }) // server is expecting JSON
    });

export const cvmlrlAi2 = (prompt) =>
    fetch(`${BASE_URL}/api/taigerai/cvmlrl`, {
        method: 'post', // HTTP POST to send query to server
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'text/event-stream' // indicates what the server actually sent
        },
        credentials: 'include',
        body: JSON.stringify(prompt) // server is expecting JSON
    });
// export const cvmlrlAi2 = (
//   student_input,
//   document_requirements = '',
//   editor_requirements = '',
//   student_id = '',
//   program_full_name = '',
//   file_type = ''
// ) =>
//   request.post(`/api/taigerai/cvmlrl`, {
//     student_input,
//     document_requirements,
//     editor_requirements,
//     student_id,
//     program_full_name,
//     file_type
//   });
export const cvmlrlAi = (
    student_input,
    document_requirements = '',
    editor_requirements = '',
    student_id = '',
    program_full_name = '',
    file_type = ''
) =>
    request.post(`/api/taigerai/cvmlrl`, {
        student_input,
        document_requirements,
        editor_requirements,
        student_id,
        program_full_name,
        file_type
    });

//Interview:
export const getAllInterviews = () => request.get('/api/interviews');
export const getInterview = (interview_id) =>
    request.get(`/api/interviews/${interview_id}`);
export const deleteInterview = (interview_id) =>
    request.delete(`/api/interviews/${interview_id}`);
export const updateInterview = (interview_id, payload) =>
    request.put(`/api/interviews/${interview_id}`, payload);
export const updateInterviewSurvey = (interview_id, payload) =>
    request.put(`/api/interviews/${interview_id}/survey`, payload);
export const getInterviewSurvey = (interview_id) =>
    request.get(`/api/interviews/${interview_id}/survey`);
export const getMyInterviews = () =>
    request.get(`/api/interviews/my-interviews`);
export const createInterview = (program_id, student_id, payload) =>
    request.post(`/api/interviews/create/${program_id}/${student_id}`, payload);
export const addInterviewTrainingDateTime = (interview_id, payload) =>
    request.post(`/api/interviews/time/${interview_id}`, payload);
export const SetInterviewAsFinal = (interview_id) =>
    request.post(`/api/interviews/status/${interview_id}`);

// Program feedback Ticket
export const createProgramReport = (program_id, description, type) =>
    request.post(`/api/tickets/`, { program_id, description, type });
export const getProgramTicket = (type, program_id) =>
    request.get(`/api/tickets?type=${type}&program_id=${program_id}`);
export const updateProgramTicket = (ticket_id, updatedTicket) =>
    request.put(`/api/tickets/${ticket_id}`, updatedTicket);
export const deleteProgramTicket = (ticket_id) =>
    request.delete(`/api/tickets/${ticket_id}`);
export const getProgramTickets = (type, status) =>
    request.get(`/api/tickets?type=${type}&status=${status}`);
export const getProgramTicketsV2 = ({ type, status }) =>
    getData(`/api/tickets?type=${type}&status=${status}`);

// Complaint
export const createComplaintTicket = (ticket) =>
    request.post(`/api/complaints/`, { ticket });
export const getComplaintsTicket = (ticketId) =>
    request.get(`/api/complaints/${ticketId}`);
export const getComplaintsTickets = (type) =>
    request.get(`/api/complaints?type=${type}`);
export const updateComplaintsTicket = (ticketId, updatedTicket) =>
    request.put(`/api/complaints/${ticketId}`, updatedTicket);
export const deleteComplaintsTicket = (ticketId) =>
    request.delete(`/api/complaints/${ticketId}`);
export const submitMessageInTicketWithAttachment = (
    ticketId,
    studentId,
    newFile
) =>
    request.post(
        `/api/complaints/new-message/${ticketId}/${studentId}`,
        newFile
    );
export const deleteAMessageinTicket = (ticketId, message_id) =>
    request.delete(`/api/complaints/${ticketId}/${message_id}`);

// Log:
export const getUsersLog = () => request.get(`/api/userlogs`);
export const getUserLog = (user_id) => request.get(`/api/userlogs/${user_id}`);
