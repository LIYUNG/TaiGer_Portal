import React from 'react';
import { Row, Col, Spinner, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';

import Aux from '../../hoc/_Aux';
import UsersList from './UsersList';
import AddUserModal from './AddUserModal';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import DEMO from '../../store/constant';
import { getUsers, addUser } from '../../api';
import { TabTitle } from '../Utils/TabTitle';

class UsersTable extends React.Component {
  state = {
    error: null,
    addUserModalState: false,
    isLoaded: false,
    user: null,
    success: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  componentDidMount() {
    getUsers().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            user: data,
            success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => this.setState({ isLoaded: true, error })
    );
  }

  openAddUserModal = () => {
    this.setState({
      addUserModalState: true
    });
  };
  cloaseAddUserModal = () => {
    this.setState({
      addUserModalState: false
    });
  };

  AddUserSubmit = (e, user_information) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    // Remove email space
    user_information.email = user_information.email.trim();
    addUser(user_information).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            user: data,
            success,
            addUserModalState: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            addUserModalState: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => this.setState({ isLoaded: true, error })
    );
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    if (this.props.user.role !== 'Admin') {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('User List');
    const { res_modal_message, res_modal_status, res_status, isLoaded } =
      this.state;

    if (!isLoaded && !this.state.user) {
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
    const student_list = this.state.user.filter(
      (usr, x) => usr.role === 'Student'
    );
    const agent_list = this.state.user.filter((usr, x) => usr.role === 'Agent');
    const editor_list = this.state.user.filter(
      (usr, x) => usr.role === 'Editor'
    );
    const admin_list = this.state.user.filter((usr, x) => usr.role === 'Admin');

    return (
      <Aux>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Button onClick={this.openAddUserModal}>
            <AiOutlinePlus /> Add New User
          </Button>
        </Row>
        <Row>
          <Col>
            <Card bg={'primary'} text="light">
              <Card.Header>
                <Card.Title className="my-0 mx-0 text-light">
                  Users List
                </Card.Title>
              </Card.Header>
              <Tabs
                defaultActiveKey={'Student'}
                id="student_user_list"
                fill={true}
                justify={true}
                className="py-0 my-0 mx-0"
              >
                <Tab
                  eventKey="Student"
                  title={`Student (${student_list?.length})`}
                >
                  <UsersList
                    success={this.state.success}
                    isLoaded={this.state.isLoaded}
                    user={student_list}
                    onSubmit2={this.onSubmit2}
                  />
                </Tab>
                <Tab eventKey="Agent" title={`Agent (${agent_list.length})`}>
                  <UsersList
                    success={this.state.success}
                    isLoaded={this.state.isLoaded}
                    user={this.state.user.filter(
                      (usr, x) => usr.role === 'Agent'
                    )}
                    onSubmit2={this.onSubmit2}
                  />
                </Tab>
                <Tab eventKey="Editor" title={`Editor (${editor_list.length})`}>
                  <UsersList
                    success={this.state.success}
                    isLoaded={this.state.isLoaded}
                    user={this.state.user.filter(
                      (usr, x) => usr.role === 'Editor'
                    )}
                    onSubmit2={this.onSubmit2}
                  />
                </Tab>
                <Tab eventKey="Admin" title={`Admin (${admin_list.length})`}>
                  <UsersList
                    success={this.state.success}
                    isLoaded={this.state.isLoaded}
                    user={this.state.user.filter(
                      (usr, x) => usr.role === 'Admin'
                    )}
                    onSubmit2={this.onSubmit2}
                  />
                </Tab>
              </Tabs>
            </Card>
          </Col>
        </Row>
        <Row>
          <Button onClick={this.openAddUserModal}>
            <AiOutlinePlus /> Add New User
          </Button>
        </Row>
        <AddUserModal
          isLoaded={this.state.isLoaded}
          addUserModalState={this.state.addUserModalState}
          cloaseAddUserModal={this.cloaseAddUserModal}
          firstname={this.state.firstname}
          lastname={this.state.lastname}
          selected_user_id={this.state.selected_user_id}
          AddUserSubmit={this.AddUserSubmit}
        />
      </Aux>
    );
  }
}

export default UsersTable;
