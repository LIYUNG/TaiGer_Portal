import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import Aux from '../../../hoc/_Aux';
import {
  getLast180DaysObject,
  getLast180DaysSet,
  spinner_style,
  transformObjectToArray
} from '../../Utils/contants';
import ErrorPage from '../../Utils/ErrorPage';
import { is_TaiGer_Admin } from '../../Utils/checking-functions';

import { getUserLog } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import LogLineChart from '../../../components/Charts/LogLineChart';
import { appConfig } from '../../../config';

class TaiGerPortalSingleUserLog extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    logs: null,
    success: false,
    modalShow: false,
    range: 180,
    res_status: 0
  };

  componentDidMount() {
    getUserLog(this.props.match.params.user_id).then(
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
      getUserLogTeamMembers(this.props.match.params.user_id).then(
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
    TabTitle(`${appConfig.companyName} User Logs`);
    const { res_status, isLoaded } = this.state;

    if (!isLoaded) {
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

    // const last180DaysSet = getLast180DaysSet();
    const last180DaysObject = getLast180DaysObject();
    this.state.logs.forEach((log) => {
      last180DaysObject[log.date] += log.apiCallCount;
    });
    const dataToBeUsed = transformObjectToArray(last180DaysObject).sort(
      (a, b) => (a.date > b.date ? 1 : -1)
    );
    return (
      <Aux>
        <Row className="sticky-top ">
          <Col>
            <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
              <Card.Header text={'dark'}>
                <Card.Title>
                  <Row>
                    <Col className="my-0 mx-0 text-light">
                      User{' '}
                      <b>
                        {this.state.user?.firstname} {this.state.user?.lastname}
                      </b>{' '}
                      Logs
                    </Col>
                  </Row>
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Card>
          <Card.Body>
            <LogLineChart data={dataToBeUsed} />
            <br />
            <hh5>API calls detail:</hh5>
            <br />
            <br />
            {this.state.logs
              .sort((a, b) => (a.date > b.date ? -1 : 1))
              .map((log, idx) => (
                <li key={idx}>
                  {log.user_id?.firstname} {log.user_id?.lastname} {log.date}
                  {log.apiCallCount}
                  {log.apiPath}
                  {log.operation}
                </li>
              ))}
          </Card.Body>
        </Card>
      </Aux>
    );
  }
}

export default TaiGerPortalSingleUserLog;
