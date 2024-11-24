import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Tab, Box, Typography, Breadcrumbs } from '@mui/material';
import PropTypes from 'prop-types';
import { Navigate, Link as LinkDom, useLocation } from 'react-router-dom';
import { Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role } from '@taiger-common/core';

import ErrorPage from '../../Utils/ErrorPage';

import { getStatistics } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import ProgramListVisualization from './ProgramListVisualization/index';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../../components/Tabs';
import {
  INTERNAL_DASHBOARD_REVERSED_TABS,
  INTERNAL_DASHBOARD_TABS
} from '../../Utils/contants.js';

import OverviewDashboard from './OverviewDashboard.js';
import AgentDashboard from './AgentDashboard';
import KPIDashboard from './KPIDashboard';
import ResponseTimeDashboard from './ResponseTimeDashboard';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};
const fileTypes2 = [
  'communication',
  'CV',
  'ML',
  'RL_A',
  'RL_B',
  'RL_C',
  'Essay',
  'Supplementary_Form'
];

const responseTimeColumn = [
  {
    accessorKey: 'name', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
    filterVariant: 'autocomplete',
    filterFn: 'contains',
    header: 'First-, Last Name',
    size: 150,
    Cell: (params) => {
      const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
        params.row.original.id,
        DEMO.PROFILE_HASH
      )}`;
      return (
        <Box
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden'
            // textOverflow: 'ellipsis'
          }}
        >
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
            title={params.row.original.name}
          >
            {`${params.row.original.name}`}
          </Link>
        </Box>
      );
    }
  },
  {
    accessorKey: 'communication',
    header: 'Message',
    size: 120
  },
  {
    accessorKey: 'CV',
    header: 'CV',
    size: 120
  },
  {
    accessorKey: 'ML',
    header: 'ML',
    size: 120
  },
  {
    accessorKey: 'RL_A',
    header: 'RL_A',
    size: 120
  },
  {
    accessorKey: 'RL_B',
    header: 'RL_B',
    size: 120
  },
  {
    accessorKey: 'RL_C',
    header: 'RL_C',
    size: 120
  },
  {
    accessorKey: 'Essay',
    header: 'Essay',
    size: 120
  },
  {
    accessorKey: 'Supplementary_Form',
    header: 'Supplementary_Form',
    size: 120
  }
];
function InternalDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { hash } = useLocation();

  const memoizedColumnsMrt = useMemo(
    () => responseTimeColumn,
    [responseTimeColumn]
  );

  const [internalDashboardState, setInternalDashboardState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    students: null,
    documents: null,
    students_details: null,
    finished_docs: null,
    agents_data: null,
    students_years_pair: {},
    editors_data: null,
    activeStudentGeneralTasks: [],
    activeStudentTasks: [],
    res_status: 0
  });
  const [value, setValue] = useState(
    INTERNAL_DASHBOARD_TABS[hash.replace('#', '')] || 0
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
    window.location.hash = INTERNAL_DASHBOARD_REVERSED_TABS[newValue];
  };
  useEffect(() => {
    getStatistics().then(
      (resp) => {
        const {
          success,
          students,
          agents_data,
          editors_data,
          finished_docs,
          documents,
          students_years_pair,
          students_details,
          studentResponseTimeLookupTable,
          activeStudentGeneralTasks,
          activeStudentTasks,
          agentStudentDistribution
        } = resp.data;
        const { status } = resp;
        if (success) {
          setInternalDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            students: students,
            documents: documents,
            agents_data,
            agentStudentDistribution,
            activeStudentGeneralTasks,
            activeStudentTasks,
            students_years_pair,
            editors_data,
            finished_docs,
            students_details,
            success: success,
            res_status: status,
            studentResponseTimeLookupTable
          }));
        } else {
          setInternalDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setInternalDashboardState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  }, []);

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle(`${appConfig.companyName} Dashboard`);
  const {
    res_status,
    isLoaded,
    finished_docs,
    documents,
    agents_data,
    editors_data,
    students,
    students_years_pair,
    students_details,
    studentResponseTimeLookupTable
  } = internalDashboardState;

  if (!isLoaded && !students && !documents) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  // Normalize data by ensuring each object has all keys
  const normalizedResults = studentResponseTimeLookupTable.map((result) => {
    const normalizedResult = { ...result };
    fileTypes2.forEach((key) => {
      normalizedResult[key] = result[key] !== undefined ? result[key] : 0; // Set missing keys to null or undefined
    });
    return normalizedResult;
  });

  const calculateDuration = (start, end) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const duration = (endTime - startTime) / 86400000; // Duration in days
    return duration;
  };
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
        finished_doc.messages[finished_doc.messages.length - 1].createdAt;
      return {
        name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
        start: start_date,
        end: end_date
      };
    });
  const CVdataWithDuration = refactor_finished_cv_docs.map((item) => ({
    ...item,
    name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
    duration: calculateDuration(item.start, item.end)
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
        finished_doc.messages[finished_doc.messages.length - 1].createdAt;
      return {
        name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
        start: start_date,
        end: end_date
      };
    });
  const MLdataWithDuration = refactor_finished_ml_docs.map((item) => ({
    ...item,
    name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
    duration: calculateDuration(item.start, item.end)
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
        finished_doc.messages[finished_doc.messages.length - 1].createdAt;
      return {
        name: `${finished_doc.student_id?.firstname}-${finished_doc.student_id?.lastname}`,
        start: start_date,
        end: end_date
      };
    });
  const RLdataWithDuration = refactor_finished_rl_docs.map((item) => ({
    ...item,
    name: `${item.name}`, // Create a name for the item, e.g., Item 0, Item 1, etc.
    duration: calculateDuration(item.start, item.end)
  }));

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
        <Typography color="text.primary">
          {t('tenant-team', {
            ns: 'common',
            tenant: appConfig.companyName
          })}
        </Typography>
        <Typography color="text.primary">
          {t('tenant-dashboard', {
            ns: 'common',
            tenant: appConfig.companyName
          })}
        </Typography>
      </Breadcrumbs>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          aria-label="basic tabs example"
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Agents" {...a11yProps(1)} />
          <Tab label="KPI" {...a11yProps(2)} />
          <Tab label="Program List" {...a11yProps(3)} />
          <Tab label="Response Time" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <OverviewDashboard
          studentDetails={students_details}
          agentData={agents_data}
          editorData={editors_data}
          studentsYearsPair={students_years_pair}
          documents={documents}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AgentDashboard
          agentStudentDistribution={
            internalDashboardState.agentStudentDistribution
          }
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <KPIDashboard
          CVdataWithDuration={CVdataWithDuration}
          MLdataWithDuration={MLdataWithDuration}
          RLdataWithDuration={RLdataWithDuration}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ProgramListVisualization user={user} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <ResponseTimeDashboard
          studentResponseTimeLookupTable={studentResponseTimeLookupTable}
          normalizedResults={normalizedResults}
          memoizedColumnsMrt={memoizedColumnsMrt}
        />
      </CustomTabPanel>
    </Box>
  );
}

export default InternalDashboard;
