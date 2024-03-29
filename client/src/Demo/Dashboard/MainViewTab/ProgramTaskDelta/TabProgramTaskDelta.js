import React from 'react';
import {
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
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
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>University / Programs</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Missing</TableCell>
                <TableCell>Extra</TableCell>
              </TableRow>
            </TableHead>
            {taskDeltas}
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}
    </>
  );
}

export default TabProgramTaskDelta;
