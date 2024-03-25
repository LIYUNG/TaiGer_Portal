import React, { Fragment, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { BsX } from 'react-icons/bs';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Alert,
  Typography,
  Box
} from '@mui/material';

import { updateAgentBanner } from '../../../api';
import { appConfig } from '../../../config';
import {
  isAnyCVNotAssigned,
  isProgramDecided,
  is_any_base_documents_uploaded,
  is_any_programs_ready_to_submit,
  is_any_vpd_missing,
  programs_refactor,
  progressBarCounter
} from '../../Utils/checking-functions';
import DEMO from '../../../store/constant';
import ApplicationProgressCardBody from '../../../components/ApplicationProgressCard/ApplicationProgressCardBody';
import ProgramReportCard from '../../Program/ProgramReportCard';
import CVAssignTasksCard from '../MainViewTab/AgentTasks/CVAssignTasksCard';
import ReadyToSubmitTasksCard from '../MainViewTab/AgentTasks/ReadyToSubmitTasksCard';
import NoEnoughDecidedProgramsTasksCard from '../MainViewTab/AgentTasks/NoEnoughDecidedProgramsTasksCard';
import VPDToSubmitTasksCard from '../MainViewTab/AgentTasks/VPDToSubmitTasksCard';
import { useAuth } from '../../../components/AuthProvider';
import StudentsAgentEditorWrapper from '../MainViewTab/StudentsAgentEditor/StudentsAgentEditorWrapper';
import NoProgramStudentTable from '../MainViewTab/AgentTasks/NoProgramStudentTable';
import BaseDocumentCheckingTable from '../MainViewTab/AgentTasks/BaseDocumentCheckingTable';
import ProgramSpecificDocumentCheckCard from '../MainViewTab/AgentTasks/ProgramSpecificDocumentCheckCard';

function AgentMainView(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [agentMainViewState, setAgentMainViewState] = useState({
    error: '',
    notification: props.notification,
    collapsedRows: {}
  });

  const removeAgentBanner = (e, notification_key, student_id) => {
    e.preventDefault();
    const temp_user = { ...user };
    const idx = temp_user.agent_notification[`${notification_key}`].findIndex(
      (student_obj) => student_obj.student_id === student_id
    );
    temp_user.agent_notification[`${notification_key}`].splice(idx, 1);

    setAgentMainViewState({ ...agentMainViewState, user: temp_user });

    updateAgentBanner(notification_key, student_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setAgentMainViewState({
            ...agentMainViewState,
            success: success,
            res_status: status
          });
        } else {
          setAgentMainViewState({
            ...agentMainViewState,
            res_status: status
          });
        }
      },
      (error) => {
        setAgentMainViewState({
          ...agentMainViewState,
          error,
          res_status: 500
        });
      }
    );
  };

  const handleCollapse = (index) => {
    setAgentMainViewState({
      ...agentMainViewState,
      collapsedRows: {
        ...agentMainViewState.collapsedRows,
        [index]: !agentMainViewState.collapsedRows[index]
      }
    });
  };

  const applications_arr = programs_refactor(props.students)
    .filter(
      (application) =>
        isProgramDecided(application) &&
        application.closed === '-' &&
        application.program_name !== 'No Program'
    )
    .sort((a, b) => (a.application_deadline > b.application_deadline ? 1 : -1));

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          {agentMainViewState.notification?.isRead_new_base_docs_uploaded?.map(
            (student, i) => (
              <Card key={i} sx={{ mb: 2 }}>
                <Typography style={{ textAlign: 'left' }}>
                  <ReportProblemIcon size={18} />
                  <b className="mx-2">Reminder:</b> There are new base documents
                  uploaded by{' '}
                  <b>
                    {student.student_firstname} {student.student_lastname}
                  </b>{' '}
                  <Link
                    underline="hover"
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                      student.student_id,
                      DEMO.PROFILE_HASH
                    )}`}
                    component={LinkDom}
                  >
                    Base Document
                  </Link>{' '}
                  <span style={{ float: 'right', cursor: 'pointer' }}>
                    <BsX
                      size={18}
                      onClick={(e) =>
                        removeAgentBanner(
                          e,
                          'isRead_new_base_docs_uploaded',
                          student.student_id
                        )
                      }
                    />
                  </span>
                </Typography>
              </Card>
            )
          )}
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <Alert severity="error">
              <Typography>
                {' '}
                {t('Upcoming Applications', { ns: 'dashboard' })} (Decided):
              </Typography>
            </Alert>
            <div className="card-scrollable-body">
              <Table size="small">
                <TableBody>
                  {applications_arr.map((application, idx) => (
                    <Fragment key={idx}>
                      <TableRow
                        className="text-black"
                        onClick={() => handleCollapse(idx)}
                      >
                        <TableCell>
                          <Link
                            underline="hover"
                            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                              application.student_id,
                              DEMO.PROFILE_HASH
                            )}`}
                            component={LinkDom}
                          >
                            <b>{application.firstname_lastname} </b>
                          </Link>
                        </TableCell>
                        <TableCell>
                          {application.application_deadline}
                        </TableCell>
                        <TableCell>{application.school}</TableCell>
                        <TableCell>
                          {progressBarCounter(
                            application.student,
                            application.application
                          )}
                          %
                        </TableCell>
                        <TableCell>{application.program_name}</TableCell>
                      </TableRow>
                      {agentMainViewState.collapsedRows[idx] && (
                        <TableRow>
                          <TableCell colSpan="12">
                            <ApplicationProgressCardBody
                              student={application.student}
                              application={application.application}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <ProgramReportCard />
        </Grid>
        {is_any_programs_ready_to_submit(
          props.students.filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
          )
        ) && (
          <Grid item sm={12} md={6}>
            <ReadyToSubmitTasksCard students={props.students} user={user} />
          </Grid>
        )}
        {appConfig.vpdEnable &&
          is_any_vpd_missing(
            props.students.filter((student) =>
              student.agents.some((agent) => agent._id === user._id.toString())
            )
          ) && (
            <Grid item xs={12} sm={6}>
              <VPDToSubmitTasksCard students={props.students} user={user} />
            </Grid>
          )}
        {is_any_base_documents_uploaded(
          props.students.filter((student) =>
            student.agents.some((agent) => agent._id === user._id.toString())
          )
        ) && (
          <Grid item xs={12} sm={6}>
            <BaseDocumentCheckingTable students={props.students} />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          {isAnyCVNotAssigned(
            props.students.filter((student) =>
              student.agents.some((agent) => agent._id === user._id.toString())
            )
          ) && <CVAssignTasksCard students={props.students} user={user} />}
        </Grid>
        <Grid item xs={12} sm={6}>
          <NoProgramStudentTable students={props.students} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProgramSpecificDocumentCheckCard students={props.students} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <NoEnoughDecidedProgramsTasksCard
            students={props.students}
            user={user}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <StudentsAgentEditorWrapper
              students={props.students}
              documentslist={props.documentslist}
              submitUpdateAgentlist={props.submitUpdateAgentlist}
              submitUpdateAttributeslist={props.submitUpdateAttributeslist}
              isDashboard={props.isDashboard}
              updateStudentArchivStatus={props.updateStudentArchivStatus}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AgentMainView;
