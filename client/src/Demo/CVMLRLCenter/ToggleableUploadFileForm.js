import React, { Component } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';

class ToggleableUploadFileForm extends Component {
  render() {
    var drop_list;
    var thread_name =
      this.props.student.firstname +
      '-' +
      this.props.student.lastname +
      ' ' +
      this.props.category;

    if (this.props.filetype === 'General') {
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
              <option value="Recommendation_Letter_A">Recommendation Letter (A)</option>
              <option value="Recommendation_Letter_B">Recommendation Letter (B)</option>
              <option value="Recommendation_Letter_C">Recommendation Letter (C)</option>
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
              <option value="Portfolio">Portfolio</option>
              <option value="Internship_Form">Internship Form</option>
              <option value="Supplementary_Form">Supplementary Form</option>
              <option value="Scholarship_Form">Scholarship Form / ML</option>
              <option value="RL_A">RL (Referee A)</option>
              <option value="RL_B">RL (Referee B)</option>
              <option value="RL_C">RL (Referee C)</option>
              <option value="Others">Others</option>
            </Form.Control>
          </Form.Group>
        </Form>
      );
    }
    return (
      // <div className="ui basic content center aligned segment">
      <Row className='my-2'>
        <Col md={6}>{drop_list}</Col>
        <Col md={1}>
          {this.props.filetype === 'General' ? (
            <Button
              variant="primary"
              onClick={(e) =>
                this.props.handleCreateGeneralMessageThread(
                  e,
                  this.props.student._id,
                  this.props.category,
                  thread_name
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
                  this.props.application.programId._id,
                  this.props.category,
                  thread_name
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
