import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import i18next from 'i18next';
import { Navigate, Link as LinkDom } from 'react-router-dom';

import { TabTitle } from '../../Utils/TabTitle';
import TabProgramTaskDelta from '../../Dashboard/MainViewTab/ProgramTaskDelta/TabProgramTaskDelta';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { getApplicationTaskDeltas } from '../../../api';
import DEMO from '../../../store/constant';
import { useAuth } from '../../../components/AuthProvider';
import { appConfig } from '../../../config';
import Loading from '../../../components/Loading/Loading';

const ProgramTaskDeltaDashboard = () => {
    const { user } = useAuth();
    const [ProgramTaskDeltaDashboardState, setProgramTaskDeltaDashboardState] =
        useState({
            error: '',
            agent_list: [],
            editor_list: [],
            isLoaded: false,
            data: [],
            updateAgentList: {},
            updateEditorList: {},
            success: false,
            isDashboard: true,
            file: '',
            res_status: 0,
            res_modal_message: '',
            res_modal_status: 0
        });

    useEffect(() => {
        getApplicationTaskDeltas().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setProgramTaskDeltaDashboardState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        data: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setProgramTaskDeltaDashboardState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setProgramTaskDeltaDashboardState((prevState) => ({
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
    const { res_modal_status, res_modal_message, isLoaded, res_status } =
        ProgramTaskDeltaDashboardState;
    TabTitle('Program Task Diff Dashboard');
    if (!isLoaded || !ProgramTaskDeltaDashboardState.data) {
        return <Loading />;
    }
    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    return (
        <Box>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={this.ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
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
                    {i18next.t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {i18next.t('Program Task Diff', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <TabProgramTaskDelta deltas={ProgramTaskDeltaDashboardState.data} />
        </Box>
    );
};

export default ProgramTaskDeltaDashboard;
