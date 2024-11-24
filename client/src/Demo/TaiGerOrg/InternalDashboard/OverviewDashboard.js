import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Grid, Card, Button, ButtonGroup } from '@mui/material';
import {
  BarChart,
  Cell,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import { LineChart } from '@mui/x-charts/LineChart';

import SingleBarChart from '../../../components/Charts/SingleBarChart';
import VerticalDistributionBarCharts from '../../../components/Charts/VerticalDistributionBarChart';
import VerticalSingleBarChart from '../../../components/Charts/VerticalSingleChart';
import {
  open_tasks_with_editors,
  isProgramDecided,
  isProgramSubmitted
} from '../../Utils/checking-functions';

const application_status = ['Open', 'Close'];
const admission_status = ['Admission', 'Rejection', 'Pending'];

const initialData = {
  Open: 0,
  Close: 0,
  Admission: 0,
  Rejection: 0,
  Pending: 0
};

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

const OverviewDashboard = ({
  studentDetails,
  agentData,
  editorData,
  studentsYearsPair,
  documents
}) => {
  const [viewMode, setViewMode] = useState('month');
  const { t } = useTranslation();

  const data = studentDetails.reduce((acc, student) => {
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

  // Only open tasks. Closed tasks are excluded
  const open_tasks_arr = open_tasks_with_editors(studentDetails);
  const documents_data = [];
  const editor_tasks_distribution_data = [];

  cat.forEach((ca) => {
    documents_data.push({
      name: `${ca}`,
      uv: documents[ca]?.count || 0
      // color: colors[i]
    });
  });
  editorData.forEach((editor) => {
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

  const applications_data = application_status.map((status) => ({
    name: status,
    uv: data[status]
  }));

  const admissions_data = admission_status.map((status) => ({
    name: status,
    uv: data[status]
  }));

  const groupedData =
    viewMode === 'month'
      ? groupByMonth(studentDetails)
      : groupByWeek(studentDetails);

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
  const chartData = prepareChartData(groupedData);

  return (
    <>
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
              data={studentsYearsPair}
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
              data={agentData}
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
            <VerticalSingleBarChart data={editorData} xLabel={'Student'} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography>
              {t('Editor', { ns: 'common' })}:Number of open and potential tasks
              per editor
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
    </>
  );
};

export default OverviewDashboard;
