import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Card,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  isUniAssistVPDNeeded,
  is_all_uni_assist_vpd_uploaded,
  application_deadline_calculator,
  is_uni_assist_paid_and_docs_uploaded
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';

function VPDToSubmitTasks(props) {
  const { t } = useTranslation();
  return (
    <>
      {/* check uni-assist */}
      {!is_all_uni_assist_vpd_uploaded(props.student) &&
        props.student.applications.map(
          (application, i) =>
            isUniAssistVPDNeeded(application) && (
              <TableRow key={i}>
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
                {is_uni_assist_paid_and_docs_uploaded(application) ? (
                  <>
                    <TableCell className="text-warning">
                      {t('Paid')}, {t('Waiting VPD')}
                    </TableCell>
                  </>
                ) : (
                  <TableCell>
                    <Typography color="text.secondary">
                      {t('Not paid')}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>
                  <b>
                    {application_deadline_calculator(
                      props.student,
                      application
                    )}
                  </b>
                </TableCell>
                <TableCell>
                  {application.programId.school}{' '}
                  {application.programId.program_name}
                </TableCell>
              </TableRow>
            )
        )}
    </>
  );
}

function VPDToSubmitTasksCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const vpd_to_submit_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <VPDToSubmitTasks key={i} role={user.role} student={student} />
    ));
  return (
    <Card sx={{ padding: 2, mb: 2 }}>
      <Alert severity="error">VPD missing:</Alert>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('Student')}</TableCell>
            <TableCell>{t('Status')}</TableCell>
            <TableCell>{t('Deadline')}</TableCell>
            <TableCell>{t('Program')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{vpd_to_submit_tasks}</TableBody>
      </Table>
    </Card>
  );
}

export default VPDToSubmitTasksCard;
