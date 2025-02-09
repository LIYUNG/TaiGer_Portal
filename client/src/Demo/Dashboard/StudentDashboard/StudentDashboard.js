import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import EventIcon from '@mui/icons-material/Event';
import {
    Alert,
    Box,
    Button,
    Card,
    Grid,
    IconButton,
    Link,
    ListItem,
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

import RespondedThreads from '../MainViewTab/RespondedThreads/RespondedThreads';
import StudentTasksResponsive from '../MainViewTab/StudentTasks/StudentTasksResponsive';
import {
    check_academic_background_filled,
    check_applications_to_decided,
    is_all_uni_assist_vpd_uploaded,
    are_base_documents_missing,
    isBaseDocumentsRejected,
    needGraduatedApplicantsButStudentNotGraduated,
    needGraduatedApplicantsPrograms
} from '../../Utils/checking-functions';
import ErrorPage from '../../Utils/ErrorPage';
import { updateBanner } from '../../../api';
import DEMO from '../../../store/constant';
import ApplicationProgressCard from '../../../components/ApplicationProgressCard/ApplicationProgressCard';
import { appConfig } from '../../../config';
import ProgramLanguageNotMatchedBanner from '../../../components/Banner/ProgramLanguageNotMatchedBanner';
import EnglishCertificateExpiredBeforeDeadlineBanner from '../../../components/Banner/EnglishCertificateExpiredBeforeDeadlineBanner';

const StudentDashboard = (props) => {
    const { t } = useTranslation();
    const [studentDashboardState, setStudentDashboardState] = useState({
        error: '',
        student: props.student,
        itemheight: 20,
        data: [],
        res_status: 0
    });

    const removeBanner = (e, notification_key) => {
        e.preventDefault();
        const temp_student = studentDashboardState.student;
        temp_student.notification[`${notification_key}`] = true;
        setStudentDashboardState({ student: temp_student });
        updateBanner(notification_key).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    setStudentDashboardState({
                        ...studentDashboardState,
                        success: success,
                        res_status: status
                    });
                } else {
                    setStudentDashboardState({
                        ...studentDashboardState,
                        res_status: status
                    });
                }
            },
            (error) => {
                setStudentDashboardState({
                    ...studentDashboardState,
                    error,
                    res_status: 500
                });
            }
        );
    };

    const { res_status } = studentDashboardState;

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    const hasUpcomingAppointment = false;
    const read_thread = (
        <RespondedThreads student={studentDashboardState.student} />
    );

    const student_tasks = (
        <StudentTasksResponsive
            isCoursesFilled={props.isCoursesFilled}
            student={studentDashboardState.student}
        />
    );
    const student = studentDashboardState.student;

    return (
        <>
            {student.archiv ? (
                <Card sx={{ p: 2 }}>
                    <Typography color="red" variant="h5">
                        Status: <b>Close</b> - Your {appConfig.companyName}{' '}
                        Portal Service is terminated.
                    </Typography>
                    <Typography color="red" variant="body1">
                        {t('acctount_deactivated_text', { ns: 'dashboard' })}
                    </Typography>
                </Card>
            ) : null}
            <Alert severity="info">{t('announcement', { ns: 'common' })}</Alert>
            <Grid container spacing={1} sx={{ mt: 0 }}>
                {student.notification &&
                !student.notification.isRead_survey_not_complete &&
                !check_academic_background_filled(
                    student.academic_background
                ) ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(e, 'isRead_survey_not_complete')
                            }
                            severity="warning"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Typography sx={{ flexGrow: 1 }} variant="body2">
                                {t(
                                    'It looks like you did not finish survey. See',
                                    {
                                        ns: 'common'
                                    }
                                )}{' '}
                                <Link
                                    component={LinkDom}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ml: 1
                                    }}
                                    target="_blank"
                                    to={DEMO.SURVEY_LINK}
                                    underline="hover"
                                >
                                    {t('Survey')}
                                    <LaunchIcon
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>
                            </Typography>
                        </Alert>
                    </Grid>
                ) : null}

                {student.notification &&
                !student.notification.isRead_uni_assist_task_assigned &&
                appConfig.vpdEnable &&
                !is_all_uni_assist_vpd_uploaded(student) ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(
                                    e,
                                    'isRead_uni_assist_task_assigned'
                                )
                            }
                            severity="warning"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Typography sx={{ flexGrow: 1 }} variant="body2">
                                {t(
                                    'Please go to Uni-Assist to apply or to get VPD'
                                )}{' '}
                                <Link
                                    component={LinkDom}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ml: 1
                                    }}
                                    target="_blank"
                                    to={DEMO.UNI_ASSIST_LINK}
                                    underline="hover"
                                >
                                    {t('Uni-Assist')}
                                    <LaunchIcon
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>
                            </Typography>
                        </Alert>
                    </Grid>
                ) : null}
                {/* new agents assigned banner */}
                {student.notification &&
                !student.notification.isRead_new_agent_assigned ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(e, 'isRead_new_agent_assigned')
                            }
                            severity="success"
                        >
                            {t('New agent is assigned to you')}
                        </Alert>
                    </Grid>
                ) : null}
                {/* new editors assigned banner */}
                {student.notification &&
                !student.notification.isRead_new_editor_assigned ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(e, 'isRead_new_editor_assigned')
                            }
                            severity="success"
                        >
                            {t('New editor is assigned to you')}
                        </Alert>
                    </Grid>
                ) : null}
                {/* new CV ML RL Essay message */}
                {student.notification &&
                !student.notification.isRead_new_cvmlrl_messsage ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(e, 'isRead_new_cvmlrl_messsage')
                            }
                            severity="warning"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Typography sx={{ flexGrow: 1 }} variant="body2">
                                {t('New feedback from your Editor')}{' '}
                                <Link
                                    component={LinkDom}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ml: 1
                                    }}
                                    target="_blank"
                                    to={DEMO.CV_ML_RL_CENTER_LINK}
                                    underline="hover"
                                >
                                    {t('CV/ML/RL Center', { ns: 'common' })}
                                    <LaunchIcon
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>
                            </Typography>
                        </Alert>
                    </Grid>
                ) : null}
                {/* TODO: check function : new cv ml rl tasks are asigned to you */}
                {student.notification &&
                !student.notification.isRead_new_cvmlrl_tasks_created ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(
                                    e,
                                    'isRead_new_cvmlrl_tasks_created'
                                )
                            }
                            severity="warning"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Typography sx={{ flexGrow: 1 }} variant="body2">
                                {t('New tasks are assigned to you')}{' '}
                                <Link
                                    component={LinkDom}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ml: 1
                                    }}
                                    target="_blank"
                                    to={DEMO.CV_ML_RL_CENTER_LINK}
                                    underline="hover"
                                >
                                    {t('CV/ML/RL Center', { ns: 'common' })}
                                    <LaunchIcon
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>
                            </Typography>
                        </Alert>
                    </Grid>
                ) : null}
                {student.notification &&
                !student.notification.isRead_new_programs_assigned &&
                !check_applications_to_decided(student) ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(e, 'isRead_new_programs_assigned')
                            }
                            severity="warning"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Typography sx={{ flexGrow: 1 }} variant="body2">
                                {t('It looks like you did not decide programs')}{' '}
                                <Link
                                    component={LinkDom}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ml: 1
                                    }}
                                    target="_blank"
                                    to={DEMO.STUDENT_APPLICATIONS_LINK}
                                    underline="hover"
                                >
                                    {t('Application Overview', {
                                        ns: 'common'
                                    })}
                                    <LaunchIcon
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>
                            </Typography>
                        </Alert>
                    </Grid>
                ) : null}
                {student.notification &&
                !student.notification.isRead_base_documents_missing &&
                are_base_documents_missing(student) ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(e, 'isRead_base_documents_missing')
                            }
                            severity="warning"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Typography sx={{ flexGrow: 1 }} variant="body2">
                                {t('Some of Base Documents are still missing')}{' '}
                                <Link
                                    component={LinkDom}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ml: 1
                                    }}
                                    target="_blank"
                                    to={DEMO.BASE_DOCUMENTS_LINK}
                                    underline="hover"
                                >
                                    {t('My Documents', { ns: 'common' })}
                                    <LaunchIcon
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>
                            </Typography>
                        </Alert>
                    </Grid>
                ) : null}
                {student.notification &&
                !student.notification.isRead_base_documents_rejected &&
                isBaseDocumentsRejected(student) ? (
                    <Grid item xs={12}>
                        <Alert
                            onClose={(e) =>
                                removeBanner(
                                    e,
                                    'isRead_base_documents_rejected'
                                )
                            }
                            severity="warning"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Typography sx={{ flexGrow: 1 }} variant="body2">
                                {t('Some of Base Documents are rejected')}{' '}
                                <Link
                                    component={LinkDom}
                                    sx={{
                                        fontWeight: 'bold',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        ml: 1
                                    }}
                                    target="_blank"
                                    to={DEMO.BASE_DOCUMENTS_LINK}
                                    underline="hover"
                                >
                                    {t('My Documents', { ns: 'common' })}
                                    <LaunchIcon
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>
                            </Typography>
                        </Alert>
                    </Grid>
                ) : null}
                <Grid item md={12} xs={12}>
                    {needGraduatedApplicantsButStudentNotGraduated(student) ? (
                        <Card sx={{ border: '4px solid red' }}>
                            <Alert severity="warning">
                                {t(
                                    'Programs below are only for graduated applicants',
                                    {
                                        ns: 'common'
                                    }
                                )}
                                &nbsp;:&nbsp;
                            </Alert>
                            {needGraduatedApplicantsPrograms(
                                student.applications
                            )?.map((app) => (
                                <ListItem key={app.programId._id.toString()}>
                                    <Link
                                        component={LinkDom}
                                        target="_blank"
                                        to={DEMO.SINGLE_PROGRAM_LINK(
                                            app.programId._id.toString()
                                        )}
                                    >
                                        {app.programId.school}{' '}
                                        {app.programId.program_name}{' '}
                                        {app.programId.degree}{' '}
                                        {app.programId.semester}
                                    </Link>
                                </ListItem>
                            ))}
                        </Card>
                    ) : null}
                </Grid>
                <Grid item md={12} xs={12}>
                    <ProgramLanguageNotMatchedBanner student={student} />
                </Grid>
                <EnglishCertificateExpiredBeforeDeadlineBanner
                    student={student}
                />
                <Grid item md={8} xs={12}>
                    <Card style={{ border: '4px solid red' }}>
                        <Alert severity="warning">
                            {t('To Do Tasks', { ns: 'common' })} &nbsp;:&nbsp;
                            {t('Please finish it as soon as possible')}
                        </Alert>
                        <TableContainer style={{ overflowX: 'auto' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {t('Tasks', { ns: 'common' })}
                                        </TableCell>
                                        <TableCell>
                                            {t('Description', { ns: 'common' })}
                                        </TableCell>
                                        <TableCell>
                                            {t('Last update', { ns: 'common' })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>{student_tasks}</TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Box>
                        {appConfig.meetingEnable ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Card sx={{ p: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography
                                                    sx={{ display: 'flex' }}
                                                >
                                                    <EventIcon /> 時段預約
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {hasUpcomingAppointment ? null : (
                                                    <Typography>
                                                        想要一次密集討論？
                                                        可以預訂顧問 Office hour
                                                        時段討論。
                                                        <Link
                                                            color="inherit"
                                                            component={LinkDom}
                                                            target="_blank"
                                                            to="https://taigerconsultancy-portal.com/docs/search/64fe21bcbc729bc024d14738"
                                                        >
                                                            {t('Instructions')}
                                                            <IconButton>
                                                                <LaunchIcon fontSize="small" />
                                                            </IconButton>
                                                        </Link>
                                                    </Typography>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                {student?.agents?.length !==
                                                0 ? (
                                                    <Link
                                                        color="inherit"
                                                        component={LinkDom}
                                                        to={`${DEMO.EVENT_STUDENT_STUDENTID_LINK(
                                                            student._id.toString()
                                                        )}`}
                                                        underline="hover"
                                                    >
                                                        <Button
                                                            color="primary"
                                                            fullWidth
                                                            size="small"
                                                            variant="contained"
                                                        >
                                                            預約
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <span className="text-light">
                                                        {t('Wait for Agent', {
                                                            ns: 'common'
                                                        })}
                                                    </span>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography
                                                    sx={{
                                                        marginLeft: 2,
                                                        marginTop: 1
                                                    }}
                                                    variant="h6"
                                                >
                                                    Pending: 等待 Editor 回復
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                {t(
                                                                    'Documents',
                                                                    {
                                                                        ns: 'common'
                                                                    }
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {t(
                                                                    'Last update',
                                                                    {
                                                                        ns: 'common'
                                                                    }
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {read_thread}
                                                    </TableBody>
                                                </Table>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        ) : null}
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 0 }}>
                {student.applications
                    ?.filter((app) => isProgramDecided(app))
                    .map((application, idx) => (
                        <Grid item key={idx} lg={3} md={4} sm={6} xs={12}>
                            <ApplicationProgressCard
                                application={application}
                                student={student}
                            />
                        </Grid>
                    ))}
            </Grid>
        </>
    );
};

export default StudentDashboard;
