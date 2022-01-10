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
        onTrashClick={this.props.onTrashClick}
        onFormDelete={this.props.onFormDelete}
        role={this.props.role}
      />
    ));
    return <div>{articles}</div>;
  }
}

export default ManualFilesList;
