import React, { Suspense } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Navigate, Link as LinkDom, useParams, Await } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'react-datasheet-grid/dist/style.css';
import { is_TaiGer_role } from '@taiger-common/core';
import i18next from 'i18next';

import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { appConfig } from '../../config';
import CourseWidgetBody from './CourseWidgetBody';
import { useQuery } from '@tanstack/react-query';
import { getProgramRequirementsQuery } from '../../api/query';

export default function CourseWidget() {
    const { user } = useAuth();
    const { student_id } = useParams();
    const { t } = useTranslation();

    const { data } = useQuery(getProgramRequirementsQuery());

    if (!student_id) {
        if (!is_TaiGer_role(user)) {
            return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
        }
    }

    TabTitle(i18next.t('Course Analyser', { ns: 'common' }));

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
                <Typography color="text.primary">
                    {t('Tools', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('Course Analyser', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Suspense fallback={<Loading />}>
                <Await resolve={data}>
                    {(loadedData) => (
                        <CourseWidgetBody
                            programRequirements={loadedData.data}
                        />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
}
