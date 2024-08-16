import React, { useState } from 'react';
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function ProgramReportModal(props) {
  const { t } = useTranslation();
  const [programReportModalState, setProgramReportModalState] = useState({
    description: ''
  });
  const handleChange = (e) => {
    setProgramReportModalState((prevState) => ({
      ...prevState,
      description: e.target.value
    }));
  };

  return (
    <Dialog open={props.isReport} onClose={props.setReportModalHideDelete}>
      <DialogTitle>Report</DialogTitle>
      <DialogContent>
        What information is inaccurate for {props.uni_name} -{' '}
        {props.program_name}?
        <TextField
          fullWidth
          type="textarea"
          inputProps={{ maxLength: 2000 }}
          multiline
          minRows={10}
          placeholder="Deadline is wrong."
          value={programReportModalState.description || ''}
          isInvalid={programReportModalState.description?.length > 2000}
          onChange={(e) => handleChange(e)}
        />
        <Badge>
          {programReportModalState.description?.length || 0}/{2000}
        </Badge>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disabled={programReportModalState.description?.length === 0}
          onClick={() =>
            props.submitProgramReport(
              props.program_id,
              programReportModalState.description
            )
          }
        >
          {t('Create ticket', { ns: 'programList' })}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={props.setReportModalHideDelete}
        >
          {t('Close', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ProgramReportModal;
