import React, { useState } from 'react';
import { Badge, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

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
    <ModalNew
      open={props.isReport}
      onClose={props.setReportModalHideDelete}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h6">Report</Typography>
      <Typography variant="body2">
        What information is inaccurate for {props.uni_name} -{' '}
        {props.program_name}?
      </Typography>
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
      <br />
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
    </ModalNew>
  );
}
export default ProgramReportModal;
