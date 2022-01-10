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
  state = {
    application: this.props.application,
  };
  createManualFileUpload = (studentId, applicationId, docName) => {
    createManualFileUploadPlace(studentId, applicationId, docName).then(
      (resp) => {
        console.log(resp.data.data);
        this.setState({
          application: resp.data.data,
        });
      },
      (error) => {}
    );
  };

  deleteManualFileUpload = (studentId, applicationId, docName) => {
    deleteManualFileUploadPlace(studentId, applicationId, docName).then(
      (resp) => {
        console.log(resp.data.data);
        this.setState({
          application: resp.data.data,
        });
      },
      (error) => {}
    );
  };

  handleCreateFormSubmit = (studentId, applicationId, docName) => {
    this.createManualFileUpload(studentId, applicationId, docName);
  };

  handleDeleteFormSubmit = (studentId, applicationId, docName) => {
    this.deleteManualFileUpload(studentId, applicationId, docName);
  };

  render() {
    return (
      <>
        <ManualFilesList
          application={this.state.application}
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
            application={this.state.application}
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
