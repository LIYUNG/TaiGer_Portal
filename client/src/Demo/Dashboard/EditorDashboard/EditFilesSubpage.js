import React from "react";
import { Button, Table, Col, Form, Modal } from "react-bootstrap";
import UcFirst from "../../../App/components/UcFirst";
import {
  AiOutlineDownload,
  AiFillCloseCircle,
  AiFillQuestionCircle,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
class EditFilesSubpage extends React.Component {
  render() {
    const deleteStyle = "danger";
    let documentlist;
    if (this.props.student.uploadedDocs_) {
      documentlist = this.props.documentslist.map((doc, i) => {
        if (
          this.props.student.uploadedDocs_[doc.prop] &&
          this.props.student.uploadedDocs_[doc.prop].uploadStatus_ ===
            "uploaded"
        ) {
          return (
            <tr key={i + 1}>
              <th>
                <AiFillQuestionCircle
                  size={24}
                  color="lightgreen"
                  title="Uploaded successfully"
                />
              </th>
              <td>
                <p className="m-0"> {doc.name}</p>
                <p>
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
                </p>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onDownloadFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit" title="Download">
                        <AiOutlineDownload size={16} />
                        {/* Download */}
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onRejectFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Reject
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onAcceptFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Accept
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onDeleteFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button variant={deleteStyle} size="sm" type="submit">
                        <UcFirst text="Delete" />
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            </tr>
          );
        } else if (
          this.props.student.uploadedDocs_[doc.prop] &&
          this.props.student.uploadedDocs_[doc.prop].uploadStatus_ === "checked"
        ) {
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
                <p className="m-0"> {doc.name}</p>
                <p>
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
                </p>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onDownloadFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit" title="Download">
                        <AiOutlineDownload size={16} />
                        {/* Download */}
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onRejectFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Reject
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onAcceptFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Accept
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onDeleteFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button variant={deleteStyle} size="sm" type="submit">
                        <UcFirst text="Delete" />
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            </tr>
          );
        } else if (
          this.props.student.uploadedDocs_[doc.prop] &&
          this.props.student.uploadedDocs_[doc.prop].uploadStatus_ ===
            "unaccepted"
        ) {
          return (
            <tr key={i + 1}>
              <th>
                <AiFillCloseCircle
                  size={24}
                  color="red"
                  title="Invalid Document"
                />
              </th>
              <td>
                <p className="m-0"> {doc.name}</p>
                <p>
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
                </p>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onDownloadFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit" title="Download">
                        <AiOutlineDownload size={16} />
                        {/* Download */}
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onRejectFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Reject
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onAcceptFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Accept
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form
                    onSubmit={(e) =>
                      this.props.onDeleteFilefromstudent(
                        e,
                        doc.prop,
                        this.props.student._id
                      )
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button variant={deleteStyle} size="sm" type="submit">
                        <UcFirst text="Delete" />
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
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
                  <b> {doc.name} </b>
                </p>
              </td>
              <td>
                <Col>
                  <Form
                    onChange={(e) => this.props.onFileChange(e)}
                    onClick={(e) => (e.target.value = null)}
                  >
                    <Form.File id={this.props.id}>
                      {/* <Form.File.Label>Regular file input</Form.File.Label> */}
                      <Form.File.Input />
                    </Form.File>
                  </Form>
                </Col>
              </td>
              <td>
                <Col md={2}>
                  <Form
                    onSubmit={(e) =>
                      this.props.submitFile(e, doc.prop, this.props.student._id)
                    }
                  >
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Upload
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
            </tr>
          );
        }
      });
    } else {
      documentlist = (
        <Col md={2}>
          <p>So far no selected program!</p>
        </Col>
      );
    }

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Uploaded files for {this.props.student.firstname} -{" "}
            {this.props.student.lastname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Files:</h4>
          <Table>
            <tbody>{documentlist}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.setmodalhide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditFilesSubpage;
