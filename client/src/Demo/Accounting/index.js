import React, { useEffect, useState } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { Box, Card, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../Utils/ErrorPage';
import { getTeamMembers } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const Accounting = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [accountingState, setAccountingState] = useState({
        error: '',
        role: '',
        isLoaded: false,
        data: null,
        success: false,
        teams: null,
        res_status: 0
    });

    useEffect(() => {
        getTeamMembers().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setAccountingState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        teams: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setAccountingState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setAccountingState((prevState) => ({
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
    TabTitle(`${appConfig.companyName} Accounting`);
    const { res_status, isLoaded } = accountingState;

    if (!isLoaded && !accountingState.teams) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    const agents = accountingState.teams.filter(
        (member) => member.role === 'Agent'
    );
    const editors = accountingState.teams.filter(
        (member) => member.role === 'Editor'
    );

    return (
        <Box>
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: t('tenant-team', {
                            ns: 'common',
                            tenant: appConfig.companyName
                        }),
                        link: DEMO.DASHBOARD_LINK
                    },
                    {
                        label: t('tenant-accounting', {
                            ns: 'common',
                            tenant: appConfig.companyName
                        })
                    }
                ]}
            />
            <Card>
                <Typography variant="h5">
                    {t('Agents', {
                        ns: 'common'
                    })}
                    :
                </Typography>
                {agents.map((agent, i) => (
                    <Typography fontWeight="bold" key={i}>
                        <LinkDom
                            to={`${DEMO.ACCOUNTING_USER_ID_LINK(agent._id.toString())}`}
                        >
                            {agent.firstname} {agent.lastname}{' '}
                        </LinkDom>
                    </Typography>
                ))}
                <Typography variant="h5">
                    {t('Editors', {
                        ns: 'common'
                    })}
                    :
                </Typography>
                {editors.map((editor, i) => (
                    <Typography fontWeight="bold" key={i}>
                        <Link
                            to={`${DEMO.ACCOUNTING_USER_ID_LINK(editor._id.toString())}`}
                        >
                            {editor.firstname} {editor.lastname}{' '}
                        </Link>
                    </Typography>
                ))}
            </Card>
        </Box>
    );
};

export default Accounting;
