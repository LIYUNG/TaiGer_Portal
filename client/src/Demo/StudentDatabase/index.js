import React from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import { spinner_style } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';

import { getAllStudents, updateArchivStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';

class Dashboard extends React.Component {
  state = {
    error: '',
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
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
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
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  };

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
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
    TabTitle('Student Database');
    if (this.state.success) {
      return (
        <Aux>
          <Row className="sticky-top">
            <Col>
              <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
                <Card.Header>
                  <Card.Title className="my-0 mx-0 text-light">
                    Students Database ({this.state.students?.length})
                  </Card.Title>
                </Card.Header>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="my-0 mx-0">
                <TabStudBackgroundDashboard
                  user={this.props.user}
                  students={this.state.students}
                  updateStudentArchivStatus={this.updateStudentArchivStatus}
                  isArchivPage={this.state.isArchivPage}
                />
              </Card>
            </Col>
          </Row>
        </Aux>
      );
    }
  }
}

export default Dashboard;
