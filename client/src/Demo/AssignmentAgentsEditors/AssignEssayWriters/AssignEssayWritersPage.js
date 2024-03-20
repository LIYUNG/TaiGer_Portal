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

import NoWritersEssaysCard from '../../Dashboard/MainViewTab/NoWritersEssaysCard/NoWritersEssaysCard';
import { appConfig } from '../../../config';
import DEMO from '../../../store/constant';

function AssignEssayWritersPage(props) {
  //props = combinedLoader
  const { t } = useTranslation();
  // console.log('essaythread in assign page:', props.essayDocumentThreads)
  // console.log("student in assign page:", props.students)
  const no_writer_essays = props.essayDocumentThreads.map(
    (essayDocumentThread, i) => (
      <NoWritersEssaysCard
        key={i}
        students={props.students}
        submitUpdateEditorlist={props.submitUpdateEditorlist}
        essayDocumentThread={essayDocumentThread}
      />
    )
  );

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
        <Typography color="text.primary">Assign Essay Writers</Typography>
      </Breadcrumbs>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">{t('No Writers Essays')}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{t('Documents')}</TableCell>
              <TableCell>{t('First-, Last Name')}</TableCell>
              <TableCell>{t('Email')}</TableCell>
              <TableCell>{t('Status')}</TableCell>
              <TableCell>{t('Target Year')}</TableCell>
              <TableCell>{t('Agent(s)')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{no_writer_essays}</TableBody>
        </Table>
      </Card>
    </Box>
  );
}

export default AssignEssayWritersPage;
