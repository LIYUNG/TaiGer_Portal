import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

function ProgramTaskDelta(props) {
  const { students, program } = props;

  return (
    <TableBody>
      <TableRow>
        <TableCell rowSpan={Object.keys(students).length + 1}>
          <Link
            to={`${DEMO.SINGLE_PROGRAM_LINK(program._id)}`}
            component={LinkDom}
          >
            <b>{program._id}</b>
          </Link>
          <br />
          <Link
            to={`${DEMO.SINGLE_PROGRAM_LINK(program._id)}`}
            component={LinkDom}
          >
            {program.count}
          </Link>
        </TableCell>
      </TableRow>
      {Object.entries(students).map(([studentId, deltas]) => (
        <TableRow className="text-info" key={studentId + '-add'}>
          <TableCell>
            <Link
              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                studentId,
                DEMO.CVMLRL_HASH
              )}`}
              component={LinkDom}
            >
              studentNames {studentId}
            </Link>
          </TableCell>
          <TableCell>
            {deltas.add.map((missing) => missing.fileType + ', ')}
          </TableCell>
          <TableCell>
            {deltas.remove.map((extra) => extra.fileThread.file_type + ', ')}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default ProgramTaskDelta;
