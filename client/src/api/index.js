import request from './request'

// Student_API
export const getStudents = () => request.get('/studentlist')

export const download = (category, id) => request.get(`/download/${category}/${id}`)

// del_prog_std_API
export const deleteProgram = () => request.delete('/deleteprogramfromstudent')

// edit_agent_API
export const getAgents = () => request.get('/editagent')

// update_agent_API
export const updateAgents = (id, agents) => request.post(`/updateagent/${id}`, agents)

// edit_editor_API
export const getEditors = () => request.get('/editeditor')

// update_editor_API
export const updateEditors = (id, editors) => request.post(`/updateeditor/${id}`, editors)

// accept_document_API, post data?
export const acceptDocument = (category, id) => request.post(`/acceptdoc/${category}/${id}`)

// window.reject_document_API = "http://localhost:3000/rejectdoc";
// window.login = "http://localhost:3000/login";
// window.register = "http://localhost:3000/register";
// window.program_list_API = "http://localhost:3000/programlist";
// window.delete_program_API = "http://localhost:3000/deleteprogram";
// window.add_program_API = "http://localhost:3000/addprogram";
// window.edit_program_API = "http://localhost:3000/editprogram";
// window.assign_program_API = "http://localhost:3000/assignprogramtostudent";
// window.upload = "http://localhost:3000/upload";
// window.delete = "http://localhost:3000/deletefile";
// window.download = "http://localhost:3000/download";
// window.New_Article = "http://localhost:3000/docs";
// window.Get_Article = "http://localhost:3000/docs";
// window.Update_Article = "http://localhost:3000/docs";
