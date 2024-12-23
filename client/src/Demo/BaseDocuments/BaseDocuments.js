import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import BaseDocument_StudentView from './BaseDocument_StudentView';
import { SYMBOL_EXPLANATION } from '../Utils/contants';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { BaseDocumentsTable } from './BaseDocumentsTable';
import { useQuery } from '@tanstack/react-query';
import { getStudentsAndDocLinks2Query } from '../../api/query';

function BaseDocuments() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data, isLoading, isError, error } = useQuery(
    getStudentsAndDocLinks2Query()
  );

  TabTitle('Base Documents');

  const students = data?.data;

  const StudentDocoumentsView = () =>
    students?.map((student, i) => (
      <Card key={i}>
        <BaseDocument_StudentView
          student={student}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        />
      </Card>
    ));

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
        {is_TaiGer_role(user) && (
          <Typography color="text.primary">
            {t('My Students', { ns: 'common' })}
          </Typography>
        )}
        {is_TaiGer_role(user) ? (
          <Typography color="text.primary">
            {t('Base Documents', { ns: 'common' })}
          </Typography>
        ) : (
          <Typography color="text.primary">
            {t('My Documents', { ns: 'common' })}
          </Typography>
        )}
      </Breadcrumbs>
      {isLoading && <Loading />}
      {isError && <>{error}</>}
      {!isLoading &&
        !isError &&
        (is_TaiGer_role(user) ? (
          <BaseDocumentsTable students={students} />
        ) : (
          <StudentDocoumentsView />
        ))}
    </Box>
  );
}

export default BaseDocuments;
