import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Breadcrumbs,
  ButtonGroup,
  Button
} from '@mui/material';
import PropTypes from 'prop-types';
import { Navigate, Link as LinkDom, useLocation } from 'react-router-dom';
import { Link } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

import {
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Cell,
  ResponsiveContainer,
  Legend,
  Label
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import ErrorPage from '../../Utils/ErrorPage';
import {
  isProgramDecided,
  isProgramSubmitted,
  is_TaiGer_role,
  open_tasks_with_editors
} from '../../Utils/checking-functions';
import { getStatistics } from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import ProgramListVisualization from './ProgramListVisualization.js';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../../components/Tabs';
import {
  INTERNAL_DASHBOARD_REVERSED_TABS,
  INTERNAL_DASHBOARD_TABS
} from '../../Utils/contants.js';
import SingleBarChart from '../../../components/Charts/SingleBarChart.js';
import VerticalDistributionBarCharts from '../../../components/Charts/VerticalDistributionBarChart.js';
import VerticalSingleBarChart from '../../../components/Charts/VerticalSingleChart.js';
import ExampleWithLocalizationProvider from '../../../components/MaterialReactTable/index.js';

function groupByMonth(data) {
  return data.reduce((acc, { createdAt }) => {
    const month = dayjs(createdAt).format('YYYY-MM');
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {});
}

function groupByWeek(data) {
  return data.reduce((acc, { createdAt }) => {
    const week = dayjs(createdAt).isoWeek();
    const year = dayjs(createdAt).year();
    const weekYear = `${year}-W${week}`;
    if (!acc[weekYear]) {
      acc[weekYear] = 0;
    }
    acc[weekYear]++;
    return acc;
  }, {});
}

function prepareChartData(groupedData) {
  const labels = Object.keys(groupedData).sort((a, b) => {
    if (a.includes('-W') && b.includes('-W')) {
      const [yearA, weekA] = a.split('-W').map(Number);
      const [yearB, weekB] = b.split('-W').map(Number);
      return yearA === yearB ? weekA - weekB : yearA - yearB;
    }
    return a.localeCompare(b);
  });

  const data = labels.map((label) => groupedData[label]);

  return {
    labels,
    datasets: [
      {
        label: 'Data Points',
        data
      }
    ]
  };
}

const AgentBarCharts = ({ agentDistr }) => {
  // Extract unique years from both arrays

  const combinedKeys = Array.from(
    new Set(
      [
        ...Object.keys(agentDistr.admission),
        ...Object.keys(agentDistr.noAdmission)
      ]?.sort()
    )
  );
  const admissionDataset = [];
  const noAdmissionDataset = [];

  // Populate datasets
  combinedKeys.forEach((key) => {
    admissionDataset.push(agentDistr.admission[key] || 0);
    noAdmissionDataset.push(agentDistr.noAdmission[key] || 0);
  });
  return (
    <Box>
      <Typography variant="h6">{agentDistr.name}</Typography>
      <MuiBarChart
        xAxis={[{ scaleType: 'band', data: combinedKeys }]}
        yAxis={[
          {
            label: 'Student'
          }
        ]}
        series={[
          { label: 'No Offer', data: noAdmissionDataset },
          { label: 'Has Offer', data: admissionDataset }
        ]}
        height={250}
        width={400}
      />
    </Box>
  );
};

// TODO: to be moved to single student
const StudentResponseTimeChart = ({ studentResponseTime }) => {
  const fileTypes = ['CV', 'ML', 'RL', 'Essay', 'Messages', 'Agent Support'];

  const chartData = fileTypes.map((type) => ({
    name: type,
    ResponseTime:
      parseFloat(studentResponseTime.intervalGroup[type]?.toFixed(2)) || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis>
          <Label
            value={`${studentResponseTime.student?.firstname} ${studentResponseTime.student?.lastname}`}
            angle={-90}
            position="insideLeft"
          />
        </YAxis>
        <Tooltip />
        <Legend />
        <Bar dataKey="ResponseTime" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

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
  const [viewMode, setViewMode] = useState('month');
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
  const colors = [
    '#ff8a65',
    '#f4c22b',
    '#04a9f5',
    '#3ebfea',
    '#4F5467',
    '#1de9b6',
    '#a389d4',
    '#FE8A7D'
  ];

  const groupedData =
    viewMode === 'month'
      ? groupByMonth(students_details)
      : groupByWeek(students_details);

  const chartData = prepareChartData(groupedData);

  // Normalize data by ensuring each object has all keys
  const normalizedResults = studentResponseTimeLookupTable.map((result) => {
    const normalizedResult = { ...result };
    fileTypes2.forEach((key) => {
      normalizedResult[key] = result[key] !== undefined ? result[key] : 0; // Set missing keys to null or undefined
    });
    return normalizedResult;
  });
  console.log(normalizedResults);
  const application_status = ['Open', 'Close'];
  const admission_status = ['Admission', 'Rejection', 'Pending'];

  const initialData = {
    Open: 0,
    Close: 0,
    Admission: 0,
    Rejection: 0,
    Pending: 0
  };

  const data = students_details.reduce((acc, student) => {
    student.applications.forEach((application) => {
      if (application.program_id !== '-' && isProgramDecided(application)) {
        if (isProgramSubmitted(application)) {
          acc.Close += 1;
          if (application.admission === 'O') {
            acc.Admission += 1;
          } else if (application.admission === 'X') {
            acc.Rejection += 1;
          } else if (application.admission === '-') {
            acc.Pending += 1;
          }
        } else {
          acc.Open += 1;
        }
      }
    });
    return acc;
  }, initialData);

  const applications_data = application_status.map((status) => ({
    name: status,
    uv: data[status]
  }));

  const admissions_data = admission_status.map((status) => ({
    name: status,
    uv: data[status]
  }));

  // Only open tasks. Closed tasks are excluded
  const open_tasks_arr = open_tasks_with_editors(students_details);

  const documents_data = [];
  const editor_tasks_distribution_data = [];
  const cat = [
    'CURRICULUM_ANALYSIS',
    'CV',
    'ESSAY',
    'FORM_A',
    'FORM_B',
    'INTERNSHIP_FORM',
    'ML',
    'OTHERS',
    'PORTFOLIO',
    'RL',
    'SCHOLARSHIP_FORM',
    'SUPPLEMENTARY_FORM'
  ];
  cat.forEach((ca) => {
    documents_data.push({
      name: `${ca}`,
      uv: documents[ca]?.count || 0
      // color: colors[i]
    });
  });
  editors_data.forEach((editor) => {
    editor_tasks_distribution_data.push({
      name: `${editor.firstname}`,
      active: open_tasks_arr.filter(
        ({ editors, isFinalVersion, show }) =>
          editors.findIndex((ed) => ed._id === editor._id) !== -1 &&
          isFinalVersion !== true &&
          show
      ).length,
      potentials: open_tasks_arr.filter(
        ({ editors, isFinalVersion, show, isPotentials }) =>
          editors.findIndex((ed) => ed._id == editor._id) !== -1 &&
          isFinalVersion !== true &&
          !show &&
          isPotentials
      ).length
      // color: colors[i]
    });
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
          {appConfig.companyName} Dashboard
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                style={{ marginBottom: '20px' }}
              >
                <Button
                  onClick={() => setViewMode('month')}
                  variant={viewMode === 'month' ? 'contained' : 'outlined'}
                >
                  Month View
                </Button>
                <Button
                  onClick={() => setViewMode('week')}
                  variant={viewMode === 'week' ? 'contained' : 'outlined'}
                >
                  Week View
                </Button>
              </ButtonGroup>
              <LineChart
                xAxis={[{ data: chartData.labels, scaleType: 'band' }]}
                series={[
                  {
                    data: chartData.datasets[0].data
                  }
                ]}
                yAxis={[
                  {
                    label: 'New Students'
                  }
                ]}
                height={300}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Typography>{t('Students')}</Typography>
              <SingleBarChart
                data={students_years_pair}
                label="Student"
                yLabel="Student"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>Tasks: Number of Tasks</Typography>
              <SingleBarChart
                data={documents_data}
                label="Tasks"
                yLabel="Tasks"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>
                {t('Agents', { ns: 'common' })}: Number of active students per
                agent
              </Typography>
              <VerticalDistributionBarCharts
                data={agents_data}
                k={'key'}
                value1={'student_num_no_offer'}
                value2={'student_num_with_offer'}
                xLabel="Student"
                dataALabel="No Offer"
                dataBLabel="Has Offer"
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>
                {t('Editor', { ns: 'common' })}: Number of active students per
                editor
              </Typography>
              <VerticalSingleBarChart data={editors_data} xLabel={'Student'} />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>
                {t('Editor', { ns: 'common' })}:Number of open and potential
                tasks per editor
              </Typography>
              <VerticalDistributionBarCharts
                data={editor_tasks_distribution_data}
                k={'name'}
                value1={'active'}
                value2={'potentials'}
                xLabel="Tasks"
                dataALabel="Active"
                dataBLabel="Potentials"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>
                {t('Applications')}: Number of Applications:
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={applications_data}
                  margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip labelStyle={{ color: 'black' }} />
                  {/* <Legend /> */}
                  <Bar dataKey="uv" fill="#8884d8" label={{ position: 'top' }}>
                    {applications_data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>{t('Admissions')}: Number of Admissions</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={admissions_data}
                  margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip labelStyle={{ color: 'black' }} />
                  {/* <Legend /> */}
                  <Bar dataKey="uv" fill="#8884d8" label={{ position: 'top' }}>
                    {admissions_data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Active Students distribution</Typography>
          </Grid>
          {internalDashboardState.agentStudentDistribution.map(
            (agentDistr, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <AgentBarCharts agentDistr={agentDistr} />
              </Grid>
            )
          )}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>Closed CV KPI</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={CVdataWithDuration}
                  margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={270}
                    dx={0}
                    dy={25}
                    minTickGap={-200}
                    axisLine={false}
                  />
                  <YAxis>
                    <Label
                      value="Duration (days)"
                      angle={-90}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip labelStyle={{ color: 'black' }} />
                  <Legend />
                  <Bar dataKey="duration" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>Closed ML KPI</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={MLdataWithDuration}
                  margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={270}
                    dx={0}
                    dy={25}
                    minTickGap={-200}
                    axisLine={false}
                  />
                  <YAxis>
                    <Label
                      value="Duration (days)"
                      angle={-90}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip labelStyle={{ color: 'black' }} />
                  <Legend />
                  <Bar dataKey="duration" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2 }}>
              <Typography>Closed RL KPI</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={RLdataWithDuration}
                  margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={270}
                    dx={0}
                    dy={25}
                    minTickGap={-200}
                    axisLine={false}
                  />
                  <YAxis>
                    <Label
                      value="Duration (days)"
                      angle={-90}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip labelStyle={{ color: 'black' }} />
                  <Legend />
                  <Bar dataKey="duration" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ProgramListVisualization user={user} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Student Response Time</Typography>
          </Grid>
          <Grid item xs={12}>
            <ExampleWithLocalizationProvider
              data={normalizedResults}
              col={memoizedColumnsMrt}
            />
          </Grid>
          {false &&
            studentResponseTimeLookupTable.map((studentResponseTime, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <StudentResponseTimeChart
                  studentResponseTime={studentResponseTime}
                />
              </Grid>
            ))}
        </Grid>
      </CustomTabPanel>
    </Box>
  );
}

export default InternalDashboard;
