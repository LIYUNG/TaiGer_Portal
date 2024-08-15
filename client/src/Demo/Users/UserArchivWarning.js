import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function UserArchivWarning(props) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={props.archivUserWarning}
      onClose={props.setModalArchivHide}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {' '}
          Do you want to archiv{' '}
          <b>
            {props.firstname} - {props.lastname}
          </b>
          ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={() =>
            props.updateUserArchivStatus(
              props.selected_user_id,
              props.archiv === true ? false : true
            )
          }
        >
          {props.isLoaded ? t('Yes', { ns: 'common' }) : t('Loading')}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={props.setModalArchivHide}
        >
          {t('No', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default UserArchivWarning;
