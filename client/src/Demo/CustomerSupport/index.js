import React, { Suspense } from 'react';
import { Navigate, useLoaderData, Await } from 'react-router-dom';
import { Box } from '@mui/material';

import { TabTitle } from '../Utils/TabTitle';
import { is_TaiGer_role } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading/Loading';
import CustomerSupportBody from './CustomerSupport';

function CustomerSupport() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { complaintTickets } = useLoaderData();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
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
}

export default CustomerSupport;
