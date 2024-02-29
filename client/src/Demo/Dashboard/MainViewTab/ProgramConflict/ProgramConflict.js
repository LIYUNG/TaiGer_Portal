import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Link, TableBody, TableCell, TableRow } from '@mui/material';

import DEMO from '../../../../store/constant';

function ProgramConflict(props) {
  var studs_id = props.conflict_map[props.conf_program_id];
  var stds = studs_id.map((k, i) => (
    <div className="text-info" key={i}>
      <Link
        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          studs_id[i],
          DEMO.PROFILE_HASH
        )}`}
        component={LinkDom}
      >
        {props.students.find((stud) => stud._id === studs_id[i]).firstname},{' '}
        {props.students.find((stud) => stud._id === studs_id[i]).lastname}
      </Link>
    </div>
  ));
  var application_deadline = studs_id.map((k, i) => (
    <div className="text-info" key={i}>
      {props.students.find((stud) => stud._id === studs_id[i]) &&
      props.students.find((stud) => stud._id === studs_id[i])
        .application_preference &&
      props.students.find((stud) => stud._id === studs_id[i])
        .application_preference.expected_application_date
        ? props.students.find((stud) => stud._id === studs_id[i])
            .application_preference.expected_application_date + '-'
        : ''}
      {props.conflict_programs[props.conf_program_id].application_deadline}
    </div>
  ));
  return (
    <TableBody>
      <TableRow>
        <TableCell>
          <Link
            to={`${DEMO.SINGLE_PROGRAM_LINK(props.conf_program_id)}`}
            component={LinkDom}
          >
            <b>{props.conflict_programs[props.conf_program_id].school}</b>
          </Link>
          <br></br>
          <Link
            to={`${DEMO.SINGLE_PROGRAM_LINK(props.conf_program_id)}`}
            component={LinkDom}
          >
            {props.conflict_programs[props.conf_program_id].program}
          </Link>
        </TableCell>
        <TableCell>{stds}</TableCell>
        <TableCell>{application_deadline}</TableCell>
      </TableRow>
    </TableBody>
  );
}

export default ProgramConflict;
