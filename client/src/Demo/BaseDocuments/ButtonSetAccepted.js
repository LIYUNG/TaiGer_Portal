import React from 'react';
import { Col, Form, Button, Modal, Spinner, Offcanvas } from 'react-bootstrap';
import { BASE_URL } from '../../api/request';
import {
  AiOutlineDownload,
  AiOutlineWarning,
  AiOutlineDelete
} from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { FiExternalLink } from 'react-icons/fi';
import { showButtonIfMyStudent } from '../Utils/checking-functions';

class ButtonSetAccepted extends React.Component {
  state = {
    student: this.props.student,
    link: this.props.link,
    student_id: this.props.student._id.toString(),
    category: '',
    docName: '',
    comments: '',
    feedback: '',
    file: '',
    isLoaded: this.props.isLoaded,
    deleteFileWarningModel: false,
    CommentModel: false,
    rejectProfileFileModel: false,
    acceptProfileFileModel: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isLoaded !== this.props.isLoaded) {
      this.setState((state) => ({ ...state, isLoaded: this.props.isLoaded }));
    }
  }

  closeOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: false }));
  };
  openOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: true }));
  };
  closeWarningWindow = () => {
    this.setState((state) => ({
      ...state,
      deleteFileWarningModel: false,
      delete_field: ''
    }));
  };

  closeCommentWindow = () => {
    this.setState((state) => ({ ...state, CommentModel: false }));
  };

  closeRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: false }));
  };

  onChangeDeleteField = (e) => {
    this.setState({ delete_field: e.target.value });
  };

  onDeleteFileWarningPopUp = (e, category, student_id, docName) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      docName,
      deleteFileWarningModel: true
    }));
  };

  handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      feedback: rejectmessage
    }));
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      this.setState((state) => ({
        ...state,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      this.setState((state) => ({
        ...state,
        student_id,
        category,
        status,
        rejectProfileFileModel: true
      }));
    }
  };

  onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    this.props.onDeleteFilefromstudent(
      this.state.category,
      this.state.student_id
    );
  };

  onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    this.props.onUpdateProfileFilefromstudent(
      this.state.category,
      this.state.student_id,
      this.state.status,
      this.state.feedback
    );
  };

  updateDocLink = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    this.props.updateDocLink(this.state.link, this.props.k);
    this.setState((state) => ({
      ...state,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    this.setState((state) => ({
      ...state,
      link: url_temp
    }));
  };

  render() {
    const deleteStyle = 'danger';
    const rejectStyle = 'secondary';
    var ButttonRow_Accepted;
    ButttonRow_Accepted = (
      <tr>
        <td>
          <IoCheckmarkCircle
            size={24}
            color="limegreen"
            title="Valid Document"
          />
        </td>
        <td>
          {this.props.docName}
          <a
            href={
              this.state.link && this.state.link != '' ? this.state.link : '/'
            }
            target="_blank"
            className="text-info"
          >
            <FiExternalLink
              className="mx-1 mb-1"
              style={{ cursor: 'pointer' }}
            />
          </a>
          {this.props.role === 'Admin' && (
            <a onClick={this.openOffcanvasWindow} style={{ cursor: 'pointer' }}>
              [Edit]
            </a>
          )}

          {' - '}
          {this.props.date}
          {' - '}
          {this.props.time}
        </td>
        <td>
          <Col md>
            <a
              href={`${BASE_URL}/api/students/${this.state.student_id.toString()}/files/${
                this.props.path
              }`}
              target="_blank"
            >
              <Button size="sm" title="Download">
                <AiOutlineDownload size={16} />
              </Button>
            </a>
          </Col>
        </td>
        <td></td>
        {this.props.role === 'Editor' || this.props.role === 'Student' ? (
          <>
            <td></td>
            <td></td>
            <td></td>
          </>
        ) : (
          <>
            <td>
              <Col md>
                <Form
                  onSubmit={(e) =>
                    this.onUpdateProfileDocStatus(
                      e,
                      this.props.k,
                      this.state.student_id,
                      'rejected'
                    )
                  }
                >
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Button
                      variant={rejectStyle}
                      size="sm"
                      type="submit"
                      disabled={!this.state.isLoaded}
                    >
                      <AiOutlineWarning size={16} />
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </td>
            <td></td>
            <td>
              <Col>
                {showButtonIfMyStudent(this.props.user, this.state.student) && (
                  <Form
                    onSubmit={(e) =>
                      this.onDeleteFileWarningPopUp(
                        e,
                        this.props.k,
                        this.state.student_id,
                        this.props.docName
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button
                        variant={deleteStyle}
                        size="sm"
                        type="submit"
                        title="Delete"
                        disabled={!this.state.isLoaded}
                      >
                        <AiOutlineDelete size={16} />
                      </Button>
                    </Form.Group>
                  </Form>
                )}
              </Col>
            </td>
          </>
        )}
      </tr>
    );

    return (
      <>
        {ButttonRow_Accepted}
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
            Do you want to delete {this.props.docName}?
            <Form.Group
              // controlId="target_application_field"
              className="my-0 mx-0"
            >
              <Form.Label className="my-1 mx-0">
                Please enter{' '}
                <i>
                  <b>delete</b>
                </i>{' '}
                in order to delete the base document.
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
              disabled={
                !this.state.isLoaded || this.state.delete_field !== 'delete'
              }
              onClick={(e) => this.onDeleteFilefromstudent(e)}
            >
              {!this.state.isLoaded ? (
                <div>
                  <Spinner
                    animation="border"
                    role="status"
                    variant="light"
                    size="sm"
                  >
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              ) : (
                'Yes'
              )}
            </Button>
            <Button onClick={this.closeWarningWindow}>No</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.rejectProfileFileModel}
          onHide={this.closeRejectWarningWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="rejectmessage">
              <Form.Label>
                Please give a reason why the uploaded {this.state.category} is
                invalied?
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="ex. Poor scanned quality."
                defaultValue={''}
                onChange={(e) => this.handleRejectMessage(e, e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={this.state.feedback === ''}
              onClick={(e) => this.onUpdateProfileFilefromstudent(e)}
            >
              {!this.state.isLoaded ? (
                <div>
                  <Spinner
                    animation="border"
                    role="status"
                    variant="light"
                    size="sm"
                  >
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              ) : (
                'Yes'
              )}
            </Button>
            <Button onClick={this.closeRejectWarningWindow}>No</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.CommentModel}
          onHide={this.closeCommentWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Comments
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.comments}</Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeCommentWindow}>
              {!this.state.isLoaded ? (
                <div>
                  <Spinner
                    animation="border"
                    role="status"
                    variant="light"
                    size="sm"
                  >
                    <span className="visually-hidden"></span>
                  </Spinner>
                </div>
              ) : (
                'Ok'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
        <Offcanvas
          show={this.state.baseDocsflagOffcanvas}
          onHide={this.closeOffcanvasWindow}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Edit</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Documentation Link for <b>{this.props.docName}</b>
              </Form.Label>
              <Form.Control
                placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
                defaultValue={this.state.link}
                onChange={(e) => this.onChangeURL(e)}
              />
            </Form.Group>
            <Button
              onClick={(e) => this.updateDocLink(e)}
              disabled={this.state.baseDocsflagOffcanvasButtonDisable}
            >
              Save
            </Button>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
}

export default ButtonSetAccepted;