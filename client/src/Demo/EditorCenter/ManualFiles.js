import React from "react";
import ManualFilesList from "./ManualFilesList";
import ToggleableUploadFileForm from "./ToggleableUploadFileForm";

class ManualFiles extends React.Component {
  handleDeleteFormSubmit = (studentId, applicationId, docName, whoupdate) => {
    this.props.onDeleteFile(studentId, applicationId, docName, whoupdate);
  };

  render() {
    return (
      <>
        {this.props.filetype === "General" ? (
          <>
            <ManualFilesList
              filetype={this.props.filetype}
              application={this.props.application}
              student={this.props.student}
              onDownloadFile={this.props.onDownloadFile}
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
                student={this.props.student}
                onFileChange={this.props.onFileChange}
                onSubmitFile={this.props.onSubmitFile}
                filetype={this.props.filetype}
                application={this.props.application}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <ManualFilesList
              filetype={this.props.filetype}
              application={this.props.application}
              student={this.props.student}
              onDownloadFile={this.props.onDownloadFile}
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
                student={this.props.student}
                onFileChange={this.props.onFileChange}
                onSubmitFile={this.props.onSubmitFile}
                filetype={this.props.filetype}
                application={this.props.application}
              />
            ) : (
              <></>
            )}
          </>
        )}
      </>
    );
  }
}

export default ManualFiles;
