import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

function ProgramTaskDelta(props) {
  const { students, program } = props;

  const studentNames = Object.entries(students).map(([studentId]) => (
    <div className="text-info" key={studentId}>
      <Link
        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          studentId,
          DEMO.CVMLRL_HASH
        )}`}
        component={LinkDom}
      >
        {studentId}
      </Link>
    </div>
  ));
  const studentMissing = Object.entries(students).map(([studentId, deltas]) => (
    <div className="text-info" key={studentId + '-add'}>
      {deltas.add.map((missing) => missing.fileType + ', ')}
    </div>
  ));

  const studentExtra = Object.entries(students).map(([studentId, deltas]) => (
    <div className="text-info" key={studentId + '-remove'}>
      {deltas.remove.map((extra) => extra.fileThread.file_type + ', ')}
    </div>
  ));

  return (
    <TableBody>
      <TableRow>
        <TableCell>
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
        <TableCell>{studentNames}</TableCell>
        <TableCell>{studentMissing}</TableCell>
        <TableCell>{studentExtra}</TableCell>
      </TableRow>
    </TableBody>
  );
}

export default ProgramTaskDelta;
