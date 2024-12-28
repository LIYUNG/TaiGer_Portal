import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function ProgramDeleteWarning(props) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={props.deleteProgramWarning}
      onClose={() => props.setDeleteProgramWarningOpen(false)}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you want to delete{' '}
          <b>
            {props.uni_name} - {props.program_name}?
          </b>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          disabled={props.isPending}
          onClick={() => props.RemoveProgramHandler(props.program_id)}
          startIcon={props.isPending ? <CircularProgress size={20} /> : null}
        >
          {props.isPending
            ? t('Deleting', { ns: 'common' })
            : t('Yes', { ns: 'common' })}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => props.setDeleteProgramWarningOpen(false)}
        >
          {t('No', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ProgramDeleteWarning;
