import React from 'react';
import { Modal, Form, Spinner } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function UserDeleteWarning(props) {
  const { t, i18n } = useTranslation();
  return (
    <Modal
      show={props.deleteUserWarning}
      onHide={props.setModalHideDDelete}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>
          {t('Do you want to delete')}{' '}
          <b>
            {props.firstname} - {props.lastname}
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
            onChange={(e) => props.onChangeDeleteField(e)}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          disabled={!props.isLoaded || !(props.delete_field === 'delete')}
          onClick={() => props.handleDeleteUser(props.selected_user_id)}
        >
          {props.isLoaded ? 'Yes' : <Spinner size="sm"></Spinner>}
        </Button>
        <Button onClick={props.setModalHideDDelete} variant="light">
          {t('No')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default UserDeleteWarning;
