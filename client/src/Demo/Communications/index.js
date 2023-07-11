import React from 'react';
import { Card, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import ErrorPage from '../Utils/ErrorPage';

import { getExpense } from '../../api';
import { spinner_style } from '../Utils/contants';
import {
  frequencyDistribution,
  is_TaiGer_role,
  programs_refactor
} from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { ExtendableTable } from '../../components/ExtendableTable/ExtendableTable';

class Communications extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    the_user: null,
    res_status: 0
  };

  componentDidMount() {
    getExpense(this.props.match.params.taiger_user_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            students: data.students,
            the_user: data.the_user,
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

    if (!isLoaded && !this.state.students && !this.state.the_user) {
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
      `${this.state.the_user.role}: ${this.state.the_user.firstname}, ${this.state.the_user.lastname}`
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
                      TaiGer Team Agent:{' '}
                      <b>
                        {this.state.the_user.firstname}{' '}
                        {this.state.the_user.lastname}
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
                      {this.state.the_user.firstname}{' '}
                      {this.state.the_user.lastname} Salary Overview
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <ExtendableTable data={this.state.students} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="my-2 mx-0">
          <Link
            to={`/teams/agents/archiv/${this.state.the_user._id.toString()}`}
          >
            <Button>See Archiv Student</Button>
          </Link>
        </Row>
      </Aux>
    );
  }
}

export default Communications;
