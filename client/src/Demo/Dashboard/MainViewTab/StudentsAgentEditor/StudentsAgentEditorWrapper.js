import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

import StudentsAgentEditor from './StudentsAgentEditor';
import { academic_background_header } from '../../../Utils/contants';
import { useAuth } from '../../../../components/AuthProvider';
import { is_TaiGer_Admin } from '../../../Utils/checking-functions';
import { useTranslation } from 'react-i18next';

function StudentsAgentEditorWrapper(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const students_agent_editor = (
    is_TaiGer_Admin(user)
      ? props.students.sort((a, b) =>
          a.agents.length === 0 && a.agents.length < b.agents.length
            ? -2
            : a.editors.length < b.editors.length
            ? -1
            : 1
        )
      : props.students
  ).map((student, i) => (
    <StudentsAgentEditor
      key={i}
      student={student}
      updateStudentArchivStatus={props.updateStudentArchivStatus}
      submitUpdateAgentlist={props.submitUpdateAgentlist}
      submitUpdateEditorlist={props.submitUpdateEditorlist}
      isDashboard={props.isDashboard}
    />
  ));
  let header = Object.values(academic_background_header);

  return (
    <TableContainer style={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              First-, Last Name | 姓名 <br /> Email
            </TableCell>
            <TableCell>{t('Agents')}</TableCell>
            <TableCell>{t('Editors')}</TableCell>
            <TableCell>{t('Year')}</TableCell>
            <TableCell>{t('Semester')}</TableCell>
            <TableCell>{t('Degree')}</TableCell>
            {header.map((name, index) => (
              <TableCell key={index}>{t(`${name}`)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{students_agent_editor}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default StudentsAgentEditorWrapper;
