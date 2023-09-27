import React, { Fragment, useEffect, useState } from 'react';
import {
  Row,
  Col,
  Table,
  Card,
  Tabs,
  Tab,
  Collapse,
  Form
} from 'react-bootstrap';
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

import { programs_refactor, is_TaiGer_role } from '../Utils/checking-functions';
import { applicationFileOverviewHeader } from '../Utils/contants';
import TabStudBackgroundDashboard from '../Dashboard/MainViewTab/StudDocsOverview/TabStudBackgroundDashboard';
import ApplicationProgressCardBody from '../../components/ApplicationProgressCard/ApplicationProgressCardBody';

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
              {headerGroup.headers.map((column, i) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props

                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={i}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ' ⮃'}
                  </span>
                </th>
              ))}
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
              <Fragment key={i}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, j) => {
                    return j === 0 ? (
                      is_TaiGer_role(user) ? (
                        <td {...cell.getCellProps()} key={j}>
                          {/* <Link
                          to={`/student-applications/${row.original.student_id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <AiFillEdit color="grey" size={16} />
                        </Link> */}
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
                          <p className="text-light my-0">
                            {cell.render('Cell')}
                          </p>
                        </td>
                      )
                    ) : (
                      <td {...cell.getCellProps()} key={j}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
                <Collapse in={true}>
                  <tr {...row.getRowProps()}>
                    <td colSpan="12">
                      <ApplicationProgressCardBody application={row} />
                    </td>
                  </tr>
                </Collapse>
              </Fragment>
            );
          })}
        </tbody>
      </Table>
      <br />
      {/* <div>Showing the first 20 results of {rows.length} rows</div> */}
    </>
  );
}

const AdvancedTable = ({ data, columns, students, user }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [collapsedRows, setCollapsedRows] = useState({});
  const [filterText, setFilterText] = useState('');
  // const [isInProgressOnly, setIsInProgressOnly] = useState(true);

  // useEffect(() => {}, [isInProgressOnly]);
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
  // console.log(isInProgressOnly);
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

  const handleOncheck = (e) => {
    console.log('Checkbox value changed:', e.target.value);
    console.log('Checkbox changed:', e.target.checked);
    // e.preventDefault();
    // console.log(isInProgressOnly);
    const checked = e.target.checked;
    setIsInProgressOnly(checked);
  };
  // console.log(filteredData);
  return (
    <div>
      Search:{' '}
      <input
        type="text"
        placeholder=". . ."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />{' '}
      {/* <input
        type="checkbox"
        label={`in Progess Only`}
        value={'Is_Paid'}
        checked={isInProgressOnly}
        onChange={handleOncheck}
      /> */}
      {/* <Form>
        <Form.Group>
          <Form.Check
            custom
            type="checkbox"
            label={`in Progess Only`}
            value={'is'}
            checked={isInProgressOnly}
            onChange={(e) => handleOncheck(e)}
          />
        </Form.Group>
      </Form> */}
      <Table
        responsive
        className="my-0"
        variant="dark"
        text="light"
        bordered
        hover
        size="sm"
      >
        <thead>
          <tr>
            {columns.map((column, idx) => (
              <th onClick={() => handleSort(`${column.accessor}`)}>
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
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <React.Fragment key={index}>
              <tr
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
                    <td onClick={() => handleCollapse(index)}>
                      <Link
                        to={`/student-database/${item.student_id}/profile`}
                        className="text-info"
                        target="_blank"
                      >
                        {item[column.accessor]}
                      </Link>
                    </td>
                  ) : (
                    <td onClick={() => handleCollapse(index)}>
                      {column.accessor === 'program' &&
                      item.program_id !== '-' ? (
                        <Link
                          to={`/programs/${item.program_id}`}
                          className="text-info"
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
                    </td>
                  )
                )}
              </tr>
              {collapsedRows[index] && (
                <tr>
                  <td colSpan="12">
                    <ApplicationProgressCardBody
                      student={item.student}
                      application={item.application}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

class ApplicationOverviewTabs extends React.Component {
  render() {
    const applications_arr = programs_refactor(this.props.students);

    return (
      <>
        <Tabs fill={true} justify={true}>
          {is_TaiGer_role(this.props.user) && (
            <Tab
              eventKey="active_student_list"
              title={`Active Student List (${this.props.students?.length})`}
            >
              <Row>
                <Col>
                  <TabStudBackgroundDashboard
                    user={this.props.user}
                    students={this.props.students}
                    // updateStudentArchivStatus={this.updateStudentArchivStatus}
                    isArchivPage={false}
                  />
                </Col>
              </Row>
            </Tab>
          )}
          <Tab
            eventKey="application_documents_overview"
            title="Application Overview"
          >
            <Row>
              <Col>
                <AdvancedTable
                  columns={applicationFileOverviewHeader}
                  data={applications_arr}
                  students={this.props.students}
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
