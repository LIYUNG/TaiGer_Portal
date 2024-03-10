import React from 'react';
import {
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useTable, useSortBy, useFilters } from 'react-table';
import { Link as LinkDom } from 'react-router-dom';

import { is_TaiGer_role } from '../../Demo/Utils/checking-functions';
import DEMO from '../../store/constant';
import { ATTRIBUTES, COLORS } from '../../Demo/Utils/contants';

function SortTable({ columns, data, user }) {
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
                          DEMO.PROFILE_HASH
                        )}`}
                        component={LinkDom}
                      >
                        <Typography fontWeight="bold">
                          {cell.render('Cell')}
                        </Typography>
                      </Link>
                    </TableCell>
                  ) : j === 4 ? (
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
                          {row.original.attributes?.map(
                            (attribute) =>
                              [1, 3, 9].includes(attribute.value) && (
                                <Tooltip
                                  title={
                                    ATTRIBUTES[attribute.value - 1].definition
                                  }
                                  key={attribute._id}
                                >
                                  <Chip
                                    size="small"
                                    label={attribute.name}
                                    color={COLORS[attribute.value]}
                                  />
                                </Tooltip>
                              )
                          )}
                        </>
                      )}
                    </TableCell>
                  ) : j === 5 ? (
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
                  ) : j === 3 ? (
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

export default SortTable;
