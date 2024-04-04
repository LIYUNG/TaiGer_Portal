import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import {
  Button,
  Tabs,
  Tab,
  Box,
  Link,
  Typography,
  Breadcrumbs
} from '@mui/material';
import PropTypes from 'prop-types';
import { AiOutlinePlus } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

import UsersList from './UsersList';
import AddUserModal from './AddUserModal';
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
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function UsersTable() {
  const { user } = useAuth();
  const { t } = useTranslation();
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
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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

  if (!is_TaiGer_Admin(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('User List');
  const { res_modal_message, res_modal_status, res_status, isLoaded } =
    userTableState;

  if (!isLoaded && !userTableState.users) {
    return <Loading />;
  }
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  const student_list = userTableState.users.filter((usr) =>
    is_TaiGer_Student(usr)
  );
  const agent_list = userTableState.users.filter((usr) => is_TaiGer_Agent(usr));
  const editor_list = userTableState.users.filter((usr) =>
    is_TaiGer_Editor(usr)
  );
  const admin_list = userTableState.users.filter((usr) => is_TaiGer_Admin(usr));

  return (
    <Box data-testid="users_table_page">
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">{t('User List')}</Typography>
      </Breadcrumbs>
      <Button
        fullWidth
        size="small"
        color="primary"
        variant="contained"
        onClick={openAddUserModal}
      >
        <AiOutlinePlus /> {t('Add New User')}
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          <Tab
            data-testid="users_table_page_student_tab"
            label={`${t('Student', { ns: 'common' })} (${
              student_list?.length
            })`}
            {...a11yProps(0)}
          />
          <Tab
            data-testid="users_table_page_agent_tab"
            label={`${t('Agents', { ns: 'common' })} (${agent_list.length})`}
            {...a11yProps(1)}
          />
          <Tab
            data-testid="users_table_page_editor_tab"
            label={`${t('Editor', { ns: 'common' })} (${editor_list.length})`}
            {...a11yProps(2)}
          />
          <Tab
            data-testid="users_table_page_admin_tab"
            label={`${t('Admin', { ns: 'common' })} (${admin_list.length})`}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UsersList
          success={userTableState.success}
          isLoaded={userTableState.isLoaded}
          users={student_list}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UsersList
          success={userTableState.success}
          isLoaded={userTableState.isLoaded}
          users={agent_list}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UsersList
          success={userTableState.success}
          isLoaded={userTableState.isLoaded}
          users={editor_list}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <UsersList
          success={userTableState.success}
          isLoaded={userTableState.isLoaded}
          users={admin_list}
        />
      </CustomTabPanel>
      <Button
        fullWidth
        size="small"
        color="primary"
        variant="contained"
        onClick={openAddUserModal}
      >
        <AiOutlinePlus /> {t('Add New User')}
      </Button>
      <AddUserModal
        isLoaded={userTableState.isLoaded}
        addUserModalState={userTableState.addUserModalState}
        cloaseAddUserModal={cloaseAddUserModal}
        firstname={userTableState.firstname}
        lastname={userTableState.lastname}
        selected_user_id={userTableState.selected_user_id}
        AddUserSubmit={AddUserSubmit}
      />
    </Box>
  );
}

export default UsersTable;
