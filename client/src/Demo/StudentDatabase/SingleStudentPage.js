import React, { useState } from 'react';
import {
  Navigate,
  Link as LinkDom,
  useLoaderData,
  useLocation
} from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import {
  Tabs,
  Tab,
  Box,
  Button,
  Card,
  Link,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Breadcrumbs,
  Alert,
  TableContainer
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AiFillEdit } from 'react-icons/ai';
import { BsMessenger } from 'react-icons/bs';

import { TopBar } from '../../components/TopBar/TopBar';
import BaseDocument_StudentView from '../BaseDocuments/BaseDocument_StudentView';
import EditorDocsProgress from '../CVMLRLCenter/EditorDocsProgress';
import UniAssistListCard from '../UniAssist/UniAssistListCard';
import SurveyComponent from '../Survey/SurveyComponent';
import Notes from '../Notes/index';
import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import StudentsAgentEditor from '../Dashboard/MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import StudentDashboard from '../Dashboard/StudentDashboard/StudentDashboard';
import {
  profile_name_list,
  convertDate,
  programstatuslist,
  academic_background_header,
  SINGLE_STUDENT_TABS,
  SINGLE_STUDENT_REVERSED_TABS
} from '../Utils/contants';
import { is_TaiGer_Editor, is_TaiGer_role } from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import {
  updateAgents,
  updateArchivStudents,
  updateAttributes,
  updateEditors
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import PortalCredentialPage from '../PortalCredentialPage';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { SurveyProvider } from '../../components/SurveyProvider';
import ProgramDetailsComparisonTable from '../Program/ProgramDetailsComparisonTable';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export const SingleStudentPageMainContent = ({
  survey_link,
  base_docs_link,
  data
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [singleStudentPage, setSingleStudentPage] = useState({
    error: '',
    isLoaded: {},
    isLoaded2: false,
    taiger_view: true,
    detailedView: false,
    student: data,
    base_docs_link: base_docs_link,
    survey_link: survey_link.find(
      (link) => link.key === profile_name_list.Grading_System
    ).link,
    success: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  const { hash } = useLocation();
  const [value, setValue] = useState(
    SINGLE_STUDENT_TABS[hash.replace('#', '')] || 0
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
    window.location.hash = SINGLE_STUDENT_REVERSED_TABS[newValue];
  };

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    UpdateAgentlist(e, updateAgentList, student_id);
  };

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateEditorlist(e, updateEditorList, student_id);
  };

  const submitUpdateAttributeslist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateAttributeslist(e, updateEditorList, student_id);
  };

  const UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = { ...singleStudentPage.student };
          students_temp.agents = data.agents; // datda is single student updated
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            student: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = { ...singleStudentPage.student };
          students_temp.editors = data.editors; // datda is single student updated
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            student: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const UpdateAttributeslist = (e, updateAttributesList, student_id) => {
    e.preventDefault();
    updateAttributes(updateAttributesList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = { ...singleStudentPage.student };
          students_temp.attributes = data.attributes; // datda is single student updated
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true, //false to reload everything
            student: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const updateStudentArchivStatus = (studentId, isArchived, shouldInform) => {
    updateArchivStudents(studentId, isArchived, shouldInform).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          let student_temp = { ...singleStudentPage.student };
          student_temp.archiv = isArchived;
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true,
            student: student_temp,
            success: success,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
          }));
        }
      },
      (error) => {
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const onChangeView = () => {
    setSingleStudentPage((prevState) => ({
      ...prevState,
      taiger_view: !singleStudentPage.taiger_view
    }));
  };

  const onChangeProgramsDetailView = () => {
    setSingleStudentPage((prevState) => ({
      ...prevState,
      detailedView: !prevState.detailedView
    }));
  };
  const ConfirmError = () => {
    setSingleStudentPage((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (!is_TaiGer_role(user)) {
    return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const { res_modal_status, res_modal_message } = singleStudentPage;

  TabTitle(
    `Student ${singleStudentPage.student.firstname} ${singleStudentPage.student.lastname} | ${singleStudentPage.student.firstname_chinese} ${singleStudentPage.student.lastname_chinese}`
  );
  let header = Object.values(academic_background_header);
  return (
    <>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
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
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
              to={`${DEMO.STUDENT_DATABASE_LINK}`}
            >
              {t('Student Database', { ns: 'common' })}
            </Link>
            <Typography color="text.primary">
              {t('Student', { ns: 'common' })}{' '}
              {singleStudentPage.student.firstname}
              {' ,'}
              {singleStudentPage.student.lastname}
              {' | '}
              {singleStudentPage.student.lastname_chinese}
              {singleStudentPage.student.firstname_chinese}
            </Typography>
            <Link
              underline="hover"
              color="inherit"
              component={LinkDom}
              to={`${DEMO.PROFILE_STUDENT_LINK(singleStudentPage.student._id)}`}
            >
              <AiFillEdit color="red" size={24} />
            </Link>
          </Breadcrumbs>
        </Box>
        <Box>
          <Box style={{ textAlign: 'left' }}>
            <Typography style={{ float: 'right' }}>
              <Link
                underline="hover"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.COMMUNICATIONS_TAIGER_MODE_LINK(
                  singleStudentPage.student._id
                )}`}
                sx={{ mr: 1 }}
              >
                <Button color="primary" variant="contained" size="small">
                  <BsMessenger color="white" size={16} />
                  &nbsp;
                  <b>{t('Message', { ns: 'common' })}</b>
                </Button>
              </Link>
              {t('Last Login', { ns: 'auth' })}:&nbsp;
              {convertDate(singleStudentPage.student.lastLoginAt)}{' '}
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={onChangeView}
              >
                {t('Switch View', { ns: 'common' })}
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
      {singleStudentPage.student.archiv && <TopBar />}
      {singleStudentPage.taiger_view ? (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor="primary"
              aria-label="basic tabs example"
            >
              <Tab
                label={t('Applications Overview', { ns: 'common' })}
                {...a11yProps(0)}
              />
              <Tab label={t('Documents', { ns: 'common' })} {...a11yProps(1)} />
              <Tab label={t('CV ML RL', { ns: 'common' })} {...a11yProps(2)} />
              <Tab label={t('Portal', { ns: 'common' })} {...a11yProps(3)} />
              <Tab
                label={t('Uni-Assist', { ns: 'common' })}
                {...a11yProps(4)}
              />
              <Tab label={t('Profile', { ns: 'common' })} {...a11yProps(5)} />
              <Tab
                label={t('My Courses', { ns: 'common' })}
                {...a11yProps(6)}
              />
              <Tab label={t('Notes', { ns: 'common' })} {...a11yProps(7)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Box sx={{ display: 'flex', mx: 2 }}>
              <Button
                color="secondary"
                variant="contained"
                onClick={onChangeProgramsDetailView}
              >
                {singleStudentPage.detailedView
                  ? t('Simple View', { ns: 'common' })
                  : t('Details View', { ns: 'common' })}
              </Button>
              {!is_TaiGer_Editor(user) && (
                <Link
                  to={`${DEMO.STUDENT_APPLICATIONS_ID_LINK(
                    singleStudentPage.student._id
                  )}`}
                  component={LinkDom}
                  underline="hover"
                  target="_blank"
                  sx={{ mx: 2 }}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    startIcon={<EditIcon />}
                  >
                    {t('Edit', { ns: 'common' })}
                  </Button>
                </Link>
              )}
              <Typography variant="body1">
                Applications (Selected / Contract):
              </Typography>
              {singleStudentPage.student.applying_program_count ? (
                singleStudentPage.student.applications.length <
                singleStudentPage.student.applying_program_count ? (
                  <Typography className="text-danger">
                    <b>{singleStudentPage.student.applications.length}</b> /{' '}
                    {singleStudentPage.student.applying_program_count}
                  </Typography>
                ) : (
                  <Typography className="text-info">
                    {singleStudentPage.student.applications.length} /{' '}
                    {singleStudentPage.student.applying_program_count}
                  </Typography>
                )
              ) : (
                <b className="text-danger">0</b>
              )}
            </Box>
            {singleStudentPage.detailedView ? (
              <ProgramDetailsComparisonTable
                applications={singleStudentPage.student?.applications}
              />
            ) : (
              <TableContainer style={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {programstatuslist.map((doc, index) => (
                        <TableCell key={index}>{doc.name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <ApplicationProgress student={singleStudentPage.student} />
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TableContainer style={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      {t('First-, Last Name', { ns: 'common' })}
                    </TableCell>
                    <TableCell>{t('Agents', { ns: 'common' })}</TableCell>
                    <TableCell>{t('Editors', { ns: 'common' })}</TableCell>
                    <TableCell>{t('Year', { ns: 'common' })}</TableCell>
                    <TableCell>{t('Semester', { ns: 'common' })}</TableCell>
                    <TableCell>{t('Degree', { ns: 'common' })}</TableCell>
                    {header.map((name, index) => (
                      <TableCell key={index}>
                        {t(`${name}`, { ns: 'common' })}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StudentsAgentEditor
                    student={singleStudentPage.student}
                    updateStudentArchivStatus={updateStudentArchivStatus}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                    submitUpdateAttributeslist={submitUpdateAttributeslist}
                  />
                </TableBody>
              </Table>
            </TableContainer>
            <BaseDocument_StudentView
              base_docs_link={base_docs_link}
              student={singleStudentPage.student}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Card sx={{ p: 2 }}>
              <EditorDocsProgress student={singleStudentPage.student} idx={0} />
            </Card>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Card>
              <PortalCredentialPage
                student_id={singleStudentPage.student._id.toString()}
                showTitle={true}
              />
            </Card>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <UniAssistListCard student={singleStudentPage.student} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <SurveyProvider
              value={{
                academic_background:
                  singleStudentPage.student.academic_background,
                application_preference:
                  singleStudentPage.student.application_preference,
                survey_link: singleStudentPage.survey_link,
                student_id: singleStudentPage.student._id.toString()
              }}
            >
              <SurveyComponent
                updateconfirmed={singleStudentPage.updateconfirmed}
              />
            </SurveyProvider>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
            <Link
              to={`${DEMO.COURSES_INPUT_LINK(
                singleStudentPage.student._id.toString()
              )}`}
              component={LinkDom}
              underline="hover"
              rel="noreferrer"
              target="_blank"
            >
              <Button color="primary" variant="contained">
                Go to My Courses{' '}
              </Button>
            </Link>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            <Typography fontWeight="bold">
              This is internal notes. Student won&apos;t see this note.
            </Typography>
            <br />
            <Notes student_id={singleStudentPage.student._id.toString()} />
          </CustomTabPanel>
        </>
      ) : (
        <>
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              {t('Student View', { ns: 'common' })}
            </Typography>
          </Alert>
          <StudentDashboard
            student={singleStudentPage.student}
            ReadOnlyMode={true}
          />
        </>
      )}
    </>
  );
};

function SingleStudentPage() {
  const {
    data: { survey_link, base_docs_link, data }
  } = useLoaderData();
  return (
    <SingleStudentPageMainContent
      survey_link={survey_link}
      base_docs_link={base_docs_link}
      data={data}
    />
  );
}
export default SingleStudentPage;
