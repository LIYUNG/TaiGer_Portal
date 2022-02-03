import React, { Component } from "react";
// import HandWrittenFile from "./HandWrittenFile";
import { Form, Col, Row, Button } from "react-bootstrap";
import {
  AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineComment,
} from "react-icons/ai";
class EditableFile extends Component {
  handleAsFinalGeneralFile = () => {
    this.props.handleAsFinalGeneralFile(
      this.props.student._id,
      this.props.document.name,
      this.props.whoupdate
    );
  };

  handleAsFinalProgramSpecific = () => {
    this.props.handleAsFinalProgramSpecific(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.document.name,
      this.props.whoupdate
    );
  };

  handleDeleteGeneralFile = () => {
    this.props.onDeleteGeneralFile(
      this.props.student._id,
      this.props.document.name,
      this.props.whoupdate
    );
  };

  handleDeleteProgramSpecific = () => {
    this.props.onDeleteProgramSpecificFile(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.document.name,
      this.props.whoupdate
    );
  };

  handleCommentsGeneralFile = () => {
    this.props.onCommentsGeneralFile(
      this.props.student._id,
      this.props.document.name,
      this.props.whoupdate,
      this.props.document.feedback
    );
  };

  handleCommentsProgramSpecific = () => {
    this.props.onCommentsProgramSpecific(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.document.name,
      this.props.whoupdate,
      this.props.document.feedback
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
            <Col md={1}>
              {this.props.role === "Editor" ? (
                <>
                  <Col md={1}>
                    {this.props.filetype === "General" ? (
                      <Button
                        size="sm"
                        title="As final version"
                        onClick={this.handleAsFinalGeneralFile}
                      >
                        <AiOutlineCheck size={12} />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        title="As final version"
                        onClick={this.handleAsFinalProgramSpecific}
                      >
                        <AiOutlineCheck size={12} />
                      </Button>
                    )}
                  </Col>
                </>
              ) : (
                <></>
              )}
            </Col>
            <Col md={5}>
              <p>{documenName}</p>
            </Col>
            <Col md={2}>
              {new Date(this.props.document.updatedAt).toLocaleDateString()}
              {", "}
              {new Date(this.props.document.updatedAt).toLocaleTimeString()}
            </Col>
            <Col md={1}>
              {this.props.filetype === "General" ? (
                <Button
                  size="sm"
                  title="Download"
                  on
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
            <Col md={1}>
              {this.props.filetype === "General" ? (
                <Button
                  size="sm"
                  title="Comments"
                  variant="light"
                  onClick={this.handleCommentsGeneralFile}
                >
                  <AiOutlineComment size={20} />
                </Button>
              ) : (
                <Button
                  size="sm"
                  title="Comments"
                  variant="light"
                  onClick={this.handleCommentsProgramSpecific}
                >
                  <AiOutlineComment size={20} />
                </Button>
              )}
            </Col>

            {this.props.role === "Editor" ||
            this.props.whoupdate === "Student" ? (
              <>
                <Col md={1}>
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
          <Row></Row>
        </>
      );
    }
    return <>{fileStatus}</>;
  }
}

export default EditableFile;
