import React from "react";
// import { FaBeer } from 'react-icons/fa';
import { Button, Table, Col, Form, Modal } from "react-bootstrap";
import UcFirst from "../../../../App/components/UcFirst";
import {
  AiOutlineDownload,
  AiFillCloseCircle,
  AiFillQuestionCircle,
} from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
class EditFilesSubpage extends React.Component {
  // edit File subpage

  render() {
    const deleteStyle = "danger";
    let value2 = Object.values(this.props.documentlist2);
    let keys2 = Object.keys(this.props.documentlist2);
    let object_init = {};
    let object_date_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = "missing";
      object_date_init[keys2[i]] = "";
    }

    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === "uploaded") {
          object_init[this.props.student.profile[i].name] = "uploaded";
          object_date_init[this.props.student.profile[i].name] =
            this.props.student.profile[i].updatedAt.toString();
        } else if (this.props.student.profile[i].status === "accepted") {
          object_init[this.props.student.profile[i].name] = "accepted";
          object_date_init[this.props.student.profile[i].name] =
            this.props.student.profile[i].updatedAt.toString();
        } else if (this.props.student.profile[i].status === "rejected") {
          object_init[this.props.student.profile[i].name] = "rejected";
          object_date_init[this.props.student.profile[i].name] =
            this.props.student.profile[i].updatedAt.toString();
        } else if (this.props.student.profile[i].status === "missing") {
          object_init[this.props.student.profile[i].name] = "missing";
          object_date_init[this.props.student.profile[i].name] =
            this.props.student.profile[i].updatedAt.toString();
        }
      }
    } else {
      console.log("no files");
    }
    let documentlist22;
    documentlist22 = keys2.map((k, i) => {
      if (object_init[k] === "uploaded") {
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
              {value2[i]}
              {object_date_init[k].updatedAt}
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
                      {/* Download */}
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </td>
            {this.props.role === "Editor" ? (
              <></>
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
                        this.props.onUpdateProfileDocStatus(
                          e,
                          k,
                          this.props.student._id,
                          "accepted"
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
                          k,
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
              </>
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
              {object_date_init[k].updatedAt}
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
                      {/* Download */}
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </td>
            {this.props.role === "Editor" ? (
              <></>
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
                        this.props.onUpdateProfileDocStatus(
                          e,
                          k,
                          this.props.student._id,
                          "accepted"
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
                          k,
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
              </>
            )}
          </tr>
        );
      } else if (object_init[k] === "rejected") {
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
              {value2[i]}
              {object_date_init[k].updatedAt}
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
                      {/* Download */}
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </td>
            {this.props.role === "Editor" ? (
              <></>
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
                        this.props.onUpdateProfileDocStatus(
                          e,
                          k,
                          this.props.student._id,
                          "accepted"
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
                          k,
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
              </>
            )}
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
                        this.props.onSubmitFile(e, k, this.props.student._id)
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
              </>
            )}
          </tr>
        );
      }
    });

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
            <tbody>{documentlist22}</tbody>
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
