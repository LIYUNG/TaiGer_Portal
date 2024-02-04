import React, { Fragment, useState } from 'react';
import {
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PropTypes from 'prop-types';
import { Link as LinkDom } from 'react-router-dom';
import { matchSorter } from 'match-sorter';

import { programs_refactor, is_TaiGer_role } from '../Utils/checking-functions';
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  applicationFileOverviewHeader
} from '../Utils/contants';
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import ApplicationProgressCardBody from '../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const AdvancedTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [collapsedRows, setCollapsedRows] = useState({});
  const [filterText, setFilterText] = useState('');

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleCollapse = (index) => {
    setCollapsedRows({
      ...collapsedRows,
      [index]: !collapsedRows[index]
    });
  };

  const filteredData = data.filter(
    (item) =>
      item.target_year?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.firstname_lastname
        ?.toLowerCase()
        .includes(filterText.toLowerCase()) ||
      item.program?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.deadline?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.agents?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.editors?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.days_left
        ?.toString()
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      item.status?.toString().toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <Fragment>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          id="search-friends"
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          value={filterText}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Search>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column, idx) => (
              <TableCell
                key={idx}
                onClick={() => handleSort(`${column.accessor}`)}
              >
                {column.Header}
                <span>
                  {sortConfig.key === column.accessor
                    ? sortConfig.direction === 'ascending'
                      ? ' 🔽'
                      : sortConfig.direction === 'descending'
                      ? ' 🔼'
                      : ' ⮃'
                    : ' ⮃'}
                </span>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((item, index) => (
            <React.Fragment key={index}>
              <TableRow
                title={
                  item.decided === 'O'
                    ? item.closed === 'O'
                      ? 'Closed'
                      : item.closed === 'X'
                      ? 'Withdraw'
                      : 'In Progress'
                    : 'Not Decided Yet'
                }
              >
                {columns.map((column, idx) =>
                  column.accessor === 'firstname_lastname' ? (
                    <TableCell key={idx} onClick={() => handleCollapse(index)}>
                      <Link
                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                          item.student_id,
                          '/profile'
                        )}`}
                        component={LinkDom}
                        target="_blank"
                      >
                        {item[column.accessor]}
                      </Link>
                    </TableCell>
                  ) : (
                    <TableCell key={idx} onClick={() => handleCollapse(index)}>
                      {column.accessor === 'program' &&
                      item.program_id !== '-' ? (
                        <Link
                          to={`${DEMO.SINGLE_PROGRAM_LINK(item.program_id)}`}
                          component={LinkDom}
                          target="_blank"
                        >
                          {item[column.accessor]}
                        </Link>
                      ) : (
                        <span
                          className={
                            item.decided === 'O'
                              ? item.closed === 'O'
                                ? 'text-warning'
                                : 'text-info'
                              : 'text-secondary'
                          }
                        >
                          {item[column.accessor]}
                        </span>
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
              {collapsedRows[index] && (
                <Card>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <ApplicationProgressCardBody
                          student={item.student}
                          application={item.application}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Card>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
};

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label={t('Active Student List')} {...a11yProps(0)} />
            <Tab label={t('Application Overview')} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {is_TaiGer_role(user) && (
            <TabStudBackgroundDashboard
              students={props.students}
              isArchivPage={false}
            />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AdvancedTable
            columns={applicationFileOverviewHeader}
            data={applications_arr}
          />
        </CustomTabPanel>
      </Box>
    </>
  );
}

export default ApplicationOverviewTabs;
