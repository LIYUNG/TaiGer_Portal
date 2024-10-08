import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Link,
  Menu,
  MenuItem,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_Admin, is_TaiGer_role } from '../Utils/checking-functions';
import { getTeamMembers, updateUserPermission } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import GrantPermissionModal from './GrantPermissionModal';
import GrantManagerModal from './GrantManagerModal';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

// TODO TEST_CASE
function TaiGerOrg() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [taiGerOrgState, setTaiGerOrgState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    modalShow: false,
    managerModalShow: false,
    firstname: '',
    lastname: '',
    selected_user_id: '',
    user_permissions: [],
    teams: null,
    res_status: 0
  });
  useEffect(() => {
    getTeamMembers().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setTaiGerOrgState((prevState) => ({
            ...prevState,
            isLoaded: true,
            teams: data,
            success: success,
            res_status: status
          }));
        } else {
          setTaiGerOrgState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOrgState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const setModalShow = (
    user_firstname,
    user_lastname,
    user_id,
    permissions
  ) => {
    setTaiGerOrgState((prevState) => ({
      ...prevState,
      modalShow: true,
      firstname: user_firstname,
      lastname: user_lastname,
      selected_user_id: user_id,
      user_permissions: permissions
    }));
  };

  const setModalHide = () => {
    setTaiGerOrgState((prevState) => ({
      ...prevState,
      modalShow: false
    }));
  };

  const setManagerModalHide = () => {
    setTaiGerOrgState((prevState) => ({
      ...prevState,
      managerModalShow: false
    }));
  };

  const onUpdatePermissions = (e, permissions) => {
    e.preventDefault();
    updateUserPermission(taiGerOrgState.selected_user_id, permissions).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let teams_temp = [...taiGerOrgState.teams];
          let team_member = teams_temp.find(
            (member) =>
              member._id.toString() === taiGerOrgState.selected_user_id
          );
          team_member.permissions = [data];
          setTaiGerOrgState((prevState) => ({
            ...prevState,
            isLoaded: true,
            modalShow: false,
            teams: teams_temp,
            firstname: '',
            lastname: '',
            selected_user_id: '',
            success: success,
            res_status: status
          }));
        } else {
          setTaiGerOrgState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setTaiGerOrgState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(`${appConfig.companyName} Team Permissions Management`);
  const { res_status, isLoaded } = taiGerOrgState;

  if (!isLoaded && !taiGerOrgState.teams) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  const admins = taiGerOrgState.teams.filter(
    (member) => member.role === 'Admin'
  );
  const agents = taiGerOrgState.teams.filter(
    (member) => member.role === 'Agent'
  );
  // const managers = taiGerOrgState.teams.filter(
  //   (member) => member.role === 'Manager'
  // );
  const editors = taiGerOrgState.teams.filter(
    (member) => member.role === 'Editor'
  );

  const EditorRow = ({ editor }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <TableRow>
        <TableCell>
          <Typography>
            <Link
              component={LinkDom}
              to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
            >
              {editor.firstname} {editor.lastname}{' '}
            </Link>
          </Typography>
        </TableCell>
        <TableCell>
          {editor.permissions.length > 0
            ? editor.permissions[0].canAssignAgents
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {editor.permissions.length > 0
            ? editor.permissions[0].canAssignEditors
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {editor.permissions.length > 0
            ? editor.permissions[0].canModifyDocumentation
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {editor.permissions.length > 0
            ? editor.permissions[0].canAccessStudentDatabase
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {editor.permissions.length > 0
            ? editor.permissions[0].canUseTaiGerAI
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          <span>{editor.permissions[0]?.taigerAiQuota | 0}</span>
        </TableCell>
        <TableCell>
          <Button
            id="basic-button"
            variant="contained"
            aria-controls={open ? `basic-menu` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            {t('Edit', { ns: 'common' })}
          </Button>
          <Menu
            id={`basic-menu`}
            anchorEl={anchorEl}
            disabled={!is_TaiGer_Admin(user)}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem
              onClick={() =>
                setModalShow(
                  editor.firstname,
                  editor.lastname,
                  editor._id.toString(),
                  editor.permissions
                )
              }
            >
              Permission
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    );
  };

  const AgentRow = ({ agent }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    return (
      <TableRow>
        <TableCell>
          <Typography>
            <Link
              component={LinkDom}
              to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
            >
              {agent.firstname} {agent.lastname}{' '}
            </Link>
          </Typography>
        </TableCell>
        <TableCell>
          {agent.permissions?.length > 0
            ? agent.permissions[0].canModifyProgramList
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {agent.permissions?.length > 0
            ? agent.permissions[0].canModifyAllBaseDocuments
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {agent.permissions?.length > 0
            ? agent.permissions[0].canAccessAllChat
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {agent.permissions?.length > 0
            ? agent.permissions[0].canAssignAgents
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {agent.permissions?.length > 0
            ? agent.permissions[0].canAssignEditors
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {agent.permissions?.length > 0
            ? agent.permissions[0].canModifyDocumentation
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {agent.permissions?.length > 0
            ? agent.permissions[0].canAccessStudentDatabase
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          {agent.permissions.length > 0
            ? agent.permissions[0].canUseTaiGerAI
              ? 'O'
              : 'X'
            : 'x'}
        </TableCell>
        <TableCell>
          <span>{agent.permissions[0]?.taigerAiQuota | 0}</span>
        </TableCell>
        <TableCell>
          <Button
            id="basic-button"
            variant="contained"
            aria-controls={open ? `basic-menu` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            {t('Edit', { ns: 'common' })}
          </Button>
          <Menu
            id={`basic-menu`}
            anchorEl={anchorEl}
            disabled={!is_TaiGer_Admin(user)}
            open={open}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem
              onClick={() =>
                setModalShow(
                  agent.firstname,
                  agent.lastname,
                  agent._id.toString(),
                  agent.permissions
                )
              }
            >
              Permission
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    );
  };
  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">Permissions Management</Typography>
      </Breadcrumbs>
      <Card>
        {is_TaiGer_Admin(user) && (
          <>
            <Typography variant="h5">Admin:</Typography>
            {admins.map((admin, i) => (
              <Typography key={i}>
                <b>
                  <Link to={`${DEMO.TEAM_ADMIN_LINK(admin._id.toString())}`}>
                    {admin.firstname} {admin.lastname}
                  </Link>
                </b>
              </Typography>
            ))}
          </>
        )}
      </Card>
      <Card>
        <Typography variant="h5">{t('Agent', { ns: 'common' })}:</Typography>
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('Name', { ns: 'common' })}</TableCell>
                <TableCell>
                  Can modify
                  <br /> program list
                </TableCell>
                <TableCell>
                  Can modify all
                  <br /> Base Documents
                </TableCell>
                <TableCell>
                  Can Access <br /> AllChat
                </TableCell>
                <TableCell>
                  Can Assign <br /> Agents
                </TableCell>
                <TableCell>
                  Can Assign <br /> Editors
                </TableCell>
                <TableCell>
                  Can Modify <br /> Docs
                </TableCell>
                <TableCell>
                  Can Access <br /> Students
                </TableCell>
                <TableCell>
                  Can User <br /> TaiGerAI
                </TableCell>
                <TableCell>
                  TaiGerAI <br /> Quota
                </TableCell>
                <TableCell>Permissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent, i) => (
                <AgentRow agent={agent} key={i} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card>
        <Typography variant="h5">{t('Editor', { ns: 'common' })}:</Typography>
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Can Assign Agents</TableCell>
                <TableCell>Can Assign Editors</TableCell>
                <TableCell>Can Modify Docs</TableCell>
                <TableCell>Can Access Students</TableCell>
                <TableCell>
                  Can User <br /> TaiGerAI
                </TableCell>
                <TableCell>
                  TaiGerAI <br /> Quota
                </TableCell>
                <TableCell>Permissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editors.map((editor, i) => (
                <EditorRow editor={editor} key={i} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {taiGerOrgState.modalShow && (
        <GrantPermissionModal
          modalShow={taiGerOrgState.modalShow}
          firstname={taiGerOrgState.firstname}
          lastname={taiGerOrgState.lastname}
          user_permissions={taiGerOrgState.user_permissions}
          setModalHide={setModalHide}
          onUpdatePermissions={onUpdatePermissions}
        />
      )}
      {taiGerOrgState.managerModalShow && (
        <GrantManagerModal
          managerModalShow={taiGerOrgState.managerModalShow}
          firstname={taiGerOrgState.firstname}
          lastname={taiGerOrgState.lastname}
          user_permissions={taiGerOrgState.user_permissions}
          setManagerModalHide={setManagerModalHide}
          onUpdatePermissions={onUpdatePermissions}
        />
      )}
    </Box>
  );
}

export default TaiGerOrg;
