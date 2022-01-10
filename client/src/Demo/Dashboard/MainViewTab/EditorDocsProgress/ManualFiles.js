import React from "react";
import ManualFilesList from "./ManualFilesList";
import ToggleableUploadFileForm from "./ToggleableUploadFileForm";
import {
  createManualFileUploadPlace,
  createArticle,
  getApplicationArticle,
} from "../../../../api";

class ManualFiles extends React.Component {
  createManualFileUpload = (studentId, applicationId, docName) => {
    createManualFileUploadPlace(studentId, applicationId, docName).then(
      (resp) => {},
      (error) => {}
    );
  };

  handleCreateFormSubmit = (studentId, applicationId, docName) => {
    this.createManualFileUpload(studentId, applicationId, docName);
  };
  render() {
    return (
      <>
        <ManualFilesList
          application={this.props.application}
          student={this.props.student}
          category="application"
          onFormSubmit={this.handleEditFormSubmit}
          onTrashClick={this.handleTrashClick}
          role={this.props.role}
        />
        {this.props.role === "Agent" || this.props.role === "Admin" ? (
          <ToggleableUploadFileForm
            role={this.props.role}
            category="application"
            student={this.props.student}
            application={this.props.application}
            onFormSubmit={this.handleCreateFormSubmit}
          />
        ) : (
          <></>
        )}
        {this.props.application.programId.University_}
      </>
    );
  }
}

export default ManualFiles;
