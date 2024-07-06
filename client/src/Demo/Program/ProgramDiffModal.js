import React from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ModalNew from '../../components/Modal';

function ProgramDiffModal(props) {
  const { t } = useTranslation();

  return (
    <ModalNew
      open={props.open}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Typography variant="h6">Hello!</Typography>
      <Button
        color="secondary"
        variant="outlined"
        onClick={props.setModalHide}
      >
        {t('Close', { ns: 'common' })}
      </Button>
    </ModalNew>
  );
}
export default ProgramDiffModal;
