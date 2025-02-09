import React from 'react';
import { Box } from '@mui/material';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';

import ApplicationOverviewTabs from './ApplicationOverviewTabs';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { getAllActiveStudentsQuery } from '../../api/query';
import { BreadcrumbsNavigation } from '../../components/BreadcrumbsNavigation/BreadcrumbsNavigation';

const AllApplicantsOverview = () => {
    const { data } = useQuery(getAllActiveStudentsQuery());

    TabTitle(i18next.t('All Applications Overview'));

    return (
        <Box>
            <BreadcrumbsNavigation
                items={[
                    { label: appConfig.companyName, link: DEMO.DASHBOARD_LINK },
                    {
                        label: i18next.t('All Students', { ns: 'common' }),
                        link: DEMO.DASHBOARD_LINK
                    },
                    {
                        label: i18next.t('All Students Applications Overview', {
                            ns: 'common'
                        })
                    }
                ]}
            />
            <ApplicationOverviewTabs students={data.data} />
        </Box>
    );
};

export default AllApplicantsOverview;
