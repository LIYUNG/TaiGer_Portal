import React from 'react';
import {
  Dropdown,
  Tabs,
  Tab,
  Card,
  Table,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { BsDash } from 'react-icons/bs';
import {
  getStudent,
  updateProfileDocumentStatus,
  downloadProfile,
  uploadforstudent,
  deleteFile
} from '../../api';
import ButtonSetUploaded from '../AgentCenter/ButtonSetUploaded';
import ButtonSetAccepted from '../AgentCenter/ButtonSetAccepted';
import ButtonSetRejected from '../AgentCenter/ButtonSetRejected';
import ButtonSetNotNeeded from '../AgentCenter/ButtonSetNotNeeded';
import ButtonSetMissing from '../AgentCenter/ButtonSetMissing';
import UploadAndGenerate from '../TaiGerAI/UploadAndGenerate';
import EditorDocsProgress from '../CVMLRLCenter/EditorDocsProgress';
import SurveyComponent from '../Survey/SurveyComponent';
import ApplicationProgress from '../Dashboard/MainViewTab/ApplicationProgress/ApplicationProgress';
import StudentsAgentEditor from '../Dashboard/MainViewTab/StudentsAgentEditor/StudentsAgentEditor';
import Task from '../Task/Task';

class ArchivStudent extends React.Component {
  state = {
    isLoaded: false,
    student: null,
    success: false,
    error: null
  };
  componentDidMount() {
    getStudent(this.props.match.params.studentId).then(
      (resp) => {
        console.log(resp);
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success
          });
        } else {
          alert(resp.data.message);
        }
      },
      (error) => {
        console.log(': ' + error);
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  }

  onUpdateProfileFilefromstudent = (category, student_id, status, feedback) => {
    updateProfileDocumentStatus(category, student_id, status, feedback).then(
      (res) => {
        const { data, success } = res.data;
        if (success) {
          //Start the timer
          this.setState((state) => ({
            ...state,
            student: data,
            success,
            isLoaded: true
          }));
        } else {
          alert(res.data.message);
          this.setState((state) => ({
            ...state,
            isLoaded: true
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  handleGeneralDocSubmit = (e, studentId, fileCategory) => {
    e.preventDefault();
    this.onSubmitGeneralFile(e, e.target.files[0], studentId, fileCategory);
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
      (res) => {
        const { data, success } = res.data;
        if (success) {
          //Start the timer
          this.setState((state) => ({
            ...state,
            student: data, // res.data = {success: true, data:{...}}
            success,
            category: '',
            isLoaded: true,
            file: ''
          }));
        } else {
          alert(res.data.message);
          this.setState((state) => ({
            ...state,
            isLoaded: true
          }));
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
  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    downloadProfile(category, id).then(
      (resp) => {
        console.log(resp.data);
        const actualFileName =
          resp.headers['content-disposition'].split('"')[1];
        const { data: blob } = resp;
        if (blob.size === 0) return;

        var filetype = actualFileName.split('.'); //split file name
        filetype = filetype.pop(); //get the file type

        if (filetype === 'pdf') {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: 'application/pdf' })
          );

          //Open the URL on new Window
          window.open(url); //TODO: having a reasonable file name, pdf viewer
        } else {
          //if not pdf, download instead.

          const url = window.URL.createObjectURL(new Blob([blob]));

          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', actualFileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      },
      (error) => {
        alert('The file is not available.');
      }
    );
  }

  onDeleteFilefromstudent = (category, student_id) => {
    // e.preventDefault();
    var student = { ...this.state.student };
    var idx = student.profile.findIndex((doc) => doc.name === category);
    deleteFile(category, student_id).then(
      (res) => {
        const { data, success } = res.data;
        student.profile[idx] = data;
        // std.profile[idx] = res.data.data; // res.data = {success: true, data:{...}}
        if (success) {
          this.setState((state) => ({
            ...state,
            student_id: '',
            category: '',
            isLoaded: true,
            student: student,
            success: success,
            deleteFileWarningModel: false
          }));
        } else {
          alert(res.data.message);
          this.setState((state) => ({
            ...state,
            isLoaded: true
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  render() {
    const { error, isLoaded } = this.state;
    let FILE_OK_SYMBOL = (
      <IoCheckmarkCircle size={18} color="limegreen" title="Valid Document" />
    );
    let FILE_NOT_OK_SYMBOL = (
      <AiFillCloseCircle size={18} color="red" title="Invalid Document" />
    );
    let FILE_UPLOADED_SYMBOL = (
      <AiOutlineFieldTime
        size={18}
        color="orange"
        title="Uploaded successfully"
      />
    );
    let FILE_MISSING_SYMBOL = (
      <AiFillQuestionCircle
        size={18}
        color="lightgray"
        title="No Document uploaded"
      />
    );
    let FILE_DONT_CARE_SYMBOL = (
      <BsDash size={18} color="lightgray" title="Not needed" />
    );
    let SYMBOL_EXPLANATION = (
      <>
        <p></p>
        <p>
          {FILE_OK_SYMBOL}: The document is valid and can be used in the
          application.
        </p>
        <p>
          {FILE_NOT_OK_SYMBOL}: The document is invalud and cannot be used in
          the application. Please properly scan a new one.
        </p>
        <p>
          {FILE_UPLOADED_SYMBOL}: The document is uploaded. Your agent will
          check it as soon as possible.
        </p>
        <p>{FILE_MISSING_SYMBOL}: Please upload the copy of the document.</p>
        <p>{FILE_DONT_CARE_SYMBOL}: This document is not needed.</p>
      </>
    );

    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    const deleteStyle = 'danger';
    const graoutStyle = 'light';
    let value2 = Object.values(window.profile_list);
    let keys2 = Object.keys(window.profile_list);
    let object_init = {};
    let object_message = {};
    let object_date_init = {};
    let object_time_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = 'missing';
      object_message[keys2[i]] = '';
      object_date_init[keys2[i]] = '';
      object_time_init[keys2[i]] = '';
    }

    if (this.state.student.profile) {
      for (let i = 0; i < this.state.student.profile.length; i++) {
        if (this.state.student.profile[i].status === 'uploaded') {
          object_init[this.state.student.profile[i].name] = 'uploaded';
        } else if (this.state.student.profile[i].status === 'accepted') {
          object_init[this.state.student.profile[i].name] = 'accepted';
        } else if (this.state.student.profile[i].status === 'rejected') {
          object_init[this.state.student.profile[i].name] = 'rejected';
        } else if (this.state.student.profile[i].status === 'notneeded') {
          object_init[this.state.student.profile[i].name] = 'notneeded';
        } else if (this.state.student.profile[i].status === 'missing') {
          object_init[this.state.student.profile[i].name] = 'missing';
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
    documentlist22 = keys2.map((k, i) => {
      if (object_init[k] === 'uploaded') {
        return (
          <ButtonSetUploaded
            key={i + 1}
            role={this.props.user.role}
            isLoaded={this.state.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.state.student._id}
            onDownloadFilefromstudent={this.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
            SubmitGeneralFile={this.props.SubmitGeneralFile}
          />
        );
      } else if (object_init[k] === 'accepted') {
        return (
          <ButtonSetAccepted
            key={i + 1}
            role={this.props.user.role}
            isLoaded={this.state.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.state.student._id}
            onDownloadFilefromstudent={this.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
          />
        );
      } else if (object_init[k] === 'rejected') {
        return (
          <ButtonSetRejected
            key={i + 1}
            role={this.props.user.role}
            isLoaded={this.state.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            message={object_message[k]}
            student_id={this.state.student._id}
            onDownloadFilefromstudent={this.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
          />
        );
      } else if (object_init[k] === 'notneeded') {
        return (
          <ButtonSetNotNeeded
            key={i + 1}
            role={this.props.user.role}
            isLoaded={this.state.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.state.student._id}
            onDownloadFilefromstudent={this.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
          />
        );
      } else {
        return (
          <ButtonSetMissing
            key={i + 1}
            role={this.props.user.role}
            isLoaded={this.state.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            message={object_message[k]}
            student_id={this.state.student._id}
            onDownloadFilefromstudent={this.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={this.onUpdateProfileFilefromstudent}
            SubmitGeneralFile={this.SubmitGeneralFile}
            handleGeneralDocSubmit={this.handleGeneralDocSubmit}
          />
        );
      }
    });
    const student_editor = (
      <EditorDocsProgress
        student={this.state.student}
        accordionKeys={1}
        singleExpandtHandler={this.singleExpandtHandler}
        role={this.props.user.role}
      />
    );
    return (
      <>
        <Card className="mt-2">
          <Card.Header>
            <Card.Title as="h5">
              {this.state.student.firstname}
              {' ,'}
              {this.state.student.lastname}
            </Card.Title>
          </Card.Header>
        </Card>
        <Tabs
          defaultActiveKey={this.props.match.params.tab}
          id="uncontrolled-tab-example"
        >
          <Tab eventKey="profile" title="Profile Overview">
            <Table responsive>
              <thead>
                <tr>
                  <th>First-, Last Name</th>
                  <th>Agents</th>
                  <th>Editors</th>
                </tr>
              </thead>
              <StudentsAgentEditor student={this.state.student} />
            </Table>
            <Row>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>File Name:</th>
                    <th></th>
                    <th></th>
                    <th>Feedback</th>
                    <th></th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>{documentlist22}</tbody>
              </Table>
            </Row>
            <Row>{SYMBOL_EXPLANATION}</Row>
            <Row>
              <UploadAndGenerate
                user={this.state.student}
                student={this.state.student}
              />
            </Row>
          </Tab>
          <Tab eventKey="status" title="Status">
            <Row>
              <Table responsive>
                <Task student_id={this.state.student._id} />
              </Table>
            </Row>
          </Tab>
          <Tab eventKey="application-files" title="Application Files">
            <Row>
              <Col sm={12}>{student_editor}</Col>
            </Row>
          </Tab>
          <Tab eventKey="background" title="Background">
            <SurveyComponent
              academic_background={this.state.student.academic_background}
              isLoaded={this.state.isLoaded}
            />
          </Tab>
          <Tab eventKey="applied-schools" title="Applied Schools">
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
          </Tab>
        </Tabs>
      </>
    );
  }
}
export default ArchivStudent;
