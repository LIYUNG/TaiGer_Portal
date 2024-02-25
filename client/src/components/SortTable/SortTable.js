import React from 'react';
import {
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Link as LinkDom } from 'react-router-dom';
import { AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';

import { is_TaiGer_role } from '../../Demo/Utils/checking-functions';
import DEMO from '../../store/constant';

function SortTable({ columns, data, user, handleAsFinalFile }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
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
      <Table size="small" {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, x) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={x}>
              {headerGroup.headers.map((column, i) =>
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props

                i === 1 ? (
                  is_TaiGer_role(user) ? (
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
                  ) : (
                    <TableCell key={i}></TableCell>
                  )
                ) : (
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
                          '/profile'
                        )}`}
                        component={LinkDom}
                      >
                        <Typography fontWeight="bold">
                          {cell.render('Cell')}
                        </Typography>
                      </Link>
                    </TableCell>
                  ) : j === 5 ? (
                    <TableCell {...cell.getCellProps()} key={j}>
                      <Link
                        target="_blank"
                        to={DEMO.DOCUMENT_MODIFICATION_LINK(
                          row.original.thread_id
                        )}
                        component={LinkDom}
                        style={{ textDecoration: 'none' }}
                      >
                        {cell.render('Cell')}
                      </Link>
                      {is_TaiGer_role(user) && (
                        <>
                          <br />
                          {row.original.attributes?.map((attribute) => (
                            <Chip label={attribute.name} key={attribute._id} />
                          ))}
                        </>
                      )}
                    </TableCell>
                  ) : j === 6 ? (
                    cell.value > 14 ? (
                      <TableCell {...cell.getCellProps()} key={j}>
                        <p className="text-danger my-0">
                          {cell.render('Cell')}
                        </p>
                      </TableCell>
                    ) : (
                      <TableCell {...cell.getCellProps()} key={j}>
                        <p className="text-light my-0">{cell.render('Cell')}</p>
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
                  ) : j === 1 ? (
                    is_TaiGer_role(user) ? (
                      <TableCell {...cell.getCellProps()} key={j}>
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
                      </TableCell>
                    ) : (
                      <TableCell {...cell.getCellProps()} key={j}></TableCell>
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

export default SortTable;
