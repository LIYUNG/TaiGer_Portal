import React from 'react';
import { Spinner } from 'react-bootstrap';
import Aux from '../../../hoc/_Aux';
import AssignAgentsPage from './AssignAgentsPage';

import TimeOutErrors from '../../Utils/TimeOutErrors';
import UnauthorizedError from '../../Utils/UnauthorizedError';
import { SYMBOL_EXPLANATION } from '../../Utils/contants';
import { Redirect } from 'react-router-dom';

import {
  getStudents,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors
} from '../../../api';

class AssignAgents extends React.Component {
  state = {
    error: null,
    timeouterror: null,
    unauthorizederror: null,
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
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
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
            if (resp.status === 401 || resp.status === 500) {
              this.setState({ isLoaded: true, timeouterror: true });
            } else if (resp.status === 403) {
              this.setState({ isLoaded: true, unauthorizederror: true });
            }
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
        const { success } = resp;
        if (success) {
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
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
        const { success } = resp;
        if (success) {
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
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
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
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
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        alert('UpdateEditorlist is failed.');
      }
    );
  };

  render() {
    if (this.props.user.role !== 'Admin') {
      return <Redirect to="/dashboard/default" />;
    }
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
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
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
            <AssignAgentsPage
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
              isDashboard={this.state.isDashboard}
            />
          </Aux>
        );
      } else {
        return (
          <Aux>
            <></>
          </Aux>
        );
      }
    }
  }
}

export default AssignAgents;
