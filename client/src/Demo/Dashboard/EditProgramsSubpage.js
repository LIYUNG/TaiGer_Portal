import React from "react";
// import { FaBeer } from 'react-icons/fa';
import { Button, Table, Col, Form, Modal } from "react-bootstrap";

class EditProgramsSubpage extends React.Component {
  // edit Program subpage
  render() {
    // Edit Program
    let programstatus;
    if (this.props.student.applying_program_) {
      programstatus = this.props.student.applying_program_.map((program, i) => (
        <tr key={i}>
          <th>
            <Form.Group>
              <Form.Check
                custom
                type="checkbox"
                name="student_id"
                value={i}
                id={i + 1}
              />
            </Form.Group>
          </th>
          <td>
            <h4 className="mb-1">
              {program.University_}, {program.Program_}
            </h4>
          </td>
          <td>
            <Col md={2}>
              <Form
                onSubmit={(e) =>
                  this.props.onDeleteProgram(
                    e,
                    this.props.student._id,
                    program._id
                  )
                }
              >
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <div className="form-group">
                    <Button type="submit">Delete</Button>
                  </div>
                </Form.Group>
              </Form>
            </Col>
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
            Program for {this.props.student.firstname_} -{" "}
            {this.props.student.lastname_}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Program:</h4>
          <Table>
            <tbody>{programstatus}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.setmodalhide}>Assign</Button>
          <Button onClick={this.props.setmodalhide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditProgramsSubpage;
