import request from "./request";

// TODO: organize to different files

// TODO: replace auth APIs
export const login = (credentials) => request.post("/auth/login", credentials);

export const register = (credentials) => request.post("/auth/signup", credentials);

// User APIs
export const getUsers = () => request.get("/api/users");

export const deleteUser = (id) => request.delete(`/api/users/${id}`);

export const updateUser = (user) => request.post(`/api/users/${user._id}`, user);

export const changeUserRole = (id, role) => updateUser({ _id: id, role });

export const getAgents = () => request.get("/api/agents");

export const getEditors = () => request.get("/api/editors");

export const getStudents = () => request.get("/api/students");

// Student APIs
export const updateAgents = (id, agents) =>
  request.post(`/api/students/${id}/agents`, agents);

export const updateEditors = (id, editors) =>
  request.post(`/api/students/${id}/editors`, editors);

export const assignProgramToStudent = (studentId, programId) =>
  request.post(`/api/students/${studentId}/programs`, programId);

export const removeProgramFromStudent = (programId, studentId) =>
  request.delete(`/api/students/${studentId}/programs/${programId}`);

export const download = (category, studentId) =>
  request.get(`/api/students/${studentId}/files/${category}`, {
    responseType: "blob",
  });

export const uploadforstudent = (category, studentId, data) =>
  request.post(`/api/students/${studentId}/files/${category}`, data);

export const acceptDocument = (category, studentId) =>
  request.post(`/api/students/${studentId}/files/${category}/status`, {
    status: "checked",
  });

export const rejectDocument = (category, studentId) =>
  request.post(`/api/students/${studentId}/files/${category}/status`, {
    status: "unaccepted",
  });

export const deleteFile = (category, studentId) =>
  request.delete(`/api/students/${studentId}/files/${category}`);

// Account APIs
export const getMyfiles = () => request.get("/api/account/files");

export const templateDownload = (category) =>
  request.get(`/api/account/files/${category}`, { responseType: "blob" });

export const upload = (category, data) =>
  request.post(`/api/account/files/${category}`, data);

export const transcriptanalyser = (category, group, data) =>
  request.post(`/api/account/transcript/${category}/${group}`, data);

export const generatedFileDownload = (category, filename) =>
  request.get(`/api/account/download/${category}/${filename}`, {
    responseType: "blob",
  });

// Program APIs
export const getPrograms = () => request.get("/api/programs");

export const deleteProgram = (id) => request.delete(`/api/programs/${id}`);

export const createProgram = (program) => request.post("/api/programs", program);

export const updateProgram = (program) =>
  request.post(`/api/programs/${program._id}`, program);

// Docs APIs
export const deleteDoc = (id) => request.delete(`/api/docs/${id}`);
export const addDoc = (id) => request.post(`/api/docs/${id}`);
export const updateDoc = (id, doc_temp) => request.post(`/api/docs/${id}`, doc_temp);

export const createArticle = (article) => request.post("/api/docs", article);

export const updateArticle = (id, article) => request.post(`/api/docs/${id}`, article);

const getArticle = (type) => request.get(`/api/docs/${type}`);

export const getApplicationArticle = () => getArticle("application");

export const getVisaArticle = () => getArticle("visa");

export const getUniassistArticle = () => getArticle("uniassist");

export const getCertificationArticle = () => getArticle("certification");
