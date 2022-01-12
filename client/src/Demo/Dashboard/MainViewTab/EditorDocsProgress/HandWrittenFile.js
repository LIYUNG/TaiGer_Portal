import React, { Component } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";

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

  handleSubmitFile = () => {
    this.props.onFormDelete(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.document.name
    );
  };

  render() {
    let fileStatus;
    if (this.props.document.status === "uploaded") {
      fileStatus = (
        <>
          <h4>Document Name: {this.props.document.name}</h4>
          <Col>
            <Row>
              <Form
                onChange={(e) => this.props.onFileChange(e)}
                // onClick={(e) => (e.target.value = null)}
              >
                <Form.File id={this.props.id}>
                  {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                  <Form.File.Input />
                </Form.File>
              </Form>
              <Button
                onClick={(e) =>
                  this.props.onSubmitFile(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    this.props.document.name
                  )
                }
              >
                Upload
              </Button>
              <Button
                onClick={(e) =>
                  this.props.onDownloadFile(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    this.props.document.name
                  )
                }
              >
                Download
              </Button>

              {this.props.role === "Student" ? (
                <></>
              ) : (
                <>
                  <Button
                    onClick={(e) =>
                      this.props.onDeleteFile(
                        e,
                        this.props.student._id,
                        this.props.application.programId._id,
                        this.props.document.name
                      )
                    }
                  >
                    Delete File
                  </Button>
                  <Button onClick={this.handleSubmit}>
                    Delete Placeholder
                  </Button>
                </>
              )}
            </Row>
          </Col>
        </>
      );
    } else if (this.props.document.status === "missing") {
      fileStatus = (
        <>
          <h5>Document Name: {this.props.document.name}</h5>
          <Col>
            <Row>
              <Form
                onChange={(e) => this.props.onFileChange(e)}
                // onClick={(e) => (e.target.value = null)}
              >
                <Form.File id={this.props.id}>
                  {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                  <Form.File.Input />
                </Form.File>
              </Form>
              <Button
                onClick={(e) =>
                  this.props.onSubmitFile(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    this.props.document.name
                  )
                }
              >
                Upload
              </Button>
              {this.props.role === "Student" ? (
                <></>
              ) : (
                <Button onClick={this.handleSubmit}>Delete Placeholder</Button>
              )}
            </Row>
          </Col>
        </>
      );
    } else {
      fileStatus = (
        <>
          <h5>Document Name: {this.props.document.name}</h5>
          <Col>
            <Row>
              <Form
                onChange={(e) => this.props.onFileChange(e)}
                // onClick={(e) => (e.target.value = null)}
              >
                <Form.File id={this.props.id}>
                  {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                  <Form.File.Input />
                </Form.File>
              </Form>
              <Button
                onClick={(e) =>
                  this.props.onSubmitFile(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    this.props.document.name
                  )
                }
              >
                Upload
              </Button>
              {this.props.role === "Student" ? (
                <></>
              ) : (
                <Button onClick={this.handleSubmit}>Delete Placeholder</Button>
              )}
            </Row>
          </Col>
        </>
      );
    }
    return <>{fileStatus}</>;
  }
}

export default HandWrittenFile;
