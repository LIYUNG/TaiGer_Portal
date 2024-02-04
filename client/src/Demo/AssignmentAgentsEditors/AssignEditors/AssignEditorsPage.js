import React from 'react';
import {
  Box,
  Breadcrumbs,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NoEditorsStudentsCard from '../../Dashboard/MainViewTab/NoEditorsStudentsCard/NoEditorsStudentsCard';
import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';

function AssignEditorsPage(props) {
  const { t } = useTranslation();
  const no_editor_students = props.students.map((student, i) => (
    <NoEditorsStudentsCard
      key={i}
      student={student}
      submitUpdateEditorlist={props.submitUpdateEditorlist}
    />
  ));

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">Assign Editors</Typography>
      </Breadcrumbs>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">{t('No Editors Students')}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>First-, Last Name</TableCell>
              <TableCell>{t('Email')}</TableCell>
              <TableCell>{t('Status')}</TableCell>
              <TableCell>{t('Target Year<')}</TableCell>
              <TableCell>{t('Agent(s)')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{no_editor_students}</TableBody>
        </Table>
      </Card>
    </Box>
  );
}

export default AssignEditorsPage;
