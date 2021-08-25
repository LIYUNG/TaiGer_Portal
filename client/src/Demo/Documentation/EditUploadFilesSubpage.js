import React from "react";
// import { FaBeer } from 'react-icons/fa';
import { Button, Table, Col, Form, Modal } from "react-bootstrap";

class EditUploadFilesSubpage extends React.Component {
  // edit File subpage

  render() {
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
                <Form.Group>
                  <Form.Check
                    custom
                    type="checkbox"
                    name={doc.name}
                    defaultChecked={true}
                    id={i + 1}
                  />
                </Form.Group>
              </th>
              <td>
                <p className="m-0">
                  {" "}
                  {doc.name} :{" "}
                  {this.props.student.uploadedDocs_[doc.prop].uploadStatus_}
                </p>
                <p>
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
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
                <Col>
                  <Form onSubmit={(e) => this.props.submitFile(e, doc.prop)}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Upload
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
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
                      <Button size="sm" type="submit">
                        Download
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
                      <Button size="sm" type="submit">
                        Delete
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              {/* <td>
                <p className="m-0">
                  {" "}
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
                </p>
              </td> */}
            </tr>
          );
        } else if (
          this.props.student.uploadedDocs_[doc.prop] &&
          this.props.student.uploadedDocs_[doc.prop].uploadStatus_ === "checked"
        ) {
          return (
            <tr key={i + 1}>
              <th>
                <Form.Group>
                  <Form.Check
                    custom
                    type="checkbox"
                    name={doc.name}
                    defaultChecked={true}
                    id={i + 1}
                  />
                </Form.Group>
              </th>
              <td>
                <p className="m-0">
                  {" "}
                  {doc.name} :{" "}
                  {this.props.student.uploadedDocs_[doc.prop].uploadStatus_}
                </p>
                <p>
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
                </p>
              </td>
              {/* <td>
                <Col>
                  <Form
                    onChange={(e) => this.props.onFileChange(e)}
                    onClick={(e) => (e.target.value = null)}
                  >
                    <Form.File id={this.props.id}>
                      <Form.File.Input />
                    </Form.File>
                  </Form>
                </Col>
              </td>
              <td>
                <Col>
                  <Form onSubmit={(e) => this.props.submitFile(e, doc.prop)}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Upload
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td> */}
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
                      <Button size="sm" type="submit">
                        Download
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              {/* <td>
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
                      <Button size="sm" type="submit">
                        Delete
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td> */}
              {/* <td>
                <Col>
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
                </Col>
              </td> */}
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
                <Form.Group>
                  <Form.Check
                    custom
                    type="checkbox"
                    name={doc.name}
                    defaultChecked={true}
                    id={i + 1}
                  />
                </Form.Group>
              </th>
              <td>
                <p className="m-0">
                  {" "}
                  {doc.name} :{" "}
                  {this.props.student.uploadedDocs_[doc.prop].uploadStatus_}
                </p>
                <p>
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
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
                <Col>
                  <Form onSubmit={(e) => this.props.submitFile(e, doc.prop)}>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Button size="sm" type="submit">
                        Upload
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
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
                      <Button size="sm" type="submit">
                        Download
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
                      <Button size="sm" type="submit">
                        Delete
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </td>
              {/* <td>
                <p className="m-0">
                  {" "}
                  {this.props.student.uploadedDocs_[doc.prop].LastUploadDate_}
                </p>
              </td> */}
            </tr>
          );
        } else {
          return (
            <tr key={i + 1}>
              <th>
                {/* <div> */}
                <Form.Group>
                  <Form.Check
                    custom
                    type="checkbox"
                    name={doc.name}
                    defaultChecked={false}
                    // value='value'
                    id={i + 1}
                  />
                </Form.Group>
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
                  <Form onSubmit={(e) => this.props.submitFile(e, doc.prop)}>
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
      <Table>
        <tbody>{documentlist}</tbody>
      </Table>
    );
  }
}

export default EditUploadFilesSubpage;
