import React from 'react';
import { Col, Form, Button, Modal, Spinner, Offcanvas } from 'react-bootstrap';
import {
  AiOutlineDownload,
  AiOutlineCheck,
  AiFillCloseCircle,
  AiOutlineComment,
  AiOutlineDelete,
  AiOutlineClose
} from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';

import FilePreview from '../../components/FilePreview/FilePreview';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import {
  is_TaiGer_AdminAgent,
  showButtonIfMyStudent
} from '../Utils/checking-functions';
import { convertDate } from '../Utils/contants';
import { BASE_URL } from '../../api/request';

import { updateProfileDocumentStatus, deleteFile } from '../../api';

class ButtonSetRejected extends React.Component {
  state = {
    error: '',
    student: this.props.student,
    link: this.props.link,
    student_id: this.props.student._id.toString(),
    category: '',
    docName: '',
    feedback: '',
    comments: this.props.message,
    file: '',
    isLoaded: this.props.isLoaded,
    deleteFileWarningModel: this.props.deleteFileWarningModel,
    CommentModel: this.props.CommentModel,
    showPreview: false,
    preview_path: '#',
    rejectProfileFileModel: this.props.rejectProfileFileModel,
    acceptProfileFileModel: this.props.acceptProfileFileModel,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false,
    res_modal_status: 0,
    res_modal_message: ''
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

  openWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: true }));
  };

  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };

  openCommentWindow = (student_id, category) => {
    this.setState((state) => ({
      ...state,
      CommentModel: true,
      student_id,
      category
    }));
  };

  closeCommentWindow = () => {
    this.setState((state) => ({ ...state, CommentModel: false }));
  };

  closePreviewWindow = () => {
    this.setState((state) => ({ ...state, showPreview: false }));
  };

  showPreview = (e, path) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      showPreview: true,
      preview_path: path
    }));
  };

  closeRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: false }));
  };

  closeAcceptWarningWindow = () => {
    this.setState((state) => ({ ...state, acceptProfileFileModel: false }));
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
      comments: rejectmessage
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
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    e.preventDefault();
    this.props.onUpdateProfileFilefromstudent(
      this.state.category,
      this.state.student_id,
      this.state.status,
      this.state.comments
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

  onUpdateRejectMessageStudent = (e) => {
    this.setState((state) => ({
      ...state,
      isLoaded: false
    }));
    e.preventDefault();
    updateProfileDocumentStatus(
      this.state.category,
      this.state.student_id,
      'rejected',
      this.state.comments
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          this.setState((state) => ({
            ...state,
            student: data,
            success,
            CommentModel: false,
            isLoaded: true,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          this.setState((state) => ({
            ...state,
            isLoaded: true,
            res_modal_status: status,
            res_modal_message: message
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
    const { res_status, res_modal_status, res_modal_message } = this.state;
    const deleteStyle = 'danger';
    const acceptStyle = 'success';
    var ButttonRow_Rejected;
    ButttonRow_Rejected = (
      <tr>
        <td>
          <AiFillCloseCircle size={24} color="red" title="Invalid Document" />
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
        </td>
        <td>{convertDate(this.props.time)}</td>
        <td>
          <Col>
            {/* <a
              href={`${BASE_URL}/api/students/${this.state.student_id.toString()}/files/${
                this.props.path
              }`}
              target="_blank"
            >
              <Button size="sm" type="submit" title="Download">
                <AiOutlineDownload size={16} />
              </Button>
            </a> */}
            <Button
              size="sm"
              title="Download"
              onClick={(e) => this.showPreview(e, this.props.path)}
            >
              <AiOutlineDownload size={16} />
            </Button>
          </Col>
        </td>
        <td>
          {is_TaiGer_AdminAgent(this.props.user) && (
            <Col>
              {showButtonIfMyStudent(this.props.user, this.state.student) && (
                <Button
                  variant={acceptStyle}
                  size="sm"
                  type="submit"
                  title="Mark as finished"
                  disabled={!this.state.isLoaded}
                  onClick={(e) =>
                    this.onUpdateProfileDocStatus(
                      e,
                      this.props.k,
                      this.state.student_id,
                      'accepted'
                    )
                  }
                >
                  <AiOutlineCheck />
                </Button>
              )}
            </Col>
          )}
        </td>
        <td>
          <Button
            size="sm"
            type="submit"
            variant="light"
            disabled={!this.state.isLoaded}
            title="Show Comments"
            onClick={(e) =>
              this.openCommentWindow(this.state.student_id, this.props.k)
            }
          >
            <AiOutlineComment size={20} />
          </Button>
        </td>
        <td></td>
        {this.props.role === 'Agent' ||
        this.props.role === 'Admin' ||
        this.props.role === 'Student' ? (
          <>
            <td>
              <Col>
                {showButtonIfMyStudent(this.props.user, this.state.student) && (
                  <Button
                    variant={deleteStyle}
                    size="sm"
                    type="submit"
                    title="Delete"
                    disabled={!this.state.isLoaded}
                    onClick={(e) =>
                      this.onDeleteFileWarningPopUp(
                        e,
                        this.props.k,
                        this.state.student_id,
                        this.props.docName
                      )
                    }
                  >
                    <AiOutlineDelete size={16} />
                  </Button>
                )}
              </Col>
            </td>
          </>
        ) : (
          <>
            <td></td>
          </>
        )}
      </tr>
    );

    return (
      <>
        {res_modal_status >= 400 && (
          <ModalMain
            ConfirmError={this.ConfirmError}
            res_modal_status={res_modal_status}
            res_modal_message={res_modal_message}
          />
        )}
        {ButttonRow_Rejected}
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
          <Modal.Body>Do you want to delete {this.props.docName}?</Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!this.state.isLoaded}
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
            <Button onClick={this.closeWarningWindow} variant="light">
              No
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.acceptProfileFileModel}
          onHide={this.closeAcceptWarningWindow}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.category} is a valid and can be used for the
            application?
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!this.state.isLoaded}
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
            <Button onClick={this.closeAcceptWarningWindow}>No</Button>
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

          {this.props.role === 'Student' ? (
            <>
              <Modal.Body>
                <p>{this.state.comments}</p>
                <p>Please delete the old file before upload the new file.</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeCommentWindow}>Ok</Button>
              </Modal.Footer>
            </>
          ) : (
            <>
              <Modal.Body>
                <Form.Group controlId="rejectmessage">
                  <Form.Label>
                    Please give a reason why the uploaded {this.state.category}{' '}
                    is invalied?
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ex. Poor scanned quality."
                    defaultValue={this.state.comments}
                    onChange={(e) =>
                      this.handleRejectMessage(e, e.target.value)
                    }
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                {showButtonIfMyStudent(this.props.user, this.state.student) && (
                  <Button
                    disabled={this.state.comments === ''}
                    onClick={(e) => this.onUpdateRejectMessageStudent(e)}
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
                      'Update'
                    )}
                  </Button>
                )}

                <Button onClick={this.closeCommentWindow} variant="light">
                  Close
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
        <Modal
          show={this.state.showPreview}
          onHide={this.closePreviewWindow}
          aria-labelledby="contained-modal-title-vcenter2"
          size="xl"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-d-title-vcenter">
              {this.props.path}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FilePreview
              path={this.state.preview_path}
              student_id={this.state.student_id.toString()}
            />
          </Modal.Body>
          <Modal.Footer>
            {this.props.path.split('.')[1] !== 'pdf' && (
              <a
                href={`${BASE_URL}/api/students/${this.state.student_id.toString()}/files/${
                  this.props.path
                }`}
                download
                target="_blank"
              >
                <Button size="sm" title="Download">
                  <AiOutlineDownload size={16} />
                </Button>
              </a>
            )}
            {!(
              this.props.role === 'Editor' || this.props.role === 'Student'
            ) && (
              <Form
                onSubmit={(e) =>
                  this.onUpdateProfileDocStatus(
                    e,
                    this.props.k,
                    this.state.student_id,
                    'accepted'
                  )
                }
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Button
                    variant={acceptStyle}
                    size="sm"
                    type="submit"
                    title="Mark as finshed"
                    disabled={!this.state.isLoaded}
                  >
                    <AiOutlineCheck size={16} />
                  </Button>
                </Form.Group>
              </Form>
            )}
            <Button size="sm" onClick={this.closePreviewWindow}>
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
                <AiOutlineClose size={16} />
              )}
            </Button>
          </Modal.Footer>
        </Modal>
        <OffcanvasBaseDocument
          show={this.state.baseDocsflagOffcanvas}
          onHide={this.closeOffcanvasWindow}
          link={this.state.link}
          docName={this.props.docName}
          onChangeURL={this.onChangeURL}
          updateDocLink={this.updateDocLink}
          baseDocsflagOffcanvasButtonDisable={
            this.state.baseDocsflagOffcanvasButtonDisable
          }
        />
      </>
    );
  }
}

export default ButtonSetRejected;
