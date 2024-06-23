import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function ProgramReportUpdateModal(props) {
  const { t } = useTranslation();
  const [programReportUpdateModalState, ProgramReportUpdateModalState] =
    useState({
      ticket: props.ticket
    });
  useEffect(() => {
    ProgramReportUpdateModalState((prevState) => ({
      ...prevState,
      ticket: props.ticket
    }));
  }, [props.ticket]);

  const handleChange = (e) => {
    var temp_ticket = { ...programReportUpdateModalState.ticket };
    temp_ticket[e.target.name] = e.target.value;
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
      <TextField
        fullWidth
        name="description"
        type="textarea"
        multiline
        minRows={10}
        placeholder="Deadline is wrong."
        value={programReportUpdateModalState.ticket.description}
        onChange={(e) => handleChange(e)}
      />

      <Typography variant="h6">Feedback</Typography>
      <TextField
        fullWidth
        name="feedback"
        type="textarea"
        multiline
        minRows={10}
        placeholder="Deadline is for Non-EU (05-15)"
        defaultValue={programReportUpdateModalState.ticket.feedback}
        onChange={(e) => handleChange(e)}
      />
      <Button
        color="primary"
        variant="contained"
        onClick={() =>
          props.submitProgramUpdateReport(props.ticket._id.toString(), {
            ...programReportUpdateModalState.ticket,
            status: 'resolved'
          })
        }
        sx={{ mr: 1 }}
      >
        {t('Resolve ticket', { ns: 'programList' })}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={props.setReportUpdateModalHide}
      >
        {t('Close', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramReportUpdateModal;
