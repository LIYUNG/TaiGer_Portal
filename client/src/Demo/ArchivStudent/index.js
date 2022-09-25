import React from 'react';
import { Row, Col, Tabs, Tab, Spinner } from 'react-bootstrap';
import Aux from '../../hoc/_Aux';
import TabStudDocsDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudDocsDashboard';
import { SYMBOL_EXPLANATION } from '../Utils/contants';
import {
  getArchivStudents,
  updateArchivStudents,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors
  // deleteFile
} from '../../api';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

class Dashboard extends React.Component {
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
    isArchivPage: true
  };

  componentDidMount() {
    getArchivStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, students: data, success: success });
        } else {
          if (resp.status === 401) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
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
            [_id]: student_agents ? student_agents.indexOf(_id) > -1 : false
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
            [_id]: student_editors ? student_editors.indexOf(_id) > -1 : false
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

  submitUpdateAgentlist = (updateAgentList, student_id) => {
    this.UpdateAgentlist(updateAgentList, student_id);
  };

  submitUpdateEditorlist = (updateEditorList, student_id) => {
    this.UpdateEditorlist(updateEditorList, student_id);
  };

  UpdateAgentlist = (updateAgentList, student_id) => {
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        this.setState({
          updateAgentList: [],
          isLoaded: false
        });
      },
      (error) => {
        alert('UpdateAgentlist is failed.');
      }
    );
  };

  UpdateEditorlist = (updateEditorList, student_id) => {
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        this.setState({
          updateEditorList: [],
          isLoaded: false
        });
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
        this.setState({ isLoaded: true, students: data, success: success });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  render() {
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
      if (this.state.success) {
        return (
          <Aux>
            <Row>
              <Col>
                <Tabs defaultActiveKey="w" id="uncontrolled-tab-example">
                  <Tab eventKey="w" title="My Closed Student">
                    {this.props.user.role === 'Admin' ||
                    this.props.user.role === 'Agent' ||
                    this.props.user.role === 'Editor' ? (
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
