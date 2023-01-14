import React from 'react';
import { Row, Col, Spinner, Table, Card, Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { updateArchivStudents, getStudents } from '../../api';

class ApplicantSOverview extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    file: '',
    status: '', //reject, accept... etc
    res_status: 0
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
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

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
            res_status: status
          }));
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
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Student'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.students) {
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
        <Row className="sticky-top">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Students Applications Overview
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <ApplicationOverviewTabs
          isLoaded={this.state.isLoaded}
          user={this.props.user}
          success={this.state.success}
          students={this.state.students}
        />
      </Aux>
    );
  }
}

export default ApplicantSOverview;
