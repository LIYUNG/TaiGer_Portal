import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Alert, Card, Grid, Link, ListItem } from '@mui/material';
import dayjs from 'dayjs';
import i18next from 'i18next';

import {
    isEnglishCertificateExpiredBeforeDeadline,
    englishCertificatedExpiredBeforeTheseProgramDeadlines,
    application_deadline_calculator
} from '../../Demo/Utils/checking-functions';
import DEMO from '../../store/constant';

export default function EnglishCertificateExpiredBeforeDeadlineBanner(props) {
    return (
        isEnglishCertificateExpiredBeforeDeadline(props.student) && (
            <Grid item xs={12} md={12}>
                <Card sx={{ border: '4px solid red' }}>
                    <Alert severity="warning">
                        {i18next.t(
                            'english-certificate-expired-before-application-deadlines',
                            {
                                ns: 'common'
                            }
                        )}
                        &nbsp;:&nbsp;
                    </Alert>
                    {englishCertificatedExpiredBeforeTheseProgramDeadlines(
                        props.student
                    )?.map((app) => (
                        <ListItem key={app.programId._id.toString()}>
                            <Link
                                to={DEMO.SINGLE_PROGRAM_LINK(
                                    app.programId._id.toString()
                                )}
                                component={LinkDom}
                                target="_blank"
                            >
                                {app.programId.school}{' '}
                                {app.programId.program_name}{' '}
                                {app.programId.degree} {app.programId.semester}{' '}
                                - <strong>{app.programId.lang}</strong>
                                {' , Deadline: '}
                                {application_deadline_calculator(
                                    props.student,
                                    app
                                )}
                                {', English Certificate test date: '}
                                {dayjs(
                                    props.student.academic_background.language
                                        .english_test_date
                                )?.format('YYYY-MM-DD')}
                                {i18next.t('valid-only-two-years', {
                                    ns: 'common'
                                })}
                            </Link>
                        </ListItem>
                    ))}
                </Card>
            </Grid>
        )
    );
}
