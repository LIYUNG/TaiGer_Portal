import React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {
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
import StudentOverviewTable from '../../../components/StudentOverviewTable';
import StudentsAgentEditorWrapper from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditorWrapper';

function AdminMainView(props) {
  const { t } = useTranslation();
  const admin_tasks = <AdminTasks students={props.students} essayDocumentThreads={props.essayDocumentThreads}/>;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Typography variant="h6" sx={{ px: 2 }}>
              <ReportProblemIcon /> Admin {t('To Do Tasks')}:
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Tasks')}</TableCell>
                  <TableCell>{t('Description')}</TableCell>
                  <TableCell>{t('Last Update')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{admin_tasks}</TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <StudentOverviewTable
            students={props.students}
            title="Student Overview"
          />
        </Grid>
        <Grid item xs={12}>
          <StudentsAgentEditorWrapper
            students={props.students}
            updateStudentArchivStatus={props.updateStudentArchivStatus}
            submitUpdateAgentlist={props.submitUpdateAgentlist}
            submitUpdateEditorlist={props.submitUpdateEditorlist}
            isDashboard={props.isDashboard}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default AdminMainView;
