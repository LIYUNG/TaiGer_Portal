import React from 'react';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner
} from 'react-bootstrap';

import { AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';
import { ImCheckmark } from 'react-icons/im';
import ManualFiles from './ManualFiles';
import { check_generaldocs } from '../Utils/checking-functions';
import {
  is_program_ml_rl_essay_finished,
  is_program_closed
} from '../Utils/checking-functions';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';

import {
  deleteGenralFileThread,
  deleteProgramSpecificFileThread,
  SetFileAsFinal,
  ToggleProgramStatus,
  initGeneralMessageThread,
  initApplicationMessageThread
} from '../../api';

class EditorDocsProgress extends React.Component {
  state = {
    timeouterror: null,
    unauthorizederror: null,
    student: this.props.student,
    deleteFileWarningModel: false,
    SetProgramStatusModel: false,
    SetAsFinalFileModel: false,
    Requirements_Modal: false,
    isFinal: false,
    studentId: '',
    student_id: '',
    doc_thread_id: '',
    applicationId: '',
    docName: '',
    isLoaded: false,
    requirements: '',
    file: '',
    isThreadExisted: false,
    res_status: 0
  };
  componentDidMount() {
    this.setState((state) => ({
      isLoaded: true
    }));
  }
  closeSetProgramStatusModel = () => {
    this.setState((state) => ({
      ...state,
      SetProgramStatusModel: false
    }));
  };
  closeSetAsFinalFileModelWindow = () => {
    this.setState((state) => ({
      ...state,
      SetAsFinalFileModel: false
    }));
  };
  openRequirements_ModalWindow = (ml_requirements) => {
    this.setState((state) => ({
      ...state,
      Requirements_Modal: true,
      requirements: ml_requirements
    }));
  };
  close_Requirements_ModalWindow = () => {
    this.setState((state) => ({
      ...state,
      Requirements_Modal: false,
      requirements: ''
    }));
  };
  closeDocExistedWindow = () => {
    this.setState((state) => ({ ...state, isThreadExisted: false }));
  };
  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
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
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState((state) => ({
              ...state,
              student_id: '',
              doc_thread_id: '',
              isLoaded: true,
              student: data,
              success: success,
              deleteFileWarningModel: false,
              res_status: status
            }));
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        },
        (error) => {
          this.setState({ error });
        }
      );
    } else {
      deleteProgramSpecificFileThread(
        this.state.doc_thread_id,
        this.state.program_id,
        this.state.student_id
      ).then(
        (resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            this.setState((state) => ({
              ...state,
              student_id: '',
              program_id: '',
              doc_thread_id: '',
              isLoaded: true,
              student: data,
              success: success,
              deleteFileWarningModel: false,
              res_status: status
            }));
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        },
        (error) => {
          this.setState({ error });
        }
      );
    }
  };

  ConfirmSetAsFinalFileHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false // false to reload everything
    }));
    SetFileAsFinal(
      this.state.doc_thread_id,
      this.state.student_id,
      this.state.program_id,
      false
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            studentId: '',
            applicationId: '',
            docName: '',
            isLoaded: true,
            student: data,
            success: success,
            SetAsFinalFileModel: false,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({ error });
      }
    );
  };

  handleProgramStatus = (student_id, program_id) => {
    this.setState((state) => ({
      ...state,
      student_id,
      program_id,
      SetProgramStatusModel: true
    }));
  };

  SubmitProgramStatusHandler = () => {
    this.setState((state) => ({
      ...state,
      isLoaded: false // false to reload everything
    }));
    ToggleProgramStatus(this.state.student_id, this.state.program_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            studentId: '',
            applicationId: '',
            isLoaded: true,
            student: data,
            success: success,
            SetProgramStatusModel: false,
            res_status: status
          }));
        } else {
          this.setState({
            isLoaded: true,
            res_status: status
          });
        }
      },
      (error) => {
        this.setState({ error });
      }
    );
  };
  handleAsFinalFile = (
    doc_thread_id,
    student_id,
    program_id,
    isFinal,
    docName
  ) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      student_id,
      program_id,
      docName,
      isFinal,
      SetAsFinalFileModel: true
    }));
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
    document_catgory,
    thread_name
  ) => {
    if ('1' === '') {
      e.preventDefault();
      alert('Please select file group');
    } else {
      e.preventDefault();
      initApplicationMessageThread(studentId, applicationId, document_catgory)
        .then((res) => {
          const { data, success } = res.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true, //false to reload everything
              student: data,
              success: success,
              file: '',
              res_status: status
            });
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        })
        .catch((error) => {
          this.setState({ error });
        });
    }
  };

  initGeneralFileThread = (e, studentId, document_catgory, thread_name) => {
    if ('1' === '') {
      e.preventDefault();
      alert('Please select file group');
    } else {
      e.preventDefault();
      initGeneralMessageThread(studentId, document_catgory)
        .then((res) => {
          const { data, success } = res.data;
          const { status } = resp;
          if (success) {
            this.setState({
              isLoaded: true, //false to reload everything
              student: data,
              success: success,
              file: '',
              res_status: status
            });
          } else {
            this.setState({
              isLoaded: true,
              res_status: status
            });
          }
        })
        .catch((error) => {
          this.setState({ error });
        });
    }
  };

  render() {
    const { res_status, isLoaded } = this.state;

    if (!isLoaded && !this.state.student) {
      return (
        <div style={spinner_style}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      );
    }

    if (res_status >= 400) {
      return <ErrorPage res_status={res_status} />;
    }

    const create_generaldoc_reminder = check_generaldocs(this.state.student);
    return (
      <>
        <Collapse
          in={this.props.accordionKeys[this.props.idx] === this.props.idx}
        >
          <div id="accordion1">
            <Card.Body>
              <Row className="mb-4 mx-0">
                <Col md={8}>
                  <b className="text-light">
                    General Documents (CV, Recommendation Letters)
                  </b>
                </Col>
              </Row>
              {create_generaldoc_reminder && (
                <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                  <Card.Body>
                    <p className="text-light my-0">
                      The following general documents are not started yet:{' '}
                      {this.state.student.generaldocs_threads.findIndex(
                        (thread) => thread.doc_thread_id.file_type === 'CV'
                      ) === -1 && (
                        <li>
                          <b>CV</b>
                        </li>
                      )}{' '}
                    </p>
                  </Card.Body>
                </Card>
              )}

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
              <hr></hr>

              {this.state.student.applications &&
                this.state.student.applications.map((application, i) => (
                  <div key={i}>
                    {((application.decided !== undefined &&
                      application.decided === 'O' &&
                      application.programId.ml_required !== undefined &&
                      application.programId.ml_required === 'yes' &&
                      application.doc_modification_thread.findIndex(
                        (thread) => thread.doc_thread_id.file_type === 'ML'
                      ) === -1) ||
                      (application.decided !== undefined &&
                        application.decided === 'O' &&
                        application.programId.essay_required !== undefined &&
                        application.programId.essay_required === 'yes' &&
                        application.doc_modification_thread.findIndex(
                          (thread) => thread.doc_thread_id.file_type === 'Essay'
                        ) === -1)) && (
                      <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                        <Card.Body>
                          The followings application documents are not started
                          or finished yet:{' '}
                          {application.programId.ml_required !== undefined &&
                            application.programId.ml_required === 'yes' &&
                            application.doc_modification_thread.findIndex(
                              (thread) =>
                                thread.doc_thread_id.file_type === 'ML'
                            ) === -1 &&
                            application.programId.ml_requirements !== '' && (
                              <li>
                                <b>ML</b>
                              </li>
                            )}
                          {application.programId.essay_required !== undefined &&
                            application.programId.essay_required === 'yes' &&
                            application.doc_modification_thread.findIndex(
                              (thread) =>
                                thread.doc_thread_id.file_type === 'Essay'
                            ) === -1 && (
                              <li>
                                <b>Essay</b>
                              </li>
                            )}
                        </Card.Body>
                      </Card>
                    )}

                    {application.decided !== undefined &&
                    application.decided === 'O' ? (
                      <>
                        <Row className="my-2 mx-0">
                          {is_program_ml_rl_essay_finished(application) ? (
                            <>
                              {is_program_closed(application) ? (
                                <>
                                  <Col md={1}>
                                    <ImCheckmark
                                      size={24}
                                      color="limegreen"
                                      title="This program is closed"
                                    />
                                  </Col>
                                  <Col md={1}>
                                    <AiOutlineUndo
                                      size={24}
                                      color="red"
                                      title="Re-open this program as it was not submitted"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        this.handleProgramStatus(
                                          this.state.student._id.toString(),
                                          application.programId._id.toString()
                                        )
                                      }
                                    />
                                  </Col>
                                </>
                              ) : (
                                <>
                                  <Col md={1}>
                                    <AiOutlineCheck
                                      size={24}
                                      color="white"
                                      style={{ cursor: 'pointer' }}
                                      title="Close this program - marked as finished."
                                      onClick={() =>
                                        this.handleProgramStatus(
                                          this.state.student._id.toString(),
                                          application.programId._id.toString()
                                        )
                                      }
                                    />
                                  </Col>
                                  <Col md={1}></Col>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <Col md={1}></Col>
                              <Col md={1}></Col>
                            </>
                          )}

                          <Col md={4}>
                            <Link
                              to={'/programs/' + application.programId._id}
                              style={{ textDecoration: 'none' }}
                              className="text-info"
                            >
                              <h5 className="text-light">
                                <b>
                                  {application.programId.school}
                                  {' - '}
                                  {application.programId.program_name}
                                </b>
                              </h5>
                            </Link>
                          </Col>
                          <Col md={2}>
                            {application.programId.ml_required !== undefined &&
                            application.programId.ml_required === 'yes' ? (
                              <>
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="secondary"
                                  onClick={() =>
                                    this.openRequirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  ML
                                  {/* <AiOutlineMore size={20} /> */}
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                            {application.programId.rl_required !== undefined &&
                            application.programId.rl_required > 0 ? (
                              <>
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="info"
                                  onClick={() =>
                                    this.openRequirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  RL
                                  {/* <AiOutlineMore size={20} /> */}
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                            {application.programId.essay_required !==
                              undefined &&
                            application.programId.essay_required === 'yes' ? (
                              <>
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="light"
                                  onClick={() =>
                                    this.openRequirements_ModalWindow(
                                      application.programId.essay_requirements
                                    )
                                  }
                                >
                                  Essay
                                  {/* <AiOutlineMore size={20} /> */}
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                          </Col>
                          <Col>
                            <p className="text-light">
                              Deadline:{' '}
                              {application.programId.application_deadline
                                ? this.state.student.application_preference &&
                                  this.state.student.application_preference
                                    .expected_application_date
                                  ? this.state.student.application_preference
                                      .expected_application_date +
                                    '-' +
                                    application.programId.application_deadline
                                  : application.programId.application_deadline
                                : '-'}
                            </p>
                          </Col>
                          <Col md={1}>
                            <p className="text-light">Status: </p>
                          </Col>
                          <Col md={1}>
                            {application.closed === 'O' ? (
                              <p className="text-warning">Close</p>
                            ) : (
                              <p className="text-danger">
                                <b>Open</b>
                              </p>
                            )}
                          </Col>
                        </Row>
                        <ManualFiles
                          onDeleteFileThread={this.onDeleteFileThread}
                          handleAsFinalFile={this.handleAsFinalFile}
                          role={this.props.role}
                          student={this.state.student}
                          application={application}
                          filetype={'ProgramSpecific'}
                          initGeneralFileThread={this.initGeneralFileThread}
                          initProgramSpecificFileThread={
                            this.initProgramSpecificFileThread
                          }
                        />
                        <hr></hr>
                      </>
                    ) : (
                      <>
                        <Row className="my-2 mx-0">
                          <Col md={2}></Col>
                          <Col md={4}>
                            <Link
                              to={
                                '/programs/' +
                                application.programId._id.toString()
                              }
                              style={{ textDecoration: 'none' }}
                              className="text-info"
                            >
                              <h5 className="text-secondary">
                                <b>
                                  {application.programId.school}
                                  {' - '}
                                  {application.programId.program_name}
                                </b>
                              </h5>
                            </Link>
                          </Col>
                          <Col md={2}>
                            {application.programId.ml_required !== undefined &&
                            application.programId.ml_required === 'yes' ? (
                              <>
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="secondary"
                                  onClick={() =>
                                    this.openRequirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  ML
                                  {/* <AiOutlineMore size={20} /> */}
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                            {application.programId.rl_required !== undefined &&
                            application.programId.rl_required > 0 ? (
                              <>
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="info"
                                  onClick={() =>
                                    this.openRequirements_ModalWindow(
                                      application.programId.ml_requirements
                                    )
                                  }
                                >
                                  RL
                                  {/* <AiOutlineMore size={20} /> */}
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                            {application.programId.essay_required !==
                              undefined &&
                            application.programId.essay_required === 'yes' ? (
                              <>
                                <Button
                                  size="sm"
                                  title="Comments"
                                  variant="light"
                                  onClick={() =>
                                    this.openRequirements_ModalWindow(
                                      application.programId.essay_requirements
                                    )
                                  }
                                >
                                  Essay
                                  {/* <AiOutlineMore size={20} /> */}
                                </Button>
                              </>
                            ) : (
                              <></>
                            )}
                          </Col>
                          <Col>
                            <p className="text-light">
                              Deadline:{' '}
                              {application.programId.application_deadline
                                ? this.state.student.application_preference &&
                                  this.state.student.application_preference
                                    .expected_application_date
                                  ? this.state.student.application_preference
                                      .expected_application_date +
                                    '-' +
                                    application.programId.application_deadline
                                  : application.programId.application_deadline
                                : '-'}
                            </p>
                          </Col>
                          <Col md={1}>
                            <p className="text-light">Status: </p>
                          </Col>
                          <Col md={1}>
                            <p className="text-danger">
                              <b>Undecided</b>
                            </p>
                          </Col>
                        </Row>
                        <Row className="my-2 mx-0">
                          <Col md={2}></Col>
                          <Col md={4}>
                            <p className="text-light">
                              Please make sure the program should be proceeded.
                              <Link
                                to={
                                  '/student-applications/' +
                                  this.state.student._id.toString()
                                }
                                style={{ textDecoration: 'none' }}
                                className="text-info"
                              >
                                {' '}
                                click here
                              </Link>
                            </p>
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                ))}
            </Card.Body>
          </div>
        </Collapse>{' '}
        {!isLoaded && (
          <div style={spinner_style}>
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
              <div style={spinner_style}>
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
            Do you want to set {this.state.docName} as{' '}
            {this.state.isFinal ? 'final' : 'open'}?
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
              <div style={spinner_style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.Requirements_Modal}
          onHide={this.close_Requirements_ModalWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Special Requirements
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.requirements}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close_Requirements_ModalWindow}>Close</Button>
            {!isLoaded && (
              <div style={spinner_style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.isThreadExisted}
          onHide={this.closeDocExistedWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Attention
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.docName} is already existed</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeDocExistedWindow}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.SetProgramStatusModel}
          onHide={this.closeSetProgramStatusModel}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Attention
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to {this.state.isFinal ? 'close' : 're-open'} this
            program for {this.state.student.firstname}?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!isLoaded}
              onClick={this.SubmitProgramStatusHandler}
            >
              Yes
            </Button>
            <Button onClick={this.closeSetProgramStatusModel}>Close</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default EditorDocsProgress;
