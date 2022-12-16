import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { profile_name_list } from '../Utils/contants';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getTeamMembers } from '../../api';

class Survey extends React.Component {
  state = {
    error: null,
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    teams: null,
    academic_background: {},
    application_preference: {},
    updateconfirmed: false,
    res_status: 0
  };

  componentDidMount() {
    getTeamMembers().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            teams: data,
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

  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Editor'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.teams) {
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
    const admins = this.state.teams.filter((member) => member.role === 'Admin');
    const agents = this.state.teams.filter((member) => member.role === 'Agent');
    const editors = this.state.teams.filter(
      (member) => member.role === 'Editor'
    );
    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">TaiGer Team</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            {this.props.user.role === 'Admin' && (
              <>
                <h4>Admin:</h4>
                {admins.map((admin, i) => (
                  <p key={i}>
                    <b>
                      <Link to={`/teams/admins/${admin._id.toString()}`}>
                        {admin.firstname} {admin.lastname}
                      </Link>
                    </b>
                  </p>
                ))}
              </>
            )}

            <h4>Agent:</h4>
            {agents.map((agent, i) => (
              <p key={i}>
                <b>
                  <Link to={`/teams/agents/${agent._id.toString()}`}>
                    {agent.firstname} {agent.lastname}{' '}
                    {agent.students ? agent.students.length : 0}
                  </Link>
                </b>
              </p>
            ))}
            <h4>Editor:</h4>
            {editors.map((editor, i) => (
              <p key={i}>
                <b>
                  <Link to={`/teams/editors/${editor._id.toString()}`}>
                    {editor.firstname} {editor.lastname}{' '}
                    {editor.students ? editor.students.length : 0}
                  </Link>
                </b>
              </p>
            ))}
          </Card.Body>
        </Card>
      </Aux>
    );
  }
}

export default Survey;
