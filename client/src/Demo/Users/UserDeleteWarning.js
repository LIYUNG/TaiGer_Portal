import React from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class UserDeleteWarning extends React.Component {

  render() {
    return (
      <Modal
        show={this.props.deleteUserWarning}
        onHide={this.props.setModalHideDDelete}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Do you want to delete{' '}
            <b>
              {this.props.firstname} - {this.props.lastname}
            </b>
            ?
          </h5>

          <Form.Group
            // controlId="target_application_field"
            className="my-0 mx-0"
          >
            <Form.Label className="my-1 mx-0">
              Please enter{' '}
              <i>
                <b>delete</b>
              </i>{' '}
              in order to delete the user.
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="delete"
              onChange={(e) => this.props.onChangeDeleteField(e)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            disabled={
              !this.props.isLoaded || !(this.props.delete_field === 'delete')
            }
            onClick={() =>
              this.props.RemoveUserHandler3(this.props.selected_user_id)
            }
          >
            {this.props.isLoaded ? 'Yes' : 'Loading'}
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
