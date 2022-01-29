import React, { Component } from "react";
// import HandWrittenFile from "./HandWrittenFile";
import { Form, Col, Row, Button } from "react-bootstrap";
import { AiOutlineDownload, AiOutlineDelete } from "react-icons/ai";
class EditableFile extends Component {

  handleDeleteGeneralFile = () => {
    this.props.onDeleteGeneralFile(
      this.props.student._id,
      this.props.document.name,
      this.props.whoupdate
    );
  };

  handleDeleteProgramSpecific = () => {
    this.props.onFormDelete(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.document.name,
      this.props.whoupdate
    );
  };

  render() {
    let fileStatus;
    let documenName = this.props.document.path.replaceAll("\\", "/");
    documenName = documenName.includes("/") ? documenName.split("/")[3] : "x";
    if (this.props.document.status === "uploaded") {
      fileStatus = (
        <>
          <Row>
            <Col md={8}>
              <p>
                {documenName}
                {", updated on "}
                {new Date(this.props.document.updatedAt).toLocaleDateString()}
                {", "}
                {new Date(this.props.document.updatedAt).toLocaleTimeString()}
              </p>
            </Col>
            <Col md={2}>
              {this.props.filetype === "General" ? (
                <Button
                  size="sm"
                  title="Download"
                  onClick={(e) =>
                    this.props.onDownloadGeneralFile(
                      e,
                      this.props.student._id,
                      this.props.document.name,
                      this.props.whoupdate
                    )
                  }
                >
                  <AiOutlineDownload size={20} />
                </Button>
              ) : (
                <Button
                  size="sm"
                  title="Download"
                  onClick={(e) =>
                    this.props.onDownloadProgramSpecificFile(
                      e,
                      this.props.student._id,
                      this.props.application.programId._id,
                      this.props.document.name,
                      this.props.whoupdate
                    )
                  }
                >
                  <AiOutlineDownload size={20} />
                </Button>
              )}
            </Col>
            {this.props.role === "Editor" ||
            this.props.whoupdate === "student" ? (
              <>
                <Col md={2}>
                  {this.props.filetype === "General" ? (
                    <Button
                      size="sm"
                      title="Delete"
                      variant="danger"
                      onClick={this.handleDeleteGeneralFile}
                    >
                      <AiOutlineDelete size={20} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      title="Delete"
                      variant="danger"
                      onClick={this.handleDeleteProgramSpecific}
                    >
                      <AiOutlineDelete size={20} />
                    </Button>
                  )}
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
          </Row>
        </>
      );
    }
    return <>{fileStatus}</>;
  }
}

export default EditableFile;
