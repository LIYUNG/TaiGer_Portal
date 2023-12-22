import React from 'react';
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

class SingleStudentPage extends React.Component {
  state = {
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
  };

  componentDidMount() {
    let keys2 = Object.keys(profile_wtih_doc_link_list);
    let temp_isLoaded = {};
    for (let i = 0; i < keys2.length; i++) {
      temp_isLoaded[keys2[i]] = true;
    }
    getStudentAndDocLinks(this.props.match.params.studentId).then(
      (resp) => {
        const { survey_link, base_docs_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const granding_system_doc_link = survey_link.find(
            (link) => link.key === profile_name_list.Grading_System
          );
          this.setState({
            isLoaded: temp_isLoaded,
            isLoaded2: true,
            student: data,
            base_docs_link,
            survey_link: granding_system_doc_link.link,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: temp_isLoaded,
            isLoaded2: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState((state) => ({
          ...state,
          isLoaded: temp_isLoaded,
          isLoaded2: true,
          error,
          res_status: 500
        }));
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.match.params.studentId !== this.props.match.params.studentId
    ) {
      let keys2 = Object.keys(profile_wtih_doc_link_list);
      let temp_isLoaded = {};
      for (let i = 0; i < keys2.length; i++) {
        temp_isLoaded[keys2[i]] = true;
      }
      getStudentAndDocLinks(this.props.match.params.studentId).then(
        (resp) => {
          const { survey_link, base_docs_link, data, success } = resp.data;
          const { status } = resp;
          if (success) {
            const granding_system_doc_link = survey_link.find(
              (link) => link.key === profile_name_list.Grading_System
            );
            this.setState({
              isLoaded: temp_isLoaded,
              isLoaded2: true,
              student: data,
              base_docs_link,
              survey_link: granding_system_doc_link.link,
              updateconfirmed: false,
              success: success,
              res_status: status
            });
          } else {
            this.setState({
              isLoaded: temp_isLoaded,
              isLoaded2: true,
              res_status: status
            });
          }
        },
        (error) => {
          this.setState((state) => ({
            ...state,
            isLoaded: temp_isLoaded,
            isLoaded2: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }

  editAgent = (student) => {
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

          this.setState((state) => ({
            ...state,
            agent_list: agents,
            updateAgentList,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  editEditor = (student) => {
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

          this.setState((state) => ({
            ...state,
            editor_list: editors,
            updateEditorList,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  handleChangeAgentlist = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => ({
      updateAgentList: {
        ...prevState.updateAgentList,
        [value]: checked
      }
    }));
  };

  handleChangeEditorlist = (e) => {
    const { value, checked } = e.target;
    this.setState((prevState) => ({
      updateEditorList: {
        ...prevState.updateEditorList,
        [value]: checked
      }
    }));
  };

  submitUpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    this.UpdateAgentlist(e, updateAgentList, student_id);
  };

  submitUpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    this.UpdateEditorlist(e, updateEditorList, student_id);
  };

  UpdateAgentlist = (e, updateAgentList, student_id) => {
    e.preventDefault();
    updateAgents(updateAgentList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = { ...this.state.student };
          students_temp = data; // datda is single student updated
          this.setState({
            isLoaded: true, //false to reload everything
            student: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  UpdateEditorlist = (e, updateEditorList, student_id) => {
    e.preventDefault();
    updateEditors(updateEditorList, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          var students_temp = { ...this.state.student };
          students_temp = data; // datda is single student updated
          this.setState({
            isLoaded: true, //false to reload everything
            student: students_temp,
            success: success,
            updateAgentList: [],
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  handleSubmit_AcademicBackground_root = (e, university, student_id) => {
    e.preventDefault();
    updateAcademicBackground(university, student_id).then(
      (resp) => {
        const { profile, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded2: true,
            student: {
              ...state.student,
              academic_background: {
                ...state.student.academic_background,
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
          this.setState((state) => ({
            ...state,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded2: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  handleSubmit_Language_root = (e, language, student_id) => {
    e.preventDefault();
    updateLanguageSkill(language, student_id).then(
      (resp) => {
        const { profile, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded2: true,
            student: {
              ...state.student,
              academic_background: {
                ...state.student.academic_background,
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
          this.setState((state) => ({
            ...state,
            isLoaded2: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded2: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  handleSubmit_ApplicationPreference_root = (
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
          this.setState((state) => ({
            ...state,
            isLoaded2: true,
            student: {
              ...state.student,
              application_preference: data
            },
            success: success,
            updateconfirmed: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };

  onChangeView = () => {
    this.setState((state) => ({
      ...state,
      taiger_view: !this.state.taiger_view
    }));
  };
  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    if (!is_TaiGer_role(this.props.user)) {
      return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    const {
      res_modal_status,
      res_status,
      base_docs_link,
      res_modal_message,
      isLoaded2
    } = this.state;

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    if (!this.state.student) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    TabTitle(
      `Student ${this.state.student.firstname} ${this.state.student.lastname} | ${this.state.student.firstname_chinese} ${this.state.student.lastname_chinese}`
    );
    let header = Object.values(academic_background_header);
    return (
      <>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        {this.state.student.archiv && (
          <Row className="sticky-top">
            <Col>
              <Card className="mb-2 mx-0" bg={'success'} text={'white'}>
                <Card.Header>
                  <Card.Title as="h5" className="text-light">
                    Status: <b>Close</b>
                  </Card.Title>
                </Card.Header>
              </Card>
            </Col>
          </Row>
        )}
        {this.state.taiger_view ? (
          <>
            <Row>
              <Col>
                <Card className="my-2 mx-0" bg={'dark'} text={'white'}>
                  <h4
                    className="text-light mt-4 ms-4"
                    style={{ textAlign: 'left' }}
                  >
                    {this.state.student.firstname}
                    {' ,'}
                    {this.state.student.lastname}
                    {' | '}
                    {this.state.student.lastname_chinese}
                    {this.state.student.firstname_chinese}
                    <Link
                      to={'/profile/' + this.state.student._id}
                      style={{ textDecoration: 'none' }}
                      className="mx-1"
                    >
                      <AiFillEdit color="red" size={24} />
                    </Link>
                    <Link
                      to={'/communications/' + this.state.student._id}
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
                        onClick={this.onChangeView}
                      >
                        Switch View
                      </Button>
                    </span>
                    <p className="text-light mt-2" style={{ float: 'right' }}>
                      Last Login: {convertDate(this.state.student.lastLoginAt)}
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
                          {this.props.user.role === 'Student' ||
                          this.props.user.role === 'Guest' ? (
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
                          user={this.props.user}
                          student={this.state.student}
                          isLoaded={this.state.isLoaded2}
                        />
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Tabs
              defaultActiveKey={this.props.match.params.tab}
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
                      role={this.props.user.role}
                      user={this.props.user}
                      student={this.state.student}
                      editAgent={this.editAgent}
                      editEditor={this.editEditor}
                      agent_list={this.state.agent_list}
                      editor_list={this.state.editor_list}
                      updateAgentList={this.state.updateAgentList}
                      handleChangeAgentlist={this.handleChangeAgentlist}
                      submitUpdateAgentlist={this.submitUpdateAgentlist}
                      updateEditorList={this.state.updateEditorList}
                      handleChangeEditorlist={this.handleChangeEditorlist}
                      submitUpdateEditorlist={this.submitUpdateEditorlist}
                    />
                  </tbody>
                </Table>
                <BaseDocument_StudentView
                  base_docs_link={base_docs_link}
                  student={this.state.student}
                  user={this.props.user}
                  SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
                />
              </Tab>
              <Tab eventKey="CV_ML_RL" title="CV ML RL">
                <Card className="my-0 mx-0" bg={'dark'} text={'white'}>
                  <EditorDocsProgress
                    student={this.state.student}
                    idx={0}
                    singleExpandtHandler={this.singleExpandtHandler}
                    user={this.props.user}
                  />
                </Card>
              </Tab>
              <Tab eventKey="program_portal" title="Portal">
                <Card className="my-0 mx-0">
                  <Card.Body>
                    <Row>
                      <PortalCredentialPage
                        user={this.props.user}
                        student_id={this.state.student._id.toString()}
                        showTitle={true}
                      />
                    </Row>
                  </Card.Body>
                </Card>
              </Tab>
              {appConfig.vpdEnable && (
                <Tab eventKey="uni-assist" title="Uni-Assist">
                  <UniAssistListCard
                    student={this.state.student}
                    role={this.props.user.role}
                    user={this.props.user}
                  />
                </Tab>
              )}

              <Tab eventKey="background" title="My Survey">
                <SurveyComponent
                  survey_link={this.state.survey_link}
                  user={this.props.user}
                  agents={this.state.student.agents}
                  editors={this.state.student.editors}
                  academic_background={this.state.student.academic_background}
                  application_preference={
                    this.state.student.application_preference
                  }
                  isLoaded={this.state.isLoaded2}
                  student={this.state.student}
                  student_id={this.state.student._id.toString()}
                  singlestudentpage_fromtaiger={true}
                  handleSubmit_AcademicBackground_root={
                    this.handleSubmit_AcademicBackground_root
                  }
                  handleSubmit_Language_root={this.handleSubmit_Language_root}
                  handleSubmit_ApplicationPreference_root={
                    this.handleSubmit_ApplicationPreference_root
                  }
                  updateconfirmed={this.state.updateconfirmed}
                />
              </Tab>
              <Tab eventKey="Courses_Table" title="My Courses">
                <Card className="my-0 mx-0">
                  <Card.Body>
                    <Row>
                      <Link
                        to={`/my-courses/${this.state.student._id.toString()}`}
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
                      <b>
                        This is internal notes. Student won't see this note.
                      </b>
                    </h5>
                    <br />
                    <Notes
                      user={this.props.user}
                      student_id={this.state.student._id.toString()}
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
                    Student View: {this.state.student.firstname}{' '}
                    {this.state.student.lastname}
                    <span style={{ float: 'right', cursor: 'pointer' }}>
                      <Button
                        size="sm"
                        className="ms-2 mb-2"
                        onClick={this.onChangeView}
                      >
                        Switch Back
                      </Button>
                    </span>
                  </h4>
                </Card>
              </Col>
            </Row>
            <StudentDashboard
              user={this.state.student}
              role={this.state.student.role}
              student={this.state.student}
              ReadOnlyMode={true}
              SYMBOL_EXPLANATION={SYMBOL_EXPLANATION}
            />
          </>
        )}
      </>
    );
  }
}
export default SingleStudentPage;
