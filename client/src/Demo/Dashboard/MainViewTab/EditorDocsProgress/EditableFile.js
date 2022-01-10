import React, { Component } from "react";
import UploadFileForm from "./UploadFileForm";
import HandWrittenFile from "./HandWrittenFile";

class EditableFile extends Component {
  state = {
    editFormOpen: false,
  };

  handleEditClick = () => {
    this.openForm();
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleSubmit = (article) => {
    this.props.onFormSubmit(article);
    this.closeForm();
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };
  
  render() {
    if (this.state.editFormOpen) {
      return (
        <UploadFileForm
          id={this.props.id}
          category={this.props.category}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <HandWrittenFile
          id={this.props.id}
          document={this.props.document}
          application={this.props.application}
          student={this.props.student}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          lastupdate={this.props.lastupdate}
          role={this.props.role}
        />
      );
    }
  }
}

export default EditableFile;
