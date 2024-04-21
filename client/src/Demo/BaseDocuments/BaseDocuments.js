import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';

import BaseDocument_StudentView from './BaseDocument_StudentView';
import { SYMBOL_EXPLANATION } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import { is_TaiGer_role } from '../Utils/checking-functions';

import { getStudentsAndDocLinks } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { BaseDocumentsTable } from './BaseDocumentsTable';

function BaseDocuments() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [baseDocumentsState, setBaseDocumentsState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    base_docs_link: null,
    success: false,
    students: null,
    res_status: 0
  });

  useEffect(() => {
    getStudentsAndDocLinks().then(
      (resp) => {
        const { base_docs_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: data,
            base_docs_link,
            success: success,
            res_status: status
          }));
        } else {
          setBaseDocumentsState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setBaseDocumentsState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  const { res_status, base_docs_link, isLoaded } = baseDocumentsState;

  TabTitle('Base Documents');

  if (!isLoaded && !baseDocumentsState.students) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const student_profile_student_view = baseDocumentsState.students.map(
    (student, i) => (
      <Card key={i}>
        <BaseDocument_StudentView
          base_docs_link={base_docs_link}
          student={student}
          SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
        />
      </Card>
    )
  );

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
        <Typography color="text.primary">{t('Base Documents')}</Typography>
      </Breadcrumbs>

      {is_TaiGer_role(user) ? (
        <BaseDocumentsTable students={baseDocumentsState.students} />
      ) : (
        <>{student_profile_student_view}</>
      )}
    </Box>
  );
}

export default BaseDocuments;
