import React from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import ModalNew from '../../components/Modal';

function ProgramAddedMyWatchList(props) {
  const {t} = useTranslation()
  return (
    <ModalNew
      open={props.modalShowNAddMyWatchList}
      onClose={props.setModalHideDDelete}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Typography>Success</Typography>
      <Typography>
        {props.uni_name} - {props.program_name} is added to my watch list.
      </Typography>

      <Button
        color="primary"
        variant="contained"
        onClick={() => props.setModalHide_AddToMyWatchList()}
      >
        {t{'Ok'}}
      </Button>
    </ModalNew>
  );
}
export default ProgramAddedMyWatchList;
