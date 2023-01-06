import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AiOutlineDelete, AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';

import { showButtonIfMyStudent } from '../Utils/checking-functions';
import { convertDate } from '../Utils/contants';

class EditableFile_Thread extends Component {
  handleAsFinalFileThread = (documenName, isFinal) => {
    this.props.handleAsFinalFile(
      this.props.thread.doc_thread_id._id,
      this.props.student._id,
      this.props.program_id,
      isFinal,
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
            {showButtonIfMyStudent(this.props.user, this.props.student) &&
              (this.props.user.role === 'Student' ||
              this.props.user.role === 'Guest' ? (
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
                <AiOutlineCheck
                  size={24}
                  color="white"
                  style={{ cursor: 'pointer' }}
                  title="Set as final version"
                  onClick={() =>
                    this.handleAsFinalFileThread(documenName, true)
                  }
                />
              ))}
          </Col>
          <Col md={1}>
            {this.props.thread.isFinalVersion ? (
              this.props.user.role !== 'Student' &&
              this.props.user.role !== 'Guest' &&
              showButtonIfMyStudent(this.props.user, this.props.student) ? (
                <AiOutlineUndo
                  size={24}
                  color="red"
                  title="Un do Final Version"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    this.handleAsFinalFileThread(documenName, false)
                  }
                />
              ) : (
                <p className="text-warning">Closed</p>
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
            <p className="text-light">
              {convertDate(this.props.thread.doc_thread_id.updatedAt)}
            </p>
          </Col>
          {this.props.user.role === 'Student' ||
          this.props.user.role === 'Guest' ? (
            <></>
          ) : (
            <Col md={1}>
              {showButtonIfMyStudent(this.props.user, this.props.student) && (
                <Button
                  size="sm"
                  style={{ cursor: 'pointer' }}
                  title="Delete"
                  variant="danger"
                  onClick={this.handleDeleteFileThread}
                >
                  <AiOutlineDelete size={20} />
                </Button>
              )}
            </Col>
          )}
        </Row>
      </>
    );

    return <>{fileStatus}</>;
  }
}

export default EditableFile_Thread;
