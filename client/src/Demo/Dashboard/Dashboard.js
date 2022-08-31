import React from 'react';
import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
// import DEMO from "../../store/constant";
// import avatar1 from "../../assets/images/user/avatar-1.jpg";
// import avatar2 from "../../assets/images/user/avatar-2.jpg";
// import avatar3 from "../../assets/images/user/avatar-3.jpg";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsDash } from 'react-icons/bs';
import AdminMainView from './AdminDashboard/AdminMainView';
import AgentMainView from './AgentDashboard/AgentMainView';
import EditorMainView from './EditorDashboard/EditorMainView';
import StudentDashboard from './StudentDashboard/StudentDashboard';
import GuestMainView from './GuestDashboard/GuestMainView';
import {
  getStudents,
  updateArchivStudents,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors
} from '../../api';

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
    file: ''
  };

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success: success
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getStudents().then(
        (resp) => {
          const { data, success } = resp.data;
          if (success) {
            this.setState({
              isLoaded: true,
              students: data,
              success: success
            });
          } else {
            alert(resp.data.message);
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: true
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
        const updateAgentList = agents.reduce(
          (prev, { _id }) => ({
            ...prev,
            [_id]: student_agents
              ? student_agents.findIndex(
                  (student_agent) => student_agent._id === _id
                ) > -1
              : false
          }),
          {}
        );

        this.setState((state) => ({
          ...state,
          agent_list: agents,
          updateAgentList
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
              : false
          }),
          {}
        );

        this.setState((state) => ({
          ...state,
          editor_list: editors,
          updateEditorList
        }));
      },
      (error) => {}
    );
  };

  handleChangeAgentlist = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => ({
      updateAgentList: {
        ...prevState.updateAgentList,
        [value]: checked
      }
    }));
  };

  handleChangeEditorlist = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => ({
      updateEditorList: {
        ...prevState.updateEditorList,
        [value]: checked
      }
    }));
  };

  submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    this.UpdateAgentlist(e, updateAgentList, student_id);
  };

  submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    this.UpdateEditorlist(e, updateEditorList, student_id);
  };

  UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        var students_temp = [...this.state.students];
        var studentIdx = students_temp.findIndex(
          ({ _id }) => _id === student_id
        );
        students_temp[studentIdx] = data; // datda is single student updated
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: []
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        alert('UpdateAgentlist is failed.');
      }
    );
  };

  UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        var students_temp = [...this.state.students];
        var studentIdx = students_temp.findIndex(
          ({ _id }) => _id === student_id
        );
        students_temp[studentIdx] = data; // datda is single student updated
        if (success) {
          this.setState({
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: []
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        alert('UpdateEditorlist is failed.');
      }
    );
  };

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          students: data,
          success: success
        }));
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
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
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
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
      if (this.props.user.role === 'Admin') {
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
      } else if (this.props.user.role === 'Agent') {
        return (
          <Aux>
            <AgentMainView
              role={this.props.user.role}
              students={this.state.students}
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
      } else if (this.props.user.role === 'Editor') {
        return (
          <Aux>
            <EditorMainView
              role={this.props.user.role}
              editAgent={this.editAgent}
              editEditor={this.editEditor}
              agent_list={this.state.agent_list}
              editor_list={this.state.editor_list}
              students={this.state.students}
              updateEditorList={this.state.updateEditorList}
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
      } else if (this.props.user.role === 'Student') {
        return (
          <Aux>
            <StudentDashboard
              role={this.props.user.role}
              students={this.state.students}
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
              students={this.state.students}
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
