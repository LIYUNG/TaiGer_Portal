import React from "react";
import ManualFilesList from "./ManualFilesList";
import ToggleableUploadFileForm from "./ToggleableUploadFileForm";

class ManualFiles extends React.Component {
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
          onFormSubmit={this.handleEditFormSubmit}
          onTrashClick={this.handleTrashClick}
          onDownloadFile={this.props.onDownloadFile}
          onDeleteFile={this.props.onDeleteFile}
          onFileChange={this.props.onFileChange}
          onSubmitFile={this.props.onSubmitFile}
          onFormDelete={this.handleDeleteFormSubmit}
          role={this.props.role}
        />
        {this.props.role === "Agent" || this.props.role === "Admin" ? (
          <ToggleableUploadFileForm
            role={this.props.role}
            category="application"
            student={this.props.student}
            application={this.props.application}
          />
        ) : (
          <></>
        )}
        {/* {this.props.application.programId.school} */}
      </>
    );
  }
}

export default ManualFiles;
