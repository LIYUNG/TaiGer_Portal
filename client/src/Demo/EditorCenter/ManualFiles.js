import React from "react";
import ManualFilesList from "./ManualFilesList";
import ToggleableUploadFileForm from "./ToggleableUploadFileForm";

class ManualFiles extends React.Component {
  handleCreateFormSubmit = (studentId, applicationId, docName) => {
    this.props.createManualFileUploadPlaceholder(
      studentId,
      applicationId,
      docName
    );
  };

  handleDeleteFormSubmit = (studentId, applicationId, docName) => {
    this.props.deleteManualFileUploadPlaceholder(
      studentId,
      applicationId,
      docName
    );
  };

  render() {
    return (
      <>
        <ManualFilesList
          application={this.props.application}
          student={this.props.student}
          category="application"
          onDownloadFile={this.props.onDownloadFile}
          onDeleteFile={this.props.onDeleteFile}
          onFileChange={this.props.onFileChange}
          onSubmitFile={this.props.onSubmitFile}
          onFormDelete={this.handleDeleteFormSubmit}
          role={this.props.role}
        />
        {this.props.role === "Agent" ||
        this.props.role === "Admin" ||
        this.props.role === "Editor" ||
        this.props.role === "Student" ? (
          <ToggleableUploadFileForm
            role={this.props.role}
            category="application"
            student={this.props.student}
            onFileChange={this.props.onFileChange}
            onSubmitFile={this.props.onSubmitFile}
            application={this.props.application}
            onFormSubmit={this.handleCreateFormSubmit}
          />
        ) : (
          <></>
        )}
        {/* {this.props.application.programId.University_} */}
      </>
    );
  }
}

export default ManualFiles;
