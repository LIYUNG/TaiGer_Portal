import React from "react";
import { Row, Col, Tabs, Tab, Spinner } from "react-bootstrap";
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
  getAgents,
  updateAgents,
  getEditors,
  updateEditors,
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
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, students: data, success: success });
        } else {
          alert(resp.data.message);
        }
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
          const { data, success } = resp.data;
          if (success) {
            this.setState({ isLoaded: true, students: data, success: success });
          } else {
            alert(resp.data.message);
          }
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
      if (this.state.success) {
        return (
          <Aux>
            <Row>
              <Col>
                <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
                  <Tab eventKey="w" title="Archiv Student Overview">
                    {this.props.user.role === "Admin" ||
                    this.props.user.role === "Agent" ||
                    this.props.user.role === "Editor" ? (
                      <TabStudDocsDashboard
                        role={this.props.user.role}
                        students={this.state.students}
                        editAgent={this.state.editAgent}
                        editEditor={this.state.editEditor}
                        agent_list={this.state.agent_list}
                        editor_list={this.state.editor_list}
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
                {!isLoaded && (
                  <div style={style}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  </div>
                )}
              </Col>
            </Row>
          </Aux>
        );
      }
    }
  }
}

export default Dashboard;
