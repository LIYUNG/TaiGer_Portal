import React, { Component } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { Button, Form, Row, Col } from "react-bootstrap";

class ToggleableUploadFileForm extends Component {
  render() {
    var drop_list;
    var EditorSelectForm;

    if (this.props.filetype === "General") {
      drop_list = (
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control
              as="select"
              onChange={(e) => this.props.handleSelect(e)}
              value={this.props.category}
            >
              <option value="">Please Select</option>
              <option value="CV">CV</option>
              <option value="RL_A">RL (Referee A)</option>
              <option value="RL_B">RL (Referee B)</option>
              <option value="RL_C">RL (Referee C)</option>
              <option value="Others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
    } else {
      drop_list = (
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
        <Col md={6}>{drop_list}</Col>

        <Col md={1}>
          {this.props.filetype === "General" ? (
            <Button
              variant="primary"
              onClick={(e) =>
                this.props.handleCreateGeneralMessageThread(
                  e,
                  this.props.student._id,
                  this.props.category
                )
              }
            >
              Create
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={(e) =>
                this.props.handleCreateProgramSpecificMessageThread(
                  e,
                  this.props.student._id,
                  this.props.application._id,
                  this.props.category
                )
              }
            >
              Create
            </Button>
          )}
        </Col>
      </Row>
    );
  }
}

export default ToggleableUploadFileForm;
