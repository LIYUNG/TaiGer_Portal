import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

class UserDeleteWarning extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.deleteUserWarning}
        onHide={this.props.setModalHideDDelete}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Do you want to delete {this.props.firstname} - {this.props.lastname}
            ?
          </h5>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              this.props.RemoveUserHandler3(this.props.selected_user_id)
            }
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
export default UserDeleteWarning;
