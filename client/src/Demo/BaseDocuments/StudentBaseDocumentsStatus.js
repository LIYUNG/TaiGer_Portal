import React from 'react';
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

function StudentBaseDocumentsStatus(props) {
  let keys2 = Object.keys(profile_list);
  let object_init = {};
  keys2.forEach((key) => {
    object_init[key] = DocumentStatus.Missing;
  });

  if (props.student.profile) {
    for (let i = 0; i < props.student.profile.length; i++) {
      const { status, name } = props.student.profile[i];
      switch (status) {
        case DocumentStatus.Uploaded:
          object_init[name] = DocumentStatus.Uploaded;
          break;
        case DocumentStatus.Accepted:
          object_init[name] = DocumentStatus.Accepted;
          break;
        case DocumentStatus.Rejected:
          object_init[name] = DocumentStatus.Rejected;
          break;
        case DocumentStatus.NotNeeded:
          object_init[name] = DocumentStatus.NotNeeded;
          break;
        case DocumentStatus.Missing:
          object_init[name] = DocumentStatus.Missing;
          break;
      }
    }
  } else {
    /* empty */
  }
  let profile_list_keys = Object.keys(profile_list);

  const student_profile_path = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
    props.student._id,
    '/profile'
  )}`;
  var file_information;
  for (var i = 0; i < profile_list_keys.length; i++) {
    if (
      object_init[profile_list_keys[i]] === DocumentStatus.Uploaded ||
      object_init[profile_list_keys[i]] === DocumentStatus.Rejected ||
      object_init[profile_list_keys[i]] === DocumentStatus.Missing
    ) {
      break;
    }
  }
  file_information = profile_list_keys.map((k, i) => {
    if (object_init[k] === DocumentStatus.Uploaded) {
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
    } else if (object_init[k] === DocumentStatus.Accepted) {
      return (
        <TableCell key={i}>
          <Link
            to={student_profile_path}
            style={{ textDecoration: 'none' }}
            className="text-info"
          >
            <IoCheckmarkCircle
              size={24}
              color="limegreen"
              title="Valid Document"
            />
          </Link>
        </TableCell>
      );
    } else if (object_init[k] === DocumentStatus.Rejected) {
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
    } else if (object_init[k] === DocumentStatus.NotNeeded) {
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
    </>
  );
}

export default StudentBaseDocumentsStatus;
