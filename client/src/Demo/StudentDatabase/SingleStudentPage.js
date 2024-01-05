import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Card,
  Table,
  Row,
  Col,
  Button,
  Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import BaseDocument_StudentView from '../BaseDocuments/BaseDocument_StudentView';
import EditorDocsProgress from '../CVMLRLCenter/EditorDocsProgress';
import UniAssistListCard from '../UniAssist/UniAssistListCard';
import SurveyComponent from '../Survey/SurveyComponent';
import Notes from '../Notes/index';
import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import StudentsAgentEditor from '../Dashboard/MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import StudentDashboard from '../Dashboard/StudentDashboard/StudentDashboard';
import {
  SYMBOL_EXPLANATION,
  profile_name_list,
  spinner_style,
  convertDate,
  programstatuslist,
  profile_wtih_doc_link_list,
  academic_background_header
} from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  getStudentAndDocLinks,
  updateAcademicBackground,
  updateLanguageSkill,
  updateApplicationPreference,
  getAgents,
  updateAgents,
  getEditors,
  updateEditors
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { AiFillEdit } from 'react-icons/ai';
import { BsMessenger } from 'react-icons/bs';
import PortalCredentialPage from '../PortalCredentialPage';
import { appConfig } from '../../config';
import { TopBar } from '../../components/TopBar/TopBar';

function SingleStudentPage(props) {
  const { t, i18n } = useTranslation();
  const [singleStudentPage, setSingleStudentPage] = useState({
    error: '',
    isLoaded: {},
    isLoaded2: false,
    taiger_view: true,
    agent_list: [],
    editor_list: [],
    updateAgentList: {},
    updateEditorList: {},
    student: null,
    base_docs_link: null,
    survey_link: null,
    success: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });
  useEffect(() => {
    let keys2 = Object.keys(profile_wtih_doc_link_list);
    let temp_isLoaded = {};
    for (let i = 0; i < keys2.length; i++) {
      temp_isLoaded[keys2[i]] = true;
    }
    getStudentAndDocLinks(props.match.params.studentId).then(
      (resp) => {
        const { survey_link, base_docs_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const granding_system_doc_link = survey_link.find(
            (link) => link.key === profile_name_list.Grading_System
          );
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: temp_isLoaded,
            isLoaded2: true,
            student: data,
            base_docs_link,
            survey_link: granding_system_doc_link.link,
            success: success,
            res_status: status
          }));
        } else {
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded: temp_isLoaded,
            isLoaded2: true,
            res_status: status
          }));
        }
      },
      (error) => {
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: temp_isLoaded,
          isLoaded2: true,
          error,
          res_status: 500
        }));
      }
    );
  }, [props.match.params.studentId]);

  const editAgent = (student) => {
    getAgents().then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const agents = data; //get all agent
          const { agents: student_agents } = student;
          const updateAgentList = agents.reduce(
            (prev, { _id }) => ({
              ...prev,
              [_id]: student_agents
                ? student_agents.findIndex(
                    (student_agent) => student_agent._id === _id
                  ) > -1
                : false
            }),
            {}
          );
          setSingleStudentPage((prevState) => ({
            ...prevState,
            agent_list: agents,
            updateAgentList,
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
        const { statusText } = resp;
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  const editEditor = (student) => {
    getEditors().then(
      (resp) => {
        // TODO: check success
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const editors = data;
          const { editors: student_editors } = student;
          const updateEditorList = editors.reduce(
            (prev, { _id }) => ({
              ...prev,
              [_id]: student_editors
                ? student_editors.findIndex(
                    (student_editor) => student_editor._id === _id
                  ) > -1
                : false
            }),
            {}
          );

          setSingleStudentPage((prevState) => ({
            ...prevState,
            editor_list: editors,
            updateEditorList,
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
        const { statusText } = resp;
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  const submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    UpdateAgentlist(e, updateAgentList, student_id);
  };

  const submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    UpdateEditorlist(e, updateEditorList, student_id);
  };

  const UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = { ...singleStudentPage.student };
          students_temp = data; // datda is single student updated
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
        const { statusText } = resp;
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
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
          students_temp = data; // datda is single student updated
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
        const { statusText } = resp;
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  const handleSubmit_AcademicBackground_root = (e, university, student_id) => {
    e.preventDefault();
    updateAcademicBackground(university, student_id).then(
      (resp) => {
        const { profile, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded2: true,
            student: {
              ...prevState.student,
              academic_background: {
                ...prevState.student.academic_background,
                university: data
              },
              profile: profile
            },
            success: success,
            updateconfirmed: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded2: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  const handleSubmit_Language_root = (e, language, student_id) => {
    e.preventDefault();
    updateLanguageSkill(language, student_id).then(
      (resp) => {
        const { profile, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded2: true,
            student: {
              ...prevState.student,
              academic_background: {
                ...prevState.student.academic_background,
                language: data
              },
              profile: profile
            },
            success: success,
            updateconfirmed: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded2: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  const handleSubmit_ApplicationPreference_root = (
    e,
    application_preference,
    student_id
  ) => {
    e.preventDefault();
    updateApplicationPreference(application_preference, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setSingleStudentPage((prevState) => ({
            ...prevState,
            isLoaded2: true,
            student: {
              ...prevState.student,
              application_preference: data
            },
            success: success,
            updateconfirmed: true,
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
        const { statusText } = resp;
        setSingleStudentPage((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
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
  const ConfirmError = () => {
    setSingleStudentPage((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  if (!is_TaiGer_role(props.user)) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }

  const {
    res_modal_status,
    res_status,
    base_docs_link,
    res_modal_message,
    isLoaded2
  } = singleStudentPage;

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  if (!singleStudentPage.student) {
    return (
      <div style={spinner_style}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }
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
      {singleStudentPage.student.archiv && (
        <TopBar>
          Status: <b>Close</b>
        </TopBar>
      )}
      {singleStudentPage.taiger_view ? (
        <>
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'dark'} text={'white'}>
                <h4
                  className="text-light mt-4 ms-4"
                  style={{ textAlign: 'left' }}
                >
                  {singleStudentPage.student.firstname}
                  {' ,'}
                  {singleStudentPage.student.lastname}
                  {' | '}
                  {singleStudentPage.student.lastname_chinese}
                  {singleStudentPage.student.firstname_chinese}
                  <Link
                    to={`${DEMO.PROFILE_STUDENT_LINK(
                      singleStudentPage.student._id
                    )}`}
                    style={{ textDecoration: 'none' }}
                    className="mx-1"
                  >
                    <AiFillEdit color="red" size={24} />
                  </Link>
                  <Link
                    to={`${DEMO.COMMUNICATIONS_LINK(
                      singleStudentPage.student._id
                    )}`}
                    style={{ textDecoration: 'none' }}
                    className="mx-1"
                  >
                    <Button size="sm" className="ms-2 ">
                      <BsMessenger color="white" size={16} /> <b>Message</b>
                    </Button>
                  </Link>
                  <span
                    className="text-light mb-1 me-2 "
                    style={{ float: 'right' }}
                  >
                    <Button
                      size="sm"
                      variant="success"
                      className="ms-2 "
                      onClick={onChangeView}
                    >
                      {t('Switch View')}
                    </Button>
                  </span>
                  <p className="text-light mt-2" style={{ float: 'right' }}>
                    {t('Last Login')}:&nbsp;
                    {convertDate(singleStudentPage.student.lastLoginAt)}
                  </p>
                </h4>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="my-1 mx-0" bg={'dark'} text={'white'}>
                <Card.Body>
                  <Table
                    responsive
                    bordered
                    hover
                    className="my-0 mx-0"
                    variant="dark"
                    text="light"
                    size="sm"
                  >
                    <thead>
                      <tr>
                        <th></th>
                        {props.user.role === 'Student' ||
                        props.user.role === 'Guest' ? (
                          <></>
                        ) : (
                          <>
                            <th>#</th>
                          </>
                        )}
                        {programstatuslist.map((doc, index) => (
                          <th key={index}>{doc.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <ApplicationProgress
                        user={props.user}
                        student={singleStudentPage.student}
                        isLoaded={singleStudentPage.isLoaded2}
                      />
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Tabs
            defaultActiveKey={props.match.params.tab}
            id="uncontrolled-tab-example"
            fill={true}
            justify={true}
            className="py-0 my-0 mx-0"
          >
            <Tab eventKey="profile" title="Profile Overview">
              <Table
                responsive
                className="px-0 py-0 mb-2 mx-0"
                variant="dark"
                text="light"
                size="sm"
              >
                <thead>
                  <tr>
                    <th></th>
                    <th>First-, Last Name</th>
                    <th>Agents</th>
                    <th>Editors</th>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>Degree</th>
                    {header.map((name, index) => (
                      <th key={index}>{name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <StudentsAgentEditor
                    role={props.user.role}
                    user={props.user}
                    student={singleStudentPage.student}
                    editAgent={editAgent}
                    editEditor={editEditor}
                    agent_list={singleStudentPage.agent_list}
                    editor_list={singleStudentPage.editor_list}
                    updateAgentList={singleStudentPage.updateAgentList}
                    submitUpdateAgentlist={submitUpdateAgentlist}
                    updateEditorList={singleStudentPage.updateEditorList}
                    submitUpdateEditorlist={submitUpdateEditorlist}
                  />
                </tbody>
              </Table>
              <BaseDocument_StudentView
                base_docs_link={base_docs_link}
                student={singleStudentPage.student}
                user={props.user}
                SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
              />
            </Tab>
            <Tab eventKey="CV_ML_RL" title="CV ML RL">
              <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
                <EditorDocsProgress
                  student={singleStudentPage.student}
                  idx={0}
                  user={props.user}
                />
              </Card>
            </Tab>
            <Tab eventKey="program_portal" title="Portal">
              <Card className="my-0 mx-0">
                <Card.Body>
                  <Row>
                    <PortalCredentialPage
                      user={props.user}
                      student_id={singleStudentPage.student._id.toString()}
                      showTitle={true}
                    />
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            {appConfig.vpdEnable && (
              <Tab eventKey="uni-assist" title="Uni-Assist">
                <UniAssistListCard
                  student={singleStudentPage.student}
                  role={props.user.role}
                  user={props.user}
                />
              </Tab>
            )}

            <Tab eventKey="background" title="My Survey">
              <SurveyComponent
                survey_link={singleStudentPage.survey_link}
                user={props.user}
                agents={singleStudentPage.student.agents}
                editors={singleStudentPage.student.editors}
                academic_background={
                  singleStudentPage.student.academic_background
                }
                application_preference={
                  singleStudentPage.student.application_preference
                }
                isLoaded={singleStudentPage.isLoaded2}
                student={singleStudentPage.student}
                student_id={singleStudentPage.student._id.toString()}
                singlestudentpage_fromtaiger={true}
                handleSubmit_AcademicBackground_root={
                  handleSubmit_AcademicBackground_root
                }
                handleSubmit_Language_root={handleSubmit_Language_root}
                handleSubmit_ApplicationPreference_root={
                  handleSubmit_ApplicationPreference_root
                }
                updateconfirmed={singleStudentPage.updateconfirmed}
              />
            </Tab>
            <Tab eventKey="Courses_Table" title="My Courses">
              <Card className="my-0 mx-0">
                <Card.Body>
                  <Row>
                    <Link
                      to={`${DEMO.COURSES_INPUT_LINK(
                        singleStudentPage.student._id.toString()
                      )}`}
                    >
                      <Button>Go to My Courses </Button>
                    </Link>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="Notes" title="Notes">
              <Card className="my-0 mx-0">
                <Card.Body>
                  <h5>
                    <b>This is internal notes. Student won't see this note.</b>
                  </h5>
                  <br />
                  <Notes
                    user={props.user}
                    student_id={singleStudentPage.student._id.toString()}
                  />
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </>
      ) : (
        <>
          <Row>
            <Col>
              <Card className="my-2 mx-0" bg={'secondary'} text={'white'}>
                <h4
                  className="text-light mt-4 ms-4"
                  style={{ textAlign: 'left' }}
                >
                  Student View: {singleStudentPage.student.firstname}{' '}
                  {singleStudentPage.student.lastname}
                  <span style={{ float: 'right', cursor: 'pointer' }}>
                    <Button
                      size="sm"
                      className="ms-2 mb-2"
                      onClick={onChangeView}
                    >
                      Switch Back
                    </Button>
                  </span>
                </h4>
              </Card>
            </Col>
          </Row>
          <StudentDashboard
            user={singleStudentPage.student}
            role={singleStudentPage.student.role}
            student={singleStudentPage.student}
            ReadOnlyMode={true}
            SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
          />
        </>
      )}
    </>
  );
}
export default SingleStudentPage;
