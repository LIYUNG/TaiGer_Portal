import React from 'react';
import { Col, Form, Button, Modal, Spinner, Offcanvas } from 'react-bootstrap';

import FilePreview from '../../components/FilePreview/FilePreview';
import { BASE_URL } from '../../api/request';
import {
  AiOutlineDownload,
  AiOutlineCheck,
  AiOutlineFieldTime,
  AiOutlineWarning,
  AiOutlineDelete,
  AiOutlineClose
} from 'react-icons/ai';
import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import {
  is_TaiGer_Admin,
  is_TaiGer_AdminAgent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import {
  ACCEPT_STYLE,
  DELETE_STYLE,
  REJECT_STYLE,
  base_documents_checklist,
  convertDate
} from '../Utils/contants';
import { FiExternalLink } from 'react-icons/fi';

class ButtonSetUploaded extends React.Component {
  state = {
    student: this.props.student,
    link: this.props.link,
    student_id: this.props.student._id.toString(),
    category: '',
    docName: '',
    comments: '',
    file: '',
    isLoaded: this.props.isLoaded,
    feedback: '',
    deleteFileWarningModel: false,
    CommentModel: false,
    showPreview: false,
    preview_path: '#',
    num_points: base_documents_checklist[this.props.k]
      ? base_documents_checklist[this.props.k].length
      : 0,
    num_checked_points: 0,
    checkedBoxes: [],
    rejectProfileFileModel: false,
    acceptProfileFileModel: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.isLoaded !== this.props.isLoaded ||
      prevProps.student._id.toString() !== this.props.student._id.toString()
    ) {
      this.setState((state) => ({
        ...state,
        isLoaded: this.props.isLoaded,
        student_id: this.props.student._id.toString()
      }));
    }
  }

  closeOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: false }));
  };
  openOffcanvasWindow = () => {
    this.setState((state) => ({ ...state, baseDocsflagOffcanvas: true }));
  };

  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
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

  onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    this.props.onDeleteFilefromstudent(
      this.state.category,
      this.state.student_id
    );
  };

  onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    this.props.onUpdateProfileFilefromstudent(
      this.state.category,
      this.state.student_id,
      this.state.status,
      this.state.feedback
    );
  };

  onChecked = (e) => {
    const id = e.target.id;
    const isChecked = e.target.checked;
    const temp_checkedBoxes = [...this.state.checkedBoxes];
    if (isChecked) {
      // Add the ID to the list
      temp_checkedBoxes.push(id);
    } else {
      // Remove the ID from the list
      const index = temp_checkedBoxes.indexOf(id);
      if (index > -1) {
        temp_checkedBoxes.splice(index, 1);
      }
    }

    this.setState((state) => ({
      ...state,
      checkedBoxes: temp_checkedBoxes
    }));
  };

  render() {
    var ButttonRow_Uploaded;
    ButttonRow_Uploaded = (
      <tr>
        <td>
          <AiOutlineFieldTime
            size={24}
            color="orange"
            title="Uploaded successfully"
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
          {is_TaiGer_Admin(this.props.user) && (
            <a onClick={this.openOffcanvasWindow} style={{ cursor: 'pointer' }}>
              [Edit]
            </a>
          )}
        </td>
        <td>{convertDate(this.props.time)}</td>
        <td>
          <Col md>
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
        {is_TaiGer_Editor(this.props.user) ||
        is_TaiGer_Student(this.props.user) ? (
          <>
            <td></td>
            <td></td>
          </>
        ) : (
          <>
            <td></td>
            <td></td>
          </>
        )}
        <td></td>
        {is_TaiGer_Editor(this.props.user) ? (
          <td></td>
        ) : (
          <td>
            <Col md>
              {
                <Button
                  variant={DELETE_STYLE}
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
              }
            </Col>
          </td>
        )}
      </tr>
    );

    return (
      <>
        {ButttonRow_Uploaded}
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
              disabled={this.state.feedback === '' || !this.state.isLoaded}
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
                'Submit'
              )}
            </Button>
            <Button onClick={this.closeRejectWarningWindow}>No</Button>
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
            {is_TaiGer_AdminAgent(this.props.user) && (
              <>
                <h4>
                  {base_documents_checklist[this.props.k] &&
                    base_documents_checklist[this.props.k].length !== 0 &&
                    'Check list: Please check the following points so that you can flag this document as valid.'}
                </h4>
                <p>
                  {base_documents_checklist[this.props.k]
                    ? base_documents_checklist[this.props.k].map(
                        (check_item, i) => (
                          <Form.Check
                            key={i}
                            type={'checkbox'}
                            id={`${check_item}-${i}`}
                            label={`${check_item}`}
                            onChange={(e) => this.onChecked(e)}
                          />
                        )
                      )
                    : 'No'}
                </p>
              </>
            )}
            {/* <p>{this.state.num_points}</p>
            <p>{this.state.checkedBoxes}</p> */}
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
            {is_TaiGer_AdminAgent(this.props.user) && (
              <>
                <Button
                  variant={ACCEPT_STYLE}
                  size="sm"
                  type="submit"
                  title="Mark as finished"
                  disabled={
                    !this.state.isLoaded ||
                    this.state.num_points !== this.state.checkedBoxes.length
                  }
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
                <Button
                  variant={REJECT_STYLE}
                  size="sm"
                  type="submit"
                  title="Mark as reject"
                  disabled={!this.state.isLoaded}
                  onClick={(e) =>
                    this.onUpdateProfileDocStatus(
                      e,
                      this.props.k,
                      this.state.student_id,
                      'rejected'
                    )
                  }
                >
                  <AiOutlineWarning size={16} />
                </Button>
              </>
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

export default ButtonSetUploaded;
