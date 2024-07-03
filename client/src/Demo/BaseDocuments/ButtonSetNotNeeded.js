import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Link,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LaunchIcon from '@mui/icons-material/Launch';

import { FILE_DONT_CARE_SYMBOL, convertDate } from '../Utils/contants';
import OffcanvasBaseDocument from '../../components/Offcanvas/OffcanvasBaseDocument';
import { is_TaiGer_Admin, is_TaiGer_Editor } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import {
  SetNeededIconButton,
  UploadIconButton
} from '../../components/Buttons/Button';

function ButtonSetNotNeeded(props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [buttonSetNotNeededState, setButtonSetNotNeededState] = useState({
    student: props.student,
    link: props.link,
    student_id: props.student._id.toString(),
    category: '',
    docName: '',
    file: '',
    isLoaded: props.isLoaded,
    SetNeededWindow: false,
    baseDocsflagOffcanvas: false,
    baseDocsflagOffcanvasButtonDisable: false
  });

  useEffect(() => {
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      isLoaded: props.isLoaded
    }));
  }, [props.isLoaded]);

  const closeOffcanvasWindow = () => {
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: false
    }));
  };

  const openOffcanvasWindow = () => {
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvas: true
    }));
  };

  const closeSetNeededWindow = () => {
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      SetNeededWindow: false
    }));
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      student_id,
      category,
      status,
      SetNeededWindow: true
    }));
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.onUpdateProfileFilefromstudent(
      buttonSetNotNeededState.category,
      buttonSetNotNeededState.student_id,
      buttonSetNotNeededState.status,
      buttonSetNotNeededState.feedback
    );
  };

  const updateDocLink = (e) => {
    e.preventDefault();
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: true
    }));
    props.updateDocLink(buttonSetNotNeededState.link, props.k);
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      baseDocsflagOffcanvasButtonDisable: false,
      baseDocsflagOffcanvas: false
    }));
  };

  const onChangeURL = (e) => {
    e.preventDefault();
    const url_temp = e.target.value;
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      link: url_temp
    }));
  };

  const handleGeneralDocSubmit = (e, k, student_id) => {
    e.preventDefault();
    setButtonSetNotNeededState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    props.handleGeneralDocSubmit(e, k, student_id);
  };
  var ButttonRow_NotNeeded;
  ButttonRow_NotNeeded = (
    <TableRow>
      <TableCell>{FILE_DONT_CARE_SYMBOL}</TableCell>
      <TableCell>
        {t(props.docName, { ns: 'common' })}
        <Link
          to={
            buttonSetNotNeededState.link && buttonSetNotNeededState.link != ''
              ? buttonSetNotNeededState.link
              : '/'
          }
          component={LinkDom}
          target="_blank"
          sx={{ ml: 1 }}
        >
          <Button size="small" variant="outlined" endIcon={<LaunchIcon />}>
            {t('Read More')}
          </Button>
        </Link>
        {is_TaiGer_Admin(user) && (
          <a onClick={openOffcanvasWindow} style={{ cursor: 'pointer' }}>
            [Edit]
          </a>
        )}
        <Typography variant="body2">{convertDate(props.time)}</Typography>
      </TableCell>
      <TableCell>
        {!is_TaiGer_Editor(user) && (
          <UploadIconButton
            user={user}
            buttonState={buttonSetNotNeededState}
            t={t}
            handleGeneralDocSubmit={handleGeneralDocSubmit}
            k={props.k}
          />
        )}
        <SetNeededIconButton
          onUpdateProfileDocStatus={onUpdateProfileDocStatus}
          k={props.k}
          buttonState={buttonSetNotNeededState}
          t={t}
        />
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {ButttonRow_NotNeeded}
      <ModalNew
        open={buttonSetNotNeededState.SetNeededWindow}
        onClose={closeSetNeededWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h5">Comments</Typography>
        <Typography variant="string">
          Do you want to set {buttonSetNotNeededState.category} as mandatory
          document?
        </Typography>

        {!buttonSetNotNeededState.isLoaded ? (
          <CircularProgress />
        ) : (
          <Button
            disabled={!buttonSetNotNeededState.isLoaded}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {t('Yes', { ns: 'common' })}
          </Button>
        )}

        <Button onClick={closeSetNeededWindow}>
          {t('No', { ns: 'common' })}
        </Button>
      </ModalNew>
      <OffcanvasBaseDocument
        open={buttonSetNotNeededState.baseDocsflagOffcanvas}
        onHide={closeOffcanvasWindow}
        link={buttonSetNotNeededState.link}
        docName={props.docName}
        onChangeURL={onChangeURL}
        updateDocLink={updateDocLink}
        baseDocsflagOffcanvasButtonDisable={
          buttonSetNotNeededState.baseDocsflagOffcanvasButtonDisable
        }
      />
    </>
  );
}

export default ButtonSetNotNeeded;
