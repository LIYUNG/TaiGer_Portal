import React, { useState } from 'react';
import DEMO from '../../store/constant';
import { AiFillCloseCircle, AiFillQuestionCircle } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';

// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import {
  Row,
  Col,
  Button,
  Card,
  Collapse,
  Form,
  Modal,
  Spinner
} from 'react-bootstrap';
import {
  deleteGenralFileThread,
  deleteProgramSpecificFileThread,
  SetAsFinalGenralFile,
  initGeneralMessageThread,
  initApplicationMessageThread,
  SubmitMessageWithAttachment
} from '../../api';
import ManualFiles from './ManualFiles';
import {
  AiOutlineDownload,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineMore,
  AiOutlineUndo,
  AiFillMessage
} from 'react-icons/ai';
class EditorDocsProgress extends React.Component {
  state = {
    student: this.props.student,
    deleteFileWarningModel: false,
    SetAsFinalFileModel: false,
    CommentsModel: false,
    StudentFeedbackModel: false,
    ML_Requirements_Modal: false,
    studentId: '',
    student_id: '',
    doc_thread_id: '',
    applicationId: '',
    docName: '',
    whoupdate: '',
    comments: '',
    updatedAt: '',
    student_feedback: '',
    student_feedback_updatedAt: '',
    isLoaded: false,
    ml_requirements: '',
    file: ''
  };
  componentDidMount() {
    this.setState((state) => ({
      isLoaded: true
    }));
  }
  openStudentFeebackProgramSpecificFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      StudentFeedbackModel: true
    }));
  };
  closeStudentFeebackProgramSpecificFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      StudentFeedbackModel: false
    }));
  };
  openSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: true
    }));
  };
  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false
    }));
  };
  openML_Requirements_ModalWindow = (ml_requirements) => {
    this.setState((state) => ({
      ...state,
      ML_Requirements_Modal: true,
      ml_requirements
    }));
  };
  closeML_Requirements_ModalWindow = () => {
    this.setState((state) => ({
      ...state,
      ML_Requirements_Modal: false,
      ml_requirements: ''
    }));
  };
  openWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: true }));
  };
  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };
  openCommentsWindow = () => {
    this.setState((state) => ({ ...state, CommentsModel: false }));
  };
  closeCommentsWindow = () => {
    this.setState((state) => ({ ...state, CommentsModel: false }));
  };

  ConfirmDeleteDiscussionThreadHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false //false to reload everything
    }));
    if (this.state.program_id == null) {
      deleteGenralFileThread(
        this.state.doc_thread_id,
        this.state.student_id
      ).then(
        (resp) => {
          console.log(resp.data.data);
          const { data, success } = resp.data;
          if (success) {
            this.setState((state) => ({
              ...state,
              studentId: '',
              program_id: '',
              docName: '',
              whoupdate: '',
              isLoaded: true,
              student: data,
              success: success,
              deleteFileWarningModel: false
            }));
          } else {
            alert(resp.data.message);
            this.setState((state) => ({
              ...state,
              studentId: '',
              program_id: '',
              docName: '',
              whoupdate: '',
              isLoaded: true,
              success: success,
              deleteFileWarningModel: false
            }));
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      deleteProgramSpecificFileThread(
        this.state.doc_thread_id,
        this.state.program_id,
        this.state.student_id
      ).then(
        (resp) => {
          console.log(resp.data.data);
          const { data, success } = resp.data;
          if (success) {
            this.setState((state) => ({
              ...state,
              studentId: '',
              program_id: '',
              docName: '',
              whoupdate: '',
              isLoaded: true,
              student: data,
              success: success,
              deleteFileWarningModel: false
            }));
          } else {
            alert(resp.data.message);
            this.setState((state) => ({
              ...state,
              studentId: '',
              program_id: '',
              docName: '',
              whoupdate: '',
              isLoaded: true,
              success: success,
              deleteFileWarningModel: false
            }));
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  ConfirmSetAsFinalFileHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false //false to reload everything
    }));
    SetAsFinalGenralFile(this.state.doc_thread_id, this.state.student_id).then(
      (resp) => {
        console.log(resp.data.data);
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            studentId: '',
            applicationId: '',
            docName: '',
            whoupdate: '',
            isLoaded: true,
            student: data,
            success: success,
            SetAsFinalFileModel: false
          }));
        } else {
          alert(resp.data.message);
          this.setState((state) => ({
            ...state,
            studentId: '',
            applicationId: '',
            docName: '',
            whoupdate: '',
            isLoaded: true,
            success: success,
            SetAsFinalFileModel: false
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  onCommentsProgramSpecific = (
    studentId,
    applicationId,
    docName,
    whoupdate,
    feedback,
    updatedAt
  ) => {
    this.setState((state) => ({
      ...state,
      studentId,
      applicationId,
      docName,
      whoupdate,
      filetype: 'ProgramSpecific',
      comments: feedback,
      updatedAt,
      CommentsModel: true
    }));
  };

  handleAsFinalProgramSpecific = (
    studentId,
    applicationId,
    docName,
    whoupdate,
    action
  ) => {
    if (action === 'setfinal') {
      this.setState((state) => ({
        ...state,
        studentId,
        applicationId,
        docName,
        whoupdate,
        filetype: 'ProgramSpecific',
        SetAsFinalFileModel: true //change
      }));
    } else if (action === 'undofinal') {
      this.setState((state) => ({
        ...state,
        studentId,
        applicationId,
        docName,
        whoupdate,
        filetype: 'ProgramSpecific'
      }));
    }
  };

  handleAsFinalFile = (doc_thread_id, action) => {
    if (action === 'setfinal') {
      this.setState((state) => ({
        ...state,
        doc_thread_id,
        filetype: 'General',
        SetAsFinalFileModel: true
      }));
    } else if (action === 'undofinal') {
      this.setState((state) => ({
        ...state,
        doc_thread_id,
        filetype: 'General',
        SetAsFinalFileModel: false
      }));
    }
  };

  onDeleteFileThread = (doc_thread_id, application, studentId) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      program_id: application ? application.programId._id : null,
      student_id: studentId,
      deleteFileWarningModel: true
    }));
  };

  initProgramSpecificFileThread = (
    e,
    studentId,
    applicationId,
    document_catgory
  ) => {
    if ('1' === '') {
      e.preventDefault();
      alert('Please select file group');
    } else {
      e.preventDefault();
      initApplicationMessageThread(studentId, applicationId, document_catgory)
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            this.setState({
              isLoaded: true, //false to reload everything
              student: data,
              success: success,
              file: ''
            });
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  initGeneralFileThread = (e, studentId, document_catgory) => {
    if ('1' === '') {
      e.preventDefault();
      alert('Please select file group');
    } else {
      e.preventDefault();
      initGeneralMessageThread(studentId, document_catgory)
        .then((res) => {
          console.log(res.data);
          const { data, success } = res.data;
          if (success) {
            this.setState({
              isLoaded: true, //false to reload everything
              student: data,
              success: success,
              file: ''
            });
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
    if (!isLoaded && !this.state.student) {
      return (
        <div style={style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }
    return (
      <>
        <Collapse
          in={this.props.accordionKeys[this.props.idx] === this.props.idx}
        >
          <div id="accordion1">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h5>General Documents (CV, Recommendation Letters)</h5>
                </Col>
              </Row>
              <ManualFiles
                onDeleteFileThread={this.onDeleteFileThread}
                handleAsFinalFile={this.handleAsFinalFile}
                role={this.props.role}
                student={this.state.student}
                filetype={'General'}
                initGeneralFileThread={this.initGeneralFileThread}
                initProgramSpecificFileThread={
                  this.initProgramSpecificFileThread
                }
                application={null}
              />
              {this.state.student.applications &&
                this.state.student.applications.map((application, i) => (
                  <>
                    {application.decided !== undefined &&
                    application.decided === true ? (
                      <>
                        <Row>
                          <Col>
                            <h5>
                              {application.programId.school}
                              {' - '}
                              {application.programId.program_name}
                            </h5>
                          </Col>
                          <Col>
                            {application.programId.ml_requirements !==
                              undefined &&
                            application.programId.ml_requirements !== '' ? (
                              <>
                                ML Req.: {'           '}{' '}
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="light"
                                  onClick={() =>
                                    this.openML_Requirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  <AiOutlineMore size={20} />
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}{' '}
                            {application.programId.essay_requirements !==
                              undefined &&
                            application.programId.essay_requirements !== '' ? (
                              <>
                                Essay Req.: {'           '}{' '}
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="light"
                                  onClick={() =>
                                    this.openML_Requirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  <AiOutlineMore size={20} />
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                          </Col>
                        </Row>

                        <ManualFiles
                          onDeleteFileThread={this.onDeleteFileThread}
                          onCommentsProgramSpecific={
                            this.onCommentsProgramSpecific
                          }
                          handleAsFinalProgramSpecific={
                            this.handleAsFinalProgramSpecific
                          }
                          role={this.props.role}
                          student={this.state.student}
                          application={application}
                          filetype={'ProgramSpecific'}
                          initGeneralFileThread={this.initGeneralFileThread}
                          initProgramSpecificFileThread={
                            this.initProgramSpecificFileThread
                          }
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
            </Card.Body>
          </div>
        </Collapse>{' '}
        {!isLoaded && (
          <div style={style}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        )}
        <Modal
          show={this.state.deleteFileWarningModel}
          onHide={this.closeWarningWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to delete {this.state.applicationId}?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!isLoaded}
              onClick={this.ConfirmDeleteDiscussionThreadHandler}
            >
              Yes
            </Button>

            <Button onClick={this.closeWarningWindow}>No</Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.SetAsFinalFileModel}
          onHide={this.closeSetAsFinalFileModelWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to set {this.state.docName} as final for student?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!isLoaded}
              onClick={this.ConfirmSetAsFinalFileHandler}
            >
              Yes
            </Button>

            <Button onClick={this.closeSetAsFinalFileModelWindow}>No</Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.ML_Requirements_Modal}
          onHide={this.closeML_Requirements_ModalWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Special ML Requirements
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.ml_requirements}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeML_Requirements_ModalWindow}>
              Close
            </Button>
            {!isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default EditorDocsProgress;
