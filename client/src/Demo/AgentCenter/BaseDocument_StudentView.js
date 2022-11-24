import React from 'react';
import { Row, Col, Table, Card, Collapse } from 'react-bootstrap';
// import UcFirst from "../../App/components/UcFirst";
import ButtonSetUploaded from './ButtonSetUploaded';
import ButtonSetAccepted from './ButtonSetAccepted';
import ButtonSetRejected from './ButtonSetRejected';
import ButtonSetNotNeeded from './ButtonSetNotNeeded';
import ButtonSetMissing from './ButtonSetMissing';

// import UploadAndGenerate from "../TaiGerAI/UploadAndGenerate";

class BaseDocument_StudentView extends React.Component {
  state = {
    student: this.props.student,
    student_id: '',
    docName: '',
    file: ''
  };

  handleGeneralDocSubmit = (e, studentId, fileCategory) => {
    e.preventDefault();
    this.props.SubmitGeneralFile(e, studentId, fileCategory);
  };
  render() {
    // const deleteStyle = "danger";
    // const graoutStyle = "light";
    let value2 = Object.values(window.profile_list);
    let keys2 = Object.keys(window.profile_wtih_doc_link_list);
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

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === 'uploaded') {
          object_init[this.props.student.profile[i].name] = 'uploaded';
        } else if (this.props.student.profile[i].status === 'accepted') {
          object_init[this.props.student.profile[i].name] = 'accepted';
        } else if (this.props.student.profile[i].status === 'rejected') {
          object_init[this.props.student.profile[i].name] = 'rejected';
        } else if (this.props.student.profile[i].status === 'notneeded') {
          object_init[this.props.student.profile[i].name] = 'notneeded';
        } else if (this.props.student.profile[i].status === 'missing') {
          object_init[this.props.student.profile[i].name] = 'missing';
        }
        object_message[this.props.student.profile[i].name] = this.props.student
          .profile[i].feedback
          ? this.props.student.profile[i].feedback
          : '';
        object_date_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleDateString();
        object_time_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleTimeString();
      }
    } else {
    }
    var file_information;
    file_information = keys2.map((k, i) =>
      object_init[k] === 'uploaded' ? (
        <ButtonSetUploaded
          key={i + 1}
          role={this.props.role}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student_id={this.props.student._id}
          onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={
            this.props.onUpdateProfileFilefromstudent
          }
          SubmitGeneralFile={this.props.SubmitGeneralFile}
        />
      ) : object_init[k] === 'accepted' ? (
        <ButtonSetAccepted
          key={i + 1}
          role={this.props.role}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student_id={this.props.student._id}
          onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={
            this.props.onUpdateProfileFilefromstudent
          }
          SubmitGeneralFile={this.props.SubmitGeneralFile}
          deleteFileWarningModel={this.props.deleteFileWarningModel}
        />
      ) : object_init[k] === 'rejected' ? (
        <ButtonSetRejected
          key={i + 1}
          role={this.props.role}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student_id={this.props.student._id}
          onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={
            this.props.onUpdateProfileFilefromstudent
          }
          SubmitGeneralFile={this.props.SubmitGeneralFile}
          deleteFileWarningModel={this.props.deleteFileWarningModel}
        />
      ) : object_init[k] === 'notneeded' ? (
        (this.props.role === 'Admin' || this.props.role === 'Agent') && (
          <ButtonSetNotNeeded
            key={i + 1}
            role={this.props.role}
            isLoaded={this.props.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.props.student._id}
            onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
            onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
            onUpdateProfileFilefromstudent={
              this.props.onUpdateProfileFilefromstudent
            }
            SubmitGeneralFile={this.props.SubmitGeneralFile}
            deleteFileWarningModel={this.props.deleteFileWarningModel}
          />
        )
      ) : (
        <ButtonSetMissing
          key={i + 1}
          role={this.props.role}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student_id={this.props.student._id}
          onDownloadFilefromstudent={this.props.onDownloadFilefromstudent}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={
            this.props.onUpdateProfileFilefromstudent
          }
          SubmitGeneralFile={this.props.SubmitGeneralFile}
          handleGeneralDocSubmit={this.handleGeneralDocSubmit}
        />
      )
    );

    return (
      <>
        <Card
          className="mb-2 mx-0"
          bg={'dark'}
          text={'light'}
          key={this.props.idx}
        >
          <Card.Header
            onClick={() => this.props.singleExpandtHandler(this.props.idx)}
          >
            <Card.Title
              aria-controls={'accordion' + this.props.idx}
              aria-expanded={
                this.props.accordionKeys[this.props.idx] === this.props.idx
              }
              className="my-0 mx-0 text-light"
            >
              {this.state.student.firstname}
              {' ,'}
              {this.state.student.lastname}
            </Card.Title>
          </Card.Header>
          <Collapse
            in={this.props.accordionKeys[this.props.idx] === this.props.idx}
          >
            <div id="accordion1">
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
                      <th>Feedback</th>
                      <th></th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>{file_information}</tbody>
                </Table>
              </Row>
              <Row>
                <Col className="md-4">{this.props.SYMBOL_EXPLANATION}</Col>
              </Row>
              <Row>
                {/* <UploadAndGenerate
                    user={this.state.student}
                    student={this.state.student}
                  /> */}
              </Row>
            </div>
          </Collapse>
        </Card>
      </>
    );
  }
}

export default BaseDocument_StudentView;
