import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import AgentReviewing from '../../Demo/Dashboard/MainViewTab/AgentReview/AgentReviewing';
import { studentOverviewTableHeader } from '../../Demo/Utils/contants';

function StudentOverviewTable(props) {
  const { t } = useTranslation();
  const agent_reviewing = props.students.map((student, i) => (
    <AgentReviewing key={i} student={student} />
  ));

  return (
    <Card>
      <TableContainer style={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {studentOverviewTableHeader.map((header, idx) => (
                <TableCell key={idx} align="left">
                  {t(`${header}`, { ns: 'common' })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{agent_reviewing}</TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default StudentOverviewTable;
