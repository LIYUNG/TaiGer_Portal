import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

class ProgramAddedMyWatchList extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.modalShowNAddMyWatchList}
        onHide={this.props.setModalHideDDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            {this.props.uni_name} - {this.props.program_name} is added to my
            watch list.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => this.props.setModalHide_AddToMyWatchList()}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default ProgramAddedMyWatchList;
