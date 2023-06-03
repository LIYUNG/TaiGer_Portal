import React from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class UserArchivWarning extends React.Component {
  render() {
    return (
      <Modal
        show={this.props.archivUserWarning}
        onHide={this.props.setModalArchivHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Do you want to archiv{' '}
            <b>
              {this.props.firstname} - {this.props.lastname}
            </b>
            ?
          </h5>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              this.props.updateUserArchivStatus(
                this.props.selected_user_id,
                this.props.archiv === true ? false : true
              )
            }
          >
            {this.props.isLoaded ? 'Yes' : 'Loading'}
          </Button>
          <Button onClick={this.props.setModalArchivHide} variant="light">
            No
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default UserArchivWarning;
