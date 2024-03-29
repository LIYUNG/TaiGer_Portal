import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

function ProgramConflict(props) {
  const { students, program } = props;
  return (
    <TableBody>
      <TableRow>
        <TableCell rowSpan={students.length + 1}>
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
      {students.map((student, i) => (
        <TableRow key={i}>
          <TableCell>
            <Link
              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                student.studentId,
                DEMO.PROFILE_HASH
              )}`}
              component={LinkDom}
            >
              {student.firstname}, {student.lastname}
            </Link>
          </TableCell>
          <TableCell key={i}>
            {student &&
            student.application_preference &&
            student.application_preference.expected_application_date
              ? student.application_preference.expected_application_date + '-'
              : ''}
            {program.application_deadline}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default ProgramConflict;
