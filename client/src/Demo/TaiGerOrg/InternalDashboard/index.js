import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../../hoc/_Aux';
import { spinner_style } from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import { is_TaiGer_role } from '../../Utils/checking-functions';

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
    agents: null,
    editors: null,
    res_status: 0
  };

  componentDidMount() {
    getStatistics().then(
      (resp) => {
        const { data, success, students, agents, editors, documents } =
          resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            teams: data,
            students: students,
            documents: documents,
            agents: agents,
            editors: editors,
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
    const { res_status, isLoaded, students, documents, agents, editors } =
      this.state;

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
              <Card.Body>Number of Task: {documents}</Card.Body>
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
              <Card.Body>Number of Task: {documents}</Card.Body>
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
              <Card.Body>Number of Agent: {agents}</Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">Editors</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>Number of Editors: {editors}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Aux>
    );
  }
}

export default InternalDashboard;
