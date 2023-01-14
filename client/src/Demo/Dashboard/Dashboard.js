import React from 'react';
import { Spinner } from 'react-bootstrap';

import Aux from '../../hoc/_Aux';
import AdminMainView from './AdminDashboard/AdminMainView';
import AgentMainView from './AgentDashboard/AgentMainView';
import EditorMainView from './EditorDashboard/EditorMainView';
import StudentDashboard from './StudentDashboard/StudentDashboard';
import GuestDashboard from './GuestDashboard/GuestDashboard';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { SYMBOL_EXPLANATION, spinner_style } from '../Utils/contants';

import {
  getStudents,
  updateArchivStudents,
  updateProfileDocumentStatus,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors
} from '../../api';

class Dashboard extends React.Component {
  state = {
    error: '',
    modalShow: false,
    agent_list: [],
    editor_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    updateEditorList: {},
    success: false,
    isDashboard: true,
    file: '',
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isLoaded === false) {
      getStudents().then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              students: data,
              success: success,
              res_status: status
            });
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        },
        (error) => {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }

  editAgent = (student) => {
    getAgents().then(
      (resp) => {
        // TODO: check success
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const agents = data; //get all agent
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
            updateAgentList,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  editEditor = (student) => {
    getEditors().then(
      (resp) => {
        // TODO: check success
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const editors = data;
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
            updateEditorList,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
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
        const { status } = resp;
        if (success) {
          var students_temp = [...this.state.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          this.setState({
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = [...this.state.students];
          var studentIdx = students_temp.findIndex(
            ({ _id }) => _id === student_id
          );
          students_temp[studentIdx] = data; // datda is single student updated
          this.setState({
            isLoaded: true, //false to reload everything
            students: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            students: data,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  onUpdateProfileFilefromstudent = (category, student_id, status, feedback) => {
    var student_arrayidx = this.state.students.findIndex(
      (student) => student._id === student_id
    );
    // var student = this.state.students.find(
    //   (student) => student._id === student_id
    // );
    var students = [...this.state.students];
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (res) => {
        const { success, data } = res.data;
        const { status } = res;
        if (success) {
          students[student_arrayidx] = data;
          this.setState((state) => ({
            ...state,
            students: students,
            success,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_modal_status, res_modal_message, isLoaded, res_status } =
      this.state;

    if (!isLoaded && !this.state.data) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    if (this.props.user.role === 'Admin') {
      return (
        <Aux>
          {!isLoaded && (
            <div style={spinner_style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <AdminMainView
            user={this.props.user}
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
        </Aux>
      );
    } else if (this.props.user.role === 'Agent') {
      return (
        <Aux>
          {!isLoaded && (
            <div style={spinner_style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <AgentMainView
            user={this.props.user}
            role={this.props.user.role}
            isLoaded={isLoaded}
            students={this.state.students}
            SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
            updateStudentArchivStatus={this.updateStudentArchivStatus}
            isDashboard={this.state.isDashboard}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          />
        </Aux>
      );
    } else if (this.props.user.role === 'Editor') {
      return (
        <Aux>
          {!isLoaded && (
            <div style={spinner_style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <EditorMainView
            user={this.props.user}
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
        </Aux>
      );
    } else if (this.props.user.role === 'Student') {
      return (
        <Aux>
          {!isLoaded && (
            <div style={spinner_style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <StudentDashboard
            user={this.props.user}
            role={this.props.user.role}
            student={this.state.students[0]}
            SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
          />
        </Aux>
      );
    } else {
      return (
        <Aux>
          {!isLoaded && (
            <div style={spinner_style}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
            </div>
          )}
          {res_modal_status >= 400 && (
            <ModalMain
              ConfirmError={this.ConfirmError}
              res_modal_status={res_modal_status}
              res_modal_message={res_modal_message}
            />
          )}
          <GuestDashboard
            role={this.props.user.role}
            success={this.state.success}
            students={this.state.students}
            SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
          />
        </Aux>
      );
    }
  }
}

export default Dashboard;
