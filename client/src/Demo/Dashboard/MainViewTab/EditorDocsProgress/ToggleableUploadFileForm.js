import React, { Component } from "react";
import UploadFileForm from "./UploadFileForm";
import { IoMdAdd } from "react-icons/io";
import { Button } from "react-bootstrap";

class ToggleableUploadFileForm extends Component {
  // TODO: replace by database
  state = {
    isOpen: false,
  };
  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  handleFormSubmit = (studentId, applicationId, docName) => {
    this.props.onFormSubmit(studentId, applicationId, docName);
    this.setState({ isOpen: false });
  };

  render() {
    if (this.state.isOpen) {
      return (
        <UploadFileForm
          category={this.props.category}
          student={this.props.student}
          application={this.props.application}
          onFormSubmit={this.handleFormSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <div className="ui basic content center aligned segment">
          <Button
            className="ui basic button icon"
            onClick={this.handleFormOpen}
          >
            <IoMdAdd />
          </Button>
        </div>
      );
    }
  }
}

export default ToggleableUploadFileForm;
