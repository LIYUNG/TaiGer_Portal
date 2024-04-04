import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
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

function NoProgramStudentTable(props) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const no_programs_student_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <NoProgramStudentTask key={i} role={user.role} student={student} />
    ));

  return (
    anyStudentWithoutApplicationSelection(
      props.students.filter((student) =>
        student.agents.some((agent) => agent._id === user._id.toString())
      )
    ) && (
      <Card sx={{ mb: 2 }}>
        <Alert severity="error">
          <Typography>No Program Selected Yet</Typography>
        </Alert>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('Student Name', { ns: 'common' })}</TableCell>
              <TableCell>
                {t('Year', { ns: 'common' })}/{t('Semester', { ns: 'common' })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{no_programs_student_tasks}</TableBody>
        </Table>
      </Card>
    )
  );
}

export default NoProgramStudentTable;
