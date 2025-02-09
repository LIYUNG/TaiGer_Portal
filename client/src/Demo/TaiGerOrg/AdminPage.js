import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import ErrorPage from '../Utils/ErrorPage';
import { getTeamMembers } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

const AdminPage = () => {
    const { user } = useAuth();
    const [adminPageState, setAdminPageState] = useState({
        error: '',
        role: '',
        isLoaded: false,
        data: null,
        success: false,
        admin: [],
        academic_background: {},
        application_preference: {},
        updateconfirmed: false,
        res_status: 0
    });

    useEffect(() => {
        getTeamMembers().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setAdminPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        admin: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setAdminPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setAdminPageState((prevState) => ({
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

    const { res_status, isLoaded } = adminPageState;

    if (!isLoaded && !adminPageState.admin) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    TabTitle(`${appConfig.companyName} Admin`);

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
                    {appConfig.companyName} Team
                </Typography>
            </Breadcrumbs>
            <Card>
                <Typography>Admin: </Typography>
                <Typography fontWeight="bold">
                    {adminPageState.admin.firstname}{' '}
                    {adminPageState.admin.lastname}
                </Typography>
            </Card>
        </Box>
    );
};

export default AdminPage;
