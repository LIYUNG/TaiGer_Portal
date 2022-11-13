import React from 'react';
import {
  Row,
  Col,
  Form,
  Table,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner
} from 'react-bootstrap';
import { IoMdCloudUpload } from 'react-icons/io';
import {
  uploadVPDforstudent,
  deleteVPDFile,
  downloadVPDProfile,
  getStudent,
  SetAsNotNeeded
} from '../../api';

import { AiOutlineDownload, AiOutlineDelete } from 'react-icons/ai';

import { Link } from 'react-router-dom';
import TimeOutErrors from '../Utils/TimeOutErrors';
import UnauthorizedError from '../Utils/UnauthorizedError';

class UniAssistListCard extends React.Component {
  state = {
    student_id: '',
    program_id: '',
    isLoaded: false,
    student: this.props.student,
    timeouterror: null,
    unauthorizederror: null,
    deleteVPDFileWarningModel: false,
    setAsNotNeededModel: false
  };
  componentDidMount() {
    if (!this.props.student) {
      getStudent(this.props.user._id.toString()).then(
        (resp) => {
          const { data, success } = resp.data;
          if (success) {
            this.setState({ isLoaded: true, student: data, success: success });
          } else {
            if (resp.status === 401 || resp.status === 500) {
              this.setState({ isLoaded: true, timeouterror: true });
            } else if (resp.status === 403) {
              this.setState({ isLoaded: true, unauthorizederror: true });
            }
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: true
          });
        }
      );
    } else {
      this.setState({
        isLoaded: true
      });
    }
  }
  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteVPDFileWarningModel: false }));
  };
  handleUniAssistDocSubmit = (e, student_id, program_id) => {
    e.preventDefault();
    this.onSubmitGeneralFile(e, e.target.files[0], student_id, program_id);
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

  handleSetAsNotNeeded = (e) => {
    e.preventDefault();
    SetAsNotNeeded(this.state.student_id, this.state.program_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState({
            isLoaded: true,
            student: data,
            success: success,
            setAsNotNeededModel: false,
            student_id: '',
            program_id: ''
          });
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({ isLoaded: true, unauthorizederror: true });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };

  handleUniAssistDocDelete = (e) => {
    this.setState({ isLoaded: false });
    deleteVPDFile(this.state.student_id, this.state.program_id).then(
      (resp) => {
        const { data, success } = resp.data;
        if (success) {
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            student: data,
            success: success,
            deleteVPDFileWarningModel: false
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error: true
        });
      }
    );
  };
  onDeleteVPDFileWarningPopUp = (e, student_id, program_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      program_id,
      deleteVPDFileWarningModel: true
    }));
  };

  handleUniAssistDocDownload = (e, student_id, program_id) => {
    e.preventDefault();
    downloadVPDProfile(student_id, program_id).then(
      (resp) => {
        const { status } = resp;
        if (status === 200) {
          const actualFileName =
            resp.headers['content-disposition'].split('"')[1];
          const { data: blob } = resp;
          if (blob.size === 0) return;

          var filetype = actualFileName.split('.'); //split file name
          filetype = filetype.pop(); //get the file type

          if (filetype === 'pdf') {
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: 'application/pdf' })
            );

            //Open the URL on new Window
            window.open(url); //TODO: having a reasonable file name, pdf viewer
          } else {
            //if not pdf, download instead.

            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', actualFileName);
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);
          }
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        alert('The file is not available.');
      }
    );
  };
  onSubmitGeneralFile = (e, NewFile, student_id, program_id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', NewFile);
    this.setState({ isLoaded: false });

    uploadVPDforstudent(student_id, program_id, formData).then(
      (resp) => {
        const { data, success } = resp.data;

        if (success) {
          this.setState((state) => ({
            ...state,
            student: data, // resp.data = {success: true, data:{...}}
            success,
            category: '',
            isLoaded: true,
            file: ''
          }));
        } else {
          if (resp.status === 401 || resp.status === 500) {
            this.setState({ isLoaded: true, timeouterror: true });
          } else if (resp.status === 403) {
            this.setState({
              isLoaded: true,
              unauthorizederror: true
            });
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  };

  render() {
    const { unauthorizederror, timeouterror, isLoaded } = this.state;

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
    const app_name = this.state.student.applications.map((application, i) => (
      <div key={i}>
        {application.programId.uni_assist === 'Yes-FULL' &&
          application.decided === 'O' && (
            <>
              <Row>
                <Link
                  to={'/programs/' + application.programId._id.toString()}
                  style={{ textDecoration: 'none' }}
                >
                  <h4 className="text-info">
                    {application.programId.school}{' '}
                    {application.programId.program_name}
                  </h4>
                  {' Yes-FULL'}
                </Link>
              </Row>
              <Row>
                {!application.uni_assist ||
                application.uni_assist.status === 'notstarted' ? (
                  <>
                    <Row>
                      {this.state.isLoaded ? (
                        <>
                          <Col>
                            <Form>
                              <Form.File.Label
                                onChange={(e) =>
                                  this.handleUniAssistDocSubmit(
                                    e,
                                    this.state.student._id.toString(),
                                    application.programId._id.toString()
                                  )
                                }
                                onClick={(e) => (e.target.value = null)}
                              >
                                <Form.File.Input hidden />
                                <IoMdCloudUpload
                                  color={'lightgray'}
                                  size={32}
                                />
                              </Form.File.Label>
                            </Form>
                          </Col>
                          {this.props.role === 'Agent' ||
                            (this.props.role === 'Admin' && (
                              <Col>
                                {this.props.role === 'Agent' ||
                                  (this.props.role === 'Admin' && (
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
                                  ))}
                              </Col>
                            ))}
                        </>
                      ) : (
                        <>
                          <div style={style}>
                            <Spinner
                              className="mx-2 my-2"
                              animation="border"
                              role="status"
                              variant="light"
                            >
                              <span className="visually-hidden"></span>
                            </Spinner>
                          </div>
                        </>
                      )}
                    </Row>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={(e) =>
                        this.handleUniAssistDocDownload(
                          e,
                          this.state.student._id.toString(),
                          application.programId._id.toString()
                        )
                      }
                      size={'sm'}
                    >
                      <AiOutlineDownload size={16} />
                    </Button>
                    <Button
                      onClick={(e) =>
                        this.onDeleteVPDFileWarningPopUp(
                          e,
                          this.state.student._id.toString(),
                          application.programId._id.toString()
                        )
                      }
                      size={'sm'}
                    >
                      <AiOutlineDelete size={16} />
                    </Button>
                  </>
                )}
              </Row>
            </>
          )}
        {application.programId.uni_assist === 'Yes-VPD' &&
          application.decided === 'O' && (
            <>
              <Row>
                <Link
                  to={'/programs/' + application.programId._id.toString()}
                  style={{ textDecoration: 'none' }}
                >
                  <h4 className="text-info">
                    {application.programId.school}{' '}
                    {application.programId.program_name}
                  </h4>
                  {' Yes-VPD'}
                </Link>
              </Row>
              <Row>
                {!application.uni_assist ||
                application.uni_assist.status === 'missing' ||
                application.uni_assist.status === 'notstarted' ? (
                  <>
                    {this.state.isLoaded ? (
                      <>
                        <Col md={1}>
                          <Form>
                            <Form.File.Label
                              onChange={(e) =>
                                this.handleUniAssistDocSubmit(
                                  e,
                                  this.state.student._id.toString(),
                                  application.programId._id.toString()
                                )
                              }
                              onClick={(e) => (e.target.value = null)}
                            >
                              <Form.File.Input hidden />
                              <IoMdCloudUpload color={'lightgray'} size={32} />
                            </Form.File.Label>
                          </Form>
                        </Col>
                        <Col>
                          {this.props.role === 'Agent' ||
                            (this.props.role === 'Admin' && (
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
                            ))}
                        </Col>
                      </>
                    ) : (
                      <>
                        <div>
                          <Spinner
                            animation="border"
                            role="status"
                            variant="light"
                          >
                            <span className="visually-hidden"></span>
                          </Spinner>
                        </div>
                      </>
                    )}
                  </>
                ) : application.uni_assist &&
                  application.uni_assist.status === 'notneeded' ? (
                  <>
                    <Col>
                      <p className="text-light">
                        Uni-assist is not necessary as it can be reused from
                        another program.
                      </p>
                    </Col>
                    <Col>
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
                        Set Needed
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col md={2}>
                      <Button
                        onClick={(e) =>
                          this.handleUniAssistDocDownload(
                            e,
                            this.state.student._id.toString(),
                            application.programId._id.toString()
                          )
                        }
                        size={'sm'}
                      >
                        <AiOutlineDownload size={16} />
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        onClick={(e) =>
                          this.onDeleteVPDFileWarningPopUp(
                            e,
                            this.state.student._id.toString(),
                            application.programId._id.toString()
                          )
                        }
                        variant={'danger'}
                        size={'sm'}
                      >
                        <AiOutlineDelete size={16} />
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </>
          )}
        {application.programId.uni_assist === 'No' &&
          application.decided === 'O' && (
            <>
              <Link
                to={'/programs/' + application.programId._id.toString()}
                style={{ textDecoration: 'none' }}
              >
                <h4 className="text-info">
                  {application.programId.school}{' '}
                  {application.programId.program_name}
                </h4>
              </Link>
              <p className="text-light">
                This program does NOT require Uni-Assist.
              </p>
            </>
          )}
        {application.programId.uni_assist === undefined &&
          application.decided === 'O' && (
            <>
              <p className="text-info">
                {application.programId.school}{' '}
                {application.programId.program_name}{' '}
              </p>
              <p className="text-light">
                This program does NOT require Uni-Assist.
              </p>
            </>
          )}
      </div>
    ));
    return (
      <>
        <Card className="mb-2 mx-0" bg={'dark'} text={'light'}>
          <Card.Body>{app_name}</Card.Body>
        </Card>
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
              disabled={!this.state.isLoaded}
              onClick={(e) => this.handleUniAssistDocDelete(e)}
            >
              Yes
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
              //   disabled={!this.state.isLoaded}
              onClick={(e) => this.handleSetAsNotNeeded(e)}
            >
              Yes
            </Button>
            <Button onClick={this.closesetAsNotNeededWindow}>No</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default UniAssistListCard;
