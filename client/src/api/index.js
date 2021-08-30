import request from "./request";

// Student_API
export const getStudents = () => request.get("/students");
export const getAgents = () => request.get("/agents");
export const getEditors = () => request.get("/editors");

export const updateAgents = (id, agents) =>
  request.post(`/students/${id}/agents`, agents);

export const updateEditors = (id, editors) =>
  request.post(`/students/${id}/editors`, editors);

export const assignProgramToStudent = (studentId, programId) =>
  request.post(`/students/${studentId}/programs`, programId);

export const removeProgramFromStudent = (programId, studentId) =>
  request.delete(`/students/${studentId}/programs/${programId}`);

export const getMyfiles = () => request.get("/files");

// accept_document_API, post data?
export const acceptDocument = (category, id) =>
  request.post(`/acceptdoc/${category}/${id}`);

// reject_document_API, post data?
export const rejectDocument = (category, id) =>
  request.post(`/rejectdoc/${category}/${id}`);

// delete
export const deleteFile = (category, id) =>
  request.delete(`/deletefile/${category}/${id}`);

export const getPrograms = () => request.get("/programs");

export const deleteProgram = (id) => request.delete(`/programs/${id}`);

export const createProgram = (program) => request.post("/programs", program);

export const updateProgram = (program) =>
  request.post(`/programs/${program._id}`, program);

export const getUsers = () => request.get("/users");

export const deleteUser = (id) => request.delete(`/users/${id}`);

export const updateUser = (user) => request.post(`/users/${user._id}`, user);

export const changeUserRole = (id, role) => updateUser({ _id: id, role })

export const deleteDoc = (id) => request.delete(`/docs/${id}`);
export const addDoc = (id) => request.post(`/docs/${id}`);
export const updateDoc = (id, doc_temp) =>
  request.post(`/docs/${id}`, doc_temp);

// New_Article
export const createArticle = (article) => request.post("/docs", article);

// Update_Article
export const updateArticle = (id, article) =>
  request.post(`/docs/${id}`, article);

const getArticle = (type) => request.get(`/docs/${type}`);

// Get_Application_Article
export const getApplicationArticle = () => getArticle("application");

// Get_Visa_Article
export const getVisaArticle = () => getArticle("visa");

// Get_Uniassist_Article
export const getUniassistArticle = () => getArticle("uniassist");

// Get_Certification_Article
export const getCertificationArticle = () => getArticle("certification");

// download
export const download = (category, id) =>
  request.get(`/download/${category}/${id}`, { responseType: "blob" });

export const templateDownload = (category) =>
  request.get(`/download/${category}`, { responseType: "blob" });

// upload
export const upload = (id, data) => request.post(`/upload/${id}`, data);
export const uploadforstudent = (id, student_id, data) =>
  request.post(`/upload/${student_id}/${id}`, data);
// transcript analyser
export const transcriptanalyser = (category, id, data) =>
  request.post(`/transcriptanalyzer/${category}/${id}`, data);

export const generatedFileDownload = (category, filename) =>
  request.get(`/generatedfiledownload/${category}/${filename}`, {
    responseType: "blob",
  });

// TODO: replace below auth APIs
export const login = (credentials) => request.post("/login", credentials);

export const register = (credentials) => request.post("/register", credentials);
