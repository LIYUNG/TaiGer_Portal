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

class EditFilesSubpage extends React.Component {
  state = {
    student: this.props.student,
    deleteFileWarningModel: false,
    CommentModel: false,
    student_id: "",
    applicationId: "",
    category: "",
    docName: "",
    whoupdate: "",
    file: "",
    comments: "",
    isLoaded: this.props.isLoaded,
  };
  openWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: true }));
  };

  closeWarningWindow = () => {
    this.setState((state) => ({ ...state, deleteFileWarningModel: false }));
  };

  openCommentWindow = (comments) => {
    console.log();
    this.setState((state) => ({ ...state, CommentModel: true, comments }));
  };

  closeCommentWindow = () => {
    this.setState((state) => ({ ...state, CommentModel: false }));
  };

  onDeleteFileWarningPopUp = (e, category, student_id) => {
    e.preventDefault();
    this.setState((state) => ({
      ...state,
      student_id,
      category,
      deleteFileWarningModel: true,
    }));
  };

  onDeleteFilefromstudent = (e) => {
    e.preventDefault();
    this.props.onDeleteFilefromstudent(
      this.state.category,
      this.state.student_id
    );
    this.setState((state) => ({
      ...state,
      deleteFileWarningModel: false,
    }));
  };
  render() {
    const deleteStyle = "danger";
    const graoutStyle = "light";
    let value2 = Object.values(this.props.documentlist2);
    let keys2 = Object.keys(this.props.documentlist2);
    let object_init = {};
    let object_message = {};
    let object_date_init = {};
    let object_time_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = "missing";
      object_message[keys2[i]] = "";
      object_date_init[keys2[i]] = "";
      object_time_init[keys2[i]] = "";
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === "uploaded") {
          object_init[this.props.student.profile[i].name] = "uploaded";
        } else if (this.props.student.profile[i].status === "accepted") {
          object_init[this.props.student.profile[i].name] = "accepted";
        } else if (this.props.student.profile[i].status === "rejected") {
          object_init[this.props.student.profile[i].name] = "rejected";
        } else if (this.props.student.profile[i].status === "notneeded") {
          object_init[this.props.student.profile[i].name] = "notneeded";
        } else if (this.props.student.profile[i].status === "missing") {
          object_init[this.props.student.profile[i].name] = "missing";
        }
        object_message[this.props.student.profile[i].name] = this.props.student
          .profile[i].feedback
          ? this.props.student.profile[i].feedback
          : "";
        object_date_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleDateString();
        object_time_init[this.props.student.profile[i].name] = new Date(
          this.props.student.profile[i].updatedAt
        ).toLocaleTimeString();
      }
    } else {
    }
    let documentlist22;
    documentlist22 = keys2.map((k, i) => {
      if (object_init[k] === "uploaded") {
        return (
          <tr key={i + 1}>
            <td>
              <AiOutlineFieldTime
                size={24}
                color="orange"
                title="Uploaded successfully"
              />
            </td>
            <td>
              {value2[i]}
              {" - "}
              {object_date_init[k]}
              {" - "}
              {object_time_init[k]}
            </td>
            <td>
              <Col md>
                <Form
                  onSubmit={(e) =>
                    this.props.onDownloadFilefromstudent(
                      e,
                      k,
                      this.props.student._id
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
            {this.props.role === "Editor" || this.props.role === "Student" ? (
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
                        this.props.onUpdateProfileDocStatus(
                          e,
                          k,
                          this.props.student._id,
                          "rejected"
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button
                          size="sm"
                          type="submit"
                          disabled={!this.props.isLoaded}
                        >
                          Reject
                        </Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
                <td></td>
                <td>
                  <Col md>
                    <Form
                      onSubmit={(e) =>
                        this.props.onUpdateProfileDocStatus(
                          e,
                          k,
                          this.props.student._id,
                          "accepted"
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button
                          size="sm"
                          type="submit"
                          disabled={!this.props.isLoaded}
                        >
                          Accept
                        </Button>
                      </Form.Group>
                    </Form>
                  </Col>
                </td>
              </>
            )}
            {this.props.role === "Editor" ? (
              <td></td>
            ) : (
              <td>
                <Col md>
                  <Form
                    onSubmit={(e) =>
                      this.onDeleteFileWarningPopUp(
                        e,
                        k,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button
                        variant={deleteStyle}
                        size="sm"
                        type="submit"
                        title="Delete"
                        disabled={!this.props.isLoaded}
                      >
                        <AiOutlineDelete size={16} />
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            )}
          </tr>
        );
      } else if (object_init[k] === "accepted") {
        return (
          <tr key={i + 1}>
            <th>
              <IoCheckmarkCircle
                size={24}
                color="limegreen"
                title="Valid Document"
              />
            </th>
            <td>
              {value2[i]}
              {" - "}
              {object_date_init[k]}
              {" - "}
              {object_time_init[k]}
            </td>
            <td>
              <Col md>
                <Form
                  onSubmit={(e) =>
                    this.props.onDownloadFilefromstudent(
                      e,
                      k,
                      this.props.student._id
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
                <td></td>
                <td></td>
                <td></td>
              </>
            ) : (
              <>
                {this.props.role === "Student" ? (
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
                            this.props.onUpdateProfileDocStatus(
                              e,
                              k,
                              this.props.student._id,
                              "rejected"
                            )
                          }
                        >
                          <Form.Group controlId="exampleForm.ControlSelect1">
                            <Button
                              size="sm"
                              type="submit"
                              disabled={!this.props.isLoaded}
                            >
                              Reject
                            </Button>
                          </Form.Group>
                        </Form>
                      </Col>
                    </td>
                    <td></td>
                    <td>
                      <Col md>
                        <Form
                          onSubmit={(e) =>
                            this.props.onUpdateProfileDocStatus(
                              e,
                              k,
                              this.props.student._id,
                              "accepted"
                            )
                          }
                        >
                          <Form.Group controlId="exampleForm.ControlSelect1">
                            <Button
                              size="sm"
                              type="submit"
                              disabled={!this.props.isLoaded}
                            >
                              Accept
                            </Button>
                          </Form.Group>
                        </Form>
                      </Col>
                    </td>{" "}
                    <td>
                      <Col>
                        <Form
                          onSubmit={(e) =>
                            this.onDeleteFileWarningPopUp(
                              e,
                              k,
                              this.props.student._id
                            )
                          }
                        >
                          <Form.Group controlId="exampleForm.ControlSelect1">
                            <Button
                              variant={deleteStyle}
                              size="sm"
                              type="submit"
                              title="Delete"
                              disabled={!this.props.isLoaded}
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
      } else if (object_init[k] === "rejected") {
        return (
          <tr key={i + 1}>
            <td>
              <AiFillCloseCircle
                size={24}
                color="red"
                title="Invalid Document"
              />
            </td>
            <td>
              {value2[i]}
              {" - "}
              {object_date_init[k]}
              {" - "}
              {object_time_init[k]}
            </td>
            <td>
              <Col>
                <Form
                  onSubmit={(e) =>
                    this.props.onDownloadFilefromstudent(
                      e,
                      k,
                      this.props.student._id
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
                    disabled={!this.props.isLoaded}
                    title="Show Comments"
                    onClick={(e) => this.openCommentWindow(object_message[k])}
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
                        disabled={!this.props.isLoaded}
                        title="Show Comments"
                        onClick={(e) =>
                          this.openCommentWindow(object_message[k])
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
                      <Col>
                        <Form
                          onSubmit={(e) =>
                            this.props.onUpdateProfileDocStatus(
                              e,
                              k,
                              this.props.student._id,
                              "rejected"
                            )
                          }
                        >
                          <Form.Group controlId="exampleForm.ControlSelect1">
                            <Button
                              size="sm"
                              type="submit"
                              disabled={!this.props.isLoaded}
                            >
                              Reject
                            </Button>
                          </Form.Group>
                        </Form>
                      </Col>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        type="submit"
                        disabled={!this.props.isLoaded}
                        title="Show Comments"
                        onClick={(e) =>
                          this.openCommentWindow(object_message[k])
                        }
                      >
                        <AiOutlineComment size={20} />
                      </Button>
                    </td>
                    <td>
                      <Col>
                        <Form
                          onSubmit={(e) =>
                            this.props.onUpdateProfileDocStatus(
                              e,
                              k,
                              this.props.student._id,
                              "accepted"
                            )
                          }
                        >
                          <Form.Group controlId="exampleForm.ControlSelect1">
                            <Button
                              size="sm"
                              type="submit"
                              disabled={!this.props.isLoaded}
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
                          k,
                          this.props.student._id
                        )
                      }
                    >
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Button
                          variant={deleteStyle}
                          size="sm"
                          type="submit"
                          title="Delete"
                          disabled={!this.props.isLoaded}
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
      } else if (object_init[k] === "notneeded") {
        return (
          <tr key={i + 1}>
            <th>
              <BsDash size={24} color="lightgray" title="Not needed" />
            </th>
            <td>
              {value2[i]}
              {" - "}
              {object_date_init[k]}
              {" - "}
              {object_time_init[k]}
            </td>
            {this.props.role === "Editor" ? (
              <></>
            ) : (
              <>
                {this.props.role === "Student" ? (
                  <></>
                ) : (
                  <td>
                    <Col>
                      <Form
                        onSubmit={(e) =>
                          this.props.onUpdateProfileDocStatus(
                            e,
                            k,
                            this.props.student._id,
                            "missing"
                          )
                        }
                      >
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Button size="sm" type="submit">
                            Set Needed
                          </Button>
                        </Form.Group>
                      </Form>
                    </Col>
                  </td>
                )}
                <Form>
                  <Form.File.Label
                    onChange={(e) =>
                      this.props.handleGeneralDocSubmit(
                        e,
                        k,
                        this.props.student._id
                      )
                    }
                    onClick={(e) => (e.target.value = null)}
                  >
                    <Form.File.Input hidden />
                    <IoMdCloudUpload size={32} />
                  </Form.File.Label>
                </Form>
              </>
            )}
            <td></td>
          </tr>
        );
      } else {
        return (
          <tr key={i + 1}>
            <th>
              <AiFillQuestionCircle
                size={24}
                color="lightgray"
                title="No Document uploaded"
              />
            </th>
            <td>
              <p className="m-0">
                <b> {value2[i]} </b>
              </p>
            </td>
            {this.props.role === "Editor" ? (
              <></>
            ) : (
              <>
                <td>
                  <Form>
                    <Form.File.Label
                      onChange={(e) =>
                        this.props.handleGeneralDocSubmit(
                          e,
                          k,
                          this.props.student._id
                        )
                      }
                      onClick={(e) => (e.target.value = null)}
                    >
                      <Form.File.Input hidden />
                      <IoMdCloudUpload size={32} />
                    </Form.File.Label>
                  </Form>
                </td>
                {this.props.role === "Student" ? (
                  <></>
                ) : (
                  <td>
                    <Col md>
                      <Form
                        onSubmit={(e) =>
                          this.props.onUpdateProfileDocStatus(
                            e,
                            k,
                            this.props.student._id,
                            "notneeded"
                          )
                        }
                      >
                        <Form.Group controlId="exampleForm.ControlSelect1">
                          <Button variant={"secondary"} size="sm" type="submit">
                            Set notneeded
                          </Button>
                        </Form.Group>
                      </Form>
                    </Col>
                  </td>
                )}
              </>
            )}
            <td></td>
          </tr>
        );
      }
    });
    const style = {
      position: "fixed",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
    return (
      <>
        <Card className="mt-2" key={this.props.idx}>
          <Card.Header
            onClick={() => this.props.singleExpandtHandler(this.props.idx)}
          >
            <Card.Title
              as="h5"
              aria-controls={"accordion" + this.props.idx}
              aria-expanded={
                this.props.accordionKeys[this.props.idx] === this.props.idx
              }
            >
              {this.state.student.firstname}
              {" ,"}
              {this.state.student.lastname}
            </Card.Title>
          </Card.Header>
          <Collapse
            in={this.props.accordionKeys[this.props.idx] === this.props.idx}
          >
            <div id="accordion1">
              <Card.Body>
                <Row>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>File Name:</th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>{documentlist22}</tbody>
                  </Table>
                </Row>
                <Row>{this.props.SYMBOL_EXPLANATION}</Row>
              </Card.Body>
            </div>
          </Collapse>
        </Card>
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
            Do you want to delete {this.state.docName}?
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
          <Modal.Body>
            {this.state.comments}
            {!this.state.isLoaded && (
              <div style={style}>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden"></span>
                </Spinner>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeCommentWindow}>Ok</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default EditFilesSubpage;
