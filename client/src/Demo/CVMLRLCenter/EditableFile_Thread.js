import React, { Component } from "react";
// import HandWrittenFile from "./HandWrittenFile";
import { Form, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineComment,
  AiOutlineUndo,
  AiFillMessage,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
class EditableFile_Thread extends Component {
  handleAsFinalGeneralFile = (action) => {
    this.props.handleAsFinalGeneralFile(
      this.props.student._id,
      this.props.thread.name,
      this.props.whoupdate,
      action
    );
  };

  handleAsFinalProgramSpecific = (action) => {
    this.props.handleAsFinalProgramSpecific(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.thread.name,
      this.props.whoupdate,
      action
    );
  };

  handleDeleteGeneralFile = () => {
    this.props.onDeleteGeneralFile(
      this.props.student._id,
      this.props.thread.name,
      this.props.whoupdate
    );
  };

  handleDeleteProgramSpecific = () => {
    this.props.onDeleteProgramSpecificFile(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.thread.name,
      this.props.whoupdate
    );
  };

  handleCommentsGeneralFile = () => {
    this.props.onCommentsGeneralFile(
      this.props.student._id,
      this.props.thread.name,
      this.props.whoupdate,
      this.props.thread.feedback,
      this.props.thread.updatedAt
    );
  };

  handleCommentsProgramSpecific = () => {
    this.props.onCommentsProgramSpecific(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.thread.name,
      this.props.whoupdate,
      this.props.thread.feedback,
      this.props.thread.updatedAt
    );
  };

  handleStudentFeebackGeneral = () => {
    this.props.onStudentFeedbackGeneral(
      this.props.student._id,
      this.props.thread.name,
      this.props.whoupdate,
      this.props.thread.student_feedback,
      this.props.thread.student_feedback_updatedAt
    );
  };

  handleStudentFeebackProgramSpecific = () => {
    this.props.onStudentFeedbackProgramSpecific(
      this.props.student._id,
      this.props.application.programId._id,
      this.props.thread.name,
      this.props.whoupdate,
      this.props.thread.student_feedback,
      this.props.thread.student_feedback_updatedAt
    );
  };

  MouseOver = () => {
    console.log("Mouse Over");
  };
  render() {
    let fileStatus;
    let documenName;

    // console.log(this.props.thread.doc_thread_id);

    documenName =
      this.props.student.firstname +
      " " +
      this.props.student.lastname +
      " " +
      this.props.thread.doc_thread_id.file_type;

    fileStatus = (
      <>
        <Row>
          <Col md={1}>
            {this.props.thread.doc_thread_id.file_type === "CV" ? (
              this.props.thread.isFinalVersion === true ? (
                <>
                  <IoCheckmarkCircle
                    size={24}
                    color="limegreen"
                    title="Final Version"
                  />
                </>
              ) : (
                <Button
                  size="sm"
                  title="As final version"
                  onClick={() => this.handleAsFinalGeneralFile("setfinal")}
                >
                  <AiOutlineCheck size={12} />
                </Button>
              )
            ) : this.props.thread.isFinalVersion === true ? (
              <>
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  title="Final Version"
                  onMouseEnter={this.MouseOver}
                />
              </>
            ) : (
              <Button
                size="sm"
                title="As final version"
                onClick={() => this.handleAsFinalProgramSpecific("setfinal")}
              >
                <AiOutlineCheck size={12} />
              </Button>
            )}
          </Col>
          <Col md={1}>
            {this.props.thread.doc_thread_id.file_type === "CV" ? (
              this.props.thread.isFinalVersion === true ? (
                <>
                  <AiOutlineUndo
                    size={24}
                    color="red"
                    title="Un do Final Version"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleAsFinalGeneralFile("undofinal")}
                  />
                </>
              ) : (
                <></>
              )
            ) : this.props.thread.isFinalVersion === true ? (
              <>
                <AiOutlineUndo
                  size={24}
                  color="red"
                  title="Un do Final Version"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleAsFinalProgramSpecific("undofinal")}
                />
              </>
            ) : (
              <></>
            )}
          </Col>
          <Col md={4}>
            <Link
              to={
                "/document-modification/" + this.props.thread.doc_thread_id._id
              }
            >
              {documenName}
            </Link>
          </Col>
          <Col md={2}>
            {new Date(
              this.props.thread.doc_thread_id.updatedAt
            ).toLocaleDateString()}
            {", "}
            {new Date(
              this.props.thread.doc_thread_id.updatedAt
            ).toLocaleTimeString()}
          </Col>

          <Col md={1}>
            {this.props.thread.doc_thread_id.file_type === "CV" ? (
              <Button
                size="sm"
                title="Download"
                on
                onClick={(e) =>
                  this.props.onDownloadGeneralFile(
                    e,
                    this.props.student._id,
                    this.props.thread.name,
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
                    this.props.thread.name,
                    this.props.whoupdate
                  )
                }
              >
                <AiOutlineDownload size={20} />
              </Button>
            )}
          </Col>
          <Col md={1}>
            {this.props.thread.doc_thread_id.file_type === "CV" ? (
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
          {this.props.whoupdate === "Editor" ? (
            this.props.role === "Editor" ? (
              <Col md={1}>
                {this.props.thread.doc_thread_id.file_type === "CV" ? (
                  <Button
                    size="sm"
                    title="Student Feedback"
                    variant="light"
                    onClick={this.handleStudentFeebackGeneral}
                  >
                    <AiFillMessage size={20} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    title="Student Feedback"
                    variant="light"
                    onClick={this.handleStudentFeebackProgramSpecific}
                  >
                    <AiFillMessage size={20} />
                  </Button>
                )}
              </Col>
            ) : (
              <Col md={1}>
                {this.props.thread.doc_thread_id.file_type === "CV" ? (
                  <Button
                    size="sm"
                    title="Give Feedback"
                    variant="light"
                    onClick={this.handleStudentFeebackGeneral}
                  >
                    <AiFillMessage size={20} />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    title="Give Feedback"
                    variant="light"
                    onClick={this.handleStudentFeebackProgramSpecific}
                  >
                    <AiFillMessage size={20} />
                  </Button>
                )}
              </Col>
            )
          ) : (
            <></>
          )}
          {this.props.role === "Editor" ||
          this.props.whoupdate === "Student" ? (
            <>
              <Col md={1}>
                {this.props.thread.doc_thread_id.file_type === "CV" ? (
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

    return <>{fileStatus}</>;
  }
}

export default EditableFile_Thread;
