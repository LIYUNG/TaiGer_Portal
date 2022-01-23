import React, { Component } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";

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
    let fileStatus;
    console.log(this.props.document.path);
    let documenName = this.props.document.path.replaceAll("\\", "/");
    documenName = documenName.includes("/")
      ? documenName.split("/")[3]
      : "x";
    console.log(documenName);
    if (this.props.document.status === "uploaded") {
      fileStatus = (
        <>
          <Row>
            <Col md={2}>
              <p>{documenName}</p>
            </Col>
            {/* <Col md={2}>
              <Form
                onChange={(e) =>
                  this.props.onFileChange(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    // this.props.document.name
                  )
                }
                onClick={(e) => (e.target.value = null)}
              >
                <Form.File id={this.props.id}>
                  <Form.File.Input />
                </Form.File>
              </Form>
            </Col> */}
            {/* <Col md={2}>
              <Button
                size="sm"
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
            </Col> */}
            <Col md={2}>
              <Button
                size="sm"
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
            </Col>

            {this.props.role === "Student" ? (
              <></>
            ) : (
              <>
                {/* <Col md={2}>
                  <Button
                    size="sm"
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
                </Col> */}
                <Col md={2}>
                  <Button size="sm" onClick={this.handleSubmit}>
                    Delete Task
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </>
      );
    } else if (this.props.document.status === "missing") {
      fileStatus = (
        <>
          <Row>
            <Col md={2}>
              <p>Document Name: {this.props.document.name}</p>
            </Col>
            <Col md={2}>
              <Form
                onChange={(e) =>
                  this.props.onFileChange(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    // this.props.document.name
                  )
                }
                onClick={(e) => (e.target.value = null)}
              >
                <Form.File id={this.props.id}>
                  {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                  <Form.File.Input />
                </Form.File>
              </Form>
            </Col>
            <Col md={2}>
              <Button
                size="sm"
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
            </Col>
            <Col md={2}>
              {this.props.role === "Student" ? (
                <></>
              ) : (
                <Button size="sm" onClick={this.handleSubmit}>
                  Delete Task
                </Button>
              )}
            </Col>
          </Row>
        </>
      );
    } else {
      fileStatus = (
        <>
          <Row>
            <Col md={2}>
              <p>Document Name: {this.props.document.name}</p>
            </Col>
            <Col md={2}>
              <Form
                onChange={(e) => this.props.onFileChange(e)}
                // onClick={(e) => (e.target.value = null)}
              >
                <Form.File id={this.props.id}>
                  {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                  <Form.File.Input />
                </Form.File>
              </Form>
            </Col>
            <Col md={2}>
              <Button
                size="sm"
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
            </Col>
            <Col md={2}>
              {this.props.role === "Student" ? (
                <></>
              ) : (
                <Button size="sm" onClick={this.handleSubmit}>
                  Delete Placeholder
                </Button>
              )}
            </Col>
          </Row>
        </>
      );
    }
    return <>{fileStatus}</>;
  }
}

export default HandWrittenFile;
