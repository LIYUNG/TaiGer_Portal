import React from 'react';
import { Row, Col, Spinner, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { getStudents } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { TopBar } from '../../components/TopBar/TopBar';

class LearningResources extends React.Component {
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
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Editor' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Student'
    ) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
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
        <TopBar>Learning Resources</TopBar>
        <Card>
          <Card.Header>
            <Card.Title>Resources A</Card.Title>
          </Card.Header>
          <Card.Body>Comming soon!</Card.Body>
        </Card>
      </Aux>
    );
  }
}

export default LearningResources;
