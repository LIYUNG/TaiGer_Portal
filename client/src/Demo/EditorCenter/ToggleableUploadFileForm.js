import React, { Component } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { Button, Form, Row, Col } from "react-bootstrap";

class ToggleableUploadFileForm extends Component {
  state = {
    category: "",
  };

  handleFormSubmit = (e, studentId, applicationId) => {
    e.preventDefault();
    console.log(this.state.category);
    console.log(e.target.files);
    if (!this.state.category) {
      alert("Please select file type");
    } else {
      this.props.onFileChange(e, studentId, applicationId);
      this.setState({ category: "" });
    }
  };
  handleSelect = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({ category: e.target.value });
  };

  render() {
    let StudentSelectForm;
    let EditorSelectForm;
    console.log(this.state.category);

    if (this.props.filetype === "General") {
      StudentSelectForm = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.handleSelect(e)}
              value={this.state.category}
            >
              <option value="">Please Select</option>
              <option value="cvtemplate">CV Template</option>
              <option value="rltemplate">RL Template</option>
              <option value="others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
      EditorSelectForm = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.handleSelect(e)}
              value={this.state.category}
            >
              <option value="">Please Select</option>
              <option value="cv">CV</option>
              <option value="rl">RL</option>
              <option value="others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
    } else {
      StudentSelectForm = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.handleSelect(e)}
              value={this.state.category}
            >
              <option value="">Please Select</option>
              <option value="mltemplate">ML Template</option>
              <option value="essay">Essay</option>
              <option value="scholarshipsform">Scholarship Form</option>
              <option value="others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
      EditorSelectForm = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.handleSelect(e)}
              value={this.state.category}
            >
              <option value="">Please Select</option>
              <option value="ml">ML</option>
              <option value="essay">Essay</option>
              <option value="scholarshipsform">Scholarship Form</option>
              <option value="others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
    }
    return (
      // <div className="ui basic content center aligned segment">
      <Row>
        {this.props.role === "Student" ? (
          <>
            {" "}
            <Col md={6}></Col>
            <Col md={3}>{StudentSelectForm}</Col>
          </>
        ) : (
          <>
            {" "}
            <Col md={3}>{EditorSelectForm}</Col>
          </>
        )}

        <Col md={2}>
          <Form>
            <Form.File.Label
              onChange={(e) =>
                this.handleFormSubmit(
                  e,
                  this.props.student._id,
                  this.props.application.programId._id
                )
              }
              onClick={(e) => (e.target.value = null)}
            >
              <Form.File.Input hidden />
              <IoMdCloudUpload size={32} />
            </Form.File.Label>
          </Form>
          {/* <IoMdCloudUpload /> */}
        </Col>
      </Row>
    );
  }
}

export default ToggleableUploadFileForm;
