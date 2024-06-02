import React from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material';

import {
  convertDate_ux_friendly,
  stringAvatar
} from '../../../../Demo/Utils/contants';
import DEMO from '../../../../store/constant';
import { truncateText } from '../../../../Demo/Utils/checking-functions';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useAuth } from '../../../AuthProvider';
import { useTranslation } from 'react-i18next';

const friend = (props) => {
  const { student_id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  // Parse the JSON string into an object
  const parsedObject = JSON.parse(
    props.data.latestCommunication?.message || '{}'
  );
  const lastReply = props.data.latestCommunication?.user_id;

  // Access the first text content
  const firstText =
    parsedObject?.blocks?.length > 0
      ? parsedObject?.blocks[0]?.data?.text?.replace(
          /<\/?[^>]+(>|$)|&[^;]+;?/g,
          ''
        ) || ''
      : '';
  return (
    <ListItem
      key={props.data?._id?.toString()}
      sx={{
        // height: '70px',
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
          <IconButton edge="start">
            <Avatar
              alt={`${props.data.firstname} ${props.data.lastname}`}
              {...stringAvatar(
                `${props.data.firstname} ${props.data.lastname}`
              )}
              // src={props.data.profilePicture} // Add the path to the profile picture
            />
          </IconButton>
          <ListItemText
            primary={
              <Typography style={{ fontWeight: 'bold' }}>
                {truncateText(
                  `${
                    props.data.lastname_chinese
                      ? props.data.lastname_chinese
                      : ''
                  }${
                    props.data.firstname_chinese
                      ? props.data.firstname_chinese
                      : ''
                  } ${props.data.firstname} ${props.data.lastname}`,
                  21
                )}
              </Typography>
            }
            secondary={`${
              user._id.toString() === lastReply
                ? `${t('You', { ns: 'common' })}: `
                : ''
            }${truncateText(firstText, 14)} • ${convertDate_ux_friendly(
              props.data?.latestCommunication?.createdAt
            )}`}
            style={{
              marginLeft: '10px',
              flex: 1
            }}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end">
              {props.data?.latestCommunication?.user_id !== props.activeId && (
                <FiberManualRecordIcon
                  fontSize="small"
                  title="Not Reply Yet"
                  style={{ marginLeft: '4px' }}
                />
              )}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
};

export default friend;
