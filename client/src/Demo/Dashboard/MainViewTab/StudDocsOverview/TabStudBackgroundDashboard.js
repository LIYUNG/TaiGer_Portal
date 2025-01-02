import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

import { academic_background_header } from '../../../../utils/contants';
import { useTranslation } from 'react-i18next';
import StudentsAgentEditor from '../StudentsAgentEditor/StudentsAgentEditor';

function TabStudBackgroundDashboard(props) {
  const { t } = useTranslation();
  const stdlist = (
    <TableBody>
      {props.students.map((student, i) => (
        <StudentsAgentEditor
          key={i}
          student={student}
          updateStudentArchivStatus={props.updateStudentArchivStatus}
          submitUpdateAgentlist={props.submitUpdateAgentlist}
          submitUpdateEditorlist={props.submitUpdateEditorlist}
          submitUpdateAttributeslist={props.submitUpdateAttributeslist}
        />
      ))}
    </TableBody>
  );
  let header = Object.values(academic_background_header);
  return (
    <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {header.map((name, index) => (
              <TableCell key={index} align="left">
                {t(`${name}`, { ns: 'common' })}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {stdlist}
      </Table>
    </TableContainer>
  );
}

export default TabStudBackgroundDashboard;
