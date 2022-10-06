import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import {
  AiOutlineDownload,
  AiOutlineFieldTime,
  AiOutlineDelete
} from 'react-icons/ai';
// import { AiFillCloseCircle, AiFillQuestionCircle } from "react-icons/ai";
// import { IoCheckmarkCircle } from "react-icons/io5";
// import { Card, Col, Row } from "react-bootstrap";
// import { Dropdown, DropdownButton } from "react-bootstrap";
import { downloadProfile } from '../../../../api';

class NewBaseFileUploaded extends React.Component {
  state = {
    student_id: '',
    category: '',
    comments: '',
    feedback: '',
    file: '',
    isLoaded: this.props.isLoaded,
    CommentModel: false,
    rejectProfileFileModel: false,
    acceptProfileFileModel: false
  };

  closeCommentWindow = () => {
    this.setState((state) => ({ ...state, CommentModel: false }));
  };

  closeRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: false }));
  };

  closeAcceptWarningWindow = () => {
    this.setState((state) => ({ ...state, acceptProfileFileModel: false }));
  };

  handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      feedback: rejectmessage
    }));
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

  onDownloadFilefromstudent(e, category, id) {
    e.preventDefault();
    // this.setState((state) => ({
    //   ...state,
    //   isLoaded: false
    // }));
    downloadProfile(category, id).then(
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
          alert('resp.data.message');
        }
      },
      (error) => {
        alert('The file is not available.');
      }
    );
  }

  render() {
    const acceptStyle = 'warning';
    const deleteStyle = 'danger';
    let keys = Object.keys(window.profile_list);
    let object_init = {};

    return (
      <>
        <tr>
          <td>
            <Link
              to={'/student-database/' + this.props.student._id + '/profile'}
              className="text-info"
              style={{ textDecoration: 'none' }}
            >
              {this.props.student.firstname}
              {' - '}
              {this.props.student.lastname}
            </Link>
          </td>
          <td>
            <p className="text-primary">{this.props.Doc_key.replace(/_/g, ' ')}</p>
          </td>
          <td>
            <Button
              size="sm"
              type="submit"
              title="Download"
              onClick={(e) =>
                this.onDownloadFilefromstudent(
                  e,
                  this.props.Doc_key,
                  this.props.student._id
                )
              }
            >
              <AiOutlineDownload size={16} />
            </Button>
          </td>
          <td>
            <Button
              variant={acceptStyle}
              size="sm"
              type="submit"
              title="Accept"
              onClick={(e) =>
                this.onUpdateProfileDocStatus(
                  e,
                  this.props.Doc_key,
                  this.props.student._id,
                  'accepted'
                )
              }
            >
              O
            </Button>
          </td>
          <td>
            <Button
              variant={deleteStyle}
              size="sm"
              type="submit"
              title="Reject"
              disabled={!this.state.isLoaded}
              onClick={(e) =>
                this.onUpdateProfileDocStatus(
                  e,
                  this.props.Doc_key,
                  this.props.student._id,
                  'rejected'
                )
              }
            >
              X
            </Button>
          </td>
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
                Yes
              </Button>
              <Button onClick={this.closeAcceptWarningWindow}>No</Button>
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
                Yes
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
              <Button onClick={this.closeCommentWindow}>Ok</Button>
            </Modal.Footer>
          </Modal>
        </tr>
      </>
    );
  }
}

export default NewBaseFileUploaded;
