import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TableContainer
} from '@mui/material';

import BaseDocumentCheckingTasks from '../../MainViewTab/AgentTasks/BaseDocumentCheckingTasks';
import { useAuth } from '../../../../components/AuthProvider';

function BaseDocumentCheckingTable(props) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const base_documents_checking_tasks = props.students
    .filter((student) =>
      student.agents.some((agent) => agent._id === user._id.toString())
    )
    .map((student, i) => (
      <BaseDocumentCheckingTasks key={i} role={user.role} student={student} />
    ));

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <Alert severity="error">{t('Check uploaded base documents')}:</Alert>
        <TableContainer style={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('Student')}</TableCell>
                <TableCell>{t('Document Type')}</TableCell>
                <TableCell>{t('Upload Time')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{base_documents_checking_tasks}</TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

export default BaseDocumentCheckingTable;
