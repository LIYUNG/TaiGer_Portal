import React from 'react';
import { BsExclamationTriangle } from 'react-icons/bs';
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

import AdminTasks from '../MainViewTab/AdminTasks/index';
import StudentOverviewTable from '../../../components/StudentOverviewTable';
import StudentsAgentEditorWrapper from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditorWrapper';

function AdminMainView(props) {
  const admin_tasks = <AdminTasks students={props.students} />;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <Typography variant="h6">
              <BsExclamationTriangle size={18} /> Admin To Do Tasks:
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tasks</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Last Update</TableCell>
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
