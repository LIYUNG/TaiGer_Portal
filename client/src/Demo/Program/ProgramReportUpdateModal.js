import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { is_TaiGer_role } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';

function ProgramReportUpdateModal(props) {
  const { t } = useTranslation();
  const { user } = useAuth();
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
    <Dialog
      open={props.isUpdateReport}
      onClose={props.setReportUpdateModalHide}
    >
      <DialogTitle>Report</DialogTitle>
      <DialogContent>
        What information is inaccurate for {props.uni_name} -{' '}
        {props.program_name}?{' '}
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
        <Typography variant="body1">Feedback</Typography>
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
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            props.submitProgramUpdateReport(props.ticket._id.toString(), {
              ...programReportUpdateModalState.ticket,
              status: 'resolved'
            })
          }
          disabled={!is_TaiGer_role(user)}
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
      </DialogActions>
    </Dialog>
  );
}
export default ProgramReportUpdateModal;
