import React, { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import { Link as LinkDom } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import { useTranslation } from 'react-i18next';

import {
  is_TaiGer_role,
  isProgramNotSelectedEnough,
  is_num_Program_Not_specified,
  is_program_ml_rl_essay_ready,
  is_the_uni_assist_vpd_uploaded,
  isCVFinished,
  application_deadline_calculator,
  is_TaiGer_Student,
  is_TaiGer_Admin,
  isProgramSubmitted,
  isProgramDecided,
  isProgramAdmitted
} from '../Utils/checking-functions';
import OverlayButton from '../../components/Overlay/OverlayButton';
import Banner from '../../components/Banner/Banner';
import {
  IS_SUBMITTED_STATE_OPTIONS,
  getNumberOfDays,
  programstatuslist
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { UpdateStudentApplications, removeProgramFromStudent } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { ImportStudentProgramsCard } from './ImportStudentProgramsCard';
import { StudentPreferenceCard } from './StudentPreferenceCard';

function StudentApplicationsTableTemplate(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [
    studentApplicationsTableTemplateState,
    setStudentApplicationsTableTemplateState
  ] = useState({
    error: '',
    student: props.student,
    applications: props.student.applications,
    isLoaded: true,
    program_ids: [],
    student_id: null,
    program_id: null,
    success: false,
    application_status_changed: false,
    applying_program_count: props.student.applying_program_count,
    modalDeleteApplication: false,
    modalUpdatedApplication: false,
    showProgramCorrectnessReminderModal: true,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });

  const handleChangeProgramCount = (e) => {
    e.preventDefault();
    let applying_program_count = e.target.value;
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      application_status_changed: true,
      applying_program_count
    }));
  };

  const handleChange = (e, application_idx) => {
    e.preventDefault();
    let applications_temp = [
      ...studentApplicationsTableTemplateState.student.applications
    ];
    applications_temp[application_idx][e.target.name] = e.target.value;
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      application_status_changed: true,
      applications: applications_temp
    }));
  };

  const handleDelete = (e, program_id, student_id) => {
    e.preventDefault();
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      student_id,
      program_id,
      modalDeleteApplication: true
    }));
  };

  const onHideModalDeleteApplication = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      modalDeleteApplication: false
    }));
  };
  const onHideUpdatedApplicationWindow = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      modalUpdatedApplication: false
    }));
  };

  const handleDeleteConfirm = (e) => {
    e.preventDefault();
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    removeProgramFromStudent(
      studentApplicationsTableTemplateState.program_id,
      studentApplicationsTableTemplateState.student_id
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isLoaded: true,
            student: {
              ...prevState.student,
              applications: data
            },
            success: success,
            modalDeleteApplication: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setStudentApplicationsTableTemplateState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const handleSubmit = (e, student_id) => {
    e.preventDefault();
    let applications_temp = [
      ...studentApplicationsTableTemplateState.student.applications
    ];
    let applying_program_count =
      studentApplicationsTableTemplateState.applying_program_count;
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    UpdateStudentApplications(
      student_id,
      applications_temp,
      applying_program_count
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isLoaded: true,
            student: data,
            success: success,
            application_status_changed: false,
            modalUpdatedApplication: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setStudentApplicationsTableTemplateState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const onClickProgramAssignHandler = () => {
    navigate(
      `/student-applications/edit/${studentApplicationsTableTemplateState.student._id.toString()}`
    );
  };

  const closeProgramCorrectnessModal = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      showProgramCorrectnessReminderModal: false
    }));
  };
  const ConfirmError = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const {
    res_status,
    isLoaded,
    res_modal_status,
    res_modal_message,
    showProgramCorrectnessReminderModal
  } = studentApplicationsTableTemplateState;

  if (!isLoaded && !studentApplicationsTableTemplateState.student) {
    return <Loading />;
  }
  TabTitle(
    `Student ${studentApplicationsTableTemplateState.student.firstname} ${studentApplicationsTableTemplateState.student.lastname} || Applications Status`
  );
  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  var applying_university_info;
  var today = new Date();
  if (
    studentApplicationsTableTemplateState.student.applications === undefined ||
    studentApplicationsTableTemplateState.student.applications.length === 0
  ) {
    applying_university_info = (
      <TableRow>
        {!is_TaiGer_Student(user) && <TableCell></TableCell>}
        <TableCell>
          <Typography>No University</Typography>
        </TableCell>
        <TableCell>
          <Typography>No Program</Typography>
        </TableCell>
        <TableCell>
          <Typography>No Date</Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
        <TableCell>
          <Typography> - </Typography>
        </TableCell>
      </TableRow>
    );
  } else {
    applying_university_info =
      studentApplicationsTableTemplateState.student.applications.map(
        (application, application_idx) => (
          <TableRow key={application_idx}>
            {!is_TaiGer_Student(user) && (
              <TableCell>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={(e) =>
                    handleDelete(
                      e,
                      application.programId._id,
                      studentApplicationsTableTemplateState.student._id
                    )
                  }
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </TableCell>
            )}
            <TableCell>
              <Typography>
                <Link
                  to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                  component={LinkDom}
                  style={{ textDecoration: 'none' }}
                >
                  {application.programId.school}
                </Link>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>
                <Link
                  to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                  component={LinkDom}
                  style={{ textDecoration: 'none' }}
                >
                  {application.programId.degree}
                </Link>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>
                <Link
                  to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                  component={LinkDom}
                  style={{ textDecoration: 'none' }}
                >
                  {application.programId.program_name}
                </Link>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>
                <Link
                  to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                  component={LinkDom}
                  style={{ textDecoration: 'none' }}
                >
                  {application.programId.semester}
                </Link>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>
                <Link
                  to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                  component={LinkDom}
                  style={{ textDecoration: 'none' }}
                >
                  {application.programId.toefl
                    ? application.programId.toefl
                    : '-'}
                </Link>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography>
                <Link
                  to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                  component={LinkDom}
                  style={{ textDecoration: 'none' }}
                >
                  {application.programId.ielts
                    ? application.programId.ielts
                    : '-'}
                </Link>
              </Typography>
            </TableCell>
            <TableCell>
              {isProgramSubmitted(application) ? (
                <Typography>{t('Close', { ns: 'common' })}</Typography>
              ) : (
                <Typography>
                  {application_deadline_calculator(props.student, application)}
                </Typography>
              )}
            </TableCell>
            <TableCell>
              <FormControl fullWidth>
                <Select
                  size="small"
                  labelId="decided"
                  name="decided"
                  id="decided"
                  onChange={(e) => handleChange(e, application_idx)}
                  disabled={application.closed !== '-'}
                  value={application.decided}
                >
                  <MenuItem value={'-'}>-</MenuItem>
                  <MenuItem value={'X'}>{t('No', { ns: 'common' })}</MenuItem>
                  <MenuItem value={'O'}>{t('Yes', { ns: 'common' })}</MenuItem>
                </Select>
              </FormControl>
            </TableCell>
            {isProgramDecided(application) ? (
              <TableCell>
                {/* When all thread finished */}
                {isProgramSubmitted(application) ||
                (is_program_ml_rl_essay_ready(application) &&
                  isCVFinished(studentApplicationsTableTemplateState.student) &&
                  (!appConfig.vpdEnable ||
                    is_the_uni_assist_vpd_uploaded(application))) ? (
                  <FormControl fullWidth>
                    <Select
                      size="small"
                      labelId="closed"
                      name="closed"
                      id="closed"
                      value={application.closed}
                      onChange={(e) => handleChange(e, application_idx)}
                      disabled={application.admission !== '-'}
                    >
                      <MenuItem value="-">
                        {t('Not Yet', { ns: 'common' })}
                      </MenuItem>
                      <MenuItem value="X">
                        {t('Withdraw', { ns: 'common' })}
                      </MenuItem>
                      <MenuItem value="O">
                        {t('Submitted', { ns: 'common' })}
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <OverlayButton
                    text={`Please make sure ${
                      !isCVFinished(
                        studentApplicationsTableTemplateState.student
                      )
                        ? 'CV '
                        : ''
                    }${
                      !is_program_ml_rl_essay_ready(application)
                        ? 'ML/RL/Essay '
                        : ''
                    }${
                      !is_the_uni_assist_vpd_uploaded(application)
                        ? 'Uni-Assist '
                        : ''
                    }are prepared to unlock this.`}
                  />
                )}
              </TableCell>
            ) : (
              <TableCell>-</TableCell>
            )}
            {isProgramDecided(application) &&
            isProgramSubmitted(application) ? (
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    labelId="admission"
                    name="admission"
                    id="admission"
                    disabled={
                      !(
                        application.closed !== '-' && application.closed !== 'X'
                      ) ||
                      (application.finalEnrolment ?? false)
                    }
                    defaultValue={application.admission ?? '-'}
                    onChange={(e) => handleChange(e, application_idx)}
                  >
                    {IS_SUBMITTED_STATE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {t(option.label, { ns: 'common' })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            ) : (
              <TableCell>-</TableCell>
            )}
            {isProgramDecided(application) &&
            isProgramSubmitted(application) &&
            isProgramAdmitted(application) ? (
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    size="small"
                    labelId="finalEnrolment"
                    name="finalEnrolment"
                    id="finalEnrolment"
                    defaultValue={application.finalEnrolment ?? false}
                    onChange={(e) => handleChange(e, application_idx)}
                  >
                    <MenuItem value={false}>
                      {t('No', { ns: 'common' })}
                    </MenuItem>
                    <MenuItem value={true}>
                      {t('Yes', { ns: 'common' })}
                    </MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            ) : (
              <TableCell>-</TableCell>
            )}
            <TableCell>
              <Typography>
                {isProgramSubmitted(application)
                  ? '-'
                  : application.programId.application_deadline
                  ? getNumberOfDays(
                      today,
                      application_deadline_calculator(
                        props.student,
                        application
                      )
                    )
                  : '-'}
              </Typography>
            </TableCell>
          </TableRow>
        )
      );
  }
  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      {is_TaiGer_Student(user) && (
        <Dialog open={showProgramCorrectnessReminderModal}>
          <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}{' '}
              {`若發現 ${appConfig.companyName} Portal 資訊和學校官方網站資料有不同之處，請和顧問討論。`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={closeProgramCorrectnessModal}
            >
              {t('Accept', { ns: 'common' })}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        {is_TaiGer_role(user) && (
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              props.student._id.toString(),
              DEMO.PROFILE_HASH
            )}`}
          >
            {props.student.firstname} {props.student.lastname}
          </Link>
        )}
        <Typography color="text.primary">
          {t('Applications', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} md={is_TaiGer_role(user) ? 6 : 12}>
          <StudentPreferenceCard student={props.student} />
        </Grid>
        {is_TaiGer_role(user) && (
          <Grid item xs={12} md={6}>
            <ImportStudentProgramsCard student={props.student} />
          </Grid>
        )}
      </Grid>
      <>
        {isProgramNotSelectedEnough([
          studentApplicationsTableTemplateState.student
        ]) && (
          <Card>
            {props.student.firstname} {props.student.lastname} did not choose
            enough programs.
          </Card>
        )}
        {is_TaiGer_Admin(user) &&
          is_num_Program_Not_specified(
            studentApplicationsTableTemplateState.student
          ) && (
            <Card>
              The number of student&apos;s applications is not specified! Please
              determine the number of the programs according to the contract
            </Card>
          )}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6">
              {t('Applying Program Count', { ns: 'common' })}:{' '}
            </Typography>
          </Grid>
          {is_TaiGer_Admin(user) ? (
            <Grid item xs={2}>
              <FormControl fullWidth>
                <Select
                  size="small"
                  id="applying_program_count"
                  name="applying_program_count"
                  value={
                    studentApplicationsTableTemplateState.applying_program_count
                  }
                  onChange={(e) => handleChangeProgramCount(e)}
                >
                  <MenuItem value="0">Please Select</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                  <MenuItem value="8">8</MenuItem>
                  <MenuItem value="9">9</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          ) : (
            <>
              <Grid item xs={2}>
                <Typography variant="h6">
                  {
                    studentApplicationsTableTemplateState.student
                      .applying_program_count
                  }
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
        <Box>
          <Card>
            <Box>
              <Banner
                ReadOnlyMode={true}
                bg={'primary'}
                to={`${DEMO.BASE_DOCUMENTS_LINK}`}
                title={'info'}
                text={`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}
                link_name={''}
                removeBanner={<></>}
                notification_key={undefined}
              />
              <Banner
                ReadOnlyMode={true}
                bg={'secondary'}
                to={`${DEMO.BASE_DOCUMENTS_LINK}`}
                title={'warning'}
                text={'請選擇要申請的學程打在 Decided: Yes，不要申請打的 No。'}
                link_name={''}
                removeBanner={<></>}
                notification_key={undefined}
              />
              <Banner
                ReadOnlyMode={true}
                bg={'danger'}
                to={`${DEMO.BASE_DOCUMENTS_LINK}`}
                title={'warning'}
                text={
                  '請選擇要申請的學程打在 Submitted: Submitted，若想中斷申請請告知顧問，或是 選擇 Withdraw (如果東西都已準備好且解鎖)'
                }
                link_name={''}
                removeBanner={<></>}
                notification_key={undefined}
              />
              <TableContainer style={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {!is_TaiGer_Student(user) && <TableCell>-</TableCell>}
                      {programstatuslist.map((doc, index) => (
                        <TableCell key={index}>
                          <Typography>
                            {t(doc.name, { ns: 'common' })}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>{applying_university_info}</TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Card>
          <Box>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              disabled={
                !studentApplicationsTableTemplateState.application_status_changed ||
                !studentApplicationsTableTemplateState.isLoaded
              }
              onClick={(e) =>
                handleSubmit(
                  e,
                  studentApplicationsTableTemplateState.student._id
                )
              }
              sx={{ mt: 2 }}
            >
              {studentApplicationsTableTemplateState.isLoaded ? (
                t('Update', { ns: 'common' })
              ) : (
                <CircularProgress size={16} />
              )}
            </Button>
          </Box>
          {is_TaiGer_role(user) && (
            <>
              <Box>
                <Typography>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    You want to add more programs to {props.student.firstname}{' '}
                    {props.student.lastname}?
                  </span>
                </Typography>
              </Box>
              <Box>
                <Typography>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={onClickProgramAssignHandler}
                    >
                      {t('Add New Program')}
                    </Button>{' '}
                  </span>
                </Typography>
              </Box>
            </>
          )}
          <Dialog
            open={studentApplicationsTableTemplateState.modalDeleteApplication}
            onClose={onHideModalDeleteApplication}
            size="small"
            aria-labelledby="contained-modal-title-vcenter"
          >
            <DialogTitle>
              {t('Warning', { ns: 'common' })}:{' '}
              {t('Delete an application', { ns: 'common' })}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                This will delete all message and editted files in discussion.
                Are you sure?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="contained"
                disabled={!studentApplicationsTableTemplateState.isLoaded}
                onClick={handleDeleteConfirm}
              >
                {t('Yes', { ns: 'common' })}
              </Button>
              <Button onClick={onHideModalDeleteApplication} variant="outlined">
                {t('Close', { ns: 'common' })}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={studentApplicationsTableTemplateState.modalUpdatedApplication}
            onClose={onHideUpdatedApplicationWindow}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <DialogTitle>Info:</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t('Applications status updated successfully!', {
                  ns: 'common'
                })}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                variant="outlined"
                onClick={onHideUpdatedApplicationWindow}
              >
                {t('Close', { ns: 'common' })}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </>
    </Box>
  );
}

export default StudentApplicationsTableTemplate;
