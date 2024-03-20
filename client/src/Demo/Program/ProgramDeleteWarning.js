import React from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function ProgramDeleteWarning(props) {
  const { t } = useTranslation();
  return (
    <ModalNew
      open={props.deleteProgramWarning}
      onClose={props.setModalHideDDelete}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Typography>Warning</Typography>
      <Typography variant="h5">
        Do you want to delete {props.uni_name} - {props.program_name}?
      </Typography>
      <Button
        color="primary"
        variant="contained"
        onClick={() => props.RemoveProgramHandler(props.program_id)}
      >
        {t('Yes', { ns: 'common' })}
      </Button>
      <Button
        color="secondary"
        variant="outlined"
        onClick={props.setModalHideDDelete}
      >
        {t('No', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramDeleteWarning;
