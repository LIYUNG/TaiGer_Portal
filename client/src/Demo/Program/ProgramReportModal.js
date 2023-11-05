import React from 'react';
import { Modal, Button } from 'react-bootstrap';

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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            // onClick={() =>
            //   this.props.RemoveProgramHandler(this.props.program_id)
            // }
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={this.props.setReportModalHideDelete}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramReportModal;
