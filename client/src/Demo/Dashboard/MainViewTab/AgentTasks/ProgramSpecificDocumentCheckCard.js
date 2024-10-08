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
  Typography,
  TableContainer
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
    .map((student, i) => <ProgramSpecificDocument key={i} student={student} />);

  return (
    <Card sx={{ mb: 2 }}>
      <Alert severity="error">
        <Typography>
          {t('Program Specific Documents Check', { ns: 'common' })}
        </Typography>
      </Alert>
      <TableContainer style={{ maxHeight: '300px' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('Student Name', { ns: 'common' })}</TableCell>
              <TableCell>{t('Deadline', { ns: 'common' })}</TableCell>
              <TableCell>{t('Documents', { ns: 'common' })}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{no_programs_student_tasks}</TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default ProgramSpecificDocumentCheckCard;
