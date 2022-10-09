import React from 'react';
// import DEMO from '../../store/constant';
// import { AiFillCloseCircle, AiFillQuestionCircle } from 'react-icons/ai';
// import { IoCheckmarkCircle } from 'react-icons/io5';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';
import { Link } from 'react-router-dom';

// import avatar1 from "../../../../assets/images/user/avatar-1.jpg";
import {
  Row,
  Col,
  Button,
  Card,
  Collapse,
  // Form,
  Modal,
  Spinner
} from 'react-bootstrap';
import {
  deleteGenralFileThread,
  deleteProgramSpecificFileThread,
  SetFileAsFinal,
  initGeneralMessageThread,
  initApplicationMessageThread
  // SubmitMessageWithAttachment
} from '../../api';
import ManualFiles from './ManualFiles';
import {
  // AiOutlineDownload,
  // AiOutlineDelete,
  // AiOutlineCheck,
  AiOutlineMore
  // AiOutlineUndo,
  // AiFillMessage
} from 'react-icons/ai';
import {
  check_survey_filled,
  check_application_selection,
  check_generaldocs
} from '../Utils/checking-functions';

class EditorDocsProgress extends React.Component {
  state = {
    timeouterror: null,
    unauthorizederror: null,
    student: this.props.student,
    deleteFileWarningModel: false,
    SetAsFinalFileModel: false,
    Requirements_Modal: false,
    studentId: '',
    student_id: '',
    doc_thread_id: '',
    applicationId: '',
    docName: '',
    whoupdate: '',
    isLoaded: false,
    requirements: '',
    file: '',
    isThreadExisted: false
  };
  componentDidMount() {
    // console.log(this.props.student);
    this.setState((state) => ({
      isLoaded: true
    }));
  }
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
      this.state.program_id
    ).then(
      (resp) => {
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
        this.setState({ error });
      }
    );
  };

  handleAsFinalFile = (doc_thread_id, student_id, program_id, docName) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      student_id,
      program_id,
      docName,
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
          if (success) {
            this.setState({
              isLoaded: true, //false to reload everything
              student: data,
              success: success,
              file: ''
            });
          } else {
            if (res.status === 400) {
              this.setState({
                isLoaded: true,
                docName: thread_name,
                isThreadExisted: true
              });
            } else if (res.status === 401) {
              this.setState({ isLoaded: true, timeouterror: true });
            } else if (res.status === 403) {
              this.setState({ isLoaded: true, unauthorizederror: true });
            }
          }
        })
        .catch((err) => {
          console.log(err);
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
          if (success) {
            this.setState({
              isLoaded: true, //false to reload everything
              student: data,
              success: success,
              file: ''
            });
          } else {
            if (res.status === 400) {
              this.setState({
                isLoaded: true,
                docName: thread_name,
                isThreadExisted: true
              });
            } else if (res.status === 401) {
              this.setState({ isLoaded: true, timeouterror: true });
            } else if (res.status === 403) {
              this.setState({ isLoaded: true, unauthorizederror: true });
            }
            // alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const { timeouterror, unauthorizederror, error, isLoaded } = this.state;
    if (error) {
      return (
        <div>
          Error: your session is timeout! Please refresh the page and Login
        </div>
      );
    }
    if (timeouterror) {
      return (
        <div>
          <TimeOutErrors />
        </div>
      );
    }
    if (unauthorizederror) {
      return (
        <div>
          <UnauthorizedError />
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
                  <b>General Documents (CV, Recommendation Letters)</b>
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
                      {this.state.student.generaldocs_threads.filter((thread) =>
                        thread.doc_thread_id.file_type.includes('RL')
                      ).length < 2 && (
                        <li>
                          <b>
                            RL x{' '}
                            {2 -
                              this.state.student.generaldocs_threads.filter(
                                (thread) =>
                                  thread.doc_thread_id.file_type.includes('RL')
                              ).length}
                          </b>
                        </li>
                      )}
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
                        application.programId.essay_required !==
                          undefined &&
                        application.programId.essay_required === 'yes' &&
                        application.doc_modification_thread.findIndex(
                          (thread) => thread.doc_thread_id.file_type === 'Essay'
                        ) === -1)) && (
                      <Card className="my-2 mx-0" bg={'danger'} text={'light'}>
                        <Card.Body>
                          The followings application documents are not started
                          yet:{' '}
                          {application.programId.ml_required !==
                            undefined &&
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
                          {application.programId.essay_required !==
                            undefined &&
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
                        <Row className="mb-2 mx-0">
                          <Col md={4}>
                            <Link
                              to={'/programs/' + application.programId._id}
                              style={{ textDecoration: 'none' }}
                              className="text-info"
                            >
                              <b>
                                {application.programId.school}
                                {' - '}
                                {application.programId.program_name}
                              </b>
                            </Link>
                          </Col>
                          <Col md={2}>
                            {application.programId.ml_required !==
                              undefined &&
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
                            )}{' '}
                            {application.programId.essay_required !==
                              undefined &&
                            application.programId.essay_required !== '' ? (
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
                            Deadline:{' '}
                            {application.programId.application_deadline
                              ? this.state.student.academic_background
                                  .university.expected_application_date +
                                '-' +
                                application.programId.application_deadline
                              : '-'}
                          </Col>
                          <Col>
                            Status:{' '}
                            {application.closed === 'O' ? 'Closed' : 'Open'}
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
                      <></>
                    )}
                  </div>
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
              <div style={style}>
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
      </>
    );
  }
}

export default EditorDocsProgress;
