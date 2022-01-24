import React, { Component } from "react";
import { IoMdAdd } from "react-icons/io";
import { Button, Form, Row, Col } from "react-bootstrap";

class ToggleableUploadFileForm extends Component {
  // TODO: replace by database

  handleFormSubmit = (studentId, applicationId, docName) => {
    this.props.onFormSubmit(studentId, applicationId, docName);
  };

  render() {
    return (
      // <div className="ui basic content center aligned segment">
      <Row>
        {this.props.role === "Student" ? <Col md={6}></Col> : <></>}
        <Col md={6}>
          <Form
            onChange={(e) =>
              this.props.onFileChange(
                e,
                this.props.student._id,
                this.props.application.programId._id
              )
            }
            onClick={(e) => (e.target.value = null)}
          >
            <Form.File id={this.props.id}>
              {/* <Form.File.Label>Regular file input</Form.File.Label> */}
              {/* <Form.File.Input /> */}
              <Button className="ui basic button icon" size="sm">
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

export default ToggleableUploadFileForm;
