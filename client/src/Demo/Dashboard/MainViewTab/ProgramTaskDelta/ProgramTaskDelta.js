import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

function ProgramTaskDelta(props) {
  const { students, program } = props;
  const studentDeltas = Object.entries(students).map(([studentId, deltas]) => (
    <>
      <TableCell>
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
      </TableCell>
      <TableCell>
        <div className="text-info" key={studentId + '-add'}>
          {deltas.add.map((missing) => missing.fileType + ', ')}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-info" key={studentId + '-remove'}>
          {deltas.remove.map((extra) => extra.fileThread.file_type + ', ')}
        </div>
      </TableCell>
    </>
  ));

  console.log(studentDeltas);

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
        {studentDeltas}
      </TableRow>
    </TableBody>
  );
}

export default ProgramTaskDelta;
