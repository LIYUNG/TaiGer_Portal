import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { BaseDocumentsTable } from './BaseDocumentsTable';
import { useQuery } from '@tanstack/react-query';
import { getAllActiveStudentsQuery } from '../../api/query';

function AllBaseDocuments() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data } = useQuery(getAllActiveStudentsQuery());

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  TabTitle(t('All Documents', { ns: 'common' }));

  return (
    <Box>
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
      {is_TaiGer_role(user) && <BaseDocumentsTable students={data.data} />}
    </Box>
  );
}

export default AllBaseDocuments;
