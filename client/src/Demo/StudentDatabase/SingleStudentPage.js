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

import ButtonSetUploaded from '../AgentCenter/ButtonSetUploaded';
import ButtonSetAccepted from '../AgentCenter/ButtonSetAccepted';
import ButtonSetRejected from '../AgentCenter/ButtonSetRejected';
import ButtonSetNotNeeded from '../AgentCenter/ButtonSetNotNeeded';
import ButtonSetMissing from '../AgentCenter/ButtonSetMissing';
import BaseDocument_StudentView from '../AgentCenter/BaseDocument_StudentView';
import EditorDocsProgress from '../CVMLRLCenter/EditorDocsProgress';
import UniAssistListCard from '../UniAssist/UniAssistListCard';
import SurveyComponent from '../Survey/SurveyComponent';
import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import StudentsAgentEditor from '../Dashboard/MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import {
  SYMBOL_EXPLANATION,
  profile_name_list,
  spinner_style
} from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  getStudentAndDocLinks,
  updateAcademicBackground,
  updateLanguageSkill
} from '../../api';

class SingleStudentPage extends React.Component {
  state = {
    isLoaded: {},
    isLoaded2: false,
    student: null,
    base_docs_link: null,
    survey_link: null,
    success: false,
    error: null,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };
  componentDidMount() {
    let keys2 = Object.keys(window.profile_wtih_doc_link_list);
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
        this.setState({
          isLoaded: temp_isLoaded,
          isLoaded2: true,
          error: true
        });
      }
    );
  }

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
        this.setState({
          isLoaded2: true,
          error: true
        });
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
        this.setState({
          isLoaded2: true,
          error: true
        });
      }
    );
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Editor'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const {
      res_modal_status,
      res_status,
      base_docs_link,
      res_modal_message,
      isLoaded2,
      ready
    } = this.state;

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    if (!ready && !this.state.student) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    return (
      <>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        <Row>
          <Col>
            <Card className="my-2 mx-0" bg={'dark'} text={'white'}>
              <Card.Header>
                <Card.Title className="text-light">
                  {this.state.student.firstname}
                  {' ,'}
                  {this.state.student.lastname}
                </Card.Title>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="my-1 mx-0" bg={'dark'} text={'white'}>
              <Card.Body>
                <Table
                  responsive
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
                          <th>First-, Last Name</th>
                          <th>#</th>
                        </>
                      )}
                      {window.programstatuslist.map((doc, index) => (
                        <th key={index}>{doc.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <ApplicationProgress
                      role={this.props.user.role}
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
              className="px-0 py-0 my-2 mx-0"
              variant="dark"
              text="light"
              size="sm"
            >
              <thead>
                <tr>
                  <th>First-, Last Name</th>
                  <th>Agents</th>
                  <th>Editors</th>
                </tr>
              </thead>
              <tbody>
                <StudentsAgentEditor student={this.state.student} />
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
                accordionKeys={[0]}
                singleExpandtHandler={this.singleExpandtHandler}
                role={this.props.user.role}
              />
            </Card>
          </Tab>
          <Tab eventKey="program_portal" title="Portal">
            <Row>
              Coming Soon!
              {/* <Table responsive>
                <Task student_id={this.state.student._id} />
              </Table> */}
            </Row>
          </Tab>
          <Tab eventKey="uni-assist" title="Uni-Assist">
            <Row>
              <UniAssistListCard
                student={this.state.student}
                role={this.props.user.role}
              />
            </Row>
          </Tab>
          {/* <Tab eventKey="status" title="Status">
            <Row>
              <Table responsive>
                <Task student_id={this.state.student._id} />
              </Table>
            </Row>
          </Tab> */}
          <Tab eventKey="background" title="Background">
            <SurveyComponent
              role={this.props.user.role}
              survey_link={this.state.survey_link}
              user={this.props.user}
              academic_background={this.state.student.academic_background}
              application_preference={this.state.student.application_preference}
              isLoaded={this.state.isLoaded2}
              student_id={this.state.student._id}
              singlestudentpage_fromtaiger={true}
              handleSubmit_AcademicBackground_root={
                this.handleSubmit_AcademicBackground_root
              }
              handleSubmit_Language_root={this.handleSubmit_Language_root}
              updateconfirmed={this.state.updateconfirmed}
            />
          </Tab>
          <Tab eventKey="Courses_Table" title="Courses Table">
            <Card className="my-0 mx-0">
              <Card.Body>
                <Row>
                  <Link to={`/my-courses/${this.state.student._id.toString()}`}>
                    <Button>Go to Courses Table </Button>
                  </Link>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
          {/* <Tab eventKey="applied-schools" title="Applied Schools">
            <Table responsive>
              <thead>
                <tr>
                  <>
                    <th></th>
                    <th>First-, Last Name</th>
                    <th>University</th>
                    <th>Programs</th>
                    <th>Deadline</th>
                  </>
                  {window.programstatuslist.map((doc, index) => (
                    <th key={index}>{doc.name}</th>
                  ))}
                </tr>
              </thead>
              <ApplicationProgress
                role={this.props.user.role}
                student={this.state.student}
                isLoaded={this.state.ready}
              />
            </Table>
          </Tab> */}
        </Tabs>
      </>
    );
  }
}
export default SingleStudentPage;
