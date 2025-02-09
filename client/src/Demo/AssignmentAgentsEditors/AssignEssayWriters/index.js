import React from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AssignEssayWritersPage from './AssignEssayWritersPage';
import { is_TaiGer_role } from '@taiger-common/core';

import DEMO from '../../../store/constant';
import { useAuth } from '../../../components/AuthProvider';
import { appConfig } from '../../../config';
import { BreadcrumbsNavigation } from '../../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

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
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: t('Assign Essay Writer', { ns: 'common' })
                    }
                ]}
            />
            <AssignEssayWritersPage
                essayDocumentThreads={essayDocumentThreads}
            />
        </Box>
    );
};

export default AssignEssayWriters;
