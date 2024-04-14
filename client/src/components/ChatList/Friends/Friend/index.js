import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RxDotFilled } from 'react-icons/rx';

import {
  convertDate_ux_friendly,
  menuWidth,
  stringAvatar
} from '../../../../Demo/Utils/contants';
import DEMO from '../../../../store/constant';
import { truncateText } from '../../../../Demo/Utils/checking-functions';

const friend = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const handleToChat = () => {
    props.handleCloseChat();
    navigate(
      `${DEMO.COMMUNICATIONS_TAIGER_MODE_LINK(props.data?._id?.toString())}`
    );
  };

  return (
    <MenuItem
      onClick={handleToChat}
      sx={{
        width: menuWidth,
        backgroundColor: props.data?.latestCommunication?.readBy.includes(
          props.activeId
        )
          ? theme.palette.background.secondary
          : theme.palette.info.main, // Set your desired background color
        '&:hover': {
          backgroundColor: '#a0a0a0' // Set a different color on hover if needed
        }
      }}
      title={`${
        props.data.lastname_chinese ? props.data.lastname_chinese : ''
      }${props.data.firstname_chinese ? props.data.firstname_chinese : ''} ${
        props.data.firstname
      } ${props.data.lastname}`}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={`${props.data.firstname} ${props.data.lastname}`}
            {...stringAvatar(`${props.data.firstname} ${props.data.lastname}`)}
            // src={props.data.profilePicture} // Add the path to the profile picture
          />
          <Box
            style={{
              marginLeft: '10px',
              flex: 1
            }}
          >
            <Typography variant="body1" color="text.primary">
              {truncateText(
                `${
                  props.data.lastname_chinese ? props.data.lastname_chinese : ''
                }${
                  props.data.firstname_chinese
                    ? props.data.firstname_chinese
                    : ''
                } ${props.data.firstname} ${props.data.lastname}`,
                18
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box
            style={{
              textAlign: 'right',
              padding: '8px 16px'
            }}
          >
            <Typography variant="body2">
              {props.data?.latestCommunication?.user_id !== props.activeId && (
                <RxDotFilled
                  size={18}
                  title="Not Reply Yet"
                  style={{ marginLeft: '4px' }}
                />
              )}
              {props.data?.latestCommunication?.createdAt &&
                convertDate_ux_friendly(
                  props.data.latestCommunication.createdAt
                )}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider />
    </MenuItem>
  );
};

export default friend;
