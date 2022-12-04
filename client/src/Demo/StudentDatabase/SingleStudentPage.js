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

import {
  getStudentAndDocLinks,
  updateProfileDocumentStatus,
  uploadforstudent,
  updateAcademicBackground,
  updateLanguageSkill,
  deleteFile,
  updateDocumentationHelperLink
} from '../../api';

class SingleStudentPage extends React.Component {
  state = {
    isLoaded: false,
    student: null,
    base_docs_link: null,
    survey_link: null,
    success: false,
    error: null,
    res_status: 0
  };
  componentDidMount() {
    getStudentAndDocLinks(this.props.match.params.studentId).then(
      (resp) => {
        const { survey_link, base_docs_link, data, success } = resp.data;
        const { status } = resp;
        if (success) {
          const granding_system_doc_link = survey_link.find(
            (link) => link.key === profile_name_list.Grading_System
          );
          this.setState({
            isLoaded: true,
            student: data,
            base_docs_link,
            survey_link: granding_system_doc_link.link,
            success: success,
            res_status: status
          });
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  onUpdateProfileFilefromstudent = (category, student_id, status, feedback) => {
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          //Start the timer
          this.setState((state) => ({
            ...state,
            student: data,
            success,
            isLoaded: true,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  handleGeneralDocSubmit = (e, fileCategory, studentId) => {
    e.preventDefault();
    this.onSubmitGeneralFile(e, e.target.files[0], fileCategory, studentId);
  };

  onSubmitGeneralFile = (e, NewFile, category, student_id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);

    // this.setState((state) => ({
    //   ...state,
    //   isLoaded: false,
    // }));
    uploadforstudent(category, student_id, formData).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          //Start the timer
          this.setState((state) => ({
            ...state,
            student: data, // res.data = {success: true, data:{...}}
            success,
            category: '',
            isLoaded: true,
            file: '',
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  updateDocLink = (link, key) => {
    updateDocumentationHelperLink(link, key, 'base-documents').then(
      (resp) => {
        const { helper_link, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            base_docs_link: helper_link,
            success: success,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {}
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
            isLoaded: true,
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
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
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
            isLoaded: true,
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
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };

  onDeleteFilefromstudent = (category, student_id) => {
    // e.preventDefault();
    var student = { ...this.state.student };
    var idx = student.profile.findIndex((doc) => doc.name === category);
    deleteFile(category, student_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          student.profile[idx] = data;

          this.setState((state) => ({
            ...state,
            student_id: '',
            category: '',
            isLoaded: true,
            student: student,
            success: success,
            deleteFileWarningModel: false,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };
  render() {
    if (
      this.props.user.role !== 'Admin' &&
      this.props.user.role !== 'Agent' &&
      this.props.user.role !== 'Editor'
    ) {
      return <Redirect to="/dashboard/default" />;
    }
    const { res_status, base_docs_link, isLoaded } = this.state;

    if (!isLoaded && !this.state.student) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    let value2 = Object.values(window.profile_list);
    let keys2 = Object.keys(window.profile_list);
    let object_init = {};
    let object_message = {};
    let object_date_init = {};
    let object_time_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = { status: 'missing', link: '', path: '' };
      object_message[keys2[i]] = '';
      object_date_init[keys2[i]] = '';
      object_time_init[keys2[i]] = '';
    }
    // TODO: what if this.state.student.profile[i].name key not in base_docs_link[i].key?
    if (base_docs_link) {
      for (let i = 0; i < base_docs_link.length; i++) {
        object_init[base_docs_link[i].key].link = base_docs_link[i].link;
      }
    }
    if (this.state.student.profile) {
      for (let i = 0; i < this.state.student.profile.length; i++) {
        let document_split = this.state.student.profile[i].path.replace(
          /\\/g,
          '/'
        );
        if (this.state.student.profile[i].status === 'uploaded') {
          object_init[this.state.student.profile[i].name].status = 'uploaded';
          object_init[this.state.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.state.student.profile[i].status === 'accepted') {
          object_init[this.state.student.profile[i].name].status = 'accepted';
          object_init[this.state.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.state.student.profile[i].status === 'rejected') {
          object_init[this.state.student.profile[i].name].status = 'rejected';
          object_init[this.state.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.state.student.profile[i].status === 'notneeded') {
          object_init[this.state.student.profile[i].name].status = 'notneeded';
        } else if (this.state.student.profile[i].status === 'missing') {
          object_init[this.state.student.profile[i].name].status = 'missing';
        }
        object_message[this.state.student.profile[i].name] = this.state.student
          .profile[i].feedback
          ? this.state.student.profile[i].feedback
          : '';
        object_date_init[this.state.student.profile[i].name] = new Date(
          this.state.student.profile[i].updatedAt
        ).toLocaleDateString();
        object_time_init[this.state.student.profile[i].name] = new Date(
          this.state.student.profile[i].updatedAt
        ).toLocaleTimeString();
      }
    } else {
    }
    var documentlist22;
    documentlist22 = keys2.map((k, i) =>
      object_init[k].status === 'uploaded' ? (
        <ButtonSetUploaded
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          path={object_init[k].path}
          role={this.props.user.role}
          isLoaded={this.state.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student_id={this.state.student._id}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          SubmitGeneralFile={this.props.SubmitGeneralFile}
        />
      ) : object_init[k].status === 'accepted' ? (
        <ButtonSetAccepted
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          path={object_init[k].path}
          role={this.props.user.role}
          isLoaded={this.state.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student_id={this.state.student._id}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          SubmitGeneralFile={this.props.SubmitGeneralFile}
          deleteFileWarningModel={this.props.deleteFileWarningModel}
        />
      ) : object_init[k].status === 'rejected' ? (
        <ButtonSetRejected
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          path={object_init[k].path}
          role={this.props.user.role}
          isLoaded={this.state.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student_id={this.state.student._id}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          SubmitGeneralFile={this.props.SubmitGeneralFile}
          deleteFileWarningModel={this.props.deleteFileWarningModel}
        />
      ) : object_init[k].status === 'notneeded' ? (
        (this.props.user.role === 'Admin' ||
          this.props.user.role === 'Agent' ||
          this.props.user.role === 'Edior') && (
          <ButtonSetNotNeeded
            key={i + 1}
            updateDocLink={this.updateDocLink}
            link={object_init[k].link}
            role={this.props.user.role}
            isLoaded={this.state.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.state.student._id}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
            handleGeneralDocSubmit={this.handleGeneralDocSubmit}
          />
        )
      ) : (
        <ButtonSetMissing
          key={i + 1}
          updateDocLink={this.updateDocLink}
          link={object_init[k].link}
          role={this.props.user.role}
          isLoaded={this.state.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student_id={this.state.student._id}
          onDeleteFilefromstudent={this.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
          SubmitGeneralFile={this.SubmitGeneralFile}
          handleGeneralDocSubmit={this.handleGeneralDocSubmit}
        />
      )
    );

    return (
      <>
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
                      isLoaded={this.state.isLoaded}
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
        >
          <Tab eventKey="profile" title="Profile Overview">
            <Table
              responsive
              className="my-2 mx0"
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
            <Row>
              <Table
                responsive
                className="my-0 mx-0"
                variant="dark"
                text="light"
                size="sm"
              >
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>File Name:</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>{documentlist22}</tbody>
              </Table>
            </Row>
            <Row>{SYMBOL_EXPLANATION}</Row>
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
              isLoaded={this.state.isLoaded}
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
                isLoaded={this.state.isLoaded}
              />
            </Table>
          </Tab> */}
        </Tabs>
      </>
    );
  }
}
export default SingleStudentPage;
