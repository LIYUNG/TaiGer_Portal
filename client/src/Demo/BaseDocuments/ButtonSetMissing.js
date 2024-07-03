import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';

import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import {
  is_TaiGer_Admin,
  is_TaiGer_AdminAgent,
  is_TaiGer_Student
} from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import Loading from '../../components/Loading/Loading';
import { FILE_MISSING_SYMBOL } from '../Utils/contants';
import {
  SetNotNeededIconButton,
  UploadIconButton
} from '../../components/Buttons/Button';

function ButtonSetMissing(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [buttonSetMissing, setButtonSetMissingState] = useState({
    student: props.student,
    link: props.link,
    student_id: props.student._id.toString(),
    category: '',
    comments: '',
    file: '',
    isLoaded: props.isLoaded,
    deleteFileWarningModel: false,
    setMissingWindow: false,
    acceptProfileFileModel: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  });

  useEffect(() => {
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded
    }));
  }, [props.isLoaded]);

  const closeOffcanvasWindow = () => {
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: false
    }));
  };
  const openOffcanvasWindow = () => {
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: true
    }));
  };

  const closeSetMissingWindow = () => {
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      setMissingWindow: false
    }));
  };

  const handleGeneralDocSubmit = (e, k, student_id) => {
    e.preventDefault();
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.handleGeneralDocSubmit(e, k, student_id);
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      student_id,
      category,
      status,
      setMissingWindow: true
    }));
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.onUpdateProfileFilefromstudent(
      buttonSetMissing.category,
      buttonSetMissing.student_id,
      buttonSetMissing.status,
      buttonSetMissing.feedback
    );
  };

  const updateDocLink = (e) => {
    e.preventDefault();
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    props.updateDocLink(buttonSetMissing.link, props.k);
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  const onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    setButtonSetMissingState((prevState) => ({
      ...prevState,
      link: url_temp
    }));
  };

  var ButttonRow_Rejected;
  ButttonRow_Rejected = (
    <Box
      sx={{
        mb: 1,
        p: 2,
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={8}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {FILE_MISSING_SYMBOL}
            <Typography variant="body1">
              {t(props.docName, { ns: 'common' })}
            </Typography>
            <Tooltip title={t('Read More')}>
              <IconButton
                component={LinkDom}
                to={
                  buttonSetMissing.link && buttonSetMissing.link !== ''
                    ? buttonSetMissing.link
                    : '/'
                }
                target="_blank"
                size="small"
                color="primary"
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {is_TaiGer_Admin(user) && (
              <Typography
                component="a"
                onClick={openOffcanvasWindow}
                sx={{ cursor: 'pointer', ml: 1 }}
                color="primary"
              >
                [Edit]
              </Typography>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            {(is_TaiGer_Student(user) || is_TaiGer_AdminAgent(user)) && (
              <UploadIconButton
                user={user}
                buttonState={buttonSetMissing}
                t={t}
                handleGeneralDocSubmit={handleGeneralDocSubmit}
                k={props.k}
              />
            )}
            {is_TaiGer_AdminAgent(user) && (
              <SetNotNeededIconButton
                onUpdateProfileDocStatus={onUpdateProfileDocStatus}
                k={props.k}
                buttonState={buttonSetMissing}
                t={t}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      {ButttonRow_Rejected}
      <ModalNew
        open={buttonSetMissing.setMissingWindow}
        onClose={closeSetMissingWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5">Warning</Typography>
        Do you want to set {buttonSetMissing.category} unnecessary document?
        {!buttonSetMissing.isLoaded && <Loading />}
        <Button
          variant="contained"
          disabled={!buttonSetMissing.isLoaded}
          onClick={(e) => onUpdateProfileFilefromstudent(e)}
        >
          {t('Yes', { ns: 'common' })}
        </Button>
        <Button onClick={closeSetMissingWindow}>No</Button>
      </ModalNew>
      <OffcanvasBaseDocument
        open={buttonSetMissing.baseDocsflagOffcanvas}
        onHide={closeOffcanvasWindow}
        link={buttonSetMissing.link}
        docName={props.docName}
        onChangeURL={onChangeURL}
        updateDocLink={updateDocLink}
        baseDocsflagOffcanvasButtonDisable={
          buttonSetMissing.baseDocsflagOffcanvasButtonDisable
        }
      />
    </>
  );
}

export default ButtonSetMissing;
