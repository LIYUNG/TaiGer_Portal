import React from 'react';
import { Box } from '@mui/material';
import { Navigate, useLoaderData } from 'react-router-dom';
import { is_TaiGer_Student, is_TaiGer_role } from '@taiger-common/core';
import i18next from 'i18next';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const ApplicantsOverview = () => {
    const { user } = useAuth();
    const {
        data: { data: fetchedStudents }
    } = useLoaderData();

    if (is_TaiGer_Student(user)) {
        return (
            <Navigate
                to={`${DEMO.STUDENT_APPLICATIONS_LINK}/${user._id.toString()}`}
            />
        );
    }
    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const myStudents = fetchedStudents.filter(
        (student) =>
            student.editors.some(
                (editor) => editor._id === user._id.toString()
            ) ||
            student.agents.some((agent) => agent._id === user._id.toString())
    );
    TabTitle(
        i18next.t('Applications Overview', {
            ns: 'common'
        })
    );

    return (
        <Box data-testid="application_overview_component">
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: is_TaiGer_role(user)
                            ? `${i18next.t('My Students Application Overview')}`
                            : `${user.firstname} ${user.lastname} Applications Overview`
                    }
                ]}
            />
            <ApplicationOverviewTabs students={myStudents} />
        </Box>
    );
};

export default ApplicantsOverview;
