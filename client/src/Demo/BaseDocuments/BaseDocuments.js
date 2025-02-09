import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';
import { Box, Breadcrumbs, Card, Link, Typography } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import BaseDocumentStudentView from './BaseDocumentStudentView';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { BaseDocumentsTable } from './BaseDocumentsTable';
import { useQuery } from '@tanstack/react-query';
import { getStudentsAndDocLinks2Query } from '../../api/query';

const BaseDocuments = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { data, isLoading, isError, error } = useQuery(
        getStudentsAndDocLinks2Query()
    );

    TabTitle('Base Documents');

    const students = data?.data;
    const base_docs_link = data?.base_docs_link;

    const StudentDocoumentsView = () =>
        students?.map((student, i) => (
            <Card key={i}>
                <BaseDocumentStudentView
                    base_docs_link={base_docs_link}
                    student={student}
                />
            </Card>
        ));

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
                {is_TaiGer_role(user) ? (
                    <Typography color="text.primary">
                        {t('My Students', { ns: 'common' })}
                    </Typography>
                ) : null}
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
            {isLoading ? <Loading /> : null}
            {isError ? error : null}
            {!isLoading && !isError ? (
                is_TaiGer_role(user) ? (
                    <BaseDocumentsTable students={students} />
                ) : (
                    <StudentDocoumentsView />
                )
            ) : null}
        </Box>
    );
};

export default BaseDocuments;
