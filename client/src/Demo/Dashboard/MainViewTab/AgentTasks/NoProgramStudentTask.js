import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableCell, TableRow } from '@mui/material';

import { check_application_selection } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

function NoProgramStudentTask(props) {
  return (
    <>
      {/* check if no program selected */}
      {!check_application_selection(props.student) && (
        <TableRow>
          <TableCell>
            <Link
              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                props.student._id.toString(),
                DEMO.UNI_ASSIST_LINK
              )}`}
              component={LinkDom}
            >
              {props.student.firstname} {props.student.lastname}
            </Link>
          </TableCell>
          <TableCell>
            {' '}
            {props.student.application_preference
              ?.expected_application_date || (
              <span className="text-danger">TBD</span>
            )}
            {'/'}
            {props.student.application_preference
              ?.expected_application_semester || (
              <span className="text-danger">TBD</span>
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default NoProgramStudentTask;