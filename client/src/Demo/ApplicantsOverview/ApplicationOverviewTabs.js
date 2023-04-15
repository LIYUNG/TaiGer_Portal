import React from 'react';
import {
  Row,
  Col,
  Spinner,
  Table,
  Card,
  Tabs,
  Tab,
  Button
} from 'react-bootstrap';
import { AiFillEdit } from 'react-icons/ai';

import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
  usePagination
} from 'react-table';
import { Link } from 'react-router-dom';

import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import ApplicationFilesProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationFilesProgress';
import {
  isProgramNotSelectedEnough,
  programs_refactor,
  is_TaiGer_role
} from '../Utils/checking-functions';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import { updateArchivStudents } from '../../api';

function SortTable({ columns, data, user }) {
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
      data
    },
    useFilters, // useFilters!
    useSortBy
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 2000);

  return (
    <>
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
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <>
                  {i === 0 ? (
                    is_TaiGer_role(user) ? (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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
                  )}
                </>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return j === 0 ? (
                    is_TaiGer_role(user) ? (
                      <td {...cell.getCellProps()}>
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
                      <td>
                        <Link
                          to={`/student-applications/${row.original.student_id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <AiFillEdit color="grey" size={16} />
                        </Link>
                      </td>
                    )
                  ) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(j) ? (
                    <td {...cell.getCellProps()}>
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
                      <td {...cell.getCellProps()}>
                        <p className="text-danger my-0">
                          {cell.render('Cell')}
                        </p>
                      </td>
                    ) : (
                      <td {...cell.getCellProps()}>
                        <p className="text-light my-0">{cell.render('Cell')}</p>
                      </td>
                    )
                  ) : (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
  state = {
    error: '',
    isLoaded: this.props.isLoaded,
    data: null,
    success: this.props.success,
    students: this.props.students,
    status: '', //reject, accept... etc
    res_status: 0
  };

  updateStudentArchivStatus = (studentId, isArchived) => {
    updateArchivStudents(studentId, isArchived).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            students: data,
            success: success,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    );
  };
  render() {
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.students) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    const listStudentProgramNotSelected = this.state.students.map(
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

    const application_progress = this.state.students.map((student, i) => (
      <ApplicationProgress
        key={i}
        user={this.props.user}
        student={student}
        updateStudentArchivStatus={this.updateStudentArchivStatus}
        isDashboard={true}
      />
    ));

    const application_documents_overview = this.state.students.map(
      (student, i) => (
        <ApplicationFilesProgress
          key={i}
          role={this.props.user.role}
          student={student}
          updateStudentArchivStatus={this.updateStudentArchivStatus}
          isDashboard={true}
        />
      )
    );

    const columns = [
      {
        Header: 'First-, Last Name',
        accessor: 'firstname_lastname',
        filter: 'fuzzyText'
      },
      {
        Header: 'University',
        accessor: 'school',
        filter: 'fuzzyText'
      },
      {
        Header: 'Degree',
        accessor: 'degree'
      },
      {
        Header: 'Program',
        accessor: 'program_name'
      },
      {
        Header: 'Semester',
        accessor: 'semester',
        filter: 'fuzzyText'
      },
      {
        Header: 'TOEFL',
        accessor: 'toefl'
      },
      {
        Header: 'IELTS',
        accessor: 'ielts'
      },
      {
        Header: 'Deadline',
        accessor: 'application_deadline'
      },
      {
        Header: 'Decided',
        accessor: 'decided'
      },
      {
        Header: 'Submitted',
        accessor: 'closed'
      },
      {
        Header: 'Offer',
        accessor: 'admission'
      },
      {
        Header: 'Days left',
        accessor: 'days_left'
      }
    ];

    const columns2 = [
      {
        Header: 'First-, Last Name',
        accessor: 'firstname_lastname',
        filter: 'fuzzyText'
      },
      {
        Header: 'University',
        accessor: 'school',
        filter: 'fuzzyText'
      },
      {
        Header: 'Degree',
        accessor: 'degree'
      },
      {
        Header: 'Program',
        accessor: 'program_name'
      },
      {
        Header: 'Deadline',
        accessor: 'deadline'
      },
      {
        Header: 'Base Docs',
        accessor: 'base_docs'
      },
      {
        Header: 'Uni-Assist',
        accessor: 'uniassist'
      },
      {
        Header: 'CV',
        accessor: 'cv'
      },
      {
        Header: 'ML/RL',
        accessor: 'ml_rl'
      },
      {
        Header: 'Ready',
        accessor: 'ready'
      }
    ];
    const applications_arr = programs_refactor(this.state.students);

    return (
      <>
        <Tabs fill={true} justify={true}>
          <Tab
            eventKey="application_status"
            title="Application Progress Overview"
          >
            {isProgramNotSelectedEnough(this.state.students) && (
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
                {/* <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                  size="sm"
                >
                  <thead>
                    <tr>
                      <th></th>
                      {is_TaiGer_role(this.props.user) && (
                        <>
                          <th>First-, Last Name</th>
                          <th
                            title={
                              'Number of applications student should submit'
                            }
                          >
                            #
                          </th>
                        </>
                      )}
                      {window.programstatuslist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{application_progress}</tbody>
                </Table> */}
                <SortTable
                  columns={columns}
                  data={applications_arr}
                  user={this.props.user}
                />
              </Col>
            </Row>
          </Tab>
          {/* <Tab
            eventKey="application_documents_overview"
            title="Application Document Overview"
          >
            <Row>
              <Col>
                <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                  size="sm"
                >
                  <thead>
                    <tr>
                      {is_TaiGer_role(this.props.user) && (
                        <th>First-, Last Name</th>
                      )}
                      <th>University</th>
                      <th>Programs</th>
                      <th>Deadline</th>
                      {window.programs_files_checklist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{application_documents_overview}</tbody>
                </Table>
              </Col>
            </Row>
          </Tab> */}
          <Tab
            eventKey="application_documents_overview"
            title="Application Document Overview"
          >
            <Row>
              <Col>
                {/* <Table
                  responsive
                  bordered
                  hover
                  className="my-0 mx-0"
                  variant="dark"
                  text="light"
                  size="sm"
                >
                  <thead>
                    <tr>
                      {is_TaiGer_role(this.props.user) && (
                        <th>First-, Last Name</th>
                      )}
                      <th>University</th>
                      <th>Programs</th>
                      <th>Deadline</th>
                      {window.programs_files_checklist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{application_documents_overview}</tbody>
                </Table> */}
                <SortTable
                  columns={columns2}
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
