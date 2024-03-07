import React from 'react';
import { Box, Typography } from '@mui/material';

import Friend from './Friend';
import { useTranslation } from 'react-i18next';

function Friends(props) {
  const { t } = useTranslation();

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
        {t('No students found')}
      </Typography>
    );
  }
  const friendList = props.students.map((f) => {
    return <Friend key={f.id} data={f} activeId={props.user._id.toString()} />;
  });

  return <Box>{friendList}</Box>;
}

export default Friends;
