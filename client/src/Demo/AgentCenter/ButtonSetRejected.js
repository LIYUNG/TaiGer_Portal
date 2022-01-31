import React from "react";
import {
  Row,
  Col,
  Form,
  Table,
  Button,
  Card,
  Collapse,
  Modal,
  Spinner,
} from "react-bootstrap";
import UcFirst from "../../App/components/UcFirst";
import { IoMdCloudUpload } from "react-icons/io";
import {
  AiOutlineDownload,
  AiOutlineFieldTime,
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineComment,
  AiOutlineDelete,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDash } from "react-icons/bs";
import {
  uploadforstudent,
  updateProfileDocumentStatus,
  deleteFile,
  getStudents,
  downloadProfile,
} from "../../api";

class ButtonSetRejected extends React.Component {
  state = {
    student: this.props.student,
    student_id: "",
    category: "",
    docName: "",
    comments: this.props.message,
    file: "",
    isLoaded: this.props.isLoaded,
    deleteFileWarningModel: this.props.deleteFileWarningModel,
    CommentModel: this.props.CommentModel,
    rejectProfileFileModel: this.props.rejectProfileFileModel,
    acceptProfileFileModel: this.props.acceptProfileFileModel,
  };

  openWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: true }));
  };

  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };

  openCommentWindow = (student_id, category) => {
    console.log();
    this.setState((state) => ({
      ...state,
      CommentModel: true,
      student_id,
      category,
    }));
  };

  closeCommentWindow = () => {
    this.setState((state) => ({ ...state, CommentModel: false }));
  };

  openRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: true }));
  };

  closeRejectWarningWindow = () => {
    this.setState((state) => ({ ...state, rejectProfileFileModel: false }));
  };

  openAcceptWarningWindow = () => {
    this.setState((state) => ({ ...state, acceptProfileFileModel: true }));
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
      deleteFileWarningModel: true,
    }));
  };

  handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      comments: rejectmessage,
    }));
  };

  onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === "accepted") {
      this.setState((state) => ({
        ...state,
        student_id,
        category,
        status,
        acceptProfileFileModel: true,
      }));
    } else {
      this.setState((state) => ({
        ...state,
        student_id,
        category,
        status,
        rejectProfileFileModel: true,
      }));
    }
  };

  onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    this.props.onDeleteFilefromstudent(
      this.state.category,
      this.state.student_id
    );
  };

  onUpdateProfileFilefromstudent = (e) => {
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    e.preventDefault();
    this.props.onUpdateProfileFilefromstudent(
      this.state.category,
      this.state.student_id,
      this.state.status,
      this.state.comments
    );
  };
  onUpdateRejectMessageStudent = (e) => {
    this.setState((state) => ({
      ...state,
      isLoaded: false,
    }));
    e.preventDefault();
    updateProfileDocumentStatus(
      this.state.category,
      this.state.student_id,
      "rejected",
      this.state.comments
    ).then(
      (res) => {
        const { data, success } = res.data;
        if (success) {
          // setTimeout will be remove in production
          setTimeout(
            function () {
              //Start the timer
              this.setState((state) => ({
                ...state,
                student: data,
                success,
                CommentModel: false,
                isLoaded: true,
              }));
            }.bind(this),
            1500
          );
        } else {
          alert(res.data.message);
          this.setState((state) => ({
            ...state,
            isLoaded: true,
          }));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };
  render() {
    const deleteStyle = "danger";
    const graoutStyle = "light";
    var ButttonRow_Rejected;
    ButttonRow_Rejected = (
      <tr key={this.props.key + 1}>
        <td>
          <AiFillCloseCircle size={24} color="red" title="Invalid Document" />
        </td>
        <td>
          {this.props.docName}
          {" - "}
          {this.props.date}
          {" - "}
          {this.props.time}
        </td>
        <td>
          <Col>
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
        {this.props.role === "Editor" ? (
          <>
            <td></td>
            <td>
              <Button
                size="sm"
                type="submit"
                disabled={!this.state.isLoaded}
                title="Show Comments"
                onClick={(e) =>
                  this.openCommentWindow(
                    this.props.student_id,
                    this.props.k,
                  )
                }
              >
                <AiOutlineComment size={20} />
              </Button>
            </td>
            <td></td>
          </>
        ) : (
          <>
            {this.props.role === "Student" ? (
              <>
                <td></td>
                <td>
                  <Button
                    size="sm"
                    type="submit"
                    disabled={!this.state.isLoaded}
                    title="Show Comments"
                    onClick={(e) =>
                      this.openCommentWindow(
                        this.props.student_id,
                        this.props.k,
                      )
                    }
                  >
                    <AiOutlineComment size={20} />
                  </Button>
                </td>
                <td></td>
              </>
            ) : (
              <>
                <td>
                  {/* <Col>
                    <Form
                      onSubmit={(e) =>
                        this.onUpdateProfileDocStatus(
                          e,
                          this.props.k,
                          this.props.student_id,
                          "rejected"
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button
                          size="sm"
                          type="submit"
                          disabled={!this.state.isLoaded}
                        >
                          Reject
                        </Button>
                      </Form.Group>
                    </Form>
                  </Col> */}
                </td>
                <td>
                  <Button
                    size="sm"
                    type="submit"
                    disabled={!this.state.isLoaded}
                    title="Show Comments"
                    onClick={(e) =>
                      this.openCommentWindow(
                        this.props.student_id,
                        this.props.k,
                      )
                    }
                  >
                    <AiOutlineComment size={20} />
                  </Button>
                </td>
                <td>
                  <Col>
                    <Form
                      onSubmit={(e) =>
                        this.onUpdateProfileDocStatus(
                          e,
                          this.props.k,
                          this.props.student_id,
                          "accepted"
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button
                          size="sm"
                          type="submit"
                          disabled={!this.state.isLoaded}
                        >
                          Accept
                        </Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
              </>
            )}
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
      </tr>
    );

    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    return (
      <>
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
        {/* <Modal
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
                defaultValue={""}
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
              disabled={!this.state.isLoaded}
              onClick={(e) => this.onUpdateProfileFilefromstudent(e)}
            >
              Yes
            </Button>
            <Button onClick={this.closeRejectWarningWindow}>No</Button>
          </Modal.Footer>
        </Modal> */}
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
              onClick={(e) => this.onUpdateProfileFilefromstudent(e)}
            >
              Yes
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

          {this.props.role === "Student" ? (
            <>
              <Modal.Body>{this.state.comments}</Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeCommentWindow}>Ok</Button>
              </Modal.Footer>
            </>
          ) : (
            <>
              <Modal.Body>
                <Form.Group controlId="rejectmessage">
                  <Form.Label>
                    Please give a reason why the uploaded {this.state.category}{" "}
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
                {!this.state.isLoaded && (
                  <div style={style}>
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={(e) => this.onUpdateRejectMessageStudent(e)}>
                  Update
                </Button>
                <Button onClick={this.closeCommentWindow}>Close</Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </>
    );
  }
}

export default ButtonSetRejected;
