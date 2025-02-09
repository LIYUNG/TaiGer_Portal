import React from 'react';
import {
    Box,
    Card,
    Grid,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

// import TabProgramConflict from '../MainViewTab/ProgramConflict/TabProgramConflict';
import StudentsAgentEditor from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import TasksDistributionBarChart from '../../../components/Charts/TasksDistributionBarChart';
import {
    does_essay_have_writers,
    does_student_have_editors,
    frequencyDistribution,
    open_tasks,
    open_tasks_with_editors
} from '../../Utils/checking-functions';
import {
    academic_background_header,
    is_new_message_status,
    is_pending_status
} from '../../../utils/contants';
import DEMO from '../../../store/constant';
import { useAuth } from '../../../components/AuthProvider';
import { useTranslation } from 'react-i18next';

const EditorMainView = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const students_agent_editor = (
        <>
            {props.students
                .sort((a, b) =>
                    a.agents.length === 0 && a.agents.length < b.agents.length
                        ? -2
                        : a.editors.length < b.editors.length
                          ? -1
                          : 1
                )
                .map((student) => (
                    <StudentsAgentEditor
                        isDashboard={props.isDashboard}
                        key={student._id}
                        student={student}
                        submitUpdateEditorlist={props.submitUpdateEditorlist}
                        updateStudentArchivStatus={
                            props.updateStudentArchivStatus
                        }
                        user={user}
                    />
                ))}
        </>
    );
    // TODO: consider assigned essays!

    const open_tasks_arr = open_tasks_with_editors(props.students);
    const task_distribution = open_tasks_arr
        .filter(({ isFinalVersion }) => isFinalVersion !== true)
        .map(({ deadline, file_type, show, isPotentials }) => {
            return { deadline, file_type, show, isPotentials };
        });
    const open_distr = frequencyDistribution(task_distribution);

    const sort_date = Object.keys(open_distr).sort();

    const sorted_date_freq_pair = [];
    sort_date.forEach((date) => {
        sorted_date_freq_pair.push({
            name: `${date}`,
            active: open_distr[date].show,
            potentials: open_distr[date].potentials
        });
    });
    let header = Object.values(academic_background_header);
    const myStudents = props.students.filter((student) =>
        student.editors.some((editor) => editor._id === user._id.toString())
    );
    const unreplied_task = open_tasks(myStudents).filter(
        (open_task) =>
            open_task.show &&
            !open_task.isFinalVersion &&
            is_new_message_status(user, open_task)
    );
    const follow_up_task = open_tasks(myStudents).filter(
        (open_task) =>
            open_task.show &&
            !open_task.isFinalVersion &&
            is_pending_status(user, open_task) &&
            open_task.latest_message_left_by_id !== ''
    );

    return (
        <Grid container spacing={2}>
            <Grid item md={3} xs={6}>
                <Card sx={{ p: 2 }}>
                    <Typography>
                        {t('Action required', { ns: 'common' })}
                    </Typography>
                    <Typography variant="h6">
                        <Link
                            component={LinkDom}
                            to={DEMO.CV_ML_RL_CENTER_LINK}
                            underline="hover"
                        >
                            <b>
                                {t('Task', {
                                    ns: 'common',
                                    count: unreplied_task?.length || 0
                                })}
                            </b>
                        </Link>
                    </Typography>
                </Card>
            </Grid>
            <Grid item md={3} xs={6}>
                <Card sx={{ p: 2 }}>
                    <Typography>{t('Follow up', { ns: 'common' })}</Typography>
                    <Typography variant="h6">
                        <Link
                            component={LinkDom}
                            to={DEMO.CV_ML_RL_CENTER_LINK}
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
            <Grid item md={3} xs={12}>
                <Card sx={{ p: 2 }}>
                    <Typography>
                        {t('student-count', {
                            ns: 'common'
                        })}
                    </Typography>
                    <Typography variant="h6">
                        <Link
                            component={LinkDom}
                            to={DEMO.STUDENT_APPLICATIONS_LINK}
                            underline="hover"
                        >
                            <b>
                                {
                                    props.students.filter((student) =>
                                        student.editors.some(
                                            (editor) =>
                                                editor._id ===
                                                user._id.toString()
                                        )
                                    )?.length
                                }
                            </b>
                        </Link>
                    </Typography>
                </Card>
            </Grid>
            <Grid item md={3} xs={12}>
                <Card sx={{ p: 2 }}>
                    <Typography>XXXXXX</Typography>
                    <Typography variant="h6">
                        {t('Coming soon', { ns: 'common' })}
                    </Typography>
                </Card>
            </Grid>
            {!does_student_have_editors(props.students) ||
            !does_essay_have_writers(props.essayDocumentThreads) ? (
                <Grid item md={12} xs={12}>
                    <Card sx={{ p: 2 }}>
                        <Typography fontWeight="bold">
                            {t('To Do Tasks', { ns: 'common' })}{' '}
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {t('Tasks', { ns: 'common' })}
                                    </TableCell>
                                    <TableCell>
                                        {t('Description', { ns: 'common' })}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Link
                                            component={LinkDom}
                                            to={`${DEMO.ASSIGN_EDITOR_LINK}`}
                                        >
                                            {t('Assign Editors')}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {t('Please assign editors', {
                                            ns: 'common'
                                        })}
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                                {!does_essay_have_writers(
                                    props.essayDocumentThreads?.filter(
                                        (thread) => !thread.isFinalVersion
                                    )
                                ) ? (
                                    <TableRow>
                                        <TableCell>
                                            <Link
                                                component={LinkDom}
                                                to={`${DEMO.ASSIGN_ESSAY_WRITER_LINK}`}
                                            >
                                                {t('Assign Essay Writer', {
                                                    ns: 'common'
                                                })}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {t('Please assign essay writers', {
                                                ns: 'common'
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </Card>
                </Grid>
            ) : null}
            <Grid item md={12} xs={12}>
                <Card sx={{ p: 2 }}>
                    <Box>
                        <Typography>My workload over time</Typography>
                        Tasks distribute among the date. Note that CVs, MLs,
                        RLs, and Essay are mixed together.
                        <Typography>
                            <b style={{ color: 'red' }}>active:</b> students
                            decide programs. These will be shown in{' '}
                            <Link
                                component={LinkDom}
                                to={`${DEMO.CV_ML_RL_DASHBOARD_LINK}`}
                                underline="hover"
                            >
                                Tasks Dashboard
                            </Link>
                        </Typography>
                        <Typography>
                            <b style={{ color: '#A9A9A9' }}>potentials:</b>{' '}
                            students do not decide programs yet. But the tasks
                            will be potentially active when they decided.
                        </Typography>
                        <TasksDistributionBarChart
                            data={sorted_date_freq_pair}
                            k="name"
                            value1="active"
                            value2="potentials"
                            yLabel="Tasks"
                        />
                    </Box>
                </Card>
            </Grid>

            {/* <Grid item xs={12} md={12}>
          <TabProgramConflict students={props.students} />
        </Grid> */}
            <Grid item md={12} xs={12}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            {header.map((name, index) => (
                                <TableCell key={index}>
                                    {t(name, { ns: 'common' })}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>{students_agent_editor}</TableBody>
                </Table>
            </Grid>
        </Grid>
    );
};

export default EditorMainView;
