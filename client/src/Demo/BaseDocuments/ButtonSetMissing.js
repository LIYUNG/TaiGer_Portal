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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
import { VisuallyHiddenInput } from '../../components/Input';
import { FILE_MISSING_SYMBOL } from '../Utils/contants';

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
    <TableRow>
      <TableCell>{FILE_MISSING_SYMBOL}</TableCell>
      <TableCell>
        {t(props.docName, { ns: 'common' })}
        <Link
          to={
            buttonSetMissing.link && buttonSetMissing.link != ''
              ? buttonSetMissing.link
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
      </TableCell>
      <TableCell></TableCell>
      {is_TaiGer_Student(user) || is_TaiGer_AdminAgent(user) ? (
        <TableCell>
          {!buttonSetMissing.isLoaded ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              component="label"
              size="small"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              {t('Upload', { ns: 'common' })}
              <VisuallyHiddenInput
                type="file"
                onChange={(e) =>
                  handleGeneralDocSubmit(
                    e,
                    props.k,
                    buttonSetMissing.student_id
                  )
                }
              />
            </Button>
          )}
        </TableCell>
      ) : (
        <TableCell></TableCell>
      )}
      <TableCell></TableCell>
      <TableCell>
        {is_TaiGer_AdminAgent(user) && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(e) =>
              onUpdateProfileDocStatus(
                e,
                props.k,
                buttonSetMissing.student_id,
                'notneeded'
              )
            }
          >
            {t('Set Not Needed', { ns: 'common' })}
          </Button>
        )}
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
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
