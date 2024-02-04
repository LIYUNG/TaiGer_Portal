import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Button, Typography } from '@mui/material';
import ModalNew from '../../components/Modal';
import { useTranslation } from 'react-i18next';

function GrantManagerModal(props) {
  const { t } = useTranslation();
  const [grantManagerModalState, setGrantManagerModalState] = useState({
    payload: {},
    changed: false
  });

  const onChange = (e) => {
    const { id, value } = e.target;
    setGrantManagerModalState((prevState) => ({
      payload: {
        ...prevState.payload,
        [id]: value
      },
      changed: true
    }));
  };

  const onSubmitHandler = (e) => {
    props.onUpdatePermissions(e, grantManagerModalState.payload);
  };

  return (
    <ModalNew
      open={props.managerModalShow}
      onClose={props.setManagerModalHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography>
        Set {props.firstname} - {props.lastname} as Manager:
      </Typography>
      <Typography>
        <Form>
          <Form.Group controlId="manager_type">
            <Form.Label>Configure Manager Type</Form.Label>
            <Form.Control as="select" controlId onChange={onChange}>
              <option>Please Select</option>
              <option value="Agent">Agent Manager</option>
              <option value="Editor">Editor Manager</option>
              <option value="AgentAndEditor">
                Both Agent and Editor Manager
              </option>
            </Form.Control>
          </Form.Group>
        </Form>
        <br />
        configure agents
        <br />
        configure editors
      </Typography>
      <Typography>
        <Button
          color="primary"
          variant="contained"
          disabled={!grantManagerModalState.changed}
          onClick={(e) => onSubmitHandler(e)}
        >
          {t('Confirm')}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={props.setManagerModalHide}
        >
          {t('Cancel')}
        </Button>
      </Typography>
    </ModalNew>
  );
}
export default GrantManagerModal;
