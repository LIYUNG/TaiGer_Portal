import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';

import Aux from '../../../hoc/_Aux';
import { spinner_style } from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import { is_TaiGer_Admin } from '../../Utils/checking-functions';

import { getUsersLog } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';

class TaiGerPortalUsersLog extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    modalShow: false,
    firstname: '',
    lastname: '',
    selected_user_id: '',
    user_permissions: [],
    teams: null,
    res_status: 0
  };

  componentDidMount() {
    getUsersLog(this.props.match.params.user_id).then(
      (resp) => {
        const { data, success, user } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            logs: data,
            user,
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
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.user_id !== this.props.match.params.user_id) {
      getUsersLog(this.props.match.params.user_id).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true,
              logs: data,
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
    if (!is_TaiGer_Admin(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('TaiGer User Logs');
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

    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">User Logs</Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            internal/logs/{'user_id'}
            {/* TODO insert a table */}
            {this.state.logs.map((log) => (
              <p>
                <Link to={`/internal/logs/${log.user_id._id.toString()}`}>
                  {log.user_id?.firstname} {log.user_id?.lastname}
                </Link>{' '}
                {log.date}
                {log.apiCallCount}
                {log.apiPath}
                {log.operation}
              </p>
            ))}
          </Card.Body>
        </Card>
      </Aux>
    );
  }
}

export default TaiGerPortalUsersLog;
