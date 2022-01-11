import React, { Component } from "react";
import EditableFile from "./EditableFile";

class ManualFilesList extends Component {

  render() {
    const articles = this.props.application.documents.map((document) => (
      <EditableFile
        key={document._id}
        document={document}
        application={this.props.application}
        student={this.props.student}
        category={this.props.category}
        onFormSubmit={this.props.onFormSubmit}
        onSubmitFile={this.props.onSubmitFile}
        onDownloadFile={this.props.onDownloadFile}
        onDeleteFile={this.props.onDeleteFile}
        onTrashClick={this.props.onTrashClick}
        onFormDelete={this.props.onFormDelete}
        onFileChange={this.props.onFileChange}
        role={this.props.role}
      />
    ));
    return <div>{articles}</div>;
  }
}

export default ManualFilesList;
