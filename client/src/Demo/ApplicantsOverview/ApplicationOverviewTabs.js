import React, { useMemo, useState } from 'react';
import {
  Link,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Popover,
  Card
} from '@mui/material';
import PropTypes from 'prop-types';
import { Link as LinkDom } from 'react-router-dom';

import {
  frequencyDistribution,
  is_TaiGer_role,
  isProgramDecided,
  isProgramWithdraw,
  programs_refactor
} from '../Utils/checking-functions';
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import ApplicationProgressCardBody from '../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';
import ProgramUpdateStatusTable from './ProgramUpdateStatusTable';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TasksDistributionBarChart from '../../components/Charts/TasksDistributionBarChart';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function ApplicationOverviewTabs(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const [hoveredRowData, setClickedRowData] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const open_applications_arr = useMemo(() => {
    return programs_refactor(props.students);
  }, [props.students]);

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value.toLowerCase()
    }));
  };

  const applications_distribution = open_applications_arr.map(
    ({ deadline, file_type, isPotentials, show }) => {
      return { deadline, file_type, isPotentials, show };
    }
  );
  const open_distr = frequencyDistribution(applications_distribution);

  const sort_date = Object.keys(open_distr).sort();

  const sorted_date_freq_pair = [];
  sort_date.forEach((date) => {
    sorted_date_freq_pair.push({
      name: `${date}`,
      active: open_distr[date].show,
      potentials: open_distr[date].potentials
    });
  });

  const filteredRows = open_applications_arr
    .filter((app) => isProgramDecided(app) && !isProgramWithdraw(app))
    .filter((row) => {
      return Object.keys(filters).every((field) => {
        const filterValue = filters[field];
        return (
          filterValue === '' ||
          row[field]?.toString().toLowerCase().includes(filterValue)
        );
      });
    });

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRowClick = (event) => {
    setAnchorEl(event);
    const rowData = event.row;
    setClickedRowData(rowData || null);
  };

  const applicationFileOverviewMuiHeader = [
    {
      field: 'target_year',
      headerName: t('Target'),
      align: 'left',
      headerAlign: 'left',
      width: 100
    },
    {
      field: 'firstname_lastname',
      headerName: t('First-, Last Name'),
      width: 180,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id,
          DEMO.PROFILE_HASH
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
    { field: 'agents', headerName: t('Agent'), width: 180 },
    { field: 'editors', headerName: t('Editor'), width: 180 },
    {
      field: 'program',
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
    { field: 'deadline', headerName: t('Deadline'), width: 120 },
    { field: 'days_left', headerName: t('Days left'), width: 120 },
    { field: 'status', headerName: t('Status(%)'), width: 120 }
  ];

  const stopPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Open Applications Distribution</Typography>
          <Typography>
            <b style={{ color: 'red' }}>active:</b> students decided programs.
          </Typography>
          <Typography>
            <b style={{ color: '#A9A9A9' }}>potentials:</b> students do not
            decide programs yet. But the applications will be potentially
            activated when they would decide.
          </Typography>
          <TasksDistributionBarChart data={sorted_date_freq_pair} />
        </Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs example"
          >
            <Tab
              data-testid="application_overview_component_active_student_list_tab"
              label={t('Active Student List')}
              {...a11yProps(0)}
            />
            <Tab
              data-testid="application_overview_component_application_overview_tab"
              label={t('Application Overview', { ns: 'common' })}
              {...a11yProps(1)}
            />
            <Tab
              data-testid="application_overview_component_programs_update_tab"
              label={t('Programs Update Status')}
              {...a11yProps(2)}
            />
            <Tab
              data-testid="application_overview_component_decided_programs_update_tab"
              label={t('Decided Programs Update Status')}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {is_TaiGer_role(user) && (
            <TabStudBackgroundDashboard
              students={props.students}
              submitUpdateAgentlist={props.submitUpdateAgentlist}
              submitUpdateEditorlist={props.submitUpdateEditorlist}
              submitUpdateAttributeslist={props.submitUpdateAttributeslist}
              updateStudentArchivStatus={props.updateStudentArchivStatus}
              isDashboard={true}
            />
          )}
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
              rows={filteredRows}
              disableColumnFilter
              disableColumnMenu
              disableDensitySelector
              columns={applicationFileOverviewMuiHeader.map((column) => ({
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
              onRowClick={handleRowClick}
              getRowId={(row) => row.id}
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
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
            >
              <Typography>{hoveredRowData?.firstname_lastname}</Typography>
              <Typography>{hoveredRowData?.program}</Typography>
              <ApplicationProgressCardBody
                student={hoveredRowData?.student}
                application={hoveredRowData?.application}
              />
            </Popover>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ProgramUpdateStatusTable data={open_applications_arr} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <ProgramUpdateStatusTable
            data={open_applications_arr.filter((application) =>
              isProgramDecided(application)
            )}
          />
        </CustomTabPanel>
      </Box>
    </>
  );
}

export default ApplicationOverviewTabs;
