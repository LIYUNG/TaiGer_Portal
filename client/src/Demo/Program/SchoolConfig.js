import React, { Suspense, useMemo, useState } from 'react';
import {
  Navigate,
  Link as LinkDom,
  useLoaderData,
  Await
} from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { is_TaiGer_role } from '../Utils/checking-functions';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import ExampleWithLocalizationProvider from '../../components/MaterialReactTable';
import { useTranslation } from 'react-i18next';

function SchoolConfig() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { distinctSchools } = useLoaderData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSchoolClick = (row) => {
    setRowSelection(row);
    if (isSmallScreen) {
      setDrawerOpen(true); // Open the Drawer on small screens
    }
  };

  const c1_mrt = [
    {
      accessorKey: 'school',
      filterVariant: 'autocomplete',
      filterFn: 'contains',
      header: 'School',
      size: 240
    },
    {
      accessorKey: 'count',
      header: 'Count',
      size: 150,
      Cell: (params) => {
        return (
          <Box
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            {params.row.original?.count}
          </Box>
        );
      }
    }
  ];

  const memoizedColumnsMrt = useMemo(() => c1_mrt, [c1_mrt]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const EditCard = ({ data }) => {
    return (
      <Box>
        <Typography variant="h6">Name: {data.school}</Typography>
        <Typography variant="subtitle1">
          Programs Count: {data.count}
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="select-target-group">
            {t('isPrivateSchool')}
          </InputLabel>
          <Select
            labelId="isPrivateSchool"
            label="isPrivateSchool"
            name="isPrivateSchool"
            id="isPrivateSchool"
            // onChange={(e) => handleChange_category(e)}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel id="select-target-group">
            {t('isPartnerSchool')}
          </InputLabel>
          <Select
            labelId="isPartnerSchool"
            label="isPartnerSchool"
            name="isPartnerSchool"
            id="isPartnerSchool"
            // onChange={(e) => handleChange_category(e)}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel id="select-target-group">{t('schoolType')}</InputLabel>
          <Select
            labelId="schoolType"
            label="schoolType"
            name="schoolType"
            id="schoolType"
            // onChange={(e) => handleChange_category(e)}
          >
            <MenuItem value={'University'}>University</MenuItem>
            <MenuItem value={'University_of_Applied_Sciences'}>
              University_of_Applied_Sciences
            </MenuItem>
          </Select>
        </FormControl>
        {/* Additional configuration details go here */}
        <Button variant="contained" color="primary">
          Update
        </Button>
      </Box>
    );
  };
  TabTitle('Student Database');
  return (
    <Box data-testid="student_datdabase">
      <Suspense fallback={<Loading />}>
        <Await resolve={distinctSchools}>
          {(loadedData) => (
            <>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  color="inherit"
                  component={LinkDom}
                  to={`${DEMO.DASHBOARD_LINK}`}
                >
                  {appConfig.companyName}
                </Link>
                <Typography color="text.primary">Config</Typography>
              </Breadcrumbs>
              <Grid container spacing={2}>
                {/* Left side: School list */}
                <Grid item xs={12} md={7}>
                  <Paper style={{ padding: 16 }}>
                    <ExampleWithLocalizationProvider
                      data={loadedData}
                      col={memoizedColumnsMrt}
                      enableRowSelection={true}
                      enableMultiRowSelection={false}
                      muiTableBodyRowProps={({ row }) => ({
                        //add onClick to row to select upon clicking anywhere in the row
                        onClick: row.getToggleSelectedHandler(),
                        sx: { cursor: 'pointer' }
                      })}
                      onRowSelectionChange={(e) => handleSchoolClick(e)}
                      rowSelection={rowSelection}
                    />
                  </Paper>
                </Grid>

                {/* Right side: Configuration panel */}
                {!isSmallScreen && (
                  <Grid item xs={12} md={5}>
                    <Paper style={{ padding: 16 }}>
                      {Object.keys(rowSelection) &&
                      Object.keys(rowSelection)[0] ? (
                        <EditCard
                          data={
                            loadedData[parseInt(Object.keys(rowSelection)[0])]
                          }
                        />
                      ) : (
                        <Typography variant="h6">
                          Select a school to configure
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Drawer for small screens */}
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerClose}
              >
                <div style={{ width: 300, padding: 16 }}>
                  {Object.keys(rowSelection) && Object.keys(rowSelection)[0] ? (
                    <EditCard
                      data={loadedData[parseInt(Object.keys(rowSelection)[0])]}
                    />
                  ) : (
                    <Typography variant="h6">
                      Select a school to configure
                    </Typography>
                  )}
                  <Button
                    onClick={handleDrawerClose}
                    variant="contained"
                    fullWidth
                  >
                    Close
                  </Button>
                </div>
              </Drawer>
            </>
          )}
        </Await>
      </Suspense>
    </Box>
  );
}

export default SchoolConfig;
