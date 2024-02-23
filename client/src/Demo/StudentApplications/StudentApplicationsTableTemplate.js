import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

import { Link as LinkDom } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai';
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
  isProgramDecided
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

import {
  UpdateStudentApplications,
  removeProgramFromStudent,
  getStudentApplications,
  assignProgramToStudent,
  getQueryStudentsResults
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramList from '../Program/ProgramList';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import ModalNew from '../../components/Modal';

function StudentApplicationsTableTemplate(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [
    studentApplicationsTableTemplateState,
    setStudentApplicationsTableTemplateState
  ] = useState({
    error: '',
    student: props.student,
    applications: props.student.applications,
    isLoaded: props.isLoaded,
    importedStudent: '',
    importedStudentPrograms: [],
    importedStudentModalOpen: false,
    isButtonDisable: false,
    isImportingStudentPrograms: false,
    modalShowAssignSuccessWindow: false,
    student_id: null,
    program_id: null,
    success: false,
    application_status_changed: false,
    applying_program_count: props.student.applying_program_count,
    modalDeleteApplication: false,
    modalUpdatedApplication: false,
    showProgramCorrectnessReminderModal: true,
    isProgramAssignMode: false,
    searchContainerRef: useRef(),
    searchResults: [],
    isResultsVisible: false,
    res_status: 0,
    res_modal_status: 0,
    res_modal_message: ''
  });
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (studentApplicationsTableTemplateState.searchTerm) {
        fetchSearchResults();
      } else {
        setStudentApplicationsTableTemplateState((prevState) => ({
          ...prevState,
          searchResults: []
        }));
      }
    }, 300); // Adjust the delay as needed
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearTimeout(delayDebounceFn);
    };
  }, [studentApplicationsTableTemplateState.searchTerm]);

  const handleClickOutside = (event) => {
    // Check if the click target is outside of the search container and result list
    if (
      studentApplicationsTableTemplateState.searchContainerRef.current &&
      !studentApplicationsTableTemplateState.searchContainerRef.current.contains(
        event.target
      )
    ) {
      // Clicked outside, hide the result list
      setStudentApplicationsTableTemplateState((prevState) => ({
        ...prevState,
        isResultsVisible: false
      }));
    }
  };

  const fetchSearchResults = async () => {
    try {
      setStudentApplicationsTableTemplateState((prevState) => ({
        ...prevState,
        isLoading: true
      }));
      const response = await getQueryStudentsResults(
        studentApplicationsTableTemplateState.searchTerm
      );
      if (response.data.success) {
        setStudentApplicationsTableTemplateState((prevState) => ({
          ...prevState,
          searchResults: response.data.data,
          isResultsVisible: true,
          isLoading: false
        }));
      } else {
        setStudentApplicationsTableTemplateState((prevState) => ({
          ...prevState,
          isResultsVisible: false,
          searchTerm: '',
          searchResults: [],
          isErrorTerm: true,
          isLoading: false,
          res_modal_status: 401,
          res_modal_message: 'Session expired. Please refresh.'
        }));
      }
    } catch (error) {
      setStudentApplicationsTableTemplateState((prevState) => ({
        ...prevState,
        isResultsVisible: false,
        searchTerm: '',
        searchResults: [],
        isErrorTerm: true,
        isLoading: false,
        res_modal_status: 403,
        res_modal_message: error
      }));
    }
  };

  const onClickStudentHandler = (result) => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      importedStudentModalOpen: true,
      isImportingStudentPrograms: true
    }));
    // Call api:
    getStudentApplications(result._id.toString()).then(
      (res) => {
        const { data, success } = res.data;
        const { status } = res;
        if (success) {
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isImportingStudentPrograms: false,
            importedStudentPrograms: data,
            res_modal_status: status
          }));
        } else {
          const { message } = res.data;
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      () => {}
    );
  };

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

  const onHideAssignSuccessWindow = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      modalShowAssignSuccessWindow: false
    }));
    window.location.reload(true);
  };

  const handleInputChange = (e) => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      searchTerm: e.target.value.trimLeft()
    }));
    if (e.target.value.length === 0) {
      setStudentApplicationsTableTemplateState((prevState) => ({
        ...prevState,
        isResultsVisible: false
      }));
    }
  };

  const handleInputBlur = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      isResultsVisible: false
    }));
  };
  const onHideimportedStudentModalOpen = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      importedStudentModalOpen: false,
      importedStudentPrograms: []
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

  const handleImportProgramsConfirm = () => {
    const program_ids =
      studentApplicationsTableTemplateState.importedStudentPrograms.map(
        (program) => program.programId._id.toString()
      );
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      isButtonDisable: true
    }));
    assignProgramToStudent(
      studentApplicationsTableTemplateState.student._id.toString(),
      program_ids
    ).then(
      (res) => {
        const { success } = res.data;
        const { status } = res;
        if (success) {
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isButtonDisable: false,
            importedStudentModalOpen: false,
            modalShowAssignSuccessWindow: true,
            success,
            res_modal_status: status
          }));
        } else {
          const { message } = res.data;
          setStudentApplicationsTableTemplateState((prevState) => ({
            ...prevState,
            isLoaded: true,
            importedStudentModalOpen: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      () => {}
    );
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
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      isProgramAssignMode: true
    }));
  };

  const onClickBackToApplicationOverviewnHandler = () => {
    setStudentApplicationsTableTemplateState((prevState) => ({
      ...prevState,
      isProgramAssignMode: false
    }));
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
  // var applying_university;
  var today = new Date();
  if (
    studentApplicationsTableTemplateState.student.applications === undefined ||
    studentApplicationsTableTemplateState.student.applications.length === 0
  ) {
    applying_university_info = (
      <>
        <TableRow>
          {props.role !== 'Student' && <TableCell></TableCell>}
          <TableCell>
            <Typography> No University</Typography>
          </TableCell>
          <TableCell>
            <Typography> No Program</Typography>
          </TableCell>
          <TableCell>
            <Typography> No Date</Typography>
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
            <Typography>- </Typography>
          </TableCell>
          <TableCell>
            <Typography>- </Typography>
          </TableCell>
        </TableRow>
      </>
    );
  } else {
    applying_university_info =
      studentApplicationsTableTemplateState.student.applications.map(
        (application, application_idx) => (
          <TableRow key={application_idx}>
            {props.role !== 'Student' && (
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
                  <AiFillDelete size={16} />
                </Button>
              </TableCell>
            )}
            <TableCell>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                component={LinkDom}
                style={{ textDecoration: 'none' }}
              >
                <Typography key={application_idx}>
                  {application.programId.school}
                </Typography>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                component={LinkDom}
                style={{ textDecoration: 'none' }}
              >
                <Typography key={application_idx}>
                  {application.programId.degree}
                </Typography>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                component={LinkDom}
                style={{ textDecoration: 'none' }}
              >
                <Typography key={application_idx}>
                  {application.programId.program_name}
                </Typography>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                component={LinkDom}
                style={{ textDecoration: 'none' }}
              >
                <Typography key={application_idx}>
                  {application.programId.semester}
                </Typography>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                component={LinkDom}
                style={{ textDecoration: 'none' }}
              >
                <Typography key={application_idx}>
                  {application.programId.toefl
                    ? application.programId.toefl
                    : '-'}
                </Typography>
              </Link>
            </TableCell>
            <TableCell>
              <Link
                to={`${DEMO.SINGLE_PROGRAM_LINK(application.programId._id)}`}
                component={LinkDom}
                style={{ textDecoration: 'none' }}
              >
                <Typography key={application_idx}>
                  {application.programId.ielts
                    ? application.programId.ielts
                    : '-'}
                </Typography>
              </Link>
            </TableCell>
            <TableCell>
              {isProgramSubmitted(application) ? (
                <Typography key={application_idx}>Close</Typography>
              ) : (
                <Typography key={application_idx}>
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
                  <MenuItem value={'X'}>No</MenuItem>
                  <MenuItem value={'O'}>Yes</MenuItem>
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
                      <MenuItem value="-">Not Yet</MenuItem>
                      <MenuItem value="X">Withdraw</MenuItem>
                      <MenuItem value="O">Submitted</MenuItem>
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
              <TableCell></TableCell>
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
                      )
                    }
                    defaultValue={application.admission ?? '-'}
                    onChange={(e) => handleChange(e, application_idx)}
                  >
                    {IS_SUBMITTED_STATE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* <Form.Group controlId="admission">
                  <Form.Control
                    as="select"
                    onChange={(e) => handleChange(e, application_idx)}
                    disabled={
                      !(
                        application.closed !== '-' && application.closed !== 'X'
                      )
                    }
                    value={application.admission}
                  >
                    <option value={'-'}>-</option>
                    <option value={'X'}>No</option>
                    <option value={'O'}>Yes</option>
                  </Form.Control>
                </Form.Group> */}
              </TableCell>
            ) : (
              <TableCell></TableCell>
            )}

            <TableCell>
              <p className="mb-1 text-info" key={application_idx}>
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
              </p>
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
        <ModalNew open={showProgramCorrectnessReminderModal}>
          <Typography variant="h6" fontWeight="bold">
            {t('Warning')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2 }}
          >{`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}</Typography>
          <Typography
            sx={{ mt: 2 }}
          >{`若發現 ${appConfig.companyName} Portal 資訊和學校官方網站資料有不同之處，請和顧問討論。`}</Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={closeProgramCorrectnessModal}
            sx={{ mt: 2 }}
          >
            {t('Accept')}
          </Button>
        </ModalNew>
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
              '/profile'
            )}`}
          >
            {props.student.firstname} {props.student.lastname}
          </Link>
        )}
        <Typography color="text.primary">{t('Applications')}</Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item sx={12} md={is_TaiGer_role(user) ? 6 : 12}>
          <Typography variant="h6">
            {t('Application Preference From Survey')}
          </Typography>
          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              '& ul': { padding: 0 }
            }}
            subheader={<li />}
          >
            <ListItem>
              {t('Target Application Fields')}:{' '}
              <b>
                {props.student.application_preference?.target_application_field}
              </b>
            </ListItem>
            <ListItem>
              {t('Target Degree Programs')}:{' '}
              <b>{props.student.application_preference?.target_degree}</b>
            </ListItem>
            <ListItem>
              {t(
                'Considering private universities? (Tuition Fee: ~15000 EURO/year)'
              )}
              :{' '}
              <b>
                {
                  props.student.application_preference
                    ?.considered_privat_universities
                }
              </b>
            </ListItem>
            <ListItem>
              {t('Considering universities outside Germany?')}:{' '}
              <b>
                {
                  props.student.application_preference
                    ?.application_outside_germany
                }
              </b>
            </ListItem>
            <ListItem>
              {t('Other wish')}:
              <TextField
                id="special_wished"
                multiline
                fullWidth
                rows={4}
                readOnly
                value={
                  props.student.application_preference?.special_wished || ''
                }
                variant="standard"
              />
            </ListItem>
          </List>
        </Grid>
        {is_TaiGer_role(user) && (
          <Grid item sx={12} md={6}>
            <Card sx={{ p: 2, minHeight: '300px' }}>
              <Typography>
                {t('Import programs from another student')}
              </Typography>
              <Typography>
                {t('Find the student and import his/her progams to ')}
              </Typography>
              <div
                className="search-container"
                ref={studentApplicationsTableTemplateState.searchContainerRef}
              >
                <TextField
                  type="text"
                  size="small"
                  className="search-input"
                  placeholder={t('Search student...')}
                  value={studentApplicationsTableTemplateState.searchTerm}
                  onMouseDown={handleInputBlur}
                  onChange={handleInputChange}
                />
                {studentApplicationsTableTemplateState.isResultsVisible &&
                  (studentApplicationsTableTemplateState.searchResults?.length >
                  0 ? (
                    <Box className="search-results result-list">
                      {studentApplicationsTableTemplateState.searchResults?.map(
                        (result, i) => (
                          <li
                            onClick={() => onClickStudentHandler(result)}
                            key={i}
                          >
                            {`${result.firstname} ${result.lastname} ${
                              result.firstname_chinese
                                ? result.firstname_chinese
                                : ' '
                            }${
                              result.lastname_chinese
                                ? result.lastname_chinese
                                : ' '
                            }`}
                          </li>
                        )
                      )}
                    </Box>
                  ) : (
                    <Box
                      className="search-results result-list"
                      sx={{ zIndex: 999 }}
                    >
                      <li>No result</li>
                    </Box>
                  ))}
              </div>
            </Card>
          </Grid>
        )}
      </Grid>
      {studentApplicationsTableTemplateState.isProgramAssignMode ? (
        <>
          <ProgramList
            user={user}
            student={props.student}
            isStudentApplicationPage={true}
          />
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={onClickBackToApplicationOverviewnHandler}
          >
            {t('Back')}
          </Button>
        </>
      ) : (
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
                The number of student&apos;s applications is not specified!
                Please determine the number of the programs according to the
                contract
              </Card>
            )}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6">
                {t('Applying Program Count')}:{' '}
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
                  text={
                    '請選擇要申請的學程打在 Decided: Yes，不要申請打的 No。'
                  }
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
                        {props.role !== 'Student' && <TableCell></TableCell>}
                        {programstatuslist.map((doc, index) => (
                          <TableCell key={index}>{t(doc.name)}</TableCell>
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
                  t('Update')
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
            <ModalNew
              open={
                studentApplicationsTableTemplateState.importedStudentModalOpen
              }
              onClose={onHideimportedStudentModalOpen}
              size="xl"
              aria-labelledby="contained-modal-title-vcenter"
            >
              <Typography variant="h5">Import programs</Typography>
              <Typography>
                Do you want to import the following programs?
                <br />
                (Same programs will <b>NOT</b> be duplicated :) )
                {studentApplicationsTableTemplateState.isImportingStudentPrograms ? (
                  <CircularProgress size={16} />
                ) : (
                  studentApplicationsTableTemplateState.importedStudentPrograms?.map(
                    (app, i) => (
                      <li key={i}>
                        {`${app.programId?.school} - ${app.programId?.program_name} ${app.programId?.degree} 
                          ${app.programId?.semester}`}
                      </li>
                    )
                  ) || []
                )}
              </Typography>
              <Typography>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  disabled={
                    studentApplicationsTableTemplateState.isButtonDisable
                  }
                  onClick={handleImportProgramsConfirm}
                >
                  {studentApplicationsTableTemplateState.isButtonDisable ? (
                    <CircularProgress size={16} />
                  ) : (
                    t('Yes')
                  )}
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={onHideimportedStudentModalOpen}
                >
                  {t('No')}
                </Button>
              </Typography>
            </ModalNew>
            <ModalNew
              open={
                studentApplicationsTableTemplateState.modalShowAssignSuccessWindow
              }
              onClose={onHideAssignSuccessWindow}
              size="m"
              aria-labelledby="contained-modal-title-vcenter"
            >
              <Typography id="contained-modal-title-vcenter">
                {t('Success')}
              </Typography>
              <Typography>
                Program(s) imported to student successfully!
              </Typography>
              <Typography>
                <Button onClick={onHideAssignSuccessWindow}>Close</Button>
              </Typography>
            </ModalNew>
            <ModalNew
              open={
                studentApplicationsTableTemplateState.modalDeleteApplication
              }
              onClose={onHideModalDeleteApplication}
              size="small"
              aria-labelledby="contained-modal-title-vcenter"
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('Warning')}: {t('Delete an application')}
              </Typography>
              <Typography>
                This will delete all message and editted files in discussion.
                Are you sure?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  color="error"
                  variant="contained"
                  disabled={!studentApplicationsTableTemplateState.isLoaded}
                  onClick={handleDeleteConfirm}
                  sx={{ mr: 2 }}
                >
                  {t('Yes')}
                </Button>
                <Button
                  onClick={onHideModalDeleteApplication}
                  variant="outlined"
                >
                  {t('Close')}
                </Button>
              </Box>
            </ModalNew>
            <ModalNew
              open={
                studentApplicationsTableTemplateState.modalUpdatedApplication
              }
              onClose={onHideUpdatedApplicationWindow}
              size="small"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Typography id="contained-modal-title-vcenter">Info:</Typography>
              <Typography>
                {t('Applications status updated successfully!')}
              </Typography>
              <Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={onHideUpdatedApplicationWindow}
                >
                  {t('Close')}
                </Button>
              </Typography>
            </ModalNew>
          </Box>
        </>
      )}
    </Box>
  );
}

export default StudentApplicationsTableTemplate;
