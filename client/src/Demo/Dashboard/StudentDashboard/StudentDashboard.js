import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import EventIcon from '@mui/icons-material/Event';
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Link,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import Banner from '../../../components/Banner/Banner';
import RespondedThreads from '../MainViewTab/RespondedThreads/RespondedThreads';
import StudentTasksResponsive from '../MainViewTab/StudentTasks/StudentTasksResponsive';
import {
  check_academic_background_filled,
  check_applications_to_decided,
  is_all_uni_assist_vpd_uploaded,
  are_base_documents_missing,
  isBaseDocumentsRejected,
  needGraduatedApplicantsButStudentNotGraduated,
  needGraduatedApplicantsPrograms
} from '../../Utils/checking-functions';
import ErrorPage from '../../Utils/ErrorPage';

import { updateBanner } from '../../../api';
import DEMO from '../../../store/constant';
import ApplicationProgressCard from '../../../components/ApplicationProgressCard/ApplicationProgressCard';
import { appConfig } from '../../../config';

function StudentDashboard(props) {
  const { t } = useTranslation();
  const [studentDashboardState, setStudentDashboardState] = useState({
    error: '',
    student: props.student,
    itemheight: 20,
    data: [],
    res_status: 0
  });

  const removeBanner = (e, notification_key) => {
    e.preventDefault();
    const temp_student = studentDashboardState.student;
    temp_student.notification[`${notification_key}`] = true;
    setStudentDashboardState({ student: temp_student });
    updateBanner(notification_key).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentDashboardState({
            ...studentDashboardState,
            success: success,
            res_status: status
          });
        } else {
          setStudentDashboardState({
            ...studentDashboardState,
            res_status: status
          });
        }
      },
      (error) => {
        setStudentDashboardState({
          ...studentDashboardState,
          error,
          res_status: 500
        });
      }
    );
  };

  const { res_status } = studentDashboardState;

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const hasUpcomingAppointment = false;
  const read_thread = (
    <RespondedThreads student={studentDashboardState.student} />
  );

  const student_tasks = (
    <StudentTasksResponsive
      student={studentDashboardState.student}
      isCoursesFilled={props.isCoursesFilled}
    />
  );
  const student = studentDashboardState.student;

  return (
    <>
      {student.archiv && (
        <Card sx={{ p: 2 }}>
          <Typography variant="h5" color="red">
            Status: <b>Close</b> - Your {appConfig.companyName} Portal Service
            is terminated.
          </Typography>
          <Typography variant="body1" color="red">
            {t('acctount_deactivated_text', { ns: 'dashboard' })}
          </Typography>
        </Card>
      )}
      <Alert severity="info">{t('announcement', { ns: 'common' })}</Alert>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        {student.notification &&
          !student.notification.isRead_survey_not_complete &&
          !check_academic_background_filled(student.academic_background) && (
            <Grid item xs={12}>
              <Banner
                bg={'danger'}
                title={'warning'}
                path={`${DEMO.SURVEY_LINK}`}
                text={t('It looks like you did not finish survey. See', {
                  ns: 'common'
                })}
                link_name={
                  <>
                    {t('Survey')}
                    <LaunchIcon fontSize="small" />
                  </>
                }
                removeBanner={removeBanner}
                notification_key={'isRead_survey_not_complete'}
              />
            </Grid>
          )}

        {student.notification &&
          !student.notification.isRead_uni_assist_task_assigned &&
          appConfig.vpdEnable &&
          !is_all_uni_assist_vpd_uploaded(student) && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'danger'}
                title={'warning'}
                path={`${DEMO.UNI_ASSIST_LINK}`}
                text={'Please go to Uni-Assist to apply or to get VPD'}
                link_name={
                  <>
                    Uni-Assist
                    <LaunchIcon fontSize="small" />
                  </>
                }
                removeBanner={removeBanner}
                notification_key={'isRead_uni_assist_task_assigned'}
              />
            </Grid>
          )}
        {/* new agents assigned banner */}
        {student.notification &&
          !student.notification.isRead_new_agent_assigned && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'primary'}
                title={'info'}
                path={`${DEMO.UNI_ASSIST_LINK}`}
                text={`${t('New agent is assigned to you')}`}
                link_name={''}
                removeBanner={removeBanner}
                notification_key={'isRead_new_agent_assigned'}
              />
            </Grid>
          )}
        {/* new editors assigned banner */}
        {student.notification &&
          !student.notification.isRead_new_editor_assigned && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'primary'}
                title={'info'}
                path={`${DEMO.UNI_ASSIST_LINK}`}
                text={t('New editor is assigned to you.', { ns: 'common' })}
                link_name={''}
                removeBanner={removeBanner}
                notification_key={'isRead_new_editor_assigned'}
              />
            </Grid>
          )}
        {/* new CV ML RL Essay message */}
        {student.notification &&
          !student.notification.isRead_new_cvmlrl_messsage && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'danger'}
                title={'warning'}
                path={`${DEMO.CV_ML_RL_CENTER_LINK}`}
                text={`${t('New feedback from your Editor')}. See `}
                link_name={
                  <>
                    CV/ML/RL Center
                    <LaunchIcon fontSize="small" />
                  </>
                }
                removeBanner={removeBanner}
                notification_key={'isRead_new_cvmlrl_messsage'}
              />
            </Grid>
          )}
        {/* TODO: check function : new cv ml rl tasks are asigned to you */}
        {student.notification &&
          !student.notification.isRead_new_cvmlrl_tasks_created && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'danger'}
                title={'warning'}
                path={`${DEMO.CV_ML_RL_CENTER_LINK}`}
                text={`${t('New tasks are assigned to you')}. See `}
                link_name={
                  <Typography variant="body2" sx={{ display: 'flex' }}>
                    CV/ML/RL Center
                    <LaunchIcon fontSize="small" />
                  </Typography>
                }
                removeBanner={removeBanner}
                notification_key={'isRead_new_cvmlrl_tasks_created'}
              />
            </Grid>
          )}
        {student.notification &&
          !student.notification.isRead_new_programs_assigned &&
          !check_applications_to_decided(student) && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'danger'}
                title={'warning'}
                path={`${DEMO.STUDENT_APPLICATIONS_LINK}`}
                text={`${t('It looks like you did not decide programs')} `}
                link_name={
                  <Typography>
                    {t('Application Overview', { ns: 'common' })}
                    <LaunchIcon fontSize="small" />
                  </Typography>
                }
                removeBanner={removeBanner}
                notification_key={'isRead_new_programs_assigned'}
              />
            </Grid>
          )}
        {student.notification &&
          !student.notification.isRead_base_documents_missing &&
          are_base_documents_missing(student) && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'danger'}
                title={'warning'}
                path={`${DEMO.BASE_DOCUMENTS_LINK}`}
                text={`${t('Some of Base Documents are still missing')}`}
                link_name={
                  <>
                    Base Documents
                    <LaunchIcon fontSize="small" />
                  </>
                }
                removeBanner={removeBanner}
                notification_key={'isRead_base_documents_missing'}
              />
            </Grid>
          )}
        {student.notification &&
          !student.notification.isRead_base_documents_rejected &&
          isBaseDocumentsRejected(student) && (
            <Grid item xs={12}>
              <Banner
                ReadOnlyMode={props.ReadOnlyMode}
                bg={'danger'}
                title={'warning'}
                path={`${DEMO.BASE_DOCUMENTS_LINK}`}
                text={`${t('Some of Base Documents are rejected')} `}
                link_name={
                  <>
                    Base Documents
                    <LaunchIcon fontSize="small" />
                  </>
                }
                removeBanner={removeBanner}
                notification_key={'isRead_base_documents_rejected'}
              />
            </Grid>
          )}
        <Grid item xs={12} md={12}>
          {needGraduatedApplicantsButStudentNotGraduated(student) && (
            <Card sx={{ border: '4px solid red' }}>
              <Alert severity="warning">
                {t('Programs below are only for graduated applicants', {
                  ns: 'common'
                })}
                &nbsp;:&nbsp;
              </Alert>
              {needGraduatedApplicantsPrograms(student.applications)?.map(
                (app) => (
                  <ListItem key={app.programId._id.toString()}>
                    <Link
                      to={DEMO.SINGLE_PROGRAM_LINK(
                        app.programId._id.toString()
                      )}
                      component={LinkDom}
                      target="_blank"
                    >
                      {app.programId.school} {app.programId.program_name}{' '}
                      {app.programId.degree} {app.programId.semester}
                    </Link>
                  </ListItem>
                )
              )}
            </Card>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Card style={{ border: '4px solid red' }}>
            <Alert severity="warning">
              {t('To Do Tasks', { ns: 'common' })} &nbsp;:&nbsp;
              {t('Please finish it as soon as possible')}
            </Alert>
            <TableContainer style={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Tasks', { ns: 'common' })}</TableCell>
                    <TableCell>{t('Description', { ns: 'common' })}</TableCell>
                    <TableCell>{t('Last update', { ns: 'common' })}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{student_tasks}</TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box>
            {appConfig.meetingEnable && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography sx={{ display: 'flex' }}>
                          <EventIcon /> 時段預約
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        {hasUpcomingAppointment ? (
                          <></>
                        ) : (
                          <Typography>
                            想要一次密集討論？ 可以預訂顧問 Office hour
                            時段討論。
                            <Link
                              color="inherit"
                              component={LinkDom}
                              to={
                                'https://taigerconsultancy-portal.com/docs/search/64fe21bcbc729bc024d14738'
                              }
                              target="_blank"
                            >
                              {t('Instructions')}
                              <IconButton>
                                <LaunchIcon fontSize="small" />
                              </IconButton>
                            </Link>
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        {student?.agents?.length !== 0 ? (
                          <Link
                            underline="hover"
                            color="inherit"
                            component={LinkDom}
                            to={`${DEMO.EVENT_STUDENT_STUDENTID_LINK(
                              student._id.toString()
                            )}`}
                          >
                            <Button
                              fullWidth
                              size="small"
                              color="primary"
                              variant="contained"
                            >
                              預約
                            </Button>
                          </Link>
                        ) : (
                          <span className="text-light">
                            {t('Wait for Agent', { ns: 'common' })}
                          </span>
                        )}
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          sx={{ marginLeft: 2, marginTop: 1 }}
                        >
                          Pending: 等待 Editor 回復
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                {t('Documents', { ns: 'common' })}
                              </TableCell>
                              <TableCell>
                                {t('Last update', { ns: 'common' })}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>{read_thread}</TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        {student.applications
          ?.filter((app) => app.decided === 'O')
          .map((application, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
              <ApplicationProgressCard
                student={student}
                application={application}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default StudentDashboard;
