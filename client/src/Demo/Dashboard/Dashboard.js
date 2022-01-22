import React from "react";
import { Row, Col, Tabs, Tab, Spinner } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
// import DEMO from "../../store/constant";
// import avatar1 from "../../assets/images/user/avatar-1.jpg";
// import avatar2 from "../../assets/images/user/avatar-2.jpg";
// import avatar3 from "../../assets/images/user/avatar-3.jpg";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
import AdminMainView from "./AdminDashboard/AdminMainView";
import AgentMainView from "./AgentDashboard/AgentMainView";
import EditorMainView from "./EditorDashboard/EditorMainView";
import StudentMainView from "./StudentDashboard/StudentMainView";
import GuestMainView from "./GuestDashboard/GuestMainView";
import {
  uploadforstudent,
  updateDocumentStatus,
  deleteFile,
  getStudents,
  updateArchivStudents,
  download,
  removeProgramFromStudent,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors,
  acceptDocument,
  rejectDocument,
} from "../../api";

class Dashboard extends React.Component {
  state = {
    error: null,
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: "",
  };

  componentDidMount() {
    console.log(this.props.user);
    getStudents().then(
      (resp) => {
        console.log(resp.data);
        console.log("Default.js rendered");
        const { data, success } = resp.data;
        this.setState({ isLoaded: true, students: data, success: success });
      },
      (error) => {
        console.log(error);
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getStudents().then(
        (resp) => {
          console.log("Default.js componentDidUpdate rendered");
          this.setState({
            isLoaded: true,
            students: resp.data.data,
            success: resp.data.success,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: true,
          });
        }
      );
    }
  }

  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    download(category, id).then(
      (resp) => {
        const actualFileName =
          resp.headers["content-disposition"].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split("."); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === "pdf") {
          console.log(blob);
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );

          //Open the URL on new Window
          console.log(url);
          window.open(url); //TODO: having a reasonable file name, pdf viewer
        } else {
          //if not pdf, download instead.

          const url = window.URL.createObjectURL(new Blob([blob]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", actualFileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      },
      (error) => {
        alert("The file is not available.");
      }
    );
  }

  onRejectFilefromstudent = (e, category, studentId) => {
    //id == student id
    // e.preventDefault();
    rejectDocument(category, studentId).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      }
    );
  };

  onAcceptFilefromstudent = (e, category, studentId) => {
    //id == student id
    // e.preventDefault();
    acceptDocument(category, studentId).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  };
  onDeleteProgram = (e, student_id, program_id) => {
    //program id
    e.preventDefault();
    var stds = this.state.students;
    var std_idx = stds.findIndex((stud) => stud._id === student_id);
    var applications = [...stds[std_idx].applications];
    let idx = applications.findIndex(
      (application) => application._id === program_id
    );
    if (idx !== -1) {
      applications.splice(idx, 1);
      stds[std_idx].applications = applications;
    }
    removeProgramFromStudent(program_id, student_id).then(
      (res) => {
        this.setState({
          students: stds,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  };

  // onDeleteFilefromstudent = (e, category, id) => {
  //   e.preventDefault();
  //   deleteFile(category, id).then(
  //     (resp) => {},
  //     (error) => {}
  //   );
  // };

  editAgent = (student) => {
    getAgents().then(
      (resp) => {
        const { data: agents } = resp.data; //get all agent
        const { agents: student_agents } = student;
        console.log("editAgent");
        console.log(resp.data);
        const updateAgentList = agents.reduce(
          (prev, { _id }) => ({
            ...prev,
            [_id]: student_agents
              ? student_agents.findIndex(
                  (student_agent) => student_agent._id === _id
                ) > -1
              : false,
          }),
          {}
        );

        this.setState((state) => ({
          ...state,
          agent_list: agents,
          updateAgentList,
        }));
      },
      (error) => {}
    );
  };

  editEditor = (student) => {
    getEditors().then(
      (resp) => {
        const { data: editors } = resp.data;
        const { editors: student_editors } = student;
        const updateEditorList = editors.reduce(
          (prev, { _id }) => ({
            ...prev,
            [_id]: student_editors
              ? student_editors.findIndex(
                  (student_editor) => student_editor._id === _id
                ) > -1
              : false,
          }),
          {}
        );

        this.setState((state) => ({
          ...state,
          editor_list: editors,
          updateEditorList,
        }));
      },
      (error) => {}
    );
  };

  handleChangeAgentlist = (e) => {
    const { value, checked } = e.target;
    console.log(value + " " + checked);
    this.setState((prevState) => ({
      updateAgentList: {
        ...prevState.updateAgentList,
        [value]: checked,
      },
    }));
  };

  handleChangeEditorlist = (e) => {
    const { value, checked } = e.target;
    console.log(value + " " + checked);
    this.setState((prevState) => ({
      updateEditorList: {
        ...prevState.updateEditorList,
        [value]: checked,
      },
    }));
  };

  submitUpdateAgentlist = (updateAgentList, student_id) => {
    console.log(updateAgentList + " " + student_id);
    this.UpdateAgentlist(updateAgentList, student_id);
  };

  submitUpdateEditorlist = (updateEditorList, student_id) => {
    console.log(updateEditorList + " " + student_id);
    this.UpdateEditorlist(updateEditorList, student_id);
  };

  UpdateAgentlist = (updateAgentList, student_id) => {
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        this.setState({
          students: data,
          updateAgentList: [],
          isLoaded: false,
          success: success,
        });
      },
      (error) => {
        alert("UpdateAgentlist is failed.");
      }
    );
  };

  UpdateEditorlist = (updateEditorList, student_id) => {
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        this.setState((state) => ({
          ...state,
          students: data,
          updateEditorList: [],
          isLoaded: false,
          success: success,
        }));
      },
      (error) => {
        alert("UpdateEditorlist is failed.");
      }
    );
  };

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        console.log(resp.data);
        console.log("Archiv index.js rendered");
        const { data, success } = resp.data;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          students: data,
          success: success,
        }));
      },
      (error) => {
        console.log(error);
        console.log(": " + error);
        this.setState({
          isLoaded: true,
          error: true,
        });
      }
    );
  };

  onFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };

  onSubmitFile = (e, category, student_id) => {
    if (this.state.file === "") {
      e.preventDefault();
      alert("Please select file");
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", this.state.file);

      let student_arrayidx = this.state.students.findIndex(
        (student) => student._id === student_id
      );

      uploadforstudent(category, student_id, formData).then(
        (res) => {
          let students = [...this.state.students];
          students[student_arrayidx] = res.data.data;
          console.log(students);
          this.setState({
            students: students, // res.data = {success: true, data:{...}}
            file: "",
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
    }
  };
  onDeleteFilefromstudent = (e, category, student_id) => {
    // TODO: delete this.state.student[document]
    console.log("onDeleteFilefromstudent AgentMainView.js");
    e.preventDefault();
    let student_arrayidx = this.state.students.findIndex(
      (student) => student._id === student_id
    );
    let student = this.state.students.find(
      (student) => student._id === student_id
    );
    let idx = student.profile.findIndex((doc) => doc.name === category);
    let students = [...this.state.students];
    // console.log(students);
    deleteFile(category, student_id).then(
      (res) => {
        students[student_arrayidx].profile[idx] = res.data.data;
        // std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
        this.setState({
          students: students,
        });
      },
      (error) => {}
    );
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();

    let student_arrayidx = this.state.students.findIndex(
      (student) => student._id === student_id
    );
    let student = this.state.students.find(
      (student) => student._id === student_id
    );
    let idx = student.profile.findIndex((doc) => doc.name === category);
    let students = [...this.state.students];

    console.log(students);
    // var std = { ...this.state.student };
    // console.log(std);
    updateDocumentStatus(category, student_id, status).then(
      (res) => {
        students[student_arrayidx] = res.data.data;
        // std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
        this.setState({
          students: students,
        });
      },
      (error) => {}
    );
  };

  render() {
    const { error, isLoaded } = this.state;
    let FILE_OK_SYMBOL = (
      <IoCheckmarkCircle size={18} color="limegreen" title="Valid Document" />
    );
    let FILE_NOT_OK_SYMBOL = (
      <AiFillCloseCircle size={18} color="red" title="Invalid Document" />
    );
    let FILE_UPLOADED_SYMBOL = (
      <AiOutlineFieldTime
        size={18}
        color="orange"
        title="Uploaded successfully"
      />
    );
    let FILE_MISSING_SYMBOL = (
      <AiFillQuestionCircle
        size={18}
        color="lightgray"
        title="No Document uploaded"
      />
    );
    let FILE_DONT_CARE_SYMBOL = (
      <BsDash size={18} color="lightgray" title="Not needed" />
    );
    let SYMBOL_EXPLANATION = (
      <>
        <p></p>
        <p>
          {FILE_OK_SYMBOL}: The document is valid and can be used in the
          application.
        </p>
        <p>
          {FILE_NOT_OK_SYMBOL}: The document is invalud and cannot be used in
          the application. Please properly scan a new one.
        </p>
        <p>
          {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will
          check it as soon as possible.
        </p>
        <p>{FILE_MISSING_SYMBOL}: Please upload the copy of the document.</p>
        <p>{FILE_DONT_CARE_SYMBOL}: This document is not needed.</p>
      </>
    );
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    if (!isLoaded && !this.state.data) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    } else {
      if (this.props.user.role === "Admin") {
        return (
          <Aux>
            <AdminMainView
              role={this.props.user.role}
              editAgent={this.editAgent}
              editEditor={this.editEditor}
              agent_list={this.state.agent_list}
              editor_list={this.state.editor_list}
              UpdateAgentlist={this.UpdateAgentlist}
              students={this.state.students}
              documentslist={window.documentlist}
              documentlist2={window.documentlist2}
              agenttodolist={window.agenttodolist}
              onFileChange={this.onFileChange}
              onSubmitFile={this.onSubmitFile}
              onDeleteFilefromstudent={this.onDeleteFilefromstudent}
              onUpdateProfileDocStatus={this.onUpdateProfileDocStatus}
              documentsprogresslist={window.documentsprogresslist}
              programstatuslist={window.programstatuslist}
              startUploadfile={this.startUploadfile}
              onDeleteProgram={this.onDeleteProgram}
              onDownloadFilefromstudent={this.onDownloadFilefromstudent}
              onRejectFilefromstudent={this.onRejectFilefromstudent}
              onAcceptFilefromstudent={this.onAcceptFilefromstudent}
              updateAgentList={this.state.updateAgentList}
              handleChangeAgentlist={this.handleChangeAgentlist}
              submitUpdateAgentlist={this.submitUpdateAgentlist}
              updateEditorList={this.state.updateEditorList}
              handleChangeEditorlist={this.handleChangeEditorlist}
              submitUpdateEditorlist={this.submitUpdateEditorlist}
              SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
              updateStudentArchivStatus={this.updateStudentArchivStatus}
              isDashboard={this.state.isDashboard}
            />
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Aux>
        );
      } else if (this.props.user.role === "Agent") {
        return (
          <Aux>
            <AgentMainView
              role={this.props.user.role}
              UpdateAgentlist={this.UpdateAgentlist}
              students={this.state.students}
              documentslist={window.documentlist}
              documentlist2={window.documentlist2}
              agenttodolist={window.agenttodolist}
              documentsprogresslist={window.documentsprogresslist}
              programstatuslist={window.programstatuslist}
              startUploadfile={this.startUploadfile}
              onFileChange={this.onFileChange}
              onSubmitFile={this.onSubmitFile}
              onDeleteFilefromstudent={this.onDeleteFilefromstudent}
              onUpdateProfileDocStatus={this.onUpdateProfileDocStatus}
              onDeleteProgram={this.onDeleteProgram}
              onDownloadFilefromstudent={this.onDownloadFilefromstudent}
              onRejectFilefromstudent={this.onRejectFilefromstudent}
              onAcceptFilefromstudent={this.onAcceptFilefromstudent}
              updateAgentList={this.state.updateAgentList}
              handleChangeAgentlist={this.handleChangeAgentlist}
              submitUpdateAgentlist={this.submitUpdateAgentlist}
              updateEditorList={this.state.updateEditorList}
              handleChangeEditorlist={this.handleChangeEditorlist}
              submitUpdateEditorlist={this.submitUpdateEditorlist}
              SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
              updateStudentArchivStatus={this.updateStudentArchivStatus}
              isDashboard={this.state.isDashboard}
            />
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Aux>
        );
      } else if (this.props.user.role === "Editor") {
        return (
          <Aux>
            <EditorMainView
              role={this.props.user.role}
              editAgent={this.editAgent}
              editEditor={this.editEditor}
              agent_list={this.state.agent_list}
              editor_list={this.state.editor_list}
              UpdateAgentlist={this.UpdateAgentlist}
              students={this.state.students}
              documentslist={window.documentlist}
              documentlist2={window.documentlist2}
              documentsprogresslist={window.documentsprogresslist}
              programstatuslist={window.programstatuslist}
              startUploadfile={this.startUploadfile}
              onDeleteProgram={this.onDeleteProgram}
              onDownloadFilefromstudent={this.onDownloadFilefromstudent}
              onRejectFilefromstudent={this.onRejectFilefromstudent}
              onAcceptFilefromstudent={this.onAcceptFilefromstudent}
              onDeleteFilefromstudent={this.onDeleteFilefromstudent}
              updateAgentList={this.state.updateAgentList}
              handleChangeAgentlist={this.handleChangeAgentlist}
              submitUpdateAgentlist={this.submitUpdateAgentlist}
              updateEditorList={this.state.updateEditorList}
              handleChangeEditorlist={this.handleChangeEditorlist}
              submitUpdateEditorlist={this.submitUpdateEditorlist}
              SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
              updateStudentArchivStatus={this.updateStudentArchivStatus}
              isDashboard={this.state.isDashboard}
            />
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Aux>
        );
      } else if (this.props.user.role === "Student") {
        return (
          <Aux>
            <StudentMainView
              role={this.props.user.role}
              editAgent={this.editAgent}
              editEditor={this.editEditor}
              agent_list={this.state.agent_list}
              editor_list={this.state.editor_list}
              UpdateAgentlist={this.UpdateAgentlist}
              students={this.state.students}
              documentslist={window.documentlist}
              documentlist2={window.documentlist2}
              documentsprogresslist={window.documentsprogresslist}
              programstatuslist={window.programstatuslist}
              startUploadfile={this.startUploadfile}
              onDeleteProgram={this.onDeleteProgram}
              onDownloadFilefromstudent={this.onDownloadFilefromstudent}
              onRejectFilefromstudent={this.onRejectFilefromstudent}
              onAcceptFilefromstudent={this.onAcceptFilefromstudent}
              onDeleteFilefromstudent={this.onDeleteFilefromstudent}
              updateAgentList={this.state.updateAgentList}
              handleChangeAgentlist={this.handleChangeAgentlist}
              submitUpdateAgentlist={this.submitUpdateAgentlist}
              updateEditorList={this.state.updateEditorList}
              handleChangeEditorlist={this.handleChangeEditorlist}
              submitUpdateEditorlist={this.submitUpdateEditorlist}
              SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
            />
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Aux>
        );
      } else {
        return (
          <Aux>
            <GuestMainView
              role={this.props.user.role}
              success={this.state.success}
              editAgent={this.editAgent}
              editEditor={this.editEditor}
              agent_list={this.state.agent_list}
              editor_list={this.state.editor_list}
              UpdateAgentlist={this.UpdateAgentlist}
              students={this.state.students}
              documentslist={window.documentlist}
              startUploadfile={this.startUploadfile}
              onDeleteProgram={this.onDeleteProgram}
              onDownloadFilefromstudent={this.onDownloadFilefromstudent}
              onRejectFilefromstudent={this.onRejectFilefromstudent}
              onAcceptFilefromstudent={this.onAcceptFilefromstudent}
              onDeleteFilefromstudent={this.onDeleteFilefromstudent}
              updateAgentList={this.state.updateAgentList}
              handleChangeAgentlist={this.handleChangeAgentlist}
              submitUpdateAgentlist={this.submitUpdateAgentlist}
              updateEditorList={this.state.updateEditorList}
              handleChangeEditorlist={this.handleChangeEditorlist}
              submitUpdateEditorlist={this.submitUpdateEditorlist}
              SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
            />

            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Aux>
        );
      }
    }
  }
}

export default Dashboard;
