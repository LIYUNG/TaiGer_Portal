import React, { Fragment, useState } from 'react';
import {
    Alert,
    Box,
    Card,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { isProgramDecided } from '@taiger-common/core';

import BaseDocumentCheckingTasks from '../MainViewTab/AgentTasks/BaseDocumentCheckingTasks';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import { updateAgentBanner } from '../../../api';
import { academic_background_header } from '../../../utils/contants';
import {
    anyStudentWithoutApplicationSelection,
    isAnyCVNotAssigned,
    is_any_base_documents_uploaded,
    is_any_programs_ready_to_submit,
    is_any_vpd_missing,
    programs_refactor,
    progressBarCounter
} from '../../Utils/checking-functions';
import NoProgramStudentTask from '../MainViewTab/AgentTasks/NoProgramStudentTask';
import DEMO from '../../../store/constant';
import ApplicationProgressCardBody from '../../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import ProgramReportCard from '../../Program/ProgramReportCard';
import CVAssignTasksCard from '../MainViewTab/AgentTasks/CVAssignTasksCard';
import ReadyToSubmitTasksCard from '../MainViewTab/AgentTasks/ReadyToSubmitTasksCard';
import NoEnoughDecidedProgramsTasksCard from '../MainViewTab/AgentTasks/NoEnoughDecidedProgramsTasksCard';
import VPDToSubmitTasksCard from '../MainViewTab/AgentTasks/VPDToSubmitTasksCard';
import { useAuth } from '../../../components/AuthProvider';
import { useTranslation } from 'react-i18next';
import Banner from '../../../components/Banner/Banner';

const ManagerMainView = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [managerMainViewState, setManagerMainViewState] = useState({
        error: '',
        user: user,
        notification: props.notification,
        collapsedRows: {}
    });

    const removeAgentBanner = (e, notification_key, student_id) => {
        e.preventDefault();
        const temp_user = { ...user };
        const idx = temp_user.agent_notification[
            `${notification_key}`
        ].findIndex((student_obj) => student_obj.student_id === student_id);
        temp_user.agent_notification[`${notification_key}`].splice(idx, 1);

        setManagerMainViewState((prevState) => ({
            ...prevState,
            user: temp_user
        }));

        updateAgentBanner(notification_key, student_id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    setManagerMainViewState((prevState) => ({
                        ...prevState,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setManagerMainViewState((prevState) => ({
                        ...prevState,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setManagerMainViewState((prevState) => ({
                    ...prevState,
                    error,
                    res_status: 500
                }));
            }
        );
    };

    const handleCollapse = (index) => {
        setManagerMainViewState((prevState) => ({
            ...prevState,
            collapsedRows: {
                ...prevState.collapsedRows,
                [index]: !prevState.collapsedRows[index]
            }
        }));
    };
    const students_agent_editor = props.students.map((student, i) => (
        <StudentsAgentEditor
            documentslist={props.documentslist}
            isDashboard={props.isDashboard}
            key={i}
            student={student}
            submitUpdateAgentlist={props.submitUpdateAgentlist}
            updateAgentList={props.updateAgentList}
            updateStudentArchivStatus={props.updateStudentArchivStatus}
            user={user}
        />
    ));

    const base_documents_checking_tasks = props.students
        .filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
        )
        .map((student, i) => (
            <BaseDocumentCheckingTasks key={i} student={student} />
        ));

    const no_programs_student_tasks = props.students
        .filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
        )
        .map((student, i) => (
            <NoProgramStudentTask key={i} student={student} />
        ));

    const applications_arr = programs_refactor(props.students)
        .filter(
            (application) =>
                isProgramDecided(application) &&
                application.closed === '-' &&
                application.program_name !== 'No Program'
        )
        .sort((a, b) =>
            a.application_deadline > b.application_deadline ? 1 : -1
        );

    let header = Object.values(academic_background_header);

    return (
        <>
            {managerMainViewState.notification?.isRead_new_base_docs_uploaded.map(
                (student, i) => (
                    <Box key={i}>
                        <Card>
                            <Banner
                                bg="danger"
                                link_name={<LaunchIcon fontSize="small" />}
                                notification_key="isRead_new_base_docs_uploaded"
                                path={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                    student.student_id,
                                    DEMO.PROFILE_HASH
                                )}`}
                                removeBanner={(e) =>
                                    removeAgentBanner(
                                        e,
                                        'isRead_new_base_docs_uploaded',
                                        student.student_id
                                    )
                                }
                                student_id={student.student_id}
                                text={`${t(
                                    'There are new base documents uploaded by',
                                    {
                                        ns: 'common'
                                    }
                                )} ${student.student_firstname} ${student.student_lastname}`}
                                title="warning"
                            />
                        </Card>
                    </Box>
                )
            )}
            <Box>
                <div className="card-with-scroll">
                    <Alert severity="error">
                        {t('Upcoming Applications', { ns: 'dashboard' })}{' '}
                        (Decided):
                    </Alert>
                    <div className="card-scrollable-body">
                        <Table size="small">
                            <TableBody>
                                {applications_arr.map((application, idx) => (
                                    <Fragment key={idx}>
                                        <TableRow
                                            className="text-black"
                                            onClick={() => handleCollapse(idx)}
                                        >
                                            <TableCell>
                                                <b>
                                                    <Link
                                                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                                            application.student_id,
                                                            DEMO.PROFILE_HASH
                                                        )}`}
                                                    >
                                                        {
                                                            application.firstname_lastname
                                                        }
                                                    </Link>
                                                </b>
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
                                                {progressBarCounter(
                                                    application.student,
                                                    application.application
                                                )}
                                                %
                                            </TableCell>
                                            <TableCell>
                                                {application.program_name}
                                            </TableCell>
                                        </TableRow>
                                        {managerMainViewState.collapsedRows[
                                            idx
                                        ] ? (
                                            <TableRow>
                                                <td colSpan="12">
                                                    <ApplicationProgressCardBody
                                                        application={
                                                            application.application
                                                        }
                                                        student={
                                                            application.student
                                                        }
                                                    />
                                                </td>
                                            </TableRow>
                                        ) : null}
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Box>
            <Grid container spacing={2}>
                {/* TODO: add a program update request ticket card (independent component?) */}
                <ProgramReportCard />
                {is_any_programs_ready_to_submit(
                    props.students.filter((student) =>
                        student.agents.some(
                            (agent) => agent._id === user._id.toString()
                        )
                    )
                ) ? (
                    <ReadyToSubmitTasksCard
                        students={props.students}
                        user={user}
                    />
                ) : null}
                {is_any_vpd_missing(
                    props.students.filter((student) =>
                        student.agents.some(
                            (agent) => agent._id === user._id.toString()
                        )
                    )
                ) ? (
                    <VPDToSubmitTasksCard
                        students={props.students}
                        user={user}
                    />
                ) : null}
                {is_any_base_documents_uploaded(
                    props.students.filter((student) =>
                        student.agents.some(
                            (agent) => agent._id === user._id.toString()
                        )
                    )
                ) ? (
                    <Card>
                        <ReportProblemIcon size={18} /> Check uploaded base
                        documents:
                        <Box className="py-0 px-0 card-scrollable-body">
                            <Table
                                bordered
                                className="my-0 mx-0"
                                hover
                                size="sm"
                                text="light"
                                variant="dark"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {t('Student', { ns: 'common' })}
                                        </TableCell>
                                        <TableCell>
                                            {t('Base Documents', {
                                                ns: 'common'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {t('Upload Time', { ns: 'common' })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {base_documents_checking_tasks}
                                </TableBody>
                            </Table>
                        </Box>
                    </Card>
                ) : null}
                {isAnyCVNotAssigned(
                    props.students.filter((student) =>
                        student.agents.some(
                            (agent) => agent._id === user._id.toString()
                        )
                    )
                ) ? (
                    <CVAssignTasksCard students={props.students} user={user} />
                ) : null}
                {anyStudentWithoutApplicationSelection(
                    props.students.filter((student) =>
                        student.agents.some(
                            (agent) => agent._id === user._id.toString()
                        )
                    )
                ) ? (
                    <Grid item xs={6}>
                        <Card bg="danger" className="my-2 mx-0" text="light">
                            <Typography variant="h6">
                                <ReportProblemIcon size={18} /> No Program
                                Selected Yet:
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student Name</TableCell>
                                        <TableCell>Year/Semester</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {no_programs_student_tasks}
                                </TableBody>
                            </Table>
                        </Card>
                    </Grid>
                ) : null}
                <NoEnoughDecidedProgramsTasksCard
                    students={props.students}
                    user={user}
                />
            </Grid>
            <Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {header.map((name, index) => (
                                <TableCell key={index}>{name}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{students_agent_editor}</TableBody>
                </Table>
            </Box>
        </>
    );
};

export default ManagerMainView;
