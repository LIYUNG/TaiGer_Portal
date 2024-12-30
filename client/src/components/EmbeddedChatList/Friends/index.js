import React from 'react';
import { Box, Typography } from '@mui/material';
import i18next from 'i18next';

import Friend from './Friend';

function Friends(props) {

  if (props.students.length === 0) {
    return (
      <Typography
        sx={{
          marginLeft: '10px',
          marginTop: '10px',
          marginBottom: '10px',
          textAlign: 'center'
        }}
      >
        {i18next.t('No students found')}
      </Typography>
    );
  }
  const friendList = props.students.map((f) => {
    return <Friend key={f._id} data={f} activeId={props.user._id.toString()} />;
  });

  return <Box>{friendList}</Box>;
}

export default Friends;
