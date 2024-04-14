import React from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
  useTheme
} from '@mui/material';

import {
  convertDate_ux_friendly,
  stringAvatar
} from '../../../../Demo/Utils/contants';
import DEMO from '../../../../store/constant';
import { truncateText } from '../../../../Demo/Utils/checking-functions';
import { RxDotFilled } from 'react-icons/rx';

const friend = (props) => {
  const { student_id } = useParams();
  const theme = useTheme();
  return (
    <ListItem
      key={props.data?._id?.toString()}
      sx={{
        backgroundColor: props.data?.latestCommunication?.readBy.includes(
          props.activeId
        )
          ? theme.palette.background.secondary
          : theme.palette.info.main, // Set your desired background color
        '&:hover': {
          backgroundColor: '#a0a0a0' // Set a different color on hover if needed
        }
      }}
      disablePadding
    >
      <ListItemButton
        component={LinkDom}
        to={`${DEMO.COMMUNICATIONS_TAIGER_MODE_LINK(
          props.data?._id?.toString()
        )}`}
        selected={props.data?._id?.toString() === student_id}
        title={`${
          props.data.lastname_chinese ? props.data.lastname_chinese : ''
        }${props.data.firstname_chinese ? props.data.firstname_chinese : ''}${
          props.data.firstname
        } ${props.data.lastname}`}
      >
        <ListItemIcon>
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
            <Typography variant="body1" fontWeight="bold" color="text.primary">
              {truncateText(
                `${
                  props.data.lastname_chinese ? props.data.lastname_chinese : ''
                }${
                  props.data.firstname_chinese
                    ? props.data.firstname_chinese
                    : ''
                } ${props.data.firstname} ${props.data.lastname}`,
                22
              )}
              {props.data?.latestCommunication?.user_id !== props.activeId && (
                <RxDotFilled
                  size={18}
                  title="Not Reply Yet"
                  style={{ marginLeft: '4px' }}
                />
              )}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {convertDate_ux_friendly(
                props.data?.latestCommunication?.createdAt
              )}
            </Typography>
          </Box>
        </ListItemIcon>

        {/* <Box
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
              convertDate_ux_friendly(props.data.latestCommunication.createdAt)}
          </Typography>
        </Box> */}
      </ListItemButton>
    </ListItem>
  );
};

export default friend;
