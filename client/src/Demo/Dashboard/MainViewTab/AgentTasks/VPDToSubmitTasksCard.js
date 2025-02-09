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
    Typography,
    TableContainer
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

const VPDToSubmitTasks = (props) => {
    const { t } = useTranslation();
    return (
        <>
            {/* check uni-assist */}
            {!is_all_uni_assist_vpd_uploaded(props.student)
                ? props.student.applications.map(
                      (application, i) =>
                          isUniAssistVPDNeeded(application) && (
                              <TableRow key={i}>
                                  <TableCell>
                                      <Link
                                          component={LinkDom}
                                          to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                              props.student._id.toString(),
                                              DEMO.UNIASSIST_HASH
                                          )}`}
                                      >
                                          {props.student.firstname}{' '}
                                          {props.student.lastname}
                                      </Link>
                                  </TableCell>
                                  {is_uni_assist_paid_and_docs_uploaded(
                                      application
                                  ) ? (
                                      <TableCell className="text-warning">
                                          {t('Paid', { ns: 'common' })},{' '}
                                          {t('Waiting VPD result', {
                                              ns: 'common'
                                          })}
                                      </TableCell>
                                  ) : (
                                      <TableCell>
                                          <Typography color="text.secondary">
                                              {t('Not paid', { ns: 'common' })}
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
                  )
                : null}
        </>
    );
};

const VPDToSubmitTasksCard = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const vpd_to_submit_tasks = props.students
        .filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
        )
        .map((student, i) => <VPDToSubmitTasks key={i} student={student} />);
    return (
        <Card sx={{ mb: 2 }}>
            <Alert severity="error">
                <Typography>VPD missing:</Typography>
            </Alert>
            <TableContainer style={{ maxHeight: '300px' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {t('Student', { ns: 'common' })}
                            </TableCell>
                            <TableCell>
                                {t('Status', { ns: 'common' })}
                            </TableCell>
                            <TableCell>
                                {t('Deadline', { ns: 'common' })}
                            </TableCell>
                            <TableCell>
                                {t('Program', { ns: 'common' })}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{vpd_to_submit_tasks}</TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default VPDToSubmitTasksCard;
