import React from 'react';
import {
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';

import ProgramConflict from './ProgramConflict';

function TabProgramConflict(props) {
  const programConflicts = props.students.map((conflict, i) => (
    <ProgramConflict
      key={i}
      students={conflict.students}
      program={conflict.program}
    />
  ));
  return (
    <>
      {programConflicts.length !== 0 ? (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>University / Programs</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Deadline</TableCell>
              </TableRow>
            </TableHead>
            {programConflicts}
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}
    </>
  );
}

export default TabProgramConflict;
