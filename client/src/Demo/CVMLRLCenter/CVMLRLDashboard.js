import React from 'react';
import {
  Row,
  Col,
  Spinner,
  Table,
  Modal,
  Button,
  Tab,
  Tabs
} from 'react-bootstrap';

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
import {
  spinner_style,
  is_started_tasks_status,
  is_not_started_tasks_status,
  is_new_message_status,
  is_pending_status,
  return_thread_status2,
  cvmlrlclosedlist,
  taskTashboardHeader,
  cvmlrl_overview_closed_header
} from '../Utils/contants';
import {
  is_TaiGer_role,
  open_tasks,
  open_tasks_with_editors
} from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { SetFileAsFinal } from '../../api';
import Banner from '../../components/Banner/Banner';
import SortTable from '../../components/SortTable/SortTable';
function SortTable2({ columns, data, user, handleAsFinalFile }) {
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

  const handleAsFinalFileThread = (
    thread_id,
    student_id,
    program_id,
    documenName,
    isFinalVersion
  ) => {
    handleAsFinalFile(
      thread_id,
      student_id,
      program_id,
      documenName,
      isFinalVersion
    );
  };

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
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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

                  {/* <th {...column.getHeaderProps()}>
                      {column.canFilter ? column.render('Filter') : null}
                  </th> */}
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
                    <td {...cell.getCellProps()}>
                      <Link
                        target="_blank"
                        to={`/student-database/${row.original.student_id}/profile`}
                        className="text-light"
                        style={{ textDecoration: 'none' }}
                      >
                        <b>{cell.render('Cell')}</b>
                      </Link>
                    </td>
                  ) : j === 1 ? (
                    <td {...cell.getCellProps()}>
                      {cell.value && cell.value.length > 0 ? (
                        cell.value.map((editor, i) => (
                          <Link
                            target="_blank"
                            to={`/teams/editors/${editor._id.toString()}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <p className="text-light my-0">
                              <b>{`${editor.firstname} ${editor.lastname}`}</b>
                            </p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-danger my-0">
                          <b>No Editor</b>
                        </p>
                      )}
                    </td>
                  ) : j === 4 ? (
                    <td {...cell.getCellProps()}>
                      <Link
                        target="_blank"
                        to={'/document-modification/' + row.original.thread_id}
                        className="text-info"
                        style={{ textDecoration: 'none' }}
                      >
                        {cell.render('Cell')}
                      </Link>
                    </td>
                  ) : j === 5 ? (
                    cell.value > 14 ? (
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
                  ) : j === 3 ? (
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

class CVMLRLDashboard extends React.Component {
  state = {
    error: '',
    isLoaded: this.props.isLoaded,
    data: null,
    success: this.props.success,
    students: this.props.students,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    isFinalVersion: false,
    status: '', //reject, accept... etc
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };

  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false
    }));
  };
  ConfirmSetAsFinalFileHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false // false to reload everything
    }));
    SetFileAsFinal(
      this.state.doc_thread_id,
      this.state.student_id,
      this.state.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let temp_students = [...this.state.students];
          let student_temp_idx = temp_students.findIndex(
            (student) => student._id.toString() === this.state.student_id
          );
          if (this.state.program_id) {
            let application_idx = temp_students[
              student_temp_idx
            ].applications.findIndex(
              (application) =>
                application.programId._id.toString() === this.state.program_id
            );

            let thread_idx = temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() === this.state.doc_thread_id
            );

            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].isFinalVersion =
              data.isFinalVersion;

            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].updatedAt = data.updatedAt;
            temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread[thread_idx].doc_thread_id.updatedAt =
              data.updatedAt;
          } else {
            let general_doc_idx = temp_students[
              student_temp_idx
            ].generaldocs_threads.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() === this.state.doc_thread_id
            );
            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].isFinalVersion = data.isFinalVersion;

            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].updatedAt = data.updatedAt;

            temp_students[student_temp_idx].generaldocs_threads[
              general_doc_idx
            ].doc_thread_id.updatedAt = data.updatedAt;
          }

          this.setState((state) => ({
            ...state,
            docName: '',
            isLoaded: true,
            students: temp_students,
            success: success,
            SetAsFinalFileModel: false,
            isFinalVersion: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  handleAsFinalFile = (
    doc_thread_id,
    student_id,
    program_id,
    docName,
    isFinalVersion
  ) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      student_id,
      program_id,
      docName,
      SetAsFinalFileModel: true,
      isFinalVersion
    }));
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_modal_status, res_modal_message, isLoaded } = this.state;

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };

    if (!isLoaded && !this.state.students) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    const open_tasks_arr = open_tasks_with_editors(this.state.students);
    const open_tasks_arr2 = open_tasks(this.state.students);

    const cvmlrl_active_tasks = open_tasks_arr.filter(
      (open_task) =>
        open_task.show &&
        !open_task.isFinalVersion &&
        open_task.latest_message_left_by_id !== ''
    );
    const cvmlrl_idle_tasks = open_tasks_arr.filter(
      (open_task) =>
        open_task.show &&
        !open_task.isFinalVersion &&
        open_task.latest_message_left_by_id === ''
    );
    const cvmlrl_closed_v2 = open_tasks_arr2.filter(
      (open_task) => open_task.show && open_task.isFinalVersion
    );
    return (
      <>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Col>
            <Tabs defaultActiveKey="open" fill={true} justify={true}>
              <Tab eventKey="open" title="Open">
                <Banner
                  ReadOnlyMode={true}
                  bg={'primary'}
                  title={'Active:'}
                  path={'/'}
                  text={
                    'Received students inputs and Active Tasks. Be aware of the deadline!'
                  }
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                <SortTable2
                  columns={taskTashboardHeader}
                  data={cvmlrl_active_tasks}
                  user={this.props.user}
                  handleAsFinalFile={this.handleAsFinalFile}
                />
                <Banner
                  ReadOnlyMode={true}
                  bg={'info'}
                  title={'Info:'}
                  path={'/'}
                  text={'No student inputs tasks. Agents should push students'}
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                <SortTable
                  columns={taskTashboardHeader}
                  data={cvmlrl_idle_tasks}
                  user={this.props.user}
                  handleAsFinalFile={this.handleAsFinalFile}
                />
              </Tab>
              <Tab eventKey="closed" title="Closed">
                <Banner
                  ReadOnlyMode={true}
                  bg={'success'}
                  title={'Closed'}
                  path={'/'}
                  text={''}
                  link_name={''}
                  removeBanner={this.removeBanner}
                  notification_key={'x'}
                />
                <SortTable
                  columns={cvmlrl_overview_closed_header}
                  data={cvmlrl_closed_v2}
                  user={this.props.user}
                  handleAsFinalFile={this.handleAsFinalFile}
                />
                <Row className="mt-4">
                  <p>
                    Note: if the documents are not closed but locate here, it is
                    becaue the applications are already submitted. The documents
                    can safely closed eventually.
                  </p>
                </Row>
              </Tab>
            </Tabs>
          </Col>
        </Row>
        <Modal
          show={this.state.SetAsFinalFileModel}
          onHide={this.closeSetAsFinalFileModelWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.docName} as{' '}
            {this.state.isFinalVersion ? 'open' : 'final'} for student?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!isLoaded}
              onClick={this.ConfirmSetAsFinalFileHandler}
            >
              Yes
            </Button>

            <Button onClick={this.closeSetAsFinalFileModelWindow}>No</Button>
            {!isLoaded && (
              <div style={spinner_style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default CVMLRLDashboard;
