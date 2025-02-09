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
import { is_TaiGer_Admin, is_TaiGer_role, Role } from '@taiger-common/core';
import i18next from 'i18next';

import ErrorPage from '../Utils/ErrorPage';
import { getTeamMembers, updateUserPermission } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import GrantPermissionModal from './GrantPermissionModal';
import GrantManagerModal from './GrantManagerModal';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

const EditorRow = ({ editor, setModalShow, user }) => {
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
                    aria-controls={open ? `basic-menu` : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    id="basic-button"
                    onClick={handleClick}
                    variant="contained"
                >
                    {i18next.t('Edit', { ns: 'common' })}
                </Button>
                <Menu
                    MenuListProps={{
                        'aria-labelledby': 'basic-button'
                    }}
                    anchorEl={anchorEl}
                    disabled={!is_TaiGer_Admin(user)}
                    id="basic-menu"
                    onClose={handleClose}
                    open={open}
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

const AgentRow = ({ agent, setModalShow, user }) => {
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
                    aria-controls={open ? `basic-menu` : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    id="basic-button"
                    onClick={handleClick}
                    variant="contained"
                >
                    {i18next.t('Edit', { ns: 'common' })}
                </Button>
                <Menu
                    MenuListProps={{
                        'aria-labelledby': 'basic-button'
                    }}
                    anchorEl={anchorEl}
                    disabled={!is_TaiGer_Admin(user)}
                    id="basic-menu"
                    onClose={() => setAnchorEl(null)}
                    open={open}
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

// TODO TEST_CASE
const TaiGerOrg = () => {
    const { user } = useAuth();

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
                            member._id.toString() ===
                            taiGerOrgState.selected_user_id
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
        (member) => member.role === Role.Admin
    );
    const agents = taiGerOrgState.teams.filter(
        (member) => member.role === Role.Agent
    );
    // const managers = taiGerOrgState.teams.filter(
    //   (member) => member.role === 'Manager'
    // );
    const editors = taiGerOrgState.teams.filter(
        (member) => member.role === Role.Editor
    );

    return (
        <Box>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                    {i18next.t('tenant-team', {
                        ns: 'common',
                        tenant: appConfig.companyName
                    })}
                </Typography>
                <Typography color="text.primary">
                    {i18next.t('Permissions Management', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Card>
                {is_TaiGer_Admin(user) ? (
                    <>
                        <Typography variant="h5">Admin:</Typography>
                        {admins.map((admin, i) => (
                            <Typography key={i}>
                                <b>
                                    <Link
                                        to={`${DEMO.TEAM_ADMIN_LINK(admin._id.toString())}`}
                                    >
                                        {admin.firstname} {admin.lastname}
                                    </Link>
                                </b>
                            </Typography>
                        ))}
                    </>
                ) : null}
            </Card>
            <Card>
                <Typography variant="h5">
                    {i18next.t('Agent', { ns: 'common' })}:
                </Typography>
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {i18next.t('Name', { ns: 'common' })}
                                </TableCell>
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
                                <AgentRow
                                    agent={agent}
                                    key={i}
                                    setModalShow={setModalShow}
                                    user={user}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <Card>
                <Typography variant="h5">
                    {i18next.t('Editor', { ns: 'common' })}:
                </Typography>
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
                                <EditorRow
                                    editor={editor}
                                    key={i}
                                    setModalShow={setModalShow}
                                    user={user}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            {taiGerOrgState.modalShow ? (
                <GrantPermissionModal
                    firstname={taiGerOrgState.firstname}
                    lastname={taiGerOrgState.lastname}
                    modalShow={taiGerOrgState.modalShow}
                    onUpdatePermissions={onUpdatePermissions}
                    setModalHide={setModalHide}
                    user_permissions={taiGerOrgState.user_permissions}
                />
            ) : null}
            {taiGerOrgState.managerModalShow ? (
                <GrantManagerModal
                    firstname={taiGerOrgState.firstname}
                    lastname={taiGerOrgState.lastname}
                    managerModalShow={taiGerOrgState.managerModalShow}
                    onUpdatePermissions={onUpdatePermissions}
                    setManagerModalHide={setManagerModalHide}
                    user_permissions={taiGerOrgState.user_permissions}
                />
            ) : null}
        </Box>
    );
};

export default TaiGerOrg;
