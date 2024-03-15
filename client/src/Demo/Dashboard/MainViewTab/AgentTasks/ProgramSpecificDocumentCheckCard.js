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

import { useAuth } from '../../../../components/AuthProvider';
import ProgramSpecificDocument from './ProgramSpecificDocument';

function ProgramSpecificDocumentCheckCard(props) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const no_programs_student_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <ProgramSpecificDocument key={i} role={user.role} student={student} />
    ));

  return (
    <Card sx={{ mb: 2 }}>
      <Alert severity="error">
        <Typography>Program Specific Documents Check</Typography>
      </Alert>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('Student Name')}</TableCell>
            <TableCell>
              {t('Year')}/{t('Semester')}
            </TableCell>
            <TableCell>{t('Documents', { ns: 'common' })}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{no_programs_student_tasks}</TableBody>
      </Table>
    </Card>
  );
}

export default ProgramSpecificDocumentCheckCard;
