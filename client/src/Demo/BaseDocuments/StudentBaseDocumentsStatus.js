import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { IoCheckmarkCircle } from 'react-icons/io5';
import {
  AiFillQuestionCircle,
  AiFillCloseCircle,
  AiOutlineFieldTime
} from 'react-icons/ai';
import { Link, TableCell } from '@mui/material';
import { BsDash } from 'react-icons/bs';

import { profile_list } from '../Utils/contants';
import { DocumentStatus } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import AcceptProfileFileModel from './AcceptedFilePreviewModal';

function StudentBaseDocumentsStatus(props) {
  const [studentBaseDocumentsStatusState, setStudentBaseDocumentsStatusState] =
    useState({
      student: props.student,
      link: props.link,
      student_id: props.student._id.toString(),
      category: '',
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
      baseDocsflagOffcanvasButtonDisable: false
    });

  const showPreview = (e, path) => {
    e.preventDefault();
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      showPreview: true,
      preview_path: path
    }));
  };

  const closePreviewWindow = () => {
    setStudentBaseDocumentsStatusState((prevState) => ({
      ...prevState,
      showPreview: false
    }));
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
  let keys2 = Object.keys(profile_list);
  let object_init = {};
  keys2.forEach((key) => {
    object_init[key] = { status: DocumentStatus.Missing };
  });

  if (props.student.profile) {
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
    props.student._id,
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
              showPreview(e, object_init[k].path);
              console.log(object_init[k].status);
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
      <TableCell>
        <Link to={student_profile_path} component={LinkDom}>
          {props.student.firstname} {props.student.lastname}
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
        k={props.k}
        onUpdateProfileDocStatus={onUpdateProfileDocStatus}
      />
    </>
  );
}

export default StudentBaseDocumentsStatus;
