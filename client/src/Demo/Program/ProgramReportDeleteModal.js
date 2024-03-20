import React, { useState } from 'react';
import { Badge, Button, TextField, Typography } from '@mui/material';
import ModalNew from '../../components/Modal';
import { useTranslation } from 'react-i18next';

function ProgramReportDeleteModal(props) {
  const [programReportDeleteModal, setProgramReportDeleteModalState] = useState(
    {
      ticket: {},
      delete: ''
    }
  );
  const { t } = useTranslation();
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
      <Typography variant="h6">Delete ticket</Typography>
      <Typography variant="body1">
        Do you want to delelete {props.uni_name} - {props.program_name} ticket?
      </Typography>
      <Typography variant="body1">{t('Description')}</Typography>
      <TextField
        fullWidth
        type="textarea"
        inputProps={{ maxLength: 2000 }}
        multiline
        minRows={8}
        placeholder="Deadline is wrong."
        defaultValue={props.ticket.description}
        isInvalid={props.ticket.description?.length > 2000}
        onChange={(e) => handleChange(e)}
      />
      <Badge>
        {props.ticket.description?.length || 0}/{2000}
      </Badge>
      <Typography variant="body1">{t('Feedback')}</Typography>
      <TextField
        fullWidth
        type="textarea"
        inputProps={{ maxLength: 2000 }}
        multiline
        minRows={8}
        placeholder="Deadline is wrong."
        defaultValue={props.ticket.feedback}
        isInvalid={props.ticket.feedback?.length > 2000}
        onChange={(e) => handleChange(e)}
      />
      <Badge>
        {props.ticket.feedback?.length || 0}/{2000}
      </Badge>
      <br />
      <Typography variant="body2">
        Please enter <i>delete</i> in order to delete the ticket.
      </Typography>
      <TextField
        fullWidth
        id="delete"
        size="small"
        type="text"
        placeholder="delete"
        onChange={(e) => handleDeleteChange(e)}
      />
      <Button
        color="primary"
        variant="contained"
        disabled={programReportDeleteModal.delete !== 'delete'}
        onClick={() =>
          props.submitProgramDeleteReport(props.ticket._id.toString())
        }
      >
        {t('Delete Ticket')}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={props.setReportDeleteModalHide}
      >
        {t('Close', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramReportDeleteModal;
