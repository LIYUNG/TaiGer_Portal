import React, { Component } from "react";
// import EditableFile from "./EditableFile";
import EditableFile_Thread from "./EditableFile_Thread";
import { Row, Col } from "react-bootstrap";

class ManualFilesList extends Component {
  render() {
    let message_threads;
    if (this.props.application === null) {
      message_threads = this.props.student.generaldocs_threads
        ? this.props.student.generaldocs_threads.map((thread) => (
            <EditableFile_Thread
              key={thread._id}
              thread={thread}
              student={this.props.student}
              application={this.props.application}
              onFormSubmit={this.props.onFormSubmit}
              onTrashClick={this.props.onTrashClick}
              onDeleteProgramSpecificThread={
                this.props.onDeleteProgramSpecificThread
              }
              onDeleteFileThread={this.props.onDeleteFileThread}
              handleAsFinalFile={this.props.handleAsFinalFile}
              role={this.props.role}
            />
          ))
        : "";
    } else {
      message_threads =
        this.props.application && this.props.application.doc_modification_thread
          ? this.props.application.doc_modification_thread.map((thread) => (
              <EditableFile_Thread
                key={thread._id}
                thread={thread}
                application={this.props.application}
                student={this.props.student}
                onCommentsProgramSpecific={this.props.onCommentsProgramSpecific}
                onStudentFeedbackProgramSpecific={
                  this.props.onStudentFeedbackProgramSpecific
                }
                onTrashClick={this.props.onTrashClick}
                onDeleteProgramSpecificThread={
                  this.props.onDeleteProgramSpecificThread
                }
                handleAsFinalProgramSpecific={
                  this.props.handleAsFinalProgramSpecific
                }
                onDeleteFileThread={this.props.onDeleteFileThread}
                role={this.props.role}
              />
            ))
          : "";
    }

    return (
      <>
        <Row>
          <>
            <Col>{message_threads}</Col>
            {/* <Col md={6}>{student_inputs}</Col> */}
          </>
        </Row>
      </>
    );
  }
}

export default ManualFilesList;
