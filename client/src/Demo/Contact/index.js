import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Card, Table } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { TopBar } from '../../components/TopBar/TopBar';

function Contact(props) {
  const [contactState, setContactState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    status: '', //reject, accept... etc
    res_status: 0
  });
  useEffect(() => {
    getStudents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setContactState({
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          });
        } else {
          setContactState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        setContactState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  if (
    props.user.role !== 'Admin' &&
    props.user.role !== 'Editor' &&
    props.user.role !== 'Agent' &&
    props.user.role !== 'Student'
  ) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Contact Us');
  const { res_status, isLoaded } = contactState;

  if (!isLoaded && !contactState.students) {
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

  const your_editors = contactState.students[0].editors ? (
    contactState.students[0].editors.map((editor, i) => (
      <tr key={i}>
        <td>Editor</td>
        <td>
          {editor.firstname} - {editor.lastname}
        </td>
        <td>{editor.email}</td>
      </tr>
    ))
  ) : (
    <></>
  );
  const your_agents = contactState.students[0].agents ? (
    contactState.students[0].agents.map((agent, i) => (
      <tr key={i}>
        <td>Agent</td>
        <td>
          <Link
            to={`${DEMO.TEAM_AGENT_PROFILE_LINK(agent._id.toString())}`}
            className="text-info"
          >
            {agent.firstname} - {agent.lastname}
          </Link>
        </td>
        <td>{agent.email}</td>
      </tr>
    ))
  ) : (
    <></>
  );
  return (
    <Aux>
      <TopBar>Contact Us</TopBar>
      <Row>
        <Col md={6}>
          <Card className="my-2 mx-0" bg={'dark'} text={'light'}>
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                Your {appConfig.companyName} Team
              </Card.Title>
            </Card.Header>
            <Table
              responsive
              bordered
              hover
              className="my-0 mx-0"
              variant="dark"
              text="light"
              size="sm"
            >
              <thead>
                <tr>
                  <th>Role</th>
                  <th>First-, Last Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {your_agents}
                {your_editors}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Aux>
  );
}

export default Contact;
