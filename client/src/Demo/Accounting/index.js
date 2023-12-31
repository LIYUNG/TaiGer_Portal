import React from 'react';
import { Card, Spinner, Row, Col } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_Admin, is_TaiGer_role } from '../Utils/checking-functions';

import { getTeamMembers } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { TopBar } from '../../components/TopBar/TopBar';

class Accounting extends React.Component {
  state = {
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    teams: null,
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
    TabTitle(`${appConfig.companyName} Accounting`);
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
        <TopBar>Accounting: {appConfig.companyName} Team</TopBar>
        <Card>
          <Card.Body>
            <h4>Agent:</h4>
            {agents.map((agent, i) => (
              <p key={i}>
                <b>
                  <Link
                    to={`${DEMO.ACCOUNTING_USER_ID_LINK(agent._id.toString())}`}
                  >
                    {agent.firstname} {agent.lastname}{' '}
                  </Link>
                </b>
              </p>
            ))}
            <h4>Editor:</h4>
            {editors.map((editor, i) => (
              <p key={i}>
                <b>
                  <Link
                    to={`${DEMO.ACCOUNTING_USER_ID_LINK(
                      editor._id.toString()
                    )}`}
                  >
                    {editor.firstname} {editor.lastname}{' '}
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

export default Accounting;
