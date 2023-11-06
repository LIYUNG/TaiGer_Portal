import React from 'react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';

class ProgramReportModal extends React.Component {
  state = {
    description: ''
  };
  handleChange = (e) => {
    this.setState({
      description: e.target.value
    });
  };

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
          <Form>
            <Form.Group>
              <Form.Label>
                What information is inaccurate for {this.props.uni_name} -{' '}
                {this.props.program_name}?
              </Form.Label>
              <Form.Control
                controlId="program_info_report"
                as="textarea"
                maxLength={2000}
                rows="10"
                placeholder="Deadline is wrong.
                IELTS 7"
                value={this.state.description || ''}
                isInvalid={this.state.description?.length > 2000}
                onChange={(e) => this.handleChange(e)}
              ></Form.Control>
              <Badge
                className="mt-3"
                bg={`${
                  this.state.description?.length > 2000 ? 'danger' : 'primary'
                }`}
              >
                {this.state.description?.length || 0}/{2000}
              </Badge>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              this.props.submitProgramReport(
                this.props.program_id,
                this.state.description
              )
            }
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
