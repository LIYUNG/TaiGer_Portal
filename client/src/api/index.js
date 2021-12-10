import request from "./request";

// TODO: organize to different files

// TODO: replace auth APIs
export const login = (credentials) => request.post("/auth/login", credentials);

export const logout = () => request.get("/auth/logout");

export const register = (credentials) =>
  request.post("/auth/signup", credentials);

export const verify = () => request.get("/auth/verify");

// User APIs
export const getUsers = () => request.get("/api/users");

export const deleteUser = (id) => request.delete(`/api/users/${id}`);

export const updateUser = (user) => request.put(`/api/users/${user._id}`, user);

export const changeUserRole = (id, role) => updateUser({ _id: id, role });

export const getAgents = () => request.get("/api/agents");

export const getEditors = () => request.get("/api/editors");

export const getStudents = () => request.get(`/api/students`);

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

export const download = (category, studentId) =>
  request.get(`/api/students/${studentId}/files/${category}`, {
    responseType: "blob",
  });

export const uploadforstudent = (category, studentId, data) =>
  request.post(`/api/students/${studentId}/files/${category}`, data);

export const acceptDocument = (category, applicationId, studentId) =>
  request.post(
    `/api/students/${studentId}/applications/${applicationId}/${category}/status`,
    {
      status: "checked",
    }
  );

export const rejectDocument = (category, applicationId, studentId) =>
  request.post(
    `/api/students/${studentId}/applications/${applicationId}/${category}/status`,
    {
      status: "unaccepted",
    }
  );

export const deleteFile = (category, studentId) =>
  request.delete(`/api/students/${studentId}/files/${category}`);

// Account APIs
export const getMyfiles = (studentId) =>
  request.get(`/api/account/${studentId}/files`);

export const templateDownload = (category) =>
  request.get(`/api/account/files/${category}`, { responseType: "blob" });

export const upload = (studentId, docName, data) =>
  request.post(`/api/account/files/${studentId}/${docName}`, data);

export const transcriptanalyser = (category, group, data) =>
  request.post(`/api/account/transcript/${category}/${group}`, data);

export const generatedFileDownload = (category, filename) =>
  request.get(`/api/account/download/${category}/${filename}`, {
    responseType: "blob",
  });

// Program APIs
export const getPrograms = () => request.get("/api/programs");

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
