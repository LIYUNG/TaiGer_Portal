import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class ProgramReportDeleteModal extends React.Component {
  state = {
    ticket: {},
    delete: ''
  };
  handleChange = (e) => {
    var temp_ticket = { ...this.state.ticket };
    temp_ticket[e.target.id] = e.target.value;
    this.setState({
      ticket: temp_ticket
    });
  };

  handleDeleteChange = (e) => {
    this.setState({
      delete: e.target.value
    });
  };

  render() {
    return (
      <Modal
        show={this.props.isReportDelete}
        onHide={this.props.setReportDeleteModalHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Do you want to delelete {this.props.uni_name} -{' '}
            {this.props.program_name} ticket?
          </h5>
          <Form.Group controlId="description">
            <Form.Control
              as="textarea"
              rows="5"
              placeholder="Deadline is wrong."
              onChange={(e) => this.handleChange(e)}
              defaultValue={this.props.ticket.description}
            />
          </Form.Group>
          <h5>Feedback</h5>
          <Form.Group controlId="feedback">
            <Form.Control
              as="textarea"
              rows="5"
              placeholder="Deadline is for Non-EU (05-15)"
              onChange={(e) => this.handleChange(e)}
              defaultValue={this.props.ticket.feedback}
            />
          </Form.Group>
          <br />
          <Form.Group controlId="delete">
            <Form.Label>
              Please enter <i>delete</i> in order to delete the ticket.
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="delete"
              onChange={(e) => this.handleDeleteChange(e)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={this.state.delete !== 'delete'}
            onClick={() =>
              this.props.submitProgramDeleteReport(
                this.props.ticket._id.toString()
              )
            }
          >
            Delete ticket
          </Button>
          <Button
            variant="secondary"
            onClick={this.props.setReportDeleteModalHide}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramReportDeleteModal;
