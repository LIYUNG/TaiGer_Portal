import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../../hoc/_Aux';
import AssignAgentsPage from './AssignAgentsPage';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { spinner_style } from '../../Utils/contants';

import { getStudents, getAgents, updateAgents } from '../../../api';
import DEMO from '../../../store/constant';
import { is_TaiGer_role } from '../../Utils/checking-functions';

class AssignAgents extends React.Component {
  state = {
    error: '',
    agent_list: [],
    isLoaded: false,
    students: [],
    updateAgentList: {},
    success: false,
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

  editAgent = (student) => {
    getAgents().then(
      (resp) => {
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

  submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    this.UpdateAgentlist(e, updateAgentList, student_id);
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const { isLoaded, res_status, res_modal_status, res_modal_message } =
      this.state;

    if (!isLoaded) {
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

    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <AssignAgentsPage
          role={this.props.user.role}
          editAgent={this.editAgent}
          agent_list={this.state.agent_list}
          UpdateAgentlist={this.UpdateAgentlist}
          students={this.state.students}
          updateAgentList={this.state.updateAgentList}
          submitUpdateAgentlist={this.submitUpdateAgentlist}
        />
      </Aux>
    );
  }
}

export default AssignAgents;
