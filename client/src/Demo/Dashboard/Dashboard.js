import React, { useEffect } from "react";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";

import avatar1 from "../../assets/images/user/avatar-1.jpg";
import avatar2 from "../../assets/images/user/avatar-2.jpg";
import avatar3 from "../../assets/images/user/avatar-3.jpg";
import AdminMainView from "./AdminDashboard/AdminMainView";
import AgentMainView from "./AgentDashboard/AgentMainView";
import EditorMainView from "./EditorDashboard/EditorMainView";
import StudentMainView from "./StudentDashboard/StudentMainView";
import GuestMainView from "./GuestDashboard/GuestMainView";
import {
  getStudents,
  uploadforstudent,
  download,
  removeProgramFromStudent,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors,
  acceptDocument,
  rejectDocument,
  deleteFile,
} from "../../api";

class Dashboard extends React.Component {
  state = {
    role: "",
    error: null,
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
  };

  componentDidMount() {
    console.log("default " + this.props.userId);
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

  onRejectFilefromstudent = (e, category, applicationId, studentId) => {
    //id == student id
    e.preventDefault();
    rejectDocument(category, applicationId, studentId).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      }
    );
  };

  onAcceptFilefromstudent = (e, category, applicationId, studentId) => {
    //id == student id
    e.preventDefault();
    acceptDocument(category, applicationId, studentId).then(
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
    removeProgramFromStudent(program_id, student_id).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  };

  onDeleteFilefromstudent = (e, category, id) => {
    e.preventDefault();
    deleteFile(category, id).then(
      (resp) => {},
      (error) => {}
    );
  };

  editAgent = (student) => {
    getAgents().then(
      (resp) => {
        const { data: agents } = resp.data; //get all agent
        const { agents: student_agents } = student;
        console.log(resp.data);

        const updateAgentList = agents.reduce(
          (prev, { _id }) => ({
            ...prev,
            [_id]: student_agents.indexOf(_id) > -1,
          }),
          {}
        );

        this.setState({ agent_list: agents, updateAgentList });
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
            [_id]: student_editors.indexOf(_id) > -1,
          }),
          {}
        );

        this.setState({ editor_list: editors, updateEditorList });
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
        this.setState({
          updateAgentList: [],
          isLoaded: false,
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
        this.setState({
          updateEditorList: [],
          isLoaded: false,
        });
      },
      (error) => {
        alert("UpdateEditorlist is failed.");
      }
    );
  };

  render() {
    const tabContent = (
      <Aux>
        <div className="media friendlist-box align-items-center justify-content-center m-b-20">
          <div className="m-r-10 photo-table">
            <a href={DEMO.BLANK_LINK}>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar1}
                alt="activity-user"
              />
            </a>
          </div>
          <div className="media-body">
            <h6 className="m-0 d-inline">Silje Larsen</h6>
            <span className="float-right d-flex  align-items-center">
              <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
              3784
            </span>
          </div>
        </div>
        <div className="media friendlist-box align-items-center justify-content-center m-b-20">
          <div className="m-r-10 photo-table">
            <a href={DEMO.BLANK_LINK}>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar2}
                alt="activity-user"
              />
            </a>
          </div>
          <div className="media-body">
            <h6 className="m-0 d-inline">Julie Vad</h6>
            <span className="float-right d-flex  align-items-center">
              <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
              3544
            </span>
          </div>
        </div>
        <div className="media friendlist-box align-items-center justify-content-center m-b-20">
          <div className="m-r-10 photo-table">
            <a href={DEMO.BLANK_LINK}>
              <img
                className="rounded-circle"
                style={{ width: "40px" }}
                src={avatar3}
                alt="activity-user"
              />
            </a>
          </div>
          <div className="media-body">
            <h6 className="m-0 d-inline">Storm Hanse</h6>
            <span className="float-right d-flex  align-items-center">
              <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
              2739
            </span>
          </div>
        </div>
      </Aux>
    );

    const { error, isLoaded } = this.state;
    if (error) {
      //TODO: put error page component for timeout
      localStorage.removeItem("token");
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      if (this.state.success) {
        if (this.props.role === "Admin") {
          return (
            <Aux>
              <Row>
                <Col sm={12}>
                  <AdminMainView
                    role={this.props.role}
                    success={this.state.success}
                    editAgent={this.editAgent}
                    editEditor={this.editEditor}
                    agent_list={this.state.agent_list}
                    editor_list={this.state.editor_list}
                    UpdateAgentlist={this.UpdateAgentlist}
                    startEditingEditor={this.startEditingEditor}
                    startEditingProgram={this.startEditingProgram}
                    students={this.state.students}
                    documentslist={window.documentlist}
                    agenttodolist={window.agenttodolist}
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
                  />
                </Col>
              </Row>
            </Aux>
          );
        } else if (this.props.role === "Agent") {
          return (
            <Aux>
              <Row>
                <Col sm={12}>
                  <AgentMainView
                    role={this.props.role}
                    success={this.state.success}
                    editAgent={this.editAgent}
                    editEditor={this.editEditor}
                    agent_list={this.state.agent_list}
                    editor_list={this.state.editor_list}
                    UpdateAgentlist={this.UpdateAgentlist}
                    startEditingEditor={this.startEditingEditor}
                    startEditingProgram={this.startEditingProgram}
                    students={this.state.students}
                    documentslist={window.documentlist}
                    agenttodolist={window.agenttodolist}
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
                  />
                </Col>
              </Row>
            </Aux>
          );
        } else if (this.props.role === "Editor") {
          return (
            <Aux>
              <Row>
                <Col sm={12}>
                  <EditorMainView
                    role={this.props.role}
                    success={this.state.success}
                    editAgent={this.editAgent}
                    editEditor={this.editEditor}
                    agent_list={this.state.agent_list}
                    editor_list={this.state.editor_list}
                    UpdateAgentlist={this.UpdateAgentlist}
                    startEditingEditor={this.startEditingEditor}
                    startEditingProgram={this.startEditingProgram}
                    students={this.state.students}
                    documentslist={window.documentlist}
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
                  />
                </Col>
              </Row>
            </Aux>
          );
        } else if (this.props.role === "Student") {
          return (
            <Aux>
              <Row>
                <Col sm={12}>
                  <StudentMainView
                    role={this.props.role}
                    success={this.state.success}
                    editAgent={this.editAgent}
                    editEditor={this.editEditor}
                    agent_list={this.state.agent_list}
                    editor_list={this.state.editor_list}
                    UpdateAgentlist={this.UpdateAgentlist}
                    startEditingEditor={this.startEditingEditor}
                    startEditingProgram={this.startEditingProgram}
                    students={this.state.students}
                    documentslist={window.documentlist}
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
                  />
                </Col>
              </Row>
            </Aux>
          );
        } else {
          return (
            <Aux>
              <Row>
                <Col sm={12}>
                  <Tabs defaultActiveKey="x" id="uncontrolled-tab-example">
                    <Tab eventKey="x" title="To Do list:">
                      <GuestMainView
                        role={this.props.role}
                        success={this.state.success}
                        editAgent={this.editAgent}
                        editEditor={this.editEditor}
                        agent_list={this.state.agent_list}
                        editor_list={this.state.editor_list}
                        UpdateAgentlist={this.UpdateAgentlist}
                        startEditingEditor={this.startEditingEditor}
                        startEditingProgram={this.startEditingProgram}
                        students={this.state.students}
                        documentslist={window.documentlist}
                        startUploadfile={this.startUploadfile}
                        onDeleteProgram={this.onDeleteProgram}
                        onDownloadFilefromstudent={
                          this.onDownloadFilefromstudent
                        }
                        onRejectFilefromstudent={this.onRejectFilefromstudent}
                        onAcceptFilefromstudent={this.onAcceptFilefromstudent}
                        onDeleteFilefromstudent={this.onDeleteFilefromstudent}
                        updateAgentList={this.state.updateAgentList}
                        handleChangeAgentlist={this.handleChangeAgentlist}
                        submitUpdateAgentlist={this.submitUpdateAgentlist}
                        updateEditorList={this.state.updateEditorList}
                        handleChangeEditorlist={this.handleChangeEditorlist}
                        submitUpdateEditorlist={this.submitUpdateEditorlist}
                      />
                    </Tab>
                    <Tab eventKey="y" title="Agent and Editor"></Tab>
                  </Tabs>
                </Col>
              </Row>
            </Aux>
          );
        }
      } else {
        return (
          <Aux>
            <Row>
              <Col>
                <div>
                  {" "}
                  Error: Can not get data. Please refresh the page again!{" "}
                </div>
              </Col>
            </Row>
          </Aux>
        );
      }
    }
  }
}

export default Dashboard;
