import React, { useState } from 'react';
import { Box } from '@mui/material';

import SurveyEditableComponent from './SurveyEditableComponent';
import ModalMain from '../Utils/ModalHandler/ModalMain';

function SurveyComponent() {
  const [surveyComponentState, setSurveyComponentState] = useState({
    updateconfirmed: false,
    res_modal_status: 0,
    res_modal_message: ''
  });

  const ConfirmError = () => {
    setSurveyComponentState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  // const onHide = () => {
  //   setSurveyComponentState((prevState) => ({
  //     ...prevState,
  //     updateconfirmed: false
  //   }));
  // };

  const { res_modal_message, res_modal_status } = surveyComponentState;

  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <SurveyEditableComponent />
      {/* <ModalNew
        open={surveyComponentState.updateconfirmed}
        onClose={onHide}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography>{t('Update success')}</Typography>
        {t('Academic Background Survey is updated successfully!')}
        <Button color="primary" variant="outlined" onClick={onHide}>
          {t('Close')}
        </Button>
      </ModalNew> */}
    </Box>
  );
}

export default SurveyComponent;
