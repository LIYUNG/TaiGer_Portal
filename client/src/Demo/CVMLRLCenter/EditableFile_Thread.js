import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {
  // AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineCheck,
  // AiOutlineComment,
  AiOutlineUndo
  // AiFillMessage
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { convertDate } from '../Utils/contants';

class EditableFile_Thread extends Component {
  handleAsFinalFileThread = (documenName) => {
    this.props.handleAsFinalFile(
      this.props.thread.doc_thread_id._id,
      this.props.student._id,
      this.props.program_id,
      documenName
    );
  };

  handleDeleteFileThread = () => {
    this.props.onDeleteFileThread(
      this.props.thread.doc_thread_id._id,
      this.props.application,
      this.props.student._id
    );
  };

  handleDeleteProgramSpecificFileThread = () => {
    this.props.onDeleteProgramSpecificThread(
      this.props.thread.doc_thread_id._id,
      this.props.program_id,
      this.props.student._id
    );
  };

  render() {
    let fileStatus;
    let documenName;
    let school_program_name;
    // let program_deadline;
    if (this.props.application) {
      school_program_name =
        this.props.application.programId.school +
        ' - ' +
        this.props.application.programId.program_name;
      documenName =
        this.props.student.firstname +
        ' - ' +
        this.props.student.lastname +
        ' ' +
        school_program_name +
        ' ' +
        this.props.thread.doc_thread_id.file_type;
      // program_deadline = this.props.application.programId.application_deadline
    } else {
      documenName =
        this.props.student.firstname +
        ' - ' +
        this.props.student.lastname +
        ' ' +
        this.props.thread.doc_thread_id.file_type;
    }

    fileStatus = (
      <>
        <Row>
          <Col md={1}>
            {this.props.role === 'Student' || this.props.role === 'Guest' ? (
              this.props.thread.isFinalVersion && (
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  title="Final Version"
                  // onMouseEnter={this.MouseOver}
                />
              )
            ) : this.props.thread.isFinalVersion ? (
              <>
                <IoCheckmarkCircle
                  size={24}
                  color="limegreen"
                  title="Final Version"
                  // onMouseEnter={this.MouseOver}
                />
              </>
            ) : (
              // <Button
              //   size="sm"
              //   title="As final version"
              //   onClick={() => this.handleAsFinalFileThread(documenName)}
              // >
              <AiOutlineCheck
                size={24}
                color="white"
                style={{ cursor: 'pointer' }}
                title="Set as final version"
                onClick={() => this.handleAsFinalFileThread(documenName)}
              />
              // </Button>
            )}
          </Col>

          <Col md={1}>
            {this.props.thread.isFinalVersion ? (
              this.props.role === 'Student' || this.props.role === 'Guest' ? (
                <p>Closed</p>
              ) : (
                <AiOutlineUndo
                  size={24}
                  color="red"
                  title="Un do Final Version"
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.handleAsFinalFileThread(documenName)}
                />
              )
            ) : (
              <></>
            )}
          </Col>

          <Col md={6}>
            <Link
              to={
                '/document-modification/' + this.props.thread.doc_thread_id._id
              }
              className="text-info"
              style={{ textDecoration: 'none' }}
            >
              {documenName}
            </Link>
          </Col>
          <Col md={2}>
            {convertDate(this.props.thread.doc_thread_id.updatedAt)}
          </Col>
          {this.props.role === 'Student' || this.props.role === 'Guest' ? (
            <></>
          ) : (
            <Col md={1}>
              <Button
                size="sm"
                style={{ cursor: 'pointer' }}
                title="Delete"
                variant="danger"
                onClick={this.handleDeleteFileThread}
              >
                <AiOutlineDelete size={20} />
              </Button>
            </Col>
          )}
        </Row>
      </>
    );

    return <>{fileStatus}</>;
  }
}

export default EditableFile_Thread;
