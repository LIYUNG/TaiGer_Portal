import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';

import {
  ADMISSION_STATUS_E,
  DECISION_STATUS_E,
  SUBMISSION_STATUS_E,
  getNumberOfDays
} from '../../../Utils/contants';
import {
  application_deadline_calculator,
  isProgramDecided,
  isProgramSubmitted,
  isProgramWithdraw,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import { Link, TableCell, TableRow, Typography } from '@mui/material';

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
              component={LinkDom}
              underline='hover'
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
              component={LinkDom}
              underline="hover"
            >
              <AiFillEdit color="grey" size={16} />
            </Link>
          )}
        </TableCell>
        {!is_TaiGer_Student(user) ? (
          <TableCell>
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
        <TableCell>
          <Link
            to={DEMO.SINGLE_PROGRAM_LINK(application.programId._id.toString())}
            component={LinkDom}
            underline="hover"
            target="_blank"
          >
            <Typography
              color={
                isProgramDecided(application)
                  ? isProgramSubmitted(application)
                    ? 'success.light'
                    : 'text.primary'
                  : 'grey'
              }
              fontWeight="bold"
            >
              {application.programId.school}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={DEMO.SINGLE_PROGRAM_LINK(application.programId._id.toString())}
            component={LinkDom}
            underline="hover"
            target="_blank"
          >
            <Typography
              color={
                isProgramDecided(application)
                  ? isProgramSubmitted(application)
                    ? 'success.light'
                    : 'text.primary'
                  : 'grey'
              }
              fontWeight="bold"
            >
              {application.programId.degree}
            </Typography>
          </Link>
        </TableCell>
        <TableCell>
          <Link
            to={DEMO.SINGLE_PROGRAM_LINK(application.programId._id.toString())}
            component={LinkDom}
            underline="hover"
            target="_blank"
          >
            <Typography
              color={
                isProgramDecided(application)
                  ? isProgramSubmitted(application)
                    ? 'success.light'
                    : 'text.primary'
                  : 'grey'
              }
              fontWeight="bold"
            >
              {application.programId.program_name}
            </Typography>
          </Link>
        </TableCell>
        {isProgramDecided(application) ? (
          <TableCell
            className={`mb-1 ${
              isProgramSubmitted(application) ? 'text-warning' : 'text-info'
            }`}
          >
            {application.programId.semester}
          </TableCell>
        ) : (
          <TableCell>{application.programId.semester}</TableCell>
        )}
        {isProgramDecided(application) ? (
          isProgramSubmitted(application) ? (
            <TableCell>
              {application.programId.toefl ? application.programId.toefl : '-'}
            </TableCell>
          ) : (
            <TableCell>
              {application.programId.toefl ? application.programId.toefl : '-'}
            </TableCell>
          )
        ) : (
          <TableCell className="mb-1 text-secondary">
            {application.programId.toefl ? application.programId.toefl : '-'}
          </TableCell>
        )}
        {isProgramDecided(application) ? (
          isProgramSubmitted(application) ? (
            <TableCell>
              {application.programId.ielts ? application.programId.ielts : '-'}
            </TableCell>
          ) : (
            <TableCell>
              {application.programId.ielts ? application.programId.ielts : '-'}
            </TableCell>
          )
        ) : (
          <TableCell className="mb-1 text-secondary">
            {application.programId.ielts ? application.programId.ielts : '-'}
          </TableCell>
        )}
        {isProgramDecided(application) ? (
          isProgramSubmitted(application) ? (
            <TableCell>
              <Typography
                color={
                  isProgramDecided(application)
                    ? isProgramSubmitted(application)
                      ? 'success.light'
                      : 'text.primary'
                    : 'grey'
                }
                fontWeight="bold"
              >
                Close
              </Typography>
            </TableCell>
          ) : (
            <TableCell>
              <Typography
                color={
                  isProgramDecided(application)
                    ? isProgramSubmitted(application)
                      ? 'success.light'
                      : 'text.primary'
                    : 'grey'
                }
                fontWeight="bold"
              >
                {application_deadline_calculator(props.student, application)}
              </Typography>
            </TableCell>
          )
        ) : (
          <TableCell>
            <Typography
              color={
                isProgramDecided(application)
                  ? isProgramSubmitted(application)
                    ? 'success.light'
                    : 'text.primary'
                  : 'grey'
              }
              fontWeight="bold"
            >
              {application_deadline_calculator(props.student, application)}
            </Typography>
          </TableCell>
        )}
        {isProgramDecided(application) ? (
          <TableCell>{DECISION_STATUS_E.OK_SYMBOL}</TableCell>
        ) : application.decided === 'X' ? (
          <TableCell> {DECISION_STATUS_E.NOT_OK_SYMBOL}</TableCell>
        ) : (
          <TableCell>{DECISION_STATUS_E.UNKNOWN_SYMBOL}</TableCell>
        )}
        {isProgramSubmitted(application) ? (
          <TableCell>{SUBMISSION_STATUS_E.OK_SYMBOL}</TableCell>
        ) : isProgramWithdraw(application) ? (
          <TableCell> {SUBMISSION_STATUS_E.NOT_OK_SYMBOL}</TableCell>
        ) : (
          <TableCell>{SUBMISSION_STATUS_E.UNKNOWN_SYMBOL}</TableCell>
        )}
        {application.admission === 'O' ? (
          <TableCell> {ADMISSION_STATUS_E.OK_SYMBOL}</TableCell>
        ) : application.admission === 'X' ? (
          <TableCell> {ADMISSION_STATUS_E.NOT_OK_SYMBOL}</TableCell>
        ) : (
          <TableCell>{ADMISSION_STATUS_E.UNKNOWN_SYMBOL}</TableCell>
        )}
        <TableCell>
          {isProgramSubmitted(application)
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
