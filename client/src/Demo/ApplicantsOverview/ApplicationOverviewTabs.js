import React, { useState } from 'react';
import {
  // Card,
  Link,
  // Table,
  // TableBody,
  // TableCell,
  // TableHead,
  // TableRow,
  Tabs,
  Tab,
  Box,
  // TableContainer,
  Typography,
  TextField,
  Popover
} from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';
import { Link as LinkDom } from 'react-router-dom';
import { matchSorter } from 'match-sorter';

import {
  programs_refactor,
  is_TaiGer_role,
  isProgramDecided
} from '../Utils/checking-functions';
import {
  // Search,
  // SearchIconWrapper,
  // StyledInputBase,
  applicationFileOverviewHeader
} from '../Utils/contants';
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import ApplicationProgressCardBody from '../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';
import ProgramUpdateStatusTable from './ProgramUpdateStatusTable';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// const AdvancedTable = ({ data, columns }) => {
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: 'ascending'
//   });
//   const [collapsedRows, setCollapsedRows] = useState({});
//   const [filterText, setFilterText] = useState('');

//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const handleCollapse = (index) => {
//     setCollapsedRows({
//       ...collapsedRows,
//       [index]: !collapsedRows[index]
//     });
//   };

//   const filteredData = data.filter(
//     (item) =>
//       item.target_year?.toLowerCase().includes(filterText.toLowerCase()) ||
//       item.firstname_lastname
//         ?.toLowerCase()
//         .includes(filterText.toLowerCase()) ||
//       item.program?.toLowerCase().includes(filterText.toLowerCase()) ||
//       item.deadline?.toLowerCase().includes(filterText.toLowerCase()) ||
//       item.agents?.toLowerCase().includes(filterText.toLowerCase()) ||
//       item.editors?.toLowerCase().includes(filterText.toLowerCase()) ||
//       item.days_left
//         ?.toString()
//         .toLowerCase()
//         .includes(filterText.toLowerCase()) ||
//       item.status?.toString().toLowerCase().includes(filterText.toLowerCase())
//   );

//   const sortedData = [...filteredData].sort((a, b) => {
//     if (sortConfig.key) {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === 'ascending' ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === 'ascending' ? 1 : -1;
//       }
//     }
//     return 0;
//   });

//   return (
//     <Fragment>
//       <Search>
//         <SearchIconWrapper>
//           <SearchIcon />
//         </SearchIconWrapper>
//         <StyledInputBase
//           id="search-friends"
//           placeholder="Search…"
//           inputProps={{ 'aria-label': 'search' }}
//           value={filterText}
//           onClick={(e) => e.stopPropagation()}
//           onChange={(e) => setFilterText(e.target.value)}
//         />
//       </Search>
//       <TableContainer style={{ overflowX: 'auto' }}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               {columns.map((column, idx) => (
//                 <TableCell
//                   key={idx}
//                   onClick={() => handleSort(`${column.accessor}`)}
//                 >
//                   {column.Header}
//                   <span>
//                     {sortConfig.key === column.accessor
//                       ? sortConfig.direction === 'ascending'
//                         ? ' 🔽'
//                         : sortConfig.direction === 'descending'
//                         ? ' 🔼'
//                         : ' ⮃'
//                       : ' ⮃'}
//                   </span>
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sortedData.map((item, index) => (
//               <React.Fragment key={index}>
//                 <TableRow
//                   title={
//                     item.decided === 'O'
//                       ? item.closed === 'O'
//                         ? 'Closed'
//                         : item.closed === 'X'
//                         ? 'Withdraw'
//                         : 'In Progress'
//                       : 'Not Decided Yet'
//                   }
//                 >
//                   {columns.map((column, idx) =>
//                     column.accessor === 'firstname_lastname' ? (
//                       <TableCell
//                         key={idx}
//                         onClick={() => handleCollapse(index)}
//                       >
//                         <Link
//                           to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
//                             item.student_id,
//                             DEMO.PROFILE_HASH
//                           )}`}
//                           component={LinkDom}
//                           target="_blank"
//                         >
//                           {item[column.accessor]}
//                         </Link>
//                       </TableCell>
//                     ) : (
//                       <TableCell
//                         key={idx}
//                         onClick={() => handleCollapse(index)}
//                       >
//                         {column.accessor === 'program' &&
//                         item.program_id !== '-' ? (
//                           <Link
//                             to={`${DEMO.SINGLE_PROGRAM_LINK(item.program_id)}`}
//                             component={LinkDom}
//                             target="_blank"
//                           >
//                             {item[column.accessor]}
//                           </Link>
//                         ) : (
//                           <span
//                             className={
//                               item.decided === 'O'
//                                 ? item.closed === 'O'
//                                   ? 'text-warning'
//                                   : 'text-info'
//                                 : 'text-secondary'
//                             }
//                           >
//                             {item[column.accessor]}
//                           </span>
//                         )}
//                       </TableCell>
//                     )
//                   )}
//                 </TableRow>
//                 {collapsedRows[index] && (
//                   <Card>
//                     <ApplicationProgressCardBody
//                       student={item.student}
//                       application={item.application}
//                     />
//                   </Card>
//                 )}
//               </React.Fragment>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Fragment>
//   );
// };

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function ApplicationOverviewTabs(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const applications_arr = programs_refactor(props.students);
  const [value, setValue] = useState(0);
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredRowData, setClickedRowData] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFilterChange = (event, column) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column.field]: value.toLowerCase()
    }));
  };

  const filteredRows = applications_arr.filter((row) => {
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
    // console.log(event);
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
    { field: 'days_left', headerName: t('Day left'), width: 120 },
    { field: 'status', headerName: t('Status(%)'), width: 120 }
  ];

  const stopPropagation = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const open = Boolean(anchorEl);
  // console.log(open);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs example"
          >
            <Tab label={t('Active Student List')} {...a11yProps(0)} />
            <Tab label={t('Application Overview')} {...a11yProps(1)} />
            <Tab label={t('Programs Update Status')} {...a11yProps(2)} />
            <Tab
              label={t('Decided Programs Update Status')}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {is_TaiGer_role(user) && (
            <TabStudBackgroundDashboard
              students={props.students}
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
              {/* <div style={{ position: 'absolute', top: 0, left: 0 }}> */}
              <Typography>{hoveredRowData?.firstname_lastname}</Typography>
              <Typography>{hoveredRowData?.program}</Typography>
              <ApplicationProgressCardBody
                student={hoveredRowData?.student}
                application={hoveredRowData?.application}
              />
              {/* </div> */}
            </Popover>
          </div>
          {/* <AdvancedTable
            columns={applicationFileOverviewHeader}
            data={applications_arr}
          /> */}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ProgramUpdateStatusTable
            columns={applicationFileOverviewHeader}
            data={applications_arr}
          />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <ProgramUpdateStatusTable
            columns={applicationFileOverviewHeader}
            data={applications_arr.filter((application) =>
              isProgramDecided(application)
            )}
          />
        </CustomTabPanel>
      </Box>
    </>
  );
}

export default ApplicationOverviewTabs;
