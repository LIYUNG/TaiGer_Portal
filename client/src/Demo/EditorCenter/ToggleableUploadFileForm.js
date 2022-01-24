import React, { Component } from "react";
import UploadFileForm from "./UploadFileForm";
import { IoMdAdd } from "react-icons/io";
import { Button, Form, Row, Col } from "react-bootstrap";

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
        // <div className="ui basic content center aligned segment">
        <Row>
          <Col md={6}>
            <Form
              onChange={(e) =>
                this.props.onFileChange(
                  e,
                  this.props.student._id,
                  this.props.application.programId._id
                  // this.props.document.name
                )
              }
              onClick={(e) => (e.target.value = null)}
            >
              <Form.File id={this.props.id}>
                {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                {/* <Form.File.Input /> */}
                <Button
                  className="ui basic button icon"
                  size="sm"
                  // onClick={this.handleFormOpen}
                >
                  <Form.File.Input />
                  <IoMdAdd />
                </Button>
              </Form.File>
            </Form>
          </Col>
        </Row>
      );
    }
  }
}

export default ToggleableUploadFileForm;
