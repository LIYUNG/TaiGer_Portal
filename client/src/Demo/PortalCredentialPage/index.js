import React from 'react';
import { Redirect } from 'react-router-dom';
import { is_TaiGer_Student } from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import PortalCredentialsCard from './PortalCredentialsCard';
import 'react-datasheet-grid/dist/style.css';

export default function PortalCredentialPage(props) {
  if (
    !is_TaiGer_Student(props.user) &&
    !props.match?.params.student_id &&
    !props.student_id
  ) {
    return <Redirect to={`${DEMO.DASHBOARD_LINK}`} />;
  }
  const student_id = props.match?.params.student_id
    ? props.match?.params.student_id
    : is_TaiGer_Student(props.user)
    ? props.user._id.toString()
    : props.student_id;
  return (
    <PortalCredentialsCard
      user={props.user}
      student_id={student_id}
      showTitle={props.showTitle | false}
    />
  );
}
