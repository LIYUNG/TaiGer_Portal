import React, { Suspense } from 'react';
import { Await, useLoaderData, Link as LinkDom } from 'react-router-dom';
import { TabTitle } from '../../Utils/TabTitle';

import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import Loading from '../../../components/Loading/Loading';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';
import { useTranslation } from 'react-i18next';
import ProgramRequirementsNew from './ProgramRequirementsNew';

const ProgramRequirementsNewIndex = () => {
    const { t } = useTranslation();
    const { programsAndCourseKeywordSets } = useLoaderData();
    TabTitle('Program Requirement Creation');

    return (
        <Box data-testid="dashoboard_component">
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.PROGRAMS}`}
                    underline="hover"
                >
                    {t('Program List', { ns: 'common' })}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.PROGRAM_ANALYSIS}`}
                    underline="hover"
                >
                    {t('Program Requirements', { ns: 'common' })}
                </Link>
                <Typography color="text.primary">
                    {t('Create', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Suspense fallback={<Loading />}>
                <Await resolve={programsAndCourseKeywordSets}>
                    {(loadedData) => (
                        <ProgramRequirementsNew
                            programsAndCourseKeywordSets={loadedData}
                        />
                    )}
                </Await>
            </Suspense>
        </Box>
    );
};

export default ProgramRequirementsNewIndex;
