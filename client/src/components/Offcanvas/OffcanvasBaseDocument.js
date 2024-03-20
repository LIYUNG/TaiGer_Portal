import React from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../Modal';

export default function OffcanvasBaseDocument(props) {
  const { t } = useTranslation();
  return (
    <ModalNew open={props.open} onClose={props.onHide}>
      <Typography variant="h6">{t('Edit')}</Typography>
      <Typography variant="body1">
        Documentation Link for <b>{props.docName}</b>
      </Typography>
      <br />
      <TextField
        fullWidth
        size="small"
        placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
        defaultValue={props.link}
        onChange={(e) => props.onChangeURL(e)}
      ></TextField>
      <Button
        variant="contained"
        onClick={(e) => props.updateDocLink(e)}
        disabled={props.baseDocsflagOffcanvasButtonDisable}
      >
        {t('Save', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
