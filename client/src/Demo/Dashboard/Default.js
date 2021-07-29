import React from "react";
import { Row, Col, Card, Tabs, Tab } from "react-bootstrap";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";

import avatar1 from "../../assets/images/user/avatar-1.jpg";
import avatar2 from "../../assets/images/user/avatar-2.jpg";
import avatar3 from "../../assets/images/user/avatar-3.jpg";
import Studentlist from "./Studentlist";

import {
  getStudents,
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
    student_i: -1,
    role: "",
    error: null,
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
  };

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data: students, role } = resp.data;
        this.setState({ isLoaded: true, students, role });
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
          console.log(resp.data.data);
          this.setState({
            isLoaded: true,
            students: resp.data.data,
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
    const auth = localStorage.getItem("token");
    var actualFileName;

    fetch(`${window.download}/${category}/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application",
        Authorization: "Bearer " + JSON.parse(auth),
      },
    })
      // download(category, id)
      .then((res) => {
        actualFileName = res.headers.get("Content-Disposition").split('"')[1];
        return res.blob();
      })
      .then(
        (blob) => {
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
  onRejectFilefromstudent = (e, category, id) => {
    //id == student id
    e.preventDefault();
    rejectDocument(category, id).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: false,
          error,
        });
      }
    );
  };

  onAcceptFilefromstudent = (e, category, id) => {
    //id == student id
    e.preventDefault();
    acceptDocument(category, id).then(
      (result) => {},
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  };
  onDeleteProgram(e, student_id, program_id) {
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
  }

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
        // const { students, student_i } = this.state;
        const { agent_ } = student;
        const updateAgentList = agents.reduce(
          (prev, { emailaddress_ }) => ({
            ...prev,
            [emailaddress_]: agent_.indexOf(emailaddress_) > -1,
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
        // const { students, student_i } = this.state;
        const { editor_ } = student;
        const updateEditorList = editors.reduce(
          (prev, { emailaddress_ }) => ({
            ...prev,
            [emailaddress_]: editor_.indexOf(emailaddress_) > -1,
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
    this.setState({
      updateAgentList: [],
      isLoaded: false,
    });
  };

  submitUpdateEditorlist = (updateEditorList, student_id) => {
    console.log(updateEditorList + " " + student_id);
    this.UpdateEditorlist(updateEditorList, student_id);
    this.setState({
      updateEditorList: [],
      isLoaded: false,
    });
  };

  UpdateAgentlist = (updateAgentList, student_id) => {
    updateAgents(student_id, updateAgentList);
  };

  UpdateEditorlist = (updateEditorList, student_id) => {
    updateEditors(student_id, updateEditorList);
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
      if (this.state.students) {
        return (
          <Aux>
            <Row>
              {/* <Col md={6} xl={8}> */}
              <Col>
                <Card className="Recent-Users">
                  <Card.Header>
                    <Card.Title as="h5">Student List</Card.Title>
                  </Card.Header>
                  <Card.Body className="px-0 py-2">
                    <Studentlist
                      role={this.state.role}
                      editAgent={this.editAgent}
                      editEditor={this.editEditor}
                      agent_list={this.state.agent_list}
                      editor_list={this.state.editor_list}
                      startEditingAgent={this.startEditingAgent}
                      UpdateAgentlist={this.UpdateAgentlist}
                      startEditingEditor={this.startEditingEditor}
                      startEditingProgram={this.startEditingProgram}
                      students={this.state.students}
                      header={[
                        {
                          name: "StudentName",
                          prop: "StudentName",
                        },
                        {
                          name: "Agent",
                          prop: "agent_",
                        },
                        {
                          name: "Editor",
                          prop: "editor_",
                        },
                        {
                          name: "Program",
                          prop: "Program",
                        },
                      ]}
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
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {this.state.role === "Student" ? (
              <></>
            ) : (
              <Row>
                <Col className="m-b-30">
                  <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
                    <Tab eventKey="today" title="To Do list:">
                      {tabContent}
                    </Tab>
                    <Tab eventKey="week" title="Deadline overview">
                      {tabContent}
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            )}
          </Aux>
        );
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
