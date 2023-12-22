import React from 'react';
import { Card, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import ApplicationOverviewTabs from '../ApplicantsOverview/ApplicationOverviewTabs';
import ErrorPage from '../Utils/ErrorPage';

import { getAgent } from '../../api';
import { spinner_style } from '../Utils/contants';
import {
  frequencyDistribution,
  is_TaiGer_role,
  programs_refactor
} from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import TasksDistributionBarChart from '../../components/Charts/TasksDistributionBarChart';
import { appConfig } from '../../config';

class AgentPage extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    agent: null,
    res_status: 0
  };

  componentDidMount() {
    getAgent(this.props.match.params.user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data.students,
            agent: data.agent,
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.user_id !== this.props.match.params.user_id) {
      getAgent(this.props.match.params.user_id).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              students: data.students,
              agent: data.agent,
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
  }

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.students && !this.state.agent) {
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

    TabTitle(
      `Agent: ${this.state.agent.firstname}, ${this.state.agent.lastname}`
    );

    const open_applications_arr = programs_refactor(this.state.students);
    const applications_distribution = open_applications_arr
      .filter(({ isFinalVersion, show }) => isFinalVersion !== true)
      .map(({ deadline, file_type, show }) => {
        return { deadline, file_type, show };
      });
    const open_distr = frequencyDistribution(applications_distribution);

    const sort_date = Object.keys(open_distr).sort();

    const sorted_date_freq_pair = [];
    sort_date.forEach((date, i) => {
      sorted_date_freq_pair.push({
        name: `${date}`,
        active: open_distr[date].show,
        potentials: open_distr[date].potentials
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
                    <Col className="my-0 mx-0 text-light">
                      ${appConfig.companyName} Team Agent:{' '}
                      <b>
                        {this.state.agent.firstname} {this.state.agent.lastname}
                      </b>
                      {` (${this.state.students.length})`}
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0">
                      {this.state.agent.firstname} {this.state.agent.lastname}{' '}
                      Open Applications Distribution
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Applications distribute among the date.
                <p className="my-0">
                  <b style={{ color: 'red' }}>active:</b> students decided
                  programs. These will be shown in{' '}
                  <Link to={'/student-applications'}>Application Overview</Link>
                </p>
                <p className="my-0">
                  <b style={{ color: '#A9A9A9' }}>potentials:</b> students do
                  not decide programs yet. But the applications will be
                  potentially activated when they would decide.
                </p>
                <TasksDistributionBarChart data={sorted_date_freq_pair} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <ApplicationOverviewTabs
          isLoaded={this.state.isLoaded}
          user={this.props.user}
          success={this.state.success}
          students={this.state.students}
        />
        <Row className="my-2 mx-0">
          <Link to={`/teams/agents/archiv/${this.state.agent._id.toString()}`}>
            <Button>See Archiv Student</Button>
          </Link>
        </Row>
      </Aux>
    );
  }
}

export default AgentPage;
