import request from "./request";

// Student_API
export const getStudents = () => request.get("/studentlist");
export const getMyfiles = () => request.get("/upload");

// del_prog_std_API
export const removeProgramFromStudent = (programId, studentId) =>
  request.delete(`/deleteprogramfromstudent/${programId}/${studentId}`);

// edit_agent_API
export const getAgents = () => request.get("/editagent");

// update_agent_API
export const updateAgents = (id, agents) =>
  request.post(`/updateagent/${id}`, agents);

// edit_editor_API
export const getEditors = () => request.get("/editeditor");

// update_editor_API
export const updateEditors = (id, editors) =>
  request.post(`/updateeditor/${id}`, editors);

// accept_document_API, post data?
export const acceptDocument = (category, id) =>
  request.post(`/acceptdoc/${category}/${id}`);

// reject_document_API, post data?
export const rejectDocument = (category, id) =>
  request.post(`/rejectdoc/${category}/${id}`);

// delete
export const deleteFile = (category, id) =>
  request.delete(`/deletefile/${category}/${id}`);

// FIXME: The endpoint should be "/programs/:id"
// program_list_API
export const getPrograms = () => request.get("/programlist");

// delete_program_API
export const deleteProgram = (id) => request.delete(`/deleteprogram/${id}`);

// add_program_API
export const createProgram = (program) => request.post("/addprogram", program);

// edit_program_API
export const updateProgram = (program) =>
  request.post(`/editprogram/${program._id}`, program);

// assign_program_API
export const assignProgramToStudent = (data) =>
  request.post("/assignprogramtostudent", data);

export const getUsers = () => request.get("/userslist");

export const deleteUser = (id) => request.delete(`/deleteuser/${id}`);

export const updateUser = (user) => request.post(`/edituser/${user._id}`, user);

export const changeUserRole = (role) => request.post("/changeuserrole", role);

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
