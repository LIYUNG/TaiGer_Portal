import React, { Component } from "react";
import EditableFile from "./EditableFile";
import { Row, Col } from "react-bootstrap";

class ManualFilesList extends Component {
  render() {
    let editor_outputs;
    let student_inputs;
    // if (this.props.filetype === "General") {
      if (this.props.application && this.props.application.documents) {
        editor_outputs = this.props.application.documents.map((document) => (
          <EditableFile
            key={document._id}
            document={document}
            application={this.props.application}
            student={this.props.student}
            onFormSubmit={this.props.onFormSubmit}
            onSubmitFile={this.props.onSubmitFile}
            onDownloadFile={this.props.onDownloadFile}
            onTrashClick={this.props.onTrashClick}
            onFormDelete={this.props.onFormDelete}
            onFileChange={this.props.onFileChange}
            role={this.props.role}
            whoupdate={"editor"}
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
              onFormSubmit={this.props.onFormSubmit}
              onSubmitFile={this.props.onSubmitFile}
              onDownloadFile={this.props.onDownloadFile}
              onTrashClick={this.props.onTrashClick}
              onFormDelete={this.props.onFormDelete}
              onFileChange={this.props.onFileChange}
              role={this.props.role}
              whoupdate={"student"}
              filetype={this.props.filetype}
            />
          )
        );
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
