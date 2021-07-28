import React from "react";
import { Modal } from "react-bootstrap";
import {
  Button,
} from "react-bootstrap";

class ProgramDeleteWarning extends React.Component {

  render() {
    return (
      <Modal
        show={this.props.deleteProgramWarning}
        onHide={this.props.setModalHideDDelete}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Do you want to delete {this.props.uni_name} - {this.props.program_name}?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => this.props.RemoveProgramHandler3(this.props.program_id)}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={this.props.setModalHideDDelete}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramDeleteWarning;
