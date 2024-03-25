import React from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function UserArchivWarning(props) {
  const { t } = useTranslation();
  return (
    <ModalNew
      open={props.archivUserWarning}
      onClose={props.setModalArchivHide}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Typography variant="h5">Warning</Typography>
      <Typography variant="h5">
        Do you want to archiv{' '}
        <b>
          {props.firstname} - {props.lastname}
        </b>
        ?
      </Typography>

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
    </ModalNew>
  );
}
export default UserArchivWarning;
