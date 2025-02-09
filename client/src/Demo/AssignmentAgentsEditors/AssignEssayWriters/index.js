import React from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AssignEssayWritersPage from './AssignEssayWritersPage';
import { is_TaiGer_role } from '@taiger-common/core';

import DEMO from '../../../store/constant';
import { useAuth } from '../../../components/AuthProvider';
import { appConfig } from '../../../config';

const AssignEssayWriters = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const {
        data: { data: essayDocumentThreads }
    } = useLoaderData();

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
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
                    {t('Assign Essay Writer', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <AssignEssayWritersPage
                essayDocumentThreads={essayDocumentThreads}
            />
        </Box>
    );
}

export default AssignEssayWriters;
