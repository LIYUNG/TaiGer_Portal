import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Alert,
    Typography
} from '@mui/material';

import { anyStudentWithoutApplicationSelection } from '../../../Utils/checking-functions';
import NoProgramStudentTask from '../../MainViewTab/AgentTasks/NoProgramStudentTask';
import { useAuth } from '../../../../components/AuthProvider';

const NoProgramStudentTable = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const no_programs_student_tasks = props.students
        .filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
        )
        .map((student, i) => (
            <NoProgramStudentTask key={i} student={student} />
        ));

    return (
        anyStudentWithoutApplicationSelection(
            props.students.filter((student) =>
                student.agents.some(
                    (agent) => agent._id === user._id.toString()
                )
            )
        ) && (
            <Grid item md={4} sm={6} xs={12}>
                <Card sx={{ mb: 2 }}>
                    <Alert severity="error">
                        <Typography>
                            {t('No Program Selected Yet', { ns: 'common' })}
                        </Typography>
                    </Alert>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {t('Student Name', { ns: 'common' })}
                                </TableCell>
                                <TableCell>
                                    {t('Year', { ns: 'common' })}/
                                    {t('Semester', { ns: 'common' })}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{no_programs_student_tasks}</TableBody>
                    </Table>
                </Card>
            </Grid>
        )
    );
};

export default NoProgramStudentTable;
