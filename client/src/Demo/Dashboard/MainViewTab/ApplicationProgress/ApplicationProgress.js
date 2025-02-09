import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { differenceInDays } from 'date-fns';
import {
    isProgramAdmitted,
    isProgramDecided,
    isProgramSubmitted,
    isProgramWithdraw
} from '@taiger-common/core';

import {
    ADMISSION_STATUS_E,
    DECISION_STATUS_E,
    SUBMISSION_STATUS_E
} from '../../../../utils/contants';
import { application_deadline_calculator } from '../../../Utils/checking-functions';
import DEMO from '../../../../store/constant';

function ApplicationProgress(props) {
    const { t } = useTranslation();
    var applying_university;

    var today = new Date();
    if (
        props.student.applications === undefined ||
        props.student.applications.length === 0
    ) {
        applying_university = (
            <TableRow>
                <TableCell>{t('No University', { ns: 'common' })}</TableCell>
                <TableCell>{t('No Program', { ns: 'common' })}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </TableRow>
        );
    } else {
        const applications = [
            ...props.student.applications.filter((app) =>
                isProgramDecided(app)
            ),
            ...props.student.applications.filter(
                (app) => !isProgramDecided(app)
            )
        ];
        applying_university = applications.map((application, i) => (
            <TableRow key={i}>
                <TableCell>
                    <Link
                        component={LinkDom}
                        target="_blank"
                        to={DEMO.SINGLE_PROGRAM_LINK(
                            application.programId._id.toString()
                        )}
                        underline="hover"
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
                        component={LinkDom}
                        target="_blank"
                        to={DEMO.SINGLE_PROGRAM_LINK(
                            application.programId._id.toString()
                        )}
                        underline="hover"
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
                        component={LinkDom}
                        target="_blank"
                        to={DEMO.SINGLE_PROGRAM_LINK(
                            application.programId._id.toString()
                        )}
                        underline="hover"
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
                    <TableCell>
                        <Typography>
                            {application.programId.semester}
                        </Typography>
                    </TableCell>
                ) : (
                    <TableCell>
                        <Typography>
                            {application.programId.semester}
                        </Typography>
                    </TableCell>
                )}
                {isProgramDecided(application) ? (
                    isProgramSubmitted(application) ? (
                        <TableCell>
                            <Typography>
                                {application.programId.toefl
                                    ? application.programId.toefl
                                    : '-'}
                            </Typography>
                        </TableCell>
                    ) : (
                        <TableCell>
                            <Typography>
                                {application.programId.toefl
                                    ? application.programId.toefl
                                    : '-'}
                            </Typography>
                        </TableCell>
                    )
                ) : (
                    <TableCell>
                        <Typography>
                            {application.programId.toefl
                                ? application.programId.toefl
                                : '-'}
                        </Typography>
                    </TableCell>
                )}
                {isProgramDecided(application) ? (
                    isProgramSubmitted(application) ? (
                        <TableCell>
                            <Typography>
                                {application.programId.ielts
                                    ? application.programId.ielts
                                    : '-'}
                            </Typography>
                        </TableCell>
                    ) : (
                        <TableCell>
                            <Typography>
                                {application.programId.ielts
                                    ? application.programId.ielts
                                    : '-'}
                            </Typography>
                        </TableCell>
                    )
                ) : (
                    <TableCell>
                        <Typography>
                            {application.programId.ielts
                                ? application.programId.ielts
                                : '-'}
                        </Typography>
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
                                {t('Close', { ns: 'common' })}
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
                                {application_deadline_calculator(
                                    props.student,
                                    application
                                )}
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
                            {application_deadline_calculator(
                                props.student,
                                application
                            )}
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
                {isProgramAdmitted(application) ? (
                    <TableCell> {ADMISSION_STATUS_E.OK_SYMBOL}</TableCell>
                ) : application.admission === 'X' ? (
                    <TableCell> {ADMISSION_STATUS_E.NOT_OK_SYMBOL}</TableCell>
                ) : (
                    <TableCell>{ADMISSION_STATUS_E.UNKNOWN_SYMBOL}</TableCell>
                )}
                {application.finalEnrolment ? (
                    <TableCell> {ADMISSION_STATUS_E.OK_SYMBOL}</TableCell>
                ) : (
                    <TableCell>{ADMISSION_STATUS_E.UNKNOWN_SYMBOL}</TableCell>
                )}
                <TableCell>
                    {isProgramSubmitted(application)
                        ? '-'
                        : application.programId.application_deadline
                          ? differenceInDays(
                                application_deadline_calculator(
                                    props.student,
                                    application
                                ),
                                today
                            )
                          : '-'}
                </TableCell>
            </TableRow>
        ));
    }

    return applying_university;
}

export default ApplicationProgress;
