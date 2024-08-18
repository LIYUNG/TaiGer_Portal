import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function OffcanvasBaseDocument(props) {
  const { t } = useTranslation();
  return (
    <Dialog open={props.open} onClose={props.onHide}>
      <DialogTitle>{t('Edit', { ns: 'common' })}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Documentation Link for <b>{props.docName}</b>
        </DialogContentText>
        <TextField
          fullWidth
          size="small"
          placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
          defaultValue={props.link}
          onChange={(e) => props.onChangeURL(e)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={(e) => props.updateDocLink(e)}
          disabled={props.baseDocsflagOffcanvasButtonDisable}
        >
          {t('Save', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
