import React from 'react';
import { Card, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

import Aux from '../../hoc/_Aux';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_Admin, is_TaiGer_role } from '../Utils/checking-functions';

import { getTeamMembers, updateUserPermission } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import GrantPermissionModal from './GrantPermissionModal';

class TaiGerOrg extends React.Component {
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

  setModalShow = (user_firstname, user_lastname, user_id, permissions) => {
    console.log(permissions);
    this.setState({
      modalShow: true,
      firstname: user_firstname,
      lastname: user_lastname,
      selected_user_id: user_id,
      user_permissions: permissions
    });
  };

  setModalHide = () => {
    this.setState({
      modalShow: false
    });
  };

  onUpdatePermissions = (e, permissions) => {
    e.preventDefault();
    updateUserPermission(this.state.selected_user_id, permissions).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let teams_temp = [...this.state.teams];
          let team_member = teams_temp.find(
            (member) => member._id.toString() === this.state.selected_user_id
          );
          team_member.permissions = [data];
          this.setState({
            isLoaded: true,
            modalShow: false,
            teams: teams_temp,
            firstname: '',
            lastname: '',
            selected_user_id: '',
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
    console.log('onsubmit');
  };

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('TaiGer Team');
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
            {is_TaiGer_Admin(this.props.user) && (
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
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Can Assign Agents</th>
                  <th>Can Assign Editors</th>
                  <th>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent, i) => (
                  <tr key={i}>
                    <td>
                      <b>
                        <Link to={`/teams/agents/${agent._id.toString()}`}>
                          {agent.firstname} {agent.lastname}{' '}
                        </Link>
                      </b>
                    </td>
                    <td>x</td>
                    <td>x</td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() =>
                          this.setModalShow(
                            agent.firstname,
                            agent.lastname,
                            agent._id.toString(),
                            agent.permissions
                          )
                        }
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Editor:</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Can Assign Agents</th>
                  <th>Can Assign Editors</th>
                  <th>Permissions</th>
                </tr>
              </thead>
              <tbody>
                {editors.map((editor, i) => (
                  <tr key={i}>
                    <td>
                      <b>
                        <Link to={`/teams/editors/${editor._id.toString()}`}>
                          {editor.firstname} {editor.lastname}{' '}
                        </Link>
                      </b>
                    </td>
                    <td>
                      {editor.permissions.length > 0
                        ? editor.permissions[0].canAssignAgents
                          ? 'O'
                          : 'X'
                        : 'x'}
                    </td>
                    <td>
                      {editor.permissions.length > 0
                        ? editor.permissions[0].canAssignEditors
                          ? 'O'
                          : 'X'
                        : 'x'}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() =>
                          this.setModalShow(
                            editor.firstname,
                            editor.lastname,
                            editor._id.toString(),
                            editor.permissions
                          )
                        }
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>
        {this.state.modalShow && (
          <GrantPermissionModal
            modalShow={this.state.modalShow}
            firstname={this.state.firstname}
            lastname={this.state.lastname}
            user_permissions={this.state.user_permissions}
            setModalHide={this.setModalHide}
            onUpdatePermissions={this.onUpdatePermissions}
          />
        )}
      </Aux>
    );
  }
}

export default TaiGerOrg;
