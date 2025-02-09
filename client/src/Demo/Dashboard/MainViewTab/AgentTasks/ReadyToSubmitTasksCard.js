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
import { isProgramDecided } from '@taiger-common/core';

import {
    isCVFinished,
    is_program_ml_rl_essay_ready,
    is_the_uni_assist_vpd_uploaded,
    is_program_closed,
    application_deadline_calculator,
    application_date_calculator
} from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';
import { useAuth } from '../../../../components/AuthProvider';
import { isInTheFuture } from '../../../../utils/contants';

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
                                    component={LinkDom}
                                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                        props.student._id.toString(),
                                        DEMO.CVMLRL_HASH
                                    )}`}
                                >
                                    <b>
                                        {props.student.firstname}{' '}
                                        {props.student.lastname}
                                    </b>
                                </Link>
                            </TableCell>
                            <TableCell>
                                {/* isInTheFuture */}
                                <Typography
                                    fontWeight={
                                        isInTheFuture(
                                            application_date_calculator(
                                                props.student,
                                                application
                                            )
                                        )
                                            ? ''
                                            : 'bold'
                                    }
                                    variant="body2"
                                >
                                    {application_date_calculator(
                                        props.student,
                                        application
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
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
                                    variant="body2"
                                >
                                    {application_deadline_calculator(
                                        props.student,
                                        application
                                    )}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <b className="text-warning">
                                    {application.programId.degree}
                                </b>
                                {' - '}
                                <b className="text-warning">
                                    {application.programId.semester}
                                </b>
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

const ReadyToSubmitTasksCard = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const ready_to_submit_tasks = props.students.filter((student) =>
        student.agents.some((agent) => agent._id === user._id.toString())
    );
    const readyToSubmittasks = ready_to_submit_tasks.map((student, i) => (
        <ReadyToSubmitTasks key={i} student={student} />
    ));

    return (
        <Card sx={{ mb: 2 }}>
            <Alert severity="error">
                <Typography>
                    {t('Ready To Submit Tasks', { ns: 'dashboard' })}:
                </Typography>
            </Alert>
            <TableContainer style={{ maxHeight: '300px' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {t('Student', { ns: 'common' })}
                            </TableCell>
                            <TableCell>
                                {t('Start', { ns: 'common' })}
                            </TableCell>
                            <TableCell>
                                {t('Deadline', { ns: 'common' })}
                            </TableCell>
                            <TableCell>
                                {t('Semester', { ns: 'common' })} -{' '}
                                {t('Degree', { ns: 'common' })} -{' '}
                                {t('Program', { ns: 'common' })}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{readyToSubmittasks}</TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default ReadyToSubmitTasksCard;
