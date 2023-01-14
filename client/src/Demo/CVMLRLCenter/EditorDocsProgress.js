import React from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner
} from 'react-bootstrap';
import { AiOutlineCheck, AiOutlineUndo } from 'react-icons/ai';
import { ImCheckmark } from 'react-icons/im';

import ManualFiles from './ManualFiles';
import {
  showButtonIfMyStudent,
  check_generaldocs,
  is_program_ml_rl_essay_finished,
  is_program_closed
} from '../Utils/checking-functions';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

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
    error: '',
    delete_field: '',
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
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
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
    this.setState((state) => ({
      ...state,
      deleteFileWarningModel: false,
      delete_field: ''
    }));
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
          const { success } = resp.data;
          const { status } = resp;
          if (success) {
            let student_temp = { ...this.state.student };
            let general_docs_idx = student_temp.generaldocs_threads.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() === this.state.doc_thread_id
            );
            if (general_docs_idx !== -1) {
              student_temp.generaldocs_threads.splice(general_docs_idx, 1);
            }

            this.setState((state) => ({
              ...state,
              student_id: '',
              doc_thread_id: '',
              isLoaded: true,
              student: student_temp,
              success: success,
              delete_field: '',
              deleteFileWarningModel: false,
              res_modal_status: status
            }));
          } else {
            const { message } = resp.data;
            this.setState((state) => ({
              ...state,
              isLoaded: true,
              res_modal_message: message,
              res_modal_status: status
            }));
          }
        },
        (error) => {
          const { statusText } = resp;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_modal_status: 500,
            res_modal_message: statusText
          }));
        }
      );
    } else {
      deleteProgramSpecificFileThread(
        this.state.doc_thread_id,
        this.state.program_id,
        this.state.student_id
      ).then(
        (resp) => {
          const { success } = resp.data;
          const { status } = resp;
          if (success) {
            let student_temp = { ...this.state.student };
            let application_idx = student_temp.applications.findIndex(
              (application) =>
                application.programId._id.toString() === this.state.program_id
            );
            let doc_thread_idx = student_temp.applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() === this.state.doc_thread_id
            );
            if (doc_thread_idx !== -1) {
              student_temp.applications[
                application_idx
              ].doc_modification_thread.splice(doc_thread_idx, 1);
            }
            this.setState((state) => ({
              ...state,
              student_id: '',
              program_id: '',
              doc_thread_id: '',
              isLoaded: true,
              student: student_temp,
              success: success,
              deleteFileWarningModel: false,
              res_modal_status: status
            }));
          } else {
            const { message } = resp.data;
            this.setState((state) => ({
              ...state,
              isLoaded: true,
              res_modal_message: message,
              res_modal_status: status
            }));
          }
        },
        (error) => {
          const { statusText } = resp;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_modal_status: 500,
            res_modal_message: statusText
          }));
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
        const { status } = resp;
        if (success) {
          let student_temp = { ...this.state.student };
          if (this.state.program_id) {
            let application_idx = student_temp.applications.findIndex(
              (application) =>
                application.programId._id.toString() === this.state.program_id
            );

            let thread_idx = student_temp.applications[
              application_idx
            ].doc_modification_thread.findIndex(
              (thread) =>
                thread.doc_thread_id._id.toString() === this.state.doc_thread_id
            );

            student_temp.applications[application_idx].doc_modification_thread[
              thread_idx
            ].isFinalVersion = data.isFinalVersion;

            student_temp.applications[application_idx].doc_modification_thread[
              thread_idx
            ].updatedAt = data.updatedAt;
            student_temp.applications[application_idx].doc_modification_thread[
              thread_idx
            ].doc_thread_id.updatedAt = data.updatedAt;
          } else {
            let general_doc_idx = student_temp.generaldocs_threads.findIndex(
              (docs) =>
                docs.doc_thread_id._id.toString() === this.state.doc_thread_id
            );
            student_temp.generaldocs_threads[general_doc_idx].isFinalVersion =
              data.isFinalVersion;
            student_temp.generaldocs_threads[general_doc_idx].updatedAt =
              data.updatedAt;
            student_temp.generaldocs_threads[
              general_doc_idx
            ].doc_thread_id.updatedAt = data.updatedAt;
          }

          this.setState((state) => ({
            ...state,
            studentId: '',
            applicationId: '',
            docName: '',
            isLoaded: true,
            student: student_temp,
            success: success,
            SetAsFinalFileModel: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
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
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        const { statusText } = resp;
        this.setState((state) => ({
          ...state,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
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

  onChangeDeleteField = (e) => {
    this.setState({ delete_field: e.target.value });
  };

  onDeleteFileThread = (doc_thread_id, application, studentId, docName) => {
    this.setState((state) => ({
      ...state,
      doc_thread_id,
      program_id: application ? application.programId._id : null,
      student_id: studentId,
      docName,
      deleteFileWarningModel: true
    }));
  };

  initProgramSpecificFileThread = (
    e,
    studentId,
    programId,
    document_catgory,
    thread_name
  ) => {
    if ('1' === '') {
      e.preventDefault();
      alert('Please select file group');
    } else {
      e.preventDefault();
      initApplicationMessageThread(studentId, programId, document_catgory)
        .then((resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            let student_temp = { ...this.state.student };
            let application_idx = student_temp.applications.findIndex(
              (application) =>
                application.programId._id.toString() === programId
            );
            student_temp.applications[
              application_idx
            ].doc_modification_thread.push(data);

            this.setState({
              isLoaded: true, //false to reload everything
              student: student_temp,
              success: success,
              file: '',
              res_modal_status: status
            });
          } else {
            // TODO: handle frontend render if create duplicate thread
            const { message } = resp.data;
            this.setState((state) => ({
              ...state,
              isLoaded: true,
              res_modal_message: message,
              res_modal_status: status
            }));
          }
        })
        .catch((error) => {
          const { statusText } = resp;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_modal_status: 500,
            res_modal_message: statusText
          }));
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
        .then((resp) => {
          const { data, success } = resp.data;
          const { status } = resp;
          if (success) {
            let student_temp = { ...this.state.student };
            student_temp.generaldocs_threads.push(data);
            this.setState({
              isLoaded: true, //false to reload everything
              student: student_temp,
              success: success,
              file: '',
              res_modal_status: status
            });
          } else {
            // TODO: handle frontend render if create duplicate thread
            const { message } = resp.data;
            this.setState((state) => ({
              ...state,
              isLoaded: true,
              res_modal_message: message,
              res_modal_status: status
            }));
          }
        })
        .catch((error) => {
          const { statusText } = resp;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            error,
            res_modal_status: 500,
            res_modal_message: statusText
          }));
        });
    }
  };

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_modal_status, res_modal_message, res_status, isLoaded } =
      this.state;

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
            {res_modal_status >= 400 && (
              <ModalMain
                ConfirmError={this.ConfirmError}
                res_modal_status={res_modal_status}
                res_modal_message={res_modal_message}
              />
            )}
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
                user={this.props.user}
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
                                    {showButtonIfMyStudent(
                                      this.props.user,
                                      this.state.student
                                    ) && (
                                      <ImCheckmark
                                        size={24}
                                        color="limegreen"
                                        title="This program is closed"
                                      />
                                    )}
                                  </Col>
                                  <Col md={1}>
                                    {showButtonIfMyStudent(
                                      this.props.user,
                                      this.state.student
                                    ) && (
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
                                    )}
                                  </Col>
                                </>
                              ) : (
                                <>
                                  <Col md={1}>
                                    {showButtonIfMyStudent(
                                      this.props.user,
                                      this.state.student
                                    ) && (
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
                                    )}
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
                              {application.closed === 'O' ? (
                                <h5 className="text-warning">
                                  <b>
                                    {application.programId.school}
                                    {' - '}
                                    {application.programId.program_name}
                                  </b>
                                </h5>
                              ) : (
                                <h5 className="text-danger">
                                  <b>
                                    {application.programId.school}
                                    {' - '}
                                    {application.programId.program_name}
                                  </b>
                                </h5>
                              )}
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
                              <p className="text-warning">
                                <b>Close</b>
                              </p>
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
                          user={this.props.user}
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
            Do you want to delete <b>{this.state.docName}</b>?
            <Form.Group
              // controlId="target_application_field"
              className="my-0 mx-0"
            >
              <Form.Label className="my-1 mx-0">
                Please enter{' '}
                <i>
                  <b>delete</b>
                </i>{' '}
                in order to delete the user.
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="delete"
                onChange={(e) => this.onChangeDeleteField(e)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!isLoaded || this.state.delete_field !== 'delete'}
              onClick={this.ConfirmDeleteDiscussionThreadHandler}
            >
              {isLoaded ? (
                'Yes'
              ) : (
                <div style={spinner_style}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              )}
            </Button>

            <Button onClick={this.closeWarningWindow}>No</Button>
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
              {isLoaded ? (
                'Yes'
              ) : (
                <div style={spinner_style}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              )}
            </Button>

            <Button onClick={this.closeSetAsFinalFileModelWindow}>No</Button>
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
