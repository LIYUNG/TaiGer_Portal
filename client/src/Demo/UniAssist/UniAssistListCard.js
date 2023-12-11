import React from 'react';
import { Row, Col, Form, Button, Card, Modal, Spinner } from 'react-bootstrap';
import { IoMdCloudUpload } from 'react-icons/io';
import { AiOutlineDownload, AiOutlineDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import { BASE_URL } from '../../api/request';
import {
  is_TaiGer_AdminAgent,
  DocumentStatus,
  check_uni_assist_needed
} from '../Utils/checking-functions';
import { spinner_style } from '../Utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import {
  uploadVPDforstudent,
  deleteVPDFile,
  SetAsNotNeeded,
  SetUniAssistPaid
} from '../../api';
import { FiExternalLink } from 'react-icons/fi';

class UniAssistListCard extends React.Component {
  state = {
    error: '',
    fileType: '',
    student_id: '',
    program_id: '',
    isLoaded2: {},
    isLoadedVPDConfirmation: {},
    isLoaded: false,
    student: this.props.student,
    deleteVPDFileWarningModel: false,
    setAsNotNeededModel: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  };
  componentDidMount() {
    let temp_isLoaded = {};
    for (let i = 0; i < this.props.student.applications.length; i++) {
      temp_isLoaded[
        `${this.props.student.applications[i].programId._id.toString()}`
      ] = true;
    }
    this.setState({
      isLoaded2: temp_isLoaded,
      isLoadedVPDConfirmation: temp_isLoaded
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.student._id.toString() !== this.props.student._id.toString()
    ) {
      let temp_isLoaded = {};
      for (let i = 0; i < this.props.student.applications.length; i++) {
        temp_isLoaded[
          `${this.props.student.applications[i].programId._id.toString()}`
        ] = true;
      }
      this.setState({
        student: this.props.student,
        isLoaded2: temp_isLoaded,
        isLoadedVPDConfirmation: temp_isLoaded
      });
    }
  }
  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteVPDFileWarningModel: false }));
  };

  handleUniAssistDocSubmit = (e, student_id, program_id) => {
    e.preventDefault();
    this.onSubmitVPDFile(e, e.target.files[0], student_id, program_id, 'VPD');
  };

  handleUniAssistVPDPaidConfirmationDocSubmit = (e, student_id, program_id) => {
    e.preventDefault();
    this.onSubmitVPDFile(
      e,
      e.target.files[0],
      student_id,
      program_id,
      'VPDConfirmation'
    );
  };

  closesetAsNotNeededWindow = () => {
    this.setState((state) => ({ ...state, setAsNotNeededModel: false }));
  };

  opensetAsNotNeededWindow = (e, student_id, program_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      setAsNotNeededModel: true,
      student_id,
      program_id
    }));
  };

  onCheckHandler = (e, student_id, program_id, isPaid) => {
    e.preventDefault();
    const { value, checked } = e.target;
    SetUniAssistPaid(student_id, program_id, isPaid).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success,
            student_id: '',
            program_id: '',
            res_modal_status: status
          });
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

  handleSetAsNotNeeded = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded2: { ...this.state.isLoaded2, [this.state.program_id]: false }
    }));

    SetAsNotNeeded(this.state.student_id, this.state.program_id).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success,
            setAsNotNeededModel: false,
            isLoaded2: {
              ...this.state.isLoaded2,
              [this.state.program_id]: true
            },
            student_id: '',
            program_id: '',
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            isLoaded2: {
              ...this.state.isLoaded2,
              [this.state.program_id]: true
            },
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

  handleUniAssistDocDelete = (e, program_id) => {
    if (this.state.fileType === 'VPD') {
      this.setState((state) => ({
        isLoaded2: {
          ...state.isLoaded2,
          [program_id]: false
        }
      }));
    }
    if (this.state.fileType === 'VPDConfirmation') {
      this.setState((state) => ({
        isLoadedVPDConfirmation: {
          ...state.isLoadedVPDConfirmation,
          [program_id]: false
        }
      }));
    }

    deleteVPDFile(
      this.state.student_id,
      this.state.program_id,
      this.state.fileType
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          const app = this.state.student.applications.find(
            (application) => application.programId._id.toString() === program_id
          );
          const app_idx = this.state.student.applications.findIndex(
            (application) => application.programId._id.toString() === program_id
          );
          if (this.state.fileType === 'VPD') {
            app.uni_assist.status = 'missing';
            app.uni_assist.vpd_file_path = '';
          }
          if (this.state.fileType === 'VPDConfirmation') {
            app.uni_assist.vpd_paid_confirmation_file_path = '';
          }
          app.uni_assist.updatedAt = new Date();
          let tmep_student = { ...this.state.student };
          tmep_student.applications[app_idx] = app;
          if (this.state.fileType === 'VPD') {
            this.setState((state) => ({
              ...state,
              isLoaded: true,
              isLoaded2: {
                ...state.isLoaded2,
                [program_id]: true
              },
              student: tmep_student,
              success: success,
              fileType: '',
              deleteVPDFileWarningModel: false,
              res_modal_status: status
            }));
          }
          if (this.state.fileType === 'VPDConfirmation') {
            this.setState((state) => ({
              ...state,
              isLoaded: true,
              isLoadedVPDConfirmation: {
                ...state.isLoadedVPDConfirmation,
                [program_id]: true
              },
              student: tmep_student,
              success: success,
              fileType: '',
              deleteVPDFileWarningModel: false,
              res_modal_status: status
            }));
          }
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            isLoaded2: {
              ...state.isLoaded2,
              [program_id]: true
            },
            fileType: '',
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
          fileType: '',
          error,
          res_modal_status: 500,
          res_modal_message: statusText
        }));
      }
    );
  };
  onDeleteVPDFileWarningPopUp = (e, student_id, program_id, fileType) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      program_id,
      deleteVPDFileWarningModel: true,
      fileType
    }));
  };

  onSubmitVPDFile = (e, NewFile, student_id, program_id, fileType) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);
    if (fileType === 'VPD') {
      this.setState((state) => ({
        isLoaded2: {
          ...state.isLoaded2,
          [program_id]: false
        }
      }));
    }
    if (fileType === 'VPDConfirmation') {
      this.setState((state) => ({
        isLoadedVPDConfirmation: {
          ...state.isLoadedVPDConfirmation,
          [program_id]: false
        }
      }));
    }

    uploadVPDforstudent(student_id, program_id, formData, fileType).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          if (fileType === 'VPD') {
            this.setState((state) => ({
              ...state,
              student: data, // resp.data = {success: true, data:{...}}
              success,
              category: '',
              isLoaded: true,
              isLoaded2: {
                ...state.isLoaded2,
                [program_id]: true
              },
              file: '',
              res_modal_status: status
            }));
          }
          if (fileType === 'VPDConfirmation') {
            this.setState((state) => ({
              ...state,
              student: data, // resp.data = {success: true, data:{...}}
              success,
              category: '',
              isLoaded: true,
              isLoadedVPDConfirmation: {
                ...state.isLoadedVPDConfirmation,
                [program_id]: true
              },
              file: '',
              res_modal_status: status
            }));
          }
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            isLoaded2: {
              ...state.isLoaded2,
              [program_id]: true
            },
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

  ConfirmError = () => {
    this.setState((state) => ({
      ...state,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  render() {
    const { res_status, isLoaded, res_modal_status, res_modal_message } =
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

    const app_name = this.state.student.applications.map((application, i) => (
      <div key={i}>
        {application.programId.uni_assist &&
          application.programId.uni_assist.includes('Yes') &&
          application.decided === 'O' && (
            <>
              <Row>
                <Link
                  to={'/programs/' + application.programId._id.toString()}
                  style={{ textDecoration: 'none' }}
                >
                  <h5 className="text-info">
                    {application.programId.school}{' '}
                    {application.programId.program_name}{' '}
                    {application.programId.uni_assist}
                    <FiExternalLink
                      className="mx-1 mb-1"
                      style={{ cursor: 'pointer' }}
                    />
                  </h5>
                </Link>
              </Row>
              <Row>
                {application.uni_assist?.status === 'notneeded' ? (
                  <>
                    <Col>
                      <p className="text-light">
                        Uni-assist is not necessary as it can be reused from
                        another program.
                      </p>
                    </Col>
                    <Col>
                      {is_TaiGer_AdminAgent(this.props.user) && (
                        <Button
                          size={'sm'}
                          color={'lightgray'}
                          onClick={(e) =>
                            this.opensetAsNotNeededWindow(
                              e,
                              this.state.student._id.toString(),
                              application.programId._id.toString()
                            )
                          }
                        >
                          Set needed
                        </Button>
                      )}
                    </Col>
                  </>
                ) : (
                  <>
                    {!application.uni_assist ||
                    application.uni_assist.status === DocumentStatus.Missing ||
                    application.uni_assist.status === 'notstarted' ? (
                      <>
                        {this.state.isLoaded2[
                          `${application.programId._id.toString()}`
                        ] ? (
                          <>
                            <Col md={1}>
                              <h5 className="mt-1 text-light">VPD</h5>
                            </Col>
                            <Col md={1}>
                              <Form.Group
                                controlId={`0${application.programId._id.toString()}`}
                              >
                                <Form.Label>
                                  <IoMdCloudUpload
                                    color={'lightgray'}
                                    size={32}
                                  />
                                </Form.Label>
                                <Form.Control
                                  hidden
                                  type="file"
                                  onChange={(e) =>
                                    this.handleUniAssistDocSubmit(
                                      e,
                                      this.state.student._id.toString(),
                                      application.programId._id.toString()
                                    )
                                  }
                                />
                              </Form.Group>
                            </Col>
                            <Col md={1}></Col>
                          </>
                        ) : (
                          <div>
                            <Spinner
                              // className="mx-2 my-2"
                              animation="border"
                              role="status"
                              variant="light"
                            >
                              <span className="visually-hidden"></span>
                            </Spinner>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Col md={1}>
                          <h5 className="mt-1 text-light">VPD</h5>
                        </Col>
                        <Col md={1}>
                          <a
                            href={`${BASE_URL}/api/students/${this.state.student._id.toString()}/vpd/${application.programId._id.toString()}/VPD`}
                            target="_blank"
                          >
                            <Button
                              title="Download"
                              disabled={
                                !this.state.isLoaded2[
                                  application.programId._id.toString()
                                ]
                              }
                              size={'sm'}
                            >
                              <AiOutlineDownload size={16} />
                            </Button>
                          </a>
                        </Col>
                        <Col md={1}>
                          <Button
                            onClick={(e) =>
                              this.onDeleteVPDFileWarningPopUp(
                                e,
                                this.state.student._id.toString(),
                                application.programId._id.toString(),
                                'VPD'
                              )
                            }
                            disabled={
                              !this.state.isLoaded2[
                                application.programId._id.toString()
                              ]
                            }
                            variant={'danger'}
                            size={'sm'}
                          >
                            <AiOutlineDelete size={16} />
                          </Button>
                        </Col>
                      </>
                    )}
                    {!application.uni_assist?.vpd_paid_confirmation_file_path ||
                    application.uni_assist?.vpd_paid_confirmation_file_path ===
                      '' ? (
                      <>
                        {this.state.isLoadedVPDConfirmation[
                          `${application.programId._id.toString()}`
                        ] ? (
                          <>
                            <Col md={4}>
                              <p className="mt-1 text-light">
                                Confirmation Form (if applicable)
                              </p>
                            </Col>
                            <Col md={1}>
                              <Form.Group
                                controlId={`${application.programId._id.toString()}`}
                              >
                                <Form.Label>
                                  <IoMdCloudUpload
                                    color={'lightgray'}
                                    size={32}
                                  />
                                </Form.Label>
                                <Form.Control
                                  hidden
                                  type="file"
                                  onChange={(e) =>
                                    this.handleUniAssistVPDPaidConfirmationDocSubmit(
                                      e,
                                      this.state.student._id.toString(),
                                      application.programId._id.toString()
                                    )
                                  }
                                />
                              </Form.Group>
                            </Col>
                            <Col md={1}></Col>
                          </>
                        ) : (
                          <Col md={1}>
                            <Spinner
                              // className="mx-2 my-2"
                              animation="border"
                              role="status"
                              variant="light"
                            >
                              <span className="visually-hidden"></span>
                            </Spinner>
                          </Col>
                        )}
                      </>
                    ) : (
                      <>
                        <Col md={4}>
                          <p className="mt-1 text-light">
                            Confirmation Form (if applicable)
                          </p>
                        </Col>
                        <Col md={1}>
                          <a
                            href={`${BASE_URL}/api/students/${this.state.student._id.toString()}/vpd/${application.programId._id.toString()}/VPDConfirmation`}
                            target="_blank"
                          >
                            <Button
                              title="Download"
                              disabled={
                                !this.state.isLoaded2[
                                  application.programId._id.toString()
                                ]
                              }
                              size={'sm'}
                            >
                              <AiOutlineDownload size={16} />
                            </Button>
                          </a>
                        </Col>
                        <Col md={1}>
                          <Button
                            onClick={(e) =>
                              this.onDeleteVPDFileWarningPopUp(
                                e,
                                this.state.student._id.toString(),
                                application.programId._id.toString(),
                                'VPDConfirmation'
                              )
                            }
                            disabled={
                              !this.state.isLoadedVPDConfirmation[
                                application.programId._id.toString()
                              ]
                            }
                            variant={'danger'}
                            size={'sm'}
                          >
                            <AiOutlineDelete size={16} />
                          </Button>
                        </Col>
                      </>
                    )}
                    {(!application.uni_assist ||
                      application.uni_assist.status ===
                        DocumentStatus.Missing ||
                      application.uni_assist.status === 'notstarted') && (
                      <>
                        {is_TaiGer_AdminAgent(this.props.user) && (
                          <>
                            <Col>
                              <Form>
                                <Form.Check
                                  type="checkbox"
                                  className="text-light"
                                  label={`Upload files and Paid`}
                                  value={'Is_Paid'}
                                  checked={application.uni_assist.isPaid}
                                  onChange={(e) =>
                                    this.onCheckHandler(
                                      e,
                                      this.state.student._id.toString(),
                                      application.programId._id.toString(),
                                      !application.uni_assist.isPaid
                                    )
                                  }
                                />
                              </Form>
                            </Col>
                            <Col>
                              {(!application.uni_assist
                                ?.vpd_paid_confirmation_file_path ||
                                application.uni_assist
                                  ?.vpd_paid_confirmation_file_path === '') && (
                                <Button
                                  size={'sm'}
                                  color={'lightgray'}
                                  onClick={(e) =>
                                    this.opensetAsNotNeededWindow(
                                      e,
                                      this.state.student._id.toString(),
                                      application.programId._id.toString()
                                    )
                                  }
                                >
                                  Set Not Needed
                                </Button>
                              )}
                            </Col>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </Row>
            </>
          )}
      </div>
    ));
    return (
      <>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        {check_uni_assist_needed(this.state.student) ? (
          <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
            <Card.Body>
              The following program needs uni-assist process, please check if
              paid, uploaded document and upload VPD here:
              {app_name}
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body>
              Based on the applications, Uni-Assist is NOT needed.
            </Card.Body>
          </Card>
        )}

        <Modal
          show={this.state.deleteVPDFileWarningModel}
          onHide={this.closeWarningWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to delete?</Modal.Body>
          <Modal.Footer>
            <Button
              disabled={
                !this.state.isLoaded2[this.state.program_id] ||
                !this.state.isLoadedVPDConfirmation[this.state.program_id]
              }
              onClick={(e) =>
                this.handleUniAssistDocDelete(e, this.state.program_id)
              }
            >
              {this.state.isLoaded2[this.state.program_id] ||
              this.state.isLoadedVPDConfirmation[this.state.program_id] ? (
                'Yes'
              ) : (
                <Spinner
                  size="sm"
                  animation="border"
                  role="status"
                  variant="light"
                >
                  <span className="visually-hidden"></span>
                </Spinner>
              )}
            </Button>
            <Button onClick={this.closeWarningWindow}>No</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.setAsNotNeededModel}
          onHide={this.closesetAsNotNeededWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Is VPD not necessary for this program (because other programs have
            already VPD and it can be reused for this)?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={
                !this.state.isLoaded2[this.state.program_id] ||
                !this.state.isLoadedVPDConfirmation[this.state.program_id]
              }
              onClick={(e) => this.handleSetAsNotNeeded(e)}
            >
              {this.state.isLoaded2[this.state.program_id] ||
              this.state.isLoadedVPDConfirmation[this.state.program_id] ? (
                'Yes'
              ) : (
                <Spinner
                  size="sm"
                  animation="border"
                  role="status"
                  variant="light"
                >
                  <span className="visually-hidden"></span>
                </Spinner>
              )}
            </Button>
            <Button onClick={this.closesetAsNotNeededWindow}>No</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default UniAssistListCard;
