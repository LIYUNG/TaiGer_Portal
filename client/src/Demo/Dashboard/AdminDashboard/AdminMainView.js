import React from 'react';
// import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {
  Alert,
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import AdminTasks from '../MainViewTab/AdminTasks/index';
import StudentsAgentEditorWrapper from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditorWrapper';

function AdminMainView(props) {
  const { t } = useTranslation();
  const admin_tasks = (
    <AdminTasks
      students={props.students}
      essayDocumentThreads={props.essayDocumentThreads}
    />
  );

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h6">
              <Alert severity="warning">
                Admin {t('To Do Tasks', { ns: 'common' })}:
              </Alert>
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Tasks', { ns: 'common' })}</TableCell>
                  <TableCell>{t('Description', { ns: 'common' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{admin_tasks}</TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography>Comming soon</Typography>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <StudentsAgentEditorWrapper
            students={props.students}
            updateStudentArchivStatus={props.updateStudentArchivStatus}
            submitUpdateAgentlist={props.submitUpdateAgentlist}
            submitUpdateEditorlist={props.submitUpdateEditorlist}
            submitUpdateAttributeslist={props.submitUpdateAttributeslist}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default AdminMainView;
