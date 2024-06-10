import React, { useState } from 'react';
import {
  Button,
  Link,
  Menu,
  MenuItem,
  TableCell,
  TableRow
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom } from 'react-router-dom';

import { UserlistHeader, convertDate, getDate } from '../Utils/contants';
import DEMO from '../../store/constant';
import {
  is_TaiGer_Admin,
  is_TaiGer_Agent,
  is_TaiGer_Editor,
  is_TaiGer_Student
} from '../Utils/checking-functions';

function User(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
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
                {t('Option', { ns: 'common' })}
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
                  Set User as...
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
                    ? t('Activate', { ns: 'common' })
                    : t('Archive', { ns: 'common' })}
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
                  {t('Delete', { ns: 'common' })}
                </MenuItem>
              </Menu>
            </>
          )}
        </TableCell>
        {UserlistHeader.map((y, k) => (
          <TableCell key={k}>
            {typeof props.user[y.prop] == 'boolean' ? (
              props.user[y.prop] ? (
                t('Yes', { ns: 'common' })
              ) : (
                t('No', { ns: 'common' })
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
