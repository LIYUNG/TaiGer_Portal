import React from 'react';
import { Table, TableCell, TableHead, TableRow } from '@mui/material';

import ProgramConflict from './ProgramConflict';

function TabProgramConflict(props) {
  const program_conflict = props.students.map((conflict, i) => (
    <ProgramConflict
      key={i}
      students={conflict.students}
      program={conflict.program}
    />
  ));
  return (
    <>
      {program_conflict.length !== 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>University / Programs</TableCell>
              <TableCell>First-, Last Name</TableCell>
              <TableCell>Deadline</TableCell>
            </TableRow>
          </TableHead>
          {program_conflict}
        </Table>
      ) : (
        <></>
      )}
    </>
  );
}

export default TabProgramConflict;
