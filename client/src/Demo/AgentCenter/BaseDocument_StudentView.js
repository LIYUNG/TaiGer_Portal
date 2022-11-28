import React from 'react';
import { Row, Col, Table, Card, Collapse } from 'react-bootstrap';
import ButtonSetUploaded from './ButtonSetUploaded';
import ButtonSetAccepted from './ButtonSetAccepted';
import ButtonSetRejected from './ButtonSetRejected';
import ButtonSetNotNeeded from './ButtonSetNotNeeded';
import ButtonSetMissing from './ButtonSetMissing';

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
    let value2 = Object.values(window.profile_list);
    let keys2 = Object.keys(window.profile_wtih_doc_link_list);
    let object_init = {};
    let object_message = {};
    let object_date_init = {};
    let object_time_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = { status: 'missing', link: '' };
      object_message[keys2[i]] = '';
      object_date_init[keys2[i]] = '';
      object_time_init[keys2[i]] = '';
    }
    // TODO: what if this.state.student.profile[i].name key not in base_docs_link[i].key?
    if (this.props.base_docs_link) {
      for (let i = 0; i < this.props.base_docs_link.length; i++) {
        object_init[this.props.base_docs_link[i].key].link =
          this.props.base_docs_link[i].link;
      }
    }
    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        let document_split = this.props.student.profile[i].path.replace(
          /\\/g,
          '/'
        );
        if (this.props.student.profile[i].status === 'uploaded') {
          object_init[this.props.student.profile[i].name].status = 'uploaded';
          object_init[this.props.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.props.student.profile[i].status === 'accepted') {
          object_init[this.props.student.profile[i].name].status = 'accepted';
          object_init[this.props.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.props.student.profile[i].status === 'rejected') {
          object_init[this.props.student.profile[i].name].status = 'rejected';
          object_init[this.props.student.profile[i].name].path =
            document_split.split('/')[1];
        } else if (this.props.student.profile[i].status === 'notneeded') {
          object_init[this.props.student.profile[i].name].status = 'notneeded';
        } else if (this.props.student.profile[i].status === 'missing') {
          object_init[this.props.student.profile[i].name].status = 'missing';
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
      object_init[k].status === 'uploaded' ? (
        <ButtonSetUploaded
          key={i + 1}
          role={this.props.role}
          link={object_init[k].link}
          path={object_init[k].path}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student_id={this.props.student._id}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={
            this.props.onUpdateProfileFilefromstudent
          }
          SubmitGeneralFile={this.props.SubmitGeneralFile}
        />
      ) : object_init[k].status === 'accepted' ? (
        <ButtonSetAccepted
          key={i + 1}
          role={this.props.role}
          link={object_init[k].link}
          path={object_init[k].path}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          student_id={this.props.student._id}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={
            this.props.onUpdateProfileFilefromstudent
          }
          SubmitGeneralFile={this.props.SubmitGeneralFile}
          deleteFileWarningModel={this.props.deleteFileWarningModel}
        />
      ) : object_init[k].status === 'rejected' ? (
        <ButtonSetRejected
          key={i + 1}
          role={this.props.role}
          link={object_init[k].link}
          path={object_init[k].path}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student_id={this.props.student._id}
          onDeleteFilefromstudent={this.props.onDeleteFilefromstudent}
          onUpdateProfileFilefromstudent={
            this.props.onUpdateProfileFilefromstudent
          }
          SubmitGeneralFile={this.props.SubmitGeneralFile}
          deleteFileWarningModel={this.props.deleteFileWarningModel}
        />
      ) : object_init[k].status === 'notneeded' ? (
        (this.props.role === 'Admin' || this.props.role === 'Agent') && (
          <ButtonSetNotNeeded
            key={i + 1}
            role={this.props.role}
            link={object_init[k].link}
            isLoaded={this.props.isLoaded}
            docName={value2[i]}
            date={object_date_init[k]}
            time={object_time_init[k]}
            k={k}
            student_id={this.props.student._id}
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
          link={object_init[k].link}
          isLoaded={this.props.isLoaded}
          docName={value2[i]}
          date={object_date_init[k]}
          time={object_time_init[k]}
          k={k}
          message={object_message[k]}
          student_id={this.props.student._id}
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
          <Card.Header>
            <Card.Title className="my-0 mx-0 text-light">
              {this.state.student.firstname}
              {' ,'}
              {this.state.student.lastname}
            </Card.Title>
          </Card.Header>
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
        </Card>
      </>
    );
  }
}

export default BaseDocument_StudentView;
