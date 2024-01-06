import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

import Aux from '../../hoc/_Aux';
import UsersList from './UsersList';
import AddUserModal from './AddUserModal';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import DEMO from '../../store/constant';
import { getUsers, addUser } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
  is_TaiGer_Admin,
  is_TaiGer_Agent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';

function UsersTable(props) {
  const { t, i18n } = useTranslation();
  const [userTableState, setUserTableState] = useState({
    error: null,
    addUserModalState: false,
    isLoaded: false,
    users: null,
    success: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    getUsers().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUserTableState((prevState) => ({
            ...prevState,
            isLoaded: true,
            users: data,
            success,
            res_status: status
          }));
        } else {
          setUserTableState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => setUserTableState({ isLoaded: true, error })
    );
  }, []);

  const openAddUserModal = () => {
    setUserTableState((prevState) => ({
      ...prevState,
      addUserModalState: true
    }));
  };
  const cloaseAddUserModal = () => {
    setUserTableState((prevState) => ({
      ...prevState,
      addUserModalState: false
    }));
  };

  const AddUserSubmit = (e, user_information) => {
    e.preventDefault();
    setUserTableState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    // Remove email space
    user_information.email = user_information.email.trim();
    addUser(user_information).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setUserTableState((prevState) => ({
            ...prevState,
            isLoaded: true,
            users: data,
            success,
            addUserModalState: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setUserTableState((prevState) => ({
            ...prevState,
            isLoaded: true,
            addUserModalState: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => setUserTableState({ isLoaded: true, error })
    );
  };

  const ConfirmError = () => {
    setUserTableState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (!is_TaiGer_Admin(props.user)) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('User List');
  const { res_modal_message, res_modal_status, res_status, isLoaded } =
    userTableState;

  if (!isLoaded && !userTableState.users) {
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
  const student_list = userTableState.users.filter((usr, x) =>
    is_TaiGer_Student(usr)
  );
  const agent_list = userTableState.users.filter((usr, x) =>
    is_TaiGer_Agent(usr)
  );
  const editor_list = userTableState.users.filter((usr, x) =>
    is_TaiGer_Editor(usr)
  );
  const admin_list = userTableState.users.filter((usr, x) =>
    is_TaiGer_Admin(usr)
  );

  return (
    <Aux>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Row>
        <Button onClick={openAddUserModal}>
          <AiOutlinePlus /> {t('Add New User')}
        </Button>
      </Row>
      <Row>
        <Col>
          <Card bg={'primary'} text="light">
            <Card.Header>
              <Card.Title className="my-0 mx-0 text-light">
                {t('User List')}
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
                title={`${t('Student')} (${student_list?.length})`}
              >
                <UsersList
                  success={userTableState.success}
                  isLoaded={userTableState.isLoaded}
                  users={student_list}
                />
              </Tab>
              <Tab
                eventKey={'Agents'}
                title={`${t('Agents')} (${agent_list.length})`}
              >
                <UsersList
                  success={userTableState.success}
                  isLoaded={userTableState.isLoaded}
                  users={agent_list}
                />
              </Tab>
              <Tab
                eventKey="Editor"
                title={`${t('Editor')} (${editor_list.length})`}
              >
                <UsersList
                  success={userTableState.success}
                  isLoaded={userTableState.isLoaded}
                  users={editor_list}
                />
              </Tab>
              <Tab
                eventKey="Admin"
                title={`${t('Admin')} (${admin_list.length})`}
              >
                <UsersList
                  success={userTableState.success}
                  isLoaded={userTableState.isLoaded}
                  users={admin_list}
                />
              </Tab>
            </Tabs>
          </Card>
        </Col>
      </Row>
      <Row>
        <Button onClick={openAddUserModal}>
          <AiOutlinePlus /> {t('Add New User')}
        </Button>
      </Row>
      <AddUserModal
        isLoaded={userTableState.isLoaded}
        addUserModalState={userTableState.addUserModalState}
        cloaseAddUserModal={cloaseAddUserModal}
        firstname={userTableState.firstname}
        lastname={userTableState.lastname}
        selected_user_id={userTableState.selected_user_id}
        AddUserSubmit={AddUserSubmit}
      />
    </Aux>
  );
}

export default UsersTable;
