import React from 'react';
import { Col, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { AiOutlineDownload, AiOutlineDelete } from 'react-icons/ai';
import { IoCheckmarkCircle } from 'react-icons/io5';

class ButtonSetAccepted extends React.Component {
  state = {
    student: this.props.student,
    student_id: '',
    category: '',
    docName: '',
    comments: '',
    feedback: '',
    file: '',
    isLoaded: this.props.isLoaded,
    deleteFileWarningModel: false,
    CommentModel: false,
    rejectProfileFileModel: false,
    acceptProfileFileModel: false
  };

  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };

  closeCommentWindow = () => {
    this.setState((state) => ({ ...state, CommentModel: false }));
  };

  closeRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: false }));
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
  render() {
    const deleteStyle = 'danger';
    // const graoutStyle = 'light';
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
          {' - '}
          {this.props.date}
          {' - '}
          {this.props.time}
        </td>
        <td>
          <Col md>
            <Form
              onSubmit={(e) =>
                this.props.onDownloadFilefromstudent(
                  e,
                  this.props.k,
                  this.props.student_id
                )
              }
            >
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Button size="sm" type="submit" title="Download">
                  <AiOutlineDownload size={16} />
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </td>
        {this.props.role === 'Editor' ? (
          <>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </>
        ) : (
          <>
            {this.props.role === 'Student' ? (
              <>
                <td></td>
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
                          this.props.student_id,
                          'rejected'
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button
                          variant={deleteStyle}
                          size="sm"
                          type="submit"
                          disabled={!this.state.isLoaded}
                        >
                          X
                        </Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td></td>
                <td></td>
                <td>
                  <Col>
                    <Form
                      onSubmit={(e) =>
                        this.onDeleteFileWarningPopUp(
                          e,
                          this.props.k,
                          this.props.student_id,
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
                  </Col>
                </td>
              </>
            )}
          </>
        )}
      </tr>
    );

    const style = {
      position: 'fixed',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
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
            {!this.state.isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={!this.state.isLoaded}
              onClick={(e) => this.onDeleteFilefromstudent(e)}
            >
              Yes
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
            {!this.state.isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
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
      </>
    );
  }
}

export default ButtonSetAccepted;
