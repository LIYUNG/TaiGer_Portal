import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { SYMBOL_EXPLANATION, spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

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
    success: false,
    res_status: 0

    // isArchivPage: true
  };

  componentDidMount() {
    getAllStudents().then(
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
    const { res_status, isLoaded } = this.state;

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
                  <div style={spinner_style}>
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

export default Dashboard;
