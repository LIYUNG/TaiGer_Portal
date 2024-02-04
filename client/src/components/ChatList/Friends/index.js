import React from 'react';
import { Box, Typography } from '@mui/material';

import Friend from './Friend';
import { useTranslation } from 'react-i18next';
import { menuWidth } from '../../../Demo/Utils/contants';

function Friends(props) {
  const { t } = useTranslation();

  if (props.students.length === 0) {
    return (
      <Typography
        sx={{
          width: menuWidth,
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
    return (
      <Friend
        key={f.id}
        data={f}
        activeId={props.user._id.toString()}
        handleCloseChat={props.handleCloseChat}
      />
    );
  });

  return <Box>{friendList}</Box>;
}

export default Friends;
