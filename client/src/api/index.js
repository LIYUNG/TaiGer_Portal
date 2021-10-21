import request from "./request";

// TODO: organize to different files

// TODO: replace auth APIs
export const login = (credentials) => request.post("/auth/login", credentials);

export const register = (credentials) => request.post("/register", credentials);

// User APIs
export const getUsers = () => request.get("/users");

export const deleteUser = (id) => request.delete(`/users/${id}`);

export const updateUser = (user) => request.post(`/users/${user._id}`, user);

export const changeUserRole = (id, role) => updateUser({ _id: id, role });

export const getAgents = () => request.get("/agents");

export const getEditors = () => request.get("/editors");

export const getStudents = () => request.get("/students");

// Student APIs
export const updateAgents = (id, agents) =>
  request.post(`/students/${id}/agents`, agents);

export const updateEditors = (id, editors) =>
  request.post(`/students/${id}/editors`, editors);

export const assignProgramToStudent = (studentId, programId) =>
  request.post(`/students/${studentId}/programs`, programId);

export const removeProgramFromStudent = (programId, studentId) =>
  request.delete(`/students/${studentId}/programs/${programId}`);

export const download = (category, studentId) =>
  request.get(`/students/${studentId}/files/${category}`, {
    responseType: "blob",
  });

export const uploadforstudent = (category, studentId, data) =>
  request.post(`/students/${studentId}/files/${category}`, data);

export const acceptDocument = (category, studentId) =>
  request.post(`/students/${studentId}/files/${category}/status`, {
    status: "checked",
  });

export const rejectDocument = (category, studentId) =>
  request.post(`/students/${studentId}/files/${category}/status`, {
    status: "unaccepted",
  });

export const deleteFile = (category, studentId) =>
  request.delete(`/students/${studentId}/files/${category}`);

// Account APIs
export const getMyfiles = () => request.get("/account/files");

export const templateDownload = (category) =>
  request.get(`/account/files/${category}`, { responseType: "blob" });

export const upload = (category, data) =>
  request.post(`/account/files/${category}`, data);

export const transcriptanalyser = (category, group, data) =>
  request.post(`/account/transcript/${category}/${group}`, data);

export const generatedFileDownload = (category, filename) =>
  request.get(`/account/download/${category}/${filename}`, {
    responseType: "blob",
  });

// Program APIs
export const getPrograms = () => request.get("/programs");

export const deleteProgram = (id) => request.delete(`/programs/${id}`);

export const createProgram = (program) => request.post("/programs", program);

export const updateProgram = (program) =>
  request.post(`/programs/${program._id}`, program);

// Docs APIs
export const deleteDoc = (id) => request.delete(`/docs/${id}`);
export const addDoc = (id) => request.post(`/docs/${id}`);
export const updateDoc = (id, doc_temp) =>
  request.post(`/docs/${id}`, doc_temp);

export const createArticle = (article) => request.post("/docs", article);

export const updateArticle = (id, article) =>
  request.post(`/docs/${id}`, article);

const getArticle = (type) => request.get(`/docs/${type}`);

export const getApplicationArticle = () => getArticle("application");

export const getVisaArticle = () => getArticle("visa");

export const getUniassistArticle = () => getArticle("uniassist");

export const getCertificationArticle = () => getArticle("certification");
