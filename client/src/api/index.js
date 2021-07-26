import request from "./request";

// Student_API
export const getStudents = () => request.get("/studentlist");

export const download = (category, id) =>
  request.get(`/download/${category}/${id}`);

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
export const deleteProgram = (id) => request.delete("/deleteprogram", id);

// add_program_API
export const createProgram = (program) => request.post("/addprogram", program);

// edit_program_API
export const updateProgram = (program) => request.post(`/editprogram/${program._id}`, program);

// assign_program_API
export const assignProgramToStudent = (data) => request.post("/assignprogramtostudent", data);

// window.upload = "http://localhost:3000/upload";
// window.download = "http://localhost:3000/download";
// window.New_Article = "http://localhost:3000/docs";
// window.Get_Article = "http://localhost:3000/docs";
// window.Update_Article = "http://localhost:3000/docs";

// window.login = "http://localhost:3000/login";
// window.register = "http://localhost:3000/register";
