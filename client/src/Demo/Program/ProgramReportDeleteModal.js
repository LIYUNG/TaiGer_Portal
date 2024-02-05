import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Button, Typography } from '@mui/material';
import ModalNew from '../../components/Modal';

function ProgramReportDeleteModal(props) {
  const [programReportDeleteModal, setProgramReportDeleteModalState] = useState(
    {
      ticket: {},
      delete: ''
    }
  );
  const handleChange = (e) => {
    var temp_ticket = { ...programReportDeleteModal.ticket };
    temp_ticket[e.target.id] = e.target.value;
    setProgramReportDeleteModalState((prevState) => ({
      ...prevState,
      ticket: temp_ticket
    }));
  };

  const handleDeleteChange = (e) => {
    setProgramReportDeleteModalState((prevState) => ({
      ...prevState,
      delete: e.target.value
    }));
  };

  return (
    <ModalNew
      open={props.isReportDelete}
      onClose={props.setReportDeleteModalHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography>Delete ticket</Typography>
      <Typography variant="h6">
        Do you want to delelete {props.uni_name} - {props.program_name} ticket?
      </Typography>
      <Typography>
        <Form.Group controlId="description">
          <Form.Control
            as="textarea"
            rows="5"
            placeholder="Deadline is wrong."
            onChange={(e) => handleChange(e)}
            defaultValue={props.ticket.description}
          />
        </Form.Group>
        <h5>Feedback</h5>
        <Form.Group controlId="feedback">
          <Form.Control
            as="textarea"
            rows="5"
            placeholder="Deadline is for Non-EU (05-15)"
            onChange={(e) => handleChange(e)}
            defaultValue={props.ticket.feedback}
          />
        </Form.Group>
        <br />
        <Form.Group controlId="delete">
          <Form.Label>
            Please enter <i>delete</i> in order to delete the ticket.
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="delete"
            onChange={(e) => handleDeleteChange(e)}
          />
        </Form.Group>
      </Typography>
      <Typography>
        <Button
          color="primary"
          variant="contained"
          disabled={programReportDeleteModal.delete !== 'delete'}
          onClick={() =>
            props.submitProgramDeleteReport(props.ticket._id.toString())
          }
        >
          Delete ticket
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={props.setReportDeleteModalHide}
        >
          Close
        </Button>
      </Typography>
    </ModalNew>
  );
}
export default ProgramReportDeleteModal;
