import React from 'react';
import { Box, Typography } from '@mui/material';

import Friend from './Friend';
import { useTranslation } from 'react-i18next';
import { menuWidth } from '../../../utils/contants';

const Friends = (props) => {
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
                activeId={props.user._id.toString()}
                data={f}
                handleCloseChat={props.handleCloseChat}
                key={f._id}
            />
        );
    });

    return <Box>{friendList}</Box>;
};

export default Friends;
