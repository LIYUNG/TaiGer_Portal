import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class ProgramReportUpdateModal extends React.Component {
  state = {
    ticket: {}
  };
  handleChange = (e) => {
    var temp_ticket = { ...this.state.ticket };
    temp_ticket[e.target.id] = e.target.value;
    this.setState({
      ticket: temp_ticket
    });
  };

  render() {
    return (
      <Modal
        show={this.props.isUpdateReport}
        onHide={this.props.setReportUpdateModalHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            What information is inaccurate for {this.props.uni_name} -{' '}
            {this.props.program_name}?
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              this.props.submitProgramUpdateReport(
                this.props.ticket._id.toString(),
                this.state.ticket
              )
            }
          >
            Submit ticket
          </Button>
          <Button
            variant="secondary"
            onClick={this.props.setReportUpdateModalHide}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramReportUpdateModal;
