import React from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function UserArchivWarning(props) {
  return (
    <Modal
      show={props.archivUserWarning}
      onHide={props.setModalArchivHide}
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
            {props.firstname} - {props.lastname}
          </b>
          ?
        </h5>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() =>
            props.updateUserArchivStatus(
              props.selected_user_id,
              props.archiv === true ? false : true
            )
          }
        >
          {props.isLoaded ? 'Yes' : 'Loading'}
        </Button>
        <Button onClick={props.setModalArchivHide} variant="light">
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default UserArchivWarning;
