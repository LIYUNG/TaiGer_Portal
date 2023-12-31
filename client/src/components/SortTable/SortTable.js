import React from 'react';
import { Table } from 'react-bootstrap';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Link } from 'react-router-dom';

import { AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';
import { is_TaiGer_role } from '../../Demo/Utils/checking-functions';
import DEMO from '../../store/constant';

function SortTable({ columns, data, user, handleAsFinalFile }) {
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
          {headerGroups.map((headerGroup, x) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={x}>
              {headerGroup.headers.map((column, i) =>
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props

                i === 1 ? (
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
                    <th key={i}></th>
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
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, j) => {
                  return j === 0 ? (
                    <td {...cell.getCellProps()} key={j}>
                      <Link
                        target="_blank"
                        to={`/student-database/${row.original.student_id}/profile`}
                        className="text-light"
                        style={{ textDecoration: 'none' }}
                      >
                        <b>{cell.render('Cell')}</b>
                      </Link>
                    </td>
                  ) : j === 5 ? (
                    <td {...cell.getCellProps()} key={j}>
                      <Link
                        target="_blank"
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          row.original.thread_id
                        )}
                        className="text-info"
                        style={{ textDecoration: 'none' }}
                      >
                        {cell.render('Cell')}
                      </Link>
                    </td>
                  ) : j === 6 ? (
                    cell.value > 14 ? (
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
                  ) : j === 4 ? (
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
                  ) : j === 1 ? (
                    is_TaiGer_role(user) ? (
                      <td {...cell.getCellProps()} key={j}>
                        {row.original.isFinalVersion ? (
                          <AiOutlineUndo
                            size={24}
                            color="red"
                            title="Un do Final Version"
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              handleAsFinalFileThread(
                                row.original.thread_id,
                                row.original.student_id,
                                row.original.program_id
                                  ? row.original.program_id
                                  : null,
                                row.original.file_type,
                                row.original.isFinalVersion
                              )
                            }
                          />
                        ) : (
                          <AiOutlineCheck
                            size={24}
                            style={{ cursor: 'pointer' }}
                            title="Set as final version"
                            onClick={() =>
                              handleAsFinalFileThread(
                                row.original.thread_id,
                                row.original.student_id,
                                row.original.program_id
                                  ? row.original.program_id
                                  : null,
                                row.original.file_type,
                                row.original.isFinalVersion
                              )
                            }
                          />
                        )}
                      </td>
                    ) : (
                      <td {...cell.getCellProps()} key={j}></td>
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

export default SortTable;
