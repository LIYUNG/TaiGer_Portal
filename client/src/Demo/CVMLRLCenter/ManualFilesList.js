import React, { Component } from "react";
// import EditableFile from "./EditableFile";
import EditableFile_Thread from "./EditableFile_Thread";
import { Row, Col } from "react-bootstrap";

class ManualFilesList extends Component {
  render() {
    let editor_outputs;
    let student_inputs;
    if (this.props.filetype === "General") {
      if (this.props.student.generaldocs_threads) {
        editor_outputs = this.props.student.generaldocs_threads.map(
          (thread) => (
            <EditableFile_Thread
              key={thread._id}
              thread={thread}
              student={this.props.student}
              onFormSubmit={this.props.onFormSubmit}
              onDownloadGeneralFile={this.props.onDownloadGeneralFile}
              onCommentsGeneralFile={this.props.onCommentsGeneralFile}
              onStudentFeedbackGeneral={this.props.onStudentFeedbackGeneral}
              onTrashClick={this.props.onTrashClick}
              onDeleteProgramSpecificThread={
                this.props.onDeleteProgramSpecificThread
              }
              onDeleteFileThread={this.props.onDeleteFileThread}
              handleAsFinalFile={this.props.handleAsFinalFile}
              role={this.props.role}
              whoupdate={"Editor"}
              filetype={this.props.filetype}
            />
          )
        );
      }
    } else {
      if (this.props.application && this.props.application.documents) {
        editor_outputs = this.props.application.documents.map((document) => (
          <EditableFile_Thread
            key={document._id}
            document={document}
            application={this.props.application}
            student={this.props.student}
            onCommentsProgramSpecific={this.props.onCommentsProgramSpecific}
            onStudentFeedbackProgramSpecific={
              this.props.onStudentFeedbackProgramSpecific
            }
            onDownloadProgramSpecificFile={
              this.props.onDownloadProgramSpecificFile
            }
            onTrashClick={this.props.onTrashClick}
            onDeleteProgramSpecificThread={
              this.props.onDeleteProgramSpecificThread
            }
            handleAsFinalProgramSpecific={
              this.props.handleAsFinalProgramSpecific
            }
            role={this.props.role}
            whoupdate={"Editor"}
            filetype={this.props.filetype}
          />
        ));
      }
      // if (this.props.application && this.props.application.student_inputs) {
      //   student_inputs = this.props.application.student_inputs.map(
      //     (student_input) => (
      //       <EditableFile
      //         key={student_input._id}
      //         document={student_input}
      //         application={this.props.application}
      //         student={this.props.student}
      //         onCommentsProgramSpecific={this.props.onCommentsProgramSpecific}
      //         onStudentFeedbackProgramSpecific={
      //           this.props.onStudentFeedbackProgramSpecific
      //         }
      //         onDownloadProgramSpecificFile={
      //           this.props.onDownloadProgramSpecificFile
      //         }
      //         onTrashClick={this.props.onTrashClick}
      //         onDeleteProgramSpecificThread={
      //           this.props.onDeleteProgramSpecificThread
      //         }
      //         handleAsFinalProgramSpecific={
      //           this.props.handleAsFinalProgramSpecific
      //         }
      //         role={this.props.role}
      //         whoupdate={"Student"}
      //         filetype={this.props.filetype}
      //       />
      //     )
      //   );
      // }
    }

    return (
      <>
        <Row>
          <>
            <Col>{editor_outputs}</Col>
            {/* <Col md={6}>{student_inputs}</Col> */}
          </>
        </Row>
      </>
    );
  }
}

export default ManualFilesList;
