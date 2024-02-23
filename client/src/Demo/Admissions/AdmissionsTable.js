/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TextField } from '@mui/material';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import DEMO from '../../store/constant';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import {
  isProgramDecided,
  isProgramSubmitted
} from '../Utils/checking-functions';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function AdmissionsTable(props) {
  const students = props.students;
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({});
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const applicationResultsArray = (students, tag) => {
    const result = [];
    for (const student of students) {
      let editors_name_string = '';
      let agents_name_string = '';
      for (const editor of student.editors) {
        editors_name_string += `${editor.firstname} `;
      }
      for (const agent of student.agents) {
        agents_name_string += `${agent.firstname} `;
      }
      for (const application of student.applications) {
        if (isProgramDecided(application)) {
          if (isProgramSubmitted(application)) {
            if (tag === application.admission) {
              result.push({
                id: `${student._id}${application.programId._id}`,
                student_id: student._id,
                name: `${student.firstname}, ${student.lastname}`,
                editors: editors_name_string,
                agents: agents_name_string,
                program_id: application.programId._id,
                school: application.programId.school,
                degree: application.programId.degree,
                program_name: application.programId.program_name,
                application_year:
                  student.application_preference?.expected_application_date,
                semester: application.programId.semester
              });
            }
          } else if (application.closed === '-' && tag === '--') {
            result.push({
              id: `${student._id}${application.programId._id}`,
              student_id: student._id,
              name: `${student.firstname}, ${student.lastname}`,
              editors: editors_name_string,
              agents: agents_name_string,
              program_id: application.programId._id,
              school: application.programId.school,
              degree: application.programId.degree,
              program_name: application.programId.program_name,
              application_year:
                student.application_preference &&
                student.application_preference.expected_application_date,
              semester: application.programId.semester
            });
          }
        }
      }
    }
    return result;
  };

  let admissions_table = applicationResultsArray(students, 'O');
  let rejections_table = applicationResultsArray(students, 'X');
  let pending_table = applicationResultsArray(students, '-');
  let not_yet_closed_table = applicationResultsArray(students, '--');

  const c2 = [
    {
      field: 'name',
      headerName: t('Name'),
      align: 'left',
      headerAlign: 'left',
      width: 150,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id,
          '/profile'
        )}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'agents',
      headerName: t('Agents'),
      width: 100
    },
    { field: 'editors', headerName: t('Editors'), width: 100 },
    {
      field: 'school',
      headerName: t('School'),
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.program_id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    {
      field: 'program_name',
      headerName: t('Program'),
      width: 250,
      renderCell: (params) => {
        const linkUrl = `${DEMO.SINGLE_PROGRAM_LINK(params.row.program_id)}`;
        return (
          <Link
            underline="hover"
            to={linkUrl}
            component={LinkDom}
            target="_blank"
          >
            {params.value}
          </Link>
        );
      }
    },
    { field: 'degree', headerName: t('Degree'), width: 120 },
    {
      field: 'application_year',
      headerName: t('Application Year'),
      width: 120
    },
    { field: 'semester', headerName: t('Semester'), width: 120 }
  ];
  const memoizedColumns = useMemo(() => c2, [c2]);

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value.toLowerCase()
    }));
  };

  const stopPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          <Tab label="Admissions" {...a11yProps(0)} />
          <Tab label="Rejections" {...a11yProps(1)} />
          <Tab label="Pending" {...a11yProps(2)} />
          <Tab label="Not Closed Yet" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div style={{ height: '50%', width: '100%' }}>
          <DataGrid
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                lineHeight: 'normal'
              },
              '& .MuiDataGrid-columnHeader': {
                // Forced to use important since overriding inline styles
                height: 'unset !important'
              },
              '& .MuiDataGrid-columnHeaders': {
                // Forced to use important since overriding inline styles
                maxHeight: '168px !important'
              }
            }}
            density="compact"
            rows={admissions_table.filter((row) => {
              return Object.keys(filters).every((field) => {
                const filterValue = filters[field];
                return (
                  filterValue === '' ||
                  row[field]?.toString().toLowerCase().includes(filterValue)
                );
              });
            })}
            disableColumnFilter
            disableColumnMenu
            disableDensitySelector
            columns={memoizedColumns.map((column) => ({
              ...column,
              renderHeader: () => (
                <Box>
                  <Typography
                    sx={{ my: 1 }}
                  >{`${column.headerName}`}</Typography>
                  <TextField
                    size="small"
                    type="text"
                    placeholder={`${column.headerName}`}
                    onClick={stopPropagation}
                    value={filters[column.field] || ''}
                    onChange={(event) => handleFilterChange(event, column)}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )
            }))}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 }
              }
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div style={{ height: '50%', width: '100%' }}>
          <DataGrid
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                lineHeight: 'normal'
              },
              '& .MuiDataGrid-columnHeader': {
                // Forced to use important since overriding inline styles
                height: 'unset !important'
              },
              '& .MuiDataGrid-columnHeaders': {
                // Forced to use important since overriding inline styles
                maxHeight: '168px !important'
              }
            }}
            density="compact"
            rows={rejections_table.filter((row) => {
              return Object.keys(filters).every((field) => {
                const filterValue = filters[field];
                return (
                  filterValue === '' ||
                  row[field]?.toString().toLowerCase().includes(filterValue)
                );
              });
            })}
            disableColumnFilter
            disableColumnMenu
            disableDensitySelector
            columns={memoizedColumns.map((column) => ({
              ...column,
              renderHeader: () => (
                <Box>
                  <Typography
                    sx={{ my: 1 }}
                  >{`${column.headerName}`}</Typography>
                  <TextField
                    size="small"
                    type="text"
                    placeholder={`${column.headerName}`}
                    onClick={stopPropagation}
                    value={filters[column.field] || ''}
                    onChange={(event) => handleFilterChange(event, column)}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )
            }))}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 }
              }
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
        </div>
        {/* <Table2 header={'Rejections '} data={rejections_table} /> */}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div style={{ height: '50%', width: '100%' }}>
          <DataGrid
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                lineHeight: 'normal'
              },
              '& .MuiDataGrid-columnHeader': {
                // Forced to use important since overriding inline styles
                height: 'unset !important'
              },
              '& .MuiDataGrid-columnHeaders': {
                // Forced to use important since overriding inline styles
                maxHeight: '168px !important'
              }
            }}
            density="compact"
            rows={pending_table.filter((row) => {
              return Object.keys(filters).every((field) => {
                const filterValue = filters[field];
                return (
                  filterValue === '' ||
                  row[field]?.toString().toLowerCase().includes(filterValue)
                );
              });
            })}
            disableColumnFilter
            disableColumnMenu
            disableDensitySelector
            columns={memoizedColumns.map((column) => ({
              ...column,
              renderHeader: () => (
                <Box>
                  <Typography
                    sx={{ my: 1 }}
                  >{`${column.headerName}`}</Typography>
                  <TextField
                    size="small"
                    type="text"
                    placeholder={`${column.headerName}`}
                    onClick={stopPropagation}
                    value={filters[column.field] || ''}
                    onChange={(event) => handleFilterChange(event, column)}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )
            }))}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 }
              }
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
        </div>
        {/* <Table2 header={'Pending'} data={pending_table} /> */}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <div style={{ height: '50%', width: '100%' }}>
          <DataGrid
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                lineHeight: 'normal'
              },
              '& .MuiDataGrid-columnHeader': {
                // Forced to use important since overriding inline styles
                height: 'unset !important'
              },
              '& .MuiDataGrid-columnHeaders': {
                // Forced to use important since overriding inline styles
                maxHeight: '168px !important'
              }
            }}
            density="compact"
            rows={not_yet_closed_table.filter((row) => {
              return Object.keys(filters).every((field) => {
                const filterValue = filters[field];
                return (
                  filterValue === '' ||
                  row[field]?.toString().toLowerCase().includes(filterValue)
                );
              });
            })}
            disableColumnFilter
            disableColumnMenu
            disableDensitySelector
            columns={memoizedColumns.map((column) => ({
              ...column,
              renderHeader: () => (
                <Box>
                  <Typography
                    sx={{ my: 1 }}
                  >{`${column.headerName}`}</Typography>
                  <TextField
                    size="small"
                    type="text"
                    placeholder={`${column.headerName}`}
                    onClick={stopPropagation}
                    value={filters[column.field] || ''}
                    onChange={(event) => handleFilterChange(event, column)}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )
            }))}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 }
              }
            }}
            pageSizeOptions={[10, 20, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
        </div>
        {/* <Table2 header={'Not Closed Yet'} data={not_yet_closed_table} /> */}
      </CustomTabPanel>
    </>
  );
}

export default AdmissionsTable;
