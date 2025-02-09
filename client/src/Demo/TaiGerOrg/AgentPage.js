import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import ApplicationOverviewTabs from '../ApplicantsOverview/ApplicationOverviewTabs';
import ErrorPage from '../Utils/ErrorPage';
import { getAgent } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

// TODO TEST_CASE
const AgentPage = () => {
    const { user_id } = useParams();
    const { user } = useAuth();
    const [agentPageState, setAgentPageState] = useState({
        error: '',
        role: '',
        isLoaded: false,
        data: null,
        success: false,
        students: null,
        agent: null,
        res_status: 0
    });

    useEffect(() => {
        getAgent(user_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setAgentPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        students: data.students,
                        agent: data.agent,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setAgentPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setAgentPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, [user_id]);

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const { res_status, isLoaded } = agentPageState;

    if (!isLoaded && !agentPageState.students && !agentPageState.agent) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    TabTitle(
        `Agent: ${agentPageState.agent.firstname}, ${agentPageState.agent.lastname}`
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
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.TEAM_MEMBERS_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName} Team
                </Link>
                <Typography color="text.primary">
                    {agentPageState.agent.firstname}{' '}
                    {agentPageState.agent.lastname}
                    {` (${agentPageState.students.length})`}
                </Typography>
            </Breadcrumbs>
            <ApplicationOverviewTabs students={agentPageState.students} />
            <Link
                component={LinkDom}
                to={`${DEMO.TEAM_AGENT_ARCHIV_LINK(
                    agentPageState.agent._id.toString()
                )}`}
            >
                <Button color="primary" variant="contained">
                    See Archiv Student
                </Button>
            </Link>
        </Box>
    );
};

export default AgentPage;
