import React, { Component } from "react";
import { AiFillEdit } from "react-icons/ai";
import { Form, Col, Button } from "react-bootstrap";

import { BsTrash } from "react-icons/bs";
class HandWrittenFile extends Component {
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };

  handleSubmit = () => {
    this.props.onFormDelete(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.document.name
    );
  };

  
  render() {
    return (
      <div>
        <h5>Document Name: {this.props.document.name}</h5>
        <Col>
          <Form
          // onChange={(e) => this.props.onFileChange(e)}
          // onClick={(e) => (e.target.value = null)}
          >
            <Form.File id={this.props.id}>
              {/* <Form.File.Label>Regular file input</Form.File.Label> */}
              <Form.File.Input />
            </Form.File>
          </Form>
        </Col>
        <Button>Upload</Button>
        <Button>Download</Button>
        <Button onClick={this.handleSubmit}>Delete</Button>
      </div>
    );
  }
}

export default HandWrittenFile;
