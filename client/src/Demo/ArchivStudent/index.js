import React from "react";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
// import DEMO from "../../store/constant";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
import TabStudDocsDashboard from "../Dashboard/MainViewTab/StudDocsOverview/TabStudDocsDashboard";
// import Card from "../../App/components/MainCard";

import {
  getArchivStudents,
  updateArchivStudents,
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
    error: null,
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isArchivPage: true,
  };

  componentDidMount() {
    console.log(this.props.user);
    getArchivStudents().then(
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
      getArchivStudents().then(
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
        console.log("editAgent");
        console.log(resp.data);
        const updateAgentList = agents.reduce(
          (prev, { _id }) => ({
            ...prev,
            [_id]: student_agents ? student_agents.indexOf(_id) > -1 : false,
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
            [_id]: student_editors ? student_editors.indexOf(_id) > -1 : false,
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

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        console.log(resp.data);
        console.log("Archiv index.js rendered");
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
        return (
          <Aux>
            <Row>
              <Col>
                <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
                  <Tab eventKey="w" title="Archiv Student Overview">
                    {/* <Card title="Archiv Student"> */}
                    {this.props.user.role === "Admin" ||
                    this.props.user.role === "Agent" ||
                    this.props.user.role === "Editor" ? (
                      <TabStudDocsDashboard
                        role={this.props.user.role}
                        students={this.state.students}
                        editAgent={this.state.editAgent}
                        editEditor={this.state.editEditor}
                        documentslist={window.documentslist}
                        documentlist2={window.documentlist2}
                        agent_list={this.state.agent_list}
                        editor_list={this.state.editor_list}
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
                        updateStudentArchivStatus={
                          this.updateStudentArchivStatus
                        }
                        isArchivPage={this.state.isArchivPage}
                        SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
                      />
                    ) : (
                      <></>
                    )}
                    {/* </Card> */}
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Aux>
        );
      }
    }
  }
}

export default Dashboard;
