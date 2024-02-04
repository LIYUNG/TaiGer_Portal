import React from 'react';
import {
  Button,
  CircularProgress,
  Typography,
  TextField,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function UserDeleteWarning(props) {
  const { t } = useTranslation();
  return (
    <ModalNew
      open={props.deleteUserWarning}
      onClose={props.setModalHideDDelete}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Typography variant="h6" fontWeight="bold">
        {t('Warning')}
      </Typography>
      <Typography variant="body1">
        {t('Do you want to delete')}{' '}
        <b>
          {props.firstname} - {props.lastname}
        </b>
        ?
      </Typography>
      <Typography variant="body1">
        Please enter{' '}
        <i>
          <b>delete</b>
        </i>{' '}
        in order to delete the user.
      </Typography>
      <TextField
        size="small"
        type="text"
        placeholder="delete"
        onChange={(e) => props.onChangeDeleteField(e)}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          size="small"
          color="primary"
          variant="contained"
          disabled={!props.isLoaded || !(props.delete_field === 'delete')}
          onClick={() => props.handleDeleteUser(props.selected_user_id)}
          sx={{ mr: 2 }}
        >
          {props.isLoaded ? t('Yes') : <CircularProgress size={24} />}
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="outlined"
          onClick={props.setModalHideDDelete}
        >
          {t('No')}
        </Button>
      </Box>
    </ModalNew>
  );
}
export default UserDeleteWarning;
