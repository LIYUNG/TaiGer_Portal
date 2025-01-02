import React, { useState } from 'react';
import {
  Button,
  Link,
  Menu,
  MenuItem,
  TableCell,
  TableRow
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import i18next from 'i18next';
import {
  is_TaiGer_Admin,
  is_TaiGer_Agent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '@taiger-common/core';

import { UserlistHeader, convertDate, getDate } from '../../utils/contants';
import DEMO from '../../store/constant';

function User(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (props.success) {
    return (
      <TableRow key={props.user._id}>
        <TableCell>
          {!is_TaiGer_Admin(props.user) && (
            <>
              <Button
                id="basic-button"
                variant="contained"
                size="small"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {i18next.t('Option', { ns: 'common' })}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button'
                }}
              >
                <MenuItem
                  onClick={() =>
                    props.setModalShow(
                      props.user.firstname,
                      props.user.lastname,
                      props.user.role,
                      props.user._id
                    )
                  }
                >
                  {i18next.t('Set User as', { ns: 'common' })}
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    props.setModalArchiv(
                      props.user.firstname,
                      props.user.lastname,
                      props.user._id.toString(),
                      props.user.archiv
                    )
                  }
                >
                  {props.user.archiv === true
                    ? i18next.t('Activate', { ns: 'common' })
                    : i18next.t('Archive', { ns: 'common' })}
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    props.setModalShowDelete(
                      props.user.firstname,
                      props.user.lastname,
                      props.user._id
                    )
                  }
                >
                  {i18next.t('Delete', { ns: 'common' })}
                </MenuItem>
              </Menu>
            </>
          )}
        </TableCell>
        {UserlistHeader.map((y, k) => (
          <TableCell key={k}>
            {typeof props.user[y.prop] == 'boolean' ? (
              props.user[y.prop] ? (
                i18next.t('Yes', { ns: 'common' })
              ) : (
                i18next.t('No', { ns: 'common' })
              )
            ) : is_TaiGer_Student(props.user) ? (
              <Link
                underline="hover"
                to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                  props.user._id.toString(),
                  DEMO.PROFILE_HASH
                )}`}
                component={LinkDom}
              >
                {props.user[y.prop]}
              </Link>
            ) : is_TaiGer_Agent(props.user) ? (
              <Link
                underline="hover"
                to={`${DEMO.TEAM_AGENT_LINK(props.user._id.toString())}`}
                component={LinkDom}
              >
                {props.user[y.prop]}
              </Link>
            ) : is_TaiGer_Editor(props.user) ? (
              <Link
                underline="hover"
                to={`${DEMO.TEAM_EDITOR_LINK(props.user._id.toString())}`}
                component={LinkDom}
              >
                {props.user[y.prop]}
              </Link>
            ) : (
              props.user[y.prop]
            )}
          </TableCell>
        ))}
        <TableCell>{getDate(props.user.createdAt)}</TableCell>
        <TableCell>{convertDate(props.user.lastLoginAt)}</TableCell>
      </TableRow>
    );
  } else {
    return <></>;
  }
}

export default User;
