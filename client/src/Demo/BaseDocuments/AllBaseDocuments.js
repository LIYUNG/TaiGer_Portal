import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Await,
  Link as LinkDom,
  Navigate,
  useLoaderData
} from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { BaseDocumentsTable } from './BaseDocumentsTable';
import Loading from '../../components/Loading/Loading';

function AllBaseDocuments() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const { students } = useLoaderData();

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  TabTitle(t('All Documents', { ns: 'common' }));

  return (
    <Box>
      <Suspense fallback={<Loading />}>
        <Await resolve={students}>
          {(loadedData) => (
            <>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.DASHBOARD_LINK}`}
                >
                  {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                  {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                  {t('All Documents', { ns: 'common' })}
                </Typography>
              </Breadcrumbs>
              {is_TaiGer_role(user) && (
                <BaseDocumentsTable students={loadedData} />
              )}
            </>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default AllBaseDocuments;
