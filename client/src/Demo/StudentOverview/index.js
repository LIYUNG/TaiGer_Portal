import React from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import StudentOverviewTable from '../../components/StudentOverviewTable';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import { getAllActiveStudentsQuery } from '../../api/query';

const StudentOverviewPage = () => {
    const { user } = useAuth();
    const { data } = useQuery(getAllActiveStudentsQuery());

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(i18next.t('Students Overview', { ns: 'common' }));

    return (
        <Box data-testid="student_overview">
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
                    {i18next.t('All Active Student Overview', { ns: 'common' })}{' '}
                    ({data?.data?.length})
                </Typography>
            </Breadcrumbs>
            <StudentOverviewTable
                students={data?.data}
                title="All"
                user={user}
            />
        </Box>
    );
};

export default StudentOverviewPage;
