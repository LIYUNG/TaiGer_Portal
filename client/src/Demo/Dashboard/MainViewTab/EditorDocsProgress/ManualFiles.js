import React from "react";
import ManualFilesList from "./ManualFilesList";
import ToggleableUploadFileForm from "./ToggleableUploadFileForm";
import {
  createManualFileUploadPlace,
  deleteManualFileUploadPlace,
  createArticle,
  getApplicationArticle,
} from "../../../../api";

class ManualFiles extends React.Component {



  handleCreateFormSubmit = (studentId, applicationId, docName) => {
    this.props.createManualFileUpload(studentId, applicationId, docName);
  };

  handleDeleteFormSubmit = (studentId, applicationId, docName) => {
    this.props.deleteManualFileUpload(studentId, applicationId, docName);
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
          onFormDelete={this.handleDeleteFormSubmit}
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
