import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

function ProgramConflict(props) {
  const { students, program } = props;

  const stds = students.map((student, i) => (
    <div className="text-info" key={i}>
      <Link
        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          student.studentId,
          DEMO.PROFILE_HASH
        )}`}
        component={LinkDom}
      >
        {student.firstname}, {student.lastname}
      </Link>
    </div>
  ));
  const applicationDeadline = students.map((student, i) => (
    <div className="text-info" key={i}>
      {student &&
      student.application_preference &&
      student.application_preference.expected_application_date
        ? student.application_preference.expected_application_date + '-'
        : ''}
      {program.application_deadline}
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
            <b>{program.school}</b>
          </Link>
          <br></br>
          <Link
            to={`${DEMO.SINGLE_PROGRAM_LINK(program._id)}`}
            component={LinkDom}
          >
            {program.program_name}
          </Link>
        </TableCell>
        <TableCell>{stds}</TableCell>
        <TableCell>{applicationDeadline}</TableCell>
      </TableRow>
    </TableBody>
  );
}

export default ProgramConflict;
