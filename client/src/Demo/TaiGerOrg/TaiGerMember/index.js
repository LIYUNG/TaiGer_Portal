import React, { useEffect, useState } from 'react';
import {
    Box,
    Breadcrumbs,
    Card,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_Admin, is_TaiGer_role, Role } from '@taiger-common/core';

import ErrorPage from '../../Utils/ErrorPage';

import { getTeamMembers } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';

const TaiGerMember = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [taiGerMemberState, setTaiGerMember] = useState({
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
    });

    useEffect(() => {
        getTeamMembers().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setTaiGerMember((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        teams: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setTaiGerMember((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setTaiGerMember((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(`${appConfig.companyName} Team Member`);
    const { res_status, isLoaded } = taiGerMemberState;

    if (!isLoaded && !taiGerMemberState.teams) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }
    const admins = taiGerMemberState.teams.filter(
        (member) => member.role === Role.Admin
    );
    const agents = taiGerMemberState.teams.filter(
        (member) => member.role === Role.Agent
    );
    const editors = taiGerMemberState.teams.filter(
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
                    {t('tenant-team', {
                        ns: 'common',
                        tenant: appConfig.companyName
                    })}
                </Typography>
                <Typography color="text.primary">
                    {t('tenant-members', {
                        ns: 'common',
                        tenant: appConfig.companyName
                    })}
                </Typography>
            </Breadcrumbs>
            <Card>
                {is_TaiGer_Admin(user) ? (
                    <>
                        <Typography variant="h5">
                            {t('Admin', { ns: 'common' })}:
                        </Typography>
                        {admins.map((admin, i) => (
                            <Typography fontWeight="bold" key={i}>
                                <Link
                                    component={LinkDom}
                                    to={`${DEMO.TEAM_ADMIN_LINK(admin._id.toString())}`}
                                >
                                    {admin.firstname} {admin.lastname}
                                </Link>
                            </Typography>
                        ))}
                    </>
                ) : null}

                <Typography variant="h5">
                    {t('Agent', { ns: 'common' })}:
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Name', { ns: 'common' })}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {agents.map((agent, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <b>
                                        <Link
                                            component={LinkDom}
                                            to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
                                        >
                                            {agent.firstname} {agent.lastname}{' '}
                                        </Link>
                                    </b>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Typography variant="h5">
                    {t('Editor', { ns: 'common' })}:
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {editors.map((editor, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <b>
                                        <Link
                                            component={LinkDom}
                                            to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
                                        >
                                            {editor.firstname} {editor.lastname}{' '}
                                        </Link>
                                    </b>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Box>
    );
};

export default TaiGerMember;
