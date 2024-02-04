import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';

import { getNumberOfDays } from '../../../Utils/contants';
import {
  application_deadline_calculator,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import { TableCell, TableRow, Typography } from '@mui/material';

function ApplicationProgress(props) {
  const { user } = useAuth();
  var applying_university;

  var today = new Date();
  if (
    props.student.applications === undefined ||
    props.student.applications.length === 0
  ) {
    applying_university = (
      <>
        <TableCell>
          {!is_TaiGer_Editor(user) && !props.isArchivPage && (
            <Link
              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(props.student._id)}`}
              style={{ textDecoration: 'none' }}
            >
              <AiFillEdit color="grey" size={16} />
            </Link>
          )}
        </TableCell>
        <TableCell></TableCell>
        <TableCell>No University</TableCell>
        <TableCell>No Program</TableCell>
        <TableCell>No Degree</TableCell>
        <TableCell>No Date</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
      </>
    );
  } else {
    applying_university = props.student.applications.map((application, i) => (
      <TableRow key={i}>
        <TableCell>
          {/* If my own student */}
          {!is_TaiGer_Editor(user) && !props.isArchivPage && (
            <Link
              to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(props.student._id)}`}
              style={{ textDecoration: 'none' }}
            >
              <AiFillEdit color="grey" size={16} />
            </Link>
          )}
        </TableCell>
        {!is_TaiGer_Student(user) ? (
          <TableCell title="Selected / Should be selected">
            {props.student.applying_program_count ? (
              props.student.applications.length <
              props.student.applying_program_count ? (
                <Typography className="text-danger">
                  <b>{props.student.applications.length}</b> /{' '}
                  {props.student.applying_program_count}
                </Typography>
              ) : (
                <Typography className="text-info">
                  {props.student.applications.length} /{' '}
                  {props.student.applying_program_count}
                </Typography>
              )
            ) : (
              <b className="text-danger">0</b>
            )}
          </TableCell>
        ) : (
          <></>
        )}
        {application.decided === 'O' ? (
          <TableCell
            className={`mb-1 ${
              application.closed === 'O' ? 'text-warning' : 'text-info'
            }`}
          >
            {application.programId.school}
          </TableCell>
        ) : (
          <TableCell className="mb-1 text-secondary" title="Not decided yet">
            {application.programId.school}
          </TableCell>
        )}
        {application.decided === 'O' ? (
          <TableCell
            className={`mb-1 ${
              application.closed === 'O' ? 'text-warning' : 'text-info'
            }`}
          >
            {application.programId.degree}
          </TableCell>
        ) : (
          <TableCell className="mb-1 text-secondary" title="Not decided yet">
            {application.programId.degree}
          </TableCell>
        )}
        {application.decided === 'O' ? (
          <TableCell
            className={`mb-1 ${
              application.closed === 'O' ? 'text-warning' : 'text-info'
            }`}
          >
            {application.programId.program_name}
          </TableCell>
        ) : (
          <TableCell className="mb-1 text-secondary" title="Not decided yet">
            {application.programId.program_name}
          </TableCell>
        )}
        {application.decided === 'O' ? (
          <TableCell
            className={`mb-1 ${
              application.closed === 'O' ? 'text-warning' : 'text-info'
            }`}
          >
            {application.programId.semester}
          </TableCell>
        ) : (
          <TableCell className="mb-1 text-secondary" title="Not decided yet">
            {application.programId.semester}
          </TableCell>
        )}
        {application.decided === 'O' ? (
          application.closed === 'O' ? (
            <TableCell className="mb-1 text-warning">
              {application.programId.toefl ? application.programId.toefl : '-'}
            </TableCell>
          ) : (
            <TableCell>
              {application.programId.toefl ? application.programId.toefl : '-'}
            </TableCell>
          )
        ) : (
          <TableCell className="mb-1 text-secondary" title="Not decided yet">
            {application.programId.toefl ? application.programId.toefl : '-'}
          </TableCell>
        )}
        {application.decided === 'O' ? (
          application.closed === 'O' ? (
            <TableCell className="mb-1 text-warning">
              {application.programId.ielts ? application.programId.ielts : '-'}
            </TableCell>
          ) : (
            <TableCell>
              {application.programId.ielts ? application.programId.ielts : '-'}
            </TableCell>
          )
        ) : (
          <TableCell className="mb-1 text-secondary" title="Not decided yet">
            {application.programId.ielts ? application.programId.ielts : '-'}
          </TableCell>
        )}
        {application.decided === 'O' ? (
          application.closed === 'O' ? (
            <TableCell>Close</TableCell>
          ) : (
            <TableCell>
              {application_deadline_calculator(props.student, application)}
            </TableCell>
          )
        ) : (
          <TableCell title="Not decided yet">
            {application_deadline_calculator(props.student, application)}
          </TableCell>
        )}
        {application.decided === 'O' ? (
          <TableCell
            className={`mb-1 ${
              application.closed === 'O' ? 'text-warning' : 'text-info'
            }`}
          >
            O
          </TableCell>
        ) : application.decided === 'X' ? (
          <TableCell>X</TableCell>
        ) : (
          <TableCell className="mb-1 text-danger">?</TableCell>
        )}
        {application.closed === 'O' ? (
          <TableCell
            className={`mb-1 ${
              application.closed === 'O' ? 'text-warning' : 'text-info'
            }`}
          >
            O
          </TableCell>
        ) : application.closed === 'X' ? (
          <TableCell>X</TableCell>
        ) : (
          <TableCell className="mb-1 text-danger">?</TableCell>
        )}
        {application.admission === 'O' ? (
          <TableCell>O</TableCell>
        ) : application.admission === 'X' ? (
          <TableCell>X</TableCell>
        ) : (
          <TableCell className="mb-1 text-danger">?</TableCell>
        )}
        <TableCell>
          {application.closed === 'O'
            ? '-'
            : application.programId.application_deadline
            ? getNumberOfDays(
                today,
                application_deadline_calculator(props.student, application)
              )
            : '-'}
        </TableCell>
      </TableRow>
    ));
  }

  return applying_university;
}

export default ApplicationProgress;
