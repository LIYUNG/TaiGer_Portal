import React from 'react';
import { Table, TableCell, TableHead, TableRow } from '@mui/material';
import ProgramTaskDelta from './ProgramTaskDelta';

function TabProgramTaskDelta(props) {
  const { deltas } = props;

  const taskDeltas = deltas.map((delta, i) => (
    <ProgramTaskDelta
      key={i}
      students={delta.students}
      program={delta.program}
    />
  ));
  return (
    <>
      {taskDeltas.length !== 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>University / Programs</TableCell>
              <TableCell>First-, Last Name</TableCell>
              <TableCell>Missing</TableCell>
              <TableCell>Extra</TableCell>
            </TableRow>
          </TableHead>
          {taskDeltas}
        </Table>
      ) : (
        <></>
      )}
    </>
  );
}

export default TabProgramTaskDelta;
