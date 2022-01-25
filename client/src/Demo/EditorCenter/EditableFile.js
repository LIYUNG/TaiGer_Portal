import React, { Component } from "react";
// import HandWrittenFile from "./HandWrittenFile";
import { Form, Col, Row, Button } from "react-bootstrap";
import { AiOutlineDownload, AiOutlineDelete } from "react-icons/ai";
class EditableFile extends Component {
  handleTrashClick = () => {
    this.props.onTrashClick(this.props.id);
  };

  handleDelete = () => {
    this.props.onFormDelete(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.document.name,
      this.props.whoupdate
    );
  };

  render() {
    let fileStatus;
    console.log(this.props.document.path);
    let documenName = this.props.document.path.replaceAll("\\", "/");
    documenName = documenName.includes("/") ? documenName.split("/")[3] : "x";
    console.log(documenName);
    if (this.props.document.status === "uploaded") {
      fileStatus = (
        <>
          <Row>
            <Col md={8}>
              <p>{documenName}</p>
            </Col>
            <Col md={2}>
              <Button
                size="sm"
                title="Download"
                onClick={(e) =>
                  this.props.onDownloadFile(
                    e,
                    this.props.student._id,
                    this.props.application.programId._id,
                    this.props.document.name,
                    this.props.whoupdate
                  )
                }
              >
                <AiOutlineDownload size={16} />
              </Button>
            </Col>
            {this.props.role === "Editor" ||
            this.props.whoupdate === "student" ? (
              <>
                <Col md={2}>
                  <Button
                    size="sm"
                    title="Delete"
                    variant="danger"
                    onClick={this.handleDelete}
                  >
                    <AiOutlineDelete size={16} />
                  </Button>
                </Col>
              </>
            ) : (
              <></>
            )}
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
                <Button size="sm" onClick={this.handleDelete}>
                  Delete
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

export default EditableFile;
