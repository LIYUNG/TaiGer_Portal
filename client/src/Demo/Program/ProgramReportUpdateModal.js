import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function ProgramReportUpdateModal(props) {
  const { t } = useTranslation();
  const [programReportUpdateModalState, ProgramReportUpdateModalState] =
    useState({
      ticket: {}
    });
  const handleChange = (e) => {
    var temp_ticket = { ...programReportUpdateModalState.ticket };
    temp_ticket[e.target.id] = e.target.value;
    ProgramReportUpdateModalState((prevState) => ({
      ...prevState,
      ticket: temp_ticket
    }));
  };

  return (
    <ModalNew
      open={props.isUpdateReport}
      onClose={props.setReportUpdateModalHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h5">Report</Typography>
      <Typography variant="h6">
        What information is inaccurate for {props.uni_name} -{' '}
        {props.program_name}?
      </Typography>

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

      <Button
        color="primary"
        variant="contained"
        onClick={() =>
          props.submitProgramUpdateReport(
            props.ticket._id.toString(),
            programReportUpdateModalState.ticket
          )
        }
      >
        {t('Update ticket')}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={props.setReportUpdateModalHide}
      >
        {t('Close')}
      </Button>
    </ModalNew>
  );
}
export default ProgramReportUpdateModal;
