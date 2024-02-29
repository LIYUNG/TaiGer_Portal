import React, { useState } from 'react';
import {
  Button,
  Link,
  Tabs,
  Table,
  Tab,
  Box,
  Typography,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Chip
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table';
import { Link as LinkDom } from 'react-router-dom';
import { matchSorter } from 'match-sorter';
import { useTranslation } from 'react-i18next';

import {
  taskTashboardHeader,
  cvmlrl_overview_closed_header,
  COLORS
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
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import Loading from '../../components/Loading/Loading';

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

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
      size={10}
      placeholder={`Search ${count} records...`}
    />
  );
}

function SortTable2({ columns, data, user }) {
  const { t } = useTranslation();
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
    prepareRow
    // visibleColumns,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    // setPageSize,
    // preGlobalFilteredRows,
    // setGlobalFilter
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
      <Table size="small" {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, x) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={x}>
              {headerGroup.headers.map((column, i) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props

                <TableCell
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
                </TableCell>
              ))}
            </TableRow>
          ))}
          {headerGroups.map((headerGroup, j) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={j}>
              {headerGroup.headers.map((column, i) =>
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                [0, 2, 3, 4, 5, 9].includes(i) ? (
                  <TableCell key={i}>
                    {column.canFilter ? column.render('Filter') : null}
                  </TableCell>
                ) : (
                  <TableCell key={i}></TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={i}>
                {row.cells.map((cell, j) => {
                  return j === 0 ? (
                    <TableCell {...cell.getCellProps()} key={j}>
                      <Link
                        target="_blank"
                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                          row.original.student_id,
                          DEMO.PROFILE_HASH
                        )}`}
                        component={LinkDom}
                      >
                        <Typography fontWeight="bold">
                          {cell.render('Cell')}{' '}
                        </Typography>
                      </Link>
                    </TableCell>
                  ) : j === 1 ? (
                    <TableCell {...cell.getCellProps()} key={j}>
                      {cell.value && cell.value.length > 0 ? (
                        cell.value.map((editor, u) => (
                          <Link
                            key={u}
                            target="_blank"
                            to={`${DEMO.TEAM_EDITOR_LINK(
                              editor._id.toString()
                            )}`}
                            component={LinkDom}
                          >
                            <Typography>
                              <b>{`${editor.firstname} ${editor.lastname}`}</b>
                            </Typography>
                          </Link>
                        ))
                      ) : (
                        <Typography fontWeight="bold">
                          {t('No Editor')}
                        </Typography>
                      )}
                    </TableCell>
                  ) : j === 5 ? (
                    <TableCell {...cell.getCellProps()} key={j}>
                      <Link
                        target="_blank"
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          row.original.thread_id
                        )}
                        component={LinkDom}
                      >
                        {cell.render('Cell')}
                      </Link>
                      {is_TaiGer_role(user) && (
                        <>
                          <br />
                          {row.original.attributes?.map(
                            (attribute) =>
                              [1, 3].includes(attribute.value) && (
                                <Chip
                                  size="small"
                                  label={attribute.name}
                                  key={attribute._id}
                                  color={COLORS[attribute.value]}
                                />
                              )
                          )}
                        </>
                      )}
                    </TableCell>
                  ) : j === 6 ? (
                    cell.value > 14 ? (
                      <TableCell {...cell.getCellProps()} key={j}>
                        <Typography>{cell.render('Cell')}</Typography>
                      </TableCell>
                    ) : (
                      <TableCell {...cell.getCellProps()} key={j}>
                        <Typography>{cell.render('Cell')}</Typography>
                      </TableCell>
                    )
                  ) : j === 4 ? (
                    cell.value < 30 ? (
                      <TableCell {...cell.getCellProps()} key={j}>
                        <Typography>{cell.render('Cell')}</Typography>
                      </TableCell>
                    ) : (
                      <TableCell {...cell.getCellProps()} key={j}>
                        <Typography>{cell.render('Cell')}</Typography>
                      </TableCell>
                    )
                  ) : (
                    <TableCell {...cell.getCellProps()} key={j}>
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <br />
      {/* <div>Showing the first 20 results of {rows.length} rows</div> */}
    </>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function CVMLRLDashboard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [cVMLRLDashboardState, setCVMLRLDashboardState] = useState({
    error: '',
    isLoaded: props.isLoaded,
    data: null,
    success: props.success,
    students: props.students,
    doc_thread_id: '',
    student_id: '',
    program_id: '',
    SetAsFinalFileModel: false,
    isFinalVersion: false,
    status: '', //reject, accept... etc
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const closeSetAsFinalFileModelWindow = () => {
    setCVMLRLDashboardState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: false
    }));
  };
  const ConfirmSetAsFinalFileHandler = () => {
    setCVMLRLDashboardState((prevState) => ({
      ...prevState,
      isLoaded: false // false to reload everything
    }));
    SetFileAsFinal(
      cVMLRLDashboardState.doc_thread_id,
      cVMLRLDashboardState.student_id,
      cVMLRLDashboardState.program_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let temp_students = [...cVMLRLDashboardState.students];
          let student_temp_idx = temp_students.findIndex(
            (student) =>
              student._id.toString() === cVMLRLDashboardState.student_id
          );
          if (cVMLRLDashboardState.program_id) {
            let application_idx = temp_students[
              student_temp_idx
            ].applications.findIndex(
              (application) =>
                application.programId._id.toString() ===
                cVMLRLDashboardState.program_id
            );

            let thread_idx = temp_students[student_temp_idx].applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() ===
                cVMLRLDashboardState.doc_thread_id
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
                thread.doc_thread_id._id.toString() ===
                cVMLRLDashboardState.doc_thread_id
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

          setCVMLRLDashboardState((prevState) => ({
            ...prevState,
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
          setCVMLRLDashboardState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCVMLRLDashboardState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleAsFinalFile = (
    doc_thread_id,
    student_id,
    program_id,
    docName,
    isFinalVersion
  ) => {
    setCVMLRLDashboardState((prevState) => ({
      ...prevState,
      doc_thread_id,
      student_id,
      program_id,
      docName,
      SetAsFinalFileModel: true,
      isFinalVersion
    }));
  };

  const ConfirmError = () => {
    setCVMLRLDashboardState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const { res_modal_status, res_modal_message, isLoaded } =
    cVMLRLDashboardState;

  if (!isLoaded && !cVMLRLDashboardState.students) {
    return <Loading />;
  }

  const open_tasks_arr = open_tasks_with_editors(cVMLRLDashboardState.students);
  const open_tasks_arr2 = open_tasks(cVMLRLDashboardState.students);

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
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          <Tab label="Open" {...a11yProps(0)} />
          <Tab label="Closed" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Banner
          ReadOnlyMode={true}
          bg={'primary'}
          title={'warning'}
          path={'/'}
          text={
            'Received students inputs and Active Tasks. Be aware of the deadline!'
          }
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable2
          columns={taskTashboardHeader}
          user={user}
          data={cvmlrl_active_tasks}
        />
        <Banner
          ReadOnlyMode={true}
          bg={'info'}
          title={'info'}
          path={'/'}
          text={'No student inputs tasks. Agents should push students'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable2
          columns={taskTashboardHeader}
          user={user}
          data={cvmlrl_idle_tasks}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Banner
          ReadOnlyMode={true}
          bg={'success'}
          title={'success'}
          path={'/'}
          text={'These tasks are closed'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <Typography sx={{ p: 2 }}>
          Note: if the documents are not closed but locate here, it is becaue
          the applications are already submitted. The documents can safely
          closed eventually.
        </Typography>
        <SortTable
          columns={cvmlrl_overview_closed_header}
          data={cvmlrl_closed_v2}
          user={user}
          handleAsFinalFile={handleAsFinalFile}
        />
      </CustomTabPanel>
      <ModalNew
        open={cVMLRLDashboardState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5">{t('Warning')}</Typography>
        <Typography>
          Do you want to set {cVMLRLDashboardState.docName} as{' '}
          {cVMLRLDashboardState.isFinalVersion ? 'open' : 'final'} for student?
        </Typography>
        <Button
          variant="contained"
          disabled={!isLoaded}
          onClick={ConfirmSetAsFinalFileHandler}
        >
          {t('Yes')}
        </Button>
        <Button onClick={closeSetAsFinalFileModelWindow}>No</Button>
        {!isLoaded && <Loading />}
      </ModalNew>
    </>
  );
}

export default CVMLRLDashboard;
