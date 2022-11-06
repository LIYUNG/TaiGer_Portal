import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
  usePagination
} from 'react-table';
import ProgramListSubpage from './ProgramListSubpage';
import UnauthorizedError from '../Utils/UnauthorizedError';
import TimeOutErrors from '../Utils/TimeOutErrors';
import { Link } from 'react-router-dom';

import {
  Button,
  Modal,
  Table,
  Row,
  Col,
  // ButtonToolbar,
  DropdownButton,
  Dropdown,
  Spinner,
  Card
} from 'react-bootstrap';
import {
  getPrograms,
  // createProgram,
  // deleteProgram,
  assignProgramToStudent
} from '../../api';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';

// import makeData from './makeData';

// const Styles = styled.div`
//   padding: 1rem;

//   table {
//     border-spacing: 0;
//     border: 1px solid black;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }

//     th,
//     td {
//       margin: 0;
//       padding: 0.5rem;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-right: 0;
//       }
//     }
//   }
// `;

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
        placeholder={` TU Munich, Management ...`}
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
function Table2({ columns, data, userId }) {
  let [statedataTable2, setStatedataTable2] = useState({
    success: false,
    isloaded: false,
    error: null,
    everlogin: false,
    modalShowAssignWindow: false,
    modalShowAssignSuccessWindow: false
  });
  let [programs, setPrograms] = useState({
    programIds: [],
    schools: [],
    program_names: []
  });
  // let [modalShowAssignWindow, setModalShow] = useState(false);
  let [studentId, setStudentId] = useState('');
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
      columns,
      data,
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
    setPrograms({
      programIds: data_idxes.map((idx) => data[idx]._id),
      schools: data_idxes.map((idx) => data[idx].school),
      program_names: data_idxes.map((idx) => data[idx].program_name)
    });
  }, [selectedRowIds]);

  const assignProgram = (assign_data) => {
    const { student_id, program_ids } = assign_data;
    assignProgramToStudent(student_id, program_ids).then(
      (resp) => {
        const { success } = resp.data;
        if (success) {
          setGlobalFilter([]);
          toggleAllRowsSelected(false);
          setStatedataTable2((state) => ({
            ...state,
            isLoaded: true,
            modalShowAssignSuccessWindow: true,
            modalShowAssignWindow: false,
            success
          }));
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {}
    );
  };
  const setModalHide = () => {
    // setModalShow(false);
    setStatedataTable2((state) => ({
      ...state,
      modalShowAssignWindow: false
    }));
  };
  const onHideAssignSuccessWindow = () => {
    // setModalShow(false);
    setStatedataTable2((state) => ({
      ...state,
      modalShowAssignSuccessWindow: false
    }));
  };

  const setModalShow2 = () => {
    setStatedataTable2((state) => ({
      ...state,
      modalShowAssignWindow: true
    }));
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

  return (
    <>
      {programs.programIds.length !== 0 && (
        <>
          <DropdownButton size="sm" title="Option" variant="primary">
            <Dropdown.Item eventKey="2" onSelect={setModalShow2}>
              Assign to student...
            </Dropdown.Item>
          </DropdownButton>
        </>
      )}
      <Table
        className="my-0 mx-2"
        variant="dark"
        text="light"
        responsive
        hover
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
          <tr>
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
          </tr>
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
                          to={'/programs/' + row.original._id}
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
            <span className="text-light">
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
          </Col>
          <Col md={4}>
            <span className="text-light">
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
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        </Row>
      </div>

      <div>
        {/* <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                'selectedFlatRows[].original': selectedFlatRows.map(
                  (d) => d.original._id
                )
              },
              null,
              2
            )}
          </code>
        </pre> */}
      </div>
      <ProgramListSubpage
        userId={userId}
        show={statedataTable2.modalShowAssignWindow}
        setModalHide={setModalHide}
        uni_name={programs.schools}
        program_name={programs.program_names}
        handleChange2={handleSetStudentId}
        onSubmitAddToStudentProgramList={onSubmitAddToStudentProgramList}
      />
      <Modal
        show={statedataTable2.modalShowAssignSuccessWindow}
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
  let [statedata, setStatedata] = useState({
    success: false,
    programs: null,
    isloaded: false,
    error: null,
    unauthorizederror: null,
    everlogin: false
  });

  useEffect(() => {
    getPrograms().then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          setStatedata((state) => ({
            ...state,
            success: success,
            programs: data,
            isloaded: true
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            setStatedata((state) => ({
              ...state,
              error: true,
              isloaded: true
            }));
          } else if (resp.status === 403) {
            setStatedata((state) => ({
              ...state,
              unauthorizederror: true,
              isloaded: true
            }));
          }
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

  const columns = React.useMemo(
    () => [
      {
        Header: 'Program Database',
        columns: [
          {
            Header: 'University',
            accessor: 'school',
            Filter: SelectColumnFilter,
            filter: 'includes'
          },
          {
            Header: 'Program',
            accessor: 'program_name',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText'
          },
          {
            Header: 'Semester',
            accessor: 'semester',
            Filter: SelectColumnFilter,
            filter: 'includes'
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
            Header: 'Degree',
            accessor: 'degree',
            Filter: SelectColumnFilter,
            filter: 'includes'
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
  const style = {
    position: 'fixed',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
  if (statedata.error) {
    return (
      <div>
        <TimeOutErrors />
      </div>
    );
  }
  if (statedata.unauthorizederror) {
    return (
      <div>
        <UnauthorizedError />
      </div>
    );
  }
  if (!statedata.isloaded && !statedata.programs) {
    return (
      <div style={style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
      <Table2
        columns={columns}
        data={statedata.programs}
        userId={props.userId}
      />
    </Card>
  );
}

export default ProgramList;
