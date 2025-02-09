import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import { TabTitle } from '../../Utils/TabTitle';
import TabProgramConflict from '../../Dashboard/MainViewTab/ProgramConflict/TabProgramConflict';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { getApplicationConflicts } from '../../../api';
import DEMO from '../../../store/constant';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { useAuth } from '../../../components/AuthProvider';
import { appConfig } from '../../../config';
import Loading from '../../../components/Loading/Loading';
import { useTranslation } from 'react-i18next';

const ProgramConflictDashboard = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [ProgramConflictDashboardState, setProgramConflictDashboardState] =
        useState({
            error: '',
            agent_list: [],
            editor_list: [],
            isLoaded: false,
            students: [],
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
        getApplicationConflicts().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setProgramConflictDashboardState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        students: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setProgramConflictDashboardState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setProgramConflictDashboardState((prevState) => ({
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
        ProgramConflictDashboardState;
    TabTitle('Program Conflict Dashboard');
    if (!isLoaded || !ProgramConflictDashboardState.students) {
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
                    {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('Program Conflicts', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <TabProgramConflict
                students={ProgramConflictDashboardState.students}
            />
        </Box>
    );
};

export default ProgramConflictDashboard;
