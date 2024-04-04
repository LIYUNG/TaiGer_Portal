import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  AiFillQuestionCircle,
  AiFillCloseCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import {
  Box,
  Button,
  CircularProgress,
  Link,
  TableCell,
  TextField,
  Typography
} from '@mui/material';
import { BsDash } from 'react-icons/bs';

import { profile_list } from '../Utils/contants';
import { DocumentStatus } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import AcceptProfileFileModel from './AcceptedFilePreviewModal';
import ModalNew from '../../components/Modal';
import { updateProfileDocumentStatus } from '../../api';
import { useTranslation } from 'react-i18next';
import ModalMain from '../Utils/ModalHandler/ModalMain';

function StudentBaseDocumentsStatus(props) {
  const { t } = useTranslation();
  const [studentBaseDocumentsStatusState, setStudentBaseDocumentsStatusState] =
    useState({
      student: props.student,
      link: props.link,
      student_id: props.student._id.toString(),
      category: '',
      doc_key: '',
      docName: '',
      comments: '',
      feedback: '',
      file: '',
      isLoaded: props.isLoaded,
      deleteFileWarningModel: false,
      showPreview: false,
      preview_path: '#',
      rejectProfileFileModel: false,
      acceptProfileFileModel: false,
      baseDocsflagOffcanvas: false,
      baseDocsflagOffcanvasButtonDisable: false,
      res_modal_status: 0,
      res_modal_message: ''
    });

  const showPreview = (e, path, doc_key) => {
    e.preventDefault();
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path,
      doc_key: doc_key
    }));
  };

  const closeRejectWarningWindow = () => {
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      rejectProfileFileModel: false
    }));
  };

  const closePreviewWindow = () => {
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
  };
  const handleRejectMessage = (e, rejectmessage) => {
    e.preventDefault();
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      feedback: rejectmessage
    }));
  };

  const onUpdateProfileFilefromstudent = (e) => {
    e.preventDefault();
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    updateProfileDocumentStatus(
      studentBaseDocumentsStatusState.category,
      studentBaseDocumentsStatusState.student_id,
      studentBaseDocumentsStatusState.status,
      studentBaseDocumentsStatusState.feedback
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setStudentBaseDocumentsStatusState((prevState) => ({
            ...prevState,
            student: data,
            success,
            showPreview: false,
            rejectProfileFileModel: false,
            isLoaded: {
              ...prevState.isLoaded,
              [studentBaseDocumentsStatusState.category]: true
            },
            res_modal_status: status
          }));
        } else {
          // TODO: redesign, modal ist better!
          const { message } = resp.data;
          setStudentBaseDocumentsStatusState((prevState) => ({
            ...prevState,
            isLoaded: {
              ...prevState.isLoaded,
              [studentBaseDocumentsStatusState.category]: true
            },
            showPreview: false,
            rejectProfileFileModel: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setStudentBaseDocumentsStatusState((prevState) => ({
          ...prevState,
          isLoaded: {
            ...prevState.isLoaded,
            [studentBaseDocumentsStatusState.category]: true
          },
          error,
          showPreview: false,
          rejectProfileFileModel: false,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const onUpdateProfileDocStatus = (e, category, student_id, status) => {
    e.preventDefault();
    if (status === 'accepted') {
      setStudentBaseDocumentsStatusState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        acceptProfileFileModel: true
      }));
    } else {
      setStudentBaseDocumentsStatusState((prevState) => ({
        ...prevState,
        student_id,
        category,
        status,
        rejectProfileFileModel: true
      }));
    }
  };

  const ConfirmError = () => {
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  let keys2 = Object.keys(profile_list);
  let object_init = {};
  keys2.forEach((key) => {
    object_init[key] = { status: DocumentStatus.Missing };
  });

  if (studentBaseDocumentsStatusState.student.profile) {
    studentBaseDocumentsStatusState.student.profile.forEach((profile) => {
      let document_split = profile.path.replace(/\\/g, '/');
      let document_name = document_split.split('/')[1];

      switch (profile.status) {
        case DocumentStatus.Uploaded:
        case DocumentStatus.Accepted:
        case DocumentStatus.Rejected:
          object_init[profile.name].status = profile.status;
          object_init[profile.name].path = document_name;
          break;
        case DocumentStatus.NotNeeded:
        case DocumentStatus.Missing:
          object_init[profile.name].status = profile.status;
          break;
      }
    });
  } else {
    /* empty */
  }
  let profile_list_keys = Object.keys(profile_list);

  const student_profile_path = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
    studentBaseDocumentsStatusState.student._id,
    DEMO.PROFILE_HASH
  )}`;
  var file_information;
  for (var i = 0; i < profile_list_keys.length; i++) {
    if (
      object_init[profile_list_keys[i]].status === DocumentStatus.Uploaded ||
      object_init[profile_list_keys[i]].status === DocumentStatus.Rejected ||
      object_init[profile_list_keys[i]].status === DocumentStatus.Missing
    ) {
      break;
    }
  }
  file_information = profile_list_keys.map((k, i) => {
    if (object_init[k].status === DocumentStatus.Uploaded) {
      return (
        <TableCell key={i}>
          <Link
            to={student_profile_path}
            style={{ textDecoration: 'none' }}
            className="text-info"
          >
            <AiOutlineFieldTime
              size={24}
              color="orange"
              title="Uploaded successfully"
            />
          </Link>
        </TableCell>
      );
    } else if (object_init[k].status === DocumentStatus.Accepted) {
      return (
        <TableCell key={i}>
          <IoCheckmarkCircle
            size={24}
            color="limegreen"
            title="Valid Document"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            onClick={(e) => {
              showPreview(e, object_init[k].path, k);
            }}
          />
        </TableCell>
      );
    } else if (object_init[k].status === DocumentStatus.Rejected) {
      return (
        <TableCell key={i}>
          <Link
            to={student_profile_path}
            style={{ textDecoration: 'none' }}
            className="text-info"
          >
            <AiFillCloseCircle size={24} color="red" title="Invalid Document" />
          </Link>
        </TableCell>
      );
    } else if (object_init[k].status === DocumentStatus.NotNeeded) {
      // TODO: render or hide?
      return (
        <TableCell key={i}>
          <Link
            to={student_profile_path}
            style={{ textDecoration: 'none' }}
            className="text-info"
          >
            <BsDash size={24} color="lightgray" title="Not needed" />
          </Link>
        </TableCell>
      );
    } else {
      return (
        <TableCell key={i}>
          <Link
            to={student_profile_path}
            style={{ textDecoration: 'none' }}
            className="text-info"
          >
            <AiFillQuestionCircle
              size={24}
              color="lightgray"
              title="No Document uploaded"
            />
          </Link>
        </TableCell>
      );
    }
  });

  return (
    <>
      {studentBaseDocumentsStatusState.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={studentBaseDocumentsStatusState.res_modal_status}
          res_modal_message={studentBaseDocumentsStatusState.res_modal_message}
        />
      )}
      <TableCell>
        <Link to={student_profile_path} component={LinkDom}>
          {studentBaseDocumentsStatusState.student.firstname}{' '}
          {studentBaseDocumentsStatusState.student.lastname}
        </Link>
      </TableCell>
      {file_information}
      <AcceptProfileFileModel
        showPreview={studentBaseDocumentsStatusState.showPreview}
        closePreviewWindow={closePreviewWindow}
        path={studentBaseDocumentsStatusState.preview_path}
        preview_path={studentBaseDocumentsStatusState.preview_path}
        student_id={studentBaseDocumentsStatusState.student_id}
        isLoaded={studentBaseDocumentsStatusState.isLoaded}
        k={studentBaseDocumentsStatusState.doc_key}
        onUpdateProfileDocStatus={onUpdateProfileDocStatus}
      />
      <ModalNew
        open={studentBaseDocumentsStatusState.rejectProfileFileModel}
        onClose={closeRejectWarningWindow}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">Warning</Typography>
        <Typography variant="body1">
          Please give a reason why the uploaded{' '}
          {studentBaseDocumentsStatusState.category} is invalied?
        </Typography>
        <TextField
          type="text"
          placeholder="ex. Poor scanned quality."
          onChange={(e) => handleRejectMessage(e, e.target.value)}
        />
        <Box>
          <Button
            disabled={studentBaseDocumentsStatusState.feedback === ''}
            onClick={(e) => onUpdateProfileFilefromstudent(e)}
          >
            {!studentBaseDocumentsStatusState.isLoaded ? (
              <CircularProgress size={24} />
            ) : (
              t('Yes', { ns: 'common' })
            )}
          </Button>
          <Button onClick={closeRejectWarningWindow}>
            {t('No', { ns: 'common' })}
          </Button>
        </Box>
      </ModalNew>
    </>
  );
}

export default StudentBaseDocumentsStatus;
