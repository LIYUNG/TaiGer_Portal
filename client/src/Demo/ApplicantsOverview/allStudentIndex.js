import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getAllActiveStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { is_TaiGer_role } from '../Utils/checking-functions';

class AllApplicantsOverview extends React.Component {
  state = {
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    status: '', //reject, accept... etc
    res_status: 0
  };

  componentDidMount() {
    if (this.props.user.role !== 'Student') {
      getAllActiveStudents().then(
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
  }

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    if (this.props.user.role === 'Student') {
      return (
        <Redirect
          to={`${
            DEMO.STUDENT_APPLICATIONS_LINK
          }/${this.props.user._id.toString()}`}
        />
      );
    }
    TabTitle('Applications Overview');
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
                  All Students Applications Overview
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <ApplicationOverviewTabs
          user={this.props.user}
          success={this.state.success}
          students={this.state.students}
        />
      </Aux>
    );
  }
}

export default AllApplicantsOverview;
