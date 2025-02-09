import React, { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { Box } from '@mui/material';

import { TabTitle } from '../Utils/TabTitle';

import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading/Loading';
import CustomerSupportBody from './CustomerSupportBody';

const CustomerSupport = () => {
    const { t } = useTranslation();
    const { complaintTickets } = useLoaderData();

    TabTitle(t('Customer Center', { ns: 'common' }));

    return (
        <Box data-testid="customer_support">
            <Suspense fallback={<Loading />}>
                <Await resolve={complaintTickets}>
                    {(loadedData) => (
                        <CustomerSupportBody complaintTickets={loadedData} />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
};

export default CustomerSupport;
