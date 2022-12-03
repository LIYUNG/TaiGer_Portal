import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import Aux from '../../hoc/_Aux';
// import DEMO from "../../store/constant";
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { SYMBOL_EXPLANATION } from '../Utils/contants';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { Redirect } from 'react-router-dom';
import {
  getAllStudents,
  getArchivStudents,
  updateArchivStudents
} from '../../api';

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
    success: false
    // isArchivPage: true
  };

  componentDidMount() {
    getAllStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, students: data, success: success });
        } else {
          if (resp.status == 401) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status == 403) {
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
      getArchivStudents().then(
        (resp) => {
          const { data, success } = resp.data;
          if (success) {
            this.setState({ isLoaded: true, students: data, success: success });
          } else {
            if (resp.status == 401) {
              this.setState({ isLoaded: true, timeouterror: true });
            } else if (resp.status == 403) {
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

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({ isLoaded: true, students: data, success: success });
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
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };

  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Editor'
    ) {
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
      if (this.state.success) {
        return (
          <Aux>
            <Row>
              <Col>
                <Card className="my-0 mx-0">
                  {/* <Card.Body> */}
                  {this.props.user.role === 'Admin' ||
                  this.props.user.role === 'Agent' ||
                  this.props.user.role === 'Editor' ? (
                    <TabStudBackgroundDashboard
                      role={this.props.user.role}
                      students={this.state.students}
                      agent_list={this.state.agent_list}
                      editor_list={this.state.editor_list}
                      updateStudentArchivStatus={this.updateStudentArchivStatus}
                      isArchivPage={this.state.isArchivPage}
                      SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
                    />
                  ) : (
                    <></>
                  )}
                  {!isLoaded && (
                    <div style={style}>
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden"></span>
                      </Spinner>
                    </div>
                  )}
                  {/* </Card.Body> */}
                </Card>
              </Col>
            </Row>
          </Aux>
        );
      }
    }
  }
}

export default Dashboard;
