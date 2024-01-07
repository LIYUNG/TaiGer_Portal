import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import { UserlistHeader, convertDate, getDate } from '../Utils/contants';
import { Link } from 'react-router-dom';
import DEMO from '../../store/constant';
import {
  is_TaiGer_Agent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';

function User(props) {
  if (props.success) {
    return (
      <tr key={props.user._id}>
        <th>
          {props.user.role !== 'Admin' && (
            <DropdownButton
              size="sm"
              title="Option"
              variant="primary"
              id={`dropdown-variants-${props.user._id}`}
              key={props.user._id}
            >
              <Dropdown.Item
                eventKey="2"
                onClick={() =>
                  props.setModalShow(
                    props.user.firstname,
                    props.user.lastname,
                    props.user.role,
                    props.user._id
                  )
                }
              >
                Set User as...
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="4"
                onClick={() =>
                  props.setModalArchiv(
                    props.user.firstname,
                    props.user.lastname,
                    props.user._id.toString(),
                    props.user.archiv
                  )
                }
              >
                {props.user.archiv === true ? 'Activate' : 'Archiv'}
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="3"
                onClick={() =>
                  props.setModalShowDelete(
                    props.user.firstname,
                    props.user.lastname,
                    props.user._id
                  )
                }
              >
                Delete
              </Dropdown.Item>
            </DropdownButton>
          )}
        </th>
        {UserlistHeader.map((y, k) => (
          <td key={k}>
            {typeof props.user[y.prop] == 'boolean' ? (
              props.user[y.prop] ? (
                'Yes'
              ) : (
                'No'
              )
            ) : is_TaiGer_Student(props.user) ? (
              <Link
                className="text-info"
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  props.user._id.toString(),
                  DEMO.PROFILE
                )}`}
              >
                {props.user[y.prop]}
              </Link>
            ) : is_TaiGer_Agent(props.user) ? (
              <Link
                className="text-info"
                to={`${DEMO.TEAM_AGENT_LINK(props.user._id.toString())}`}
              >
                {props.user[y.prop]}
              </Link>
            ) : is_TaiGer_Editor(props.user) ? (
              <Link
                className="text-info"
                to={`${DEMO.TEAM_EDITOR_LINK(props.user._id.toString())}`}
              >
                {props.user[y.prop]}
              </Link>
            ) : (
              props.user[y.prop]
            )}
          </td>
        ))}
        <td>{getDate(props.user.createdAt)}</td>
        <td>{convertDate(props.user.lastLoginAt)}</td>
      </tr>
    );
  } else {
    return <></>;
  }
}

export default User;
