import React from 'react';
import { Row, Col, Table, Card, Tabs, Tab } from 'react-bootstrap';
import { AiFillEdit } from 'react-icons/ai';

import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce
} from 'react-table';
import { Link } from 'react-router-dom';
import { matchSorter } from 'match-sorter';

import {
  isProgramNotSelectedEnough,
  programs_refactor,
  is_TaiGer_role
} from '../Utils/checking-functions';
import {
  applicationFileOverviewHeader,
  applicationOverviewHeader
} from '../Utils/contants';

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
      Global Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        // placeholder={`${count} records...`}
        placeholder={` TUM, Xiao-Ming ...`}
        style={{
          fontSize: '0.9rem',
          border: '0'
        }}
      />
    </span>
  );
}

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
      size={9}
      placeholder={`Filter ${count} records...`}
    />
  );
}

function SortTable({ columns, data, user }) {
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
    rows,
    prepareRow,
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
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 2000);

  return (
    <>
      <Table
        className="my-0"
        variant="dark"
        text="light"
        bordered
        hover
        size="sm"
      >
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left'
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                // globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
      <Table
        responsive
        bordered
        hover
        className="my-0 mx-0"
        variant="dark"
        text="light"
        size="sm"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup, j) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={j}>
              {headerGroup.headers.map((column, i) =>
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                i === 0 ? (
                  is_TaiGer_role(user) ? (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={i}
                    >
                      {column.render('Header')}
                      {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                      {/* Add a sort direction indicator */}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ' ⮃'}
                      </span>
                    </th>
                  ) : (
                    <th></th>
                  )
                ) : (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={i}
                  >
                    {column.render('Header')}
                    {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ' ⮃'}
                    </span>
                  </th>
                )
              )}
            </tr>
          ))}
          {headerGroups.map((headerGroup, j) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={j}>
              {headerGroup.headers.map((column, i) =>
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                i === 0 ? (
                  is_TaiGer_role(user) ? (
                    <th key={i}>
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </th>
                  ) : (
                    <th></th>
                  )
                ) : (
                  <th key={i}>
                    <div>
                      {column.canFilter ? column.render('Filter') : null}
                    </div>
                  </th>
                )
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, j) => {
                  return j === 0 ? (
                    is_TaiGer_role(user) ? (
                      <td {...cell.getCellProps()} key={j}>
                        <Link
                          to={`/student-applications/${row.original.student_id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <AiFillEdit color="grey" size={16} />
                        </Link>
                        <Link
                          target="_blank"
                          to={`/student-database/${row.original.student_id}/profile`}
                          className="text-info"
                          style={{ textDecoration: 'none' }}
                        >
                          <b>{cell.render('Cell')}</b>
                        </Link>
                      </td>
                    ) : (
                      <td key={j}>
                        <Link
                          to={`/student-applications/${row.original.student_id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <AiFillEdit color="grey" size={16} />
                        </Link>
                      </td>
                    )
                  ) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(j) ? (
                    <td {...cell.getCellProps()} key={j}>
                      {row.original.decided === 'O' ? (
                        row.original.closed === 'O' ? (
                          <Link
                            target="_blank"
                            to={'/programs/' + row.original.program_id}
                            className="text-warning"
                            style={{ textDecoration: 'none' }}
                          >
                            {cell.render('Cell')}
                          </Link>
                        ) : (
                          <Link
                            target="_blank"
                            to={'/programs/' + row.original.program_id}
                            className="text-info"
                            style={{ textDecoration: 'none' }}
                          >
                            {cell.render('Cell')}
                          </Link>
                        )
                      ) : (
                        <Link
                          target="_blank"
                          to={'/programs/' + row.original.program_id}
                          className="text-secondary"
                          title="Not decided yet"
                          style={{ textDecoration: 'none' }}
                        >
                          {cell.render('Cell')}
                        </Link>
                      )}
                    </td>
                  ) : j === 11 ? (
                    cell.value < 30 ? (
                      <td {...cell.getCellProps()} key={j}>
                        <p className="text-danger my-0">
                          {cell.render('Cell')}
                        </p>
                      </td>
                    ) : (
                      <td {...cell.getCellProps()} key={j}>
                        <p className="text-light my-0">{cell.render('Cell')}</p>
                      </td>
                    )
                  ) : (
                    <td {...cell.getCellProps()} key={j}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <br />
      {/* <div>Showing the first 20 results of {rows.length} rows</div> */}
    </>
  );
}

class ApplicationOverviewTabs extends React.Component {
  render() {
    const listStudentProgramNotSelected = this.props.students.map(
      (student, i) => (
        <div key={i}>
          {student.applications &&
            student.applications.length < student.applying_program_count && (
              <li className="text-light">
                {student.firstname} {student.lastname}
              </li>
            )}
        </div>
      )
    );

    const applications_arr = programs_refactor(this.props.students);

    return (
      <>
        <Tabs fill={true} justify={true}>
          {is_TaiGer_role(this.props.user) && (
            <Tab eventKey="active_student_list" title="Active Student List">
              <Row>
                <Col>
                  {this.props.students?.map((student, i) => (
                    <>
                      <li>
                        <Link
                          to={`/student-database/${student._id.toString()}/profile`}
                        >
                          {student.firstname} {student.lastname}{' '}
                          {student.firstname_chinese} {student.lastname_chinese}{' '}
                          {
                            student.application_preference
                              ?.expected_application_date
                          }{' '}
                          {
                            student.application_preference
                              ?.expected_application_semester
                          }
                        </Link>
                      </li>
                    </>
                  ))}
                  {/* <SortTable
                  columns={applicationOverviewHeader}
                  data={applications_arr}
                  user={this.props.user}
                /> */}
                </Col>
              </Row>
            </Tab>
          )}

          <Tab
            eventKey="application_status"
            title="Application Progress Overview"
          >
            {isProgramNotSelectedEnough(this.props.students) && (
              <Row>
                <Col>
                  <Card className="mb-2 mx-0" bg={'danger'} text={'light'}>
                    <Card.Body>
                      <p className="text-light">
                        The following students did not choose enough programs:
                      </p>
                      {listStudentProgramNotSelected}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
            <Row>
              <Col>
                <SortTable
                  columns={applicationOverviewHeader}
                  data={applications_arr}
                  user={this.props.user}
                />
              </Col>
            </Row>
          </Tab>
          <Tab
            eventKey="application_documents_overview"
            title="Application Document Overview"
          >
            <Row>
              <Col>
                <SortTable
                  columns={applicationFileOverviewHeader}
                  data={applications_arr}
                  user={this.props.user}
                />
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default ApplicationOverviewTabs;
