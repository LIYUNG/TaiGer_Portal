import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card, Typography } from '@mui/material';

import {
  isCVFinished,
  is_cv_assigned
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

function CVAssignTasksCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const CVAssignTasks = (props) => {
    return (
      <>
        {/* cv assign tasks */}
        {!isCVFinished(props.student) && !is_cv_assigned(props.student) && (
          <>
            <TableCell>
              <Link
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  props.student._id.toString(),
                  '/CV_ML_RL'
                )}`}
                component={LinkDom}
              >
                CV
              </Link>
            </TableCell>
            <TableCell>
              <b>
                {props.student.firstname} {props.student.lastname}
              </b>
            </TableCell>
            <TableCell>
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
          </>
        )}
      </>
    );
  };

  const cv_assign_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <TableRow key={i}>
        <CVAssignTasks key={i} role={user.role} student={student} />
      </TableRow>
    ));
  return (
    <>
      <Card sx={{ padding: 2, mb: 2 }}>
        <Alert severity="error">
          <Typography variant="string">{t('CV Not Assigned Yet')}</Typography>
        </Alert>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Docs</TableCell>
              <TableCell>{t('Student')}</TableCell>
              <TableCell>
                {t('Year')}/{t('Semester')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{cv_assign_tasks}</TableBody>
        </Table>
      </Card>
    </>
  );
}

export default CVAssignTasksCard;
