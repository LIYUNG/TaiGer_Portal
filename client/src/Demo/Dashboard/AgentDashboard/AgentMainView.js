import React, { Fragment, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslation } from 'react-i18next';
import {
    Grid,
    Card,
    Link,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Alert,
    Typography,
    Box
} from '@mui/material';
import { isProgramDecided } from '@taiger-common/core';

import { updateAgentBanner } from '../../../api';
import { appConfig } from '../../../config';
import {
    AGENT_SUPPORT_DOCUMENTS_A,
    isAnyCVNotAssigned,
    is_any_base_documents_uploaded,
    is_any_programs_ready_to_submit,
    is_any_vpd_missing,
    open_tasks,
    programs_refactor,
    progressBarCounter
} from '../../Utils/checking-functions';
import DEMO from '../../../store/constant';
import ApplicationProgressCardBody from '../../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import ProgramReportCard from '../../Program/ProgramReportCard';
import CVAssignTasksCard from '../MainViewTab/AgentTasks/CVAssignTasksCard';
import ReadyToSubmitTasksCard from '../MainViewTab/AgentTasks/ReadyToSubmitTasksCard';
import NoEnoughDecidedProgramsTasksCard from '../MainViewTab/AgentTasks/NoEnoughDecidedProgramsTasksCard';
import VPDToSubmitTasksCard from '../MainViewTab/AgentTasks/VPDToSubmitTasksCard';
import { useAuth } from '../../../components/AuthProvider';
import NoProgramStudentTable from '../MainViewTab/AgentTasks/NoProgramStudentTable';
import BaseDocumentCheckingTable from '../MainViewTab/AgentTasks/BaseDocumentCheckingTable';
import ProgramSpecificDocumentCheckCard from '../MainViewTab/AgentTasks/ProgramSpecificDocumentCheckCard';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import useStudents from '../../../hooks/useStudents';
import Banner from '../../../components/Banner/Banner';
import {
    is_new_message_status,
    is_pending_status
} from '../../../utils/contants';

function AgentMainView(props) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const {
        res_modal_status,
        res_modal_message,
        ConfirmError,
        students: initStudents
    } = useStudents({
        students: props.students
    });
    const [agentMainViewState, setAgentMainViewState] = useState({
        error: '',
        notification: props.notification,
        collapsedRows: {}
    });

    const students = initStudents?.filter((student) => !student.archiv);

    const removeAgentBanner = (e, notification_key, student_id) => {
        e.preventDefault();
        const temp_user = { ...user };
        const idx = temp_user.agent_notification[
            `${notification_key}`
        ].findIndex((student_obj) => student_obj.student_id === student_id);
        temp_user.agent_notification[`${notification_key}`].splice(idx, 1);
        setAgentMainViewState({
            ...agentMainViewState,
            notification: temp_user.agent_notification,
            user: temp_user
        });
        updateAgentBanner(notification_key, student_id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    setAgentMainViewState((prevState) => ({
                        ...prevState,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setAgentMainViewState((prevState) => ({
                        ...prevState,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setAgentMainViewState({
                    ...agentMainViewState,
                    error,
                    res_status: 500
                });
            }
        );
    };

    const handleCollapse = (index) => {
        setAgentMainViewState({
            ...agentMainViewState,
            collapsedRows: {
                ...agentMainViewState.collapsedRows,
                [index]: !agentMainViewState.collapsedRows[index]
            }
        });
    };

    const applications_arr = programs_refactor(students)
        .filter(
            (application) =>
                isProgramDecided(application) &&
                application.closed === '-' &&
                application.program_name !== 'No Program'
        )
        .sort((a, b) =>
            a.application_deadline > b.application_deadline ? 1 : -1
        );

    const myStudents = students.filter((student) =>
        student.agents.some((agent) => agent._id === user._id.toString())
    );

    const new_message_tasks = open_tasks(myStudents)
        .filter((open_task) =>
            [...AGENT_SUPPORT_DOCUMENTS_A].includes(open_task.file_type)
        )
        .filter(
            (open_task) =>
                open_task.show &&
                !open_task.isFinalVersion &&
                is_new_message_status(user, open_task)
        );

    const follow_up_task = open_tasks(myStudents)
        .filter((open_task) =>
            [...AGENT_SUPPORT_DOCUMENTS_A].includes(open_task.file_type)
        )
        .filter(
            (open_task) =>
                open_task.show &&
                !open_task.isFinalVersion &&
                is_pending_status(user, open_task) &&
                open_task.latest_message_left_by_id !== ''
        );

    return (
        <Box sx={{ mb: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                    {agentMainViewState.notification?.isRead_new_base_docs_uploaded?.map(
                        (student, i) => (
                            <Card key={i} sx={{ mb: 1 }}>
                                <Banner
                                    bg={'danger'}
                                    title={'warning'}
                                    path={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                        student.student_id,
                                        DEMO.PROFILE_HASH
                                    )}`}
                                    text={`${t(
                                        'There are new base documents uploaded by',
                                        {
                                            ns: 'common'
                                        }
                                    )} ${student.student_firstname} ${student.student_lastname}`}
                                    link_name={<LaunchIcon fontSize="small" />}
                                    removeBanner={(e) =>
                                        removeAgentBanner(
                                            e,
                                            'isRead_new_base_docs_uploaded',
                                            student.student_id
                                        )
                                    }
                                    student_id={student.student_id}
                                    notification_key={
                                        'isRead_new_base_docs_uploaded'
                                    }
                                />
                            </Card>
                        )
                    )}
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ p: 2 }}>
                        <Typography>
                            {t('Action required', { ns: 'common' })}
                        </Typography>
                        <Typography variant="h6">
                            <Link
                                to={DEMO.AGENT_SUPPORT_DOCUMENTS('to-do')}
                                component={LinkDom}
                                underline="hover"
                            >
                                <b>
                                    {t('Task', {
                                        ns: 'common',
                                        count: new_message_tasks?.length || 0
                                    })}
                                </b>
                            </Link>
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ p: 2 }}>
                        <Typography>
                            {t('Follow up', { ns: 'common' })}
                        </Typography>
                        <Typography variant="h6">
                            <Link
                                to={DEMO.AGENT_SUPPORT_DOCUMENTS('follow-up')}
                                component={LinkDom}
                                underline="hover"
                            >
                                <b>
                                    {t('Task', {
                                        ns: 'common',
                                        count: follow_up_task?.length || 0
                                    })}
                                </b>
                            </Link>
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ p: 2 }}>
                        <Typography>
                            {t('student-count', {
                                ns: 'common'
                            })}
                        </Typography>
                        <Typography variant="h6">
                            <Link
                                to={DEMO.STUDENT_APPLICATIONS_LINK}
                                component={LinkDom}
                                underline="hover"
                            >
                                <b>{students?.length || 0}</b>
                            </Link>
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Card sx={{ p: 2 }}>
                        <Typography>{t('XXXX', { ns: 'common' })}</Typography>
                        <Typography variant="h6">Comming soon</Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <Alert severity="error">
                            <Typography>
                                {t('Upcoming Applications', {
                                    ns: 'dashboard'
                                })}{' '}
                                ({applications_arr?.length}):
                            </Typography>
                        </Alert>
                        <div className="card-scrollable-body">
                            <Table size="small">
                                <TableBody>
                                    {applications_arr.map(
                                        (application, idx) => (
                                            <Fragment key={idx}>
                                                <TableRow
                                                    className="text-black"
                                                    onClick={() =>
                                                        handleCollapse(idx)
                                                    }
                                                >
                                                    <TableCell>
                                                        {progressBarCounter(
                                                            application.student,
                                                            application.application
                                                        )}
                                                        %
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            underline="hover"
                                                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                                                application.student_id,
                                                                DEMO.PROFILE_HASH
                                                            )}`}
                                                            component={LinkDom}
                                                        >
                                                            <b>
                                                                {
                                                                    application.firstname_lastname
                                                                }{' '}
                                                            </b>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            application.application_deadline
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {application.school}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            application.program_name
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                                {agentMainViewState
                                                    .collapsedRows[idx] && (
                                                    <TableRow>
                                                        <TableCell colSpan="12">
                                                            <ApplicationProgressCardBody
                                                                student={
                                                                    application.student
                                                                }
                                                                application={
                                                                    application.application
                                                                }
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Fragment>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </Grid>
                {is_any_programs_ready_to_submit(myStudents) && (
                    <Grid item sm={12} md={6}>
                        <ReadyToSubmitTasksCard
                            students={students}
                            user={user}
                        />
                    </Grid>
                )}
                {appConfig.vpdEnable && is_any_vpd_missing(myStudents) && (
                    <Grid item xs={12} md={4}>
                        <VPDToSubmitTasksCard students={students} user={user} />
                    </Grid>
                )}
                <Grid item xs={12} sm={6} md={4}>
                    <ProgramReportCard />
                </Grid>
                {is_any_base_documents_uploaded(myStudents) && (
                    <Grid item xs={12} sm={6} md={4}>
                        <BaseDocumentCheckingTable students={students} />
                    </Grid>
                )}
                {isAnyCVNotAssigned(myStudents) && (
                    <Grid item xs={12} sm={6} md={4}>
                        <CVAssignTasksCard students={students} user={user} />
                    </Grid>
                )}
                <NoProgramStudentTable students={students} />
                <Grid item xs={12} sm={6} md={4}>
                    <ProgramSpecificDocumentCheckCard students={students} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <NoEnoughDecidedProgramsTasksCard
                        students={students}
                        user={user}
                    />
                </Grid>
            </Grid>
            {res_modal_status >= 400 && (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_status={res_modal_status}
                    res_modal_message={res_modal_message}
                />
            )}
        </Box>
    );
}

export default AgentMainView;
