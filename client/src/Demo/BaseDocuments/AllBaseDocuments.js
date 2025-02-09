import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useQuery } from '@tanstack/react-query';

import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { BaseDocumentsTable } from './BaseDocumentsTable';
import { getAllActiveStudentsQuery } from '../../api/query';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const AllBaseDocuments = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const { data } = useQuery(getAllActiveStudentsQuery());

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    TabTitle(t('All Documents', { ns: 'common' }));

    return (
        <Box>
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: t('All Students', { ns: 'common' }),
                        link: DEMO.DASHBOARD_LINK
                    },
                    {
                        label: t('All Documents', { ns: 'common' })
                    }
                ]}
            />
            {is_TaiGer_role(user) ? (
                <BaseDocumentsTable students={data.data} />
            ) : null}
        </Box>
    );
};

export default AllBaseDocuments;
