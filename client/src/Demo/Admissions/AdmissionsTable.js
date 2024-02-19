/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  // useRowSelect,
  usePagination
} from 'react-table';
import { Link as LinkDom } from 'react-router-dom';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Button, Tabs, Tab, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { matchSorter } from 'match-sorter';

import DEMO from '../../store/constant';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import {
  isProgramDecided,
  isProgramSubmitted
} from '../Utils/checking-functions';

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component
function Table2({ header, data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: header,
        columns: [
          {
            Header: 'First and Last Name',
            accessor: 'name'
            // Filter: SelectColumnFilter,
            // filter: 'fuzzyText'
          },
          {
            Header: 'Agent',
            accessor: 'agents'
            // Use our custom `fuzzyText` filter on this column
            // filter: 'fuzzyText'
          },
          {
            Header: 'Editor',
            accessor: 'editors'
            // Use our custom `fuzzyText` filter on this column
            // filter: 'fuzzyText'
          },
          {
            Header: 'University',
            accessor: 'school'
            // Filter: NumberRangeColumnFilter,
            // filter: 'equals'
          },
          {
            Header: 'Degree',
            accessor: 'degree'
            // Filter: NumberRangeColumnFilter,
            // filter: 'equals'
          },
          {
            Header: 'Program',
            accessor: 'program_name'
            // Filter: NumberRangeColumnFilter,
            // filter: 'between'
          },
          {
            Header: 'Application Year',
            accessor: 'application_year'
            // Filter: SelectColumnFilter,
            // filter: 'includes'
          },
          {
            Header: 'Semester',
            accessor: 'semester'
          }
        ]
      }
    ],
    []
  );

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      }
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    // state,
    // visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // preGlobalFilteredRows,
    // setGlobalFilter,
    // selectedFlatRows,
    // toggleAllRowsSelected,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 20 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination
    // useRowSelect,
    // (hooks) => {
    //   hooks.visibleColumns.push((columns) => [
    //     // Let's make a column for selection
    //     {
    //       id: 'selection',
    //       // The header can use the table's getToggleAllRowsSelectedProps method
    //       // to render a checkbox
    //       Header: ({ getToggleAllRowsSelectedProps }) => (
    //         <div>
    //           <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    //         </div>
    //       ),
    //       // The cell can use the individual row's getToggleRowSelectedProps method
    //       // to the render a checkbox
    //       Cell: ({ row }) => (
    //         <div>
    //           <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    //         </div>
    //       )
    //     },
    //     ...columns
    //   ]);
    // }
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 12);

  return (
    <>
      <Table size="small" {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <TableCell key={j} {...column.getHeaderProps()}>
                  <Typography fontWeight="bold">
                    {column.render('Header')}
                  </Typography>
                  {/* Render the columns filter UI */}
                  {column.canFilter ? column.render('Filter') : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow key={i} {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return (
                    <TableCell key={j} {...cell.getCellProps()}>
                      <Link
                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                          row.original._id,
                          '/background'
                        )}`}
                        component={LinkDom}
                      >
                        {cell.render('Cell')}
                      </Link>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="pagination">
        <Button
          size="sm"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'}
        </Button>
        <Button
          size="sm"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'}
        </Button>
        <Button size="sm" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>
        <Button
          size="sm"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </Button>
        <span className="my-0 mx-0 text-light">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span className="my-0 mx-0 text-light">
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[20, 40, 60, 80, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function AdmissionsTable(props) {
  const students = props.students;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  let admissions_table = [];
  let rejections_table = [];
  let pending_table = [];
  let not_yet_closed_table = [];
  students.map((student) => {
    let editors_name_string = '';
    let agents_name_string = '';
    for (const editor of student.editors) {
      editors_name_string += `${editor.firstname} `;
    }
    for (const agent of student.agents) {
      agents_name_string += `${agent.firstname} `;
    }
    student.applications.map((application) => {
      if (isProgramDecided(application)) {
        if (isProgramSubmitted(application)) {
          if (application.admission === 'O') {
            admissions_table.push({
              _id: student._id,
              name: `${student.firstname}, ${student.lastname}`,
              editors: editors_name_string,
              agents: agents_name_string,
              year:
                student.aapplication_preference &&
                student.aapplication_preference.expected_application_date,
              school: application.programId.school,
              degree: application.programId.degree,
              program_name: application.programId.program_name,
              application_year:
                student.application_preference &&
                student.application_preference.expected_application_date,
              semester: application.programId.semester
            });
          }
          if (application.admission === 'X') {
            rejections_table.push({
              _id: student._id,
              name: `${student.firstname}, ${student.lastname}`,
              editors: editors_name_string,
              agents: agents_name_string,
              year:
                student.aapplication_preference &&
                student.aapplication_preference.expected_application_date,
              school: application.programId.school,
              degree: application.programId.degree,
              program_name: application.programId.program_name,
              application_year:
                student.application_preference &&
                student.application_preference.expected_application_date,
              semester: application.programId.semester
            });
          }
          if (application.admission === '-') {
            pending_table.push({
              _id: student._id,
              name: `${student.firstname}, ${student.lastname}`,
              editors: editors_name_string,
              agents: agents_name_string,
              year:
                student.aapplication_preference &&
                student.application_preference.expected_application_date,
              school: application.programId.school,
              degree: application.programId.degree,
              program_name: application.programId.program_name,
              application_year:
                student.application_preference &&
                student.application_preference.expected_application_date,
              semester: application.programId.semester
            });
          }
        } else if (application.closed === '-') {
          not_yet_closed_table.push({
            _id: student._id,
            name: `${student.firstname}, ${student.lastname}`,
            editors: editors_name_string,
            agents: agents_name_string,
            year:
              student.aapplication_preference &&
              student.application_preference.expected_application_date,
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
    });
  });

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Admissions" {...a11yProps(0)} />
          <Tab label="Rejections" {...a11yProps(1)} />
          <Tab label="Pending" {...a11yProps(2)} />
          <Tab label="Not Closed Yet" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Table2 header={'Admissions'} data={admissions_table} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Table2 header={'Rejections '} data={rejections_table} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Table2 header={'Pending'} data={pending_table} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Table2 header={'Not Closed Yet'} data={not_yet_closed_table} />
      </CustomTabPanel>
    </>
  );
}

export default AdmissionsTable;
