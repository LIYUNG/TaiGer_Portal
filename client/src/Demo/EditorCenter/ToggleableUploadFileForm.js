import React, { Component } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { Button, Form, Row, Col } from "react-bootstrap";

class ToggleableUploadFileForm extends Component {

  render() {
    var StudentSelectForm;
    var EditorSelectForm;

    if (this.props.filetype === "General") {
      StudentSelectForm = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.props.handleSelect(e)}
              value={this.props.category}
            >
              <option value="">Please Select</option>
              <option value="CV_Template_Filled">CV Template</option>
              <option value="RL_Template_Filled">RL Template</option>
              <option value="Others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
      EditorSelectForm = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.props.handleSelect(e)}
              value={this.props.category}
            >
              <option value="">Please Select</option>
              <option value="CV">CV</option>
              <option value="RL">RL</option>
              <option value="Others">Others</option>
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
              onChange={(e) => this.props.handleSelect(e)}
              value={this.props.category}
            >
              <option value="">Please Select</option>
              <option value="ML_Template_Filled">ML Template</option>
              <option value="Essay_Draft">Essay</option>
              <option value="Scholarship_Form">Scholarship Form</option>
              <option value="Others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
      EditorSelectForm = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.props.handleSelect(e)}
              value={this.props.category}
            >
              <option value="">Please Select</option>
              <option value="ML">ML</option>
              <option value="Essay">Essay</option>
              <option value="Scholarship_Form">Scholarship Form</option>
              <option value="Others">Others</option>
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
            <Col md={6}></Col>
            <Col md={3}>{StudentSelectForm}</Col>
          </>
        ) : (
          <>
            <Col md={3}>{EditorSelectForm}</Col>
          </>
        )}

        <Col md={2}>
          {this.props.filetype === "General" ? (
            <Form>
              <Form.File.Label
                onChange={(e) =>
                  this.props.handleGeneralDocSubmit(
                    e,
                    this.props.student._id,
                    this.props.category
                  )
                }
                onClick={(e) => (e.target.value = null)}
              >
                <Form.File.Input hidden />
                <IoMdCloudUpload size={32} />
              </Form.File.Label>
            </Form>
          ) : (
            <Form>
              <Form.File.Label
                onChange={(e) =>
                  this.props.handleProgramSpecificFormSubmit(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    this.props.category
                  )
                }
                onClick={(e) => (e.target.value = null)}
              >
                <Form.File.Input hidden />
                <IoMdCloudUpload size={32} />
              </Form.File.Label>
            </Form>
          )}
        </Col>
      </Row>
    );
  }
}

export default ToggleableUploadFileForm;
