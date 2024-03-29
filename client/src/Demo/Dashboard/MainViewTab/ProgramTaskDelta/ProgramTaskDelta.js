import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

function ProgramTaskDelta(props) {
  const { students, program } = props;

  const deltaStudents = Object.fromEntries(
    Object.entries(students).filter(
      ([studentId, student]) =>
        studentId &&
        (student.deltas.add.length !== 0 || student.deltas.remove.length !== 0)
    )
  );

  return (
    Object.keys(deltaStudents).length !== 0 && (
      <TableBody>
        <TableRow>
          <TableCell rowSpan={Object.keys(deltaStudents).length + 1}>
            <Link
              to={`${DEMO.SINGLE_PROGRAM_LINK(program._id)}`}
              component={LinkDom}
            >
              <b>{program.school}</b>
            </Link>
            <br />
            <Link
              to={`${DEMO.SINGLE_PROGRAM_LINK(program._id)}`}
              component={LinkDom}
            >
              {program.program_name}
            </Link>
          </TableCell>
        </TableRow>
        {Object.entries(deltaStudents).map(([studentId, student]) => (
          <TableRow className="text-info" key={studentId + '-add'}>
            <TableCell>
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  studentId,
                  DEMO.CVMLRL_HASH
                )}`}
                component={LinkDom}
              >
                {student.firstname + ', ' + student.lastname}
              </Link>
            </TableCell>
            <TableCell>
              {student.deltas.add.map((missing) => missing.fileType).join(', ')}
            </TableCell>
            <TableCell>
              {student.deltas.remove
                .map((extra) => extra.fileThread.file_type)
                .join(', ')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    )
  );
}

export default ProgramTaskDelta;
