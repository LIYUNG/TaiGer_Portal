import React from 'react';
import { Card, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import CVMLRLOverview from '../CVMLRLCenter/CVMLRLOverview';
import ErrorPage from '../Utils/ErrorPage';

import { getEditor } from '../../api';
import { spinner_style } from '../Utils/contants';
import {
  frequencyDistribution,
  is_TaiGer_role,
  open_tasks_with_editors
} from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import TasksDistributionBarChart from '../../components/Charts/TasksDistributionBarChart';

class EditorPage extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    editor: null,
    students: null,
    res_status: 0
  };

  componentDidMount() {
    getEditor(this.props.match.params.user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            editor: data.editor,
            students: data.students,
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
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.editor && !this.state.students) {
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
      `Editor: ${this.state.editor.firstname}, ${this.state.editor.lastname}`
    );

    const open_tasks_arr = open_tasks_with_editors(this.state.students);
    const task_distribution = open_tasks_arr
      .filter(({ isFinalVersion, show }) => isFinalVersion !== true)
      .map(({ deadline, file_type, show }) => {
        return { deadline, file_type, show };
      });
    const open_distr = frequencyDistribution(task_distribution);

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
                      TaiGer Team Editor:{' '}
                      <b>
                        {this.state.editor.firstname}{' '}
                        {this.state.editor.lastname}
                      </b>
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
                      {this.state.editor.firstname} {this.state.editor.lastname}{' '}
                      Open Tasks Distribution
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                Tasks distribute among the date. Note that CVs, MLs, RLs, and
                Essay are mixed together.
                <p className="my-0">
                  <b style={{ color: 'red' }}>active:</b> students decide
                  programs. These will be shown in{' '}
                  <Link to={'/dashboard/cv-ml-rl'}>Tasks Dashboard</Link>
                </p>
                <p className="my-0">
                  <b style={{ color: '#A9A9A9' }}>potentials:</b> students do
                  not decide programs yet. But the tasks will be potentially
                  active when they decided.
                </p>
                <TasksDistributionBarChart data={sorted_date_freq_pair} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <CVMLRLOverview
          isLoaded={this.state.isLoaded}
          user={this.state.editor}
          success={this.state.success}
          students={this.state.students}
        />
        <Row className="my-2 mx-0">
          <Link
            to={`/teams/editors/archiv/${this.state.editor._id.toString()}`}
          >
            <Button>See Archiv Student</Button>
          </Link>
        </Row>
      </Aux>
    );
  }
}

export default EditorPage;
