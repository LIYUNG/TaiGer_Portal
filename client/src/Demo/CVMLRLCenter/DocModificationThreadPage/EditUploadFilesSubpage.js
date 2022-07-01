import React from "react";
import { Button, Table, Col, Form } from "react-bootstrap";
// import UcFirst from "../../../../App/components/UcFirst";
import {
  AiFillCloseCircle,
  AiFillQuestionCircle,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { BsDash } from "react-icons/bs";
import { IoCheckmarkCircle } from "react-icons/io5";

class EditUploadFilesSubpage extends React.Component {
  // edit File subpage

  render() {
    let value2 = Object.values(this.props.documentlist2);
    let keys2 = Object.keys(this.props.documentlist2);
    let object_init = {};
    for (let i = 0; i < keys2.length; i++) {
      object_init[keys2[i]] = "missing";
    }
    if (this.props.student.profile) {
      for (let i = 0; i < this.props.student.profile.length; i++) {
        if (this.props.student.profile[i].status === "uploaded") {
          object_init[this.props.student.profile[i].name] = "uploaded";
        } else if (this.props.student.profile[i].status === "accepted") {
          object_init[this.props.student.profile[i].name] = "accepted";
        } else if (this.props.student.profile[i].status === "rejected") {
          object_init[this.props.student.profile[i].name] = "rejected";
        } else if (this.props.student.profile[i].status === "missing") {
          object_init[this.props.student.profile[i].name] = "missing";
        }
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
              <p className="m-0"> {value2[i]}</p>
            </td>
            <td></td>
            <td></td>
            <td>
              <Col>
                <Form
                  onSubmit={(e) =>
                    this.props.onDownloadFilefromstudent(
                      e,
                      k,
                      this.props.userId
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
                    this.props.onDeleteFilefromstudent(e, k, this.props.userId)
                  }
                >
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Button variant="danger" size="sm" type="submit">
                      Delete
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </td>
          </tr>
        );
      } else if (object_init[k] === "accepted") {
        return (
          <tr key={i + 1}>
            <td>
              <IoCheckmarkCircle
                size={24}
                color="limegreen"
                title="Valid Document"
              />
            </td>
            <td>
              <p className="m-0"> {value2[i]}</p>
            </td>
            <td>
              <Col></Col>
            </td>
            <td>
              <Col></Col>
            </td>
            <td>
              <Col>
                <Form
                  onSubmit={(e) =>
                    this.props.onDownloadFilefromstudent(
                      e,
                      k,
                      this.props.userId
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
            <td></td>
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
              <p className="m-0"> {value2[i]}</p>
            </td>
            <td>
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
                <Form
                  onSubmit={(e) =>
                    this.props.submitFile(e, this.props.userId, k)
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
            <td>
              <Col>
                <Form
                  onSubmit={(e) =>
                    this.props.onDownloadFilefromstudent(
                      e,
                      k,
                      this.props.userId
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
                    this.props.onDeleteFilefromstudent(e, k, this.props.userId)
                  }
                >
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Button variant="danger" size="sm" type="submit">
                      Delete
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </td>
          </tr>
        );
      } else if (object_init[k] === "notneeded") {
        return (
          <tr key={i + 1}>
            <th>
              <BsDash size={24} color="lightgray" title="Not needed" />
            </th>
            <td>
              <p className="m-0">
                <b> {value2[i]} </b>
              </p>
            </td>
            <td>
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
              <Col md={2}>
                <Form
                  onSubmit={(e) =>
                    this.props.submitFile(e, this.props.userId, k)
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
            <td></td>
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
            <td>
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
              <Col md={2}>
                <Form
                  onSubmit={(e) =>
                    this.props.submitFile(e, this.props.userId, k)
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
            <td></td>
            <td></td>
          </tr>
        );
      }
    });

    return (
      <Table>
        <tbody>{documentlist22}</tbody>
      </Table>
    );
  }
}

export default EditUploadFilesSubpage;
