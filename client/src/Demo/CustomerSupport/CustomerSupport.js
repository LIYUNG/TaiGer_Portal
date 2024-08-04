import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Link, Breadcrumbs, Typography } from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { useTranslation } from 'react-i18next';

function CustomerSupportBody({ students }) {
  const { t } = useTranslation();
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
          {t('Customer Center', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      {students.map((student) => (
        <Typography key={student._id.toString()}>
          {student.firstname}
        </Typography>
      ))}
    </Box>
  );
}

export default CustomerSupportBody;
