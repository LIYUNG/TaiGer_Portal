import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Alert,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  isCVFinished,
  is_program_ml_rl_essay_ready,
  is_the_uni_assist_vpd_uploaded,
  is_program_closed,
  application_deadline_calculator,
  application_date_calculator,
  isProgramDecided
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import { isInTheFuture } from '../../../Utils/contants';

const ReadyToSubmitTasks = (props) => {
  return (
    <>
      {/* check program reday to be submitted */}
      {props.student.applications.map(
        (application, i) =>
          isProgramDecided(application) &&
          isCVFinished(props.student) &&
          is_program_ml_rl_essay_ready(application) &&
          is_the_uni_assist_vpd_uploaded(application) &&
          !is_program_closed(application) && (
            <TableRow key={i}>
              <TableCell>
                <Link
                  to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    props.student._id.toString(),
                    DEMO.CVMLRL_HASH
                  )}`}
                  component={LinkDom}
                >
                  <b>
                    {props.student.firstname} {props.student.lastname}
                  </b>
                </Link>
              </TableCell>
              <TableCell>
                {/* isInTheFuture */}
                <Typography
                  variant="body2"
                  fontWeight={
                    isInTheFuture(
                      application_date_calculator(props.student, application)
                    )
                      ? ''
                      : 'bold'
                  }
                >
                  {application_date_calculator(props.student, application)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  fontWeight={
                    isInTheFuture(
                      application_deadline_calculator(
                        props.student,
                        application
                      )
                    )
                      ? 'bold'
                      : ''
                  }
                >
                  {application_deadline_calculator(props.student, application)}
                </Typography>
              </TableCell>
              <TableCell>
                <b className="text-warning">{application.programId.degree}</b>
                {' - '}
                <b className="text-warning">{application.programId.semester}</b>
                {' - '}
                <b className="text-warning">
                  {application.programId.school}{' '}
                  {application.programId.program_name}
                </b>
              </TableCell>
            </TableRow>
          )
      )}
    </>
  );
};

function ReadyToSubmitTasksCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const ready_to_submit_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <ReadyToSubmitTasks key={i} role={user.role} student={student} />
    ));

  return (
    <Card sx={{ mb: 2 }}>
      <Alert severity="error">
        <Typography>
          {t('Ready To Submit Tasks', { ns: 'dashboard' })} ( ML/ RL/ Essay are
          finished. Please submit application asap.):
        </Typography>
      </Alert>
      <div className="card-scrollable-body">
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('Student', { ns: 'common' })}</TableCell>
                <TableCell>{t('Start', { ns: 'common' })}</TableCell>
                <TableCell>{t('Deadline', { ns: 'common' })}</TableCell>
                <TableCell>
                  {t('Semester', { ns: 'common' })} - {t('Degree', { ns: 'common' })} - {t('Program', { ns: 'common' })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{ready_to_submit_tasks}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </Card>
  );
}

export default ReadyToSubmitTasksCard;
