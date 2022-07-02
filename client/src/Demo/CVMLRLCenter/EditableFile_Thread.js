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
  handleAsFinalFileThread = (action) => {
    this.props.handleAsFinalFile(
      this.props.thread.doc_thread_id._id,
      action
    );
  };

  handleDeleteFileThread = () => {
    this.props.onDeleteFileThread(
      this.props.thread.doc_thread_id._id,
      // this.props.application.programId._id,
      this.props.student._id
    );
  };

  handleDeleteProgramSpecificFileThread = () => {
    this.props.onDeleteProgramSpecificThread(
      this.props.thread.doc_thread_id._id,
      this.props.application.programId._id,
      this.props.student._id
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
            {this.props.thread.isFinalVersion ? (
              <>
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  title="Final Version"
                  // onMouseEnter={this.MouseOver}
                />
              </>
            ) : (
              <Button
                size="sm"
                title="As final version"
                onClick={() => this.handleAsFinalFileThread("setfinal")}
              >
                <AiOutlineCheck size={12} />
              </Button>
            )}
          </Col>
          <Col md={1}>
            {this.props.thread.isFinalVersion && (
              <AiOutlineUndo
                size={24}
                color="red"
                title="Un do Final Version"
                style={{ cursor: "pointer" }}
                onClick={() => this.handleAsFinalFileThread("undofinal")}
              />
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
            <Button
              size="sm"
              title="Delete"
              variant="danger"
              onClick={this.handleDeleteFileThread}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </Col>
        </Row>
      </>
    );

    return <>{fileStatus}</>;
  }
}

export default EditableFile_Thread;
