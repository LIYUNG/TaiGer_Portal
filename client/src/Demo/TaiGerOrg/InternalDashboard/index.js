import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import NVD3Chart from 'react-nvd3';

import Aux from '../../../hoc/_Aux';
import { spinner_style } from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import {
  is_TaiGer_role,
  programs_refactor
} from '../../Utils/checking-functions';

import { getStatistics } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';

class InternalDashboard extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    teams: null,
    students: null,
    documents: null,
    students_details: null,
    agents: null,
    editors: null,
    res_status: 0
  };

  componentDidMount() {
    getStatistics().then(
      (resp) => {
        const {
          data,
          success,
          students,
          agents,
          editors,
          documents,
          students_details
        } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            teams: data,
            students: students,
            documents: documents,
            agents: agents,
            editors: editors,
            students_details,
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

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('TaiGer Dashboard');
    const {
      res_status,
      isLoaded,
      students,
      documents,
      agents,
      editors,
      students_details
    } = this.state;

    if (
      !isLoaded &&
      !this.state.teams &&
      !this.state.students &&
      !this.state.documents
    ) {
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
    const colors = [
      '#ff8a65',
      '#f4c22b',
      '#04a9f5',
      '#3ebfea',
      '#4F5467',
      '#1de9b6',
      '#a389d4',
      '#FE8A7D'
    ];
    const agents_data = [];
    agents.forEach((agent, i) => {
      agents_data.push({
        key: `${agent.firstname}`,
        y: agent.student_num,
        color: colors[i]
      });
    });
    const editors_data = [];
    editors.forEach((editor, i) => {
      editors_data.push({
        key: `${editor.firstname}`,
        y: editor.student_num,
        color: colors[i]
      });
    });
    const documents_data = [];
    const cat = ['ML', 'CV', 'RL', 'ESSAY'];
    cat.forEach((ca, i) => {
      documents_data.push({
        key: `${ca}`,
        y: documents[ca].count,
        color: colors[i]
      });
    });
    const application_status = ['Open', 'Close'];
    const applications_decided = programs_refactor(students_details).filter(
      (application) =>
        application.program_id !== '-' && application.decided === 'O'
    );
    const applications_submitted = applications_decided.filter(
      (application) => application.closed === 'O'
    );
    const obj = {
      Open: applications_decided.length - applications_submitted.length,
      Close: applications_submitted.length
    };
    const applications_data = [];
    application_status.forEach((status, i) => {
      applications_data.push({
        key: `${status}`,
        y: obj[status],
        color: colors[i]
      });
    });
    const admissions_data = [];
    const admission_status = ['Admission', 'Rejection', 'Pending'];
    const applications_admission = applications_submitted.filter(
      (application) => application.admission === 'O'
    );
    const applications_rejection = applications_submitted.filter(
      (application) => application.admission === 'X'
    );
    const applications_pending = applications_submitted.filter(
      (application) => application.admission === '-'
    );
    const obj2 = {
      Admission: applications_admission.length,
      Rejection: applications_rejection.length,
      Pending: applications_pending.length
    };
    admission_status.forEach((status, i) => {
      admissions_data.push({
        key: `${status}`,
        y: obj2[status],
        color: colors[i]
      });
    });
    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">TaiGer Dashboard</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">Students</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Close: {students.isClose}. Open: {students.isOpen}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">Tasks</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Number of Open Tasks:{' '}
                <NVD3Chart
                  id="chart"
                  height={300}
                  type="pieChart"
                  datum={documents_data}
                  x="key"
                  y="y"
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">Agents</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Number of students per agent:
                <NVD3Chart
                  id="chart"
                  height={300}
                  type="pieChart"
                  datum={agents_data}
                  x="key"
                  y="y"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">Editors</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Number of students per editor:
                <NVD3Chart
                  id="chart"
                  height={300}
                  type="pieChart"
                  datum={editors_data}
                  x="key"
                  y="y"
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">Applications</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Number of Applications:
                <NVD3Chart
                  id="chart"
                  height={300}
                  type="pieChart"
                  datum={applications_data}
                  x="key"
                  y="y"
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">Admissions</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Number of Admissions:
                <NVD3Chart
                  id="chart"
                  height={300}
                  type="pieChart"
                  datum={admissions_data}
                  x="key"
                  y="y"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default InternalDashboard;