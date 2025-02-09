import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Breadcrumbs } from '@mui/material';
import PropTypes from 'prop-types';
import { Navigate, Link as LinkDom, useLocation } from 'react-router-dom';
import { Link } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';

import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../../components/Tabs';
import {
    INTERNAL_DASHBOARD_REVERSED_TABS,
    INTERNAL_DASHBOARD_TABS
} from '../../../utils/contants.js';
import OverviewDashboardTab from './OverviewDashboardTab';
import AgentDashboard from './AgentDashboard';
import KPIDashboardTab from './KPIDashboardTab';
import ProgramListDashboardTab from './ProgramListDashboardTab';
import ResponseTimeDashboardTab from './ResponseTimeDashboardTab';
import { calculateDuration } from '../../Utils/checking-functions';
import { getStatisticsQuery } from '../../../api/query.js';

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

const InternalDashboard = () => {
    const { user } = useAuth();
    const { hash } = useLocation();
    const { data, isLoading } = useQuery(getStatisticsQuery());
    const [value, setValue] = useState(
        INTERNAL_DASHBOARD_TABS[hash.replace('#', '')] || 0
    );

    if (isLoading || !data) {
        return <Loading />;
    }

    const {
        // success,
        // students,
        agents_data,
        editors_data,
        finished_docs,
        documents,
        students_years_pair,
        students_details,
        programListStats,
        studentAvgResponseTime,
        // activeStudentGeneralTasks,
        // activeStudentTasks,
        agentStudentDistribution
    } = data;

    const handleChange = (event, newValue) => {
        setValue(newValue);
        window.location.hash = INTERNAL_DASHBOARD_REVERSED_TABS[newValue];
    };

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle(`${appConfig.companyName} Dashboard`);

    const refactor_finished_cv_docs = finished_docs
        .filter(
            (doc) =>
                doc.messages.length !== 0 &&
                doc.messages.length > 2 &&
                doc.file_type === 'CV'
        )
        .map((finished_doc) => {
            const start_date = finished_doc.messages[0].createdAt;
            const end_date =
                finished_doc.messages[finished_doc.messages.length - 1]
                    .createdAt;
            return {
                name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
                start: start_date,
                end: end_date
            };
        });
    const CVdataWithDuration = refactor_finished_cv_docs.map((item) => ({
        ...item,
        name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
        uv: calculateDuration(item.start, item.end)
    }));

    const refactor_finished_ml_docs = finished_docs
        .filter(
            (doc) =>
                doc.messages.length !== 0 &&
                doc.messages.length > 2 &&
                doc.file_type === 'ML'
        )
        .map((finished_doc) => {
            const start_date = finished_doc.messages[0].createdAt;
            const end_date =
                finished_doc.messages[finished_doc.messages.length - 1]
                    .createdAt;
            return {
                name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
                start: start_date,
                end: end_date
            };
        });
    const MLdataWithDuration = refactor_finished_ml_docs.map((item) => ({
        ...item,
        name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
        uv: calculateDuration(item.start, item.end)
    }));

    const refactor_finished_rl_docs = finished_docs
        .filter(
            (doc) =>
                doc.messages.length !== 0 &&
                doc.messages.length > 2 &&
                (doc.file_type === 'RL_A' ||
                    doc.file_type === 'RL_B' ||
                    doc.file_type === 'RL_C' ||
                    doc.file_type === 'Recommendation_Letter_A' ||
                    doc.file_type === 'Recommendation_Letter_B' ||
                    doc.file_type === 'Recommendation_Letter_C')
        )
        .map((finished_doc) => {
            const start_date = finished_doc.messages[0].createdAt;
            const end_date =
                finished_doc.messages[finished_doc.messages.length - 1]
                    .createdAt;
            return {
                name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
                start: start_date,
                end: end_date
            };
        });
    const RLdataWithDuration = refactor_finished_rl_docs.map((item) => ({
        ...item,
        name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
        uv: calculateDuration(item.start, item.end)
    }));

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
                    {i18next.t('tenant-team', {
                        ns: 'common',
                        tenant: appConfig.companyName
                    })}
                </Typography>
                <Typography color="text.primary">
                    {i18next.t('tenant-dashboard', {
                        ns: 'common',
                        tenant: appConfig.companyName
                    })}
                </Typography>
            </Breadcrumbs>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    aria-label="basic tabs example"
                    indicatorColor="primary"
                    onChange={handleChange}
                    scrollButtons="auto"
                    value={value}
                    variant="scrollable"
                >
                    <Tab label="Overview" {...a11yProps(value, 0)} />
                    <Tab label="Agents" {...a11yProps(value, 1)} />
                    <Tab label="KPI" {...a11yProps(value, 2)} />
                    <Tab label="Program List" {...a11yProps(value, 3)} />
                    <Tab label="Response Time" {...a11yProps(value, 4)} />
                </Tabs>
            </Box>
            <CustomTabPanel index={0} value={value}>
                <OverviewDashboardTab
                    agentData={agents_data}
                    documents={documents}
                    editorData={editors_data}
                    studentDetails={students_details}
                    studentsYearsPair={students_years_pair}
                />
            </CustomTabPanel>
            <CustomTabPanel index={1} value={value}>
                <AgentDashboard
                    agentStudentDistribution={agentStudentDistribution}
                />
            </CustomTabPanel>
            <CustomTabPanel index={2} value={value}>
                <KPIDashboardTab
                    CVdataWithDuration={CVdataWithDuration}
                    MLdataWithDuration={MLdataWithDuration}
                    RLdataWithDuration={RLdataWithDuration}
                />
            </CustomTabPanel>
            <CustomTabPanel index={3} value={value}>
                <ProgramListDashboardTab data={programListStats} />
            </CustomTabPanel>
            <CustomTabPanel index={4} value={value}>
                <ResponseTimeDashboardTab
                    agents={agents_data.reduce((acc, agent) => {
                        acc[agent._id] = {
                            firstname: agent.firstname,
                            lastname: agent.lastname
                        };
                        return acc;
                    }, {})}
                    editors={editors_data.reduce((acc, editor) => {
                        acc[editor._id] = {
                            firstname: editor.firstname,
                            lastname: editor.lastname
                        };
                        return acc;
                    }, {})}
                    studentAvgResponseTime={studentAvgResponseTime}
                />
            </CustomTabPanel>
        </Box>
    );
};

export default InternalDashboard;
