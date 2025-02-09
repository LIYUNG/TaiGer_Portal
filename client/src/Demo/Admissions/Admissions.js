import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as LinkDom, Navigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Tab, Tabs, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role } from '@taiger-common/core';

import AdmissionsTable from './AdmissionsTable';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { a11yProps, CustomTabPanel } from '../../components/Tabs';
import AdmissionsStat from './AdmissionsStat';
import { getAdmissionsQuery } from '../../api/query';

const Admissions = () => {
    const { user } = useAuth();
    const [value, setValue] = useState(0);
    const { t } = useTranslation();
    const { data, isLoading, isError, error } = useQuery(getAdmissionsQuery());
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const result = data?.result;
    const admissions = data?.data || [];

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(`${appConfig.companyName} Admissions`);

    return (
        <Box data-testid="admissinos_page">
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
                    {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('tenant-admissions', {
                        ns: 'common',
                        tenant: appConfig.companyName
                    })}
                </Typography>
            </Breadcrumbs>
            {isLoading ? <Loading /> : null}
            {isError ? <>{error}</> : null}
            {!isLoading && !isError ? (
                <>
                    <Box>
                        <Tabs
                            aria-label="basic tabs example"
                            onChange={handleChange}
                            scrollButtons="auto"
                            value={value}
                            variant="scrollable"
                        >
                            <Tab
                                label={`${t('Admissions', {
                                    ns: 'admissions'
                                })}`}
                                {...a11yProps(0)}
                            />
                            <Tab
                                label={`${t('Statistics', { ns: 'admissions' })}`}
                                {...a11yProps(1)}
                            />
                        </Tabs>
                    </Box>
                    <CustomTabPanel index={0} value={value}>
                        <AdmissionsTable admissions={admissions} />
                    </CustomTabPanel>
                    <CustomTabPanel index={1} value={value}>
                        <AdmissionsStat result={result} />
                    </CustomTabPanel>
                </>
            ) : null}
        </Box>
    );
};

export default Admissions;
