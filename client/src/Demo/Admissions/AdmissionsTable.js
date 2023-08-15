import React, { useState, useEffect } from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  // useRowSelect,
  usePagination
} from 'react-table';
import { Link } from 'react-router-dom';

import { Button, Table, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        // placeholder={`${count} records...`}
        placeholder={` TUM, Management ...`}
        style={{
          fontSize: '0.9rem',
          border: '0'
        }}
      />
    </span>
  );
}

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

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
// function SliderColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id }
// }) {
//   // Calculate the min and max
//   // using the preFilteredRows

//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     preFilteredRows.forEach((row) => {
//       min = Math.min(row.values[id], min);
//       max = Math.max(row.values[id], max);
//     });
//     return [min, max];
//   }, [id, preFilteredRows]);

//   return (
//     <>
//       <input
//         type="range"
//         min={min}
//         max={max}
//         value={filterValue || min}
//         onChange={(e) => {
//           setFilter(parseInt(e.target.value, 10));
//         }}
//       />
//       <button onClick={() => setFilter(undefined)}>Off</button>
//     </>
//   );
// }

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
// function NumberRangeColumnFilter({
//   column: { filterValue = [], preFilteredRows, setFilter, id }
// }) {
//   const [min, max] = React.useMemo(() => {
//     let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     preFilteredRows.forEach((row) => {
//       min = Math.min(row.values[id], min);
//       max = Math.max(row.values[id], max);
//     });
//     return [min, max];
//   }, [id, preFilteredRows]);

//   return (
//     <div
//       style={{
//         display: 'flex'
//       }}
//     >
//       <input
//         value={filterValue[0] || ''}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [
//             val ? parseInt(val, 10) : undefined,
//             old[1]
//           ]);
//         }}
//         placeholder={`Min (${min})`}
//         style={{
//           width: '70px',
//           marginRight: '0.5rem'
//         }}
//       />
//       to
//       <input
//         value={filterValue[1] || ''}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [
//             old[0],
//             val ? parseInt(val, 10) : undefined
//           ]);
//         }}
//         placeholder={`Max (${max})`}
//         style={{
//           width: '70px',
//           marginLeft: '0.5rem'
//         }}
//       />
//     </div>
//   );
// }

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

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
    state,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    // selectedFlatRows,
    toggleAllRowsSelected,
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
      <Table
        className="my-0 mx-2"
        variant="dark"
        text="light"
        responsive
        hover
        size="sm"
        {...getTableProps()}
      >
        {/* <table {...getTableProps()}> */}
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
          {/* <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left'
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr> */}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return (
                    <td {...cell.getCellProps()}>
                      <Link
                        to={
                          '/student-database/' +
                          row.original._id +
                          '/background'
                        }
                        className="text-info"
                        style={{ textDecoration: 'none' }}
                      >
                        {cell.render('Cell')}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {/* </table> */}
      </Table>
      <div className="pagination">
        <Row>
          <Col md={1}>
            <Button
              size="sm"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {'<<'}
            </Button>
          </Col>{' '}
          <Col md={1}>
            <Button
              size="sm"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              {'<'}
            </Button>
          </Col>{' '}
          <Col md={1}>
            <Button
              size="sm"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </Button>
          </Col>{' '}
          <Col md={1}>
            <Button
              size="sm"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </Button>
          </Col>{' '}
          <Col md={2}>
            <span className="my-0 mx-0 text-light">
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
          </Col>
          <Col md={4}>
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
          </Col>{' '}
          <Col md={2}>
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
          </Col>
        </Row>
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

function AdmissionsTable(props) {
  let [statedata, setStatedata] = useState({
    students: props.students
  });

  let admissions_table = [];
  let rejections_table = [];
  let pending_table = [];
  let not_yet_closed_table = [];
  statedata.students.map((student) => {
    let editors_name_string = '';
    let agents_name_string = '';
    for (const editor of student.editors) {
      editors_name_string += `${editor.firstname} `;
    }
    for (const agent of student.agents) {
      agents_name_string += `${agent.firstname} `;
    }
    student.applications.map((application) => {
      if (application.decided === 'O') {
        if (application.closed === 'O') {
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
      <Tabs
        defaultActiveKey="Admissions"
        id="fill-tab-example"
        fill={true}
        justify={true}
      >
        <Tab eventKey="Admissions" title="Admissions" className="my-0 mx-0">
          <Row>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Table2 header={'Admissions'} data={admissions_table} />
            </Card>
          </Row>
        </Tab>
        <Tab eventKey="Rejections" title="Rejections">
          <Row>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Table2 header={'Rejections '} data={rejections_table} />
            </Card>
          </Row>
        </Tab>
        <Tab eventKey="Pending" title="Pending">
          <Row>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Table2 header={'Pending'} data={pending_table} />
            </Card>
          </Row>
        </Tab>
        <Tab eventKey="NotClosedYet" title="Not Closed Yet">
          <Row>
            <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
              <Table2 header={'Not Closed Yet'} data={not_yet_closed_table} />
            </Card>
          </Row>
        </Tab>
      </Tabs>
    </>
  );
}

export default AdmissionsTable;
