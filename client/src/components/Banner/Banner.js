import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Typography } from '@mui/material';

export default function Banner(props) {
  return (
    <Alert
      severity={props.title}
      bg={props.bg ? props.bg : 'primary'}
      onClose={
        props.notification_key
          ? (e) => props.removeBanner(e, props.notification_key)
          : undefined
      }
    >
      <Typography variant="body2" style={{ textAlign: 'left' }}>
        <b className="mx-2">{props.title ? props.title : 'Reminder'}</b>
        {':'}
        {props.text}
        <Link
          to={`${props.path}`}
          style={{ textDecoration: 'none' }}
          className="text-info"
        >
          {props.link_name}
        </Link>{' '}
        {/* <span style={{ float: 'right', cursor: 'pointer' }}>
              {!props.ReadOnlyMode && (
                <BsX
                  size={18}
                  onClick={(e) => props.removeBanner(e, props.notification_key)}
                />
              )}
            </span> */}
      </Typography>
    </Alert>
  );
}
