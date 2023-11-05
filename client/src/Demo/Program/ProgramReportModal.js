import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class ProgramReportModal extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.isReport}
        onHide={this.props.setReportModalHideDelete}
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
          <Form.Group controlId="program_info_report">
            <Form.Control
              as="textarea"
              rows="5"
              placeholder="Deadline is wrong."
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            // onClick={() =>
            //   this.props.RemoveProgramHandler(this.props.program_id)
            // }
          >
            Submit ticket
          </Button>
          <Button
            variant="secondary"
            onClick={this.props.setReportModalHideDelete}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramReportModal;
