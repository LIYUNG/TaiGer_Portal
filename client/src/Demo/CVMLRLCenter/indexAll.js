import React, { useEffect, useState } from 'react';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import CVMLRLDashboard from './CVMLRLDashboard';
import ErrorPage from '../Utils/ErrorPage';
import { getAllCVMLRLOverview } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';

const CVMLRLCenterAll = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [indexAllState, setIndexAllState] = useState({
        error: '',
        isLoaded: false,
        data: null,
        success: false,
        students: null,
        status: '', //reject, accept... etc
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        getAllCVMLRLOverview().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setIndexAllState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        students: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setIndexAllState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setIndexAllState((prevState) => ({
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
    const { res_status, isLoaded } = indexAllState;
    TabTitle('CV ML RL Center');
    if (!isLoaded && !indexAllState.students) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

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
                    {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('Tasks Dashboard', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <CVMLRLDashboard
                isLoaded={indexAllState.isLoaded}
                students={indexAllState.students}
                success={indexAllState.success}
                user={user}
            />
        </Box>
    );
};

export default CVMLRLCenterAll;
