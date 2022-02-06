import React from "react";
import { Button, Table, Form, Modal } from "react-bootstrap";

class EditProgramsSubpage extends React.Component {
  // edit Program subpage
  render() {
    // Edit Program
    let programstatus;
    if (this.props.student.applications) {
      programstatus = this.props.student.applications.map((application, i) => (
        <tr key={i}>
          <th></th>
          <td>
            <h5 className="mb-1">
              {application.programId.school} -{" "}
              {application.programId.program}
            </h5>
            <h5 className="mb-1">{application.programId.documents}</h5>
          </td>
          <td>
            <Form
              onSubmit={(e) =>
                this.props.onSetAsGetAdmissionProgram(
                  e,
                  this.props.student._id,
                  application.programId._id
                )
              }
            >
              <Form.Group controlId="exampleForm.ControlSelect1">
                <div className="form-group">
                  <Button type="submit" variant="success">
                    Admission
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </td>
          <td>
            <Form
              onSubmit={(e) =>
                this.props.onSetAsCloseProgram(
                  e,
                  this.props.student._id,
                  application.programId._id
                )
              }
            >
              <Form.Group controlId="exampleForm.ControlSelect1">
                <div className="form-group">
                  <Button type="submit" variant="secondary">
                    Close
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </td>
          <td>
            <Form
              onSubmit={(e) =>
                this.props.onSetAsDecidedProgram(
                  e,
                  this.props.student._id,
                  application.programId._id
                )
              }
            >
              <Form.Group controlId="exampleForm.ControlSelect1">
                <div className="form-group">
                  <Button type="submit" variant="info">
                    Decide
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </td>
          <td>
            <Form
              onSubmit={(e) =>
                this.props.onDeleteProgram(
                  e,
                  this.props.student._id,
                  application.programId._id
                )
              }
            >
              <Form.Group controlId="exampleForm.ControlSelect1">
                <div className="form-group">
                  <Button type="submit" variant="danger">
                    Delete
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </td>
        </tr>
      ));
    } else {
      programstatus = (
        <tr>
          <td>
            <h4 className="mb-1"> No Program</h4>
          </td>
        </tr>
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
            Program for {this.props.student.firstname} -{" "}
            {this.props.student.lastname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Program:</h4>
          <Table>
            <tbody>{programstatus}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.setmodalhide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditProgramsSubpage;
