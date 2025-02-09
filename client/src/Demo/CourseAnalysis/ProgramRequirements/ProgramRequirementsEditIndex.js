import React, { Suspense } from 'react';
import { Await, useLoaderData, Link as LinkDom } from 'react-router-dom';
import i18next from 'i18next';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';

import { TabTitle } from '../../Utils/TabTitle';
import Loading from '../../../components/Loading/Loading';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';
import ProgramRequirementsNew from './ProgramRequirementsNew';

const ProgramRequirementsEditIndex = () => {
    const { programRequirement } = useLoaderData();
    TabTitle(i18next.t('Program Requirement Edit'));

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
                    {i18next.t('Program List', { ns: 'common' })}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.PROGRAM_ANALYSIS}`}
                    underline="hover"
                >
                    {i18next.t('Program Requirements', { ns: 'common' })}
                </Link>
                <Typography color="text.primary">
                    {i18next.t('Edit', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Suspense fallback={<Loading />}>
                <Await resolve={programRequirement}>
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

export default ProgramRequirementsEditIndex;
