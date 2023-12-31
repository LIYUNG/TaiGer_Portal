import React, { useState, useEffect } from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
  usePagination
} from 'react-table';
import { Link, Redirect } from 'react-router-dom';

import ProgramListSubpage from './ProgramListSubpage';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { Role, spinner_style } from '../Utils/contants';

import { Button, Modal, Table, Row, Col, Spinner, Card } from 'react-bootstrap';
import { getPrograms, assignProgramToStudent, createProgram } from '../../api';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramListSingleStudentAssignSubpage from './ProgramListSingleStudentAssignSubpage';
import NewProgramEdit from './NewProgramEdit';
import { is_TaiGer_role } from '../Utils/checking-functions';

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
      // size={10}
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
function Table2(props) {
  // let [modalShowAssignWindow, setModalShow] = useState(false);
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
    state: { pageIndex, pageSize, selectedRowIds }
  } = useTable(
    {
      columns: props.columns,
      data: props.data,
      initialState: { pageSize: 20 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes
      // autoResetSelectedRows: false,
      // autoResetSelectedCell: false,
      // autoResetSelectedColumn: false
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
        ...columns
      ]);
    }
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 12);
  useEffect(() => {
    const data_idxes = Object.keys(selectedRowIds);
    props.setPrograms({
      programIds: data_idxes.map((idx) => props.data[idx]._id),
      schools: data_idxes.map((idx) => props.data[idx].school),
      program_names: data_idxes.map((idx) => props.data[idx].program_name),
      degree: data_idxes.map((idx) => props.data[idx].degree),
      semester: data_idxes.map((idx) => props.data[idx].semester)
    });
  }, [selectedRowIds]);

  useEffect(() => {
    // TODO: The following 2 callback only triggered when program assigned. (How?)
    setGlobalFilter([]);
    toggleAllRowsSelected(false);
    props.setTableStates((state) => ({
      ...state,
      isAssigning: false
    }));
  }, [props.isAssigning]);

  return (
    <>
      <Table variant="dark" text="light" bordered hover size="sm">
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left'
              }}
            >
              <span className="mx-2" style={{ cursor: 'pointer' }}>
                {props.programs.programIds.length !== 0 && (
                  <i
                    className="feather icon-user-plus"
                    onClick={props.setModalShow2}
                  />
                )}
              </span>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
      <Table
        className="my-0 mx-2"
        variant="dark"
        text="light"
        responsive
        bordered
        hover
        size="sm"
        {...getTableProps()}
      >
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
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {j === 0 ? (
                        <>{cell.render('Cell')}</>
                      ) : (
                        <Link
                          target="_blank"
                          to={`${DEMO.SINGLE_PROGRAM_LINK(row.original._id)}`}
                          className="text-info"
                          style={{ textDecoration: 'none' }}
                        >
                          {cell.render('Cell')}
                        </Link>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div>
        <Row>
          <Col md={12}>
            <p className="my-1">
              <span
                className="ms-4"
                style={{ color: !canPreviousPage ? 'grey' : 'white' }}
              >
                <i
                  className="mx-1 feather icon-chevrons-left"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                />
              </span>
              <span style={{ color: !canPreviousPage ? 'grey' : 'white' }}>
                <i
                  className="mx-1 feather icon-chevron-left"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                />
              </span>
              <span style={{ color: !canNextPage ? 'grey' : 'white' }}>
                <i
                  className="mx-1 feather icon-chevron-right"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                />
              </span>
              <span style={{ color: !canNextPage ? 'grey' : 'white' }}>
                <i
                  className="mx-1 feather icon-chevrons-right"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                />
              </span>
              <span className="text-light mx-2" style={{ float: 'right' }}>
                Go to page:{' '}
                <input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(page);
                  }}
                  style={{ width: '50px' }}
                />
                <strong className="mx-2">
                  {pageIndex + 1} / {pageOptions.length}
                </strong>{' '}
                <select
                  style={{ float: 'right' }}
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
              </span>
            </p>
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

function ProgramList(props) {
  let [tableStates, setTableStates] = useState({
    success: false,
    isloaded: false,
    isAssigning: false,
    isButtonDisable: false,
    error: null,
    modalShowAssignWindow: false,
    modalShowAssignSuccessWindow: false,
    res_modal_status: 0,
    res_modal_message: ''
  });
  let [statedata, setStatedata] = useState({
    success: false,
    programs: null,
    isloaded: false,
    res_modal_status: 0,
    error: '',
    res_status: 0
  });

  let [programs, setPrograms] = useState({
    programIds: [],
    schools: [],
    program_names: [],
    degree: [],
    semester: []
  });
  let [studentId, setStudentId] = useState('');
  let [isCreationMode, setIsCreationMode] = useState(false);

  if (!is_TaiGer_role(props.user)) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  TabTitle('Program List');
  useEffect(() => {
    getPrograms().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStatedata((state) => ({
            ...state,
            success: success,
            programs: data,
            isloaded: true,
            res_status: status
          }));
        } else {
          setStatedata((state) => ({
            ...state,
            isloaded: true,
            res_status: status
          }));
        }
      },
      (error) =>
        setStatedata((state) => ({
          ...state,
          error,
          isloaded: true
        }))
    );
  }, []);

  const assignProgram = (assign_data) => {
    const { student_id, program_ids } = assign_data;
    setTableStates((state) => ({
      ...state,
      isAssigning: true,
      isButtonDisable: true
    }));
    assignProgramToStudent(student_id, program_ids).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setTableStates((state) => ({
            ...state,
            isLoaded: true,
            isAssigning: false,
            isButtonDisable: false,
            modalShowAssignSuccessWindow: true,
            modalShowAssignWindow: false,
            success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setTableStates((state) => ({
            ...state,
            isLoaded: true,
            isAssigning: false,
            isButtonDisable: false,
            modalShowAssignWindow: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setTableStates((state) => ({
          ...state,
          isLoaded: true,
          isAssigning: false,
          isButtonDisable: false,
          error,
          res_modal_status: 500,
          res_modal_message: 'Server error'
        }));
      }
    );
  };
  const setModalHide = () => {
    setTableStates((state) => ({
      ...state,
      modalShowAssignWindow: false
    }));
  };
  const onHideAssignSuccessWindow = () => {
    setTableStates((state) => ({
      ...state,
      modalShowAssignSuccessWindow: false
    }));
    if (props.isStudentApplicationPage) {
      window.location.reload(true);
    }
  };

  const onSubmitAddToStudentProgramList = (e) => {
    e.preventDefault();
    const student_id = studentId;
    assignProgram({ student_id, program_ids: programs.programIds });
  };

  const handleSetStudentId = (e) => {
    const { value } = e.target;
    setStudentId(value);
  };

  const onClickIsCreateApplicationMode = () => {
    setIsCreationMode(!isCreationMode);
  };

  const handleSubmit_Program = (program) => {
    createProgram(program).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          let new_program_list = [...statedata.programs, data];
          setStatedata((state) => ({
            ...state,
            success: success,
            programs: new_program_list,
            isloaded: true,
            res_modal_status: status
          }));
          setIsCreationMode(!isCreationMode);
        } else {
          const { message } = resp.data;
          setStatedata((state) => ({
            ...state,
            isloaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) =>
        setStatedata((state) => ({
          ...state,
          error,
          isloaded: true
        }))
    );
  };

  const ConfirmError = () => {
    setTableStates((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
    setStatedata((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const setModalShow2 = () => {
    setTableStates((state) => ({
      ...state,
      modalShowAssignWindow: true
    }));
  };
  const columns = React.useMemo(
    () => [
      {
        Header: 'Program Database',
        columns: [
          {
            Header: 'University',
            accessor: 'school',
            Filter: SelectColumnFilter,
            filter: 'fuzzyText'
          },
          {
            Header: 'Program',
            accessor: 'program_name',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText'
          },
          {
            Header: 'Country',
            accessor: 'country',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText'
          },
          {
            Header: 'Degree',
            accessor: 'degree',
            // Filter: SelectColumnFilter,
            filter: 'fuzzyText'
          },
          {
            Header: 'Semester',
            accessor: 'semester',
            Filter: SelectColumnFilter,
            filter: 'fuzzyText'
          },
          {
            Header: 'Language',
            accessor: 'lang'
            // Filter: NumberRangeColumnFilter,
            // filter: 'between'
          },
          {
            Header: 'TOEFL',
            accessor: 'toefl'
            // Filter: NumberRangeColumnFilter,
            // filter: 'equals'
          },
          {
            Header: 'IELTS',
            accessor: 'ielts'
            // Filter: NumberRangeColumnFilter,
            // filter: 'between'
          },
          {
            Header: 'GRE/GMAT',
            accessor: 'gre'
            // Filter: SliderColumnFilter,
            // filter: filterGreaterThan
          },
          {
            Header: 'Application Deadline',
            accessor: 'application_deadline'
          },
          {
            Header: 'Last Update',
            accessor: 'updatedAt'
          }
        ]
      }
    ],
    []
  );

  // const data = React.useMemo(() => makeData(100000), []);
  if (!statedata.isloaded && !statedata.programs) {
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  if (statedata.res_status >= 400) {
    return <ErrorPage res_status={statedata.res_status} />;
  }

  return (
    <>
      {tableStates.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={tableStates.res_modal_status}
          res_modal_message={tableStates.res_modal_message}
        />
      )}
      {statedata.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={statedata.res_modal_status}
          res_modal_message={statedata.res_modal_message}
        />
      )}
      {isCreationMode ? (
        <>
          <NewProgramEdit
            handleClick={onClickIsCreateApplicationMode}
            handleSubmit_Program={handleSubmit_Program}
            programs={statedata.programs}
          />
        </>
      ) : (
        <>
          <Button onClick={onClickIsCreateApplicationMode}>
            Add New Program
          </Button>
          <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
            <Table2
              columns={columns}
              data={statedata.programs}
              programs={programs}
              userId={props.user._id.toString()}
              setModalShow2={setModalShow2}
              setPrograms={setPrograms}
              isAssigning={tableStates.isAssigning}
              setTableStates={setTableStates}
            />
          </Card>
          {props.isStudentApplicationPage ? (
            <ProgramListSingleStudentAssignSubpage
              userId={props.user._id.toString()}
              student={props.student}
              show={tableStates.modalShowAssignWindow}
              assignProgram={assignProgram}
              setModalHide={setModalHide}
              setStudentId={setStudentId}
              uni_name={programs.schools}
              program_name={programs.program_names}
              degree={programs.degree}
              semester={programs.semester}
              handleChange2={handleSetStudentId}
              isButtonDisable={tableStates.isButtonDisable}
              onSubmitAddToStudentProgramList={onSubmitAddToStudentProgramList}
            />
          ) : (
            <ProgramListSubpage
              userId={props.user._id.toString()}
              show={tableStates.modalShowAssignWindow}
              assignProgram={assignProgram}
              setModalHide={setModalHide}
              uni_name={programs.schools}
              program_name={programs.program_names}
              handleSetStudentId={handleSetStudentId}
              isAssigning={tableStates.isAssigning}
              isButtonDisable={tableStates.isButtonDisable}
              onSubmitAddToStudentProgramList={onSubmitAddToStudentProgramList}
            />
          )}
        </>
      )}

      <Modal
        show={tableStates.modalShowAssignSuccessWindow}
        onHide={onHideAssignSuccessWindow}
        size="m"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Program(s) assigned to student successfully!</Modal.Body>
        <Modal.Footer>
          <Button onClick={onHideAssignSuccessWindow}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProgramList;
