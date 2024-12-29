import React, { useEffect, useState } from 'react';
import { Card, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  check_student_needs_uni_assist,
  isProgramDecided
} from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import Loading from '../../components/Loading/Loading';
import { UniAssistProgramBlock } from './UniAssistProgramBlock';

function UniAssistListCard(props) {
  const { t } = useTranslation();

  const [uniAssistListCardState, setUniAssistListCardState] = useState({
    isLoaded2: {},
    isLoadedVPDConfirmation: {},
    isLoaded: false,
    student: props.student,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    let temp_isLoaded = {};
    for (let i = 0; i < props.student.applications.length; i++) {
      temp_isLoaded[
        `${props.student.applications[i].programId._id.toString()}`
      ] = true;
    }
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      student: props.student,
      isLoaded2: temp_isLoaded,
      isLoadedVPDConfirmation: temp_isLoaded
    }));
  }, [props.student._id]);

  const ConfirmError = () => {
    setUniAssistListCardState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const { res_status, isLoaded, res_modal_status, res_modal_message } =
    uniAssistListCardState;

  if (!isLoaded && !uniAssistListCardState.student) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const app_name = uniAssistListCardState.student.applications
    .filter((application) => isProgramDecided(application))
    .map((application, i) => (
      <Box key={i} sx={{ mb: 2 }}>
        <UniAssistProgramBlock
          application={application}
          student={uniAssistListCardState.student}
        />
      </Box>
    ));

  return (
    <>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      {check_student_needs_uni_assist(uniAssistListCardState.student) ? (
        <Card sx={{ padding: 2 }}>
          <Typography>
            {t(
              'The following program needs uni-assist process, please check if paid, uploaded document and upload VPD here'
            )}
            :{app_name}
          </Typography>
        </Card>
      ) : (
        <Card sx={{ padding: 2 }}>
          <Typography>
            {t('Based on the applications, Uni-Assist is NOT needed')}
          </Typography>
        </Card>
      )}
    </>
  );
}
export default UniAssistListCard;
