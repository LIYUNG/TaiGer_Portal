import React, { useMemo } from 'react';

import { Box, Link, Typography, Grid } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

import {
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Legend,
  Label
} from 'recharts';

import ExampleWithLocalizationProvider from '../../../components/MaterialReactTable/index';
import DEMO from '../../../store/constant';

const fileTypes = [
  'communication',
  'CV',
  'ML',
  'RL_A',
  'RL_B',
  'RL_C',
  'Essay',
  'Supplementary_Form'
];

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

const ResponseTimeDashboardTab = ({ studentResponseTimeLookupTable }) => {
  const memoizedColumnsMrt = useMemo(
    () => responseTimeColumn,
    [responseTimeColumn]
  );
  const normalizedResults = studentResponseTimeLookupTable.map((result) => {
    const normalizedResult = { ...result };
    fileTypes.forEach((key) => {
      normalizedResult[key] = result[key] !== undefined ? result[key] : 0; // Set missing keys to null or undefined
    });
    return normalizedResult;
  });

  return (
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
  );
};

export default ResponseTimeDashboardTab;
