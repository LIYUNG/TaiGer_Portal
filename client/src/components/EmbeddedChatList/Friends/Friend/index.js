import React from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';

import {
  convertDate_ux_friendly,
  stringAvatar
} from '../../../../Demo/Utils/contants';
import DEMO from '../../../../store/constant';
import { truncateText } from '../../../../Demo/Utils/checking-functions';

const friend = (props) => {
  const { student_id } = useParams();
  return (
    <ListItem key={props.data?._id?.toString()} disablePadding>
      <ListItemButton
        component={LinkDom}
        to={`${DEMO.EMBEDDED_COMMUNICATIONS_LINK(props.data?._id?.toString())}`}
        selected={props.data?._id?.toString() === student_id}
        title={`${props.data.firstname} ${props.data.lastname} ${
          props.data.firstname_chinese ? props.data.firstname_chinese : ''
        }${props.data.lastname_chinese ? props.data.lastname_chinese : ''}`}
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
            <Typography variant="body1" color="text.primary">
              {truncateText(
                `${props.data.firstname} ${props.data.lastname} ${
                  props.data.firstname_chinese
                    ? props.data.firstname_chinese
                    : ''
                }${
                  props.data.lastname_chinese ? props.data.lastname_chinese : ''
                }`,
                15
              )}
            </Typography>
          </Box>
        </ListItemIcon>
        <ListItemText
          sx={{ pr: 4 }}
          primary={convertDate_ux_friendly(
            props.data?.latestCommunication?.createdAt
          )}
        />
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
