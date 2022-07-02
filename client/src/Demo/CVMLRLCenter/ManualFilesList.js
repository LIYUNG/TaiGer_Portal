import React, { Component } from "react";
import EditableFile from "./EditableFile";
import EditableFile_Thread from "./EditableFile_Thread";
import { Row, Col } from "react-bootstrap";

class ManualFilesList extends Component {
  render() {
    let editor_outputs;
    let student_inputs;
    if (this.props.filetype === "General") {
      if (
        this.props.student.generaldocs &&
        this.props.student.generaldocs.editoroutputs
      ) {
        // editor_outputs = this.props.student.generaldocs.editoroutputs.map(
        //   (editoroutput) => (
        //     <EditableFile
        //       key={editoroutput._id}
        //       document={editoroutput}
        //       student={this.props.student}
        //       onFormSubmit={this.props.onFormSubmit}
        //       onDownloadGeneralFile={this.props.onDownloadGeneralFile}
        //       onCommentsGeneralFile={this.props.onCommentsGeneralFile}
        //       onStudentFeedbackGeneral={this.props.onStudentFeedbackGeneral}
        //       onTrashClick={this.props.onTrashClick}
        //       onDeleteGeneralFile={this.props.onDeleteGeneralFile}
        //       handleAsFinalGeneralFile={this.props.handleAsFinalGeneralFile}
        //       role={this.props.role}
        //       whoupdate={"Editor"}
        //       filetype={this.props.filetype}
        //     />
        //   )
        // );
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
              onDeleteGeneralFile={this.props.onDeleteGeneralFile}
              handleAsFinalGeneralFile={this.props.handleAsFinalGeneralFile}
              role={this.props.role}
              whoupdate={"Editor"}
              filetype={this.props.filetype}
            />
          )
        );
      }
      if (
        this.props.student.generaldocs &&
        this.props.student.generaldocs.studentinputs
      ) {
        // student_inputs = this.props.student.generaldocs.studentinputs.map(
        //   (studentinput) => (
        //     <EditableFile
        //       key={studentinput._id}
        //       document={studentinput}
        //       student={this.props.student}
        //       onFormSubmit={this.props.onFormSubmit}
        //       onDownloadGeneralFile={this.props.onDownloadGeneralFile}
        //       onCommentsGeneralFile={this.props.onCommentsGeneralFile}
        //       onStudentFeedbackGeneral={this.props.onStudentFeedbackGeneral}
        //       onTrashClick={this.props.onTrashClick}
        //       onDeleteGeneralFile={this.props.onDeleteGeneralFile}
        //       handleAsFinalGeneralFile={this.props.handleAsFinalGeneralFile}
        //       role={this.props.role}
        //       whoupdate={"Student"}
        //       filetype={this.props.filetype}
        //     />
        //   )
        // );
        student_inputs = this.props.student.generaldocs.studentinputs.map(
          (studentinput) => (
            <EditableFile
              key={studentinput._id}
              document={studentinput}
              student={this.props.student}
              onFormSubmit={this.props.onFormSubmit}
              onDownloadGeneralFile={this.props.onDownloadGeneralFile}
              onCommentsGeneralFile={this.props.onCommentsGeneralFile}
              onStudentFeedbackGeneral={this.props.onStudentFeedbackGeneral}
              onTrashClick={this.props.onTrashClick}
              onDeleteGeneralFile={this.props.onDeleteGeneralFile}
              handleAsFinalGeneralFile={this.props.handleAsFinalGeneralFile}
              role={this.props.role}
              whoupdate={"Student"}
              filetype={this.props.filetype}
            />
          )
        );
      }
    } else {
      if (this.props.application && this.props.application.documents) {
        editor_outputs = this.props.application.documents.map((document) => (
          <EditableFile
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
            onDeleteProgramSpecificFile={this.props.onDeleteProgramSpecificFile}
            handleAsFinalProgramSpecific={
              this.props.handleAsFinalProgramSpecific
            }
            role={this.props.role}
            whoupdate={"Editor"}
            filetype={this.props.filetype}
          />
        ));
      }
      if (this.props.application && this.props.application.student_inputs) {
        student_inputs = this.props.application.student_inputs.map(
          (student_input) => (
            <EditableFile
              key={student_input._id}
              document={student_input}
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
              onDeleteProgramSpecificFile={
                this.props.onDeleteProgramSpecificFile
              }
              handleAsFinalProgramSpecific={
                this.props.handleAsFinalProgramSpecific
              }
              role={this.props.role}
              whoupdate={"Student"}
              filetype={this.props.filetype}
            />
          )
        );
      }
    }

    return (
      <>
        <Row>
          {/* {this.props.filetype === "ProgramSpecific" ? ( */}
          <>
            <Col md={6}>{editor_outputs}</Col>
            <Col md={6}>{student_inputs}</Col>
          </>
          {/* ) : (
            <></>
          )} */}
        </Row>
      </>
    );
  }
}

export default ManualFilesList;
