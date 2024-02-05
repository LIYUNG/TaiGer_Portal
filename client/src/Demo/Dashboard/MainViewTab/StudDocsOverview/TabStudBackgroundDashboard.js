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

import StudDocsDashboard from './StudDocsDashboard';
import { academic_background_header } from '../../../Utils/contants';
import { useTranslation } from 'react-i18next';

function TabStudBackgroundDashboard(props) {
  const { t } = useTranslation();
  const stdlist = (
    <TableBody>
      {props.students.map((student, i) => (
        <StudDocsDashboard
          key={i}
          student={student}
          updateStudentArchivStatus={props.updateStudentArchivStatus}
          isDashboard={props.isDashboard}
          isArchivPage={props.isArchivPage}
        />
      ))}
    </TableBody>
  );
  let header = Object.values(academic_background_header);
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left">
              First-, Last Name | 姓名 <br /> Email
            </TableCell>
            <TableCell align="left">{t('Agents')}</TableCell>
            <TableCell align="left">{t('Editors')}</TableCell>
            <TableCell align="left">{t('Year')}</TableCell>
            <TableCell align="left">{t('Semester')}</TableCell>
            <TableCell align="left">{t('Degree')}</TableCell>
            {header.map((name, index) => (
              <TableCell key={index} align="left">
                {t(`${name}`)}
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
